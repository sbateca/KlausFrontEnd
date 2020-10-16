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



@Component({
  selector: 'app-producto-form',
  templateUrl: './producto-form.component.html',
  styleUrls: ['./producto-form.component.css']
})




export class ProductoFormComponent implements OnInit {



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

  pocisionArray = -1;

  constructor(public referenciaVentanaModal: MatDialogRef<ProductoFormComponent>,
              @Inject(MAT_DIALOG_DATA) public idProducto,
              private productoService: ProductoService,
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

  crearFormulario(): void {
    this.formulario = this.constructorFormulario.group({
      nombre: ['', Validators.required],
      referencia: ['', Validators.required],
      costo: ['', Validators.required],
      precioVenta: ['', Validators.required],
      activo: ['true'],

      piezas: this.constructorFormulario.array([])
    });

    this.formularioPiezasGeneral = this.constructorFormulario.group({
      nombrePiezaGeneral: ['', Validators.required],
      colorGeneral: ['', Validators.required],
      materialGeneral: ['', Validators.required],
      observacionGeneral: ['']
    });

  }

  crearPieza(): FormGroup {
    return this.constructorFormulario.group({
      id: [''],
      nombrePieza: this.formularioPiezasGeneral.get('nombrePiezaGeneral').value,
      observacion: this.formularioPiezasGeneral.get('observacionGeneral').value,
      color: this.formularioPiezasGeneral.get('colorGeneral').value,
      material: this.formularioPiezasGeneral.get('materialGeneral').value
    });
  }


  agregarPieza(): void {
    this.piezas = this.formulario.get('piezas') as FormArray;
    this.piezas.push(this.crearPieza());

    // agrego variables al array arrayControlesPiezas el cual contiene
    // variables que controlan los nuevos campos dinámicos que se han creado (formControl)

    this.agregarControl();
  }




  agregarControl(): void {
    this.arrayControlesPiezas.push(new FormGroup({
      colorControl: new FormControl(),
      materialControl: new FormControl()
    }));

  }


  cargarInformacionFormulario(): void {
    this.productoService.obtenerProductoPorID(this.idProducto).subscribe(resultado => {


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

    console.log(this.formulario.value);
  }

  cargarPiezasformulario(): FormArray {
    return this.piezas;
  }


  abrirNotificacion(mensaje: string, accion: string) {
    this.barraNotificaciones.open(mensaje, accion, {
      duration: 2000,
    });
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
            En esta parte se eliminan las piezas de base de datos
          */
          this.piezasEliminar.forEach( pieza => {
            console.log('pieza a eliminar');
            console.log(pieza);
            this.piezaService.eliminarPieza(pieza).subscribe(respuesta => console.log(respuesta));
          });

          this.referenciaVentanaModal.close(this.formulario.value);
        }
      }
    }


  }


  cancelarOperacion(): void {
    this.referenciaVentanaModal.close();
  }


  // este método es un getter del Array piezas
  get obtenerPiezas() {
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
      startWith(''),
      map( valor => this.filtraArrayColor(valor) )
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

}
