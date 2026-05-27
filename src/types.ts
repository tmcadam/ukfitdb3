export interface Publication {
  id: string;
  title: string;
  year: string;
  reference: string;
  authors: string;
  keywords: string;
  format: string;
}

export enum Display {
  HOME = 'HOME',
  RESULTS = 'RESULTS',
}
