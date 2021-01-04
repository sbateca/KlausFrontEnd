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
// import { ComponentesInventario } from '../componentes-inventario';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  public estadoDescuento: boolean;
  public indice: number;
  public i: number;
  public eventoTipoTalla: MatSelectChange;
  public eventoTallasNoSeleccionadas: MatSelectChange;

  listaComponentesInventario: FormArray;

  public camposFormularioBodegaInventario: FormGroup;
  constructor(private constructorFormularioBodegaInventario: FormBuilder,
              private productoService: ProductoService,
              private tipoTallaService: TipoTallaService,
              private tallaService: TallaService,
              private alertaSnackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) private idBodegaInventario: number,
              private bodegaInventarioService: BodegaInventarioService,
              private referenciaVentanaModal: MatDialogRef<FormBodegaInventarioComponent>) { }

  ngOnInit(): void {
    this.CargarProducto();
    this.CargarTipoTalla();
    this.CrearFormularioBodegaInventario();
    this.indice = 0;
    this.i = 0;
  }

  // Cargar Producto
  CargarProducto(): void {
    this.productoService.listarElementos().subscribe( productos => {
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
        talla: [''],
        cantidad: [''],
        estadoDescuento: [false],
        descuento: [''],
        listaComponentesInventario: this.constructorFormularioBodegaInventario.array([])
      }
    );
  }

  // Crea Formulario Componetes
  CrearComponentesDeInventario(): FormGroup {
    return this.constructorFormularioBodegaInventario.group({
      talla_: this.camposFormularioBodegaInventario.get("talla").value,
      cantidad_: this.camposFormularioBodegaInventario.get("cantidad").value,
      estadoDescuento_: this.camposFormularioBodegaInventario.get("estadoDescuento").value,
      descuento_: this.camposFormularioBodegaInventario.get("descuento").value
    });
  }

// Quitar Lista de Componente inventario
EliminarComponenteInventarioArray(posicion: number): void {
  this.listaTalla.push(this.listaComponentesInventario.value[posicion].talla_);
  this.listaComponentesInventario.removeAt(posicion);
}

 // Seleccion de MatSlideToggleChange
 SeleccionEstadoDescuento(evento: MatSlideToggleChange) {
  let listaCamposForm: FormArray;
  listaCamposForm = this.camposFormularioBodegaInventario.get('listaComponentesInventario') as FormArray;
  if (evento.checked) {
    this.estadoDescuento = evento.checked; // true
  } else {
    this.estadoDescuento = false;
  }
  if (listaCamposForm.length !== 0) {
    listaCamposForm.value[listaCamposForm.length - 1].descuento = ''; // Pone en descuento un vacio
  }
  }
// Componentes de Inventario
AgregarComponentesInventario(): void {
  // console.log(this.camposFormularioBodegaInventario.get('estadoDescuento').value);
  if (this.camposFormularioBodegaInventario.get('estadoDescuento').value == null) {
    this.camposFormularioBodegaInventario.get('estadoDescuento').setValue(false);
  }
  // console.log(this.camposFormularioBodegaInventario.get('estadoDescuento').value);
  this.listaComponentesInventario = this.camposFormularioBodegaInventario.get('listaComponentesInventario') as FormArray;
  this.listaComponentesInventario.push(this.CrearComponentesDeInventario());

  // agrego el componente pongo en nulo los Campos
  this.camposFormularioBodegaInventario.get('talla').setValue(null);
  this.camposFormularioBodegaInventario.get('cantidad').setValue(null);
  this.camposFormularioBodegaInventario.get('estadoDescuento').setValue(null);
  this.camposFormularioBodegaInventario.get('descuento').setValue(null);
  this.estadoDescuento = false;
  // console.log(this.listaTalla);
  this.listaTalla.splice(this.indice, 1); // 1 es la cantidad de elemento a eliminar
  // console.log(this.listaTalla);
}

// Lista tipo de Tallas Seleccionada
ArrayTipoTallaSeleccionada(event): void {
  this.eventoTipoTalla = event;
  console.log("evento")
  console.log(event);
  this.listaTalla = event.value.tallas;
}

// Crea Array Con las Tallas que no se han Seleccionado
CrearArrayConTallasNoSeleccionadas(event, posicion: number): void {
  this.eventoTallasNoSeleccionadas = event;
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
      if (this.listaComponentesInventario == null) {
        // console.log('nulo');
        this.alertaSnackBar.open('Debe Agregar como minimo una talla!!', 'Cerrar', {
          duration: 5000
        });
      } else {
        if (this.listaComponentesInventario.length === 0) {
          this.alertaSnackBar.open('Debe Agregar como minimo una talla!!', 'Cerrar', {
            duration: 5000
            });
          // console.log("longitud cero");
        } else {
          this.alertaSnackBar.open('Ya se puede Guardar!!', 'Cerrar', {
            duration: 5000
            });
          this.referenciaVentanaModal.close(this.camposFormularioBodegaInventario.value);
          // console.log(this.camposFormularioBodegaInventario.value);
        }
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

  get FormularioNoValido(): boolean {
    let inValida: boolean;
    inValida = true;

    if (this.camposFormularioBodegaInventario.invalid === true) {
      // console.log("Formulario Invalido debe seleccionar Producto y Tipo talla");

     } else {
       // console.log("Se a Seleccionado Producto y Talla");

       if (this.camposFormularioBodegaInventario.get('talla').value === '' ||
       this.camposFormularioBodegaInventario.get('talla').value == null ) {

        if (this.camposFormularioBodegaInventario.get('cantidad').value === '' ||
        this.camposFormularioBodegaInventario.get('cantidad').value == null) {
          // console.log("La talla y Cantidad No Seleccionada");
        } else {
          // console.log("Talla Seleccionada y Cantidad No Seleccionada");
        }

       } else {
        if (this.camposFormularioBodegaInventario.get('cantidad').value == '' ||
        this.camposFormularioBodegaInventario.get('cantidad').value == null) {
          // console.log("La talla Seleccionada y Cantidad No Seleccionada");
        } else {
          // console.log("Talla y Cantidad Seleccionadas");
          if (this.camposFormularioBodegaInventario.get('estadoDescuento').value == true) {
            // console.log("hay descuento: "+this.camposFormularioBodegaInventario.get('estadoDescuento').value);
            if (this.camposFormularioBodegaInventario.get('descuento').value == '' ||
            this.camposFormularioBodegaInventario.get('descuento').value == null) {
              // console.log("Debe llenar el Descuento");
            } else {
              // console.log("Talla, Cantidad y Descuento son Validos");
              // console.log("El Formulario Es Valido");
              inValida = false;
              // console.log("Invalida"+inValida);
            }
          } else {
           // console.log("No hay descuento: "+(this.camposFormularioBodegaInventario.get('estadoDescuento').value));
           inValida = false;
           // console.log("El Formulario Es Valido");
           // console.log("Invalida"+inValida);
          }
        }
      }
     }

    return inValida;
  }

  get TipoTallaNoValido(): boolean {
    return this.camposFormularioBodegaInventario.get('talla').invalid &&
    this.camposFormularioBodegaInventario.get('talla').touched ;
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
