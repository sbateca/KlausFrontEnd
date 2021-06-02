import { Injectable } from '@angular/core';
import { Departamento } from './departamento';
import { Ciudad } from '../ciudades/ciudad';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';


// librerías para la captura de errores
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {

  /* private url: string = 'http://localhost:8080/api/departamentos'; */
  private url= environment.url;
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  

  constructor(private http: HttpClient, private enrutador: Router) {  }


  obtenerDepartamentos(): Observable<Departamento[]> {
    return this.http.get<Departamento[]>(this.url);
  }

  obtenerDepartamentoPorID(idDepartamento): Observable<Departamento> {
    return this.http.get<Departamento>(`${this.url}/${idDepartamento}`);
  }

}
