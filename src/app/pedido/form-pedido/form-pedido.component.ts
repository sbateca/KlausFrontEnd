import { Component, Inject, OnInit } from '@angular/core';
import { Pedido } from '../pedido';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Cliente } from '../../clientes/cliente';
import { ClienteService } from '../../clientes/cliente.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PedidoService } from '../pedido.service';
import { BodegaInventarioService } from '../../bodega-inventario/bodega-inventario.service';
import { BodegaInventario } from '../../bodega-inventario/bodega-inventario';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Producto } from '../../productos/producto';
import { TipoTalla } from '../../tiposTallas/TipoTalla';
import { Talla } from '../../tallas/talla';
import { ProductoService } from '../../productos/producto.service';
import { TallaService } from '../../tallas/talla.service';
import { MatSelectChange } from '@angular/material/select';
import { Cotizacion } from '../../cotizacion/cotizacion';




@Component({
  selector: 'app-form-pedido',
  templateUrl: './form-pedido.component.html',
  styleUrls: ['./form-pedido.component.css']
})
export class FormPedidoComponent implements OnInit {

  public pedido: Pedido;
  public camposFormulario: FormGroup;
  public listaClientes: Cliente[];
  public listaBodegaInventario: BodegaInventario[];
  public bodegaInventario: BodegaInventario;
  public listaCotizacion: FormArray;
  public listaProductos: Producto[];
  public listaTipoTalla: TipoTalla[];
  public listaTalla: Talla[];
  tallaEliminada: Talla;
  public listaTalla1 = new Array<Talla>();
  public eventoProducto: MatSelectChange;
  public eventoTipoTalla: MatSelectChange;
  public eventoTallaSeleccionada: MatSelectChange;
  public indice = 0;
  public importe = 0;
  public contador = 0;
  public desactivado = true;
  public contador1 = new Array();

  constructor(@Inject(MAT_DIALOG_DATA) private idPedido: number,
              private pedidoService: PedidoService,
              private constructorFormulario: FormBuilder,
              private clienteService: ClienteService,
              private alertaSnackBar: MatSnackBar,
              private bodegaInventarioService: BodegaInventarioService,
              private productoService: ProductoService,
              private tallaService: TallaService,
              private referenciaVentanaModal: MatDialogRef<FormPedidoComponent>) { }

  ngOnInit(): void {

    this.CargarCliente();
    this.CargarBodegaInventario();
    this.CargarProducto();
    this.CrearFormulario();
    this.CargarPedido();  

  }

// Se Carga el cliente
CargarCliente(): void {
  this.clienteService.getClientes().subscribe(clientes => {
    this.listaClientes = clientes;
  });
}

paginaActual = 0;
totalPorPaginas = 200; 

// Cargar Producto
CargarProducto(): void {  
  this.productoService.ListarProductosBodegaInventario(this.paginaActual.toString(), this.totalPorPaginas.toString()).subscribe( respuesta =>{ 
    // Lista Productos de Bodega Inventario
    this.listaProductos = respuesta.content;
  });
}
// CargarTallas
CargarTallas(id): void {
  let contador2 = 0;
  let contador3 = 0;
  
   this.tallaService.ObtenerTallasPorProductoEnBodega(id).subscribe( resultado => {
     // Lista Talla DE Bodega Inventario
     this.listaTalla = resultado;
     
  if (this.listaCotizacion != undefined) {

    
    this.listaCotizacion.value.forEach( (elementoCotizacion, index) => {
       
        this.listaTalla.forEach ( (elementoTalla, j) => {

          
          // Para iniciarlo en cero la primera y unica vez
          if (index < 1)  { 
            this.contador1[j] = 0;
          }
         
          // Con id por que la lista talla tiene la estructura diferente
          if(this.eventoProducto.value.id == elementoCotizacion.bodegaInventario.producto.id ){

            /* console.log("productoIgual");
            console.log(this.eventoProducto.value); */
          
            if(elementoTalla.id != elementoCotizacion.bodegaInventario.talla.id){
              // Cuenta las tallas si no se selecciona del mismo Producto 
              this.contador1[j] ++;       
            }  else {// Si es igual la talla de la lista con la talla de cotizacion
              contador3++;
              if(contador3 == this.listaTalla.length){
                this.listaTalla=[];
                this.alertaSnackBar.open('Ya se selecciono toda la lista de Tallas de '+ elementoCotizacion.bodegaInventario.producto.nombre +' '+elementoCotizacion.bodegaInventario.producto.referencia+'!!', 'Cerrar', {
                duration: 8000
                });
              }
            } 
          } else {// Si No es el producto se suma la talla tampoco se selecciona
              this.contador1[j] ++;
              if(this.eventoProducto.value.id == elementoCotizacion.bodegaInventario.producto.id ){
                console.log("productoIgual");
            console.log(this.eventoProducto.value);
              }
              
          }

          // Si la cantidad de tallas sin seleccionar es igual a la longitud de la lista cotizada, 
          // Las tallas sin seleccionar es (elementoTalla)
          if (this.listaCotizacion.length === this.contador1[j]) {  
        
            // Antes de crear o llenar limpio listaTalla1
            if(contador2==0){
              this.listaTalla1=[];
            } 
            contador2++;
      
            /* console.log("longitud");
            console.log(this.listaTalla.length-1);
            console.log(contador2); */

            // lleno la lista con los elementos tallas no seleccionada
            this.listaTalla1.push(elementoTalla);
     
            // Le asigno a lista Talla la lista de tallas sin seleccionar
            this.listaTalla= this.listaTalla1;     
            
          }
     }); 

    });
    
    
  }
   });
   
}
// Evento Select de Producto
ProductoSeleccionado(evento){
  this.eventoProducto = evento;
  // this.ExtraerTalla(evento);

  
  // Cargo Lista de Talla apartir del id del producto de Bodega Inventario
  this.CargarTallas(evento.value.id);

  
}

// Se Carga el Bodega Inventario
CargarBodegaInventario(): void {
  this.bodegaInventarioService.ListaBodegaInventario().subscribe( bodegaInventarios => {
    this.listaBodegaInventario = bodegaInventarios;
  });
}

// Crea Array Con las Tallas que no se han Seleccionado
CrearArrayConTallasNoSeleccionadas(event): void {
  this.eventoTallaSeleccionada = event;
  // Toma el el indice de la talla seleccionada
  this.indice = this.listaTalla.indexOf(event.value);
}

// Evento input captura los numeros en value
onKey(value: number): boolean {

  // Me desplazo por cada elemento de bodega y detecto el mismo apartir de Producto y Talla
  this.listaBodegaInventario.forEach(elementoBodegaInventario => {
    if(elementoBodegaInventario.producto.id === (this.eventoProducto.value.id)){
      if(elementoBodegaInventario.talla.id === (this.eventoTallaSeleccionada.value.id)) {
        this.bodegaInventario = elementoBodegaInventario;
      }
    } 
  });

  // Observa si el valor del input de la cantidad de pedido es menor a la cantidad de producto en Bodega
  if (value <= this.bodegaInventario.cantidad) {
    if (this.bodegaInventario.cantidad === 0) {
      this.alertaSnackBar.open('Debe Agregar unidades de este Producto por que no hay en Bodega!!', 'Cerrar', {
      duration: 8000
      });
      this.desactivado = true;
    } else {
        this.alertaSnackBar.open("Hay " + this.bodegaInventario.cantidad +
        " unidades de este Producto, su Pedido SI se puede hacer efectivo!!", 'Cerrar', {
        duration: 8000
        });
        this.desactivado = false;

      }
    } else {
      this.alertaSnackBar.open("Hay " + this.bodegaInventario.cantidad +
      " unidades de este Producto, su Pedido NO se puede hacer efectivo!!", 'Cerrar', {
        duration: 8000
        });
      this.desactivado = true;

    }
    return this.desactivado;
  }


// Crea El formulario
CrearFormulario(): void {
  this.camposFormulario = this.constructorFormulario.group(
  {
    cliente: ['', Validators.required],
    observaciones: ['', Validators.required],
    valorIva: ['19', Validators.required],
    descuento: ['0', [Validators.required, Validators.max(100)]],
    producto: ['', Validators.required],
    talla: ['', Validators.required],
    cantidad: ['', Validators.required],
    listaCotizacion: this.constructorFormulario.array([])
   });
}

// Crea Formulario Componetes
CrearListaCotizacion(): FormGroup {
  return this.constructorFormulario.group({
    bodegaInventario: this.bodegaInventario,
    cantidad: this.camposFormulario.get("cantidad").value
  });
}

// Agrega Cotizacion
AgregarListaCotizacion(): void {
 
  // Ser Crea y se llena lista cotizacion
  this.listaCotizacion = this.camposFormulario.get('listaCotizacion') as FormArray;
  
  this.listaCotizacion.push(this.CrearListaCotizacion());
  
  this.camposFormulario.get('talla').setValue(null);
  this.camposFormulario.get('cantidad').setValue(null);

  // Utiliza la posicion(indice) del objeto seleccionado y saca el mismo del la lista
  this.listaTalla.splice(this.indice, 1);

  // Importe suma los subtotales de cada pedido
  this.importe = this.importe + (this.camposFormulario.value.listaCotizacion[this.contador].bodegaInventario.producto.precioVenta - (this.camposFormulario.value.listaCotizacion[this.contador].bodegaInventario.producto.precioVenta*this.camposFormulario.value.descuento/100))*(this.camposFormulario.value.listaCotizacion[this.contador].cantidad);
  this.contador++;
  console.log("ContadorEnAgregar");
  console.log( this.contador);
  console.log("Importe");
  console.log(this.importe);

}

// Obtener Lista Cotizacion
get ObtenerListaCotizacion() {
  return this.camposFormulario.get('listaCotizacion') as FormArray;
}
  
// Enviar Formulario
EnviarFormularioCotizacion() {
  if (this.listaCotizacion == null && this.camposFormulario.invalid === true) {
    this.alertaSnackBar.open('Debe Agregar como minimo un Producto!!', 'Cerrar', {
     duration: 5000
    });
  } else {
     if (this.listaCotizacion.length === 0 && this.camposFormulario.invalid === true) {
          this.alertaSnackBar.open('Debe Agregar como minimo un Producto!!', 'Cerrar', {
          duration: 5000
        });
     } else {
        this.alertaSnackBar.open('Ya se puede Guardar!!', 'Cerrar', {
        duration: 5000
        });
        // Envia el Formulario Cargado
        this.referenciaVentanaModal.close(this.camposFormulario.value);
      }
    }
  }

// Desctiva el boton Agregar Cotizacion
get FormularioNoValido(): boolean {
  if (this.camposFormulario.invalid || this.desactivado) {
    return true;
  }
}

porcentajeInvalido(): boolean {
  return this.camposFormulario.get('descuento').errors.required &&
          this.camposFormulario.get('descuento').touched;
}

  ProductoBodegaSeleccionado(event): void {
    // Obtiene la posicion del producto seleccionado
    this.indice = this.listaBodegaInventario.indexOf(event.value);
  }

// Quitar Lista de Componente inventario
EliminarComponenteInventarioArray(posicion: number): void {

 // Resto uno al contador que es la cantidad de Productos en la lista cotizacion(index)
 this.contador--; 
 
 this.listaBodegaInventario.push(this.listaCotizacion.value[posicion].bodegaInventario);

  // Le resto al total el articulo que saco de la lista de pedido
 this.importe = this.importe - (this.camposFormulario.value.listaCotizacion[posicion].bodegaInventario.producto.precioVenta - (this.camposFormulario.value.listaCotizacion[posicion].bodegaInventario.producto.precioVenta*this.camposFormulario.value.descuento/100))*(this.camposFormulario.value.listaCotizacion[posicion].cantidad);

 // Evita que le adicione la talla eliminada la lista detallas de otro Producto 
  if(!this.eventoProducto.value.id != this.camposFormulario.value.listaCotizacion[posicion].bodegaInventario.producto.id ){
   
    // Se carga la lista de tallas del producto seleccionado 
    this.CargarTallas(this.eventoProducto.value.id);
    
  } 
    // Antes de eliminar se adiciona la lista Talla al producto eliminado del Pedido
    this.listaTalla.push(this.listaCotizacion.value[posicion].bodegaInventario.talla);
    // Se elimina el producto del pedido
    this.listaCotizacion.removeAt(posicion);
}

  // Carga pedido
  CargarPedido(): void {
    if  (this.idPedido) {
      this.pedidoService.VerPedidoPorId(this.idPedido).subscribe(pedido => {
        this.pedido = pedido;
        this.camposFormulario.setValue({

          "valorIva": this.pedido.valorIva,
          "valorFinalVenta": this.pedido.valorFinalVenta,
          "observaciones": this.pedido.observaciones,
          "cliente": this.pedido.cliente

        });
      });
    }
  }

//  Compara el Cliente
compararCliente( c1: Cliente, c2: Cliente): boolean {
  if (c1 === undefined && c2 === undefined) { // a1, a2  identico undefined
    return true;
  }
  return ( c1 === null || c2 === null || c1 === undefined || c2 === undefined )
    ? false : c1.id === c2.id;
  }

// Cancela el formularioy sale del mismo
CancelarOperacion(): void {
  this.referenciaVentanaModal.close();
}

  // Separador de decimales
  FormatoSeparadorDecimal(n) {
    let sep = n || "."; // Por defecto, el punto como separador decimal
    // decimals = decimals || 2; // A 2 decimales
    return n.toLocaleString().split(sep)[0];
           // + n.toFixed(decimals).split(sep)[1];
   }

}