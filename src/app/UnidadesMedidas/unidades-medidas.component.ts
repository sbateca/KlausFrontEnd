import { Component, OnInit, ViewChild } from '@angular/core';
import { UnidadMedidaService } from './unidad-medida.service';
import { MatDialog } from '@angular/material/dialog';
import { UnidadMedida } from './UnidadMedida';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { UnidadMedidaFormComponent } from './unidadMedidaForm/unidadmedida-form.component';
import alertasSweet from 'sweetalert2';
import { UnidadMedidaDetalleComponent } from './unidadMediaDetalle/unidad-medida-detalle.component';

@Component({
  selector: 'app-unidades-medidas',
  templateUrl: './unidades-medidas.component.html',
  styleUrls: ['./unidades-medidas.component.css']
})

export class UnidadesMedidasComponent implements OnInit {

  titulo = "Unidades de medida";
  rutaFuncionalidad = 'Inventario / Unidades de medida';

  
// variables para el MatTableDatasource<Material>
datos: MatTableDataSource<UnidadMedida>;
columnasTabla: string[] = ['categoria', 'nombre', 'abreviatura', 'acciones'];


// variables para el paginador
tamanoPagina = 5;
paginaIndex = 0;
totalRegistros = 0;
tamanosPagina = [5, 10, 15, 20, 25];

@ViewChild(MatPaginator, {static: true}) paginador: MatPaginator;


// Variables para el Sort
@ViewChild(MatSort, {static: true}) ordenadorRegistros: MatSort;


// en esta variable quedará almacenada la lista de unidades de medida
listaUnidadesMedida: UnidadMedida[];


// en esta variable quedará almacenada la Unidad de Medida del formulario
unidadMedida: UnidadMedida;


  constructor(protected unidadMedidaService: UnidadMedidaService,
              public ventanaModal: MatDialog) { }

  ngOnInit(): void {
    this.listarUnidadMedidaPaginado();
  }

    /*
    El método listarUnidadMedidaPaginado() invoca el método del service que
    realiza una petición tipo GET al backend y se suscribe al observador
    que retorna el método del service para obtener los datos de la respuesta

    Parámetros: nada
    Retorna: nada
  */
  listarUnidadMedidaPaginado(): void {
    this.unidadMedidaService.obtenerElementosPaginado(this.paginaIndex.toString(), this.tamanoPagina.toString()).subscribe( respuesta => {

      // establecemos los nuevos valores de la paginación de acuerdo al contenido de la respuesta
      this.listaUnidadesMedida = respuesta.content as UnidadMedida[];
      this.totalRegistros = respuesta.totalElements as number;
  
      // instanciamos el MatTablaDataSource con la lista obtenida en la respuesta
      this.datos = new MatTableDataSource<UnidadMedida>(this.listaUnidadesMedida);
  
      // asignamos el paginador al MatTablaDataSource
      this.datos.paginator = this.paginador;
  
      // Establecemos los valores de las variables relacionadas con Sort
      this.datos.sort = this.ordenadorRegistros;
      this.datos.sort.active = 'categoria';
      this.datos.sort.direction = 'asc';
  
    });
  }



  reordenar(sort: Sort): void {

    // obtenemos el array
    const listUnidades = this.listaUnidadesMedida.slice();
    
    if (!sort.active || sort.direction === '') {
      return;
    }
    
    this.datos = new MatTableDataSource<UnidadMedida>(
      this.listaUnidadesMedida = listUnidades.sort( (a, b) => {
        const esAscendente = sort.direction === 'asc'; // se determina si es ascendente
        switch (sort.active) { // sort.active obtiene el id (string) de la columna seleccionada
          case 'categoria': return this.comparar( a.categoria, b.categoria, esAscendente);
          case 'nombre': return this.comparar(a.nombre, b.nombre, esAscendente);
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
      this.listarUnidadMedidaPaginado();
    }



    


// ----------------- funciones para el control de ventanas modales --------------- //

abrirVentanaAgregar(): void {
  const referenciaVentanaModal = this.ventanaModal.open(UnidadMedidaFormComponent, {
    width: '60%',
    height: 'auto',
    position: {left: '30%', top: '60px'}
  });

  referenciaVentanaModal.afterClosed().subscribe( resultado => {
    if (resultado) {
      this.unidadMedida = resultado;
      this.agregarUnidadMedida();
    }
  });
}


abrirVentanaEditar(idUnidadMedida: number): void {
  const referenciaVentanamodal = this.ventanaModal.open(UnidadMedidaFormComponent, {
    width: '60%',
    height: 'auto',
    position: {left: '30%', top: '60px'},
    data: idUnidadMedida
  });

  referenciaVentanamodal.afterClosed().subscribe(resultado => {
    this.unidadMedida = resultado;
    this.unidadMedida.id = idUnidadMedida;
    console.log('la información que se envía al cerrar ventana:');
    console.log(this.unidadMedida);
    this.editarUnidadMedida();
  });
}

abrirVentanaDetalle(idProducto: number): void {
  const referenciaVentanaModal = this.ventanaModal.open(UnidadMedidaDetalleComponent, {
    width: '60%',
    height: 'auto',
    position: {left: '30%', top: '60px'},
    data: idProducto
  });
}




// *************** funciones del CRUD **************************** //

agregarUnidadMedida(){
  this.unidadMedidaService.agregarElemento(this.unidadMedida).subscribe( resultado => {
    alertasSweet.fire('Nueva unidad', resultado.mensaje, 'success');
        this.listarUnidadMedidaPaginado();
  });
}

editarUnidadMedida() {
  this.unidadMedidaService.editarElemento(this.unidadMedida).subscribe(resultado => {
    alertasSweet.fire('Unidad de medida actualizada', resultado.mensaje,'success');
    this.listarUnidadMedidaPaginado();
  });
}

eliminarUnidadMedida(unidadMedida: UnidadMedida) {
  alertasSweet.fire({
    title: 'Cuidado!',
    text: '¿Desea eliminar la unidad ' + unidadMedida.nombre + '?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#ad3333',
    confirmButtonText: 'Sí, eliminar!'
  }).then((result) => {
    if (result.value) {      
      this.unidadMedidaService.eliminaElemento(unidadMedida.id).subscribe(respuesta => {
        alertasSweet.fire(
          'Eliminado!',
          'La unidad de medida <strong>' + unidadMedida.nombre + '</strong> ha sido eliminada exitosamente',
          'success'
        );
        this.listarUnidadMedidaPaginado();
      });
    }
  });
}


}
