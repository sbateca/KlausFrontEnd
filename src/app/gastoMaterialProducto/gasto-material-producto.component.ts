import { Component, ComponentFactoryResolver, Inject, OnInit } from '@angular/core';
import { GastoMaterialProductoService } from './gasto-material-producto.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GastoMaterialProducto } from './gastoMaterialProducto';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Producto } from '../productos/producto';
import { ProductoService } from '../productos/producto.service';
import { TipoTallaService } from '../tiposTallas/tipo-talla.service';
import { TipoTalla } from '../tiposTallas/TipoTalla';
import { Talla } from '../tallas/talla';
import { MatSelectChange } from '@angular/material/select';
import { CostoMaterial } from '../costoMaterial/CostoMaterial';
import { CostoMaterialService } from '../costoMaterial/costo-material.service';
import { Pieza } from '../piezas/pieza';
import { Material } from '../materiales/Material';
import { TallaService } from '../tallas/talla.service';

@Component({
  selector: 'app-gasto-material-producto',
  templateUrl: './gasto-material-producto.component.html',
  styleUrls: ['./gasto-material-producto.component.css']
})
export class GastoMaterialProductoComponent implements OnInit {


  // variable donde se almacena el producto registrado en Base de datos
  productoBD: Producto;

  // variable que almacena los tipo de talla registrados en Base de datos
  listaTipoTallas: TipoTalla[];

  // variable que almacena el listado de tallas de un tipo específico
  listaTallas: Talla[];

  // variable que almacena la lista de tallas que van a ser eliminadas
  listaTallasEliminar = new Array();

  // variable donde se almacena el formulario
  formulario: FormGroup;

  // variable donde se almacena el array de piezas de formulario
  listaPiezasFormGeneral: FormArray;

  // variable donde se almacena el listado de costos de materiales
  listaCostosMateriales: CostoMaterial[];

  // costo material
  costoMaterial: CostoMaterial;

  // array de FormArray de gasto
  listaGastoMaterial: FormArray;

  // FormArray de gasto de tallas
  listaTallasForm: FormArray;

  //array de importes
  listaImportes: number[] = new Array();

  constructor(protected gastoMaterialProductoService: GastoMaterialProductoService,
              protected productoService: ProductoService,
              private tipoTallaService: TipoTallaService,
              private tallaService: TallaService,
              protected costoMaterialService: CostoMaterialService,
              public referenciaVentanaModal: MatDialogRef<GastoMaterialProducto>,
              @Inject(MAT_DIALOG_DATA) public idProducto,
              private constructorFormulario: FormBuilder) { }

  ngOnInit(): void {
    this.obtenerProducto();
    this.obtenerCostosMateriales();
    this.obtenerTipoTallas();
    
    this.construirFormulario();
    this.crearListaFormPiezas();
  
    this.cargarDatosEnFormulario();

  }


  obtenerProducto(): void {
    if(this.idProducto){
      this.productoService.obtenerElementoPorID(this.idProducto).subscribe( respuesta => {
        this.productoBD = respuesta;
      });
    }
  }


  obtenerTipoTallas(): void {
    this.tipoTallaService.obtenerTipoTallas().subscribe( respuesta => {
      this.listaTipoTallas = respuesta;
    });
  }

  /**
   * Este método instancia el FormGroup (formulario) con los controles (campos) requeridos
   */
  construirFormulario(): void {
    this.formulario = this.constructorFormulario.group({
      tipoTallaGeneral: ['', Validators.required],
      tallaGeneral: ['', Validators.required],
      listaPiezasFormGeneral: this.constructorFormulario.array([]),      
      listaTallasForm: this.constructorFormulario.array([])
    });
  }

  /**
   * este método retorna el FormArray de acuerdo a su nombre
   * @param nombreCampo Nombre del FormArray a extraer del formulario
   * @returns El FormArray extraído del formulario
   */
  obtenerFormArray(nombreCampo: string): FormArray {
    return this.formulario.get(nombreCampo) as FormArray;
  }

  /**
   * Este método crea la lista de Controles para los campos de las piezas del formulario 
   */
  crearListaFormPiezas():void {
    this.productoService.obtenerElementoPorID(this.idProducto).subscribe( respuesta => {
      this.productoBD = respuesta;
      this.productoBD.piezas.forEach( pieza => {
        this.listaPiezasFormGeneral = this.formulario.get('listaPiezasFormGeneral') as FormArray;
        this.listaPiezasFormGeneral.push(this.crearFormPieza(pieza));
      });
    });
  }

  /**
   * Este método crea un formGroup el cual será agregado al FormArray
   * @param pieza Del objeto pieza se extraerá la información para llenar los campos del formGroup
   * @returns Un FormGoup con los campos de la pieza
   */
  crearFormPieza(pieza: Pieza): FormGroup {
    this.listaImportes.push(0); // aprovechamos para agregar las posiciones al Array de importes

    return this.constructorFormulario.group({
      piezaGeneral: pieza,
      materialGeneral: pieza.material,
      cantidadGeneral: ['', [Validators.required,Validators.min(0)]],
      unidadMedidaGeneral:  this.obtenerCostoPorIdMaterial(pieza.material.id),
      valorGeneral: ['']
    });
    
  }





  agregarGasto() {   
    this.listaTallasForm = this.formulario.get('listaTallasForm') as FormArray;
    this.listaTallasForm.push(this.crearCamposGasto());
    this.filtrarListaTallas();
  }


  crearCamposGasto(): FormGroup {

    let listaGastoMaterial = new FormArray([]);
    
    // copiamos los campos del formulario general al formulario de gastos
    this.listaPiezasFormGeneral.controls.forEach( piezaform => {

      // obtenemos el costo del material
      let costo: CostoMaterial = this.obtenerCostoPorIdMaterial((piezaform.get('materialGeneral').value).id);
      
      listaGastoMaterial.push(this.constructorFormulario.group({
        id:[''],
        producto: this.productoBD,
        tipoTalla: this.formulario.get('tipoTallaGeneral').value,
        talla: this.formulario.get('tallaGeneral').value,
        pieza: piezaform.get('piezaGeneral').value,
        material: piezaform.get('materialGeneral').value,
        cantidad: piezaform.get('cantidadGeneral').value,
        unidadMedida: costo.material.unidadMedida,
        valor: piezaform.get('valorGeneral').value
      }));      
    });

    return this.constructorFormulario.group({
      listaGastoMaterial:listaGastoMaterial,
      valorTotal:this.calcularValorTotal()
    });
    
  }
  

  convertirAFormArray(formArray: FormArray): FormArray {
    return formArray as FormArray;
  }

  obtenerArrayListaTallas(): FormArray {
    return this.formulario.get('listaTallasForm') as FormArray;
  }




  
  listaGastoTallasEliminar = new Array(); // esta variable contiene los ID de los gastos talla a eliminar de base de datos
  
  /**
   * Este método elimina El formGroup correspondiente a los campos de una talla.
   * También realiza un control en el manejo de las tallas que se eliminan del formulario permitiendo volverlas a seleccionar.
   * @param posicion la posición donde se encuentra el FormGroup a eliminar
   */
  eliminarGastoMaterial(posicion: number): void {

    // obtenemos la talla que fué eliminada del formulario para agregarla a la lista de tallas
    let listaTallas = this.obtenerFormArray('listaTallasForm');
    let listaGastoMaterial = listaTallas.controls[posicion].get('listaGastoMaterial') as FormArray; // obtenemos la lista de gastos de una posición específica del Array de tallas
    let talla:Talla = listaGastoMaterial.controls[0].get('talla').value; // obtenemos la talla del primer elemento de la lista de gastos (todos los elementos de gasto tienen la misma talla)
    let tipoTalla:TipoTalla = listaGastoMaterial.controls[0].get('tipoTalla').value; // obtenemos el tipo de talla (todos los elementos de la talla tienen el mismo tipo de talla)

    console.log('a eliminar');
    console.log(listaGastoMaterial);

    talla.tipoTalla = tipoTalla; // importante para validar si debe ser mostrado. También para saber cual debe ser eliminado

    /**
     * El elemento se agrega sólo si la lista de tipo de tallas ha sido seleccionada en el formulario.
     * Si no se selecciona no pasa nada. El método cargarTallasPorTipo agrega al final las tallas del Array de tallas eliminadas
     */

    if(this.formulario.get('tipoTallaGeneral').dirty == true){ // si ha cambiado el valor de este campo
      
      // debemos agregar la talla siempre y cuando se haya seleccionado el tipo de talla al cual pertenece la talla
      if(this.formulario.get('tipoTallaGeneral').value == tipoTalla){
        this.listaTallas.push(talla); // agregamos la talla a la lista de tallas del formulario
      }
    }

    /**
     * Organizo un array con las tallas que deben ser eliminadas, en caso de querer eliminar una que ya se encuentre registrada.
     * quiere decir que al agregar o modificar un formulario es probable que haya eliminado también tallas, por lo tanto debo hacer un DELETE
     * y debo saber cuales son las que se deben eliminar.
     */
    this.listaTallasEliminar.push(talla);

    // agregamos los a la lista para que sean eliminados de base de datos al enviar el formulario
    listaGastoMaterial.controls.forEach(gasto => {
      this.listaGastoTallasEliminar.push(gasto.value.id);
    });

    console.log('listaaaaaaaa');
    console.log(this.listaGastoTallasEliminar);

    // ordenamos la lista de tallas
    this.listaTallas.sort( function(t1, t2){
      return t1.talla - t2.talla;
    })

    this.obtenerArrayListaTallas().removeAt(posicion); // eliminamos la talla del formulario
  }







/**
 * Este método asigna el listado de tallas dependiendo del tipo de talla seleccionado
 * @param e Es un evento de cambio de selección del select
 */
  cargarTallasPorTipo(e:MatSelectChange): void {
    
    this.tallaService.obtenerTallasNoAsignadasGastoMaterial(e.value.id,this.idProducto).subscribe( resultado => {
      this.listaTallas = resultado; // se asignan las tallas (de paso se refresca el array de tallas)
      
      // en esta parte se agregan las tallas que fueron eliminadas en el formulario, 
      // pues al refescarse la lista estas deben aparecer en la lista de tallas para que puedan ser seleccionadas en el formulario
      this.listaTallasEliminar.forEach(talla => {
        // en esta parte sólo se agrega a la lista las tallas que corresponden al mismo tipo de talla que fué seleccionado
        if(e.value.id == talla.tipoTalla.id){
          this.listaTallas.push(talla);
        }
      });

    });
  }


  /**
   * Este método obtiene el listado de costos de materiales del backend
   */
  obtenerCostosMateriales(): void {
    this.costoMaterialService.listarElementos().subscribe( resultado => {
      this.listaCostosMateriales = resultado;
    });
  }

  /**
   * Este método obtiene el CostoMaterial de un Array de CostoMaterial de acuerdo al ID del Material
   * @param idMaterial ID del material que será extraído del Array de costos materiales
   * @returns Objeto CostoMaterial extraído del Array
   */
  obtenerCostoPorIdMaterial(idMaterial: number): CostoMaterial {
    
    let cMat: CostoMaterial;

    if(this.listaCostosMateriales == null || this.listaCostosMateriales == undefined){
      
      this.costoMaterialService.obtenerCostoMaterialidMaterial(idMaterial).subscribe( res => {
        cMat= res;
      });
    } else {

      cMat = this.listaCostosMateriales != undefined ||  this.listaCostosMateriales != null ? this.listaCostosMateriales.find(costoMaterial => costoMaterial.material.id == idMaterial): null;
    }
    return cMat;
  }
  

  /**
   * Este método calcula el valor correspondiente a la cantidad de material que se ha proporcionado en el formulario
   * @param posicion La posición del Control en el Array del formulario
   * @param pieza La pieza a la cual se va a calcular el valor
   */
  calcularValor(posicion: number, pieza: Pieza): void {
    
    if(pieza.material != null || pieza.material != undefined){
    
      this.costoMaterialService.obtenerCostoMaterialidMaterial(pieza.material.id).subscribe( resultado => {
        this.costoMaterial = resultado;
  
        let cantidadACalcular = (this.formulario.get('listaPiezasFormGeneral') as FormArray).controls[posicion].get('cantidadGeneral').value;
        let valorRegistradoMaterial = this.costoMaterial.costo;
        let cantidadRegistrada = this.costoMaterial.cantidad;
        
        let importe = (cantidadACalcular * valorRegistradoMaterial) / cantidadRegistrada;
        
        (this.formulario.get('listaPiezasFormGeneral') as FormArray).controls[posicion].get('valorGeneral').setValue(importe);

        // asigno el importe al array de importes
        this.listaImportes[posicion] = importe;
      });
    }
  }


  /**
   * Este método calcula realiza la suma de valores de las piezas que se encuentran en el Array de importes
   * @returns El total de la suma del Array de importes
   */
  calcularValorTotal(): number {
    let total=0;
    this.listaImportes.forEach(elemento => {
      total = total + elemento;
    });
    return total;
  }


  /**
   * Este método realiza un filtro al array de Tallas obtenido de base de datos.
   * El filtro lo realiza dejando las tallas que no han sido agregadas al formulario
   */
  filtrarListaTallas(): void {
    let listaTallas = this.obtenerFormArray('listaTallasForm'); //
    let listaGastoMaterial = listaTallas.controls[listaTallas.length-1].get('listaGastoMaterial') as FormArray; // obtenemos ls lista de gastos del último elemento de la lista de tallas
    let talla = listaGastoMaterial.controls[0].get('talla').value; // obtenemos la talla del primer elemento de la lista de gastos (todos los elementos de gasto tienen la misma talla)

    this.listaTallas = this.listaTallas.filter( elementoTalla => elementoTalla.id != talla.id );

    // limpiamos el campos en el formulario
    this.formulario.get('tallaGeneral').setValue(null);
  }



  /**
   * Este método envía la información del formulario al componente producto.
   * Antes de ello, elimina de base de datos las tallas que el usuario haya eliminado
   * del formulario
   */
  enviarFormulario(): void {

    //si hay gasto tallas por eliminar, se eliminan de la base de datos
    if(this.listaGastoTallasEliminar.length > 0){
      this.listaGastoTallasEliminar.forEach(gasto => {
        this.gastoMaterialProductoService.eliminaElemento(gasto).subscribe();
      });
    }

    this.referenciaVentanaModal.close(this.obtenerArrayListaTallas().value);    
  }



  /**
   * Este método carga los datos en el formulario para que se puedan editar. 
   * Para facilitar la carga de los datos del formulario se va a obtener el listado de
   * tipos de talla, pues la estructura del formulario se encuentra de esta manera
   */
    cargarDatosEnFormulario(): void {

      if(this.idProducto) {

        this.tipoTallaService.obtenerTipoTallas().subscribe( resultado => {
          this.listaTipoTallas = resultado;
          
          // recorremos el array de tipoTalla para obtener los array de tallas y filtrar 
          // las tallas que se han insertado
          let listaTallasAgregadas = new Array();
          let listaTallasNoAgregadas = new Array();

          // selecciono por defecto el tipo de talla
          this.formulario.get('tipoTallaGeneral').setValue(this.listaTipoTallas);

          this.listaTipoTallas.forEach(tipoTalla => {
            let listaTallas = tipoTalla.tallas; // saco la lista de tallas de un tipo talla
            
            // la lista de tallas agregadas sólo deben ser las del producto seleccionado
           // listaTallasAgregadas = listaTallas.filter(talla => talla.listaGastoMaterialProducto.length != 0 && this.determinarExisteGastoPorProducto(talla));
            
            listaTallasAgregadas = this.ajustarArrayTallasTallasConGastoPorProducto(tipoTalla.tallas);

            listaTallasNoAgregadas = listaTallas.filter(talla => talla.listaGastoMaterialProducto.length == 0 );

            // asigno las tallas no agregadas al listado del select para que se puedan seguir seleccionando
            this.listaTallas = listaTallasNoAgregadas;

            // recorremos el listado de tallas para agregarlos al formulario
            if(listaTallasAgregadas.length > 0){
              
              listaTallasAgregadas.forEach(talla => {
               let listaTallasFormulario = this.formulario.get('listaTallasForm') as FormArray;
               
               // Se agrega al formulario de tallas un FormArray de GastoMaterial y la variable de los totales
               let listaGasto = this.cargarArrayGasto(talla.listaGastoMaterialProducto, tipoTalla, talla);
               let totalTalla = this.cargarValorTotal(talla.listaGastoMaterialProducto);
              
               let camposCargados = this.constructorFormulario.group({
                  listaGastoMaterial:listaGasto,
                  valorTotal:totalTalla
               });
              listaTallasFormulario.push(camposCargados);
             });
            }
            

          });
        });

        this.productoService.obtenerElementoPorID(this.idProducto).subscribe(resultado => {
          this.productoBD = resultado;
        });
      }

      console.log(this.formulario);
    }


    /**
     * Este es un método que arma un Form Array con los parámetros que recibe.
     * @param listaGasto la lista de gastos que se asocian con una talla
     * @param tipoTalla el tipo de talla
     * @param talla La talla
     */
    cargarArrayGasto(listaGasto, tipoTalla: TipoTalla, talla: Talla): FormArray {
      let gasto = new FormArray([]);
      
      listaGasto.forEach(elementoGasto => {

        gasto.push(this.constructorFormulario.group({
          id:elementoGasto.id,
          producto: elementoGasto.producto,
          tipoTalla: tipoTalla,
          talla: talla,
          pieza: elementoGasto.pieza,
          material: elementoGasto.pieza.material,
          cantidad: elementoGasto.cantidad,
          unidadMedida: elementoGasto.unidadMedida,
          valor: elementoGasto.valor
        }));      
      });

      return gasto;
    }



    /**
     * Este método recorre cada una de las tallas donde para cada una de ellas
     * revisa el Array de Gasto Material dejando sólamente (filtro) los elementos de gasto
     * que tienene asociado el producto seleccionado. Es un "filtro" que se aplica al array
     * de Gasto material.
     * @param listaTallas la lista de tallas a procesar
     * @returns El array de tallas ajustado 
     */
    ajustarArrayTallasTallasConGastoPorProducto(listaTallas: Talla[]): Talla[] {

      let tallas: Talla[] = new Array();

      listaTallas.forEach(talla => {

        let gastos: GastoMaterialProducto[] = new Array();
        talla.listaGastoMaterialProducto.forEach( gasto => {
          if(gasto.producto.id == this.idProducto){
            gastos.push(gasto);
          }
        });

        if(gastos.length > 0){
          talla.listaGastoMaterialProducto = gastos;
          tallas.push(talla);
        }

      });

      return tallas;

    }




    /**
     * Este método permite determinar si una talla tiene dentro de la lista de gastos
     * el producto que se ha seleccionado (que viene del componente Producto).
     * @param talla la talla que contiene una lista GastoProducto, donde cada uno de 
     * los elememtos contiene un producto el cual va a ser consultado
     */
    determinarExisteGastoPorProducto(talla: Talla): boolean {
      let existe = false;

      talla.listaGastoMaterialProducto.forEach( gasto => {
        if(gasto.producto.id == this.idProducto) existe = true;
      });

      return existe;
    }


    /**
     * Esta función recorre el array de lista gasto de una talla y realiza la
     * suma de los valores para determinar el total por talla
     * @param listaGasto el listado de gasto de tallas que contiene una talla
     */
    cargarValorTotal(listaGasto): number {
      let total = 0;
      listaGasto.forEach(elemento => {
        total = total + elemento.valor;
      });
      return total;
    }



  buscarTallaEnArray(): boolean {
    let encontro = false;
    let listaTallasForm: FormArray;
    listaTallasForm = this.formulario.get('listaTallasForm') as FormArray;
    
    listaTallasForm.controls.forEach(elemento => {
      let listaGasto: FormArray = elemento.get('listaGastoMaterial') as FormArray;
      listaGasto.controls.forEach( elemento => {
        
      });
    });
    return encontro;
  }
  


  /**
   * Este método cierra le ventana modal
   */
  cerrarVentana(): void {
    this.referenciaVentanaModal.close();
  }



   // ------------------- validaciones de formulario ----------------------- //

   campoNoValido(nombreCampo: string): boolean {
    return  this.formulario.get(nombreCampo).errors != null &&
            this.formulario.get(nombreCampo).errors.required &&
            this.formulario.get(nombreCampo).touched;
  }

  formGeneralNoValido(): boolean {
    return  this.campoNoValido('tipoTallaGeneral') ||
            this.campoNoValido('tallaGeneral') ||
            this.formulario.get('listaPiezasFormGeneral').invalid ||
            this.productoBD.piezas.length == 0;
  }

  campoCantidadNoValido(posicion: number): boolean {
    let evaluacion = false;
    let arrayPiezas = this.obtenerFormArray('listaPiezasFormGeneral') as FormArray;
    let cantidad = arrayPiezas.controls[posicion].get('cantidadGeneral').value;
    let invalido = arrayPiezas.controls[posicion].get('cantidadGeneral').invalid;

    if(cantidad<=0 || invalido) evaluacion = true;
    return evaluacion;
  }

  listaTallasFormVacia(): boolean {
    return this.obtenerArrayListaTallas().controls.length === 0 ? true : false;
  }

}
