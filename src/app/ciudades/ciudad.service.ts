import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ciudad } from './ciudad';

@Injectable({
  providedIn: 'root'
})
export class CiudadService {

  private urlCiuDept:string='http://localhost:9898/api/ciudadesDpto';
  constructor(private http:HttpClient ) { }

  obtenerCiudadId(id):Observable<Ciudad>{
    return this.http.get<Ciudad>(`${this.urlCiuDept}/${id}`);
  } 
}
