import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Movimiento } from '../movimiento';
import { MovimientoService } from '../movimiento.service';
import { Pedido } from '../../pedido/pedido';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Sort, MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { DetalleMovimientosComponent } from '../detalle-movimientos/detalle-movimientos.component';

@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.css']
})
export class MovimientosComponent implements OnInit {

  public listaMovimientos: Movimiento[];
  public listaPedido: Pedido[];


  // Variables con valores iniciales para el paginador
  totalRegistros = 0;
  paginaActual = 0;
  totalPorPaginas = 100;
  pageSizeOptions: number[] = [3, 5, 10, 25, 100, 200, 300];
  @ViewChild(MatPaginator, {static: true}) paginador: MatPaginator;
  @ViewChild(MatSort, {static: true}) ordenadorRegistros: MatSort;

  // Titulos de cada Columna
  columnasTabla: string [] = ['fecha', 'hora', 'tipo', 'dinero', 'acciones'];
  datos: MatTableDataSource<Movimiento>;

  constructor(private movimientoService: MovimientoService,
              public ventanaModal: MatDialog) { }

  ngOnInit(): void {
    this.listarPaginado();
  }

  // Cargar Movimiento
  CargarMovimientos(){
    this.movimientoService.listarElementos().subscribe(movimientos => {
      this.listaMovimientos = movimientos;
      console.log("movimientos");
      console.log(this.listaMovimientos);
    });
  }
  
   // Calcular Tipo
   public CalcularTipo(movimiento): any{
    if(movimiento.tipo == 1){
      return 'Pedido';
     }
     if(movimiento.tipo == 2){
      return 'Bodega';
     }
     if(movimiento.tipo == 3){
      return 'Pedido Eliminado Manual';
     }
     if(movimiento.tipo == 4){
      return 'Producto Eliminado de Bodega Manual';
     }
    }

    // Buscador
    aplicarFiltro(event: Event) {
      const textoFiltro = (event.target as HTMLInputElement).value;
      this.datos.filter = textoFiltro.trim().toLowerCase();
    }

  // Realiza el control de la paginacion, y las pagina.
  // Cada vez que se seleccione un boton del paginador se actualizan los valores
  // PageEvent--> El evento de tipo PageEvent
  paginar(evento: PageEvent): void {
    this.paginaActual = evento.pageIndex;
    this.totalPorPaginas = evento.pageSize; // Lo que enviamos al backend
    this.totalRegistros = evento.length;
    this.listarPaginado();
  }

    
    // Listar paginado : Realiza el get deacuerdo a los valores actualizados de cada pagina
private listarPaginado() {

  this.movimientoService.obtenerElementosPaginado(this.paginaActual.toString(), this.totalPorPaginas.toString())
  .subscribe(paginacion => {

    // Se extrae el contenido Json paginador
    this.listaMovimientos = paginacion.content as Movimiento[]; // Arreglo de Movimientos lista paginada
    this.totalRegistros = paginacion.totalElements as number; // Cantidad de registros
    this.paginador._intl.itemsPerPageLabel = 'Registros por página:';

    // Para utilizar la Tabla en Angular Material
    // Organiza la la informacion en MatTableDataSource para usar los componentes de Angular
    this.datos = new MatTableDataSource<Movimiento>(this.listaMovimientos);

    // asigna el sorting al MatTableDataSource
    this.datos.sort = this.ordenadorRegistros;
    this.datos.sort.active = 'nombres';
    this.datos.sort.direction = 'asc';

  });
}

reordenar(sort: Sort) {

  // Lista movimientos
  const listaMovimientos = this.listaMovimientos.slice(); 

  /* Si no está activo el sorting o no se ha establecido la dirección del sorting (asc ó desc)
  se asigna los mismos datos (sin ordenar) */

  if (!sort.active || sort.direction === '' ) {
     this.datos = new MatTableDataSource<Movimiento>(this.listaMovimientos);
     return;
  }
  this.datos = new MatTableDataSource<Movimiento>(
  this.listaMovimientos = listaMovimientos.sort( (a, b) => {
    const esAscendente = sort.direction === 'asc'; // se determina si es ascendente
    switch (sort.active) { // sort.active obtiene el id (string) de la columna seleccionada
      case 'fecha': return this.comparar(a.id, b.id, esAscendente);
      case 'hora': return this.comparar(a.id, b.id, esAscendente);
      case 'tipo': return this.comparar( a.tipo, b.tipo, esAscendente);
      case 'dinero': return this.comparar( a.dinero, b.dinero, esAscendente);
    }
  }));
      // cada vez que se haga clic en un botón para reordenar es necesario paginar de nuevo
  }
  // Esta función compara dos String junto con el valor de la variable isAsc y retorna:
  comparar(a: number | string, b: number | string, esAscendente: boolean) {
  return (a < b ? -1 : 1) * (esAscendente ? 1 : -1);
  }

  
/* La función abrirVentanaVer() permite abrir una ventana modal la cual carga la vista
  donde se observa el detalle del proveedor seleccionado */

  abrirVentanaVer(idMovimiento): void {
    this.ventanaModal.open(DetalleMovimientosComponent, {
      width: '60%',
      height: 'auto',
      position: {left: '30%', top: '60px'},
      data: idMovimiento
    });
  }
   
    
  
  

}
