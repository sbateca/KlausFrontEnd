import { Injectable } from '@angular/core';
import { BodegaInventario } from './bodega-inventario';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import swal from 'sweetalert2';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BodegaInventarioService {

  private urlBodegaInventario = 'http://localhost:8080/api/BodegaInventario';
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  constructor(private http: HttpClient) { }

  // Ver Lista Bodega Inventario
  ListaBodegaInventario(): Observable<BodegaInventario[]> {
    return this.http.get<BodegaInventario[]>(this.urlBodegaInventario);
   }
  // Paginado Bodega Inventario
  PaginadoBodegaInventario(pagina: string,  tamanoPagina: string): Observable<any> {
    const params = new HttpParams()
    .set('page', pagina)
    .set('size', tamanoPagina);
    return this.http.get<any>(`${this.urlBodegaInventario}/pagina`, { params: params });
  }
  // Obtener Bodega Inventario Por Id
  VerBodegaInventarioPorId(id): Observable<BodegaInventario> {
    return this.http.get<BodegaInventario>(`${this.urlBodegaInventario}/${id}`).pipe(
      catchError(e => { // Optenemos el error status
        swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }
  // Guardar Bodega Inventario
  CrearBodegaInventario(bodegaInventario: BodegaInventario): Observable<BodegaInventario> {
    return this.http.post<BodegaInventario>(`${this.urlBodegaInventario}`, bodegaInventario, {headers: this.httpHeaders}).pipe(
      catchError(e => {
      swal.fire(e.error.mensaje, e.error.error, 'error');
      return throwError(e);
    })
    );
  }
  // Actualizar Bodega Inventario
  ActualizarBodegaInventario(bodegaInventario: BodegaInventario): Observable<BodegaInventario> {
    return this.http.put<BodegaInventario>(`${this.urlBodegaInventario}/${bodegaInventario.id}`, bodegaInventario, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
  // Eliminar Bodega Inventario
  EliminarBodegaInventario(id: number): Observable<BodegaInventario> {
    return this.http.delete<BodegaInventario>(`${this.urlBodegaInventario}/${id}`, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

}
