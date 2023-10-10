import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppConfigService } from './app-config.service';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { NetworksList } from 'src/app/shared/models/harvesting-admin.model';



@Injectable({
    providedIn: 'root',
})
  export class HarvestingAdminService {
  
    private baseurl: string;
  
    constructor( private http: HttpClient, private appConfig: AppConfigService) 
    { this.baseurl = this.appConfig.getHarvestingAdminModuleData().endpoints.networkService }



    getNetworkList(filter, sortField?: string, sortOrder?: number): Observable<NetworksList> {
      let params = new HttpParams()
      .append('pageNumber', filter.pageNumber.toString())
      .append('pageSize', filter.pageSize.toString());

      if (filter.acronym != null && filter.acronym != '')
      params = params.append('acronym', filter.acronym);

        if (sortField && sortOrder) {
          let sortValue: string;
          sortOrder === 1 ? sortValue = `${sortField},asc` : sortValue = `${sortField},desc`
          params = params.append('sort', sortValue);
      }

      
        return this.http
        .get<NetworksList>(this.baseurl, { params }).pipe(
          map((obj) => obj),
          catchError((e) => this.errorHandler(e))
        );
      }
    private errorHandler(e: any): Observable<NetworksList> {
      return throwError(e);
    }
}


