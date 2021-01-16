import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormEmpresaTransportadoraComponent } from '../form-empresa-transportadora/form-empresa-transportadora.component';
import { EmpresaTransportadora } from '../empresa-transportadora';
import { EmpresaTransportadoraService } from '../empresa-transportadora.service';
import swal from 'sweetalert2';
import { DetalleEmpresaTransportadoraComponent } from '../detalle-empresa-transportadora/detalle-empresa-transportadora.component';
import alertasSweet from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Sort, MatSort } from '@angular/material/sort';





@Component({
  selector: 'app-empresa-transportadora',
  templateUrl: './empresa-transportadora.component.html'
})
export class EmpresaTransportadoraComponent implements OnInit {

  public empresaTransportadora: EmpresaTransportadora;
  public listaEmpresaTransportadora: EmpresaTransportadora[];

// Tabla
columnasTabla: string [] = ['nombre', 'acciones'];
datos: MatTableDataSource<EmpresaTransportadora>;

// Variables con valores iniciales para el paginador
totalRegistros = 0;
paginaActual = 0;
totalPorPaginas = 3;
pageSizeOptions: number[] = [3, 5, 10, 25, 100];
@ViewChild(MatPaginator, {static: true}) paginador: MatPaginator;
@ViewChild(MatSort, {static: true}) ordenadorRegistros: MatSort;
  constructor(public ventanaModal: MatDialog,
              public empresaTransportadoraService: EmpresaTransportadoraService) { }

  ngOnInit(): void {
    this.empresaTransportadoraService.verEmpresaTransportadora().subscribe(
      empresaTransportadora => {
         this.listaEmpresaTransportadora = empresaTransportadora;
      });
    this.ListarPaginado();
  }

// Buscador
AplicarFiltro(event: Event) {
    const textoFiltro = (event.target as HTMLInputElement).value;
    this.datos.filter = textoFiltro.trim().toLowerCase();
 }

 // Listar paginado : Get

private ListarPaginado() {

  this.empresaTransportadoraService.Paginado(this.paginaActual.toString(), this.totalPorPaginas.toString())
  .subscribe(paginacion => {

    // Se extrae el contenido Json paginador
    this.listaEmpresaTransportadora = paginacion.content as EmpresaTransportadora[]; // Arreglo lista paginada
    this.totalRegistros = paginacion.totalElements as number; // Cantidad de registros
    this.paginador._intl.itemsPerPageLabel = 'Registros por página:';

    // Para utilizar la Tabla en Angular Material Organiza la la informacion en MatTableDataSource para usar los componentes de Angular
    this.datos = new MatTableDataSource<EmpresaTransportadora>(this.listaEmpresaTransportadora);
  });
}

// Realiza el control de la paginacion, y las pagina. Cada vez que se seleccione un boton del paginador se actualizan los valores
paginar(evento: PageEvent): void {
    this.paginaActual = evento.pageIndex;
    this.totalPorPaginas = evento.pageSize; // Lo que enviamos al backend
    this.ListarPaginado();
}

reordenar(sort: Sort) {

  const listEmpresaTransportadora = this.listaEmpresaTransportadora.slice(); // obtenemos el array*/

  /*
  Si no está activo el sorting o no se ha establecido la dirección del sorting (asc ó desc) se asigna los mismos datos (sin ordenar)
  */
  if (!sort.active || sort.direction === '' ) {
     this.datos = new MatTableDataSource<EmpresaTransportadora>(this.listaEmpresaTransportadora);
     return;
  }
  this.datos = new MatTableDataSource<EmpresaTransportadora>(
  this.listaEmpresaTransportadora = listEmpresaTransportadora.sort( (a, b) => {
    const esAscendente = sort.direction === 'asc'; // se determina si es ascendente
    switch (sort.active) { // sort.active obtiene el id (string) de la columna seleccionada
      case 'nombre': return this.comparar(a.nombre, b.nombre, esAscendente);
    }
  }));
      // cada vez que se haga clic en un botón para reordenar es necesario paginar de nuevo
  }
  // Esta función compara dos String junto con el valor de la variable isAsc y retorna:
  comparar(a: number | string, b: number | string, esAscendente: boolean) {
  return (a < b ? -1 : 1) * (esAscendente ? 1 : -1);
  }

// Formulario
AbrirFormularioEmpresaTransportadora(): void {

  const VentanaModal = this.ventanaModal.open(FormEmpresaTransportadoraComponent,
 {
   width: '60%',
   height: 'auto',
   position: {left: '30%', top: '60px'}
 });
  VentanaModal.afterClosed().subscribe( resultado => {
  // no hay resultados cuando se cancela la operación (se cierra la ventana modal)
  if (resultado != null) {
      // el resultado es que se ha llenado en el formulario
      this.empresaTransportadora = resultado;
      /* console.log(resultado); */
      this.CrearEmpresaTransportadora();
  }
});
}

// Crear Empresa Transportadora
public CrearEmpresaTransportadora(): void {
  this.empresaTransportadoraService.crearEmpresaTransportadora(this.empresaTransportadora).subscribe(
    respuesta => {
      swal.fire('Nuevo Empresa Transportadora', `Empresa Transportadora ${this.empresaTransportadora.nombre} creado con exito!`, 'success');
      this.ListarPaginado();
    });
}

// Abrir Ventana Detalle Empresa Transporte
public AbrirVentanaDetalle(idEmpresaTransportadora): void {
  this.ventanaModal.open(DetalleEmpresaTransportadoraComponent,
   {
      width: '60%',
      height: 'auto',
      position: { left: '30%', top: '60px'},
      data: idEmpresaTransportadora
   });
}

// Abrir Formulario Editar Empresa Transportadora
AbrirFormularioEditar(idEmpresaTransportadora) {
const VentanaModal = this.ventanaModal.open(FormEmpresaTransportadoraComponent,
{
      width: '60%',
      height: 'auto',
      position: {left: '30%', top: '60px'},
      data: idEmpresaTransportadora
});
VentanaModal.afterClosed().subscribe(resultado => {
      if (resultado != null) {
        this.empresaTransportadora = resultado;
        this.empresaTransportadora.id = idEmpresaTransportadora; // id para la ruta
        this.EditarEmpresaTransportadora();
      }});
    }

// Editar
public EditarEmpresaTransportadora(): void {
    this.empresaTransportadoraService.ModificarEmpresaTransportadora(this.empresaTransportadora).subscribe(respuesta => {
      swal.fire('Empresa Transportadora Actializado', `Empresa Transportadora ${this.empresaTransportadora.nombre} actualizado con éxito!`, 'success');
      this.ListarPaginado();
  });
  }

// Eliminar
public Eliminar(empresaTransportadora: EmpresaTransportadora): void {
  console.log(empresaTransportadora);
  swal.fire ({
  title: '¿Estas seguro?',
  text: '¿Seguro que desea Eliminar la Empresa Transportadora ' + empresaTransportadora.nombre + ' ?',
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#ad3333',
  cancelButtonText: 'No, cancelar!',
  confirmButtonText: 'Si, eliminar!'
  }).then((respuesta) => {
    if (respuesta.value) {
      this.empresaTransportadoraService.EliminarEmpresaTransportadora(empresaTransportadora.id).subscribe( respuest => {
        alertasSweet.fire('Empresa Transportadora Eliminado!', 'Empresa Transportadora <strong>' + empresaTransportadora.nombre + '</strong> Eliminado con éxito.', 'success');
        this.ListarPaginado();
      });
    }
  });
}

}

