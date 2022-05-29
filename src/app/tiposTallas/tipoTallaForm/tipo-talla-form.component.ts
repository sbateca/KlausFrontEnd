import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormTallaComponent } from '../../tallas/formsTallas/form-talla.component';
import { TipoTallaService } from '../tipo-talla.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TipoTalla } from '../TipoTalla';

// librerías para formularios de AngularMaterial
import {MatInputModule} from '@angular/material/input';




@Component({
  selector: 'app-tipo-talla-form',
  templateUrl: './tipo-talla-form.component.html',
  styleUrls: ['./tipo-talla-form.component.css']
})



export class TipoTallaFormComponent implements OnInit {


  // nombre de funcionalidad
  funcionalidad = '';

  // esta variable almacena el tipo de talla diligenciado en el formulario
  tipoTallaFormulario: TipoTalla = new TipoTalla();

  // variable para agrupar campos de formularios reactivos
  formulario: FormGroup;

  constructor(public referenciaVentanaModal: MatDialogRef<FormTallaComponent>,
              private tipoTallaService: TipoTallaService,
              @Inject(MAT_DIALOG_DATA) public idTipoTalla,
              private constructorFormularios: FormBuilder) { }

  ngOnInit(): void {
    this.construirFormulario();
    this.cargarInformacionEnformulario();
    this.asignarNombreFuncionalidad();
  }



  asignarNombreFuncionalidad() {
    this.funcionalidad = this.idTipoTalla ? 'Editar tipo de talla' : 'Agregar tipo de talla';
  }


  cargarInformacionEnformulario(): void {
    if (this.idTipoTalla) {
      this.tipoTallaService.obtenerTipoTallaPorID(this.idTipoTalla).subscribe(resultado => {
        this.formulario.setValue({
          tipoTalla: resultado.tipoTalla,
          descripcion: resultado.descripcion
        });
      });
    }
  }


  construirFormulario(): void {
    this.formulario = this.constructorFormularios.group({
      tipoTalla:         ['', Validators.required],
      descripcion:  ['']
    });
  }



  guardar(): void {
    if (this.formulario.invalid) {
      // si el formulario es inválido se marcan los campos como tocados
      this.formulario.markAllAsTouched();
    } else {
      this.referenciaVentanaModal.close(this.formulario.value);
    }
  }

  cancelarOperacion(): void {
    this.referenciaVentanaModal.close();
  }



  // --------- validaciones de formulario ------------- //
  get tipoTallaNoValido() {
    return this.formulario.get('tipoTalla').invalid &&
    this.formulario.get('tipoTalla').touched;
  }

  get descripcionNoValida() {
    return this.formulario.get('descripcion').invalid && this.formulario.touched;
  }

  limpiarEspaciosEnBlanco(evento: any, nombreCampo: string) {
    this.formulario.get(nombreCampo).setValue(
      String(evento.target.value).trim()
    );
  }

}
