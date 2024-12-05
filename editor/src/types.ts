export type EventData = {
  id: string;
  code: string;
  description: string | null;
  image: string | null;
  name: string;
  max_cols: number;
  max_rows: number;
};

export type EventMeta = {
  date_create: string;
  date_update: string;
  user: string;
};

export type EventsRespose = Array<EventData & EventMeta>;

export type EventStep = unknown; // TODO

export type EventDetailsResponse = {
  event: EventData & EventMeta;
  steps: EventStep[];
};
