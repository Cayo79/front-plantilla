import { Injectable } from '@angular/core';
import { AssignedHall } from '../apps/models/assignedhall';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DatosApi } from './datos_api';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssignedhallService {

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  private urlEndPoint = DatosApi.urlBaseApi + 'assignedhall/';
  constructor(private http: HttpClient) { }

  getReservas() {
    return this.http.get(this.urlEndPoint).pipe(
      map((Response: any) => {
        // tslint:disable-next-line:no-unused-expression
        (Response.content as AssignedHall[]);
        return Response;
      })
    );
  }

  createReserva(reserva: AssignedHall): Observable<any> {
    return this.http
      .post<any>(this.urlEndPoint, reserva, { headers: this.httpHeaders })
      .pipe(
        catchError(e => {
          return throwError(e);
        })
      );
  }

  updateReserva(reserva: AssignedHall): Observable<any> {
    return this.http
      .put(this.urlEndPoint + reserva.id, reserva, { headers: this.httpHeaders })
      .pipe(
        catchError(e => {
          return throwError(e);
        })
      );
  }

  deleteReserva(id: number): Observable<any> {
    return this.http
      .delete(this.urlEndPoint + id, { headers: this.httpHeaders })
      .pipe(
        catchError(e => {
          return throwError(e);
        })
      );
  }

  validateReserva(reserva: AssignedHall): Observable<any> {
    return this.http
      .post<any>(this.urlEndPoint + 'validar', reserva, { headers: this.httpHeaders })
      .pipe(
        catchError(e => {
          return throwError(e);
        })
      );
  }
}
