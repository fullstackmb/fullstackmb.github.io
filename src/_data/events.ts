import EleventyFetch from '@11ty/eleventy-fetch';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { marked } from 'marked';
import { sync as ical, VEvent } from 'node-ical';
import { Event } from 'src/types/common';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

const DEFAULT_LOGO = 'https://secure.meetupstatic.com/photos/event/3/8/9/b/highres_519914491.jpeg';
const LOGO_BY_TITLE: Record<string, string> = {
  'Full Stack Code and Coffee': 'https://secure.meetupstatic.com/photos/event/1/9/8/b/highres_479406539.webp?w=640',
};

// node-ical types some fields (e.g. url) as plain strings, but the parser actually
// returns { val, params } objects for iCal properties with parameters (e.g. URL;VALUE=URI:...).
const icalValue = (value: unknown): string => {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && 'val' in value) return String((value as { val: unknown }).val);
  return '';
};

const sanitizeEventDescription = async (event: Event) => {
  const sanitizedDescription = DOMPurify.sanitize(await marked(event.description));
  return { ...event, description: sanitizedDescription };
};

export default async function () {
  const icalUrl = process.env.EVENTS_ICAL_URL || 'https://www.meetup.com/fullstackmb/events/ical/';

  try {
    const content = await EleventyFetch(icalUrl, {
      duration: '1h',
      type: 'text',
      verbose: true,
    });

    const parsed = ical.parseICS(content);
    const events = Object.values(parsed)
      .filter((component): component is VEvent => component.type === 'VEVENT')
      .sort((a, b) => a.start.getTime() - b.start.getTime())
      .map((event) => {
        const title = icalValue(event.summary);
        return {
          id: event.uid?.match(/^event_(.+)@meetup\.com$/)?.[1] ?? event.uid ?? '',
          title,
          status: event.status ?? '',
          link: icalValue(event.url),
          logo: LOGO_BY_TITLE[title] ?? DEFAULT_LOGO,
          description: icalValue(event.description),
          date: event.start?.toISOString() ?? '',
          enddate: event.end?.toISOString() ?? '',
          venue: { id: '', name: '', address: '' },
        };
      });

    return await Promise.all(events.map(sanitizeEventDescription));
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}
