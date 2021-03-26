import { Injectable } from '@angular/core';
import { NuevoUsuario } from '../modeloAcceso/nuevo-usuario';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { JwtDto } from '../modeloAcceso/jwt-dto';
import { LoginUsuario } from '../modeloAcceso/login-usuario';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /* authURL = 'http://localhost:8080/auth/'; */
  authURL = environment.authURL;
  constructor(private httpClient: HttpClient) { }

  public nuevo(nuevoUsuario: NuevoUsuario): Observable<any> {
    return this.httpClient.post<any>(this.authURL + 'nuevo', nuevoUsuario);
  }

  public login(loginUsuario: LoginUsuario): Observable<JwtDto> {
    return this.httpClient.post<JwtDto>(this.authURL + 'login', loginUsuario);
  }

  public refresh(dto: JwtDto): Observable<JwtDto> {
    return this.httpClient.post<JwtDto>(this.authURL + 'refresh', dto);
  }
}
