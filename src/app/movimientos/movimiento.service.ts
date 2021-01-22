import { Injectable } from '@angular/core';
import { Movimiento } from './movimiento';
import { CommonService } from '../common/common.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MovimientoService extends CommonService<Movimiento> {

  protected rutaEndPoint = 'http://localhost:8080/api/movimiento';

  
   constructor(enrutador: Router, http: HttpClient) { 
    super(enrutador, http); // instancio la clase padre
  }
}
