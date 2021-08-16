import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Material } from './Material';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialService } from './material.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MaterialFormComponent } from './materialForm/material-form.component';
import { MaterialDetalleComponent } from './materialDetalle/material-detalle.component';
import alertasSweet from 'sweetalert2';


@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.css']
})



export class MaterialComponent implements OnInit {


  /// variables de nombres y rutas de funcionalidades
  titulo = 'Inventario de Material';
  rutaFuncionalidad = 'Inventario / Listar materiales';


  // variables para el MatTableDatasource<Material>
  datos: MatTableDataSource<Material>;
  columnasTabla: string[] = ['nombre', 'cantidad', 'unidadMedida','descripcion','acciones'];


  // variables para el paginador
  tamanoPagina = 5;
  paginaIndex = 0;
  totalRegistros = 0;
  tamanosPagina = [5, 10, 15, 20, 25];

  @ViewChild(MatPaginator, {static: true}) paginador: MatPaginator;


  // Variables para el Sort
  @ViewChild(MatSort, {static: true}) ordenadorRegistros: MatSort;


  // en esta variable quedará almacenada la lista de materiuales
  listaMateriales: Material[];

  // en esta variable se asignará el valor recibido en el formulario
  material: Material;


  constructor(private materialService: MaterialService,
              public ventanaModal: MatDialog) { }


  ngOnInit(): void {
    this.listarMaterialPaginado();
  }



  /*
    El método listarMaterialPaginado() invoca el método del service que
    realiza una petición tipo GET al backend y se suscribe al observador
    que retorna el método del service para obtener los datos de la respuesta

    Parámetros: nada
    Retorna: nada
  */
  listarMaterialPaginado(): void {
    this.materialService.obtenerMaterialesPaginado(this.paginaIndex.toString(), this.tamanoPagina.toString()).subscribe( respuesta => {

      // establecemos los nuevos valores de la paginación de acuerdo al contenido de la respuesta
      this.listaMateriales = respuesta.content as Material[];
      this.totalRegistros = respuesta.totalElements as number;

      // instanciamos el MatTablaDataSource con la lista obtenida en la respuesta
      this.datos = new MatTableDataSource<Material>(this.listaMateriales);

      // asignamos el paginador al MatTablaDataSource
      this.datos.paginator = this.paginador;

      // Establecemos los valores de las variables relacionadas con Sort
      this.datos.sort = this.ordenadorRegistros;
      this.datos.sort.active = 'nombre';
      this.datos.sort.direction = 'asc';

    });
  }


  
 reordenar(sort: Sort): void {

  // obtenemos el array
  const listTallas = this.listaMateriales.slice();

  if (!sort.active || sort.direction === '') {
    return;
  }

  this.datos = new MatTableDataSource<Material>(
    this.listaMateriales = listTallas.sort( (a, b) => {
      const esAscendente = sort.direction === 'asc'; // se determina si es ascendente
      switch (sort.active) { // sort.active obtiene el id (string) de la columna seleccionada
        case 'nombre': return this.comparar( a.nombre, b.nombre, esAscendente);
        case 'descripcion': return this.comparar(a.descripcion, b.descripcion, esAscendente);
        case 'unidadMedida': return this.comparar(a.unidadMedida.nombre, b.unidadMedida.nombre, esAscendente);
        case 'cantidad': return this.comparar(a.cantidad, b.cantidad, esAscendente);
      }
    }));
}


comparar(a: number | string, b: number | string, esAscendente: boolean) {
  return (a < b ? -1 : 1) * (esAscendente ? 1 : -1);
}



aplicarFiltro(event: Event) {
  const textoFiltro = (event.target as HTMLInputElement).value;
  this.datos.filter = textoFiltro.trim().toLowerCase();
}


  paginar(evento: PageEvent): void {
    this.paginaIndex = evento.pageIndex;
    this.tamanoPagina = evento.pageSize;
    this.totalRegistros = evento.length;
    this.listarMaterialPaginado();
  }







  // ----------------- funciones para el control de ventanas modales --------------- //

  abrirVentanaAgregar(): void {
    const referenciaVentanaModal = this.ventanaModal.open(MaterialFormComponent, {
      width: '60%',
      height: 'auto',
      position: {left: '30%', top: '60px'}
    });

    referenciaVentanaModal.afterClosed().subscribe( resultado => {
      if (resultado) {
        this.material = resultado;
        this.agregarMaterial();
      }
    });
  }


  abrirVentanaEditar(idMaterial: number): void {
    const referenciaVentanamodal = this.ventanaModal.open(MaterialFormComponent, {
      width: '60%',
      height: 'auto',
      position: {left: '30%', top: '60px'},
      data: idMaterial
    });

    referenciaVentanamodal.afterClosed().subscribe(resultado => {
      this.material = resultado;
      this.material.id = idMaterial;
      this.editarMaterial();
    });
  }

  abrirVentanaDetalle(idMaterial: number): void {
    const referenciaVentanaModal = this.ventanaModal.open(MaterialDetalleComponent, {
      width: '60%',
      height: 'auto',
      position: {left: '30%', top: '60px'},
      data: idMaterial
    });
  }



  // --------------- funciones para el CRUD -------------------------------- //


  agregarMaterial(): void {
    this.materialService.agregarMaterial(this.material).subscribe( resultado => {
      alertasSweet.fire('Nuevo material', resultado.mensaje);
      this.listarMaterialPaginado();
    });
  }

  editarMaterial(): void {
    this.materialService.editarMaterial(this.material).subscribe( resultado => {
      alertasSweet.fire('Material actualizado', resultado.mensaje);
      this.listarMaterialPaginado();
    });
  }



  eliminarMaterial(material: Material): void {
    alertasSweet.fire({
      title: 'Cuidado!',
      text: '¿Desea eliminar el material ' + material.nombre + '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#ad3333',
      confirmButtonText: 'Sí, eliminar!'
    }).then((result) => {
      if (result.value) {
        this.materialService.eliminaMaterial(material.id).subscribe(respuesta => {
          alertasSweet.fire(
            'Eliminado!',
            'El material <strong>' + material.nombre + '</strong> ha sido eliminado exitosamente',
            'success'
          );
          this.listarMaterialPaginado();
        });
      }
    });

  }


}
