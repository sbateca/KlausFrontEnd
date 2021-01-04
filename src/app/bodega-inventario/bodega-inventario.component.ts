import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormBodegaInventarioComponent } from './form-bodega-inventario/form-bodega-inventario.component';
import { BodegaInventario } from './bodega-inventario';
import { BodegaInventarioService } from './bodega-inventario.service';
import swal from 'sweetalert2';
import { DetalleBodegaInventarioComponent } from './detalle-bodega-inventario/detalle-bodega-inventario.component';
// import alertasSweet from 'sweetalert2';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
/* import { Talla } from '../tallas/talla';
import { TipoTalla } from '../tiposTallas/TipoTalla'; */

@Component({
  selector: 'app-bodega-inventario',
  templateUrl: './bodega-inventario.component.html',
  styleUrls: ['./bodega-inventario.component.css']
})
export class BodegaInventarioComponent implements OnInit {

  public bodegaInventario: BodegaInventario;
  public listaBodegaInventario = new Array<BodegaInventario>();
  public contador = new Array( this.listaBodegaInventario.length);
  public listaBodegaInventarioActualizada = new Array<BodegaInventario>();
public total = 0;
  private bodegaInventarioAgregar = new BodegaInventario();

  // Tabla
  columnasTabla: string [] = ['producto', 'talla', 'cantidad', 'acciones'];

  constructor(private ventanaModal: MatDialog,
              private bodegaInventarioService: BodegaInventarioService) { }

  ngOnInit(): void {

    this.bodegaInventarioService.ListaBodegaInventario().subscribe( bodegaInventario => {
      this.listaBodegaInventario = bodegaInventario;
      this.listaBodegaInventario.forEach(elemento => {
      this.total = this.total + elemento.cantidad;
      /* console.log("Total");
      console.log(this.total);
      console.log("Base en Dinero");
      console.log(this.total*52000);
      console.log("ganancia estimada en Dinero");
      console.log(this.total*(80500-52000));
      console.log("15%");
      console.log(this.total*52000*15/100); */
      });
    });
    this.ListarPaginado();
  }

// Abrir Formulario Bodega Inventario
AbrirFormularioBodegaInventario(): void {
  const VentanaModal = this.ventanaModal.open(FormBodegaInventarioComponent,
    {
      width: '60%',
      height: 'auto',
      position: {left: '30%', top: '60px'}
 });
  VentanaModal.afterClosed().subscribe( inventarioFormulario => {
  // no hay resultados cuando se cancela la operación (se cierra la ventana modal)
  if (inventarioFormulario != null) {
    this.CrearBodegaInventario(inventarioFormulario);
  }
});
}


// Crear Bodega Inventario
CrearBodegaInventario(inventarioFormulario): void {

  this.bodegaInventarioService.ListaBodegaInventario().subscribe( listaInventarioBD => {

      /*
        recorremos la lista que viene de base de datos para tomar cada uno de los productos y
        compararlo con el que viene del formulario
      */

      if (listaInventarioBD.length === 0) {
        inventarioFormulario.listaComponentesInventario.forEach( elementoFormulario => {
          const objetoInventario = new BodegaInventario();
          objetoInventario.producto = inventarioFormulario.producto;
          objetoInventario.cantidad = elementoFormulario.cantidad_;
          objetoInventario.estadoDescuento = elementoFormulario.estadoDescuento_;
          objetoInventario.descuento = elementoFormulario.descuento_;
          objetoInventario.talla = elementoFormulario.talla_;
          objetoInventario.talla.tipoTalla = inventarioFormulario.tipoTalla;

          this.bodegaInventarioService.CrearBodegaInventario(objetoInventario).subscribe( resultadoAgregar => {
            this.ListarPaginado();
            swal.fire('Nuevo Producto en Bodega Inventario',
               `Bodega Inventario ${objetoInventario.producto.nombre} creado con exito!`, 'success');
          });
        });
      } else {

        let contador1 = 0;


        listaInventarioBD.forEach((elementoInventarioBD: BodegaInventario, index: number, array: BodegaInventario[]) => {
          // recorremos la lista de tallas del formulario para compararlas con el elemento de inventario de turno

          if (inventarioFormulario.listaComponentesInventario.length === 1) {
            contador1++;
          }

          inventarioFormulario.listaComponentesInventario.forEach( (elementoFormulario, index2) => {
            if (index < 1 )  { // Para que una sola vez se iniciallice en cero 
              this.contador[index2] = 0;
            }

            const objetoInventario = new BodegaInventario();
            objetoInventario.producto = inventarioFormulario.producto;
            objetoInventario.cantidad = elementoFormulario.cantidad_;
            objetoInventario.estadoDescuento = elementoFormulario.estadoDescuento_;
            objetoInventario.descuento = elementoFormulario.descuento_;
            objetoInventario.talla = elementoFormulario.talla_;
            objetoInventario.talla.tipoTalla = inventarioFormulario.tipoTalla;

            const hayTalla = this.comprobarExisteTallaEnBD(elementoInventarioBD, objetoInventario);

            if (hayTalla) {

              objetoInventario.id = elementoInventarioBD.id;
              objetoInventario.cantidad = elementoInventarioBD.cantidad + elementoFormulario.cantidad_;
              this.bodegaInventarioService.ActualizarBodegaInventario(objetoInventario).subscribe( resultadoAgregar => {
                this.ListarPaginado();
                swal.fire('Nuevo Producto en Bodega Inventario',
                   `Bodega Inventario ${objetoInventario.producto.nombre} creado con exito!`, 'success');
              });
              contador1 = 0;
            } else {

              this.contador[index2]++;

              if (this.contador[index2] === listaInventarioBD.length || contador1 === listaInventarioBD.length ) {

                this.bodegaInventarioService.CrearBodegaInventario(objetoInventario).subscribe( resultadoAgregar => {
                  this.ListarPaginado();
                  swal.fire('Nuevo Producto en Bodega Inventario',
                     `Bodega Inventario ${objetoInventario.producto.nombre} creado con exito!`, 'success');
                });
                contador1 = 0;
              }
            }
          });
        });

      }
  });
}

comprobarExisteTallaEnBD(elementoBD: BodegaInventario, elementoABuscar: BodegaInventario): boolean {
// comprobarExisteTallaEnBD(): boolean {
    if (elementoBD.producto.id === elementoABuscar.producto.id) {
      if (elementoBD.talla.tipoTalla.id === elementoABuscar.talla.tipoTalla.id) {
        if (elementoBD.talla.id === elementoABuscar.talla.id) {
          return true;
        } else {
          return false;
        }
      }
    }

}

// Abrir Ventana Detalle Bodega Inventario
public AbrirVentanaDetalle(idBodegaInventario): void {
  this.ventanaModal.open(DetalleBodegaInventarioComponent,
   {
      width: '60%',
      height: 'auto',
      position: { left: '30%', top: '60px'},
      data: idBodegaInventario
   });
}

// Abrir Ventana Actualizar Bodega Inventario
AbrirVentanaEditarBodegaInventario(idBodegaInventario): void {
  const referenciaVentanaModal = this.ventanaModal.open(FormBodegaInventarioComponent, {
    width: '60%',
    height: 'auto',
    position: {left: '30%', top: '60px'},
    data: idBodegaInventario
  });
  referenciaVentanaModal.afterClosed().subscribe( resultado => {
    if (resultado) {
      this.bodegaInventario = resultado;
      this.bodegaInventario.id = idBodegaInventario;
      this.ActualizarBodegaInventario();
    }
  });
}

// Actualizar Bodega Inventario
ActualizarBodegaInventario(): void {
    this.bodegaInventarioService.ActualizarBodegaInventario(this.bodegaInventario)
    .subscribe(respuesta => {
      this.ListarPaginado();
      // swal.fire('Producto Bodega-Inventario Actializado',
      // Producto Bodega-Inventario ${this.bodegaInventario.producto.nombre} actualizado con éxito!`, 'success');
    });
  }
// Eliminar Bodega Inventario
EliminarBodegaInventario(bodegaInventario: BodegaInventario): void {
  swal.fire ({

    title: '¿Estas seguro?',
 // text: '¿Seguro que desea Eliminar El producto de Bodega-Inventario, '+ bodegaInventario. producto.nombre +' ?',
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#ad3333',
  cancelButtonText: 'No, cancelar!',
  confirmButtonText: 'Si, eliminar!'

   }).then((result) => {
     if (result.value) {
       this.bodegaInventarioService.EliminarBodegaInventario(bodegaInventario.id).subscribe(respuesta => {
        this.ListarPaginado();
      // alertasSweet.fire('Producto Eliminado de Bodega-Inventario!', 
      // 'Producto <strong>' + bodegaInventario.producto.nombre + '</strong> Eliminado con éxito.', 'success');
        });
     }
    });
}

// Buscador
datos: MatTableDataSource<BodegaInventario>;
AplicarFiltro(event: Event) {
  const textoFiltro = (event.target as HTMLInputElement).value;
  this.datos.filter = textoFiltro.trim().toLowerCase();
}

// Paginador

// Variables con valores iniciales para el paginador
totalRegistros = 0;
paginaActual = 0;
totalPorPaginas = 200;  
pageSizeOptions: number[] = [3, 5, 10, 25, 100, 200, 500];
@ViewChild(MatPaginator, {static: true}) paginador: MatPaginator;
// datos: MatTableDataSource<BodegaInventario>;

// Listar Paginado : Realiza el get deacuerdo a los valores actualizados de cada pagina
private ListarPaginado() {
  this.bodegaInventarioService.PaginadoBodegaInventario(this.paginaActual.toString(), this.totalPorPaginas.toString())
  .subscribe(paginacion => {

    // Se extrae el contenido Json paginador
    this.listaBodegaInventario = paginacion.content as BodegaInventario[]; // Arreglo de cliente lista paginada
    this.totalRegistros = paginacion.totalElements as number; // Cantidad de registros
    this.paginador._intl.itemsPerPageLabel = 'Registros por página:';

    // Para utilizar la Tabla en Angular Material
    // Organiza la la informacion en MatTableDataSource para usar los componentes de Angular
    this.datos = new MatTableDataSource<BodegaInventario>(this.listaBodegaInventario);

  });
}
// Se Pagina PageEvent--> El evento de tipo PageEvent
  paginar(evento: PageEvent): void {
    this.paginaActual = evento.pageIndex;
    this.totalPorPaginas = evento.pageSize; // Lo que enviamos al backend
    this.ListarPaginado();
  }
// Reordenar Tabla Bodega IOnventario
@ViewChild(MatSort, {static: true}) ordenadorRegistros: MatSort;
  Reordenar(sort: Sort) {

    const listBodegaInventario = this.listaBodegaInventario.slice(); // obtenemos el array*/
    /*
    Si no está activo el sorting o no se ha establecido la dirección del sorting (asc ó desc)
    se asigna los mismos datos (sin ordenar)
    */
    if (!sort.active || sort.direction === '' ) {
       this.datos = new MatTableDataSource<BodegaInventario>(this.listaBodegaInventario);
       return;
    }
    this.datos = new MatTableDataSource<BodegaInventario>(
    this.listaBodegaInventario = listBodegaInventario.sort( (a, b) => {
      const esAscendente = sort.direction === 'asc'; // se determina si es ascendente
      switch (sort.active) { // sort.active obtiene el id (string) de la columna seleccionada
        case 'producto': return this.comparar( a.producto.id, b.producto.id, esAscendente);
        case 'talla': return this.comparar(a.talla.id, b.talla.id, esAscendente);
        case 'cantidad': return this.comparar( a.cantidad, b.cantidad, esAscendente);
      }
    })
    );
        // cada vez que se haga clic en un botón para reordenar es necesario paginar de nuevo
    }
    // Esta función compara dos String junto con el valor de la variable isAsc y retorna:
    comparar(a: number | string, b: number | string, esAscendente: boolean) {
    return (a < b ? -1 : 1) * (esAscendente ? 1 : -1);
    }
}
