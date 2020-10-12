export interface Rule {
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
