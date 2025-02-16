import { formatDate } from 'src/lib';
import { Event } from 'src/types/common';
import { Hero } from './partials/main-page/Hero';
import { Sponsors } from './partials/main-page/Sponsors';
// import { Friends } from "./partials/main-page/Friends";

export function IndexPage({ events }: { events: Event[] }) {
  const nextEvent = events[0];
  const upcomingEvents = events.slice(1);

  if (!events || events.length === 0) {
    return <div>No events available.</div>;
  }

  return (
    <div>
    <Hero 
      text="Serverless enthusiasts crafting the future with lambdas and microservices." 
      title="Full Stack MB" 
    />

    <section class="section bg-gray next-event">
      <div class="container">
        <h2 class="section-title">Next Event</h2>
        <div class="event-card">
          <div class="event-grid">
            <div class="event-content">
              <h3>{nextEvent.title}</h3>
              <p>
                {nextEvent.description}
              </p>
              <div style={{ marginTop: '24px' }}>
                <div class="event-meta">
                  <i class="fa fa-calendar"></i>
                  <span>{formatDate(nextEvent.date)}</span>
                </div>
                <div class="event-meta">
                  <i class="fa fa-map-marker"></i>
                  <span>{nextEvent.venue.name}</span>
                </div>
              </div>
              <a href={nextEvent.link} target="_blank"  class="button button-primary" style={{ marginTop: '24px' }}>
                Count me in!
              </a>
            </div>
            <div class="event-image-container">
              <img
                src={nextEvent.logo}
                alt="Event banner"
                class="rounded"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section bg-white">
      <div class="container">
        <h2 class="section-title">Upcoming Events</h2>
        <div class="events-grid">
            {upcomingEvents.map((event, i) => (
            <div class="event-card-small">
              <img
                src={event.logo}
                alt={event.title}
                width={300}
                height={200}
                class="w-full"
              />
              <div class="event-card-content">
                <h3>{event.title}</h3>
                <p>{formatDate(event.date)}</p>
                <a href={event.link} target="_blank" class="button button-primary upcoming-event-button">
                  View
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <Sponsors />

    {/* <Friends /> */}

  </div>
  )
}