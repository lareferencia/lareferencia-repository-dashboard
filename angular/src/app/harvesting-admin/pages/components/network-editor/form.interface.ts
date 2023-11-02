export interface FormData {
    data: FormFieldJSON[];
}

export interface FormFieldJSON {
    name:         string;
    type:         Type;
    value?:       string;
    interface?:   string;
    minLength?:   number;
    maxLength?:   number;
    title:        string;
    description?: string;
    validators?:  ValidatorsJSON;
    default?:     string;
    options?:     Option[];
    items?:       Items;
}

export interface Items {
    type:  Type;
    title: string;
}

export enum Type {
    Array = "array",
    Boolean = "boolean",
    String = "string",
}

export interface Option {
    label: string;
    value: string;
}

export interface ValidatorsJSON {
    required: boolean;
}
