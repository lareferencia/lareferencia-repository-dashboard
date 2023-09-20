import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError, map } from 'rxjs/operators';
import { BrokerEvents } from './../../shared/models/broker-events.model';
import { environment } from './../../../environments/environment';
import { BrokerEventsFilter } from './../../shared/models/broker-events-filter.model';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root',
})
export class BrokerService {
  private baseurl: string;

  constructor(private http: HttpClient, appConfig: AppConfigService) {
    this.baseurl = appConfig.getBrokerModuleData().endpoints.brokerService;
  }

  getEventsByAcronym(sourceAcronym: string, filter: BrokerEventsFilter): Observable<BrokerEvents> {
    let params = new HttpParams()
      .append('pageNumber', filter.pageNumber.toString())
      .append('pageSize', filter.pageSize.toString());

    if (filter.oaiIdentifier != null && filter.oaiIdentifier != '')
      params = params.append('oai_identifier', filter.oaiIdentifier.trim());

    if (filter.topic != null && filter.topic != '')
      params = params.append('topic', filter.topic.trim());

    return this.http
      .get<BrokerEvents>(`${this.baseurl}${sourceAcronym}`, { params })
      .pipe(
        map((obj) => obj),
        catchError((e) => this.errorHandler(e))
      );
  }

  private errorHandler(e: any): Observable<any> {
    return throwError(e);
  }
}
