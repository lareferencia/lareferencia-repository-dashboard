import { RecordsFilter } from './../shared/records-filter.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Validation } from '../shared/validation.model';
import { Occurence } from '../shared/occurrence.model';
import { Records } from '../shared/records.model';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  private baseurl: string = 'http://200.130.45.74:8082/api/v2/validation/';

  constructor(private http: HttpClient) { }

  getValidationResultsByHarvestingID(harvestingID: number): Observable<Validation> {
    return this.http.get<Validation>(`${this.baseurl}by_id/${harvestingID}`).pipe(
      map(obj => obj),
      catchError(e => this.errorHandler(e))
    );
  }

  getValidOccurrencesByHarvestingIDRuleID(harvestingID: number, ruleID: number): Observable<Occurence[]> {
    return this.http.get<Occurence>(`${this.baseurl}by_id/${harvestingID}/valid_occrs/${ruleID}`).pipe(
      map(obj => obj),
      catchError(e => this.errorHandler(e))
    );
  }

  getInValidOccurrencesByHarvestingIDRuleID(harvestingID: number, ruleID: number): Observable<Occurence[]> {
    return this.http.get<Occurence>(`${this.baseurl}by_id/${harvestingID}/invalid_occrs/${ruleID}`).pipe(
      map(obj => obj),
      catchError(e => this.errorHandler(e))
    );
  }

  getRecordsByHarvestingIDInvalidRuleID(harvestingID: number, ruleID: number, pageNumber: number, pageSize: number): Observable<Records> {
    const params = new HttpParams()
      .append('invalid_rules', ruleID.toString())
      .append('pageNumber', pageNumber.toString())
      .append('pageSize', pageSize.toString());

    return this.http
      .get<Records>(`${this.baseurl}by_id/${harvestingID}/records`, { params })
      .pipe(
        map((obj) => obj),
        catchError((e) => this.errorHandler(e))
      );
  }

  getRecordsByHarvestingIDValidRuleID(harvestingID: number, ruleID: number, pageNumber: number, pageSize: number): Observable<Records> {
    const params = new HttpParams()
      .append('valid_rules', ruleID.toString())
      .append('pageNumber', pageNumber.toString())
      .append('pageSize', pageSize.toString());

    return this.http
      .get<Records>(`${this.baseurl}by_id/${harvestingID}/records`, { params })
      .pipe(
        map((obj) => obj),
        catchError((e) => this.errorHandler(e))
      );
  }

  getRecordsByHarvestingIDFilter(harvestingID: number, filter: RecordsFilter): Observable<Records> {

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
      .get<Records>(`${this.baseurl}by_id/${harvestingID}/records`, { params })
      .pipe(
        map((obj) => obj),
        catchError((e) => this.errorHandler(e))
      );
  }

  errorHandler(e: any): Observable<any> {
    return throwError(e);
  }
}
