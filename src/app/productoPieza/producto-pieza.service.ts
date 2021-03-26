import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ProductoPieza } from './ProductoPieza';
import { catchError } from 'rxjs/operators';
import alertasSweet from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ProductoPiezaService {

  rutaEndPoint = 'http://localhost:8080/api/productoPieza';
  cabeceraHttp: HttpHeaders = new HttpHeaders({'Content-type' : 'application/json'});

  constructor(private httpCliente: HttpClient) { }


  getProductosPiezas(): Observable<ProductoPieza[]> {
    return this.httpCliente.get<ProductoPieza[]>(this.rutaEndPoint);
  }

  obtenerProductoPiezaPorID(id: number): Observable<ProductoPieza> {
    return this.httpCliente.get<ProductoPieza>(this.rutaEndPoint + '/' + id);
  }


  agregarProductoPieza( productoPieza: ProductoPieza): Observable<any> {
    return this.httpCliente.post(this.rutaEndPoint, productoPieza, {headers: this.cabeceraHttp}).pipe(
      catchError( e => {
        console.log(e.error.mensaje);
        alertasSweet.fire('Error', e.error.mensaje + ' : ' + e.error.error);
        return throwError(e);
      })
    );
  }

  modificarProductoPieza( productoPieza: ProductoPieza): Observable<any> {
    return this.httpCliente.put(this.rutaEndPoint + '/' + productoPieza.id , productoPieza, {headers: this.cabeceraHttp}).pipe(
      catchError( e => {
        console.log(e.error.mensaje);
        alertasSweet.fire('Error', e.error.mensaje + ' : ' + e.error.error);
        return throwError(e);
      })
    );
  }

  eliminarProducto(productoPieza: ProductoPieza): Observable<any> {
    return this.httpCliente.delete(this.rutaEndPoint + '/' + productoPieza.id, {headers: this.cabeceraHttp}).pipe(
      catchError( e => {
        console.log(e.error.mensaje);
        alertasSweet.fire('Error', e.error.mensaje + ' : ' + e.error.error);
        return throwError(e);
    })
    );
  }


}
