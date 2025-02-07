import EleventyFetch from '@11ty/eleventy-fetch';
import { marked } from 'marked';
import { Event } from 'src/types/common';

export default async function () {
  const eventsApiUrl = 'https://fullstackmbapi.azurewebsites.net/api/events';

  try {
    const data = await EleventyFetch(eventsApiUrl, {
      duration: '1h', // Cache for 1 hour
      type: 'json',
      verbose: true
    });

    if (!data) {
      console.error('No data received from API');
      return [];
    }

    if (!Array.isArray(data.events)) {
      console.log('Data is not an array, looking for events property');
      if (data.events && Array.isArray(data.events)) {
        return data.events.map((event: Event) => ({
          ...event,
          description: marked(event.description),
        }));
      }
      console.error('Could not find valid events array in response');
      return [];
    }

    return data.events.map((event: Event) => ({
      ...event,
      description: marked(event.description),
    })); 
  } catch (error) {
    console.error('Error fetching events:', error);
    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return [];
  }
}