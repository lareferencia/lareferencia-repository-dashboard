import { HarvestingContent } from './../shared/harvesting-content.model';
import { HarvestingHistory } from './../shared/harvesting-history.model';
import { Harvesting } from './../shared/harvesting.model';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { HarvestingList } from '../shared/harvesting-list.model';

@Injectable({
  providedIn: 'root',
})
export class HarvestingService {
  private baseurl: string = environment.harvestingService;

  constructor(private http: HttpClient) {}

  getHarvestingByAcronym(sourceAcronym: string): Observable<Harvesting> {
    return this.http.get<Harvesting>(`${this.baseurl}${sourceAcronym}`).pipe(
      map((obj) => obj),
      catchError((e) => this.errorHandler(e))
    );
  }

  getHarvestingHistoryByAcronym(sourceAcronym: string, pageNumber: number, pageSize: number): Observable<HarvestingHistory> {
    const params = new HttpParams()
      .append('pageNumber', pageNumber.toString())
      .append('pageSize', pageSize.toString());

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

  getHarvestingLastGoodKnowByAcronym(sourceAcronym: string): Observable<HarvestingContent> {
    return this.http.get<HarvestingContent>(this.baseurl + 'by_acron/' + sourceAcronym + '/lkg').pipe(
      map((obj) => obj),
      catchError((e) => this.errorHandler(e))
    );
  }

  getHarvestingList(): Observable<HarvestingList> {
    return this.http.get<HarvestingList>(`${this.baseurl}list`).pipe(
      map((obj) => obj),
      catchError((e) => this.errorHandler(e))
    );
  }

  private errorHandler(e: any): Observable<any> {
    return throwError(e);
  }
}
