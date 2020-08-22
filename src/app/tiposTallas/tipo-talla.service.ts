import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { TipoTalla } from './TipoTalla';
import { catchError } from 'rxjs/operators';
import alertasSweet from 'sweetalert2';




@Injectable({
  providedIn: 'root'
})



export class TipoTallaService {

  // Esta variable almacena la ruta base donde se hacen las peticiones al servidor backend
  private rutaEndPointTipoTalla = 'http://localhost:8080/api/tipoTalla';

  // Esta variable instancia la cabecera de las peticiones HTTP
  private cabeceraHttp: HttpHeaders = new HttpHeaders({'Content-type' : 'application/json'});


  // constructor de la clase
  constructor(private httpCliente: HttpClient,
             private enrutador: Router) { }



  /*
    El método obtenerTipoTallas() realiza una petición tipo GET al servidor. Retorna un Observable<TipoTalla[]>
  */
  obtenerTipoTallas(): Observable<TipoTalla[]> {
    return this.httpCliente.get<TipoTalla[]>(this.rutaEndPointTipoTalla);
  }

/*
    El método getTipoTallasPaginado realiza una petición de tipo GET al servidor backend.

      Parámetros:
          - page: string --> Número de página inicial
          - size: string --> Tamaño de la página

      El método realiza una petición GET enviando dos parámetros (page, size) los cuales son establecidos
      en este método, luego son enviados y por último estos parámetros asociados al paginador en el backend

      Retorna:
          - Un observable de tipo genérico <any>. Debe ser genérico porque el json que retorna
            además del contenido (TipoTalla) tiene también información del paginador
  */
 getTipoTallasPaginado(paginaActual: string, tamanoPagina: string): Observable<any> {
  // declaramos uns constante de tipo HttpParams, el cual establecerá las variables a enviar en la petición
  const parametros = new HttpParams()
  .set('page', paginaActual)
  .set('size', tamanoPagina);

  return this.httpCliente.get(`${this.rutaEndPointTipoTalla}/pagina`, {params: parametros});
 }


  /*
    El método agregarTipoTalla() realiza una petición de tipo POST al servidor.

    Parámetros: El tipo de talla que se va a registrar
    Retorna: Un observable de cualquier tipo (any)
    El operador catchError toma el observable en busca de errorres.
        Como el método retorna un Observable de tipo genérico se hace necesario convertir
        el error en un Observable. Para ello se usa el operador "throwError"
  */
   agregarTipoTalla(tipoTalla: TipoTalla): Observable<any> {
     return this.httpCliente.post(this.rutaEndPointTipoTalla, tipoTalla, {headers: this.cabeceraHttp}).pipe(

    catchError( e => {
      console.log(e.error.mensaje);
      alertasSweet.fire('Error', e.error.mensaje + ' : ' + e.error.error);
      return throwError(e);
    })
     );
   }




   /*
     El método obtenerTipoTallaPorID() realiza una petición tipo GET al servidor, obteniendo un observable
     - Parámetros: El ID del tipo de talla a consultar
     - Retorna: Un Observable<any>
   */
    obtenerTipoTallaPorID(id: number): Observable<any> {
      return this.httpCliente.get(`${this.rutaEndPointTipoTalla}/${id}`).pipe(
        catchError(e => {
          alertasSweet.fire('Error', e.error.mensaje + ' : ' + e.error.error);
          return throwError(e);
        })
      );
    }



    /*
      El método eliminarTipoTalla() realiza una petición tipo DELETE al servidor backend.
      Utiliza el operador catchError el cual captura el error (en caso de existir) y lo muestra en una alerta usando sweetAlert
      Parámetros: el ID del tipo de talla a eliminar
      Retorna: Un Observable<any>
    */
    eliminarTipoTalla(id: number): Observable<any> {
      return this.httpCliente.delete(this.rutaEndPointTipoTalla + '/' + id, {headers: this.cabeceraHttp}).pipe(
        catchError(e =>{
          alertasSweet.fire('Error', e.error.mensaje + ' : ' + e.error.error);
          return throwError(e);
        })
      );
    }



    modificarTipoTalla( tipoTalla: TipoTalla): Observable<any> {
      return this.httpCliente.put(this.rutaEndPointTipoTalla + '/' + tipoTalla.id , tipoTalla, {headers: this.cabeceraHttp}).pipe(
        catchError( e => {
          console.log(e.error.mensaje);
          alertasSweet.fire('Error', e.error.mensaje + ' : ' + e.error.error);
          return throwError(e);
        })
      );
    }



}
