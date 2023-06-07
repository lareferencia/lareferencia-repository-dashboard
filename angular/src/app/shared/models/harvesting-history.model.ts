import { HarvestingContent } from './harvesting-content.model';

export interface HarvestingHistory {
  content: HarvestingContent[];
  totalElements: number;
}
