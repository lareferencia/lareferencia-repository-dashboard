import { TimeUnit } from './../enums/time-unit';
export interface DateFilter {
  startDate: Date;
  endDate: Date;
  timeUnit: TimeUnit;
}
