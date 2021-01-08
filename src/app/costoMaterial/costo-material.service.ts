import { Injectable } from '@angular/core';
import { CommonService } from '../common/common.service';
import { CostoMaterial } from './CostoMaterial';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class CostoMaterialService extends CommonService<CostoMaterial>{

  protected rutaEndPoint = "http://localhost:8080/api/costoMaterial";

  constructor(enrutador: Router, httpCliente: HttpClient) {
    super(enrutador,httpCliente);
  }
}
