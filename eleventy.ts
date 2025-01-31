import { Event } from "@components/IndexPage.11ty";
import { PageComponent } from "src/types/commond";

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
