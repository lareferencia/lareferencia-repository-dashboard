import { HarvestingContent } from '../../shared/models/harvesting-content.model';
import { HarvestingHistory } from '../../shared/models/harvesting-history.model';
import { Harvesting } from '../../shared/models/harvesting.model';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError, tap } from 'rxjs/operators';
import { HarvestingList } from '../../shared/models/harvesting-list.model';

import { AppConfigService } from './app-config.service';


@Injectable({
  providedIn: 'root',
})
export class HarvestingService {

  private baseurl: string;

  constructor(private http: HttpClient, private appConfig: AppConfigService) {
    this.baseurl = this.appConfig.getHistoricModuleData().endpoints.harvestingService;
  }

  getHarvestingByAcronym(sourceAcronym: string): Observable<Harvesting> {
    return this.http.get<Harvesting>(`${this.baseurl}${sourceAcronym}`).pipe(
      map((obj) => obj),
      catchError((e) => this.errorHandler(e))
    );
  }

  getHarvestingHistoryByAcronym(sourceAcronym: string, page: number, size: number, sortField?: string, sortOrder?: number): Observable<HarvestingHistory> {
    let params = new HttpParams()
      .append('page', page.toString())
      .append('size', size.toString());
      
    if (sortField && sortOrder) {
        let sortValue: string;
        sortOrder === 1 ? sortValue = `${sortField},asc` : sortValue = `${sortField},desc`
        params = params.append('sort', sortValue);
    }
    return this.http
      .get<HarvestingHistory>(
        `${this.baseurl}${sourceAcronym}/history`,
        { params }
      )
      .pipe(
        map((obj) => obj),
        catchError((e) => this.errorHandler(e))
      );
  }

  getHarvestingHistoryByAcronymAndDate(sourceAcronym: string, pageNumber: number, pageSize: number, startDate: Date, endDate: Date): Observable<HarvestingHistory> {
    const params = new HttpParams()
    .append('size', pageSize.toString())
    .append('page', pageNumber.toString());

    return this.http
      .get<HarvestingHistory>(
        `${this.baseurl}${sourceAcronym}/history/${startDate.toISOString()}/${endDate.toISOString()}`,
        { params }
      )
      .pipe(
        map((obj) => obj),
        catchError((e) => this.errorHandler(e))
      );
  }

  getHarvestingLastGoodKnowByAcronym(sourceAcronym: string): Observable<HarvestingContent> {
    return this.http.get<HarvestingContent>(`${this.baseurl}${sourceAcronym}/lkg`)
    .pipe(
      map((obj) => obj),
      catchError((e) => this.errorHandler(e))
    );
  }

  getHarvestingList(): Observable<HarvestingList> {
    return this.http.get<HarvestingList>(`${this.baseurl}list`)
    // .pipe(
    //   map((obj) => obj),
    //   catchError((e) => this.errorHandler(e))
    // );
  }

  getMetadataXml(sourceAcronym: string, recordID: string): Observable<string> {
    return this.http
      .get<string>(`${this.baseurl}${sourceAcronym}/record/${recordID}`, <Object>{ responseType: 'text' })
      .pipe(
        map((obj) => obj),
        catchError((e) => this.errorHandler(e))
      );
  }

  private errorHandler(e: any): Observable<any> {
    return throwError(e);
  }
}
