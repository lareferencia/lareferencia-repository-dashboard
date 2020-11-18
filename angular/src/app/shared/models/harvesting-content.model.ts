export interface HarvestingContent {
  deleted: boolean;
  endTime: Date;
  harvestedSize: number;
  id: number;
  startTime: Date;
  status: string;
  transformedSize: number;
  validSize: number;
  invalidRecords: number;
}
