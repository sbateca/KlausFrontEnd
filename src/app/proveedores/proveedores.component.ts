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

// para trabajar con rutas
import { Router, ActivatedRoute } from '@angular/router';


/*
  Importamos las librerías necesarias para la implementación de ventanas modales (MatDialog)
*/
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormProveedoresComponent } from './form.component';
import { DetalleComponent } from './detalle/detalle.component';




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

  // se declara un proveedor donde quedará la información del resultado obtenido al cerrar la ventana
  // es decir, al cerrar la ventana se asigna el proveedor que se llenó en el formulario en esta variable
  public proveedor: Proveedor;

  // creramos un enrutador
  private enrutador: Router; // se usa para acceder a funciones de redirección
  private activatedRoute: ActivatedRoute; // se usa para extraer información de la ruta


  // instanciamos el ProveedorService y la ventana modal
  constructor(proveedorService: ProveedorService,
              enrutador: Router,
              activatedRoute: ActivatedRoute,
              ventanaModal: MatDialog) {

      this.proveedorService = proveedorService;
      this.enrutador = enrutador;
      this.activatedRoute = activatedRoute;
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
 
    alertasSweet.fire({
      title: 'Cuidado:',
      text: '¿Seguro que desea eliminar al proveedor ' + proveedor.nombres + '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#ad3333',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.value) {

        this.proveedorService.eliminarProveedor(proveedor.id).subscribe(
          respuesta => {
            // this.proveedores = this.proveedores.filter( prov => prov !== proveedor)
            this.listaPaginado(); // cada vez que se elimine se lista paginado (refresca los valores y la lista)
            alertasSweet.fire('Eliminado!', 'El proveedor <strong>'+ proveedor.nombres + '</strong> ha sido eliminado', 'success');
          }
        );

      }
    });

  }


  /*
    El método abrirVentana implementa acciones sobre la ventana modal:
      - open: Abre una ventana con los parámetros que se envían:
              - el componente que implementa la vista de la ventana modal
              - datos adicionales:
                  - Un JSON con configuraciones para la ventana
                  - data: acá se puede enviar información a la ventana modal (componente).
                          En este caso se envía el ID del proveedor
      - afterClosed: Al cerrarse la ventana se asigna el proveedor con la información del formulario (resultado).
  */
abrirVentana(): void {

  // se declara una constante
  const referenciaVentanaModal = this.ventanaModal.open(FormProveedoresComponent,
    {
      width: '60%',
      height: 'auto',
      position: {left: '30%', top: '60px'}
    });

  referenciaVentanaModal.afterClosed().subscribe( resultado => {

      // no hay resultados cuando se cancela la operación (se cierra la ventana modal)
      if (resultado != null) {
          // el resultado es el proveedor que se ha llenado en el formulario
          this.proveedor = resultado;
          
          console.log("--------- proveedor nuevo ------------");
          console.log(this.proveedor);
          console.log("---------------------");
          this.crearProveedor();
      }
    });


}







/* editar proveedor*/

abrirVentanaEditarProveedor(idProveedor): void {

  const referenciaVentanaModal = this.ventanaModal.open(FormProveedoresComponent,{
    width: '60%',
    height: 'auto',
    position: {left: '30%', top: '60px'},
    data: idProveedor
  });

  referenciaVentanaModal.afterClosed().subscribe( resultado => {
    this.proveedor = resultado;

    console.log("--------- proveedor actualizado ------------");
    console.log(this.proveedor);
    console.log("---------------------");

    this.actualizarProveedor();
  });


}








    /*
        El método crearProveedor() ejecuta el método crearProveedor del ProveedorService y se suscribe en espera de una repuesta
        La respuesta se utiliza para mostrar un mensaje de confirmación con datos del proveedor creado
        Parámetros:
            - Nada
        Retorna: Nada
    */

crearProveedor(): void {
  this.proveedorService.crearProveedor(this.proveedor).subscribe(
      respuesta => {
          this.listaPaginado();
          alertasSweet.fire('Nuevo proveedor', respuesta.mensaje, 'success');
      }
  );
}





    /*
        El método actualizarProveedor() ejecuta el método actualizarProveedor del ProveedorService
        y se suscribe en espera de una repuesta.
        La respuesta se utiliza para mostrar un mensaje de confirmación con datos del proveedor actualizado
        Parámetros: Nada
        Retorna: Nada
    */
   actualizarProveedor(): void {
 
    this.proveedorService.actualizarProveedor(this.proveedor).subscribe(
        respuesta => {
            this.listaPaginado();
            // this.enrutador.navigate(['/proveedores']);
            alertasSweet.fire('Confirmación', respuesta.mensaje, 'success');
        }
    );
}





/*
  La función abrirVentanaVer() permite abrir una ventana modal la cual carga la vista
  donde se observa el detalle del proveedor seleccionado
*/

abrirVentanaVer(idProveedor): void {
  
  this.ventanaModal.open(DetalleComponent, {
    width: '60%',
    height: 'auto',
    position: {left: '30%', top: '60px'},
    data: idProveedor
  });
}





}