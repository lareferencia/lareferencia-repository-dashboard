import { UserInfo } from 'src/app/shared/models/user-info.model';
import { environment } from './../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user.model';

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

  getUser(userName: string): Observable<UserInfo> {
    return this.http.get<UserInfo>(`${this.baseurl}user/self/${userName}`).pipe(
      map((obj) => obj),
      catchError(this.errorHandler)
    );
  }

  updateUser(userName: string, userInfo: UserInfo): Observable<boolean> {
    return this.http
      .put<boolean>(`${this.baseurl}user/self/${userName}/update`, userInfo)
      .pipe(
        map((obj) => obj),
        catchError(this.errorHandler)
      );
  }

  getRegularUserList(): Observable<User[]> {
    return this.http.get<string[]>(`${this.baseurl}user/admin/list`).pipe(
      map((obj) => obj.map((value) => ({ username: value }))),
      catchError(this.errorHandler)
    );
  }

  deleteUser(userName: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseurl}user/admin/${userName}/delete`).pipe(
      map((obj) => obj),
      catchError(this.errorHandler)
    );
  }

  private errorHandler(error: HttpErrorResponse) {
    return throwError(error);
  }
}
