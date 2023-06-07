export interface Rule {
  acronym: string;
  ruleID: number;
  name: string;
  description: string;
  quantifier: string;
  mandatory: boolean;
  validCount: number;
  invalidCount: number;
  conformity: number;
  harvestingID: number;
}
