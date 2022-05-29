import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialService } from '../material.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Material } from '../Material';
import { MatInputModule } from '@angular/material/input';
import { UnidadMedidaService } from '../../UnidadesMedidas/unidad-medida.service';
import { UnidadMedida } from '../../UnidadesMedidas/UnidadMedida';




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

  // en esta variable se almacenará el listado de unidades de medida
  listaUnidadesMedida: UnidadMedida[];

  constructor(public referenciaVentana: MatDialogRef<MaterialFormComponent>,
              @Inject(MAT_DIALOG_DATA)public idMaterial,
              private materialService: MaterialService,
              private unidadMedidaService: UnidadMedidaService,
              private constructorformularios: FormBuilder) { }

  ngOnInit(): void {
    this.crearFormulario();
    this.obtenerUnidadesMedida();
    this.cargarDatosEnFormulario();
    this.cargarNombreFuncionalidad();
  }



  crearFormulario(): void {
    this.formulario = this.constructorformularios.group({
      nombre:      ['', Validators.required],
      descripcion: [''],
      unidadMedida: ['', Validators.required],
      cantidad: ['', [Validators.required, Validators.min(0.000000000001)]]
    });
  }

  cargarDatosEnFormulario(): void {
    if (this.idMaterial) {
      this.materialService.obtenerMaterialPorID(this.idMaterial).subscribe( resultado => {

        console.log(resultado);

        this.formulario.setValue({
          nombre: resultado.nombre,
          descripcion: resultado.descripcion,
          unidadMedida: resultado.unidadMedida,
          cantidad: resultado.cantidad
        });

        console.log(this.formulario);
      });
    }
  }

  cargarNombreFuncionalidad(): void {
    this.funcionalidad = this.idMaterial ? 'Editar Material' : 'Agregar Material';
  }

  obtenerUnidadesMedida(): void {
    this.unidadMedidaService.listarElementos().subscribe( resultado => {
      this.listaUnidadesMedida = resultado;
    });
  }


  guardar(): void {
    // asigno el material del formulario para ayudarme en la validación del botón
    this.materialFormulario = this.formulario.value;
    this.referenciaVentana.close(this.formulario.value);
  }

  cancelarOperacion(): void {
      this.referenciaVentana.close();
  }

  compararUnidadesMedidaSelect(unidad1: UnidadMedida, unidad2: UnidadMedida): boolean {
    return unidad1 && unidad2 ? unidad1.id === unidad2.id : unidad1 === unidad2;
  }




  // --------------- validación del formulario ----------------------------- //

  get nombreNoValido(): boolean {
    return  this.formulario.get('nombre').invalid &&
            this.formulario.get('nombre').touched;
  }


  get cantidadNoValida(): number {
    
    let validar:number = -1;
    
    if(this.formulario.get('cantidad').value <= 0) validar = 1;

    if(this.formulario.get('cantidad').value == '' || 
      this.formulario.get('cantidad').value == null ||
      this.formulario.get('cantidad').value == undefined) validar = 0;

      console.log(validar);

    return  validar;
  }



  limpiarEspaciosEnBlanco(evento: any, nombreCampo: string) {
    this.formulario.get(nombreCampo).setValue(
      String(evento.target.value).trim()
    );
}


}
