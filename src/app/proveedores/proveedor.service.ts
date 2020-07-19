import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs'; // throwError se usa para convetir el error en un Observable
import { Proveedor } from './proveedor';
import alertasSweet from 'sweetalert2';

// catchError se usa para interceptar el Observable en busca de fallas
// En caso de existir un falla se puede obtener el objeto dentro del operador
import {map, catchError} from 'rxjs/operators';



// Anotamos la clase de tipo Service
@Injectable({
    providedIn: 'root'
})



export class ProveedorService {

    // Variables de clase
    private httpCliente: HttpClient;
    private rutaEndPoint = 'http://localhost:8080/api/proveedores';
    private enrutador: Router;
    private cabeceraHttp: HttpHeaders = new HttpHeaders({'Content-type': 'application/json'});



    // constructor de la clase. Instanciamos las variables

    constructor(httpcliente: HttpClient, enrutador: Router) {
        this.httpCliente = httpcliente;
        this.enrutador = enrutador;
    }


   /*
       El método getProveedores() realiza una petición HTTP de tipo get al servidor backend
       Parámetros: ninguno
       Retorna: Un Observable de tipo Proveedor[]
   */
    getProveedores(): Observable<Proveedor[]> {
        return this.httpCliente.get<Proveedor[]>(this.rutaEndPoint);
    }



    /*
        El método getProveedoresPaginado realiza una petición de tipo get al servidor backend.

        Parámetros:
            - page: string --> Número de página inicial
            - size: string --> Tamaño de la página

        El método realiza una petición GET enviando dos parámetros (page, size) los cuales son establecidos
        en este método, luego son enviados y por último estos parámetros asociados al paginador en el backend

        Retorna:
            - Un observable de tipo genérico <any>. Debe ser genérico porque el json que retorna
              además del contenido (Proveedor) tiene también información del paginador
    */
    listarProveedoresPaginado(pagina: string, tamanoPagina: string): Observable<any> {
        const params = new HttpParams() // debe llamarse "params"
        .set('page', pagina)
        .set('size', tamanoPagina);
        return this.httpCliente.get<any>(`${this.rutaEndPoint}/pagina`, { params:params });
    }

    /*
        El método crearProveedor realiza la petición de tipo post al servidor backend

        Parámetros:
            - Ruta
            - Objeto con la información
            - Cabecera
        Retorna: Un observable de cualquier tipo (any). Se hace necesario hacer Cast a tipo Proveedor

        El operador catchError toma el observable en busca de errorres.
        Como el método retorna un Observable de tipo genérico se hace necesario convertir
        el error en un Observable. Para ello se usa el operador "throwError"
    */
    crearProveedor(proveedor: Proveedor): Observable<any> {
        return this.httpCliente.post<any>(this.rutaEndPoint, proveedor, {headers: this.cabeceraHttp}).pipe(

            catchError(e => {
                console.error(e.error.mensaje);
                alertasSweet.fire('Error', e.error.mensaje + ' : ' + e.error.error, 'error'); // lanzamos la alerta de SweetAlert
                return throwError(e);
            })

        );
    }



    /*
        El método getProveedor(id) realiza la petición http de tipo get al backend

        Parámetros: el ID del proveedor
        Retorna: Un Observable de tipo Proveedor

        Este método implementa manejo de errores (para ello usa los operadores catchError y throwError)
            - Muestra una alerta SweetAlert con el mensaje de error
    */

    getProveedor(id: number): Observable<Proveedor> {

        return this.httpCliente.get<Proveedor>(`${this.rutaEndPoint}/${id}`).pipe(
            catchError(e => {
                this.enrutador.navigate(['/proveedores']);
                console.error(e.error.mensaje);
                alertasSweet.fire('Error', e.error.mensaje + ' : ' + e.error.error, 'error');
                return throwError(e);
            })
        );

    }



    /*
        El método actualizarProveedor(proveedor) realiza la petición http tipo put (update) al backend

            Parámetros: el proveedor que contiene la información a modificar en base de datos
            Retorna: Un Observable de cualquier tipo <any>

            Este método implementa manejo de errores (para ello utiliza los operadores catchError y throwError)
                - Muestra una alerta SweetAlert con el mensaje de error
    */
    actualizarProveedor(proveedor: Proveedor): Observable<any> {
        return this.httpCliente.put<any>(`${this.rutaEndPoint}/${proveedor.id}`, proveedor, {headers: this.cabeceraHttp}).pipe(
            catchError( e => {
                console.error(e.error.error);
                this.enrutador.navigate(['/proveedores']);
                alertasSweet.fire('Error', e.error.mensaje + ' : ' + e.error.mensaje);
                return throwError(e);
            })
        );
    }





    /*
        El método eliminarProveedor(id) realiza una petición HTTP tipo delete al servidor backend

        Parámetros:
            - El ID del proveedor a eliminar
        Retorna:
            - Un Observable de tipo genérico <any>

        Este método implementa manejo de errores a través de los operadores catchError y throwError:
            - Muestra una alerta SweetAlert con el mensaje de error
    */
    eliminarProveedor(id: number): Observable<any> {
        return this.httpCliente.delete<any>(`${this.rutaEndPoint}/${id}`, {headers: this.cabeceraHttp}).pipe(
            catchError( e => {
                console.error(e.error.error);
                this.enrutador.navigate(['/proveedores']);
                alertasSweet.fire('Error', e.error.mensaje + ' : ' + e.error.error); // se lanza el mensaje de error
                return throwError(e);
            })
        );
    }





}

