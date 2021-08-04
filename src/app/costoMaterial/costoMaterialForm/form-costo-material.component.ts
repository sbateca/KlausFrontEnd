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

  materialRegistradoCosto: Material[];
  listaMaterialFiltrado: Material[] = new Array();

  constructor(private referenciaVentanaModal: MatDialogRef<FormCostoMaterialComponent>,
              @Inject(MAT_DIALOG_DATA) public idCostoMaterial: number,
              protected costoMaterialService: CostoMaterialService,
              protected unidadMedidaService: UnidadMedidaService,
              protected materialService: MaterialService,
              private constructorFormulario: FormBuilder,
              private barraNotificaciones: MatSnackBar) { }

  ngOnInit(): void {
    this.crearFormulario();
    this.cargarMateriales();
    this.cargarInformacionFormulario();
    this.asignarNombreFuncionalidad();
  }

  
  crearFormulario(): void {
    this.formulario = this.constructorFormulario.group({
      cantidadGeneral: ['', [Validators.required, Validators.min(0)]],
      materialGeneral: ['', Validators.required],
      costoGeneral: ['', [Validators.required, Validators.min(0)]],
      listaCostoMaterial: this.constructorFormulario.array([])
    });
  }




  /**
   * Este método obtiene el listado de materiales registrados en la tabla MATERIALES y las asigna a una variable de clase.
   * También llama al método que determina cual de los materiales de la lista no se encuentran registrados en costos
   * para generar una lista con estos elementos.
   * */ 
  cargarMateriales(): void {
    this.materialService.obtenerMateriales().subscribe( resultado => {
    this.listaMaterial = resultado;

    this.listaMaterial.forEach(elemento => {
      this.buscarMaterialEnListaRegistradosCostos(elemento);
    });
      
    });
  }


  
 /**
  * Este método busca un material en la lista de materiales registrados en los costos de materiales.
  * Si no se encuentra, quiere decir que el material no ha sido registrado
  * en la tabla de costos materiales, lo que significa que este debe pertenecer a la lista de materiales que
  * deben estar disponibles para ser seleccionados
  * @param material -> el material que se desea buscar en la lista de materiales registrados en costos.
  */
  buscarMaterialEnListaRegistradosCostos(material: Material): void {
   
    let encontrar: Material;
    
    this.costoMaterialService.obtenerMaterialRegistrado().subscribe( res => {

      this.materialRegistradoCosto = res;

      encontrar = this.materialRegistradoCosto.find( mat => mat.id == material.id);

      if(encontrar == undefined) this.listaMaterialFiltrado.push(material);

    });
  }



  // este método agrega los campos del FormGroup creado al FormArray del formulario
  agregarCostoMaterialFormulario(): void {
    this.listaCostosFormulario = this.formulario.get('listaCostoMaterial') as FormArray;
    this.listaCostosFormulario.push(this.crearCostoForm());

    // en esta parte se elimina el elemento material de la lista filtrada para evitar agregar elementos repetidos
    // también se limpia el formulario general
    let mate: Material = this.formulario.get('materialGeneral').value as Material;
    this.listaMaterialFiltrado = this.listaMaterialFiltrado.filter(mater => mater.id != mate.id);
    this.formulario.patchValue({
      cantidadGeneral: '',
      materialGeneral: '',
      costoGeneral: ''
    });
  }
  
  // este método crea un formGroup con los valores del formulario general
  crearCostoForm(): FormGroup {
    return this.constructorFormulario.group({
      cantidad: this.formulario.get('cantidadGeneral').value,
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

  elemento: Material;

  extraerMaterialEliminarformulario(i:number): void {
    let lista = this.formulario.get('listaCostoMaterial') as FormArray;
    this.elemento = lista.value[i].material;
    this.listaMaterialFiltrado.push(this.elemento);
    lista.removeAt(i);
    
    //this.eliminarCostoMaterialFormulario(i);
  }

  // este método elimina el FormGroup que se encuentra en la posición "i" del FormArray
  eliminarCostoMaterialFormulario(i: number): void {
    let lista = this.formulario.get('listaCostoMaterial') as FormArray;
    lista.removeAt(i);
  }


  cargarInformacionFormulario(): void {
    
    
    if(this.idCostoMaterial != null){
    
      this.costoMaterialService.obtenerElementoPorID(this.idCostoMaterial).subscribe(resultado => {
        
        this.costoMaterial = resultado;

        // agrego el material que ya ha sido registrado a la lista de los materiales que no han sido registrados con la finalidad de poder verlo
        // en caso que se requiera seleccionar otro 
        this.listaMaterialFiltrado.push(resultado.material);

        this.formulario.patchValue({
          cantidadGeneral: this.costoMaterial.cantidad,
          materialGeneral: this.costoMaterial.material,
          costoGeneral: this.costoMaterial.costo,
          listaCostoMaterial: ['']
        }); 
        
      });
    }
  }

  // este método realiza las peticiones POST respectivas para el registro de costos de materiales
  guardar(): void {
    
    if(!this.idCostoMaterial){

      if(this.obtenerFormArrayFormulario().controls.length == 0){
        this.abrirNotificacion('Debe agregar costos para los materiales', 'Cerrar');
      }else{
          console.log("costo material enviado al otro componente");
          console.log(this.listaCostosFormulario.value);
          this.referenciaVentanaModal.close(this.listaCostosFormulario.value);
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




  compararMateriales(material1: Material, material2: Material): boolean {
    return material1 && material2 ? material1.id === material2.id : material1 === material2;
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
