import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Pieza } from './pieza';
import { catchError } from 'rxjs/operators';
import alertasSweet from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})



export class PiezaService {

  // Variable de rutas para las peticiones
  rutaEndPoint = 'http://localhost:4200/api/pieza';

  // Declaracion de cabecera para las peticiones que lo requieren
  cabeceraHttp: HttpHeaders = new HttpHeaders( {'Content-type' : 'application/json'} );


  constructor(private httpCliente: HttpClient) { }



  obtenerPiezas(): Observable<Pieza[]> {
    return this.httpCliente.get<Pieza[]>(this.rutaEndPoint);
  }

  obtenerPiezasPaginado(paginaActual: string, tamanoPagina: string): Observable<any> {

    const parametros = new HttpParams()
    .set('page', paginaActual)
    .set('size', tamanoPagina);

    return this.httpCliente.get(this.rutaEndPoint + '/' + 'pagina' , {params: parametros});
  }

  obtenerPiezaPorID( idPieza: number): Observable<any> {
    return this.httpCliente.get(this.rutaEndPoint + '/' + idPieza).pipe(
      catchError( e => {
        console.log(e.error.mensaje);
        alertasSweet.fire('Error', e.error.mensaje + ' : ' + e.error.error);
        return throwError(e);
      })
    );
  }

  agregarPieza( pieza: Pieza): Observable<any> {
    return this.httpCliente.post(this.rutaEndPoint, pieza, {headers: this.cabeceraHttp}).pipe(
      catchError( e => {
        console.log(e.error.mensaje);
        alertasSweet.fire('Error', e.error.mensaje + ' : ' + e.error.error);
        return throwError(e);
      })
    );
  }

  modificarPieza( pieza: Pieza): Observable<any> {
    return this.httpCliente.put(this.rutaEndPoint + '/' + pieza.id , pieza, {headers: this.cabeceraHttp}).pipe(
      catchError( e => {
        console.log(e.error.mensaje);
        alertasSweet.fire('Error', e.error.mensaje + ' : ' + e.error.error);
        return throwError(e);
      })
    );
  }

  eliminarPieza(pieza: Pieza): Observable<any> {
    return this.httpCliente.delete(this.rutaEndPoint + '/' + pieza.id, {headers: this.cabeceraHttp}).pipe(
      catchError( e => {
        console.log(e.error.mensaje);
        alertasSweet.fire('Error', e.error.mensaje + ' : ' + e.error.error);
        return throwError(e);
    })
    );
  }



}
