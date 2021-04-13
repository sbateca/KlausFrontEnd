import { Component, HostListener, OnInit } from "@angular/core";
import { TokenService } from "../service/token.service";
import swal from 'sweetalert2';
@Component({
  selector: "app-index",
  templateUrl: "./index.component.html",
  styleUrls: ["./index.component.css"],
})
export class IndexComponent implements OnInit {

  nombreUsuario: string;
  esAdmin: boolean;
  rol: string;

  constructor(private tokenService: TokenService) {}

  ngOnInit(): void {
    this.tokenService.getToken();
    this.nombreUsuario = this.tokenService.getUserName();
    this.esAdmin = this.tokenService.isAdmin();
    this.rol = this.tokenService.NombreRol();
  }
  ngOnDestroy() {
    /* alert(`¡Estoy saliendo de la aplicación!!`); */
    /* 
      swal.fire({
        title: '¡Salir!',
        text: "¿Seguro que quieres salir unload?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#ad3333',
        cancelButtonText: 'No, cancelar!',
        confirmButtonText: 'Si, Salir!'
      }).then((result) => {
          if (result.value) {
            console.log("Evento unload");
          }
      }); */
  }
   /*  @HostListener("window:beforeunload", [ "$event" ])
    beforeUnloadHander(event) {
      console.log("Evento beforeunload");
      console.log(event)
    } */
}
