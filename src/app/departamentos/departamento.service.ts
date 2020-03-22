import { Injectable } from '@angular/core';
import { Departamento } from './departamento';
import { Ciudad } from '../ciudades/ciudad';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {

  private url:string= 'http://localhost:9898/api/departamentos';
  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'});

  
  constructor(private http:HttpClient) {  }

  obtenerDepartamentos():Observable<Departamento[]>{
    return this.http.get<Departamento[]>(this.url);
                   
  }
}
