import { Component, OnInit } from '@angular/core';
import { TokenService } from '../service/token.service';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { NuevoUsuario } from '../modeloAcceso/nuevo-usuario';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})

export class RegistroComponent implements OnInit {
 
  nuevoUsuario: NuevoUsuario = new NuevoUsuario();
  nombre: string;
  nombreUsuario: string;
  correo: string;
  password: string;
  listaRoles = ['usuario', 'operador', 'propietario'];
  errMsj: string;
  esAdmin: boolean;
  camposFormulario: FormGroup;
  public eventoCheckbox: boolean = false;

  constructor(private tokenService: TokenService,
              private authService: AuthService,
              private router: Router,
              private constructorFormulario: FormBuilder,
              private toastr: ToastrService) { }

  ngOnInit() {
    this.esAdmin = this.tokenService.isAdmin();
    this.Creaformulario();
  }

   // Al darle en checked puede ver la contraseña
   EventoCheckboxPassword(evento){
    this.eventoCheckbox = evento;
  }

  // Crea formulario
  Creaformulario(){
    this.camposFormulario = this.constructorFormulario.group({
      nombre: ['', Validators.required],
      nombreUsuario: ['', Validators.required],
      password: ['', Validators.required],
      correo: ['', Validators.email],
      roles: ['',Validators.required]
    });
  }

  // Se registra en nuevo usuario
  Registrar(): void {

    this.nuevoUsuario = this.camposFormulario.value;
    // Se convierte roles a array 
    let rol= [];
    rol.push(this.camposFormulario.get('roles').value); 
    this.nuevoUsuario.roles = rol;
    
    this.authService.nuevo(this.nuevoUsuario).subscribe(
      data => {
        this.toastr.success('Cuenta Creada', 'OK', {
          timeOut: 5000, positionClass: 'toast-top-center'
        });
        this.router.navigate(['/login']);
      },
      err => {
        this.errMsj = err.error.mensaje;
        this.toastr.error(this.errMsj, 'Fail', {
          timeOut: 5000,  positionClass: 'toast-top-center',
        });
        window.localStorage.clear(); // Limpia lo que tengamos en sesion storage
      }
    );
  }
}