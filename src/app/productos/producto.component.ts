import { Component, OnInit, ViewChild, ɵConsole } from '@angular/core';
import { Producto } from './producto';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { ProductoService } from './producto.service';
import { MatDialog } from '@angular/material/dialog';
import { ProductoFormComponent } from './productoForm/producto-form.component';
import { ProductoDetalleComponent } from './productoDetalle/producto-detalle.component';
import alertasSweet from 'sweetalert2';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PiezaService } from '../piezas/pieza.service';
import { ProductoPiezaService } from '../productoPieza/producto-pieza.service';
import { ProductoPieza } from '../productoPieza/ProductoPieza';
import { Pieza } from '../piezas/pieza';




@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})





export class ProductoComponent implements OnInit {


/// variables de nombres y rutas de funcionalidades
titulo = 'Productos';
rutaFuncionalidad = 'Inventario / Listar productos';


// variables para el MatTableDatasource<Material>
datos: MatTableDataSource<Producto>;
columnasTabla: string[] = ['nombre', 'referencia', 'estado', 'acciones'];


// variables para el paginador
tamanoPagina = 5;
paginaIndex = 0;
totalRegistros = 0;
tamanosPagina = [5, 10, 15, 20, 25];

@ViewChild(MatPaginator, {static: true}) paginador: MatPaginator;


// Variables para el Sort
@ViewChild(MatSort, {static: true}) ordenadorRegistros: MatSort;


// en esta variable quedará almacenada la lista de materiuales
listaProductos: Producto[];

// en esta variable se asignará el valor recibido en el formulario
producto: Producto;
productoConID: Producto;


productoPieza: ProductoPieza = new ProductoPieza();
piezasConID = new Array<Pieza>();

  constructor(private productoService: ProductoService,
              private piezaService: PiezaService,
              private productoPiezaService: ProductoPiezaService,
              public ventanaModal: MatDialog) { }

  ngOnInit(): void {
    this.listarProductoPaginado();
  }







  /*
    El método listarMaterialPaginado() invoca el método del service que
    realiza una petición tipo GET al backend y se suscribe al observador
    que retorna el método del service para obtener los datos de la respuesta

    Parámetros: nada
    Retorna: nada
  */
 listarProductoPaginado(): void {
  this.productoService.obtenerProductosPaginado(this.paginaIndex.toString(), this.tamanoPagina.toString()).subscribe( respuesta => {

    // establecemos los nuevos valores de la paginación de acuerdo al contenido de la respuesta
    this.listaProductos = respuesta.content as Producto[];
    this.totalRegistros = respuesta.totalElements as number;

    // instanciamos el MatTablaDataSource con la lista obtenida en la respuesta
    this.datos = new MatTableDataSource<Producto>(this.listaProductos);

    // asignamos el paginador al MatTablaDataSource
    this.datos.paginator = this.paginador;

    // Establecemos los valores de las variables relacionadas con Sort
    this.datos.sort = this.ordenadorRegistros;
    this.datos.sort.active = 'nombre';
    this.datos.sort.direction = 'asc';

  });
}



reordenar(sort: Sort): void {

// obtenemos el array
const listTallas = this.listaProductos.slice();

if (!sort.active || sort.direction === '') {
  return;
}

this.datos = new MatTableDataSource<Producto>(
  this.listaProductos = listTallas.sort( (a, b) => {
    const esAscendente = sort.direction === 'asc'; // se determina si es ascendente
    switch (sort.active) { // sort.active obtiene el id (string) de la columna seleccionada
      case 'nombre': return this.comparar( a.nombre, b.nombre, esAscendente);
      case 'referencia': return this.comparar(a.referencia, b.referencia, esAscendente);
    }
  }));
}


comparar(a: number | string, b: number | string, esAscendente: boolean) {
return (a < b ? -1 : 1) * (esAscendente ? 1 : -1);
}



aplicarFiltro(event: Event) {
const textoFiltro = (event.target as HTMLInputElement).value;
this.datos.filter = textoFiltro.trim().toLowerCase();
}


paginar(evento: PageEvent): void {
  this.paginaIndex = evento.pageIndex;
  this.tamanoPagina = evento.pageSize;
  this.totalRegistros = evento.length;
  this.listarProductoPaginado();
}







// ----------------- funciones para el control de ventanas modales --------------- //

abrirVentanaAgregar(): void {
  const referenciaVentanaModal = this.ventanaModal.open(ProductoFormComponent, {
    width: '60%',
    height: 'auto',
    position: {left: '30%', top: '60px'}
  });

  referenciaVentanaModal.afterClosed().subscribe( resultado => {
    if (resultado) {
      this.producto = resultado;
      this.agregarProducto();
    }
  });
}


abrirVentanaEditar(idProducto: number): void {
  const referenciaVentanamodal = this.ventanaModal.open(ProductoFormComponent, {
    width: '60%',
    height: 'auto',
    position: {left: '30%', top: '60px'},
    data: idProducto
  });

  referenciaVentanamodal.afterClosed().subscribe(resultado => {
    this.producto = resultado;
    this.producto.id = idProducto;
    this.editarProducto();
  });
}

abrirVentanaDetalle(idProducto: number): void {
  const referenciaVentanaModal = this.ventanaModal.open(ProductoDetalleComponent, {
    width: '60%',
    height: 'auto',
    position: {left: '30%', top: '60px'},
    data: idProducto
  });
}



// --------------- funciones para el CRUD -------------------------------- //



agregarProducto(): void {

  /*
    En el Backend el producto está relacionado con PiezaProducto y NO con las piezas.
    Al realizar el POST de producto, el resultado es un producto sin las piezas,
    es decir, estas se pierden por lo tanto, se hace necesario guardar el producto que se recibe del
    componente anterior en una variable auxiliar y luego asignar al producto el ID para seguirlo usando
  */
    this.productoService.agregarProducto(this.producto).subscribe( resultado => {
    this.productoConID = resultado.producto; // sobreescribo el producto porque el que viene del backend tiene el ID

    /*
      Asigno el ID al producto porque al ser un producto nuevo es necesario
      insertarlo primero para luego usarlo en los insert de las demás tablas
    */
    this.producto.id = this.productoConID.id;

    this.producto.piezas.forEach( pieza => {

        pieza.producto = this.producto; // asocio el producto ya con ID a cada una de las piezas

        // limpio la lista de piezas del atributo Producto para evitar bucle infinito en el JSON
        pieza.producto.piezas = [];
        this.piezaService.agregarPieza(pieza).subscribe(r => {});

    });

    alertasSweet.fire('Nuevo producto', resultado.mensaje, 'success');
    this.listarProductoPaginado();

  });



}






editarProducto(): void {

  console.log('entrta a modificar');

  this.productoService.modificarProducto(this.producto).subscribe(resultado => {

    this.producto.piezas.forEach( pieza => {
      if (!pieza.id) {
        pieza.producto = this.producto; // asigno el producto a la pieza
        pieza.producto.piezas = []; // limpio para evitar bucle infinito
        this.piezaService.agregarPieza(pieza).subscribe(respuesta => console.log(respuesta));
      }
    });
    alertasSweet.fire('Producto actualizado', resultado.mensaje, 'success');
    this.listarProductoPaginado();
  });
}



eliminarProducto(producto: Producto): void {
  alertasSweet.fire({
    title: 'Cuidado!',
    text: '¿Desea eliminar el producto ' + producto.nombre + '?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#ad3333',
    confirmButtonText: 'Sí, eliminar!'
  }).then((result) => {
    if (result.value) {

      producto.piezas.forEach( pieza => {
        this.piezaService.eliminarPieza(pieza).subscribe();
      });

      this.productoService.eliminarProducto(producto).subscribe(respuesta => {
        alertasSweet.fire(
          'Eliminado!',
          'El producto <strong>' + producto.nombre + '</strong> ha sido eliminado exitosamente',
          'success'
        );
        this.listarProductoPaginado();
      });
    }
  });

}









}
