import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ColorService } from './color.service';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Color } from './color';
import alertasSweet from 'sweetalert2';

// -------------- librerías para implementación de ventanas modales -------------------------- //
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormColorComponent } from './formsColores/form-color.component';
import { ColorDetalleComponent } from './detalleColor/color-detalle.component';

// librería poar ael manejo de Tooltip
import { MatTooltipModule } from '@angular/material/tooltip';



@Component({
  selector: 'app-tallas-colores',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.css']
})


export class ColorComponent implements OnInit {

  // --------- variables de clase --------------------------------- //

  titulo = 'Tallas';
  titulo2 = 'Colores';
  rutaFuncionalidades = 'Inventario / Listar tallas y colores';


  // declaración de los services que se requieren
  private colorService: ColorService;

  // variables para el MatTableDataSource<Color>
  columnasTablaColores: string[] = ['nombre', 'codigoColor', 'acciones'];
  datosColor: MatTableDataSource<Color>;

  // variables para el paginador de MatTableDataSource<Color>
  totalRegistrosColor = 0;
  tamanoPaginaColor = 5;
  paginaActualColor = 0;
  elementosPorPaginaColor: number[] = [5, 10, 15, 20, 25];


  /*  ViewChild se usa para extraer parte de una vista (en este caso) un paginador
      y se agigna a la variable "paginador"
  */
  @ViewChild(MatPaginator, {static: true}) paginadorColor: MatPaginator;


  /*  ViewChild se usa para extraer parte de una vista (en este caso) un paginador
      y se agigna a la variable "ordenadorRegistros"
  */
  @ViewChild(MatSort, {static: true}) ordenadorRegistrosColor: MatSort;

  // variables almacenan los listados de Tallas y Colores
  listaColor: Color[];

  // variables para las ventanas modales (Talla y Color)
  ventanaModalColor: MatDialog;


  // Variable Color que reciben los datos de la ventana modal (Componente formulario)
  color: Color;


  // -------------- constructor de la clase --------------------------- //
  constructor(colorService: ColorService,
              ventanaModalTalla: MatDialog,
              ventanaModalColor: MatDialog) {
    this.colorService = colorService;
    this.ventanaModalColor = ventanaModalColor;
  }


  ngOnInit(): void {
    this.listarColoresPaginado();
  }



  /*
    El método listarColoresPaginado() realiza la petidión GET al service
    de acuerdo a los valores recibidos en los parámetros.
    Estos parámetros vienen de la vista html (paginador)

    - Parámetros: ninguno
    - Retorna: nada
  */
 listarColoresPaginado(): void {
   this.colorService.getColoresPaginado(this.paginaActualColor.toString(), this.tamanoPaginaColor.toString()).subscribe(
      resultado => {
        this.totalRegistrosColor = resultado.totalElements as number;
        this.listaColor = resultado.content as Color[];
        this.datosColor = new MatTableDataSource<Color>(this.listaColor);
        this.datosColor.paginator = this.paginadorColor;

        this.datosColor.sort = this.ordenadorRegistrosColor;
        this.datosColor.sort.active = 'color';
        this.datosColor.sort.direction = 'asc';
      }
   );
 }



  /*
    El método paginarColores() realiza el control de la paginación.
    Cada vez que se seleccione un botón del paginador se actualizan los valores de las variables y se realiza el GET con los parámetros
      Parámetros:
        - evento: PageEvent --> el evento de tipo PageEvent
      Retorna: nada
  */
  paginarColores(evento: PageEvent): void {
    this.tamanoPaginaColor = evento.pageSize;
    this.paginaActualColor = evento.pageIndex;
    this.totalRegistrosColor = evento.length;

    this.listarColoresPaginado();
  }







/*
    El método reordenarColores() genera nuevamente el MatTableDataSource con los datos ordenados,
    según la columna a la cual se ha hecho clic
  */
  reordenarColores(sortColores: Sort): void {
    // obtenemos una copia del array de colores
    const listaColores = this.listaColor.slice();

    // si el sorting está inactivo o es vacío retorna un vacío. La lista quedará igual
    if (!sortColores.active || sortColores.direction === '') {
      return;
    }

    this.datosColor = new MatTableDataSource<Color>(
      this.listaColor = this.listaColor.sort( (a, b) => {
        const esAscendente = sortColores.direction === 'asc';
        switch ( sortColores.active ) {
          case 'nombre': return this.comparar(a.nombre, b.nombre, esAscendente);
          case 'codigoColor': return this.comparar(a.codigoColor, b.codigoColor, esAscendente);
        }
      } )
    );


  }

  // Esta función compara dos String junto con el valor de la variable isAsc y retorna:
  comparar(a: number | string, b: number | string, esAscendente: boolean) {
    return (a < b ? -1 : 1) * (esAscendente ? 1 : -1);
  }

  /*
  El método aplicarFiltroTallas permite realizar proceso de filtrado de datos
  Parámetros:
      - El evento generado
      - Retorna: nada
*/


  /*
  El método aplicarFiltroColores permite realizar proceso de filtrado de datos
  Parámetros:
      - El evento generado
      - Retorna: nada
*/

aplicarFiltroColores(event: Event) {
  const textoFiltro = (event.target as HTMLInputElement).value;
  this.datosColor.filter = textoFiltro.trim().toLowerCase();
}



// ------------------------------------ CONTROL VENTANAS MODALES ------------------------------------ //



  abrirVentanaCrearColor(): void {
    const referenciaVentanaColor = this.ventanaModalColor.open(FormColorComponent, {
      width: '60%',
      height: 'auto',
      position: {left: '30%', top: '60px'}
    });

    referenciaVentanaColor.afterClosed().subscribe( resultado => {
      if (resultado != null) {
        this.color = resultado;
        this.crearColor();
      }
    });

  }



  abrirVentanaEditarColor(idColor: number): void {
    const referenciaVentanaModal = this.ventanaModalColor.open(FormColorComponent, {
      width: '60%',
      height: 'auto',
      position: {left: '30%', top: '60px'},
      data: idColor
    });

    referenciaVentanaModal.afterClosed().subscribe(resultado => {
      if (resultado) {
        this.color = resultado;
        this.color.id = idColor;
        this.actualizarColor();
      }
    });
  }




  abrirVentanaDetalleColor(idColor: number): void {
    const referenciaVentanaModal = this.ventanaModalColor.open(ColorDetalleComponent, {
      width: '60%',
      height: 'auto',
      position: {left: '30%', top: '60px'},
      data: idColor
    });
  }



 // ----------------- FIN CONTROL VENTANAS MODALES ----------------------------- //



     crearColor(): void {
       this.colorService.crearColor(this.color).subscribe( respuesta => {
         this.listarColoresPaginado();
         alertasSweet.fire('Nuevo color', respuesta.mensaje, 'success');
       }
       );
     }



     actualizarColor(): void {
       this.colorService.actualizarColor(this.color).subscribe( resultado => {
         this.listarColoresPaginado();
         alertasSweet.fire('Mensaje', resultado.mensaje, 'success');
       });
     }



  eliminarColor(color: Color): void {
    alertasSweet.fire({
      title: 'Cuidado!',
      text: '¿Seguro que desea eliminar el color ' + color.nombre + '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#ad3333',
      confirmButtonText: 'Sí, eliminar!'
    }).then((result) => {
      if (result.value) {

        this.colorService.eliminarColor(color.id).subscribe(respuesta => {
          this.listarColoresPaginado();
          alertasSweet.fire(
            'Eliminado!',
            'El color ' + color.nombre + ' ha sido eliminado exitosamente',
            'success'
          );
        });
      }
    });
  }



}
