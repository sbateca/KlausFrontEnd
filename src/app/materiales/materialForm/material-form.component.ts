import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialService } from '../material.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Material } from '../Material';
import { MatInputModule } from '@angular/material/input';




@Component({
  selector: 'app-material-form',
  templateUrl: './material-form.component.html',
  styleUrls: ['./material-form.component.css']
})


export class MaterialFormComponent implements OnInit {

  // nombre de la funcionalidad
  funcionalidad = '';

  // variable para el grupo de campos del formulario
  formulario: FormGroup;

  // en esta variable quedará almacenado el material diligenciado en el formulario
  materialFormulario: Material = new Material();


  constructor(public referenciaVentana: MatDialogRef<MaterialFormComponent>,
              @Inject(MAT_DIALOG_DATA)public idMaterial,
              private materialService: MaterialService,
              private constructorformularios: FormBuilder) { }

  ngOnInit(): void {
    this.crearFormulario();
    this.cargarDatosEnFormulario();
    this.cargarNombreFuncionalidad();
  }



  crearFormulario(): void {
    this.formulario = this.constructorformularios.group({
      nombre:      ['', Validators.required],
      descripcion: ['']
    });
  }

  cargarDatosEnFormulario(): void {
    if (this.idMaterial) {
      this.materialService.obtenerMaterialPorID(this.idMaterial).subscribe( resultado => {
        this.formulario.setValue({
          nombre: resultado.nombre,
          descripcion: resultado.descripcion
        });
      });
    }
  }

  cargarNombreFuncionalidad(): void {
    this.funcionalidad = this.idMaterial ? 'Editar Material' : 'Agregar Material';
  }


  guardar(): void {
    // asigno el material del formulario para ayudarme en la validación del botón
    this.materialFormulario = this.formulario.value;
    this.referenciaVentana.close(this.formulario.value);
  }

  cancelarOperacion(): void {
      this.referenciaVentana.close();
  }



  // --------------- validación del formulario ----------------------------- //

  get nombreNoValido(): boolean {
    return  this.formulario.get('nombre').invalid &&
            this.formulario.get('nombre').touched;
  }


}
