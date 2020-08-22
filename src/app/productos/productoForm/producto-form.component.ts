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


@Component({
  selector: 'app-producto-form',
  templateUrl: './producto-form.component.html',
  styleUrls: ['./producto-form.component.css']
})




export class ProductoFormComponent implements OnInit {



  formulario: FormGroup;
  piezas: FormArray;

  funcionalidad = 'Agregar producto';



  // listado de colores
  listaColores = new Array<Color>();
  listaMateriales: Material[] = [];

  // estas variables se usarán para el filtrado en el autocompletar
  listaFiltradaColores: Observable<Color[]>;
  listaFiltradaMateriales: Observable<Material[]>;


  myControl = new FormControl();
  campoMaterialAutoComplete = new FormControl();

  constructor(public referenciaVentanaModal: MatDialogRef<ProductoFormComponent>,
              @Inject(MAT_DIALOG_DATA) public idProducto,
              private productoService: ProductoService,
              private colorService: ColorService,
              private materialService: MaterialService,
              private constructorFormulario: FormBuilder) {}



  ngOnInit(): void {
    this.crearFormulario();
    this.obtenerColores();

    this.filtrarAutoCompleteColor();
    this.filtrarAutoCompleteMaterial();


  }

  crearFormulario(): void {
    this.formulario = this.constructorFormulario.group({
      nombre: ['', Validators.required],
      referencia: ['', Validators.required],
      costo: ['', Validators.required],
      precioVenta: ['', Validators.required],
      piezas: this.constructorFormulario.array([])
    });
  }

  crearPieza(): FormGroup {
    return this.constructorFormulario.group({
      nombre: ['', Validators.required],
      observacion: [''],
      color: this.constructorFormulario.group({
        id: ['', Validators.required],
        nombre: ['', Validators.required],
        codigoColor: ['', Validators.required]
      }),
      material: this.constructorFormulario.group({
        id: ['', Validators.required],
        nombre: ['', Validators.required],
        descripcion: ['', Validators.required]
      })
    });
  }


  agregarPieza(): void {
    this.piezas = this.formulario.get('piezas') as FormArray;
    this.piezas.push(this.crearPieza());
  }


  guardar(): void {
    if (this.formulario.invalid) {
      return Object.values( this.formulario.controls).forEach( campoFormulario => {
        /*
          el formulario tiene varios tipos de campos: FormControl, FormArray
          hay que validar el tipo de objeto
        */

        // si es un FormControl se marca como tocado
       if (campoFormulario instanceof FormControl) {
         campoFormulario.markAsTouched();
       }
        // si es el FormArray de Piezas se recorren para extraer los campos y los FormGroup
       if (campoFormulario instanceof FormArray) {
         campoFormulario.controls.forEach( campoPieza => {

          //  extraemos el FormGroup para recorrerlo
          const piezaForm = campoPieza as FormGroup;
          // recorremos cada control para marcarlo
          Object.keys(piezaForm.controls).forEach(campo => {
            piezaForm.get(campo).markAsTouched();
          });
         });
       }

      });
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


  obtenerColorForm(posicion: number): FormControl {
    return (this.formulario.get('piezas') as FormArray).controls[posicion].get('color') as FormControl;
  }


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



  /* Este método obtiene el FormControl "Color" que se encuentra en determinada posición
  del FormArray de piezas */
    obtenerFormControlColorDeLista(posicion: number): FormControl {
    return this.formulario.get('piezas')[posicion].get('color');
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


  private filtraArrayColor(nombre: string): Color[] {
    const nombreAFiltrar = nombre.toLowerCase().replace(/\s/g, '');
    return this.listaColores.filter(resultado => resultado.nombre.toLowerCase().replace(/\s/g, '').includes(nombreAFiltrar));
  }

  mostrarNombreColor(color: Color): string {
    return color && color.nombre ? color.nombre : '';
  }


  asignarSeleccionado(evento: MatOptionSelectionChange, posicion: number): void {

    const color = evento.source.value as Color;

    this.piezas.controls[posicion].get('color').patchValue({
      id: color.id,
      nombre: color.nombre,
      codigoColor: color.codigoColor
    });

    console.log('color seleccionado');
    console.log(color.nombre);

    this.obtenerColores();
    this.filtrarAutoCompleteColor();
  }



  asignarSeleccionadoMaterial(evento: MatOptionSelectionChange, posicion: number): void {
    const material = evento.source.value as Material;

    this.piezas.controls[posicion].get('material').patchValue({
      id: material.id,
      nombre: material.nombre,
      descripcion: material.descripcion
    });
  }




  filtrarAutoCompleteMaterial(): void {
    this.campoMaterialAutoComplete.valueChanges.pipe(
      map(valor => typeof valor === 'string' ? valor : valor.nombre),
      flatMap(valor => valor ? this.materialService.buscarMaterialPorNombre(valor as string) : [])
    ).subscribe( materiales => {
      this.listaMateriales = materiales;
    });
  }





  quitaPiezaArray(posicion: number): void {
    this.piezas.removeAt(posicion);
  }





  mostrarNombreMaterial(material: Material): string {
    return material ? material.nombre : '';
  }


  // ---------------------- validaciones ---------------------------- //


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

  nombrePiezaInvalida(posicion: number): boolean {
    return  this.piezas.controls[posicion].get('nombre').valid &&
            this.piezas.controls[posicion].get('nombre').touched;
  }

}
