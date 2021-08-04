import { Injectable } from '@angular/core';
import { CommonService } from '../common/common.service';
import { GastoMaterialProducto } from './gastoMaterialProducto';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import alertasSweet from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})

export class GastoMaterialProductoService extends CommonService<GastoMaterialProducto> {

  protected rutaEndPoint = 'http://localhost:8080/api/GastoMaterialProducto';

  
  constructor(enrutador: Router, http: HttpClient) {
    super(enrutador,http);
  }


  obtenerGastoPorTallaTipoTalla(idTalla: number, idTipoTalla: number, idPieza: number): Observable<any> {
    return this.httpCliente.get(this.rutaEndPoint + '/Talla/'+idTalla+'/TipoTalla/'+idTipoTalla+'/pieza/'+idPieza).pipe(
      catchError( error =>{
        alertasSweet.fire('Error', error.error.mensaje + ' : ' + error.error.error);
        return throwError(error);
      })
    )
  }

  obtenerGastoMateialPorProducto(idProducto: number): Observable<any> {
    return this.httpCliente.get(this.rutaEndPoint + '/Producto/' + idProducto).pipe(
      catchError( e => {
        alertasSweet.fire('Error', e.error.mensaje + ' : ' + e.error.error);
        return throwError(e);
      })
    );
  }

}
