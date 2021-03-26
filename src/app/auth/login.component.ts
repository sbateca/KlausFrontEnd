import { Component, OnInit } from '@angular/core';
import { LoginUsuario } from '../modeloAcceso/login-usuario';
import { TokenService } from '../service/token.service';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginUsuario: LoginUsuario; // objeto de LoginUsuario
  nombreUsuario: string; 
  password: string;
  errMsj: string;

  constructor( private tokenService: TokenService,
               private authService: AuthService,
               private router: Router,
               private toastr: ToastrService) { }

  ngOnInit(): void {}
  
  // Metodo OnLongin
  onLogin(): void {
    // Se inicializa el loginUsuario se usa el constructor 
    this.loginUsuario = new LoginUsuario(this.nombreUsuario, this.password);
    console.log("login")
    // Usamos el loginUsuario
    this.authService.login(this.loginUsuario).subscribe(
      data => {
        // Objeto tipo Dwt
        this.tokenService.setToken(data.token);
        this.router.navigate(['/']);// lo mandamos al index
      },
      err => {// En caso de error
       
        this.errMsj = err.error.message;
        this.toastr.error(this.errMsj, 'Fail', {
          timeOut: 3000,  positionClass: 'toast-top-center',
        });
      }
    );
  }

}
