import { Component, OnInit, ViewChild } from '@angular/core';
import { CostoMaterialService } from './costo-material.service';
import { MatDialog } from '@angular/material/dialog';
import { CostoMaterial } from './CostoMaterial';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { FormCostoMaterialComponent } from './costoMaterialForm/form-costo-material.component';
import alertasSweet from 'sweetalert2';
import { MatSlideToggleModule, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Material } from '../materiales/Material';


@Component({
  selector: 'app-costo-material',
  templateUrl: './costo-material.component.html',
  styleUrls: ['./costo-material.component.css']
})




export class CostoMaterialComponent implements OnInit {

  

  /// variables de nombres y rutas de funcionalidades
  titulo = 'Tarifas materiales';
  rutaFuncionalidad = 'Inventario / Tarifas materiales';


  // variables para el MatTableDatasource<Material>
  datos: MatTableDataSource<CostoMaterial>;
  columnasTabla: string[] = ['Cantidad', 'Unidad de medida', 'Material', 'Costo', 'acciones'];


  // variables para el paginador
  tamanoPagina = 5;
  paginaIndex = 0;
  totalRegistros = 0;
  tamanosPagina = [5, 10, 15, 20, 25];

  @ViewChild(MatPaginator, {static: true}) paginador: MatPaginator;


  // Variables para el Sort
  @ViewChild(MatSort, {static: true}) ordenadorRegistros: MatSort;


  // en esta variable quedará almacenada la lista de costos de materiales
  listaCostoMaterial: CostoMaterial[];

  // en esta variable se asignará el valor recibido en el formulario
  costoMaterialFormulario: CostoMaterial[];

  // esta variable recibe el costoMaterial del Formulario de editar
  costoMaterialEditar: CostoMaterial;

  //esta variable es un formulario el cual permite controlar los slideToogle
  formularioTabla: FormGroup;
  listaCostos: FormArray;

  arrayCostoMateriales: CostoMaterial[] = new Array();

  constructor(protected costoMaterialService: CostoMaterialService,
              public ventanaModal: MatDialog,
              private constructorFormulario: FormBuilder) { }


  ngOnInit(): void {
    //this.crearFormularioTabla();
    this.listarCostoMaterialPaginado();
  }

  // ----------------- métodos para el control de formulario --------------------- //

  /*crearFormularioTabla(): void {
    this.formularioTabla = this.constructorFormulario.group({
      listaCostos: this.constructorFormulario.array([])
    });
  }

  obtenerArrayFormularioTabla(): FormArray {
    return this.formularioTabla.get('listaCostos') as FormArray;
  }

  llenarFormulario(): void {

      // eliminamos todos los controles del Array porque cada vez que se pagina se agregan más elementos
      // y debe evitarse eso
      this.obtenerArrayFormularioTabla().clear();

  }
*/
  

// --------------------------------------------------------------------------------- //


  /*
    El método listarCostoMaterialPaginado() invoca el método del service que
    realiza una petición tipo GET al backend y se suscribe al observador
    que retorna el método del service para obtener los datos de la respuesta

    Parámetros: nada
    Retorna: nada
  */
 listarCostoMaterialPaginado(): void {
    this.costoMaterialService.obtenerElementosPaginado(this.paginaIndex.toString(), this.tamanoPagina.toString()).subscribe( respuesta => {

      // establecemos los nuevos valores de la paginación de acuerdo al contenido de la respuesta
      this.listaCostoMaterial = respuesta.content as CostoMaterial[];
      this.totalRegistros = respuesta.totalElements as number;

      // instanciamos el MatTablaDataSource con la lista obtenida en la respuesta
      this.datos = new MatTableDataSource<CostoMaterial>(this.listaCostoMaterial);

      // asignamos el paginador al MatTablaDataSource
      this.datos.paginator = this.paginador;

      // Establecemos los valores de las variables relacionadas con Sort
      this.datos.sort = this.ordenadorRegistros;

      // ejecuta el llenado del formulario
     // this.llenarFormulario();

    });
  }


  
 reordenar(sort: Sort): void {

  // obtenemos el array
  const listCostoMaterial = this.listaCostoMaterial.slice();

  if (!sort.active || sort.direction === '') {
    return;
  }

  this.datos = new MatTableDataSource<CostoMaterial>(
    this.listaCostoMaterial = listCostoMaterial.sort( (a, b) => {
      const esAscendente = sort.direction === 'asc'; // se determina si es ascendente
      switch (sort.active) { // sort.active obtiene el id (string) de la columna seleccionada
        case 'Cantidad': return this.comparar( a.cantidad, b.cantidad, esAscendente);
        case 'Unidad de medida': return this.comparar(a.unidadMedida.nombre, b.unidadMedida.nombre, esAscendente);
        case 'Material': return this.comparar( a.material.nombre, b.material.nombre, esAscendente);
        case 'Costo': return this.comparar( a.costo, b.costo, esAscendente);
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
    this.listarCostoMaterialPaginado();
  }

  /**
   * Este método obtiene la cantidad de Materiales del array de datos del MatTable
   * de acuerdo al ID especificado y que se encuentran activos
   * @param id corresponde al ID del material a buscar en el Array de datos del MatTable
   * @returns La cantidad de materiales que se encuentran activos (number)
  
  extraerCantidadMaterialesPorID(id: number): number {
    let listaCostosMateriales: CostoMaterial[] = this.datos.data;
    let listafiltrada = listaCostosMateriales.filter( costoMaterial => costoMaterial.material.id === id);

    let contador = 0;
    listafiltrada.forEach( elemento => {
      if(elemento.activo)contador ++;
    });

    return contador;
  }

 */

  // ----------------- funciones para el control de ventanas modales --------------- //

  abrirVentanaAgregar(): void {
    const referenciaVentanaModal = this.ventanaModal.open(FormCostoMaterialComponent, {
      width: '60%',
      height: 'auto',
      position: {left: '30%', top: '60px'}
    });

    referenciaVentanaModal.afterClosed().subscribe( resultado => {
      if (resultado) {
        this.costoMaterialFormulario = resultado;
        this.agregarCostoMaterial();
      }
    });
  }


  abrirVentanaEditar(idCostoMaterial: number): void {
    const referenciaVentanamodal = this.ventanaModal.open(FormCostoMaterialComponent, {
      width: '60%',
      height: 'auto',
      position: {left: '30%', top: '60px'},
      data: idCostoMaterial
    });

    referenciaVentanamodal.afterClosed().subscribe(resultado => {

      if(resultado != null){
        this.costoMaterialEditar = resultado;        
        this.costoMaterialEditar.id = idCostoMaterial; 
        this.editarCostoMaterial();
      }

    });
  }

  // --------------- funciones para el CRUD -------------------------------- //


  agregarCostoMaterial(): void {

    let mensajeConfirmacion = '';

    this.costoMaterialFormulario.forEach( (costoFormulario,index) => {
      let costoMaterial = costoFormulario;
      this.costoMaterialService.agregarElemento(costoMaterial).subscribe( resultado => {
        mensajeConfirmacion = resultado.mensaje;
        if(index == this.costoMaterialFormulario.length -1 )this.listarCostoMaterialPaginado();
      });
    });
      
      alertasSweet.fire('Costo de material registrado', mensajeConfirmacion,'success');
  }


  editarCostoMaterial(): void {
    this.costoMaterialService.editarElemento(this.costoMaterialEditar).subscribe( resultado => {
      alertasSweet.fire('Costo de material actualizado', resultado.mensaje);
      this.listarCostoMaterialPaginado();
    });
  }



  eliminarMaterial(costoMaterial: CostoMaterial): void {
    alertasSweet.fire({
      title: 'Cuidado!',
      text: '¿Desea eliminar el costo del material ' + costoMaterial.material.nombre + '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#ad3333',
      confirmButtonText: 'Sí, eliminar!'
    }).then((result) => {
      if (result.value) {
        this.costoMaterialService.eliminaElemento(costoMaterial.id).subscribe(respuesta => {
          alertasSweet.fire(
            'Eliminado!',
            'El costo del material <strong>' + costoMaterial.material.nombre + '</strong> ha sido eliminado exitosamente',
            'success'
          );
          this.listarCostoMaterialPaginado();
        });
      }
    });

  }


}
