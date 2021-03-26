import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UnidadMedidaService } from '../unidad-medida.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { UnidadMedida } from '../UnidadMedida';

@Component({
  selector: 'app-unidadmedida-form-component',
  templateUrl: './unidadmedida-form.component.html',
  styleUrls: ['./unidadmedida-form.component.css']
})
export class UnidadMedidaFormComponent implements OnInit {


  // variable en la cual se almacenará el formulario
  formulario: FormGroup;

  //nombre de la funcionalidad
  tituloVentana = '';

  // listado de categorías para el campo select del formulario
  listaCategorias: string[] = ['Longitud', 'Masa', 'Capacidad', 'Conteo'];

  // variable unidad de medida en la cual se almacenará la unidad cargada en formulario
  unidadMedida = new UnidadMedida();

  constructor(public referenciaVentanaModal: MatDialogRef<UnidadMedidaFormComponent>,
              protected unidadMedidaService: UnidadMedidaService,
              @Inject(MAT_DIALOG_DATA) public idUnidadMedida,
              private contructorFormulario: FormBuilder) { }

  ngOnInit(): void {
    this.asignarNombreFuncionalidad();
    this.construirFormulario();
    this.cargarInformacionEnFormulario();
  }

  asignarNombreFuncionalidad(): void {
    this.tituloVentana = this.idUnidadMedida ? 'Editar unidad de medida' : 'Agregar unidad de medida';
  }

  construirFormulario(): void {
    this.formulario = this.contructorFormulario.group({
      categoria:   ['',Validators.required],
      nombre:      ['', Validators.required],
      abreviatura: ['', Validators.required]
    });
  }

  cargarInformacionEnFormulario(): void {
    
    if(this.idUnidadMedida){

      this.unidadMedidaService.obtenerElementoPorID(this.idUnidadMedida).subscribe(resultado => {
        this.unidadMedida = resultado as UnidadMedida;
        this.formulario.setValue({
          nombre:      this.unidadMedida.nombre,
          categoria:   this.unidadMedida.categoria,
          abreviatura: this.unidadMedida.abreviatura
        });
      });
    }
  }



  asignarCategoria(evento: MatSelectChange): void {
    this.formulario.get('categoria').setValue(evento.value);
    console.log(this.formulario);
  }


  guardar(): void {
    if(this.formulario.invalid){
      this.formulario.markAllAsTouched();
    }else{
      this.referenciaVentanaModal.close(this.formulario.value);
    }
  }


  cancelarOperacion(): void {
    this.referenciaVentanaModal.close();
  }


  /************** validaciones ****************/

  campoNoValido(nombreCampo: string): boolean {
    return  this.formulario.get(nombreCampo).invalid &&
            this.formulario.get(nombreCampo).touched &&
            this.formulario.get(nombreCampo).errors.required;
  }

}
