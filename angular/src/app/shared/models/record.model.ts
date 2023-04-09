import { Rule } from './rule.model';

export interface Record {
  id: string;
  identifier: string;
  isTransformed: boolean;
  isValid: boolean;
  invalidOccurrencesByRuleID: Map<String, String[]>;
  validOccurrencesByRuleID: Map<String, String[]>;
  invalidRulesID: string[];
  validRulesID: string[];
  rules: Rule[];
  metadataPrefix: string;
  origin: string;
}
