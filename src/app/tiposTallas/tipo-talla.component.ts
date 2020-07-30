import { Component, OnInit, ViewChild } from '@angular/core';
import { TipoTallaService } from './tipo-talla.service';
import { MatTableDataSource } from '@angular/material/table';
import { TipoTalla } from './TipoTalla';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Sort, MatSort } from '@angular/material/sort';
import alertasSweet from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { TipoTallaFormComponent } from './tipoTallaForm/tipo-talla-form.component';
import { TipoTallaDetalleComponent } from './tipoTallaDetalle/tipo-talla-detalle.component';

// librería para el manejo de Tooltips
import { MatTooltipModule } from '@angular/material/tooltip';




@Component({
  selector: 'app-tipo-talla',
  templateUrl: './tipo-talla.component.html',
  styleUrls: ['./tipo-talla.component.css']
})



export class TipoTallaComponent implements OnInit {

  // --------------- variables de clase ------------------------------- //

  titulo = 'Tipos de Talla';
  rutaFuncionalidad = 'Inventario / Listar tipos de talla';


  // variables para el MatTableDataSource
  datos: MatTableDataSource<TipoTalla>;
  columnasTipoTallas: string[] = ['tipoTalla', 'descripcion', 'acciones'];

  // variables para usar en el paginador
  paginaActual = 0;
  tamanoPagina = 5;
  totalRegistros = 0;
  tamanosPagina = [5, 10, 15, 20, 25];

  /*  ViewChild se usa para extraer parte de una vista (en este caso) un paginador
      y se agigna a la variable "paginador"
  */
 @ViewChild(MatPaginator, {static: true}) paginador: MatPaginator;

  // variable lista de tipos de talla
  listaTiposTalla: TipoTalla[];

  // Viechild de tipo MatSort
  @ViewChild(MatSort, {static: true}) ordenadorRegistros: MatSort;


  // variable donde se almacenará el Tipo de Talla que viene del componente formulario
  tipoTalla: TipoTalla;


  // ------------------------------------------------------------------------------- //


  // constructor de la clase
  constructor(private tipoTallaService: TipoTallaService,
              public ventanaModal: MatDialog) { }



  ngOnInit(): void {
    this.listarTiposTallaPaginado();
  }



  listarTiposTallaPaginado(): void {
    this.tipoTallaService.getTipoTallasPaginado(this.paginaActual.toString(), this.tamanoPagina.toString()).subscribe(
      resultado => {
        // establecimiento de datos del paginador
        this.totalRegistros = resultado.totalElements as number;
        this.listaTiposTalla = resultado.content as TipoTalla[];
        this.datos = new MatTableDataSource<TipoTalla>(this.listaTiposTalla);
        this.datos.paginator = this.paginador;

        // establecimiento de datos del Sort
        this.datos.sort = this.ordenadorRegistros;
        this.datos.sort.active = 'tipoTalla';
        this.datos.sort.direction = 'asc';
      }
    );
  }


  paginar(evento: PageEvent): void {
    this.paginaActual = evento.pageIndex;
    this.tamanoPagina = evento.pageSize;
    this.totalRegistros = evento.length;
    this.listarTiposTallaPaginado();
  }



 reordenar(sort: Sort): void {

  // obtenemos el array
  const listTallas = this.listaTiposTalla.slice();

  if (!sort.active || sort.direction === '') {
    return;
  }

  this.datos = new MatTableDataSource<TipoTalla>(
    this.listaTiposTalla = listTallas.sort( (a, b) => {
      const esAscendente = sort.direction === 'asc'; // se determina si es ascendente
      switch (sort.active) { // sort.active obtiene el id (string) de la columna seleccionada
        case 'tipoTalla': return this.comparar( a.tipoTalla, b.tipoTalla, esAscendente);
        case 'descripcion': return this.comparar(a.descripcion, b.descripcion, esAscendente);
      }
    }));
}




  comparar(a: number | string, b: number | string, esAscendente: boolean) {
    return (a < b ? -1 : 1) * (esAscendente ? 1 : -1);
  }




 aplicarFiltroTallas(event: Event) {
  const textoFiltro = (event.target as HTMLInputElement).value;
  this.datos.filter = textoFiltro.trim().toLowerCase();
}


// ----------------- métodos para el control de ventanas modales -------------------------- //

abrirVentanaModalAgregar(): void {
  const referenciaVentanaModal = this.ventanaModal.open(TipoTallaFormComponent, {
    width: '60%',
      height: 'auto',
      position: {left: '30%', top: '60px'}
  });

  referenciaVentanaModal.afterClosed().subscribe( resultado => {
    console.log(resultado);
    if (resultado) {
      this.tipoTalla = resultado;
      this.agregarTipoTalla();
    }
  });
}



abrirVentanaModalVer(id: number): void {
  const referenciaVentanaModal = this.ventanaModal.open(TipoTallaDetalleComponent, {
    width: '60%',
    height: 'auto',
    position: {left: '30%', top: '60px'},
    data: id
  });
}




abrirVentanaModalModificar(id: number): void {
  const referenciaVentanaModal = this.ventanaModal.open(TipoTallaFormComponent, {
    width: '60%',
      height: 'auto',
      position: {left: '30%', top: '60px'},
      data: id
  });

  referenciaVentanaModal.afterClosed().subscribe( resultado => {
    if (resultado) {
      this.tipoTalla = resultado;
      this.tipoTalla.id = id;
      this.agregarTipoTalla();
    }
  });
}


// ----------------------------- métodos CRUD ------------------------------------------- //


agregarTipoTalla(): void {
  this.tipoTallaService.agregarTipoTalla(this.tipoTalla).subscribe( resultado => {
    this.listarTiposTallaPaginado();
    alertasSweet.fire('Nuevo tipo de talla', resultado.mensaje);
  });
}



eliminarTipoTalla(tipoTalla: TipoTalla): void {
  alertasSweet.fire({
    title: 'Cuidado!',
    text: '¿Desea eliminar el tipo de talla ' + tipoTalla.tipoTalla + '?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#ad3333',
    confirmButtonText: 'Sí, eliminar!'
  }).then((result) => {
    if (result.value) {
      this.tipoTallaService.eliminarTipoTalla(tipoTalla.id).subscribe(respuesta => {
        alertasSweet.fire(
          'Eliminado!',
          'El tipo de talla <strong>' + tipoTalla.tipoTalla + '</strong> ha sido eliminado exitosamente',
          'success'
        );
        this.listarTiposTallaPaginado();
      });
    }
  });

}

}
