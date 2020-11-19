import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Pedido } from './pedido';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private urlPedido: string = 'http://localhost:8080/api/Pedido';
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) { }

  // Lista De Pedidos
  VerListaPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.urlPedido);
  }

  // Lista De Pedidos Paginados
  ListarPedidosPaginado(pagina: string, tamanoPagina: string): Observable<any>{
    const params = new HttpParams().set('page', pagina)
                                  .set('size', tamanoPagina);

    return this.http.get<any>(`${this.urlPedido}/pagina`, { params: params});
  }

  // Buscar Pedido Por Id
  VerPedidoPorId(id): Observable <Pedido> {
    return this.http.get<Pedido>(`${this.urlPedido}/${id}`).pipe(
      catchError(e => { // Optenemos el error status
        swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  // Crear Pedido
  CrearPedido(pedido: Pedido): Observable<any> {// recibe el onjeto cliente en json
    return this.http.post<Pedido>(`${this.urlPedido}`, pedido, {headers: this.httpHeaders}).pipe(
      catchError(e => {
      swal.fire(e.error.mensaje, e.error.error, 'error');
      return throwError(e);
    })
    );
  }

  // Actualizar Pedido
  ActualizarPedido(pedido: Pedido): Observable <Pedido> {
    return this.http.put<Pedido>(`${this.urlPedido}/${pedido.id}`, pedido, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  // Eliminar Pedido
  EliminarPedido(id: number): Observable<Pedido> {
    return this.http.delete<Pedido>(`${this.urlPedido}/${id}`, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
}
