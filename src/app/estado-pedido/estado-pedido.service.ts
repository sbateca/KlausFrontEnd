import { Injectable } from '@angular/core';
import { CommonService } from '../common/common.service';
import { EstadoPedido } from './estado-pedido';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstadoPedidoService extends CommonService<EstadoPedido> {

  protected rutaEndPoint = 'http://localhost:8080/api/EstadoPedido';

  constructor(enrutador: Router, http: HttpClient) { 
    super(enrutador, http); // instancio la clase padre
  }

  ObtenerEstadosPedidosPorPedidos(idPedido): Observable<any> {
    return this.httpCliente.get(this.rutaEndPoint + '/Pedido' + '/' + idPedido);
  }
}

