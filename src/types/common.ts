export enum PageComponent {
  Index = 'index',
  Slack = 'slack',
  CodeOfConduct = 'code-of-conduct',
}

interface Venue {
  id: string;
  name: string;
  address: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  enddate: string;
  link: string;
  logo: string;
  status: 'upcoming' | 'past' | 'cancelled';
  venue: Venue;
}
