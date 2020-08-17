import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Tipoenvios } from './tipoenvios';
import { Observable, throwError } from 'rxjs'; // Validar
import { catchError, map } from 'rxjs/operators'; // Validar
import swal from 'sweetalert2';




@Injectable({
  providedIn: 'root'
})
export class TipoenviosService {

  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  private urlTipoenvios: string = 'http://localhost:8080/api/TipoEnvios';

  constructor( private http: HttpClient) { }

  verTipoEnvio(): Observable <Tipoenvios[]> {
    return this.http.get<Tipoenvios[]>(this.urlTipoenvios);
  }
  verTipoEnvioPorId(id: number): Observable<Tipoenvios> {
    return this.http.get<Tipoenvios>(`${this.urlTipoenvios}/${id}`).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  Paginado(pagina: string, tamanoPagina: string): Observable<any> {
    const params = new HttpParams() // debe llamarse "params"
    .set('page', pagina)
    .set('size', tamanoPagina);
    return this.http.get<any>(`${this.urlTipoenvios}/pagina`, { params: params });
  }
  crearTipoEnvios(tipoenvios: Tipoenvios): Observable<Tipoenvios> {
    return this.http.post<Tipoenvios>(`${this.urlTipoenvios}`, tipoenvios, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
  ModificarTipoEnvio(tipoenvios: Tipoenvios): Observable<Tipoenvios> {
    return this.http.put<Tipoenvios>(`${this.urlTipoenvios}/${tipoenvios.id}`, tipoenvios, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
  Eliminar(id: number): Observable<Tipoenvios> {
    return this.http.delete<Tipoenvios>(`${this.urlTipoenvios}/${id}`, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
}
