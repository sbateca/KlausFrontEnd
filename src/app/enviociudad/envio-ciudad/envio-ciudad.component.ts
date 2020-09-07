import { Component, OnInit, ViewChild } from '@angular/core';
import { Enviociudad } from '../Enviociudad';
import { MatTableDataSource } from '@angular/material/table';
import { EnviociudadService } from '../enviociudad.service';
import { FormenviociudadComponent } from '../formenviociudad/formenviociudad.component';
import { MatDialog } from '@angular/material/dialog'; // Ventana modal
import swal from 'sweetalert2';
import alertasSweet from 'sweetalert2';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort} from '@angular/material/sort'; // Sort
import { EmpresaTransportadoraComponent } from '../../EmpresaTransportadora/empresa-transportadora/empresa-transportadora.component';
import { TipoenviosComponent } from '../../tipoenvios/tipoenvios.component';
import { FormEmpresaTransportadoraComponent } from '../../EmpresaTransportadora/form-empresa-transportadora/form-empresa-transportadora.component';

@Component({
  selector: 'app-envio-ciudad',
  templateUrl: './envio-ciudad.component.html'
})
export class EnvioCiudadComponent implements OnInit {

  public listaenviociudad: Enviociudad[];
  public enviociudad: Enviociudad;

  @ViewChild(EmpresaTransportadoraComponent) empresaTransportadora: EmpresaTransportadoraComponent;


// Paginador
// Variables con valores iniciales para el paginador
totalRegistros = 0;
paginaActual = 0;
totalPorPaginas = 3;
pageSizeOptions: number[] = [3, 5, 10, 25, 100];
@ViewChild(MatPaginator, {static: true}) paginador: MatPaginator;
@ViewChild(MatSort, {static: true}) ordenadorRegistros: MatSort; // Sort

  constructor(public enviociudadService: EnviociudadService,
              public ventanaModal: MatDialog) { }

  // Tabla
  columnasTabla: string[] = ['tipoenvio', 'departamento' , 'ciudad', 'empresaTransportadora', 'valorenvio', 'acciones'];
  datos: MatTableDataSource<Enviociudad>;

  ngOnInit(): void {
    this.enviociudadService.verEnvioCiudad().subscribe(
       enviociudad => {
       this. listaenviociudad = enviociudad;
    });
    this.Paginado();
  }


// Buscador
AplicarFiltro(event: Event) {
  const textoFiltro = (event.target as HTMLInputElement).value;
  this.datos.filter = textoFiltro.trim().toLowerCase();
}

// Datos Paginador
paginar(evento: PageEvent): void {
  this.paginaActual = evento.pageIndex;
  this.totalPorPaginas = evento.pageSize; // Lo que enviamos al backend
  this.Paginado();
}

// Paginador
private Paginado(): void {
  this.enviociudadService.Paginado(this.paginaActual.toString(), this.totalPorPaginas.toString()).subscribe(paginacion => {
    this.listaenviociudad = paginacion.content as Enviociudad[];
    this.totalRegistros = paginacion.totalElements as number; // Cantidad de registros
    this.paginador._intl.itemsPerPageLabel = 'Registros por página:';
    // Para utilizar la tabla
    this.datos = new MatTableDataSource<Enviociudad>(this.listaenviociudad);
  });
}

// Reordenar Sort
reordenar(sort: Sort) {

  const listEnvioCiudad = this.listaenviociudad.slice(); // obtenemos el array*/

  /*
  Si no está activo el sorting o no se ha establecido la dirección (asc ó desc)
  se asigna los mismos datos (sin ordenar)
  */
  if (!sort.active || sort.direction === '' ) {
  this.datos = new MatTableDataSource<Enviociudad>(this.listaenviociudad);
  return;
  }

  this.datos = new MatTableDataSource<Enviociudad>(
  this.listaenviociudad = listEnvioCiudad.sort( (a, b) => {

    const esAscendente = sort.direction === 'asc'; // Se determina si es ascendente
    switch (sort.active) { // Obtiene el id (string) de la columna seleccionada
      case 'tipoenvio': return this.comparar(a.tipoEnvio.id, b.tipoEnvio.id, esAscendente); // compara por id
      case 'ciudad': return this.comparar(a.ciudad.id, b.ciudad.id, esAscendente);
      case 'empresaTransportadora': return this.comparar(a.empresaTransportadora.id, b.empresaTransportadora.id, esAscendente);
      case 'valorenvio': return this.comparar(a.valorEnvio, b.valorEnvio, esAscendente);
  }
  }));
  // cada vez que se haga clic en un botón para reordenar es necesario paginar de nuevo
}

  // Esta función compara dos String junto con el valor de la variable isAsc y retorna:
  comparar(a: number | string, b: number | string, esAscendente: boolean) {
    return (a < b ? -1 : 1) * (esAscendente ? 1 : -1);
  }
// Formulario
AbrirFormularioEnvioCiudad(): void {

  const VentanaModal = this.ventanaModal.open(FormenviociudadComponent,
 {
   width: '60%',
   height: 'auto',
   position: {left: '30%', top: '60px'}
 });
  VentanaModal.afterClosed().subscribe( resultado => {
  // no hay resultados cuando se cancela la operación (se cierra la ventana modal)
  if (resultado != null) {
      // el resultado es que se ha llenado en el formulario
      this.enviociudad = resultado;
      this.CrearEnvioCiudad();
  }
});
}

// Crear Envio Ciudad
CrearEnvioCiudad(): void {
  this.enviociudadService.crearEnviociudad(this.enviociudad).subscribe(enviociudad => {
    swal.fire('Nuevo Envio Ciudad', `Envio Ciudad ${this.enviociudad.tipoEnvio.nombre} creado con exito!`, 'success');
    this.Paginado();
  });
}

// Abrir Formulario Editar Envio Ciudad
AbrirFormularioEditarEnvioCiudad(idEnvioCiudad) {
  const VentanaModal = this.ventanaModal.open(FormenviociudadComponent,
    {
      width: '60%',
      height: 'auto',
      position: {left: '30%', top: '60px'},
      data: idEnvioCiudad
    });
  VentanaModal.afterClosed().subscribe( resultado => {
    if (resultado != null) {
        this.enviociudad = resultado;
        this.enviociudad.id = idEnvioCiudad; // id para la ruta
        this.editarEnvioCiudad();
      }});
    }

  // Editar Envio Ciudad
  public editarEnvioCiudad(): void {
    this.enviociudadService.ModificarEnvioCiudad(this.enviociudad).subscribe(respuesta => {
    swal.fire('Envio Ciudad Actializado', `Envio Ciudad ${this.enviociudad.ciudad.nombre} actualizado con éxito!`, 'success');
    });
  }

// Eliminar
public Eliminar(envioCiudad: Enviociudad): void {
  swal.fire ({
  title: '¿Estas seguro?',
  text: '¿Seguro que desea Eliminar el Envio Ciudad' + envioCiudad.tipoEnvio.nombre + ' ?',
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#ad3333',
  cancelButtonText: 'No, cancelar!',
  confirmButtonText: 'Si, eliminar!'
  }).then((respuesta) => {
    if (respuesta.value) {
      this.enviociudadService.Eliminar(envioCiudad.id).subscribe( respuest => {
        alertasSweet.fire('Envio Ciudad Eliminado!', 'Envio Ciudad ' + envioCiudad.tipoEnvio.nombre + ' Eliminado con éxito', 'success' );
        this.Paginado();
      });
    }
  });
}
}

