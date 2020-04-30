import { Component, OnInit, ViewChild } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import swal from 'sweetalert2';
import { Ciudad } from '../ciudades/ciudad';
import { CiudadService } from '../ciudades/ciudad.service';
import { DepartamentoService } from '../departamentos/departamento.service';
import { Departamento } from '../departamentos/departamento';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  public cliente: Cliente[];
  public ciudad: Ciudad[];
  public deparatamentos: Departamento[];
  public client: Cliente[];
  public idSelec: Number;
  public departametoSelec: Departamento;

  // Variables con valores iniciales para el paginador
  totalRegistros = 0;
  totalPorPaginas = 5;
  paginaActual = 0;
  pageSizeOptions : number[] = [5, 10, 20, 30, 50, 100];
  @ViewChild(MatPaginator, {static: true}) paginator:MatPaginator;

  // Titulos de cada Columna
  columnasTable: string[] = ['id', 'documento', 'nombres', 'apellidos', 'numero_contacto', 'departamento', 'ciudad', 'direccion', 'correo', 'codigo_postal', 'acciones'];
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

// Intanciamos
  constructor(public clienteService: ClienteService,
              public ciudadService: CiudadService,
              public departamentoservice: DepartamentoService ) { }

// Al inicializar el componente se ejecuta listar Cliente y Paginador, cargar Departamentos        
  ngOnInit() {
    this.clienteService.getClientes().subscribe(
      cliente => {
        this.cliente = cliente; // Actualiza listado
        console.log(this.cliente);
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


// Listar paginado : Realiza el get deacuerdo alos valores actualizados

listarPaginado() {
    this.clienteService.listarClientesPaginado(this.paginaActual.toString(), this.totalPorPaginas.toString())
    .subscribe(paginacion =>{
      // Se extrae el contenido Json paginador
     // this.cliente = paginacion.content as Cliente[]; // Arreglo de cliente
      this.totalRegistros = paginacion.totalElements as number; // Cantidad de registros
      this.paginator._intl.itemsPerPageLabel = 'Registros por página:';
      console.log(this.paginator._intl);

      // Para utilizar la Tabla en Angular Material
      // Organiza la la informacion en MatTableDataSource para usar los componentes de Angular
      this.datos = new MatTableDataSource<Cliente>(this.cliente);
      this.datos.paginator = this.paginator;
    });
  }

  // Realiza el control de la paginacion.
  // Cada vez que se seleccione un boton del paginador se actualizan los valores
  // PageEvent--> El evento de tipo PageEvent
  paginar(event: PageEvent): void {
    this.paginaActual = event.pageIndex;
    this.totalPorPaginas = event.pageSize;
    this.totalRegistros = event.length;
    console.log(event);
    this.listarPaginado();
  }

  // Cargar Departamento, carga los Departamentos para el select. 
  cargarDepartamentos(): void {
    this.departamentoservice.obtenerDepartamentos().subscribe(departa => {
      this.deparatamentos = departa; //
    });
  }

  // Cargar Ciudades por Departamentos. 
  // Toma la id del Departamento seleccionado y hace la lista de sus Ciudades para el select
  cargarCiudades(departamentoSeleccionado): void {
    // this.ciudadService.listaCiudades().subscribe(ciuda=>{
      this.ciudadService.obtenerCiudadId(departamentoSeleccionado.id).subscribe(ciuda => {
      this.ciudad = ciuda;
     });
  }

// Carga Clientes por Ciudad: con la id de la Ciudad obtengo todos los clientes de la ciudad seleccionada y la dibijo en una tabla.
 cargarClientesPorciudadId(id) {
   // console.log(id);
   this.clienteService.obtenerClentesCiudadId(id).subscribe(clienteciudad => {
     this.client = clienteciudad; // Dibuja ciudad en la tabla
     // console.log(this.client);
   });
 }



 // Ejecuta el metodo eliminar cliente, retorna- nada
  delete(cliente: Cliente): void {
    this.clienteService.delete(cliente.id).subscribe( respuesta => {
      //  this.cliente = this.cliente.filter( cli => cli !== cliente )
      this.listarPaginado();
    })
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
  }
