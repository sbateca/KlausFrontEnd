import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductoService } from '../producto.service';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { Color } from '../../colores/color';
import { MaterialService } from '../../materiales/material.service';
import { Material } from '../../materiales/Material';
import { ColorService } from '../../colores/color.service';
import { startWith, map, flatMap } from 'rxjs/operators';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MatCheckboxModule, MatCheckboxChange } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { Pieza } from '../../piezas/pieza';
import { PiezaService } from '../../piezas/pieza.service';
/* import { RUTA_BASE } from '../../config/app'; */
import { Producto } from '../producto';
import { CommonService } from '../../common/common.service';



@Component({
  selector: 'app-producto-form',
  templateUrl: './producto-form.component.html',
  styleUrls: ['./producto-form.component.css']
})




export class ProductoFormComponent implements OnInit {

 /*  rutaBase = RUTA_BASE + '/producto'; */

  formulario: FormGroup;
  formularioPiezasGeneral: FormGroup;
  piezas: FormArray;

  /*
    Este Array contiene las piezas que son eliminadas en la vista para luego, al enviar formulario
    para luego eliminarlas de base de datos
  */
  piezasEliminar = new Array <Pieza>();

  funcionalidad = 'Agregar producto';

  // listado de colores
  listaColores = new Array<Color>();
  listaMateriales = new Array<Material>();

  // estas variables se usarán para el filtrado en el autocompletar
  listaFiltradaColores: Observable<Color[]>;
  listaFiltradaMateriales: Observable<Material[]>;

  // este array contiene las variables de control usadas en la genmeración de campos dinámicos
  arrayControlesPiezas = new FormArray([]);
  myControl = new FormControl();
  campoMaterialAutoComplete = new FormControl();

  // esta variable almacena la foto que ha sido seleccionada en el formulario
  private fotoSeleccionada: File;

  producto: Producto = new Producto();

  // esta variable se utiliza como una bandera para controlar la aparición o no del campo de typo File en el formulario
  cambiarFoto = false;

  constructor(public referenciaVentanaModal: MatDialogRef<ProductoFormComponent>,
              @Inject(MAT_DIALOG_DATA) public idProducto,
              protected productoService: ProductoService,
              private colorService: ColorService,
              private materialService: MaterialService,
              private constructorFormulario: FormBuilder,
              private barraNotificaciones: MatSnackBar,
              private piezaService: PiezaService) {}



  ngOnInit(): void {
    this.crearFormulario();
    this.obtenerColores();
    this.obtenerMateriales();
    this.filtrarAutoCompleteColor();
    this.filtrarAutoCompleteMaterial();
    if (this.idProducto) {
      this.cargarInformacionFormulario();
    }
  }



  // El método crearFormulario llena el FormGroup con las variablables que controlarán el formulario
  crearFormulario(): void {
    this.formulario = this.constructorFormulario.group({
      nombre: ['', Validators.required],
      referencia: ['', Validators.required],
      costo: ['', Validators.required],
      precioVenta: ['', Validators.required],
      activo: ['true'],

      piezas: this.constructorFormulario.array([])
    });

    /*
      Estos campos son auxiliares. Se encuentran en el formulario pero sirven sólamente
      para ir llenando el Array de Piezas que si hacen parte del formulario principal
    */
    this.formularioPiezasGeneral = this.constructorFormulario.group({
      nombrePiezaGeneral: ['', Validators.required],
      colorGeneral: ['', Validators.required],
      materialGeneral: ['', Validators.required],
      observacionGeneral: ['']
    });

  }

  /*
    El método crearPieza() instancia y genera los valores para una pieza.
    Por defecto, al ser creados se asignan los valores del formulario auxiliar, esto con
    la finalidad de ayudar en la creación de piezas a través del formulario
  */
  crearPieza(): FormGroup {
    return this.constructorFormulario.group({
      id: [''],
      nombrePieza: this.formularioPiezasGeneral.get('nombrePiezaGeneral').value,
      observacion: this.formularioPiezasGeneral.get('observacionGeneral').value,
      color: this.formularioPiezasGeneral.get('colorGeneral').value,
      material: this.formularioPiezasGeneral.get('materialGeneral').value
    });
  }


  /*
    El método agregarPieza() agrega un FormGroup de pieza al Array de piezas.
  */
  agregarPieza(): void {
    this.piezas = this.formulario.get('piezas') as FormArray;
    //console.log(this.piezas);
    this.piezas.push(this.crearPieza());
    //console.log(this.piezas);
  }





  cargarInformacionFormulario(): void {



    this.productoService.obtenerElementoPorID(this.idProducto).subscribe(resultado => {

        this.producto = resultado;


        // revisamos si tiene foto registrada para obtenerla, pues necesitamos mostrar el nombre y usar el archivo

        if (this.producto.fotoHashCode) {

          this.productoService.obtenerFotoProductoPorID(this.idProducto).subscribe( res => {
            
            // necesitamos asignar sólamente el cuerpo de la respuesta (la imagen)
            this.productoService.setFoto(this.convierteBlobAFile(res.body, resultado.nombreFoto)); // asignamos el archivo en la variable del service
            
            // asignamos el nombre extrayendo este atributo en el header de la petición
            //this.producto.nombreFoto = res.headers.get('Content-Disposition');

            console.log('producto cargado en formulario: ');
            console.log(this.producto);

            console.log('foto obtenida del service : ');
            console.log(this.productoService.obtenerFoto);
          });

        }


        this.piezas = this.formulario.get('piezas') as FormArray; // le asigno el FormArray

        resultado.piezas.forEach( pieza => { // se recorre cada una de las piezas del producto

          // armado del FormArray
          this.piezas.push(new FormGroup({
            id: new FormControl(pieza.id),
            nombrePieza: new FormControl(pieza.nombrePieza),
            observacion: new FormControl(pieza.observacion),
            color: new FormControl(pieza.color),
            material: new FormControl(pieza.material)
          }));
        });

        // llenado del formulario
        this.formulario.setValue({
          nombre: resultado.nombre,
          referencia: resultado.referencia,
          costo: resultado.costo,
          precioVenta: resultado. precioVenta,
          activo: resultado.activo,
          piezas: this.piezas
        });

    });
  }

  cargarPiezasformulario(): FormArray {
    return this.piezas;
  }


  abrirNotificacion(mensaje: string, accion: string) {
    this.barraNotificaciones.open(mensaje, accion, {
      duration: 2000,
    });
  }


  seleccionarFoto(evento: Event): void {
    this.fotoSeleccionada = (evento.target as HTMLInputElement).files[0];

    // asigno la foto en el service para compartirla entre componentes
    this.productoService.setFoto(this.fotoSeleccionada);
    
    // establezco el estado para controlar si se debe eliminar la foto existente
    this.productoService.setEstadoEliminarFoto(false);
  }


  get obtenerFoto(): File {
    return this.fotoSeleccionada;
  }


  guardar(): void {

  if (this.piezas == null) {
      this.abrirNotificacion('Debe agregar piezas', 'Cerrar');
    } else {
      if (this.piezas.length === 0) {
        this.abrirNotificacion('Debe agregar piezas', 'Cerrar');
      } else {
        if (this.formulario.invalid) {
          this.formulario.markAllAsTouched();
        } else {
          /*
            El Array piezasEliminar contiene las piezas que se eliminaron en el formulario de modificar
            pieza. Esto obliga a que estas piezas deban ser eliminadas de la base de datos antes de
            agregar las nuevas piezas para el producto.
          */
          this.piezasEliminar.forEach( pieza => {
            console.log('pieza a eliminar');
            console.log(pieza);
            this.piezaService.eliminarPieza(pieza).subscribe(respuesta => console.log(respuesta));
          });




          this.producto.nombre = this.formulario.get('nombre').value;
          this.producto.referencia = this.formulario.get('referencia').value;
          this.producto.costo = this.formulario.get('costo').value;
          this.producto.precioVenta = this.formulario.get('precioVenta').value;
          this.producto.activo = this.formulario.get('activo').value;
          this.producto.piezas = this.formulario.get('piezas').value;

          this.referenciaVentanaModal.close(this.producto);
        }
      }
    }


  }


  cancelarOperacion(): void {
    this.referenciaVentanaModal.close();
  }


  // este método es un getter del Array piezas
  get obtenerPiezas() {
    // console.log(this.formulario.get('piezas') as FormArray);
    return this.formulario.get('piezas') as FormArray;
  }


  // ------------------ métodos para el filtrado en el autocompletar ------------------ //



  /*
    Este método obtiene asigna obtiene dos tipos de listas de colores:
    - Color[]
    - Observable<Color[]>
  */
  obtenerColores(): void {
    this.colorService.getColores().subscribe(resultado => {
      this.listaColores = resultado;
    });

    // obtenemos la lista de Observable<Color[]>
    this.listaFiltradaColores = this.colorService.getColores();
  }



  obtenerMateriales(): void {
    this.materialService.obtenerMateriales().subscribe(resultado => {
      this.listaMateriales = resultado;
    });

    this.listaFiltradaMateriales = this.materialService.obtenerMateriales();
  }


  /* en esta parte se obtiene el FormControl "Color" que se encuentra en determinada posición
    del FormArray de piezas
      - Luego al cambiar de valor "valueChanges" se ejecuta el pipe() para modificar el flujo de datos
          - startWith('') --> agrega un vacío al inicio del flujo
          - con map() modifica el valor del flujo
    */
  filtrarAutoCompleteColor(): void {
    this.listaFiltradaColores = this.myControl.valueChanges.pipe(
      startWith('')/* ,
      map( valor => this.filtraArrayColor(valor) ) */
    );
  }

  filtrarAutoCompleteMaterial(): void {
    this.listaFiltradaMateriales = this.campoMaterialAutoComplete.valueChanges.pipe(
      startWith(''),
      map(valor => this.filtrarArrayMaterial(valor))
    );
  }


  private filtraArrayColor(nombre: string): Color[] {
    const nombreAFiltrar = nombre.toLowerCase().replace(/\s/g, ''); // paso el string a minúscula y quito espacios
    return this.listaColores.filter(resultado => resultado.nombre.toLowerCase().replace(/\s/g, '').includes(nombreAFiltrar));
  }

  private filtrarArrayMaterial(nombre: string): Material[] {
    const nombreAFiltrarMaterial = nombre.toLowerCase().replace(/\s/g, ''); // paso el string a minúscula y quito espacios
    return this.listaMateriales.filter(resultado => resultado.nombre.toLowerCase().replace(/\s/g, '').includes(nombreAFiltrarMaterial));
  }

  mostrarNombreColor(color: Color): string {
    return color && color.nombre ? color.nombre : '';
  }

  mostrarNombreMaterial(material: Material): string {
    return material && material.nombre ? material.nombre : '';
  }


  asignarSeleccionado(evento: MatOptionSelectionChange): void {

    const color = evento.source.value as Color;

    this.formularioPiezasGeneral.get('colorGeneral').patchValue({
      id: color.id,
      nombre: color.nombre,
      codigoColor: color.codigoColor
    });

    this.obtenerColores();
    this.filtrarAutoCompleteColor();
  }



  asignarSeleccionadoMaterial(evento: MatOptionSelectionChange): void {
    const material = evento.source.value as Material;

    this.formularioPiezasGeneral.get('materialGeneral').patchValue({
      id: material.id,
      nombre: material.nombre,
      descripcion: material.descripcion
    });
    this.obtenerMateriales();
    this.filtrarAutoCompleteMaterial();
  }



// ------------------ fín métodos para el filtrado en el autocompletar ------------------ //


  quitaPiezaArray(posicion: number): void {
    /* Antes de eliminar la pieza del Array esta se agrega a un Array auxiliar el cual
       permitirá realizar el proceso de eliminarción de base de datos*/
    this.piezasEliminar.push(this.piezas.controls[posicion].value);

    this.piezas.removeAt(posicion); // quito la pieza del FormArray
  }

  // ---------------------- validaciones ---------------------------- //

  get formularioNoValido(): boolean {
    return this.formulario.valid;
  }

  get nombreInvalido(): boolean {
    return  this.formulario.get('nombre').invalid &&
            this.formulario.get('nombre').touched;
  }

  get referenciaInvalida(): boolean {
    return  this.formulario.get('referencia').invalid &&
            this.formulario.get('referencia').touched;
  }

  get costoInvalido(): boolean {
    return  this.formulario.get('costo').invalid &&
            this.formulario.get('costo').touched;
  }

  get precioInvalido(): boolean {
    return this.formulario.get('precioVenta').invalid &&
            this.formulario.get('precioVenta').touched;
  }

  get colorInvalido(): boolean {
    return  this.formulario.get('colorGeneral').valid &&
            this.formulario.get('colorGeneral').touched;
  }

  getnombrePiezaInvalida(posicion: number): boolean {

    return  this.piezas.controls[posicion].get('nombre').valid &&
            this.piezas.controls[posicion].get('nombre').touched;
  }



  get formPiezaInvalida(): boolean {
    return  this.formularioPiezasGeneral.valid &&
            this.myControl.value !== '' &&
            (this.campoMaterialAutoComplete.value !== '');
  }


  resetearCampoImagen(): void {
    this.cambiarFoto = true;
    this.productoService.setEstadoEliminarFoto(true);
    this.productoService.setFoto(null);
  }



  convierteBlobAFile(theBlob: Blob, fileName:string): File  {
    var b: any = theBlob;
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    b.lastModifiedDate = new Date();
    b.name = fileName;

    //Cast to a File() type
    return <File>theBlob;
}


}
