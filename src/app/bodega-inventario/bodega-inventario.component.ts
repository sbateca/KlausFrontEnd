import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormBodegaInventarioComponent } from './form-bodega-inventario/form-bodega-inventario.component';
import { BodegaInventario } from './bodega-inventario';
import { BodegaInventarioService } from './bodega-inventario.service';
import swal from 'sweetalert2';
import { DetalleBodegaInventarioComponent } from './detalle-bodega-inventario/detalle-bodega-inventario.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MovimientoService } from '../movimientos/movimiento.service';
import { Movimiento } from '../movimientos/movimiento';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PedidoService } from '../pedido/pedido.service';
// Import pdfmake-wrapper and the fonts to use
import { PdfMakeWrapper, QR, Table } from 'pdfmake-wrapper';
import { ITable} from 'pdfmake-wrapper/lib/interfaces';
import pdfFonts from "pdfmake/build/vfs_fonts"; // fonts provided for pdfmake
import { TokenService } from '../service/token.service';

// Set the fonts to use
PdfMakeWrapper.setFonts(pdfFonts);

@Component({
  selector: 'app-bodega-inventario',
  templateUrl: './bodega-inventario.component.html',
  styleUrls: ['./bodega-inventario.component.css']
})
export class BodegaInventarioComponent implements OnInit {

  public bodegaInventario = new BodegaInventario;
  public listaBodegaInventario = new Array<BodegaInventario>();
  public contador = new Array( this.listaBodegaInventario.length);
  public listaBodegaInventarioActualizada = new Array<BodegaInventario>();
  public total = 0;
  movimiento = new Movimiento();
  public esAdmin: boolean   
  public esOperador: boolean;
 
  // Tabla
  columnasTabla: string [] = ['producto', 'referencia', 'talla', 'cantidad', 'acciones'];

  constructor(private ventanaModal: MatDialog,
              private movimientoService: MovimientoService,
              private alertaSnackBar: MatSnackBar,
              private pedidoService: PedidoService,
              private tokenService: TokenService,
              private bodegaInventarioService: BodegaInventarioService) { }

  ngOnInit(): void {
    this.CargarBodegaInventario();
    this.ListarPaginado();
    this.Admin_Operador();
  }

  // Se calcula si es admin o operador
  Admin_Operador(){
    this.esAdmin = this.tokenService.isAdmin();  
    this.esOperador = this.tokenService.esOperador();
  }

  // Generar codigos de cada elemento de bodega
  GenaraCodigosQR(){
    this.bodegaInventarioService.ListaBodegaInventario().subscribe( listaBodegaInventario => {
        const pdf = new PdfMakeWrapper();
        pdf.header('Codigos QR  Productos existentes en Bodega Inventario Empresa: Klaus Leather');
        pdf.pageMargins ( [  5 ,  10 ,  0 ,  0  ] );
        pdf.defaultStyle({ bold: false, fontSize: 8 });
        pdf.add( this. CreaTablaReferenciaQR(listaBodegaInventario));
        pdf.create().open();
     
    });
  }

  CreaTablaReferenciaQR(listaBodegaInventario): ITable{
    return new Table([
      ['#', 'Referencia', 'QR-1', 'QR-2', 'QR-3', 'QR-4', 'QR-5', 'QR-6', 'QR-7', 'QR-8', 'QR-9', 'QR-10'],
      ... this.ExtraeElementoBodegaInventrario(listaBodegaInventario)
    ])
    .layout('noBorders')
    .alignment('center')
    .margin([5,0,0,0])
    .end
  }

  // Crea el codigo 
  CreaQR(referencia){
    return new QR (referencia).fit(50).end
  }

  // Se extrae cada elemento de la listaBodegaInventario
  ExtraeElementoBodegaInventrario(listaBodegaInventario) {
    return listaBodegaInventario.map((bodegaInventario, index) => [
      index+1, bodegaInventario.referencia, 
      this.CreaQR(bodegaInventario.referencia), this.CreaQR(bodegaInventario.referencia),
      this.CreaQR(bodegaInventario.referencia), this.CreaQR(bodegaInventario.referencia), 
      this.CreaQR(bodegaInventario.referencia), this.CreaQR(bodegaInventario.referencia),
      this.CreaQR(bodegaInventario.referencia), this.CreaQR(bodegaInventario.referencia), 
      this.CreaQR(bodegaInventario.referencia), this.CreaQR(bodegaInventario.referencia)
    ]);
  }



// Cargar Bodega Inventario
CargarBodegaInventario(): void{
  this.bodegaInventarioService.ListaBodegaInventario().subscribe( bodegaInventario => {
    this.listaBodegaInventario = bodegaInventario;
    console.log("listaBodega");
    console.log(this.listaBodegaInventario);
    this.listaBodegaInventario.forEach(elemento => {
      // Sumatoria de cantidad
      this.total = this.total + elemento.cantidad;
    });
  });
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
  // No hay resultados cuando se cancela la operación (se cierra la ventana modal)
  if (inventarioFormulario != null) {
    this.CrearBodegaInventario(inventarioFormulario);
  }
});
}



// Crear Bodega Inventario
CrearBodegaInventario(inventarioFormulario): void {

  // Recorremos la lista que viene de Base de Datos para tomar cada uno de los productos y
  // compararlo con el que viene del formulario
  this.bodegaInventarioService.ListaBodegaInventario().subscribe( listaInventarioBD => {

      // Por primera vez
      if (listaInventarioBD.length === 0) {
        
        // Recorro la listaComponenteInventario de Formulario
        inventarioFormulario.listaComponentesInventario.forEach( elementoFormulario => {

          this.bodegaInventario = elementoFormulario;

          // Se crea la referencia es la union de la referencia de producto con la talla
          this.bodegaInventario.referencia = elementoFormulario.producto.referencia+'-'+elementoFormulario.talla.talla.toString();
          
          /* console.log("elementoFormulario");
          console.log(elementoFormulario); */
         

          this.bodegaInventarioService.CrearBodegaInventario( this.bodegaInventario).subscribe( resultadoAgregar => {
            
            // Pasamos Bodega Inventario a Movimiento
            this.movimiento.bodegaInventario  = resultadoAgregar.bodegaInventario;

            // Tipo de Movimiento Entrada a Bodega # 1
            this.movimiento.tipo = 1;

            // Calculamos El dinero(Costo*Cantidd) para Guardar en Movimiento
            this.movimiento.dinero = resultadoAgregar.bodegaInventario.producto.costo*resultadoAgregar.bodegaInventario.cantidad;
            
            // Agregamos Movimiento
            this.movimientoService.agregarElemento(this.movimiento).subscribe(agreamosMovimiento => {this.ListarPaginado();});
            this.ListarPaginado(); 
          });

          swal.fire('Nuevo Producto en Bodega Inventario',
          `Bodega Inventario ${elementoFormulario.producto.nombre} creado con exito!`, 'success');
      
        });
      } else { // si ya hay algo en la lista

        let contador1 = 0;

        // Recorremos la lista de tallas del formulario para compararlas con el elemento de inventario de turno
        listaInventarioBD.forEach((elementoInventarioBD, index) => {
          
          // Cuando solo hay un Producto en listaComponenteBodega
          if (inventarioFormulario.listaComponentesInventario.length === 1) {
            // Cuenta los que no estan en base de Datos
            contador1++;
          }

          // Se Recorre listaComponente
          inventarioFormulario.listaComponentesInventario.forEach( (elementoFormulario, index2) => {
            // Para que la primera pocicion del array Contador se iniciallice en cero
            if (index < 1 )  {  
              this.contador[index2] = 0;
            }
            
            // Variable resultado de la comparacion de Formulario con lo que hay en Base de Datos
            const hayTalla = this.comprobarExisteTallaEnBD(elementoInventarioBD, elementoFormulario);
            
            // Si esta en BD
            if (hayTalla) {
              
              // Adiciono la id de Base De Datos
              elementoFormulario.id = elementoInventarioBD.id;

              this.bodegaInventario = elementoFormulario;

              // Se crea la referencia es la union de la referencia de producto con la talla
              this.bodegaInventario.referencia = elementoFormulario.producto.referencia+'-'+elementoFormulario.talla.talla.toString();
              
              // Tipo de Movimiento Entrada a Bodega # 1
              this.movimiento.tipo = 1;
              // Pasamos Bodega Inventario(elementoFormulario) a Movimiento
              this.movimiento.bodegaInventario  = this.bodegaInventario;
              // Calculamos El dinero(Costo*Cantidd) para Guardar en Movimiento
              this.movimiento.dinero = this.bodegaInventario.producto.costo*this.bodegaInventario.cantidad;
    
              // Agregamos Movimiento
              this.movimientoService.agregarElemento(this.movimiento).subscribe(agreamosMovimiento => {this.ListarPaginado();}); 
                 
              // Sumo las cantidades del mismo Producto
              this.bodegaInventario.cantidad = elementoInventarioBD.cantidad + this.bodegaInventario.cantidad;

              /* console.log("ElementoFormularioHay");
              console.log(elementoFormulario); */
              // Actualizo BodegaInventario(elementoFormulario)
              this.bodegaInventarioService.ActualizarBodegaInventario(this.bodegaInventario).subscribe( resultadoAgregar => {this.ListarPaginado(); });
              contador1 = 0; 
              swal.fire('Nuevo Producto en Bodega Inventario',
              `Bodega Inventario ${elementoFormulario.producto.nombre} creado con exito!`, 'success');
            } else {

              // Array Contador por talla
              this.contador[index2]++;

              // 
              if (this.contador[index2] === listaInventarioBD.length || contador1 === listaInventarioBD.length ) {

                
                this.bodegaInventario = elementoFormulario;

                // Se crea la referencia es la union de la referencia de producto con la talla
                this.bodegaInventario.referencia = elementoFormulario.producto.referencia+'-'+elementoFormulario.talla.talla.toString();

                /* console.log("ElementoFormularioelse");
                console.log(this.bodegaInventario); */
                this.bodegaInventarioService.CrearBodegaInventario(this.bodegaInventario).subscribe( resultadoAgregar => { 

                  // Tipo de movimiento Entrada a Bodega # 1
                  this.movimiento.tipo = 1;
                  // Pasamos Bodega Inventario a Movimiento
                  this.movimiento.bodegaInventario  = resultadoAgregar.bodegaInventario;
                  // Calculamos El dinero(Costo*Cantidd) para Guardar en Movimiento
                  this.movimiento.dinero = resultadoAgregar.bodegaInventario.producto.costo*resultadoAgregar.bodegaInventario.cantidad;

                  
                  // Agregamos Movimiento
                  this.movimientoService.agregarElemento(this.movimiento).subscribe(agreamosMovimiento => {this.ListarPaginado();});
                  this.ListarPaginado();
                });
                contador1 = 0;
              }
            }
           
          });
        });
      }
     
      swal.fire('Nuevo Producto en Bodega Inventario',
               `Bodega Inventario creado con exito!`, 'success'); 
  });
   
}

// Consulta si el producto ya esta en base de Datos y le pone true
comprobarExisteTallaEnBD(elementoBD, elementoABuscar): boolean {
    if (elementoBD.producto.id === elementoABuscar.producto.id) {
        if (elementoBD.talla.id === elementoABuscar.talla.id) {
          return true;
        } else {
          return false;
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

// Abrir Ventana Modal Actualizar Bodega Inventario
AbrirVentanaEditarBodegaInventario(idBodegaInventario): void {
 
  const referenciaVentanaModal = this.ventanaModal.open(FormBodegaInventarioComponent, {
    width: '60%',
    height: 'auto',
    position: {left: '30%', top: '60px'},
    data: idBodegaInventario // Envio el id por medio de data
  });
  referenciaVentanaModal.afterClosed().subscribe( resultado => {
    if (resultado) {

      let cantidadAnterior;
      let diferencia;
      
      this.bodegaInventarioService.VerBodegaInventarioPorId(idBodegaInventario).subscribe(bodegaBD => {
        
      // Cantidad Anterior
      cantidadAnterior = bodegaBD.cantidad;
       
      // se saca la diferencia entre la Cantidad Nueva y la Anterior
      if(cantidadAnterior>resultado.listaComponentesInventario[0].cantidad){

        diferencia = cantidadAnterior - resultado.listaComponentesInventario[0].cantidad;
  
        // La diferencia es n menos al anterior
        this.movimiento.tipo = 5;
      } else {
        
          diferencia = resultado.listaComponentesInventario[0].cantidad - cantidadAnterior;
 
          // La diferencia es n mas al anterior
          this.movimiento.tipo = 6;
      }
      
      this.movimiento.bodegaInventario = bodegaBD;
      this.movimiento.bodegaInventario.cantidad = diferencia;
      this.movimiento.dinero = bodegaBD.producto.costo * diferencia;
     
      this.movimientoService.agregarElemento(this.movimiento).subscribe(respuesta => { });

      });

        
      this.bodegaInventario = resultado.listaComponentesInventario[0];// Paso el primer componente de la lista Bodega
      this.bodegaInventario.id = idBodegaInventario;// El id para  actualizar 

      // Se actualiza Bodega Inventario
      this.ActualizarBodegaInventario();
    }
  });
}
diferencia = 0;
// Actualizar Bodega Inventario
ActualizarBodegaInventario(): void {

  // Se actualiza Bodega Inventario
  this.bodegaInventarioService.ActualizarBodegaInventario(this.bodegaInventario).subscribe(respuesta => {
    this.ListarPaginado();
    swal.fire('Producto Actualizado de Bodega-Inventario!', 
    'Producto <strong>' + this.bodegaInventario.producto.referencia + '</strong> Actualizado con éxito.', 'success');
  }); 
}
  
// Eliminar Bodega Inventario
EliminarBodegaInventario(bodegaInventario: BodegaInventario): void {
  let contadorBodegaInventario = 0;
  /* console.log("contadorI");
  console.log(contadorBodegaInventario); */
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
       
      // Se consulta en Pedidio si hay almenos un bodegaInventario
      this.pedidoService.VerListaPedidos().subscribe( pedido => { 
        
        // Recorre listaPedido
        pedido.forEach(elementoPedido => { 
          
          // Recorre ListaCotizacion
          elementoPedido.listaCotizacion.forEach(elementoCotizacion => {
            // Cuenta las si esta el producto bodegaInventario en Pedido
            if(elementoCotizacion.bodegaInventario.id == bodegaInventario.id){
              contadorBodegaInventario++;      
            }
          });
        });

        /* console.log("contador");
        console.log(contadorBodegaInventario); */

        // Si esta BodegaInventario fue utilizado en Pedido no lo deja Eliminar
        if(contadorBodegaInventario != 0) {
          this.alertaSnackBar.open("No se puede Eliminar este Producto Bodega Inventario, Por que hay minimo un Pedido del mismo!!", 'Cerrar', {
          duration: 8000});
        } else {

          // Se Consulta la lista de Movimientos
          this.movimientoService.listarElementos().subscribe(movimientos => {
                
            // Se Recorre la lista de Movimientos
            movimientos.forEach(elementoMovimiento => {

              // Los Movimientos Tipo Bodega Inventario    
              if(elementoMovimiento.bodegaInventario != null){
          
                // Se dectecta la bodegaInventario a Eliminar en Bodegainventario y en Movimiento se cambia el Tipo(estado eliminado)
                if(bodegaInventario.id == elementoMovimiento.bodegaInventario.id){
          
                   // Le pongo Tipo(# 4 de Eliminado Bodega manual)
                   this.movimiento = elementoMovimiento;
                   this.movimiento.tipo = 4;

                   // Actualizo Tipo(# 4 Eliminado Bodega manual) en Movimientos
                   this.movimientoService.editarElemento(this.movimiento).subscribe(resp => { this.ListarPaginado();});
                }
              }
            });
          });

          // Se Elimina El Producto Bodega Inventario Seleccionado
          this.bodegaInventarioService.EliminarBodegaInventario(bodegaInventario.id).subscribe(respuesta => {
            this.ListarPaginado();
            swal.fire('Producto Eliminado de Bodega-Inventario!', 
            'Producto <strong>' + bodegaInventario.producto.nombre + '</strong> Eliminado con éxito.', 'success');
          });
        }  
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



// Variables con valores iniciales para el paginador
totalRegistros = 0;
paginaActual = 0;
totalPorPaginas = 200;  
pageSizeOptions: number[] = [3, 5, 10, 25, 100, 200, 500];
@ViewChild(MatPaginator, {static: true}) paginador: MatPaginator;
// datos: MatTableDataSource<BodegaInventario>;

// Paginador
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
        case 'referencia': return this.comparar( a.producto.referencia, b.producto.referencia, esAscendente);
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