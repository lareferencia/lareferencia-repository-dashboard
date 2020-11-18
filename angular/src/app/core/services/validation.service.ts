import { RecordsFilter } from '../../shared/models/records-filter.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Validation } from '../../shared/models/validation.model';
import { Occurence } from '../../shared/models/occurrence.model';
import { Records } from '../../shared/models/records.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  private baseurl: string = environment.validationService;

  constructor(private http: HttpClient) { }

  getValidationResultsByHarvestingID(sourceAcronym: string, harvestingID: number): Observable<Validation> {
    return this.http.get<Validation>(`${this.baseurl}${sourceAcronym}/${harvestingID}`).pipe(
      map(obj => obj),
      catchError(e => this.errorHandler(e))
    );
  }

  getValidOccurrencesByHarvestingIDRuleID(sourceAcronym: string, harvestingID: number, ruleID: number): Observable<Occurence[]> {
    return this.http.get<Occurence>(`${this.baseurl}${sourceAcronym}/${harvestingID}/valid_occrs/${ruleID}`).pipe(
      map(obj => obj),
      catchError(e => this.errorHandler(e))
    );
  }

  getInValidOccurrencesByHarvestingIDRuleID(sourceAcronym: string, harvestingID: number, ruleID: number): Observable<Occurence[]> {
    return this.http.get<Occurence>(`${this.baseurl}${sourceAcronym}/${harvestingID}/invalid_occrs/${ruleID}`).pipe(
      map(obj => obj),
      catchError(e => this.errorHandler(e))
    );
  }

  getRecordsByHarvestingIDInvalidRuleID(sourceAcronym: string, harvestingID: number, ruleID: number, pageNumber: number, pageSize: number): Observable<Records> {
    const params = new HttpParams()
      .append('invalid_rules', ruleID.toString())
      .append('pageNumber', pageNumber.toString())
      .append('pageSize', pageSize.toString());

    return this.http
      .get<Records>(`${this.baseurl}${sourceAcronym}/${harvestingID}/records`, { params })
      .pipe(
        map((obj) => obj),
        catchError((e) => this.errorHandler(e))
      );
  }

  getRecordsByHarvestingIDValidRuleID(sourceAcronym: string, harvestingID: number, ruleID: number, pageNumber: number, pageSize: number): Observable<Records> {
    const params = new HttpParams()
      .append('valid_rules', ruleID.toString())
      .append('pageNumber', pageNumber.toString())
      .append('pageSize', pageSize.toString());

    return this.http
      .get<Records>(`${this.baseurl}${sourceAcronym}/${harvestingID}/records`, { params })
      .pipe(
        map((obj) => obj),
        catchError((e) => this.errorHandler(e))
      );
  }

  getRecordsByHarvestingIDFilter(sourceAcronym: string, harvestingID: number, filter: RecordsFilter): Observable<Records> {

    let params = new HttpParams()
      .append('pageNumber', filter.pageNumber.toString())
      .append('pageSize', filter.pageSize.toString());

    if (filter.oaiIdentifier != null && filter.oaiIdentifier != '')
      params = params.append('oai_identifier', filter.oaiIdentifier);

    if (filter.isValid != null)
      params = params.append('is_valid', filter.isValid.toString());

    if (filter.isTransformed != null)
      params = params.append('is_transformed', filter.isTransformed.toString());

    if (filter.validRules != null)
      params = params.append(
        'valid_rules',
        filter.validRules.map((x) => x.ruleID).join(',')
      );

    if (filter.invalidRules != null)
      params = params.append(
        'invalid_rules',
        filter.invalidRules.map((x) => x.ruleID).join(',')
      );

    return this.http
      .get<Records>(`${this.baseurl}${sourceAcronym}/${harvestingID}/records`, { params })
      .pipe(
        map((obj) => obj),
        catchError((e) => this.errorHandler(e))
      );
  }

  errorHandler(e: any): Observable<any> {
    return throwError(e);
  }
}
