import { Injectable } from '@angular/core';
import { BodegaInventario } from './bodega-inventario';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import swal from 'sweetalert2';
import { catchError } from 'rxjs/operators';
import { CommonService } from '../common/common.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class BodegaInventarioService extends CommonService<BodegaInventario> {

  /* private urlBodegaInventario = 'http://localhost:8080/api/BodegaInventario'; */
  urlBodegaInventario = environment.urlBodegaInventario;
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  
  constructor(enrutador: Router, http: HttpClient) {
    super(enrutador,http);
  }

  // Ver Lista Bodega Inventario
  ListaBodegaInventario(): Observable<BodegaInventario[]> {
    return this.httpCliente.get<BodegaInventario[]>(this.urlBodegaInventario);
   }
  // Paginado Bodega Inventario
  PaginadoBodegaInventario(pagina: string,  tamanoPagina: string): Observable<any> {
    const params = new HttpParams()
    .set('page', pagina)
    .set('size', tamanoPagina);
    return this.httpCliente.get<any>(`${this.urlBodegaInventario}/pagina`, { params: params });
  }

  // Consulta Bodega Por Feferencia
  ObtenerBodegaInventarioPorReferencia(referencia: number): Observable<any> {
    return this.httpCliente.get(this.urlBodegaInventario + '/bodega' + '/' + referencia);
  }

  // Obtener Bodega Inventario Por Id
  VerBodegaInventarioPorId(id): Observable<BodegaInventario> {
    return this.httpCliente.get<BodegaInventario>(`${this.urlBodegaInventario}/${id}`).pipe(
      catchError(e => { // Optenemos el error status
        swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }
  // Guardar Bodega Inventario
  CrearBodegaInventario(bodegaInventario: BodegaInventario): Observable<any> {
    return this.httpCliente.post<BodegaInventario>(`${this.urlBodegaInventario}`, bodegaInventario, {headers: this.httpHeaders}).pipe(
      catchError(e => {
      swal.fire(e.error.mensaje, e.error.error, 'error');
      return throwError(e);
    })
    );
  }
  // Actualizar Bodega Inventario
  ActualizarBodegaInventario(bodegaInventario: BodegaInventario): Observable<BodegaInventario> {
    return this.httpCliente.put<BodegaInventario>(`${this.urlBodegaInventario}/${bodegaInventario.id}`,
     bodegaInventario, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
  // Eliminar Bodega Inventario
  EliminarBodegaInventario(id: number): Observable<BodegaInventario> {
    return this.httpCliente.delete<BodegaInventario>(`${this.urlBodegaInventario}/${id}`, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

}
