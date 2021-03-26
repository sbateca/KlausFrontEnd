import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
import { Observable, throwError} from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Ciudad } from '../ciudades/ciudad';
import { catchError, map} from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class ClienteService {

/*   private urlEndPoint: string = 'http://localhost:8080/api/clientes';
  private urlporciudad: string = 'http://localhost:8080/api/clientesciud'; */
  urlEndPoint = environment.urlEndPoint;
  urlporciudad = environment.urlporciudad;

  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor( private http: HttpClient , private router: Router) { }

  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.urlEndPoint);
  }

   /*
        El método getProveedoresPaginado realiza una petición de tipo get al servidor backend

        Parámetros:
            - page: string --> Número de página inicial
            - size: string --> Tamaño de la página
        Retorna:
            - Un observable de tipo genérico <any>. Debe ser genérico porque el json que retorna
              además del contenido (Proveedor) tiene también información del paginador
    */

   listarClientesPaginado(pagina: string, tamanoPagina: string): Observable<any> {
    const params = new HttpParams() // debe llamarse "params"
    .set('page', pagina)
    .set('size', tamanoPagina);
    return this.http.get<any>(`${this.urlEndPoint}/pagina`, { params: params });
  }

  // Consulta Cliente Por Documento
  ObtenerClientePorDocumento(documento: number): Observable<any> {
    return this.http.get(this.urlEndPoint + '/cliente' + '/' + documento);
  }

  create(cliente: Cliente, IdCiudadSelecc: Number): Observable<Cliente> {// recibe el onjeto cliente en json
    return this.http.post<Cliente>(`${this.urlEndPoint}/ciudad/${IdCiudadSelecc}`, cliente, {headers: this.httpHeaders}).pipe(
    catchError(e => {
      console.error(e.error.mensaje, e.error.error, 'error');
      return throwError(e);
    })
    );
  }
  crearCliente(cliente: Cliente): Observable<Cliente> {// recibe el onjeto cliente en json
    return this.http.post<Cliente>(`${this.urlEndPoint}`, cliente, {headers: this.httpHeaders}).pipe(
    // map((response: any) => response.cliente as Cliente),
      catchError(e => {
      console.error(e.error.mensaje);
      console.error(e.error.error);
      swal.fire(e.error.mensaje, e.error.error, 'error');
      return throwError(e);
    })
    );
  }

  getCliente(id): Observable<Cliente> {// cargamos los datos al formulario
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
    catchError(e => { // Optenemos el error status
      this.router.navigate(['/clientes']); // Redirigimos
      console.error(e.error.mensaje);
      swal.fire('Error al editar', e.error.mensaje, 'error');
      return throwError(e);
    })
    );
  }
  obtenerClentesCiudadId(id): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.urlporciudad}/${id}`);
  }
  update(cliente: Cliente): Observable<Cliente> {
        return this.http.put<Cliente>(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers: this.httpHeaders}).pipe(
catchError(e => {
  console.error(e.error.mensaje);
  swal.fire(e.error.mensaje, e.error.error, 'error');
  return throwError(e);
})
        );
  }
  delete(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
}

