import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Material } from './Material';
import { catchError } from 'rxjs/operators';
import alertasSweet from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})



export class MaterialService {


  private rutaEndPoint = 'http://localhost:8080/api/material';
  private cabeceraHttp: HttpHeaders = new HttpHeaders({'Content-type': 'application/json'});



  constructor(private enrutador: Router,
              private httpCliente: HttpClient) { }



  obtenerMateriales(): Observable<Material[]> {
    return this.httpCliente.get<Material[]>(this.rutaEndPoint);
  }

  obtenerMaterialPorID(idMaterial: number): Observable<any> {
    return this.httpCliente.get(this.rutaEndPoint + '/' + idMaterial).pipe(
      catchError(e => {
      alertasSweet.fire('Error', e.error.mensaje + ' : ' + e.error.error);
      return throwError(e);
    }));
  }

  obtenerMaterialesPaginado(paginaIndex: string, tamanoPagina: string): Observable<any> {
    const parametros = new HttpParams()
    .set('page', paginaIndex)
    .set('size', tamanoPagina);
    return this.httpCliente.get(`${this.rutaEndPoint}/pagina`, { params: parametros});
  }


  agregarMaterial(material: Material): Observable<any> {
    return this.httpCliente.post(this.rutaEndPoint, material, {headers: this.cabeceraHttp}).pipe(
      catchError(e => {
      alertasSweet.fire('Error', e.error.mensaje + ' : ' + e.error.error);
      return throwError(e);
    }));
  }

  editarMaterial(material: Material): Observable<any> {
    return this.httpCliente.put(this.rutaEndPoint + '/' + material.id, material, {headers: this.cabeceraHttp}).pipe(
      catchError(e => {
      alertasSweet.fire('Error', e.error.mensaje + ' : ' + e.error.error);
      return throwError(e);
    }));
  }


  eliminaMaterial(idMaterial: number): Observable<any> {
    return this.httpCliente.delete(this.rutaEndPoint + '/' + idMaterial, {headers: this.cabeceraHttp}).pipe(
      catchError(e => {
        alertasSweet.fire('Error', e.error.mensaje + ' : ' + e.error.error);
        return throwError(e);
      })
    );
  }


  buscarMaterialPorNombre(nombre: string): Observable<any> {
    return this.httpCliente.get(this.rutaEndPoint + '/filtro/' + nombre);
  }


}
