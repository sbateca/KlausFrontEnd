import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { Talla } from './talla';
import { catchError } from 'rxjs/operators';
import alertasSweet from 'sweetalert2';



@Injectable({
  providedIn: 'root'
})


export class TallaService {

  // ---------------------- variables de clase ---------------------- //

  private httpCliente: HttpClient;
  private rutaEndPointTallas = 'http://localhost:8080/api/tallas';
  private enrutador: Router;
  private cabeceraHttp: HttpHeaders = new HttpHeaders({'Content-type' : 'application/json'});


  // ----------------------- constructor de la clase ---------------- //

  constructor(httpCliente: HttpClient, enrutador: Router) {
    this.enrutador = enrutador;
    this.httpCliente = httpCliente;
  }





  /*
    El método getTallas realiza una petición tipo GET al backend.
      - Parámetros: ninguno
      - Retorna: Un observable de cualquier tipo <any>
  */
  getTallas(): Observable<Talla[]> {
    return this.httpCliente.get<Talla[]>(this.rutaEndPointTallas);
  }





  /*
    El método getTallasPaginado realiza una petición de tipo GET al servidor backend.

      Parámetros:
          - page: string --> Número de página inicial
          - size: string --> Tamaño de la página

      El método realiza una petición GET enviando dos parámetros (page, size) los cuales son establecidos
      en este método, luego son enviados y por último estos parámetros asociados al paginador en el backend

      Retorna:
          - Un observable de tipo genérico <any>. Debe ser genérico porque el json que retorna
            además del contenido (Talla) tiene también información del paginador
  */
  getTallasPaginado(pagina: string, tamanoPagina: string): Observable<any> {
    const params = new HttpParams()
    .set('page', pagina)
    .set('size', tamanoPagina);
    return this.httpCliente.get<any>(`${this.rutaEndPointTallas}/pagina`, { params:params});
  }


  /*
    El método getTallaPorID realiza una petición tipo GET al servidor backend

      - Parámetros: el ID de la talla a obtener
      - Retorna: Un Observable de tipo Talla
  */
 getTallaPorID(id: number): Observable<any> {
    return this.httpCliente.get<Talla>(`${this.rutaEndPointTallas}/${id}`).pipe(
      catchError( e => {
        alertasSweet.fire('Error', e.error.mensaje + ' : ' + e.error.error);
        return throwError(e);
      })
    );
 }


 
 ObtenerTallasPorProductoEnBodega(id: number): Observable<any> {
  return this.httpCliente.get<Talla>(`${this.rutaEndPointTallas}/bodega/producto/${id}`).pipe(
    catchError( e => {
      alertasSweet.fire('Error', e.error.mensaje + ' : ' + e.error.error);
      return throwError(e);
    })
  );
 }



  /*
    El método crearTalla realiza la petición de tipo POST al servidor backend

    Parámetros:
      - Talla a registrar

    Retorna: Un observable de cualquier tipo (any). Se hace necesario hacer Cast a tipo Talla
        El operador catchError toma el observable en busca de errorres.
        Como el método retorna un Observable de tipo genérico se hace necesario convertir
        el error en un Observable. Para ello se usa el operador "throwError"
    */

  crearTalla(talla: Talla): Observable<any> {

    return this.httpCliente.post<any>(this.rutaEndPointTallas, talla, {headers: this.cabeceraHttp}).pipe(
      catchError( e => {
        console.error(e.error.mensaje);
        alertasSweet.fire('Error', e.error.mensaje + ' : ' + e.error.error, 'error');
        return throwError(e);
      })
    );
  }




  /*
    El método actualizarTalla(talla) realiza la petición http tipo put (update) al backend

      Parámetros: La talla que contiene la información a modificar en base de datos
      Retorna: Un Observable de cualquier tipo <any>

      Este método implementa manejo de errores (para ello utiliza los operadores catchError y throwError)
        - Muestra una alerta SweetAlert con el mensaje de error
  */

  actualizarTalla(talla: Talla): Observable<any> {
    return this.httpCliente.put<any>(`${this.rutaEndPointTallas}/${talla.id}`, talla, {headers: this.cabeceraHttp}).pipe(
        catchError(e => {
          alertasSweet.fire('Error', e.error.error + ' : ' + e.error.error);
          return throwError(e);
        })
    );
  }





    /*
        El método eliminarTalla(id) realiza una petición HTTP tipo delete al servidor backend

        Parámetros:
            - El ID de la talla a eliminar
        Retorna:
            - Un Observable de tipo genérico <any>

        Este método implementa manejo de errores a través de los operadores catchError y throwError:
            - Muestra una alerta SweetAlert con el mensaje de error
    */

   eliminarTalla(id: number): Observable<any> {
       return this.httpCliente.delete(`${this.rutaEndPointTallas}/${id}`, {headers: this.cabeceraHttp}).pipe(
         catchError(e => {
           alertasSweet.fire('Error', e.error.mensaje + ' : ' + e.error.error);
           return throwError(e);
         })
       );
   }



   obtenerTallasNoAsignadasGastoMaterial(idTipoTalla: number, idProducto: number): Observable<any> {
    return this.httpCliente.get(this.rutaEndPointTallas + '/tipo/' + idTipoTalla + '/producto/'+ idProducto).pipe(
      catchError(error =>{
        alertasSweet.fire('Error', error.error.mensaje + ' : ' + error.error.error);
        return throwError(error);
      })
    );
  }


}
