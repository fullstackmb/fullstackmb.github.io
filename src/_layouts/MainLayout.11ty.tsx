import { IndexPage } from '@components/IndexPage.11ty';
import { ViewProps } from '../../eleventy';
import { SlackPage } from '@components/SlackPage.11ty';
import { Header } from '@components/partials/common/Header';
import { Footer } from '@components/partials/common/Footer';
import { ContentPage } from '@components/ContentPage.11ty';
import { SeoMeta } from '@components/partials/common/SeoMeta';
import { PageComponent } from 'src/types/common';

export const MainLayout = ({ content, title, events, version, component }: ViewProps): JSX.Element => {

  const getComponent = () => {
    switch (component) {
      case PageComponent.Index:
        return <IndexPage events={events} />;
      case PageComponent.Slack:
        return <SlackPage version={version} />;
      default:
        return <ContentPage content={content} />;
    }
  };

  return (
    <html lang="en">
       
      <head>
        <meta charSet="utf-8" />
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <SeoMeta component={component} />
        <title>{title}</title>
        <link rel="stylesheet" type="text/css" href="/src/styles/globals.css" />
       
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Montserrat:400,700" type="text/css" />
      </head>
      <body>
        <Header />
        {getComponent()}

        <Footer version={version} />
        <script type="module" src={`/assets/client-bundle.js?v=${Date.now()}`}></script>
      </body>
    </html>
  );
}

export const render = MainLayout;
