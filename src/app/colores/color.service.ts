import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { Color } from './color';
import { catchError } from 'rxjs/operators';
import alertasSweet from 'sweetalert2';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})


export class ColorService {

  // ---------------------- variables de clase ---------------------- //

  private httpCliente: HttpClient;
  //private rutaEndPointColores = 'http://localhost:8080/api/colores';
  private rutaEndPointColores = environment.rutaEndPointColores;
  private enrutador: Router;
  private cabeceraHttp: HttpHeaders = new HttpHeaders({'Content-type' : 'application/json'});


  // ----------------------- constructor de la clase ---------------- //

  constructor(httpCliente: HttpClient, enrutador: Router) {
    this.enrutador = enrutador;
    this.httpCliente = httpCliente;
  }




  /*
    El método getColores realiza una petición tipo GET al backend.
      - Parámetros: ninguno
      - Retorna: Un observable de cualquier tipo <any>
  */
  getColores(): Observable<Color[]> {
    return this.httpCliente.get<Color[]>(this.rutaEndPointColores);
  }




  /*
    El método getColorPorID realiza una petición tipo GET al servidor backend

      - Parámetros: el ID del color a obtener
      - Retorna: Un Observable de tipo Color
  */
  getColorPorID(id: number): Observable<any> {
    return this.httpCliente.get(`${this.rutaEndPointColores}/${id}`).pipe(
      catchError(e => {
        alertasSweet.fire('Error', e.error.mensaje + ' : ' + e.error.error);
        return throwError(e);
      })
    );
  }


  /*
    El método getColoresPaginado realiza una petición de tipo GET al servidor backend.

      Parámetros:
          - page: string --> Número de página inicial
          - size: string --> Tamaño de la página

      El método realiza una petición GET enviando dos parámetros (page, size) los cuales son establecidos
      en este método, luego son enviados y por último estos parámetros asociados al paginador en el backend

      Retorna:
          - Un observable de tipo genérico <any>. Debe ser genérico porque el json que retorna
            además del contenido (Color) tiene también información del paginador
  */
  getColoresPaginado(pagina: string, tamanoPagina: string): Observable<any> {
    const params = new HttpParams()
    .set('page', pagina)
    .set('size', tamanoPagina);
    return this.httpCliente.get(`${this.rutaEndPointColores}/pagina`,{params:params});
  }




  /*
    El método crearColor realiza la petición de tipo POST al servidor backend

    Parámetros:
      - Talla a registrar

    Retorna: Un observable de cualquier tipo (any). Se hace necesario hacer Cast a tipo Color
        El operador catchError toma el observable en busca de errorres.
        Como el método retorna un Observable de tipo genérico se hace necesario convertir
        el error en un Observable. Para ello se usa el operador "throwError"
    */

  crearColor(color: Color): Observable<any> {
    return this.httpCliente.post<any>(this.rutaEndPointColores, color, {headers: this.cabeceraHttp}).pipe(
      catchError(e => {
        alertasSweet.fire('Error', e.error.mensaje + ' : ' + e.error.error);
        return throwError(e);
      })
    );
  }





  /*
    El método actualizarColor(color) realiza la petición http tipo put (update) al backend

      Parámetros: el color que contiene la información a modificar en base de datos
      Retorna: Un Observable de cualquier tipo <any>

      Este método implementa manejo de errores (para ello utiliza los operadores catchError y throwError)
        - Muestra una alerta SweetAlert con el mensaje de error
  */
  actualizarColor(color: Color): Observable<any> {
      return this.httpCliente.put(`${this.rutaEndPointColores}/${color.id}`, color, {headers: this.cabeceraHttp}).pipe(
        catchError( e => {
          alertasSweet.fire('Error', e.error.mensaje + ' : ' + e.error.error);
          return throwError(e);
        })
      );
  }




    /*
        El método eliminarColor(id) realiza una petición HTTP tipo delete al servidor backend

        Parámetros:
            - El ID del color a eliminar
        Retorna:
            - Un Observable de tipo genérico <any>

        Este método implementa manejo de errores a través de los operadores catchError y throwError:
            - Muestra una alerta SweetAlert con el mensaje de error
    */
  eliminarColor( id: number): Observable<any> {
    return this.httpCliente.delete(`${this.rutaEndPointColores}/${id}`, {headers: this.cabeceraHttp}).pipe(
      catchError(e => {
        alertasSweet.fire('Error', e.error.mensaje + ' : ' + e.error.error);
        return throwError(e);
      })
    );
  }


  buscarColorPorNombre(nombre: string): Observable<any> {
    return this.httpCliente.get(this.rutaEndPointColores + '/filtro/' + nombre);
  }



}
