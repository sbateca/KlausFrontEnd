import { Injectable } from '@angular/core';
import { CommonService } from '../common/common.service';
import { CostoMaterial } from './CostoMaterial';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import alertasSweet from 'sweetalert2';
import { Material } from '../materiales/Material';

@Injectable({
  providedIn: 'root'
})

export class CostoMaterialService extends CommonService<CostoMaterial>{

  protected rutaEndPoint = "http://localhost:8080/api/costoMaterial";

  constructor(enrutador: Router, httpCliente: HttpClient) {
    super(enrutador,httpCliente);
  }


  obtenerCostoMaterialidMaterial(materialID: number): Observable<any> {
    return this.httpCliente.get(this.rutaEndPoint + '/material/' + materialID, {headers: this.cabeceraHttp}).pipe(
      catchError( e => {
        alertasSweet.fire('Error', e.error.mensaje + ' : ' + e.error.error);
        return throwError(e);
      }));
  }

  obtenerMaterialRegistrado(): Observable<any> {
    return this.httpCliente.get(this.rutaEndPoint + '/material').pipe(
      catchError(e => {
        alertasSweet.fire('Error', e.error.mensaje + ' : ' + e.error.error);
        return throwError(e);
      }));
  }

}
