import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TipoenviosService } from '../tipoenvios.service';
import { Tipoenvios } from '../tipoenvios';




@Component({
  selector: 'app-formtipoenvios',
  templateUrl: './formtipoenvios.component.html',
  styleUrls: ['./formtipoenvios.component.css']
})
export class FormtipoenviosComponent implements OnInit {

  public camposFormularioTipoEnvio: FormGroup ;
  public tipoenvio: Tipoenvios;

  constructor(private VentanaModal: MatDialogRef<FormtipoenviosComponent>, // Ventana Modal
              private constructorFormularioTipoEnvio: FormBuilder,
              private tipoenvioservice: TipoenviosService,
              @Inject(MAT_DIALOG_DATA) private idTipoEnvio: number)  { } // Formulario

  ngOnInit(): void {
    this.CrearFormularioTipoEnvio();
    this.cargarTipoEnvio();
  }
  // Formulario
  CrearFormularioTipoEnvio(): void {
    this.camposFormularioTipoEnvio = this.constructorFormularioTipoEnvio.group(
      {
        nombre: ['', Validators.required],
        descripcion: ['']
      }
    );
  }
  // Cancelar Formulario
  cancelarOperacion(): void {
    this.VentanaModal.close();
  }

  // Boton Envio de Formulario
   enviarformularioTipoEnvio() {
     if (this.camposFormularioTipoEnvio.invalid) {
       return this.camposFormularioTipoEnvio.markAllAsTouched();
     } else {
        this.VentanaModal.close(this.camposFormularioTipoEnvio.value);
     }
   }

   // Cargar Tipo Envio en formulario editar
   cargarTipoEnvio(): void {
     if (this.idTipoEnvio) {
       this.tipoenvioservice.verTipoEnvioPorId(this.idTipoEnvio).subscribe(respuesta => {
         this.tipoenvio = respuesta;
         console.log(this.tipoenvio);
         this.camposFormularioTipoEnvio.setValue({
            nombre: this.tipoenvio.nombre,
            descripcion: this.tipoenvio.descripcion
         });
       });
     }
   }

   get nombreNoValido() {
    return this.camposFormularioTipoEnvio.get('nombre').invalid &&
    this.camposFormularioTipoEnvio.get('nombre').touched;
  }

}
