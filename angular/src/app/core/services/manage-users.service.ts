import { UserInfo } from 'src/app/shared/models/user-info.model';
import { environment } from './../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ManageUsersService {
  private baseurl: string = environment.securityService;

  constructor(private http: HttpClient) {}

  createUser(userInfo: UserInfo): Observable<boolean> {
    return this.http
      .post<boolean>(`${this.baseurl}user/admin/create/`, userInfo)
      .pipe(
        map((obj) => obj),
        catchError(this.errorHandler)
      );
  }

  private errorHandler(error: HttpErrorResponse) {
    return throwError(error);
  }
}
