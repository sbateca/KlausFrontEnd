import { Component, OnInit, ViewChild } from '@angular/core';
import { FormPedidoComponent } from './form-pedido/form-pedido.component';
import { MatDialog } from '@angular/material/dialog';
import { Pedido } from './pedido';
import { PedidoService } from './pedido.service';
import swal from 'sweetalert2';
import { Sort, MatSort } from '@angular/material/sort';
import { DetallePedidoComponent } from './detalle-pedido/detalle-pedido.component';
import alertasSweet from 'sweetalert2';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BodegaInventario } from '../bodega-inventario/bodega-inventario';
import { CotizacionService } from '../cotizacion/cotizacion.service';
import { Cotizacion } from '../cotizacion/cotizacion';
import { Cliente } from '../clientes/cliente';
import { ClienteService } from '../clientes/cliente.service';
import { Router } from '@angular/router';
import { BodegaInventarioService } from '../bodega-inventario/bodega-inventario.service';
import { Movimiento } from '../movimientos/movimiento';
import { MovimientoService } from '../movimientos/movimiento.service';
import { EnviociudadService } from '../enviociudad/enviociudad.service';
import { Enviociudad } from '../enviociudad/Enviociudad';


@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent implements OnInit {

  public pedido = new Pedido();
  public listaPedidos: Pedido[];
  public pedidoConId: Pedido;
  public listaClientes: Cliente[];
  public bodegaInventario: BodegaInventario;
  public movimiento = new Movimiento();

  // Titulos de cada Columna
  columnasTabla: string [] = ['valorFinalVenta', 'cliente', 'acciones'];
  datos: MatTableDataSource<Pedido>;

  // Variables con valores iniciales para el paginador
  totalRegistros = 0;
  paginaActual = 0;
  totalPorPaginas = 100;
  pageSizeOptions: number[] = [3, 5, 10, 25, 100];
  @ViewChild(MatPaginator, {static: true}) paginador: MatPaginator;
  @ViewChild(MatSort, {static: true}) ordenadorRegistros: MatSort;

  constructor(public ventanaModal: MatDialog,
              private cotizacionService: CotizacionService,
              private clienteService: ClienteService,
              private bodegaInventarioService: BodegaInventarioService,
              private movimientoService: MovimientoService,
              private envioCiudadService: EnviociudadService,
              private router: Router,
              private pedidoService: PedidoService) { }

  ngOnInit(): void {
    this.pedidoService.VerListaPedidos().subscribe(pedidos => {
      this.listaPedidos = pedidos;
    });
    this.listarPaginado();
  }

  // Separador de decimales
  public FormatoSeparadorDecimal(n): any {
    let sep = n || "."; // Por defecto, el punto como separador decimal
    return n.toLocaleString().split(sep)[0];
   }

  // Se Carga el cliente
  CargarCliente(): void {
    this.clienteService.getClientes().subscribe(clientes => {
      this.listaClientes = clientes;
    });
  }

  Reordenar(sort: Sort) {

    const listPedido = this.listaPedidos.slice(); // obtenemos el array*/

    /*
    Si no está activo el sorting o no se ha establecido la dirección del sorting (asc ó desc)
    se asigna los mismos datos (sin ordenar)
    */
    if (!sort.active || sort.direction === '' ) {
       this.datos = new MatTableDataSource<Pedido>(this.listaPedidos);
       return;
    }
    this.datos = new MatTableDataSource<Pedido>(
    this.listaPedidos = listPedido.sort( (a, b) => {
      const esAscendente = sort.direction === 'asc'; // se determina si es ascendente
      switch (sort.active) { // sort.active obtiene el id (string) de la columna seleccionada
        case 'valorFinalVenta': return this.comparar(a.valorFinalVenta, b.valorFinalVenta, esAscendente);
        case 'cliente': return this.comparar( a.cliente.id, b.cliente.id, esAscendente);
      }
    }));
        // cada vez que se haga clic en un botón para reordenar es necesario paginar de nuevo
    }
    // Esta función compara dos String junto con el valor de la variable isAsc y retorna:
    comparar(a: number | string | Date, b: number | string | Date , esAscendente: boolean) {// Date
    return (a < b ? -1 : 1) * (esAscendente ? 1 : -1);
    }

  // Control de Paginación
  paginar(evento: PageEvent): void {
    this.paginaActual = evento.pageIndex;
    this.totalPorPaginas = evento.pageSize; // Lo que enviamos al backend
    this.listarPaginado();
  }

  // Paginar Lista Pedido
  listarPaginado(): void {

    this.pedidoService.ListarPedidosPaginado(this.paginaActual.toString(), this.totalPorPaginas.toString())
    .subscribe(paginacion => {

      // Se extrae el contenido Json paginador
      this.listaPedidos = paginacion.content as Pedido[]; // Arreglo de cliente lista paginada
      this.totalRegistros = paginacion.totalElements as number; // Cantidad de registros
      this.paginador._intl.itemsPerPageLabel = 'Registros por página:';

      // Para utilizar la Tabla en Angular Material organiza la la informacion en MatTableDataSource para usar los componentes de Angular
      this.datos = new MatTableDataSource<Pedido>(this.listaPedidos);

      // asigna el sorting al MatTableDataSource
      this.datos.sort = this.ordenadorRegistros;
      this.datos.sort.active = 'nombres';
      this.datos.sort.direction = 'asc';

    });
  }

  // Abrir Ventana Modal Del formulario
  AbrirVentanaFormulario(): void {
      const referenciaVentanaModal = this.ventanaModal.open(FormPedidoComponent,
        {
          width: '60%',
          height: 'auto',
          position: {left: '30%', top: '60px'}
        });
      referenciaVentanaModal.afterClosed().subscribe( pedido => {

          if (pedido != null) {
            this.CrearPedido(pedido);
            this.ActualizarBodegaInventarioPorPedido(pedido);
          }
        });
      }

  

      // Se actualiza la Bodega Inventario cada vez que se haga un Pedido
      ActualizarBodegaInventarioPorPedido(pedido): void {

        // Recorremos el la lista Cotizacion
        pedido.listaCotizacion.forEach( (cotizacion) => {
          
          this.bodegaInventario = cotizacion.bodegaInventario;
          this.bodegaInventario.id = cotizacion.bodegaInventario.id;

          // Suastraemos de Bodega la cantidad pedida y asignamos a bodega la nueva cantidad 
          this.bodegaInventario.cantidad = cotizacion.bodegaInventario.cantidad - cotizacion.cantidad;

          // Actualizamos bodegaInventario
          this.bodegaInventarioService.ActualizarBodegaInventario(this.bodegaInventario).subscribe( resp => {});
        });
      }

      // Crea Pedido
      public CrearPedido(pedido): void {

        this.pedido = pedido;
        /* this.AgregarEnvioCiudad(this.pedido.envioCiudad); */
        // Pasamos las variables del Formulario a Pedido
        
       
        this.pedido.valorFinalVenta = 0;
        this.pedido.id = null; // El id se pone nulo para que se cree un pedido nuevo
        
        // Se Recorro la lista, para Calcular el valorFinalVenta
        this.pedido.listaCotizacion.forEach( cotizacion => {
         
          cotizacion.importe = (cotizacion.bodegaInventario.producto.precioVenta-(cotizacion.bodegaInventario.producto.precioVenta*cotizacion.descuento/100)) * cotizacion.cantidad;
          
          // Sumatoria de los importes
          this.pedido.valorFinalVenta = cotizacion.importe + this.pedido.valorFinalVenta;
        });

        // Le sumo El valor del Envío al Pedido
        this.pedido.valorFinalVenta = this.pedido.valorFinalVenta + this.pedido.valorEnvio;
        
        // Crear Pedido
        this.pedidoService.CrearPedido(this.pedido).subscribe(respuesta => {

          
           // Le ponemos la id que se crea al pedido
          this.pedido.id = respuesta.pedido.id;
         
          // Llenamos el campo 
          this.movimiento.pedido = this.pedido;
          this.movimiento.dinero = this.pedido.valorFinalVenta;
          // Tipo de Movimiento Salida de Bodega # 2
          this.movimiento.tipo = 2;

          this.movimientoService.agregarElemento(this.movimiento).subscribe( agregarMovimiento => {this.listarPaginado()});


          // Se desplaza por la lista Cotizacion de Pedido
          this.pedido.listaCotizacion.forEach( (cotizacion,index) => {

            // Se llena el campo Pedido en Cotizacion
            cotizacion.pedido = this.pedido;

            // Se limpia la lista de cotizacion del atributo Pedido para evitar bucle infinito en el JSON
            cotizacion.pedido.listaCotizacion = [];

            // Se crea la cotizacion
            this.cotizacionService.CrearCotizacion(cotizacion).subscribe(rta => { });
           
          });
          
       
        });
        this.listarPaginado();
         
        alertasSweet.fire('Nuevo pedido', this.pedido.cliente.nombres , 'success'); 
        
      }

    
      // Ventana Detalle
      AbrirVentanaDetalle(idPedido): void {
        this.ventanaModal.open(DetallePedidoComponent, {
          width: '70%',
          height: 'auto',
          position: {left: '25%', top: '60px'},
          data: idPedido
        });
      }

      // Eliminar Pedido
      EliminarPedido(pedido: Pedido): void {

        swal.fire ({
          title: '¿Estas seguro?',
          text: '¿Seguro que desea Eliminar el Pedido, '+ pedido.cliente.nombres +' ?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#ad3333',
          cancelButtonText: 'No, cancelar!',
          confirmButtonText: 'Si, eliminar!'
        }).then((result) => {
           
           if (result.value) {

            // Se  Actualiza Bodega Inventario Al Eliminar Un Pedido
            this.ActualizarBodegaInventarioAlEliminarUnPedido(pedido);

            // Se recorre la lista de Cotizacion 
            pedido.listaCotizacion.forEach(cotizacion => {

              // Se Consulta la lista de Movimientos
              this.movimientoService.listarElementos().subscribe(movimientos => {
                
                // Se Recorre la lista de Movimientos
                movimientos.forEach(elementoMovimiento => {

                  // Los Movimientos Tipo Pedidos    
                  if(elementoMovimiento.pedido != null){
                  
                    // Se dectecta el Pedido a Eliminar en Pedido y en Movimiento se cambia el Tipo(estado eliminado)
                    if(pedido.id == elementoMovimiento.pedido.id){
                  
                       // Le pongo Tipo(# 3 de Eliminado manual)
                       this.movimiento = elementoMovimiento;
                       this.movimiento.tipo = 3;
                   
                       // Actualizo Tipo(# 3 Eliminado manual) en Movimientos
                       this.movimientoService.editarElemento(this.movimiento).subscribe(resp => { this.listarPaginado();});
                    }
                  }
                }) 
              });
              
              // Se Elimina cada Elemento de la lista Cotizacion
              this.cotizacionService.EliminarCotizacion(cotizacion.id).subscribe( respuesta => {});
            });
            
            // Se Elimina el Pedido
            this.pedidoService.EliminarPedido(pedido.id).subscribe(respuesta => {this.listarPaginado();});
            alertasSweet.fire('Pedido Eliminado!', 'Pedido <strong>' + pedido.cliente.nombres + '</strong> Eliminado con éxito.', 'success');
           }
        });
      }

      // Se  Actualiza Bodega Inventario Al Eliminar Un Pedido
      ActualizarBodegaInventarioAlEliminarUnPedido(pedido): void {

        // Recorremos el la lista Cotizacion
        pedido.listaCotizacion.forEach( (cotizacion) => {
          
          this.bodegaInventario = cotizacion.bodegaInventario;
          this.bodegaInventario.id = cotizacion.bodegaInventario.id;

          // Suastraemos de Bodega la cantidad pedida y asignamos a bodega la nueva cantidad 
          this.bodegaInventario.cantidad = cotizacion.bodegaInventario.cantidad + cotizacion.cantidad;

          // Actualizamos bodegaInventario
          this.bodegaInventarioService.ActualizarBodegaInventario(this.bodegaInventario).subscribe( resp => {});
        });
      }


    // Abrir ventana Modal Formulario De Pedido
    AbrirVentanaEditarPedido(idPedido): void {
      const ventanaModalPedido = this.ventanaModal.open(FormPedidoComponent, {
        width: '60%',
        height: 'auto',
        position: {left: '30%', top: '60px'},
        data: idPedido
      });
      ventanaModalPedido.afterClosed().subscribe(pedidoEditadoFormulario => {
        if (pedidoEditadoFormulario) {
          this.pedido = pedidoEditadoFormulario;
          // this.pedido.id = idPedido;
          this.ActualizarPedido();
        }
      });
    }

    // Actualizar Pedido En Base de Datos
    ActualizarPedido(): void {
      this.pedidoService.CrearPedido(this.pedido).subscribe( pedido => {
        this.listarPaginado();
        swal.fire('Pedido Actializado', `Pedido ${this.pedido.cliente.nombres} actualizado con éxito!`, 'success');
      });
    }

    // Buscador
    AplicarFiltro(event: Event) {
        const textoFiltro = (event.target as HTMLInputElement).value;
        this.datos.filter = textoFiltro.trim().toLowerCase();
     }



}
