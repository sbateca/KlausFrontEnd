import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TallaService } from './talla.service';
import { Talla } from './talla';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import alertasSweet from 'sweetalert2';

// -------------- librerías para implementación de ventanas modales -------------------------- //
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormTallaComponent } from './formsTallas/form-talla.component';
import { TallaDetalleComponent } from './detalleTalla/talla-detalle.component';


// Librería para el uso de tooltips
import { MatTooltipModule } from '@angular/material/tooltip';



@Component({
  selector: 'app-tallas-colores',
  templateUrl: './talla.component.html',
  styleUrls: ['./talla.component.css']
})


export class TallaComponent implements OnInit {

  // --------- variables de clase --------------------------------- //

  titulo = 'Tallas';
  rutaFuncionalidades = 'Inventario / Listar tallas';


  // declaración de los services que se requieren
  private tallaService: TallaService;

  // variables para el MatTableDataSource<Talla>
  columnasTablaTallas: string[] = ['tipoTalla', 'talla', 'descripcion', 'acciones'];
  datosTalla: MatTableDataSource<Talla>;


  // variables para el paginador de MatTableDataSource<Talla>
  totalRegistros = 0;
  tamanoPagina = 5;
  paginaActual = 0;
  elementosPorPagina: number[] = [5, 10, 15, 20, 25];


  /*  ViewChild se usa para extraer parte de una vista (en este caso) un paginador
      y se agigna a la variable "paginador"
  */
  @ViewChild(MatPaginator, {static: true}) paginador: MatPaginator;


  /*  ViewChild se usa para extraer parte de una vista (en este caso) un paginador
      y se agigna a la variable "ordenadorRegistros"
  */
  @ViewChild(MatSort, {static: true}) ordenadorRegistros: MatSort;

  // variables almacenan los listados de Tallas
  listaTallas: Talla[];

  // variables para las ventanas modales (Talla
  ventanaModalTalla: MatDialog;


  // Variable Talla que recibe los datos de la ventana modal (Componente formulario)
  talla: Talla;


  // -------------- constructor de la clase --------------------------- //
  constructor(tallaService: TallaService,
              ventanaModalTalla: MatDialog) {
    this.tallaService = tallaService;
    this.ventanaModalTalla = ventanaModalTalla;
  }


  ngOnInit(): void {
    this.listarTallasPaginado();
  }


  /*
    El método listarTallas() permite obtener el listado de tallas registradas.
    Este método se suscribe al Observador para obtener la información resultante de este proceso
  */
  listarTallas() {
    this.tallaService.getTallas().subscribe(resultado => {
      this.listaTallas = resultado;
      this.datosTalla = new MatTableDataSource<Talla>(this.listaTallas);
    });
  }


  /*
    El método listarTallasPaginado() realiza la petidión GET al service
    de acuerdo a los valores recibidos en los parámetros.
    Estos parámetros vienen de la vista html (paginador)

    - Parámetros: ninguno
    - Retorna: nada
  */
  listarTallasPaginado(): void {
    this.tallaService.getTallasPaginado(this.paginaActual.toString(), this.tamanoPagina.toString()).subscribe(
      resultado => {

        /*  El método getTallasPaginado retorna un paginador.
            Hay que actualizar las variables de la paginación y la lista de tallas pues esta puede cambiar
        */

        // actualizamos las variables
        this.totalRegistros = resultado.totalElements as number;
        // obtenemos la lista de tallas del objeto paginador
        this.listaTallas = resultado.content as Talla[];

        // instanciamos la tabla MatTablaDataSource
        this.datosTalla = new MatTableDataSource<Talla>(this.listaTallas);
        // asignamos el paginador
        this.datosTalla.paginator = this.paginador;


        // asigno la vista a la propiedad sorting de los datos
        this.datosTalla.sort = this.ordenadorRegistros;
        this.datosTalla.sort.active = 'talla';
        this.datosTalla.sort.direction = 'asc';
      });
  }





  /*
    El método paginar() realiza el control de la paginación.
    Cada vez que se seleccione un botón del paginador se actualizan los valores de las variables y se realiza el GET con los parámetros
      Parámetros:
        - evento: PageEvent --> el evento de tipo PageEvent
      Retorna: nada
  */
  paginar(evento: PageEvent) {
    this.paginaActual = evento.pageIndex;
    this.tamanoPagina = evento.pageSize;
    this.totalRegistros = evento.length;

    this.listarTallasPaginado();
  }







  /*
    El método reordenar() genera nuevamente el MatTableDataSource con los datos ordenados,
    según la columna a la cual se ha hecho clic
  */

  reordenar(sort: Sort): void {

    // obtenemos el array
    const listTallas = this.listaTallas.slice();

    /*
    Si no está activo el sorting o no se ha establecido la dirección del sorting (asc ó desc)
    se asigna los mismos datos (sin ordenar)
    */
    if (!sort.active || sort.direction === '') {
      return;
    }

    /*
    se vuelve a instanciar el MatTableDatasource con los
    datos ordenados de acuerdo a la columna a la que se hizo clic
    */
    this.datosTalla = new MatTableDataSource<Talla>(
      this.listaTallas = listTallas.sort( (a, b) => {
        const esAscendente = sort.direction === 'asc'; // se determina si es ascendente
        switch (sort.active) { // sort.active obtiene el id (string) de la columna seleccionada
          case 'tipoTalla': return this.comparar(a.tipoTalla.tipoTalla, b.tipoTalla.tipoTalla, esAscendente);
          case 'talla': return this.comparar( a.talla, b.talla, esAscendente);
          case 'descripcion': return this.comparar(a.descripcion, b.descripcion, esAscendente);
        }
      }));
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
 aplicarFiltroTallas(event: Event) {
  const textoFiltro = (event.target as HTMLInputElement).value;
  this.datosTalla.filter = textoFiltro.trim().toLowerCase();
}





// ------------------------------------ CONTROL VENTANAS MODALES ------------------------------------ //


  /*
    El método abrirVentana implementa acciones sobre la ventana modal:
      - open: Abre una ventana con los parámetros que se envían:
              - el componente que implementa la vista de la ventana modal
              - datos adicionales:
                  - Un JSON con configuraciones para la ventana
                  - data: acá se puede enviar información a la ventana modal (componente).
                          En este caso se envía el ID de la Talla
      - afterClosed: Al cerrarse la ventana se asigna la talla con la información del formulario (resultado).
  */
  abrirVentanaModalTalla(): void {
    const referenciaVentanaModal = this.ventanaModalTalla.open(FormTallaComponent, {
      width: '60%',
      height: 'auto',
      position: {left: '30%', top: '60px'}
    });

    referenciaVentanaModal.afterClosed().subscribe(resultado => {
      if (resultado != null) {
        this.talla = resultado;
        this.crearTalla();
      }
    });

  }




  /*
    El método abrirVentanaEditarTalla() perimte cargar el componente formulario con la
    información de la talla seleccionada cargada en dicho formulario
  */
 abrirVentanaEditarTalla(idTalla: number): void {
   const referenciaVentanaEditar = this.ventanaModalTalla.open(FormTallaComponent, {
    width: '60%',
    height: 'auto',
    position: {left: '30%', top: '60px'},
    data: idTalla
   });

   referenciaVentanaEditar.afterClosed().subscribe( resultado => {
      if ( resultado != null) {
        this.talla = resultado;
        this.talla.id = idTalla; // es necesario asignar el id al objeto que viene del formulario porque el formulario no asigna id
        this.actualizarTalla();
      }
    });

 }


  /*
      El método abrirVentanaDetalle pernmite cargar el componente tallaDetalleComponente
      en una ventana modal.
  */

  abrirVentanaDetalleTalla(idTalla: number): void {
    const referenciaVentanaVer = this.ventanaModalTalla.open(TallaDetalleComponent, {
      width: '60%',
      height: 'auto',
      position: {left: '30%', top: '60px'},
      data: idTalla
    });
  }


 // ----------------- FIN CONTROL VENTANAS MODALES ----------------------------- //


    /*
        El método crearTalla() ejecuta el método crearTalla del TallaColorService y se suscribe en espera de una repuesta
        La respuesta se utiliza para mostrar un mensaje de confirmación con datos de la talla creada
        Parámetros:
            - Nada
        Retorna: Nada
    */
     crearTalla(): void {
       this.tallaService.crearTalla(this.talla).subscribe( respuesta => {
          this.listarTallasPaginado();
          alertasSweet.fire('Nueva talla', respuesta.mensaje, 'success');
       });
     }



     actualizarTalla(): void {
       this.tallaService.actualizarTalla(this.talla).subscribe( respuesta => {
         this.listarTallasPaginado();
         alertasSweet.fire('Mensaje', respuesta.mensaje, 'success');
       });
     }






  /*
      El método eliminarTalla ejecuta el método eliminar del service el cual realiza una petición tipo DELETE
      al servidor backend. Implementa una alerta de SweetAlert2
  */
  eliminarTalla(talla: Talla): void {
    alertasSweet.fire({
      title: 'Cuidado!',
      text: '¿Seguro que desea eliminar la talla ' + talla.talla + '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#ad3333',
      confirmButtonText: 'Sí, eliminar!'
    }).then((result) => {
      if (result.value) {
        this.tallaService.eliminarTalla(talla.id).subscribe(
            resultado => {
              this.listarTallasPaginado();
              alertasSweet.fire(
                'Eliminada!',
                'La talla <strong>' + talla.talla + '</strong> ha sido eliminada',
                'success'
              );
            }
          );

      }
    });
  }




}
