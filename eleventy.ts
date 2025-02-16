import { PageComponent, Event } from "src/types/common";

export type ViewProps = {
  content: string;
  title: string;
  events?: Event[];
  version?: {
    version: string;
    hash: string;
  };
  component?: PageComponent;
};
