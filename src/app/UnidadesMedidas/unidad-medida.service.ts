import { Injectable } from '@angular/core';
import { CommonService } from '../common/common.service';
import { UnidadMedida } from './UnidadMedida';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UnidadMedidaService extends CommonService<UnidadMedida> {

  protected rutaEndPoint = 'http://localhost:8080/api/UnidadMedida';

  constructor(enrutador: Router, httpCliente: HttpClient) { 
    super(enrutador, httpCliente); // instancio la clase padre
  }

  

}
