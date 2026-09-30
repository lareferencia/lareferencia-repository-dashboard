import { HarvestingContent } from '../../shared/models/harvesting-content.model';
import { HarvestingHistory } from '../../shared/models/harvesting-history.model';
import { Harvesting } from '../../shared/models/harvesting.model';
import { EMPTY, Observable, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { expand, map, catchError, reduce } from 'rxjs/operators';
import { HarvestingList } from '../../shared/models/harvesting-list.model';

import { AppConfigService } from './app-config.service';


@Injectable({
  providedIn: 'root',
})
export class HarvestingService {

  private baseurl: string;

  constructor(private http: HttpClient, private appConfig: AppConfigService) {
    this.baseurl = `${this.appConfig.getApiBaseUrl()}/dashboard/harvesting/source/`;
  }

  getHarvestingByAcronym(sourceAcronym: string): Observable<Harvesting> {
    return this.http.get<Harvesting>(`${this.baseurl}${sourceAcronym}`, { withCredentials: true }).pipe(
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
        { params, withCredentials: true }
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
        `${this.baseurl}${sourceAcronym}/history/${this.apiDate(startDate)}/${this.apiDate(endDate)}`,
        { params, withCredentials: true }
      )
      .pipe(
        map((obj) => obj),
        catchError((e) => this.errorHandler(e))
      );
  }

  getHarvestingLastGoodKnowByAcronym(sourceAcronym: string): Observable<HarvestingContent> {
    return this.http.get<HarvestingContent>(`${this.baseurl}${sourceAcronym}/lkg`, { withCredentials: true })
    .pipe(
      map((obj) => obj),
      catchError((e) => this.errorHandler(e))
    );
  }

  getAllHarvestings(): Observable<Harvesting[]> {
    const pageSize = 100;
    return this.getHarvestingPage(0, pageSize).pipe(
      expand(page => page.content.length > 0 && (page.number + 1) * page.size < page.totalElements
        ? this.getHarvestingPage(page.number + 1, pageSize)
        : EMPTY),
      reduce((all, page) => all.concat(page.content), [] as Harvesting[]),
    );
  }

  private getHarvestingPage(page: number, size: number): Observable<HarvestingList> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<HarvestingList>(`${this.baseurl}list`, { params, withCredentials: true });
  }

  private apiDate(date: Date): string {
    const pad = (value: number) => value.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}Z`;
  }

  private errorHandler(e: any): Observable<any> {
    return throwError(e);
  }
}
