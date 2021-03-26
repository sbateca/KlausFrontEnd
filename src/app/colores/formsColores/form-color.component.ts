import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ColorService } from '../color.service';
import { Color } from '../color';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';



@Component({
  selector: 'app-form-color',
  templateUrl: './form-color.component.html',
  styleUrls: ['./form-color.component.css']
})



export class FormColorComponent implements OnInit {



  // el color donde quedará almacenada la información del formulario
  colorFormulario: Color = new Color();

  // el grupo de formularios
  formulario: FormGroup;

  colorSeleccionado = '';
  posicion = 'left';

  // nombre de la funcionalidad
  funcionalidad = 'Crear color';


  constructor(public referenciaVentanaModal: MatDialogRef<FormColorComponent>,
              @Inject(MAT_DIALOG_DATA) public idColor: number,
              private colorService: ColorService,
              private constructorFormulario: FormBuilder) { }

  ngOnInit(): void {
    this.crearFormulario();
    this.cargarColorEnFormulario();
  }


  crearFormulario(): void {
    this.formulario = this.constructorFormulario.group({
      nombre: ['', Validators.required],
      codigoColor: ['', Validators.required]
    });
  }


  cargarColorEnFormulario(): void {
    if (this.idColor) {
      this.colorService.getColorPorID(this.idColor).subscribe(resultado => {
        this.formulario.setValue({
          nombre: resultado.nombre,
          codigoColor: resultado.codigoColor
        });
      });
    }
  }


  asignarColor(): void {
    this.formulario.patchValue({
      codigoColor: this.colorSeleccionado
    });
  }


  guardar() {
    if ( this.formulario.invalid) {
      return this.formulario.markAllAsTouched;
    } else {
      this.referenciaVentanaModal.close(this.formulario.value);
    }
  }

  cancelarOperacion(): void {
      this.referenciaVentanaModal.close();
  }




  // -------- métodos de validación de campos del formulario

  get nombreColorNoValido() {
    return  this.formulario.get('nombre').invalid &&
            this.formulario.get('nombre').touched;
  }

  get codigoColorNoValido() {
    return  this.formulario.get('codigoColor').invalid &&
            this.formulario.get('codigoColor').touched;
  }

}
