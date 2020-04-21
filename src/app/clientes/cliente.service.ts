import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Ciudad } from '../ciudades/ciudad';



@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private urlEndPoint:string ='http://localhost:8080/api/clientes';
  private urlporciudad:string ='http://localhost:8080/api/clientesciud';

  private httpHeaders=new HttpHeaders({'Content-Type':'application/json'});

  constructor( private http:HttpClient ) { }

  getClientes():Observable<Cliente[]>{
    return this.http.get<Cliente[]>(this.urlEndPoint);
  }

   /*
        El método getProveedoresPaginado realiza una petición de tipo get al servidor backend

        Parámetros:
            - page: string --> Número de página inicial
            - size: string --> Tamaño de la página
        Retorna:
            - Un observable de tipo genérico <any>. Debe ser genérico porque el json que retorna
              además del contenido (Proveedor) tiene también información del paginador
    */
   listarClientesPaginado(pagina: string, tamanoPagina: string): Observable<any> {
    const params = new HttpParams() // debe llamarse "params"
    .set('page', pagina)
    .set('size', tamanoPagina);
    return this.http.get<any>(`${this.urlEndPoint}/pagina`, { params:params });
  }
  create(cliente:Cliente, IdCiudadSelecc:Number):Observable<Cliente>{//recibe el onjeto cliente en json
    return this.http.post<Cliente>(`${this.urlEndPoint}/ciudad/${IdCiudadSelecc}`, cliente, {headers:this.httpHeaders});
  }
  getCliente(id): Observable<Cliente>{//cargamos los datos al formulario
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`);
  }
  obtenerClentesCiudadId(id):Observable<Cliente[]>{
    return this.http.get<Cliente[]>(`${this.urlporciudad}/${id}`);
  }
  update(cliente:Cliente):Observable<Cliente>{
        return this.http.put<Cliente>(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers:this.httpHeaders});
  }
  delete(id:number):Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers:this.httpHeaders});
  }
}
