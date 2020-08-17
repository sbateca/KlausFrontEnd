import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog'; // Ventana Modal
import { FormtipoenviosComponent } from './formtipoenvios/formtipoenvios.component';
import { MatTableDataSource } from '@angular/material/table';
import { Tipoenvios } from './tipoenvios';
import { TipoenviosService } from './tipoenvios.service';
import swal from 'sweetalert2';
import alertasSweet from 'sweetalert2';
import { DetalleTipoEnvioComponent } from './detalle-tipo-envio/detalle-tipo-envio.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort} from '@angular/material/sort'; // Sort


@Component({
  selector: 'app-tipoenvios',
  templateUrl: './tipoenvios.component.html',
  styleUrls: ['./tipoenvios.component.css']
})
export class TipoenviosComponent implements OnInit {

  public tipoenvios: Tipoenvios[];
  public tipoenvio: Tipoenvios;

// Tabla
columnasTabla: string [] = ['nombre', 'acciones'];
datos: MatTableDataSource<Tipoenvios>;

// Paginador
// Variables con valores iniciales para el paginador
totalRegistros = 0;
paginaActual = 0;
totalPorPaginas = 3;
pageSizeOptions: number[] = [3, 5, 10, 25, 100];
@ViewChild(MatPaginator, {static: true}) paginador: MatPaginator;
@ViewChild(MatSort, {static: true}) ordenadorRegistros: MatSort; // Sort


constructor(public ventanaModal: MatDialog,
            public tipoenviosService: TipoenviosService) { }

  ngOnInit(): void {
    this.tipoenviosService.verTipoEnvio().subscribe(
      tipoenvio => {
         this.tipoenvios = tipoenvio;
      });
    this.Paginado();
  }
// Buscador
AplicarFiltro(event: Event) {
  const textoFiltr = (event.target as HTMLInputElement).value;
  this.datos.filter = textoFiltr.trim().toLowerCase();
}

// Datos Paginador
paginar(evento: PageEvent): void {
  this.paginaActual = evento.pageIndex;
  this.totalPorPaginas = evento.pageSize; // Lo que enviamos al backend
  this.Paginado();
}

// Paginador
private Paginado(): void {
  this.tipoenviosService.Paginado(this.paginaActual.toString(), this.totalPorPaginas.toString()).subscribe(paginacion => {
    this.tipoenvios = paginacion.content as Tipoenvios[];
    this.totalRegistros = paginacion.totalElements as number; // Cantidad de registros
    this.paginador._intl.itemsPerPageLabel = 'Registros por página:';
    // Para utilizar la tabla
    this.datos = new MatTableDataSource<Tipoenvios>(this.tipoenvios);
    //Sort
    this.datos.sort = this.ordenadorRegistros;
    this.datos.sort.active = 'nombres';
    this.datos.sort.direction = 'asc';

  });
}

// Reordenar Sort
reordenar(sort: Sort) {

  const listTipoEnvio = this.tipoenvios.slice(); // obtenemos el array*/

  /*
  Si no está activo el sorting o no se ha establecido la dirección (asc ó desc)
  se asigna los mismos datos (sin ordenar)
  */
  if (!sort.active || sort.direction === '' ) {
    //  this.datos = new MatTableDataSource<Tipoenvios>(this.tipoenvios);
    return;
  }

  this.datos = new MatTableDataSource<Tipoenvios>(
  this.tipoenvios = listTipoEnvio.sort( (a, b) => {

    const esAscendente = sort.direction === 'asc'; // Se determina si es ascendente
    switch (sort.active) { // Obtiene el id (string) de la columna seleccionada
      case 'id': return this.comparar( a.id, b.id, esAscendente);
      case 'nombre': return this.comparar( a.nombre, b.nombre, esAscendente);
      case 'descripcion': return this.comparar(a.descripcion, b.descripcion, esAscendente);
  }
  }));
  // cada vez que se haga clic en un botón para reordenar es necesario paginar de nuevo
}

  // Esta función compara dos String junto con el valor de la variable isAsc y retorna:
  comparar(a: number | string, b: number | string, esAscendente: boolean) {
    return (a < b ? -1 : 1) * (esAscendente ? 1 : -1);
  }


// Formulario
AbrirFormularioTipoEnvios(): void {

    const VentanaModal = this.ventanaModal.open(FormtipoenviosComponent,
   {
     width: '60%',
     height: 'auto',
     position: {left: '30%', top: '60px'}
   });
    VentanaModal.afterClosed().subscribe( resultado => {
    // no hay resultados cuando se cancela la operación (se cierra la ventana modal)
    if (resultado != null) {
        // el resultado es que se ha llenado en el formulario
        this.tipoenvio = resultado;
        this.crearTipoEnvio();
    }
  });
}

// Crear Tipo Envio
public crearTipoEnvio(): void {
  this.tipoenviosService.crearTipoEnvios(this.tipoenvio).subscribe(
    respuesta => {
      swal.fire('Nuevo Tipo Envio', `Tipo Envio ${this.tipoenvio.nombre} creado con exito!`, 'success');
      this.Paginado();
    });
}

// Abrir Formulario Editar Tipo Envios
AbrirFormularioEditar(idTipoEnvio) {
const VentanaModal = this.ventanaModal.open(FormtipoenviosComponent,
  {
    width: '60%',
    height: 'auto',
    position: {left: '30%', top: '60px'},
    data: idTipoEnvio
  });
  VentanaModal.afterClosed().subscribe(resultado => {
    if (resultado != null) {
    this.tipoenvio = resultado; 
    this.tipoenvio.id = idTipoEnvio;// id para la ruta
    this.editarTipoEnvio();
    this.Paginado();
   }
  });
}

// Editar
public editarTipoEnvio(): void {
  this.tipoenviosService.ModificarTipoEnvio(this.tipoenvio).subscribe(respuesta => {
  swal.fire('Cliente Actializado', `Cliente ${this.tipoenvio.nombre} actualizado con éxito!`, 'success');
  });
}

// Abrir Ventana Detalle Tipo Envio
public AbrirVentanaDetalle(idTipoEnvio): void {
  this.ventanaModal.open(DetalleTipoEnvioComponent,
   {
      width: '60%',
      height: 'auto',
      position: { left: '30%', top: '60px'},
      data: idTipoEnvio
   });
}

// Eliminar
public Eliminar(tipoenvio: Tipoenvios): void {
  swal.fire ({
  title: '¿Estas seguro?',
  text: '¿Seguro que desea Eliminar el Tipo Envio ' + tipoenvio.nombre + ' ?',
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#ad3333',
  cancelButtonText: 'No, cancelar!',
  confirmButtonText: 'Si, eliminar!'
  }).then((respuesta) => {
    if (respuesta.value) {
      this.tipoenviosService.Eliminar(tipoenvio.id).subscribe( respuest => {
        alertasSweet.fire('Tipo Envio Eliminado!', 'Tipo Envio <strong>' + tipoenvio.nombre + '</strong> Eliminado con éxito.', 'success');
        this.Paginado();
      });
    }
  });
}
}

