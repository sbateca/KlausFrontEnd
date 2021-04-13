import { Component, OnInit } from '@angular/core';
import { LoginUsuario } from '../modeloAcceso/login-usuario';
import { TokenService } from '../service/token.service';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  nombreUsuario: string; 
  password: string;
  errMsj: string;
  rol: string;
  isLogged: boolean;
  esAdmin: boolean;
  esOperador: boolean;
  esUsuario: boolean;
  esPropietario: boolean;
  camposFormulario: FormGroup;
  iniciaSesion:boolean;
  public loginUsuario: LoginUsuario = new LoginUsuario();
  public eventoCheckbox: boolean = false;
  token: string;

  constructor( private tokenService: TokenService,
               private authService: AuthService,
               private router: Router,
               private constructorFormulario: FormBuilder,
               private toastr: ToastrService) { }
               
  ngOnInit(): void {
    this.esAdmin = this.tokenService.isAdmin();
    this.CrearFormulario();
  }

  // Al darle en checked puede ver la contraseña
  EventoCheckboxPassword(evento){
    this.eventoCheckbox = evento;
  }

  // Se crea el formulario
  CrearFormulario(): void {
    this.camposFormulario = this.constructorFormulario.group({
        nombreUsuario: ['', Validators.required],
        password: ['', Validators.required]
    });
  }

  // Metodo Longin
  Login(): void {

    this.loginUsuario.nombreUsuario = this.camposFormulario.get('nombreUsuario').value;
    this.loginUsuario.password = this.camposFormulario.get('password').value
  
    // Usamos el loginUsuario
    this.authService.login(this.loginUsuario).subscribe(data => {
      console.log(data);
        this.tokenService.setToken(data.token);// Objeto tipo Dwt
        window.location.reload(); // Se carga la pagina
        this.router.navigate(['/']);// queda mostrando al index 
      },
      err => {// En caso de error
        this.errMsj = err.error.message;
        this.toastr.error(this.errMsj, 'Fail', {
          timeOut: 10000,  positionClass: 'toast-top-center',
        });
        this.router.navigate(['/login']); // abre login
      });
      this.router.navigate(['/']);// queda mostrando al index 
  }
}
