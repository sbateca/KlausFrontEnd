import { Component, HostListener } from '@angular/core';
import swal from 'sweetalert2';
import { AuthService } from './service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angularklausLeather';
  constructor(private authService: AuthService) {}

  // Se ejecuta cuando se destruye el servicio
 /*  ngOnDestroy() { */
  /*   alert(`¡Estoy saliendo de la aplicación!!`); */
    /* swal.fire({
      title: '¡Salir!',
      text: "¿Seguro que quieres salir destroy?",
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
/*   } */

  
 
  //El evento beforeunload se activa cada vez que el usuario abandona su página por cualquier motivo.
/*   @HostListener("window:beforeunload", [ "$event" ])
   beforeUnloadHander(event) { */
    /*
    if(event){
      swal.fire({
        title: '¡Salir!',
        text: "¿Seguro que quieres salir?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#ad3333',
        cancelButtonText: 'No, cancelar!',
        confirmButtonText: 'Si, Salir!'
      }).then((result) => {
          if (result.value) {
            console.log("Evento beforeunload");
            console.log(event);
          }
      });
    } */

  /* } */
  @HostListener('window:beforeunload')
  async ngOnDestroy(){
    /* await this.authService.AddItem().subscribe(); */
  }
 
 /*  @HostListener('window:unload', ['$event'])
  beforeunloadHandler(event) {
   
    if(event){
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
            console.log(event);
          }
      });
    } */
    /* event.preventDefault();
    event.returnValue = false;*/
  /* } */
}
