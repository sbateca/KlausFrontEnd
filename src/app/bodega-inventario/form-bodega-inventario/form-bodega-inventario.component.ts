import { Component, Inject, OnInit } from '@angular/core';
import { BodegaInventario } from '../bodega-inventario';
import { Producto } from '../../productos/producto';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { BodegaInventarioService } from '../bodega-inventario.service';
import { ProductoService } from '../../productos/producto.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TipoTalla } from '../../tiposTallas/TipoTalla';
import { TipoTallaService } from '../../tiposTallas/tipo-talla.service';
import { Talla } from '../../tallas/talla';
import { TallaService } from '../../tallas/talla.service';
import {MatSlideToggleChange} from '@angular/material/slide-toggle'
import { MatSelectChange } from '@angular/material/select';
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
  public listaTalla1: Talla[];
  public estadoDescuento: boolean;
  public indice: number;
  public i: number;
  public eventoProducto: MatSelectChange;
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
    // Al seleccionar tipoTalla tenga la listaTalla
    this.CargarTalla();
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
   // Evento Producto
   EventoProducto(Evento): void {  
      // Cargo la Talla cada vez que cambio de Producto
    /* this.CargarTalla();   */
    this.eventoProducto = Evento;
    this.camposFormularioBodegaInventario.get('tipoTalla').setValue(null);
    this.camposFormularioBodegaInventario.get('talla').setValue(null);
    this.camposFormularioBodegaInventario.get('cantidad').setValue(null);
     // Mientas no se seleccione el tipoTalla no hay listaTalla
    this.listaTalla1 = [];
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

  // Lista tipo de Tallas Seleccionada
  ArrayTipoTallaSeleccionada(event): void {
    this.eventoTipoTalla = event;

    // Calcula las tallas Disponibles
    this.TallasDisponibles(event);
  }  

// Crea Array Con las Tallas que no se han Seleccionado
CrearArrayConTallasNoSeleccionadas(event, posicion: number): void {
  this.eventoTallasNoSeleccionadas = event;
}

  // Calcula las tallas Disponibles por Producto, recive el eventoTipoTalla
  TallasDisponibles(Evento): void{

    // Se carga la lista para que se inicie siempre con la misma lista de tallas en eventoTipoTalla
    this.CargarTalla();

    // Se comparamos la lista original de Tallas con la lista de tallas de el tipoTalla
    this.listaTalla.forEach(tallaLista => {
      Evento.value.tallas.forEach(tallaEvent => {
        if(tallaEvent.id === tallaLista.id) {
          this.listaTalla1.push(tallaLista);
        }
      });
    });


    // Lista de Componentes de Bodega
    let listaComponenteBodega = this.camposFormularioBodegaInventario.get('listaComponentesInventario').value;
    // Producto Seleccionado
    let ProductoSelec = this.camposFormularioBodegaInventario.get('producto').value;

 
    if(this.camposFormularioBodegaInventario.get('listaComponentesInventario').value.length != 0) {
 
       // Recorro la lista Componente Bodega
       listaComponenteBodega.forEach( (elementoBodega, index2) => {

        // Recorro la lista De Tallas
        this.listaTalla1.forEach( (elementoTalla, index1) => {
 
         // Preginto si el producto seleccionado es igual al producto en lista Componente
         if(this.eventoProducto.value.id == elementoBodega.producto.id){
             
           if(elementoTalla.id == elementoBodega.talla.id){// Las tallas seleccionadas por producto
           
             this.indice = this.listaTalla1.indexOf(elementoTalla);
             this.listaTalla1.splice(this.indice, 1);
             
       
           } 
         }
       });
       
      });
    
    }

  }
  
 

  // Crear Formulario Bodega Inventario
  CrearFormularioBodegaInventario(): void {
    this.camposFormularioBodegaInventario = this.constructorFormularioBodegaInventario.group(
      {
        tipoTalla: ['', Validators.required],
        producto: ['', Validators.required],
        talla: ['', Validators.required],
        cantidad: ['', Validators.required],
        listaComponentesInventario: this.constructorFormularioBodegaInventario.array([])
      }
    );
  }

  // Crea Formulario Lista Componentes Inventario
  CrearComponentesDeInventario(): FormGroup {
    return this.constructorFormularioBodegaInventario.group({
      talla: this.camposFormularioBodegaInventario.get("talla").value,
      cantidad: this.camposFormularioBodegaInventario.get("cantidad").value,
      producto: this.camposFormularioBodegaInventario.get("producto").value,
      });
  }

// Quitar Lista de Componente inventario
EliminarComponenteInventarioArray(posicion: number): void {
  this.listaTalla1.push(this.listaComponentesInventario.value[posicion].talla);
  this.listaComponentesInventario.removeAt(posicion);
  // Mientas no se seleccione el tipoTalla no hay listaTalla
  this.listaTalla1 = [];
}

// Componentes de Inventario
AgregarComponentesInventario(): void {

  this.listaComponentesInventario = this.camposFormularioBodegaInventario.get('listaComponentesInventario') as FormArray;
  this.listaComponentesInventario.push(this.CrearComponentesDeInventario());

  // agrego el componente pongo en nulo los Campos
  this.camposFormularioBodegaInventario.get('tipoTalla').setValue(null);
  this.camposFormularioBodegaInventario.get('talla').setValue(null);
  this.camposFormularioBodegaInventario.get('cantidad').setValue(null);
  // Mientas no se seleccione el tipoTalla no hay listaTalla
  this.listaTalla1 = [];

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
