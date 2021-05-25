import { ProcessStatus } from '../enums/process-status';

export interface ProcessInfo {
  description: string;
  status?: ProcessStatus;
}
