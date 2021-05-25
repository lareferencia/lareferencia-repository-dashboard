import { Rule } from './rule.model';

export interface Validation{
  size: number;
  transformedSize: number;
  validSize: number;
  rulesByID: Rule[];
}