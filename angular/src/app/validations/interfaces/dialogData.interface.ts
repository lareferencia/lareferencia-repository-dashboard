import { Record } from "src/app/shared/models/record.model";

export interface DialogData {
  record: Record;
  acronym: string;
}

export interface DialogDataTable{
  acronym: string,
  harvestingID: number,
  ruleID: number,
  name: string,
}