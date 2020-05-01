import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Proveedor } from './proveedor';
import { ProveedorService } from './proveedor.service';
import alertasSweet from 'sweetalert2';

import { MatPaginator, PageEvent } from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort, Sort} from '@angular/material/sort';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';

/*
  Importamos las librerías necesarias para la implementación de ventanas modales (MatDialog)
*/
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormProveedoresComponent } from './form.component';




@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})




export class ProveedoresComponent implements OnInit {


  // listado de Proveedores
  proveedores: Proveedor[];
  titulo = 'Proveedores';
  rutaFuncionalidades = 'Proveedores / Listar proveedores';

  // se declara una variable de tipo ProveedorService (debe ser privada)
  private proveedorService: ProveedorService;


  // se declara una variable de tipo MatDialog. Debe ser pública
  public ventanaModal: MatDialog;

  // se declara un proveedor donde quedará la información del formulario
  public proveedorForm: Proveedor;

  // instanciamos el ProveedorService y la ventana modal
  constructor(proveedorService: ProveedorService, ventanaModal: MatDialog) {
      this.proveedorService = proveedorService;
      this.ventanaModal = ventanaModal;
    }



  // variables con valores iniciales para el paginador
  totalRegistros = 0;
  tamanoPagina = 5;
  paginaActual = 0;
  elementosPorPagina: number[] = [5, 10, 20, 30, 50, 100];

  columnasTabla: string[] = ['documento', 'nombres', 'apellidos', 'acciones']; // contiene los ID de cada una de las columnas de la tabla
  datos: MatTableDataSource<Proveedor>;

  @ViewChild(MatPaginator, {static: true}) paginador: MatPaginator;
  @ViewChild(MatSort, {static: true}) ordenadorRegistros: MatSort;


  /*
    Al inicializar el componente se mostrará el listado de proveedores paginado,
    es por ello que  en esta parte se ejecutan dichas acciones
  */
  ngOnInit(): void {
    this.listaPaginado();
  }



/*
    El método listarProveedores() obtiene el listado de proveedores registrados
*/

listarProveedores(): void {
  this.proveedorService.getProveedores().subscribe(
    proveedores => {
      this.proveedores = proveedores;
      console.log(this.proveedores);
    }
  );
}





/*
  El método paginar() realiza el control de la paginación.
  Cada vez que se seleccione un botón del paginador se actualizan los valores de las variables y se realiza el get con los parámetros
  Parámetros:
      - evento: PageEvent --> el evento de tipo PageEvent
  Retorna: nada
*/
paginar(evento: PageEvent): void {
  this.paginaActual = evento.pageIndex;
  this.tamanoPagina = evento.pageSize;
  this.totalRegistros = evento.length;

  this.listaPaginado();
}





/*
    El método listaPaginado() realiza el get de acuerdo a los valores actualizados
*/

  private listaPaginado(): void {
    this.proveedorService.listarProveedoresPaginado(this.paginaActual.toString(), this.tamanoPagina.toString()).subscribe(
      paginadorProveedor => {

        // se extrae el contenido del JSON paginador
          this.proveedores = paginadorProveedor.content as Proveedor[]; // Arreglo de Proveedor
          this.totalRegistros = paginadorProveedor.totalElements as number; // cantidad de registros

          // se organiza la información en un MatTableDataSource para usar los componentes de Angular Material
          this.datos = new MatTableDataSource<Proveedor>(this.proveedores);
          this.datos.paginator = this.paginador;

          // asigna el sorting al MatTableDataSource
          this.datos.sort = this.ordenadorRegistros;
          this.datos.sort.active = 'nombres';
          this.datos.sort.direction = 'asc';
      }
  );
  }






/*
  El método aplicarFiltro permite realizar proceso de filtrado de datos
  Parámetros:
      - El evento generado
      - Retorna: nada
*/

 aplicarFiltro(event: Event) {
  const textoFiltro = (event.target as HTMLInputElement).value;
  this.datos.filter = textoFiltro.trim().toLowerCase();
}




reordenar(sort: Sort) {

  const listProveedores = this.proveedores.slice(); // obtenemos el array

  /*
    Si no está activo el sorting o no se ha establecido la dirección del sorting (asc ó desc)
    se asigna los mismos datos (sin ordenar)
  */
  if (!sort.active || sort.direction === '' ) {
      // this.datos = new MatTableDataSource<Proveedor>(this.proveedores);
      return;
  }

  this.datos = new MatTableDataSource<Proveedor>(
      this.proveedores = listProveedores.sort( (a, b) => {
        const esAscendente = sort.direction === 'asc'; // se determina si es ascendente
        switch (sort.active) { // sort.active obtiene el id (string) de la columna seleccionada
          case 'nombres': return this.comparar( a.nombres, b.nombres, esAscendente);
          case 'apellidos': return this.comparar(a.apellidos, b.apellidos, esAscendente);
          case 'documento': return this.comparar( a.documento, b.documento, esAscendente);
        }
      }));

  // cada vez que se haga clic en un botón para reordenar es necesario paginar de nuevo


}

// Esta función compara dos String junto con el valor de la variable isAsc y retorna:
comparar(a: number | string, b: number | string, esAscendente: boolean) {
  return (a < b ? -1 : 1) * (esAscendente ? 1 : -1);
}


  /*
    El método eliminarProveedor(Proveedor) ejecuta el método eliminarProveedor del ClienteService.
      Parámetros: El proveedor a eliminar
      Retorna: nada
  */
  eliminarProveedor(proveedor: Proveedor) {

   this.proveedorService.eliminarProveedor(proveedor.id).subscribe(
     respuesta => {
       // this.proveedores = this.proveedores.filter( prov => prov !== proveedor)
       this.listaPaginado(); // cada vez que se elimine se lista paginado (refresca los valores y la lista)
     }
   );
  }





  /*
    El método abrirVentana implementa acciones sobre la ventana modal:
      - open: Abre una ventana con los parámetros que se envían:
              - el componente html
              - datos adicionales:
                  - el ancho
                  - el objeto:  En este caso se envía un proveedor. Sobre ese objeto se 
                                almacena la información del formulario
      - afterClosed: Al cerrarse la ventana se asigna el proveedor con la información del formulario (resultado).
  */
abrirVentana(): void {
  
  // se declara una constante
  const referenciaVentanaModal = this.ventanaModal.open(FormProveedoresComponent,
    {
      width: '80%',

    });

  referenciaVentanaModal.afterClosed().subscribe( resultado => {
      this.proveedorForm = resultado;
    });

}



}
