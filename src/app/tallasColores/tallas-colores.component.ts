import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TallasColoresService } from './tallas-colores.service';
import { Talla } from './talla';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Color } from './color';



@Component({
  selector: 'app-tallas-colores',
  templateUrl: './tallas-colores.component.html',
  styleUrls: ['./tallas-colores.component.css']
})


export class TallasColoresComponent implements OnInit {

  // --------- variables de clase --------------------------------- //

  titulo = 'Tallas';
  titulo2 = 'Colores';
  rutaFuncionalidades = 'Inventario / Listar tallas y colores';


  // declaración de los services que se requieren
  private tallaColorService: TallasColoresService;

  // variables para el MatTableDataSource<Talla>
  columnasTablaTallas: string[] = ['talla', 'descripcion', 'acciones'];
  datosTalla: MatTableDataSource<Talla>;

  // variables para el MatTableDataSource<Color>
  columnasTablaColores: string[] = ['nombre', 'codigoColor'];
  datosColor: MatTableDataSource<Color>;

  // variables para el paginador de MatTableDataSource<Talla>
  totalRegistros = 0;
  tamanoPagina = 5;
  paginaActual = 0;
  elementosPorPagina: number[] = [5, 10, 15, 20, 25];

  // variables para el paginador de MatTableDataSource<Color>
  totalRegistrosColor = 0;
  tamanoPaginaColor = 5;
  paginaActualColor = 0;
  elementosPorPaginaColor: number[] = [5, 10, 15, 20, 25];


  /*  ViewChild se usa para extraer parte de una vista (en este caso) un paginador
      y se agigna a la variable "paginador"
  */
  @ViewChild(MatPaginator, {static: true}) paginador: MatPaginator;
  @ViewChild(MatPaginator, {static: true}) paginadorColor: MatPaginator;


  /*  ViewChild se usa para extraer parte de una vista (en este caso) un paginador
      y se agigna a la variable "ordenadorRegistros"
  */
  @ViewChild(MatSort, {static: true}) ordenadorRegistros: MatSort;
  @ViewChild(MatSort, {static: true}) ordenadorRegistrosColor: MatSort;

  // variable que almacenará el listado de tallas
  listaTallas: Talla[];

  // variable que almacenará el listado de tallas
  listaColor: Color[];



  // -------------- constructor de la clase --------------------------- //
  constructor(tallaColorService: TallasColoresService) {
    this.tallaColorService = tallaColorService;
  }


  ngOnInit(): void {
    this.listarTallasPaginado();
    this.listarColoresPaginado();
  }


  /*
    El método listarTallas() permite obtener el listado de tallas registradas.
    Este método se suscribe al Observador para obtener la información resultante de este proceso
  */
  listarTallas() {
    this.tallaColorService.getTallas().subscribe(resultado => {
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
    this.tallaColorService.getTallasPaginado(this.paginaActual.toString(), this.tamanoPagina.toString()).subscribe(
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
    El método listarColoresPaginado() realiza la petidión GET al service
    de acuerdo a los valores recibidos en los parámetros.
    Estos parámetros vienen de la vista html (paginador)

    - Parámetros: ninguno
    - Retorna: nada
  */
 listarColoresPaginado(): void {
   this.tallaColorService.getColoresPaginado(this.paginaActualColor.toString(), this.tamanoPaginaColor.toString()).subscribe(
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
          case 'talla': return this.comparar( a.talla, b.talla, esAscendente);
          case 'descripcion': return this.comparar(a.descripcion, b.descripcion, esAscendente);
        }
      }));
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



 aplicarFiltroTallas(event: Event) {
  const textoFiltro = (event.target as HTMLInputElement).value;
  this.datosTalla.filter = textoFiltro.trim().toLowerCase();
}



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



// ------------------------------------ CONTROL FORMULARIO TALLAS --------------------------------------- //






}
