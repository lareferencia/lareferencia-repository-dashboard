import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from './../../../environments/environment';
import { GroupInfo } from 'src/app/shared/models/group-info.model';

@Injectable({
  providedIn: 'root',
})
export class ManageGroupsService {
  private baseurl: string = environment.securityService;
  constructor(private http: HttpClient) {}

  getGroup(groupName: string): Observable<GroupInfo> {
    return this.http.get<GroupInfo>(`${this.baseurl}group/admin/${groupName}`).pipe(
      map((obj) => obj),
      catchError(this.errorHandler)
    );
  }

  createGroup(groupInfo: GroupInfo): Observable<boolean> {
    return this.http
      .post<boolean>(`${this.baseurl}group/admin/create/`, groupInfo)
      .pipe(
        map((obj) => obj),
        catchError(this.errorHandler)
      );
  }

  updateGroup(groupName: string, groupInfo: GroupInfo): Observable<boolean> {
    return this.http
      .put<boolean>(`${this.baseurl}group/admin/${groupName}/update`, groupInfo)
      .pipe(
        map((obj) => obj),
        catchError(this.errorHandler)
      );
  }

  private errorHandler(error: HttpErrorResponse) {
    return throwError(error);
  }
}
