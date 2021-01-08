import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CostoMaterialService } from '../costo-material.service';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { UnidadMedida } from '../../UnidadesMedidas/UnidadMedida';
import { UnidadMedidaService } from '../../UnidadesMedidas/unidad-medida.service';
import { MaterialService } from '../../materiales/material.service';
import { Material } from 'src/app/materiales/Material';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CostoMaterial } from '../CostoMaterial';


@Component({
  selector: 'app-form-costo-material',
  templateUrl: './form-costo-material.component.html',
  styleUrls: ['./form-costo-material.component.css']
})
export class FormCostoMaterialComponent implements OnInit {


  // nombre de la funcionalidad
  funcionalidad = '';

  // variable donde se almacena el formulario
  formulario: FormGroup;

  // variable que almacena el listado de unidades de medida registradas
  listaUnidadMedida: UnidadMedida[] = new Array();

  // variable que almacena el listado de materiales registrados
  listaMaterial: Material[]= new Array();

  //variable que almacena el costoFormulario que será cargado en el formulario
  costoMaterial: CostoMaterial;

  // variable que almacenará el listado de costos de material agregados a través del formulario
  listaCostosFormulario: FormArray;

  constructor(private referenciaVentanaModal: MatDialogRef<FormCostoMaterialComponent>,
              @Inject(MAT_DIALOG_DATA) public idCostoMaterial: number,
              protected costoMaterialService: CostoMaterialService,
              protected unidadMedidaService: UnidadMedidaService,
              protected materialService: MaterialService,
              private constructorFormulario: FormBuilder,
              private barraNotificaciones: MatSnackBar) { }

  ngOnInit(): void {
    this.crearFormulario();
    this.cargarUnidadesMedida();
    this.cargarMateriales();
    this.cargarInformacionFormulario();
    this.asignarNombreFuncionalidad();
  }

  
  crearFormulario(): void {
    this.formulario = this.constructorFormulario.group({
      cantidadGeneral: ['', [Validators.required, Validators.min(0)]],
      unidadMedidaGeneral: ['', Validators.required],
      materialGeneral: ['', Validators.required],
      costoGeneral: ['', [Validators.required, Validators.min(0)]],
      listaCostoMaterial: this.constructorFormulario.array([])
    });
  }

  // este método obtiene el listado de unidades de medida registradas y las asigna a una variable de clase
  cargarUnidadesMedida(): void {
    this.unidadMedidaService.listarElementos().subscribe( resultado => {
      this.listaUnidadMedida = resultado;
    });
  }

  // este método obtiene el listado de unidades de medida registradas y las asigna a una variable de clase
  cargarMateriales(): void {
    this.materialService.obtenerMateriales().subscribe( resultado => {
      this.listaMaterial = resultado;
    });
  }

  // este método agrega los campos del FormGroup creado al FormArray del formulario
  agregarCostoMaterialFormulario(): void {
    this.listaCostosFormulario = this.formulario.get('listaCostoMaterial') as FormArray;
    this.listaCostosFormulario.push(this.crearCostoForm());
  }
  
  // este método crea un formGroup con los valores del formulario general
  crearCostoForm(): FormGroup {
    return this.constructorFormulario.group({
      cantidad: this.formulario.get('cantidadGeneral').value,
      unidadMedida: this.formulario.get('unidadMedidaGeneral').value,
      material: this.formulario.get('materialGeneral').value,
      costo: this.formulario.get('costoGeneral').value
    });
  }

  asignarNombreFuncionalidad(): void {
    this.funcionalidad = this.idCostoMaterial ? 'Editar costo material' : 'Agregar costo material';
  }


  // este método retorna el FormArray del formulario
  obtenerFormArrayFormulario(): FormArray {
    return this.formulario.get('listaCostoMaterial') as FormArray;
  }

  // este método elimina el FormGroup que se encuentra en la posición "i" del FormArray
  eliminarCostoMaterialFormulario(i: number): void {
    let lista = this.formulario.get('listaCostoMaterial') as FormArray;
    lista.removeAt(i);
  }


  cargarInformacionFormulario(): void {

    console.log("carga información en formulario");
    
    
    if(this.idCostoMaterial != null){
    
      this.costoMaterialService.obtenerElementoPorID(this.idCostoMaterial).subscribe(resultado => {
        
        this.costoMaterial = resultado;

        console.log(this.obtenerUnidadMedidaDeArray(this.costoMaterial.unidadMedida.id));
        console.log(this.obtenerMaterialDeArray(this.costoMaterial.material.id));

        this.formulario.patchValue({
          cantidadGeneral: this.costoMaterial.cantidad,
          unidadMedidaGeneral: this.obtenerUnidadMedidaDeArray(this.costoMaterial.unidadMedida.id),
          materialGeneral: this.obtenerMaterialDeArray(this.costoMaterial.material.id),
          costoGeneral: this.costoMaterial.costo,
          listaCostoMaterial: ['']
        }); 

        console.log("formulario nuevo");
        console.log(this.formulario.value);

        
      });
    }
  }

  // este método realiza las peticiones POST respectivas para el registro de costos de materiales
  guardar(): void {
    
    if(!this.idCostoMaterial){

      if(this.obtenerFormArrayFormulario().controls.length == 0){
        this.abrirNotificacion('Debe agregar costos para los materiales', 'Cerrar');
      }else{
        if(this.formulario.invalid){
          this.formulario.markAllAsTouched();
        }else{
          this.referenciaVentanaModal.close(this.listaCostosFormulario.value);
          }
      }
    }else{
      if(this.formulario.invalid){
        this.formulario.markAllAsTouched();
      }else{

        /*
          si es un editar, hay que acomodar el objeto porque los nombres de los campos son
          diferentes
        */
        this.costoMaterial.cantidad = this.formulario.get('cantidadGeneral').value;
        this.costoMaterial.unidadMedida = this.formulario.get('unidadMedidaGeneral').value;
        this.costoMaterial.material = this.formulario.get('materialGeneral').value;
        this.costoMaterial.costo = this.formulario.get('costoGeneral').value;

        console.log("lo que se envía para el otro componente");
        console.log(this.costoMaterial);
        
        this.referenciaVentanaModal.close(this.costoMaterial);
        }
    }
    
  }

  // este método cierra la ventana modal
  cancelarOperacion(): void {
    this.referenciaVentanaModal.close();
  }

  // este método permite desplegar una ventana de notificación
  abrirNotificacion(mensaje: string, accion: string) {
    this.barraNotificaciones.open(mensaje, accion, {
      duration: 2000,
    });
  }

  /*
    estas funciones permiten obtener el objeto de los Array de objetos para ser mostrados
    en el formulario al momento de cargar la información
  */
  obtenerMaterialDeArray(id:number): Material {
    let mat: Material = this.listaMaterial.find( material => material.id === id);
    return mat;
  }

  obtenerUnidadMedidaDeArray(id:number): UnidadMedida {
    let unid: UnidadMedida = this.listaUnidadMedida.find(unidad => unidad.id === id);
    return unid;
  }

  // ------------------- validaciones de formulario ----------------------- //

  campoNoValido(nombreCampo: string): boolean {
    return  this.formulario.get(nombreCampo).errors != null &&
            this.formulario.get(nombreCampo).errors.required &&
            this.formulario.get(nombreCampo).touched;
  }

  campoNoMayorCero(nombreCampo: string):boolean {
    return  this.formulario.get(nombreCampo).errors != null &&
            this.formulario.get(nombreCampo).errors.min &&
            this.formulario.get(nombreCampo).touched;
  }

}
