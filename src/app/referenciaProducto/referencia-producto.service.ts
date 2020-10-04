import { Injectable } from '@angular/core';
import { ReferenciaProducto } from './referencia-producto';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ReferenciaProductoService {

  private urlReferenciaProducto = 'http://localhost:8080/api/ReferenciaProducto';
  private httpHeaders = new HttpHeaders ({'Content-Type': 'application/json'});
  constructor( private http: HttpClient) { }

  // Ver Lista Referencia Producto
  ListaRefenerciaProducto(): Observable<ReferenciaProducto[]> {
    return this.http.get<ReferenciaProducto[]>(this.urlReferenciaProducto);
   }

   // Obtener Referencia Producto Por Id
  VerReferenciaProductoPorId(id): Observable<ReferenciaProducto> {
    return this.http.get<ReferenciaProducto>(`${this.urlReferenciaProducto}/${id}`).pipe(
      catchError(e => { // Optenemos el error status
        swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  // Guardar Referencia Producto
  CrearReferenciaProducto(referenciaProducto: ReferenciaProducto): Observable<ReferenciaProducto> {
    return this.http.post<ReferenciaProducto>(`${this.urlReferenciaProducto}`, referenciaProducto, {headers: this.httpHeaders}).pipe(
      catchError(e => {
      swal.fire(e.error.mensaje, e.error.error, 'error');
      return throwError(e);
    })
    );
  }

  // Actualizar Referencia Producto
  ActualizarReferenciaProducto(referenciaProducto: ReferenciaProducto): Observable<ReferenciaProducto> {
    return this.http.put<ReferenciaProducto>(`${this.urlReferenciaProducto}/${referenciaProducto.id}`, referenciaProducto, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
  // Eliminar Bodega Inventario
  EliminarReferenciaProducto(id: number): Observable<ReferenciaProducto> {
    return this.http.delete<ReferenciaProducto>(`${this.urlReferenciaProducto}/${id}`, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
}
