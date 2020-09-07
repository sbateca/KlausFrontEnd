import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { EmpresaTransportadora } from './empresa-transportadora';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class EmpresaTransportadoraService {

  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  private urlEmpresaTransportadora: string = 'http://localhost:8080/api/EmpresaTransportadora';

  constructor(private http: HttpClient) { }

  // Ver tabla
  verEmpresaTransportadora(): Observable <EmpresaTransportadora[]> {
    return this.http.get<EmpresaTransportadora[]>(this.urlEmpresaTransportadora);
  }

  // Ver Tabla Empresa Transportadora por ID
  verEmpresaTransportadoraPorId(id: number): Observable<EmpresaTransportadora> {
    return this.http.get<EmpresaTransportadora>(`${this.urlEmpresaTransportadora}/${id}`).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  // Paginación obtener tabla paginada
  Paginado(pagina: string, tamanoPagina: string): Observable<any> {
    const params = new HttpParams() // debe llamarse "params"
    .set('page', pagina)
    .set('size', tamanoPagina);
    return this.http.get<any>(`${this.urlEmpresaTransportadora}/pagina`, { params: params });
  }

  // Crear Empresa Transportadora - Post
  crearEmpresaTransportadora(empresaTransportadora: EmpresaTransportadora): Observable<EmpresaTransportadora> {
    return this.http.post<EmpresaTransportadora>
    (`${this.urlEmpresaTransportadora}`, empresaTransportadora, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  // Modificar Empresa Transportadora - Put
  ModificarEmpresaTransportadora(empresaTransportadora: EmpresaTransportadora): Observable<EmpresaTransportadora> {
    return this.http.put<EmpresaTransportadora>
    (`${this.urlEmpresaTransportadora}/${empresaTransportadora.id}`, empresaTransportadora, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  // Eliminar - Delete
  EliminarEmpresaTransportadora(id: number): Observable<EmpresaTransportadora> {
    return this.http.delete<EmpresaTransportadora>(`${this.urlEmpresaTransportadora}/${id}`, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

}
