import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { EstadoEnvioCiudad } from './estado-envio-ciudad';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class EstadoEnvioCiudadService {

  private urlEstadoEnvioCiudad = 'http://localhost:8080/api/EstadoEnvioCiudad';
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  constructor(private http: HttpClient) { }

  ListaEstadoEnvioCiudad(): Observable<EstadoEnvioCiudad[]> {
   return this.http.get<EstadoEnvioCiudad[]>(this.urlEstadoEnvioCiudad);
  }
  PaginadoEstadoEnviociudad(pagina: string,  tamanoPagina: string): Observable<any> {
    const params = new HttpParams()
    .set('page', pagina)
    .set('size', tamanoPagina);
    return this.http.get<any>(`${this.urlEstadoEnvioCiudad}/pagina`, { params: params });
  }
  VerEstadoEnvioCiudad(id): Observable<EstadoEnvioCiudad> {
    return this.http.get<EstadoEnvioCiudad>(`${this.urlEstadoEnvioCiudad}/{id}`).pipe(
      catchError(e => { // Optenemos el error status
        swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }
  CrearEstadoEnvioCiudad(estadoEnvioCiudad: EstadoEnvioCiudad): Observable<EstadoEnvioCiudad> {
    return this.http.post<EstadoEnvioCiudad>(`${this.urlEstadoEnvioCiudad}`, estadoEnvioCiudad, {headers: this.httpHeaders}).pipe(
      catchError(e => {
      swal.fire(e.error.mensaje, e.error.error, 'error');
      return throwError(e);
    })
    );
  }

  EliminarEstadoEnvioCiudad(id: number): Observable<EstadoEnvioCiudad> {
    return this.http.delete<EstadoEnvioCiudad>(`${this.urlEstadoEnvioCiudad}/${id}`, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }



}
