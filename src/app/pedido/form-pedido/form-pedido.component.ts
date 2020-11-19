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
  public indice = 0;
  public importe = 0;
  public contador = 0;
  public desactivado = true;

  constructor(@Inject(MAT_DIALOG_DATA) private idPedido: number,
              private pedidoService: PedidoService,
              private constructorFormulario: FormBuilder,
              private clienteService: ClienteService,
              private alertaSnackBar: MatSnackBar,
              private bodegaInventarioService: BodegaInventarioService,
              private referenciaVentanaModal: MatDialogRef<FormPedidoComponent>) { }

  ngOnInit(): void {
    this.CargarPedido();
    this.CargarCliente();
    this.CargarBodegaInventario();
    this.Crearformulario();
  }

  // Evento input captura los numeros en value
  onKey(value: number): boolean {
    /* console.log(value); */
    /* console.log("camposFormulario cantidad");
    console.log(this.camposFormulario.value.productoBodega.cantidad); */

    // Observa si el valor del input de la cantidad de pedido es menor a la cantidad de producto en Bodega
    if (value <= this.camposFormulario.value.productoBodega.cantidad) {
      if (this.camposFormulario.value.productoBodega.cantidad === 0) {
        this.desactivado = true;
      } else {
        console.log("Hay " + this.camposFormulario.value.productoBodega.cantidad + 
        " unidades de este Producto, su Pedido SI se puede hacer efectivo");
        this.desactivado = false;
      /* console.log(this.desactivado); */
      }
    } else {
      console.log("Hay " + this.camposFormulario.value.productoBodega.cantidad +
      " unidades de este Producto, su Pedido NO se puede hacer efectivo");
      this.desactivado = true;
      /* console.log(this.desactivado); */
    }
    return this.desactivado;
  }


  // Crea El formulario
  Crearformulario(): void {
    this.camposFormulario = this.constructorFormulario.group(
      {
        valorIva: ['19', Validators.required],
        productoBodega: ['', Validators.required],
        cantidad: ['', Validators.required],
        cliente: ['', Validators.required],
        observaciones: ['', Validators.required],
        listaCotizacion: this.constructorFormulario.array([])
      });
  }

  // Crea Formulario Componetes
  CrearListaCotizacion(): FormGroup {
    return this.constructorFormulario.group({
      bodegaInventario: this.camposFormulario.get("productoBodega").value,
      cantidad: this.camposFormulario.get("cantidad").value
    });
  }

  AgregarListaCotizacion(): void {

    // Agrego el Producto
    this.listaCotizacion = this.camposFormulario.get('listaCotizacion') as FormArray;
    this.listaCotizacion.push(this.CrearListaCotizacion());

    // Pone en nulo los Campos
    this.camposFormulario.get('productoBodega').setValue(null);
    this.camposFormulario.get('cantidad').setValue(null);

    // Utiliza la posicion(indice) del objeto seleccionado y saca el mismo del la lista
    this.listaBodegaInventario.splice(this.indice, 1);

   /*  console.log("lista");
    console.log(this.listaCotizacion);

    console.log("campos formulario");
    console.log(this.camposFormulario); */

    // importe suma los subtotales de cada pedido
    this.importe = this.importe + (this.camposFormulario.value.listaCotizacion[this.contador].bodegaInventario.producto.precioVenta*this.camposFormulario.value.listaCotizacion[this.contador].cantidad);
    this.contador++;

  }

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

  get FormularioNoValido(): boolean {

     if (this.camposFormulario.invalid || this.desactivado) {
       return true;
     }
  }

  ProductoBodegaSeleccionado(event): void {
    // Obtiene la posicion del producto seleccionado
    this.indice = this.listaBodegaInventario.indexOf(event.value);
  }

// Quitar Lista de Componente inventario
EliminarComponenteInventarioArray(posicion: number): void {
 this.contador = posicion;
 this.listaBodegaInventario.push(this.listaCotizacion.value[posicion].bodegaInventario);

 // Le resto al total el articulo que saco de la lista de pedido
 this.importe =  this.importe = this.importe -
 (this.listaCotizacion.value[posicion].bodegaInventario.producto.precioVenta * this.listaCotizacion.value[posicion].cantidad);

 /* // Si elimina todos los productos se iniciar el contador
 if (this.importe === 0) this.contador = 0;

 // Descuento una posicion en el contador, por que se elimina un pedido
 this.contador--;*/
 console.log("importe");
 console.log(this.importe);
 console.log("contador");
 console.log(this.contador);
 console.log("Posicion");
 console.log(posicion); 

 this.listaCotizacion.removeAt(posicion);
}

  // Carga pedido
  CargarPedido(): void {
    if  (this.idPedido) {
      this.pedidoService.VerPedidoPorId(this.idPedido).subscribe(pedido => {
        this.pedido = pedido;
        this.camposFormulario.setValue({
          // "fechaPedido": this.pedido.fechaPedido,
          // "horaPedido": this.ConvierteElFormato24a12Horas(this.pedido.horaPedido),
          "valorIva": this.pedido.valorIva,
          "valorFinalVenta": this.pedido.valorFinalVenta,
          "observaciones": this.pedido.observaciones,
          "cliente": this.pedido.cliente
        });
      });
    }
  }


public ConvierteElFormato24a12Horas(TiempoFormato24H): string {
    let TiempoArray = TiempoFormato24H.split(":");
    TiempoArray.splice(2, 1); // Elimina un elemento desde 2, segundos
    let TiempoEn12H = "";
    if ( parseInt (TiempoArray[0]) <= 12) {
      TiempoEn12H +=  TiempoArray[0] + ":" + TiempoArray[1] + " AM";
    }
    else {
      var NuevaHora = (TiempoArray[0] - 12) + "";
      if (parseInt(NuevaHora) < 10) {
        NuevaHora = "0" + NuevaHora;
      }
      TiempoEn12H = NuevaHora + ":" + TiempoArray[1];
      TiempoEn12H += " PM";
    }
    return TiempoEn12H;
  }

  //  Compara el Cliente
  compararCliente( c1: Cliente, c2: Cliente): boolean {

     if (c1 === undefined && c2 === undefined) { // a1, a2  identico undefined
      return true;
     }

     return ( c1 === null || c2 === null || c1 === undefined || c2 === undefined )
    ? false : c1.id === c2.id;
  }

  // Se Carga el cliente
  CargarCliente(): void {
    this.clienteService.getClientes().subscribe(clientes => {
      this.listaClientes = clientes;
    });
  }

  // Se Carga el Bodega Inventario
  CargarBodegaInventario(): void {
    this.bodegaInventarioService.ListaBodegaInventario().subscribe( bodegaInventarios => {
      this.listaBodegaInventario = bodegaInventarios;
    });
  }

  // Cancela el formularioy sale del mismo
  CancelarOperacion(): void {
    this.referenciaVentanaModal.close();
  }
}
