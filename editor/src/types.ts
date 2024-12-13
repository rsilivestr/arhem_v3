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

export type GameEvent = EventData & EventMeta;

export type EventsRespose = Array<GameEvent>;

export type EventStep = unknown; // TODO

export type EventDetailsResponse = {
  event: GameEvent;
  steps: EventStep[];
};

export type StepData = {
  id: string;
  event_id: string;
  name: string;
  code: string;
  text: string;
  image: string | null;
  start: boolean;
  col: number;
  row: number;
};

export type StepMeta = {
  date_create: string;
  date_update: string;
  user: string;
};

export type GameStep = StepData & StepMeta;
