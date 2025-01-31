import { PageComponent } from 'src/types/common';

interface PageMeta {
  title: string;
  description: string;
  image: string;
  type: string;
  route: string;
}

interface SeoConfig {
  baseUrl: string;
  defaultMeta: PageMeta;
  pages: {
    [key: string]: PageMeta;
  };
}

const defaultMeta = {
  title: 'Full Stack MB – A Community for Developers in Manitoba',
  description: 'Join Full Stack MB, a developer community in Manitoba. Network, share knowledge, and collaborate with fellow tech professionals.',
  image: '/images/social/index.png',
  type: 'website',
  route: '/',
};

export const seoConfig: SeoConfig = {
  baseUrl: 'https://fullstackmb.ca/',
  defaultMeta,
  pages: {
    [PageComponent.Index]: defaultMeta,
    [PageComponent.Slack]: {
      title: 'Join Our Slack Community | Full Stack MB',
      description: 'Connect with 280+ tech professionals in Manitoba. Join our Slack community to network, share knowledge, and stay updated.',
      image: '/images/social/slack.png',
      type: 'website',
      route: '/slack',
    },
    [PageComponent.CodeOfConduct]: {
      title: 'Code of Conduct | Full Stack MB',
      description: 'Our commitment to providing a friendly, safe and welcoming environment for all participants. Learn about our community guidelines and expectations.',
      image: '/images/social/code-of-conduct.png',
      type: 'website',
      route: '/code-of-conduct',
    }
  }
}; 