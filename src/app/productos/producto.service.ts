import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Producto } from './producto';
import { catchError } from 'rxjs/operators';
import alertasSweet from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})




export class ProductoService {


  private rutaEndPoint = 'http://localhost:8080/api/producto';
  private cabeceraHttp: HttpHeaders = new HttpHeaders({'Content-type' : 'application/json'});

  constructor(private httpCliente: HttpClient) { }


  obtenerProductos(): Observable<Producto[]> {
    return this.httpCliente.get<Producto[]>(this.rutaEndPoint);
  }

  obtenerProductosPaginado(paginaActual: string, tamanoPagina: string): Observable<any> {
    const parametros = new HttpParams()
    .set('page', paginaActual)
    .set('size', tamanoPagina);
    return this.httpCliente.get(this.rutaEndPoint + '/' + 'pagina' , {params: parametros});
  }

  ListarProductosBodegaInventario(paginaActual: string, tamanoPagina: string): Observable <any> {
    const parametros = new HttpParams()
    .set('page', paginaActual)
    .set('size', tamanoPagina);
    return this.httpCliente.get(this.rutaEndPoint + '/bodega' + '/pagina' , {params: parametros});
  }


  obtenerProductoPorID( idProducto: number): Observable<any> {
    return this.httpCliente.get(this.rutaEndPoint + '/' + idProducto).pipe(
      catchError( e => {
        console.log(e.error.mensaje);
        alertasSweet.fire('Error', e.error.mensaje + ' : ' + e.error.error);
        return throwError(e);
      })
    );
  }

  agregarProducto( producto: Producto): Observable<any> {
    return this.httpCliente.post(this.rutaEndPoint, producto, {headers: this.cabeceraHttp}).pipe(
      catchError( e => {
        console.log(e.error.mensaje);
        alertasSweet.fire('Error', e.error.mensaje + ' : ' + e.error.error);
        return throwError(e);
      })
    );
  }

  modificarProducto( producto: Producto): Observable<any> {
    return this.httpCliente.put(this.rutaEndPoint + '/' + producto.id , producto, {headers: this.cabeceraHttp}).pipe(
      catchError( e => {
        console.log(e.error.mensaje);
        alertasSweet.fire('Error', e.error.mensaje + ' : ' + e.error.error);
        return throwError(e);
      })
    );
  }

  eliminarProducto(producto: Producto): Observable<any> {
    return this.httpCliente.delete(this.rutaEndPoint + '/' + producto.id, {headers: this.cabeceraHttp}).pipe(
      catchError( e => {
        console.log(e.error.mensaje);
        alertasSweet.fire('Error', e.error.mensaje + ' : ' + e.error.error);
        return throwError(e);
    })
    );
  }

}
