export enum PageComponent {
  Index = 'index',
  Slack = 'slack',
  CodeOfConduct = 'code-of-conduct',
}

export interface Event {
  title: string;
  date: string;
  id: string;
  description: string;
  enddate: string;
  status: string;
  logo: string;
  link: string;
  venue: {
    name: string;
    address: string;
    id: string;
  };
}
