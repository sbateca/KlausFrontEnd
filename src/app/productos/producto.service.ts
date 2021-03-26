import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Producto } from './producto';
import { catchError } from 'rxjs/operators';
import alertasSweet from 'sweetalert2';
import { CommonService } from '../common/common.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})




export class ProductoService extends CommonService<Producto> {

  
  protected rutaEndPoint = 'http://localhost:8080/api/producto';
  

  // esta variable se ubica acá para facilitar el trabajo entre los componentes producto y formularioProducto
  private foto: File;
  private nombrefoto: string;
  private eliminarFoto = false;

  constructor(enrutador: Router, http: HttpClient) {
    super(enrutador,http);
  }

  ListarProductosBodegaInventario(paginaActual: string, tamanoPagina: string): Observable <any> {
    const parametros = new HttpParams()
    .set('page', paginaActual)
    .set('size', tamanoPagina);
    return this.httpCliente.get(this.rutaEndPoint + '/bodega' + '/pagina' , {params: parametros});
  }


  obtenerFotoProductoPorID( idProducto: number): Observable<any> {
    return this.httpCliente.get(this.rutaEndPoint + '/' + 'productoFoto' + '/' + idProducto,
                                {observe: 'response', responseType: 'blob'}).pipe(
      catchError( e => {
        console.log(e.error.mensaje);
        alertasSweet.fire('Error', e.error.mensaje + ' : ' + e.error.error);
        return throwError(e);
      })
    );
  }



  agregarProductoConfoto(producto: Producto, archivo: File): Observable<any> {
    const datosFormulario = new FormData();
    datosFormulario.append('archivo', archivo);
    datosFormulario.append('nombre', producto.nombre);
    datosFormulario.append('referencia', producto.referencia);
    datosFormulario.append('costo', producto.costo.toString());
    datosFormulario.append('precioVenta', producto.precioVenta.toString());
    datosFormulario.append('activo', producto.activo.toString());

    // al pasar un FormData en el Body no se necesita cabecera porque
    // al ser ese tipo de variable, se sobreentiende que la cabecera será un MultiPart
    return this.httpCliente.post(this.rutaEndPoint + '/' + 'productoFoto', datosFormulario).pipe( catchError(e => {
        console.log(e.error.mensaje);
        alertasSweet.fire('Error', e.error.mensaje + ' : ' + e.error.error);
        return throwError(e);
    }) );
  }



  modificarProductoConfoto(producto: Producto, archivo: File): Observable<any> {

    const datosFormulario = new FormData();
    datosFormulario.append('archivo', archivo);
    datosFormulario.append('nombre', producto.nombre);
    datosFormulario.append('referencia', producto.referencia);
    datosFormulario.append('costo', producto.costo.toString());
    datosFormulario.append('precioVenta', producto.precioVenta.toString());
    datosFormulario.append('activo', producto.activo.toString());
    datosFormulario.append('nombreFoto', producto.nombreFoto);

    // al pasar un FormData en el Body no se necesita cabecera porque
    // al ser ese tipo de variable, se sobreentiende que la cabecera será un MultiPart
    return this.httpCliente.put(this.rutaEndPoint + '/productoFoto' + '/' + producto.id, datosFormulario).pipe( catchError(e => {
        console.log(e.error.mensaje);
        alertasSweet.fire('Error', e.error.mensaje + ' : ' + e.error.error);
        return throwError(e);
    }) );
  }


  modificarProductoFotoNull( producto: Producto): Observable<any> {
    return this.httpCliente.put(this.rutaEndPoint + '/productoFotoNull/' + producto.id, producto, {headers: this.cabeceraHttp}).pipe(
      catchError(e => {
        console.log(e.error.mensaje);
        alertasSweet.fire('Error', e.error.mensaje + ' : ' + e.error.error);
        return throwError(e);
      })
    );
  }


  // estos métodos se utilizan para intercambiar la variable foto entre componentes diferentes
  get obtenerFoto(): File {
    return this.foto;
  }

  setFoto(foto: File) {
    this.foto = foto;
  }

  setEstadoEliminarFoto(estadoNuevo:boolean): void {
    this.eliminarFoto = estadoNuevo;
  }

  get getEstadoEliminarFoto(): boolean {
    return this.eliminarFoto;
  }



}
