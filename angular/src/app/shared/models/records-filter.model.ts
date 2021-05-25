import { Rule } from './rule.model';

export interface RecordsFilter {
  isTransformed?: boolean;
  isValid?: boolean;
  oaiIdentifier?: string;
  invalidRules?: Rule[];
  validRules?: Rule[];
  pageNumber?: number;
  pageSize?: number;
}
