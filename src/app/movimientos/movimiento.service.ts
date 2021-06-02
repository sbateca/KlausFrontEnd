import { Injectable } from '@angular/core';
import { Movimiento } from './movimiento';
import { CommonService } from '../common/common.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MovimientoService extends CommonService<Movimiento> {

  /* protected rutaEndPoint = 'http://localhost:8080/api/movimiento'; */
  protected rutaEndPoint = environment.rutaMovimiento;
  
   constructor(enrutador: Router, private http: HttpClient) { 
    super(enrutador, http); // instancio la clase padre
  }
  
  ObtenerMovimientosPorTipo(tipo, fechaInicial, fechaFinal, horaInicial, horaFinal ): Observable<any> {
    return this.http.get(this.rutaEndPoint + '/Pedido' + '/' + tipo+ '/' + fechaInicial + '/' + fechaFinal + '/' + horaInicial + '/' + horaFinal);
  }
}
