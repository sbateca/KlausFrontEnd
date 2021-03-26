import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Enviociudad } from './Enviociudad';

@Injectable({
  providedIn: 'root'
})
export class EnviociudadService {

  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  private urlEnviociudad = 'http://localhost:8080/api/EnvioCiudad';

  constructor(private http: HttpClient) { }

  verEnvioCiudad(): Observable <Enviociudad[]> {
    return this.http.get<Enviociudad[]>(this.urlEnviociudad);
  }
  verEnvioCiudadPorId(id: number): Observable<Enviociudad> {
    return this.http.get<Enviociudad>(`${this.urlEnviociudad}/${id}`).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }
  crearEnviociudad(enviociudad: Enviociudad): Observable<any> {
    return this.http.post<Enviociudad>(`${this.urlEnviociudad}`, enviociudad, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
  ModificarEnvioCiudad(enviociudad: Enviociudad): Observable<any> {
    return this.http.put<Enviociudad>(`${this.urlEnviociudad}/${enviociudad.id}`, enviociudad, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  Eliminar(id: number): Observable<Enviociudad> {
    return this.http.delete<Enviociudad>(`${this.urlEnviociudad}/${id}`, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  Paginado(pagina: string, tamanoPagina: string): Observable<any> {
    const params = new HttpParams() // debe llamarse "params"
    .set('page', pagina)
    .set('size', tamanoPagina);
    return this.http.get<any>(`${this.urlEnviociudad}/pagina`, { params: params });
  }


}
