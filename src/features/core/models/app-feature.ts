export interface AppFeature {
  id: string;
  name: string;
  description: string;
  details: string;
  factors: string;
  minHours: number;
  maxHours: number;
  alwaysActive?: boolean;
}
