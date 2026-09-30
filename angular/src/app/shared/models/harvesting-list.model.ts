import { Harvesting } from './harvesting.model';

export interface HarvestingList {
  content: Harvesting[];
  totalElements: number;
  number: number;
  size: number;
}
