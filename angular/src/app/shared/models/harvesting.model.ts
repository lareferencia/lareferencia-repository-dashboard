export interface Harvesting {
  acronym: string;
  attributes: Atributes;
  id: number;
  institutionAcronym: string;
  institutionName: string;
  name: string;
  public: boolean;
}

interface Atributes {
  "@class": string;
  country: string ;
  email: string;
  phone: string;
  repository_id: string;
  software: string;
  stats_source_id: string;
  type: string;
  url: string;
}
