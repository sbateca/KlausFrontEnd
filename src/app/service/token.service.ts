import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// Comprorbar si estamos o no logeados y para obtener los privilegios
// Costantes se van a tener almacenados en el navegador
// Ruta consola/aplicaton/sesion storage
const TOKEN_KEY = 'AuthToken';// De clave

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  roles: Array<string> = [];// vacio

  constructor(private router: Router) { }

  // Gettes y Setters
  public setToken(token: string): void {
    window.localStorage.removeItem(TOKEN_KEY);// se removueve 
    window.localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string {
    return localStorage.getItem(TOKEN_KEY);
  }

  public isLogged(): boolean{
    if(this.getToken()){
      return true;
    }
    return false;
  }


  public getUserName(): string {
    if(this.isLogged()){
      return null;
    }
    const token = this.getToken();
    const payload = token.split('.')[1];// array posicion 1
    const payloadDecode = atob(payload);
    // convertir en json 
    const values = JSON.parse(payloadDecode);
    const username = values.sub;
    return username;
  }
  // Comporbar si es admin
  public isAdmin(): boolean{
    if(this.isLogged()){
      return false;
    }
    const token = this.getToken();
    const payload = token.split('.')[1];// array posicion 1
    const payloadDecode = atob(payload);
    // convertir en json 
    const values = JSON.parse(payloadDecode);
    const roles = values.roles;
    // si el elemento no esta en el array
    if(roles.indexOf('ROLE_ADMIN') < 0) {
      return false;
    }
    return true;
  }

  public logOut(): void {
    window.localStorage.clear();// Limpia lo que tengamos en sesion storage
    this.router.navigate(['/login']);
  }
}