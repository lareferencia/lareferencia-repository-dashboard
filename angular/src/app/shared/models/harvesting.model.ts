import { HarvestingAttributes } from "./harvesting-attributes.model";

export interface Harvesting {
  acronym: string;
  attributes: HarvestingAttributes;
  id: number;
  institutionAcronym: string;
  institutionName: string;
  name: string;
  public: boolean;
  lkgHarvestedSize: number;
  lkgValidSize: number;
  lkgTransformedSize: number;
}
