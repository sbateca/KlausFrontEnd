import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../service/token.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLogged = false;
  esAdmin: boolean;
  rol: string;
  pagina: string = 'login';// por defecto entra en la pagina login
  finSesion;
  nombreUsuario;
  token;

  constructor(public tokenService: TokenService,
              private router: Router) { }
  ngOnInit() {
    this.rol = this.tokenService.NombreRol();
    this.esAdmin = this.tokenService.isAdmin();
    this.isLogged = this.tokenService.isLogged(); 
    this.nombreUsuario = this.tokenService.getUserName();   
    console.log("headerlogged:"+this.isLogged)  
    console.log("headerGetToken: "+this.tokenService.getToken());
    console.log("header111");
   /*  if(this.tokenService.getToken()!=null){
      console.log(JSON.parse(atob(this.tokenService.getToken().split(".")[1])));
      console.log(JSON.parse(atob(this.tokenService.getToken().split(".")[0]))); */
     /*  console.log( (JSON.parse(atob(this.tokenService.getToken().split(".")[2])))); */
    /*} /* else{
      console.log("no hay token");
    } */
  }
  // Cuando se finalice la sesion
  CerrarSesion(): void {
    this.tokenService.logOut();
    this.finSesion=true;// cuando se da cerrar sesion finSesion es verdadero
    /* console.log("tokenCerrar: "+this.tokenService.getToken());
    this.token = this.tokenService.getToken(); */
    window.location.reload(); 
    /* this.router.navigate(['/login']); */
  }
}