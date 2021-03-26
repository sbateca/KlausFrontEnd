import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import alertasSweet from 'sweetalert2';
import { EntityGenerico } from './EntityGenerico';


@Injectable({
  providedIn: 'root'
})


export abstract class CommonService<E extends EntityGenerico> {


  protected rutaEndPoint: string;
  protected cabeceraHttp: HttpHeaders = new HttpHeaders({'Content-type': 'application/json'});

  constructor(protected enrutador: Router,
              protected httpCliente: HttpClient) { }

  listarElementos(): Observable<E[]> {
    return this.httpCliente.get<E[]>(this.rutaEndPoint);
  }

  obtenerElementoPorID(idElemento: number): Observable<any> {
    return this.httpCliente.get(this.rutaEndPoint + '/' + idElemento).pipe(
      catchError(e => {
      alertasSweet.fire('Error', e.error.mensaje + ' : ' + e.error.error);
      return throwError(e);
    }));
  }

  obtenerElementosPaginado(paginaIndex: string, tamanoPagina: string): Observable<any> {
    const parametros = new HttpParams()
    .set('page', paginaIndex)
    .set('size', tamanoPagina);
    return this.httpCliente.get(`${this.rutaEndPoint}/pagina`, { params: parametros});
  }


  agregarElemento(e: E): Observable<any> {
    return this.httpCliente.post(this.rutaEndPoint, e, {headers: this.cabeceraHttp}).pipe(
      catchError(e => {
      alertasSweet.fire('Error', e.error.mensaje + ' : ' + e.error.error);
      return throwError(e);
    }));
  }

  editarElemento(e: E): Observable<any> {
    return this.httpCliente.put(this.rutaEndPoint + '/' + e.id, e, {headers: this.cabeceraHttp}).pipe(
      catchError(e => {
      alertasSweet.fire('Error', e.error.mensaje + ' : ' + e.error.error);
      return throwError(e);
    }));
  }


  eliminaElemento(idElemento: number): Observable<any> {
    return this.httpCliente.delete(this.rutaEndPoint + '/' + idElemento, {headers: this.cabeceraHttp}).pipe(
      catchError(e => {
        alertasSweet.fire('Error', e.error.mensaje + ' : ' + e.error.error);
        return throwError(e);
      })
    );
  }

}
