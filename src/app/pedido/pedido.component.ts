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

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent implements OnInit {

  public pedido: Pedido;
  public listaPedidos: Pedido[];

  // Titulos de cada Columna
  columnasTabla: string [] = ['fechaPedido', 'valorFinalVenta', 'cliente', 'acciones'];
  datos: MatTableDataSource<Pedido>;

  // Variables con valores iniciales para el paginador
  totalRegistros = 0;
  paginaActual = 0;
  totalPorPaginas = 3;
  pageSizeOptions: number[] = [3, 5, 10, 25, 100];
  @ViewChild(MatPaginator, {static: true}) paginador: MatPaginator;
  @ViewChild(MatSort, {static: true}) ordenadorRegistros: MatSort;

  constructor(public ventanaModal: MatDialog,
              public pedidoService: PedidoService) { }

  ngOnInit(): void {
    /*this.pedidoService.VerListaPedidos().subscribe(pedidos => {
      this.listaPedidos = pedidos;
    });*/
    this.listarPaginado();
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
        case 'fechaPedido': return this.comparar( a.fechaPedido, b.fechaPedido, esAscendente);
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
  private listarPaginado(): void {

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
      referenciaVentanaModal.afterClosed().subscribe( resultado => {
          if (resultado != null) {
            this.pedido = resultado;
            console.log(this.pedido.horaPedido);
            console.log(this.pedido.fechaPedido);
            this.CrearPedido();
          }
        });
      }

      // Crea Pedido
      public CrearPedido(): void {
        this.pedidoService.CrearPedido(this.pedido).subscribe(response => {
        console.log(this.pedido.horaPedido);
        this.listarPaginado();
        swal.fire('Nuevo Pedido', `Pedido de ${this.pedido.cliente.nombres} creado con exito!`, 'success');
        });
      }

      // Ventana Detalle
      AbrirVentanaDetalle(idPedido): void {
        this.ventanaModal.open(DetallePedidoComponent, {
          width: '60%',
          height: 'auto',
          position: {left: '30%', top: '60px'},
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
             this.pedidoService.EliminarPedido(pedido.id).subscribe(respuesta => {
             this.listarPaginado();
             alertasSweet.fire('Pedido Eliminado!', 'Pedido <strong>' + pedido.cliente.nombres + '</strong> Eliminado con éxito.', 'success');
              });
           }
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
