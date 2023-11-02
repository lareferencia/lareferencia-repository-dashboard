import { FormlyFieldConfig } from "@ngx-formly/core";

export function minItemsValidationMessage(error: any, field: FormlyFieldConfig) {
    return `should NOT have fewer than ${field.props.minItems} items`;
  }
  
  export function maxItemsValidationMessage(error: any, field: FormlyFieldConfig) {
    return `should NOT have more than ${field.props.maxItems} items`;
  }
  
  export function minLengthValidationMessage(error: any, field: FormlyFieldConfig) {
    return `should NOT be shorter than ${field.props.minLength} characters`;
  }
  
  export function maxLengthValidationMessage(error: any, field: FormlyFieldConfig) {
    return `should NOT be longer than ${field.props.maxLength} characters`;
  }
  
  export function minValidationMessage(error: any, field: FormlyFieldConfig) {
    return `should be >= ${field.props.min}`;
  }
  
  export function maxValidationMessage(error: any, field: FormlyFieldConfig) {
    return `should be <= ${field.props.max}`;
  }
  
  export function multipleOfValidationMessage(error: any, field: FormlyFieldConfig) {
    return `should be multiple of ${field.props.step}`;
  }
  
  export function exclusiveMinimumValidationMessage(error: any, field: FormlyFieldConfig) {
    return `should be > ${field.props.step}`;
  }
  
  export function exclusiveMaximumValidationMessage(error: any, field: FormlyFieldConfig) {
    return `should be < ${field.props.step}`;
  }
  
  export function constValidationMessage(error: any, field: FormlyFieldConfig) {
    return `should be equal to constant "${field.props.const}"`;
  }
  
  export function typeValidationMessage({ schemaType }: any) {
    return `should be "${schemaType[0]}".`;
  }

  