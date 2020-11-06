import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormBodegaInventarioComponent } from './form-bodega-inventario/form-bodega-inventario.component';
import { BodegaInventario } from './bodega-inventario';
import { BodegaInventarioService } from './bodega-inventario.service';
import swal from 'sweetalert2';
import { DetalleBodegaInventarioComponent } from './detalle-bodega-inventario/detalle-bodega-inventario.component';
import alertasSweet from 'sweetalert2';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { ReferenciaProductoService } from '../referenciaProducto/referencia-producto.service';
import { ReferenciaProducto } from '../referenciaProducto/referencia-producto';
import { Talla } from '../tallas/talla';
import { TipoTalla } from '../tiposTallas/TipoTalla';

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

  private bodegaInventarioAgregar = new BodegaInventario();
  
  // Tabla
  columnasTabla: string [] = ['producto', 'talla', 'cantidad', 'acciones'];

  constructor(private ventanaModal: MatDialog,
              private bodegaInventarioService: BodegaInventarioService) { }

  ngOnInit(): void {

   /*  this.listaBodegaInventario.forEach((valor, i ) => {
      this.contador[i] = 0;
    }); */

    this.bodegaInventarioService.ListaBodegaInventario().subscribe( bodegaInventario => {
      this.listaBodegaInventario = bodegaInventario;
      console.log(this.listaBodegaInventario);
      /* if (this.listaBodegaInventario.length !== 0) {
        console.log("Hay algo en base de datos");
     } else {
       console.log("base de datos vacia");
     } */
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

  console.log("inventario Formulario");
  console.log(inventarioFormulario);
  this.bodegaInventarioService.ListaBodegaInventario().subscribe( listaInventarioBD => {

      /*
        recorremos la lista que viene de base de datos para tomar cada uno de los productos y
        compararlo con el que viene del formulario
      */

      console.log('listado de BD');
      console.log(listaInventarioBD);


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
            swal.fire('Nuevo Producto en Bodega Inventario',
               `Bodega Inventario ${objetoInventario.producto.nombre} creado con exito!`, 'success');

          });
        });
        this.ListarPaginado();

      } else {

        // let contador = new Array(listaInventarioBD.length);
        // console.log(this.contador);
        let contador1 = 0;


        listaInventarioBD.forEach((elementoInventarioBD: BodegaInventario, index: number, array: BodegaInventario[]) => {
          // recorremos la lista de tallas del formulario para compararlas con el elemento de inventario de turno
          /* console.log("tamaño BD");
          console.log(listaInventarioBD.length);

          console.log("tamaño formulario");
          console.log(inventarioFormulario.listaComponentesInventario.length); */
          if (inventarioFormulario.listaComponentesInventario.length === 1) {
            contador1++;
            /* console.log("contador1");
            console.log(contador1); */
          }
          /* console.log("index");
          console.log(index); */

          inventarioFormulario.listaComponentesInventario.forEach( (elementoFormulario, index2) => {
            if (index < 1 )  {
              this.contador[index2] = 0;
            }

            const objetoInventario = new BodegaInventario();
            objetoInventario.producto = inventarioFormulario.producto;
            objetoInventario.cantidad = elementoFormulario.cantidad_;
            objetoInventario.estadoDescuento = elementoFormulario.estadoDescuento_;
            objetoInventario.descuento = elementoFormulario.descuento_;
            objetoInventario.talla = elementoFormulario.talla_;
            objetoInventario.talla.tipoTalla = inventarioFormulario.tipoTalla;

            /* console.log('Formulario');
            console.log(objetoInventario.talla.talla, objetoInventario.cantidad);
            console.log('Inventario Base De Datos');
            console.log(elementoInventarioBD.talla.talla, elementoInventarioBD.cantidad); */

            const hayTalla = this.comprobarExisteTallaEnBD(elementoInventarioBD, objetoInventario);

            /* console.log("Hay talla");
            console.log(hayTalla); */


            if (hayTalla) {

              objetoInventario.id = elementoInventarioBD.id;
              objetoInventario.cantidad = elementoInventarioBD.cantidad + elementoFormulario.cantidad_;
              this.bodegaInventarioService.ActualizarBodegaInventario(objetoInventario).subscribe( resultadoAgregar => {
                swal.fire('Nuevo Producto en Bodega Inventario',
                   `Bodega Inventario ${objetoInventario.producto.nombre} creado con exito!`, 'success');
              });
              contador1 = 0;
            } else {
              /* console.log("No se repite");
              console.log(objetoInventario);
 */
              this.contador[index2]++;
              /* console.log("contador index2: "+ index2);
              console.log(this.contador[index2]);
              console.log(this.contador); */

              // if (this.contador[index2] === listaInventarioBD.length ) {
              if (this.contador[index2] === listaInventarioBD.length || contador1 === listaInventarioBD.length ) {
                console.log("Esta Talla no esta en BD");
                this.bodegaInventarioService.CrearBodegaInventario(objetoInventario).subscribe( resultadoAgregar => {
                  swal.fire('Nuevo Producto en Bodega Inventario',
                     `Bodega Inventario ${objetoInventario.producto.nombre} creado con exito!`, 'success');
                });
                contador1 = 0;
              }
            }
          });
        });
        /* console.log(this.contador); */
        this.ListarPaginado();
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
totalPorPaginas = 3;  
pageSizeOptions: number[] = [3, 5, 10, 25, 100];
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
