export interface NetworksList {
    totalElements: number;
    totalPages:    number;
    pageNumber:    number;
    pageSize:      number;
    networks:      Network[];
}

export interface Network {
    networkID:          number;
    institutionAcronym: string;
    acronym:            string;
    name:               string;
    institution:        string;
    attributes:         { [key: string]: null | string };
    running:            any[];
    queued:             any[];
    scheduled:          string[];
    snapshotID:         number;
    datestamp:          Date;
    size:               number;
    validSize:          number;
    transformedSize:    number;
    lgkSnapshotID:      number;
    lgkSnapshotDate:    Date;
    lgkSize:            number;
    lgkValidSize:       number;
    lgkTransformedSize: number;
    lstSnapshotID:      number;
    lstSnapshotDate:    Date;
    lstSnapshotStatus:  LstSnapshotStatus;
    lstIndexStatus:     LstIndexStatus;
    lstSize:            number;
    lstValidSize:       number;
    lstTransformedSize: number;
}

export enum LstIndexStatus {
    Failed = "FAILED",
    Indexed = "INDEXED",
    Unknown = "UNKNOWN",
}

export enum LstSnapshotStatus {
    HarvestingFinishedError = "HARVESTING_FINISHED_ERROR",
    Valid = "VALID",
}
