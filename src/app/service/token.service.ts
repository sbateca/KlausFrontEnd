import { Injectable} from "@angular/core";
import { Router } from "@angular/router";

// Comprorbar si estamos o no logeados y para obtener los privilegios
// Costantes se van a tener almacenados en el navegador
// Ruta consola/aplicaton/sesion storage
const TOKEN_KEY = "AuthToken"; // De clave
@Injectable({
  providedIn: "root",
})
export class TokenService {
  roles: Array<string> = []; // vacio
  inicia;
  rol;

  constructor(private router: Router) {}

  // Se calcula el nombre del rol
  NombreRol(){
    if(this.esOperador()){
      return 'OPERADOR';
    } else {
      if(this.isAdmin()){
        return 'ADMINISTRADOR';
      } else {
        if(this.esPropietario()){
          return 'PROPIETARIO';
        } else {
          if(this.isLogged()){
            return 'USUARIO';
          } else {
            return 'Debes iniciar sesion'
          }
        }
      }
    }
  }

  // Se carga el token
  public setToken(token: string): void {
    window.localStorage.removeItem(TOKEN_KEY); // se removueve
    window.localStorage.setItem(TOKEN_KEY, token);// graba authtoken en localStorage
  }

  // Muestra el token
  public getToken(): string {
      return localStorage.getItem(TOKEN_KEY);
  }

  // Si hay sesion
  public isLogged(): boolean {
    if (this.getToken()) {
      return true;
    }
    return false;
  }

  // Se manipula el usuario desde el token
  public getUserName(): string {
    if (!this.isLogged()) {
      return null;
    }
    const token = this.getToken();
    if (token != null) {
      const payload = token.split(".")[1]; // array posicion 1
      const payloadDecode = atob(payload);
      const values = JSON.parse(payloadDecode); // convertir en json
      const username = values.sub;
      return username;
    }
  }

  // Comporbar si es admin
  public isAdmin(): boolean {
    if (!this.isLogged()) {
      return false;
    }
    
    const token = this.getToken();
    if (token != null) {
      const payload = token.split(".")[1]; // array posicion 1
      const payloadDecode = atob(payload);
      // convertir en json
      const values = JSON.parse(payloadDecode);
      const roles = values.roles;
      // si el elemento no esta en el array
      if (roles.indexOf("ROLE_ADMIN") < 0) {
        return false;
      }
      return true;
    }
  }

  // Comporbar si es operador
  public esOperador(): boolean {
    if (!this.isLogged()) {
      return false;
    }
    const token = this.getToken();
    if (token != null) {
      const payload = token.split(".")[1]; // array posicion 1
      const payloadDecode = atob(payload);
      // convertir en json
      const values = JSON.parse(payloadDecode);
      const roles = values.roles;
      // si el elemento no esta en el array
      if (roles.indexOf("ROLE_OPERADOR") < 0) {
        return false;
      }
      return true;
    }
  }

  // Comporbar si es propietario
  public esPropietario(): boolean {
    if (!this.isLogged()) {
      return false;
    }
    const token = this.getToken();
    if (token != null) {
      const payload = token.split(".")[1]; // array posicion 1
      const payloadDecode = atob(payload);
      // convertir en json
      const values = JSON.parse(payloadDecode);
      const roles = values.roles;
      // si el elemento no esta en el array
      if (roles.indexOf("ROLE_PROPIETARIO") < 0) {
        return false;
      }
      return true;
    }
  }

  public logOut(): void {
    window.localStorage.removeItem("AuthToken");// Destruye el token
    /* window.localStorage.clear(); */ // Limpia lo que tengamos en sesion storage
   /*  this.router.navigate(["/login"]); */
  }
}
