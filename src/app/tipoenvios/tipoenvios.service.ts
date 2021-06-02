import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { TipoEnvio } from './tipoenvios';
import { Observable, throwError } from 'rxjs'; // Validar
import { catchError, map } from 'rxjs/operators'; // Validar
import swal from 'sweetalert2';
import { environment } from '../../environments/environment';




@Injectable({
  providedIn: 'root'
})
export class TipoenviosService {

  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  /* private urlTipoenvios: string = 'http://localhost:8080/api/TipoEnvio'; */
  private urlTipoenvios = environment.urlTipoEnvios ;

  constructor( private http: HttpClient) { }

  verTipoEnvio(): Observable <TipoEnvio[]> {
    return this.http.get<TipoEnvio[]>(this.urlTipoenvios);
  }
  verTipoEnvioPorId(id: number): Observable<TipoEnvio> {
    return this.http.get<TipoEnvio>(`${this.urlTipoenvios}/${id}`).pipe(
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
  crearTipoEnvios(tipoenvios: TipoEnvio): Observable<TipoEnvio> {
    return this.http.post<TipoEnvio>(`${this.urlTipoenvios}`, tipoenvios, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
  ModificarTipoEnvio(tipoenvios: TipoEnvio): Observable<TipoEnvio> {
    return this.http.put<TipoEnvio>(`${this.urlTipoenvios}/${tipoenvios.id}`, tipoenvios, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
  Eliminar(id: number): Observable<TipoEnvio> {
    return this.http.delete<TipoEnvio>(`${this.urlTipoenvios}/${id}`, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
}
