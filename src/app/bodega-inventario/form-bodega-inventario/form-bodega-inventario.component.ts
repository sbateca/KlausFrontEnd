import { Component, Inject, OnInit } from '@angular/core';
import { BodegaInventario } from '../bodega-inventario';
import { Producto } from '../../productos/producto';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { BodegaInventarioService } from '../bodega-inventario.service';
import { ProductoService } from '../../productos/producto.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TipoTalla } from '../../tiposTallas/TipoTalla';
import { tick } from '@angular/core/testing';
import { TipoTallaService } from '../../tiposTallas/tipo-talla.service';
import { Talla } from '../../tallas/talla';
import { TallaService } from '../../tallas/talla.service';
import {MatSlideToggleChange, MatSlideToggleModule} from '@angular/material/slide-toggle'
import { Console } from 'console';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-form-bodega-inventario',
  templateUrl: './form-bodega-inventario.component.html',
  styleUrls: ['./form-bodega-inventario.component.css']
})
export class FormBodegaInventarioComponent implements OnInit {

  public bodegaInventario: BodegaInventario;
  public producto: Producto;
  public listaProductos: Producto[];
  public tipoTalla: TipoTalla;
  public listaTipoTalla: TipoTalla[];
  public listaTalla: Talla[];
  public listaTallaNuevo: Talla[];
  public estadoDescuento: boolean;
  public tallaSeleccionada: Talla[];
  public i: number;
  public cantidad: number;
  public indice: number;
  public eventoTipoTalla: MatSelectChange;
  public eventoTallasNoSeleccionadas: MatSelectChange;

  listaComponentesInventario: FormArray;

  public camposFormularioBodegaInventario: FormGroup;
  constructor(private constructorFormularioBodegaInventario: FormBuilder,
              private productoService: ProductoService,
              private tipoTallaService: TipoTallaService,
              private tallaService: TallaService,
              @Inject(MAT_DIALOG_DATA) private idBodegaInventario: number,
              private bodegaInventarioService: BodegaInventarioService,
              private referenciaVentanaModal: MatDialogRef<FormBodegaInventarioComponent>) { }

  ngOnInit(): void {
    this.CargarProducto();
    this.CargarTipoTalla();
    this.CrearFormularioBodegaInventario();
    this.cantidad = 0;
    this.indice = 0;
    // this.CargarFormularioBodegaInventario();
  }

  // Cargar Producto
  CargarProducto(): void {
    this.productoService.obtenerProductos().subscribe( productos => {
      this.listaProductos = productos;
    });
  }

  // Cargar Tipo Talla
  CargarTipoTalla(): void {
    this.tipoTallaService.obtenerTipoTallas().subscribe( tipoTalla => {
      this.listaTipoTalla = tipoTalla;
    });
  }

  // Cargar Objeto Talla
  CargarTalla(): void {
    this.tallaService.getTallas().subscribe( tallas => {
      this.listaTalla = tallas;
    });
  }

  // Crear Formulario Bodega Inventario
  CrearFormularioBodegaInventario(): void {
    this.camposFormularioBodegaInventario = this.constructorFormularioBodegaInventario.group(
      {
        tipoTalla: ['', Validators.required],
        producto: ['', Validators.required],
        listaComponentesInventario: this.constructorFormularioBodegaInventario.array([])
      }
    );
  }
  // CrearDetalle(): FormGroup {
  CrearComponentesDeInventario(): FormGroup {
    return this.constructorFormularioBodegaInventario.group({
      talla: ['', Validators.required],
      cantidad: ['', Validators.required],
      estadoDescuento: ['', Validators.required],
      descuento: ['']
    });
  }

 

// Quitar Lista de Componente inventario
EliminarComponenteInventarioArray(posicion: number): void {
  this.listaComponentesInventario.removeAt(posicion);
}

 // Seleccion de MatSlideToggleChange
 SeleccionEstadoDescuento(evento: MatSlideToggleChange, posicion: number) {
  let listaCamposForm: FormArray;
  listaCamposForm = this.camposFormularioBodegaInventario.get('listaComponentesInventario') as FormArray;
  if (evento.checked) {
    this.estadoDescuento = evento.checked; // true
  } else {
    this.estadoDescuento = false;
    listaCamposForm.value[posicion].descuento = ''; // Pone en descuento un vacio
  }
  }
// Componentes de Inventario
AgregarComponentesInventario(): void {
  this.listaComponentesInventario = this.camposFormularioBodegaInventario.get('listaComponentesInventario') as FormArray;
  this.listaComponentesInventario.push(this.CrearComponentesDeInventario());
  this.estadoDescuento = false;

  this. CrearArrayConTallasNoSeleccionadas(this.eventoTallasNoSeleccionadas , this.i);
  console.log(this.eventoTallasNoSeleccionadas);
  // this.indice = this.listaTalla.indexOf(this.eventoTallasNoSeleccionadas.value);
  console.log(this.indice); // obtenemos el indice
  this.listaTalla.splice(this.indice, 1); // 1 es la cantidad de elemento a eliminar
  console.log(this.listaTalla);
}

// Lista tipo de Tallas Seleccionada
ArrayTipoTallaSeleccionada(event): void {
  this.eventoTipoTalla = event;
  this.listaTalla = event.value.tallas;
}

// Crea Array Con las Tallas que no se han Seleccionado
CrearArrayConTallasNoSeleccionadas(event, posicion: number): void {
  this.eventoTallasNoSeleccionadas = event;
  this.i = posicion;
  console.log("posicion :"+posicion); // comienza con 0
  this.indice = this.listaTalla.indexOf(event.value);

}




  get ObtenerListaComponentesInventario() {
    return this.camposFormularioBodegaInventario.get('listaComponentesInventario') as FormArray;
  }

  // Cancelar Formulario
  CancelarOperacion(): void {
    this.referenciaVentanaModal.close();
  }

  // Enviar Formulario
  EnviarFormularioBodegaInventario() {
    if (this.camposFormularioBodegaInventario.invalid) {
      return this.camposFormularioBodegaInventario.markAllAsTouched();
    } else {
      this.referenciaVentanaModal.close(this.camposFormularioBodegaInventario.value);
    }
   }

  // Comparar Producto
  CompararProducto( P1: Producto, P2: Producto): boolean {
    if (P1 === undefined && P2 === undefined) { // ET1, ET2  identico undefined
      return true;
    }
    return ( P1 === null || P2 === null || P1 === undefined || P2 === undefined )
    ? false : P1.id === P2.id;
  }

  // Comparar Tipo Talla
  CompararTipoTalla( TT1: TipoTalla, TT2: TipoTalla): boolean {
    if (TT1 === undefined && TT2 === undefined) { // ET1, ET2  identico undefined
      return true;
    }
    return ( TT1 === null || TT2 === null || TT1 === undefined || TT2 === undefined )
    ? false : TT1.id === TT2.id;
  }



  // Cargar Formulario Bodega Inventario
  /*CargarFormularioBodegaInventario(): void {
    if (this.idBodegaInventario) {
    this.bodegaInventarioService.VerBodegaInventarioPorId(this.idBodegaInventario).subscribe(bodegaInventario => {
      this.bodegaInventario = bodegaInventario;
      this.camposFormularioBodegaInventario.setValue({
        cantidad: this.bodegaInventario.cantidad ,
        talla: this.bodegaInventario.referenciaProducto.talla,
        estadoDescuento: this.bodegaInventario.estadoDescuento,
        descuento: this.bodegaInventario.descuento ,
        producto: this.bodegaInventario.referenciaProducto
      });
    });
  }
}*/
}
