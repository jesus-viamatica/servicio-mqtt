
export interface Message {
  source: string;
  destination: string;
  operation: string;
  verb: string;
  path: string;
  body: Body;
  feedback: Feedback;
}

export interface Feedback {
  topic: string;
  source: string;
  destination: string;
  operation: string;
  verb: string;
  path: string;
  body: any;
}

