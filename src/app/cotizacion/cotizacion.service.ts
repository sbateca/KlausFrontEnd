import { Injectable } from '@angular/core';
import { Cotizacion } from './cotizacion';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class CotizacionService {

  private urlCotizacion = 'http://localhost:8080/api/Cotizacion';
  private httpHeaders = new HttpHeaders ({'Content-Type': 'application/json'});
  constructor( private http: HttpClient) { }

  // Ver Lista Cotizacion
  ListaCotizacion(): Observable<Cotizacion[]> {
    return this.http.get<Cotizacion[]>(this.urlCotizacion);
   }

   // Obtener Cotizacion Por Id
  VerCotizacionPorId(id): Observable<Cotizacion> {
    return this.http.get<Cotizacion>(`${this.urlCotizacion}/${id}`).pipe(
      catchError(e => { // Optenemos el error status
        swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  // Guardar Cotizacion
  CrearCotizacion(cotizacion: Cotizacion): Observable<any> {
    return this.http.post<Cotizacion>(`${this.urlCotizacion}`, cotizacion, {headers: this.httpHeaders}).pipe(
      catchError(e => {
      // console.log(e.error.mensaje);
      swal.fire(e.error.mensaje, e.error.error, 'error');
      return throwError(e);
    })
    );
  }

  // Actualizar Cotizacion
  ActualizarCotizacion(cotizacion: Cotizacion): Observable<Cotizacion> {
    return this.http.put<Cotizacion>(`${this.urlCotizacion}/${cotizacion.id}`, cotizacion, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
  // Eliminar Bodega Inventario
  EliminarCotizacion(id: number): Observable<Cotizacion> {
    return this.http.delete<Cotizacion>(`${this.urlCotizacion}/${id}`, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
}
