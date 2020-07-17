import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
// import swal from 'sweetalert2';
import swal from 'sweetalert2'; // implementamos
import alertasSweet from 'sweetalert2';
import { Ciudad } from '../ciudades/ciudad';
import { CiudadService } from '../ciudades/ciudad.service';
import { DepartamentoService } from '../departamentos/departamento.service';
import { Departamento } from '../departamentos/departamento';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort} from '@angular/material/sort';




import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';

/*
  Importamos las librerías necesarias para la implementación de ventanas modales (MatDialog)
*/
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormClientesComponent } from './form.component';
import { DetalleClienteComponent } from './detalle-cliente/detalle-cliente.component';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  public cliente: Cliente[];
  public ciudades: Ciudad[];
  public departamentos: Departamento[];
  public idSelec: number;
  public departametoSelec: Departamento;

  // se declara donde quedará la información del resultado obtenido al cerrar la ventana
  // es decir, al cerrar la ventana se asigna el proveedor que se llenó en el formulario en esta variable
  public cli: Cliente;

 // Variables con valores iniciales para el paginador
  totalRegistros = 0;
  paginaActual = 0;
  totalPorPaginas = 3;
  pageSizeOptions: number[] = [3, 5, 10, 25, 100];
  @ViewChild(MatPaginator, {static: true}) paginador: MatPaginator;
  @ViewChild(MatSort, {static: true}) ordenadorRegistros: MatSort;


  // Titulos de cada Columna
  // columnasTable: string [] = ['id', 'documento', 'nombres', 'apellidos', 'numero_contacto', 'departamento', 'ciudad', 'direccion', 'correo', 'codigo_postal', 'acciones'];
  columnasTable: string [] = ['documento', 'nombres', 'apellidos', 'acciones'];
  datos: MatTableDataSource<Cliente>;



  // Definir Variable columnas
  /*columnas = [
    {titulo: 'Id', value: 'id'},
    {titulo: 'Documento', value: 'documento'},
    {titulo: 'Nombres', value: 'nombres'},
    {titulo: 'Apellidos', value: 'apellidos'},
    {titulo: 'Numero de Telefono', value: 'numero_contacto'},
    {titulo: 'Departamento', value: 'departamento'},
    {titulo: 'Ciudad', value: 'ciudad'},
    {titulo: 'Dirección', value: 'direccion'},
    {titulo: 'Correo', value: 'correo'},
    {titulo: 'Codigo Postal', value: 'codigo_postal'},
    {titulo: 'Acciones', value: 'acciones'}
  ];*/

// Instanciamos
  constructor(public clienteService: ClienteService,
              public ciudadService: CiudadService,
              public departamentoservice: DepartamentoService,
              public ventanaModal: MatDialog) { }



// Al inicializar el componente se ejecuta listar Cliente y Paginador, cargar Departamentos.
  ngOnInit() {
    this.clienteService.getClientes().subscribe(
      cliente => {
        this.cliente = cliente; // Actualiza listado
      }
    );
    this.listarPaginado();
    this.cargarDepartamentos();
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




  // Realiza el control de la paginacion, y las pagina.
  // Cada vez que se seleccione un boton del paginador se actualizan los valores
  // PageEvent--> El evento de tipo PageEvent
  paginar(evento: PageEvent): void {
    this.paginaActual = evento.pageIndex;
    this.totalPorPaginas = evento.pageSize; // Lo que enviamos al backend
   //  this.totalRegistros = evento.length;
    this.listarPaginado();
  }




// Listar paginado : Realiza el get deacuerdo a los valores actualizados de cada pagina

private listarPaginado() {

    this.clienteService.listarClientesPaginado(this.paginaActual.toString(), this.totalPorPaginas.toString())
    .subscribe(paginacion => {

      // Se extrae el contenido Json paginador
      this.cliente = paginacion.content as Cliente[]; // Arreglo de cliente lista paginada
      this.totalRegistros = paginacion.totalElements as number; // Cantidad de registros
      this.paginador._intl.itemsPerPageLabel = 'Registros por página:';

      // Para utilizar la Tabla en Angular Material
      // Organiza la la informacion en MatTableDataSource para usar los componentes de Angular
      this.datos = new MatTableDataSource<Cliente>(this.cliente);
     // console.log("datos: ", JSON.stringify(this.datos));
     // this.datos.paginator = this.paginador;

      // asigna el sorting al MatTableDataSource
      this.datos.sort = this.ordenadorRegistros;
      this.datos.sort.active = 'nombres';
      this.datos.sort.direction = 'asc';

    });
  }





reordenar(sort: Sort) {

  const listCliente = this.cliente.slice(); // obtenemos el array*/

  /*
  Si no está activo el sorting o no se ha establecido la dirección del sorting (asc ó desc)
  se asigna los mismos datos (sin ordenar)
  */
  if (!sort.active || sort.direction === '' ) {
     this.datos = new MatTableDataSource<Cliente>(this.cliente);
     return;
  }

  this.datos = new MatTableDataSource<Cliente>(
  this.cliente = listCliente.sort( (a, b) => {

    const esAscendente = sort.direction === 'asc'; // se determina si es ascendente
    switch (sort.active) { // sort.active obtiene el id (string) de la columna seleccionada
      case 'id': return this.comparar( a.id, b.id, esAscendente);
      case 'documento': return this.comparar( a.documento, b.documento, esAscendente);
      case 'nombres': return this.comparar(a.nombres, b.nombres, esAscendente);
      case 'apellidos': return this.comparar( a.apellidos, b.apellidos, esAscendente);
      case 'numero_contacto': return this.comparar( a.numero_contacto, b.numero_contacto, esAscendente);
      //case 'departamento': return this.comparar( a.departamento, b.departamento, esAscendente);
     // case 'ciudad': return this.comparar( a.ciudad, b.ciudad, esAscendente);
      case 'direccion': return this.comparar( a.direccion, b.direccion, esAscendente);
      case 'correo': return this.comparar( a.correo, b.correo, esAscendente);
      case 'codigo_postal': return this.comparar( a.codigo_postal, b.codigo_postal, esAscendente);
  }
  }));

  // cada vez que se haga clic en un botón para reordenar es necesario paginar de nuevo
  }


  // Esta función compara dos String junto con el valor de la variable isAsc y retorna:
  comparar(a: number | string, b: number | string, esAscendente: boolean) {
  return (a < b ? -1 : 1) * (esAscendente ? 1 : -1);
  }


  // Cargar Departamento, carga los Departamentos para el select.
  cargarDepartamentos(): void {
    this.departamentoservice.obtenerDepartamentos().subscribe(departa => {
      this.departamentos = departa; //
    });
  }



  // Cargar Ciudades por Departamentos.
  // Toma la id del Departamento seleccionado y hace la lista de sus Ciudades para el select
  cargarCiudades(departamentoSeleccionado): void {
    // this.ciudadService.listaCiudades().subscribe(ciuda=>{
      this.ciudadService.obtenerCiudadId(departamentoSeleccionado.id).subscribe(ciudad => {
      this.ciudades = ciudad;
     });
  }



// Carga Clientes por Ciudad: con la id de la Ciudad obtengo todos los clientes de la ciudad seleccionada y la dibijo en una tabla.
 cargarClientesPorciudadId(id) {
   this.clienteService.obtenerClentesCiudadId(id).subscribe(clienteciudad => {
     this.cliente = clienteciudad; // Dibuja ciudad en la tabla
   });
 }




 // Ejecuta el metodo eliminar cliente, retorna- nada
  delete(cliente: Cliente): void {
    this.clienteService.delete(cliente.id).subscribe( respuesta => {
      //  this.cliente = this.cliente.filter( cli => cli !== cliente )
       this.listarPaginado();
    });
  }
/*
  delete (cliente: Cliente):void{
    const swalWithBootstrapButtons = swal.mixin({
    customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
    title: 'Estas seguro?',
    text: `¿Seguro que desea eliminar al cliente? ${cliente.nombres} ${cliente.apellidos}`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Si, eliminar!',
    cancelButtonText: 'No, cancelar!',
    reverseButtons: true
     })
    .then((result) => {
    if (result.value) {
    this.clienteService.delete(cliente.id).subscribe(
    response =>{
    this.cliente = this.cliente.filter(cli=> cli !==cliente)//filtrar que no muestre el cliente que acabamos de eliminar
    swalWithBootstrapButtons.fire(
      'Cliente Eliminado!',
      `Cliente ${cliente.nombres} eliminado con éxito.`,
      'success'
                                  )
                }
                                                    )
                      }
    })
    }*/


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
  const referenciaVentanaModal = this.ventanaModal.open(FormClientesComponent,
    {
      width: '60%',
      height: '85%',
      position: {left: '30%', top: '60px'}
    });
  referenciaVentanaModal.afterClosed().subscribe( resultado => {
      // no hay resultados cuando se cancela la operación (se cierra la ventana modal)
      if (resultado != null) {
          // el resultado es el cliente que se ha llenado en el formulario
          this.cli = resultado;
          this.crearCliente();
      }
    });
  }

/*
  Este método ejecuta el service que inserta un cliente (el que se ha llenado en el formulario)
  y redirecciona a la lista de clientes. Finalmente lanza una alerta (usando SweetAlert)
  - Parámetros: ninguno
  - Retorna: nada
*/
  public crearCliente(): void {

    this.clienteService.crearCliente(this.cli)
    .subscribe(response => {// Sube a la base de datos
      swal.fire('Nuevo cliente', `Cliente ${this.cli.nombres} creado con exito!`, 'success');
      this.paginaActual = 0;
      this.listarPaginado();
    }
    );
  }

  /* editar proveedor*/
abrirVentanaEditarCliente(idCliente): void {
  const referenciaVentanaModal = this.ventanaModal.open(FormClientesComponent, {
    width: '60%',
    height: '85%',
    position: {left: '30%', top: '60px'},
    data: idCliente
  });
  referenciaVentanaModal.afterClosed().subscribe( resultado => {
    this.cli = resultado;
    this.actualizarCliente();
  });
}

/*
      Este método ejecuta el service que actualiza el cliente (no nulo) y luego redirecciona
      al listado de clientes. Finalmente lanza una alerta (usando SweetAlert)
      - Parámetros: ninguno
      - Retorna: nada
*/
  actualizarCliente(): void {
    this.clienteService.update(this.cli)
    .subscribe(respuesta => {
      this.listarPaginado();
      swal.fire('Cliente Actializado', `Cliente ${this.cli.nombres} actualizado con éxito!`, 'success')
    });
  }

/*
  La función abrirVentanaVer() permite abrir una ventana modal la cual carga la vista
  donde se observa el detalle del proveedor seleccionado
*/

abrirVentanaVer(idCliente): void {
  this.ventanaModal.open(DetalleClienteComponent, {
    width: '60%',
    height: '86%',
    position: {left: '30%', top: '60px'},
    data: idCliente
  });
}

}
