import { Component, OnInit, ViewChild } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import swal from 'sweetalert2';
import { Ciudad } from '../ciudades/ciudad';
import { CiudadService } from '../ciudades/ciudad.service';
import { DepartamentoService } from '../departamentos/departamento.service';
import { Departamento } from '../departamentos/departamento';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
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

  totalRegistros = 0;
  totalPorPaginas = 5;
  paginaActual = 0;
  pageSizeOptions : number[] = [5, 10, 20, 30, 50, 100];
  @ViewChild(MatPaginator) paginator:MatPaginator;

  constructor(public clienteService:ClienteService,
              public ciudadService:CiudadService,
              public departamentoservice:DepartamentoService ) { }

  ngOnInit() {
    this.clienteService.getClientes().subscribe(
      cliente=>{
        this.cliente=cliente;//Actualiza listado
        console.log(this.cliente);
      }
    );
   this.listarPaginado();
   this.cargarDepartamentos();

  
  } 
  listarPaginado(){
    //const paginaActual = this.paginaActual+'';
    //const totalPorPaginas = this.totalPorPaginas+'';
    this.clienteService.listarClientesPaginado(this.paginaActual.toString(), this.totalPorPaginas.toString())
    .subscribe(paginacion =>{
      this.cliente = paginacion.content as Cliente[];
      this.totalRegistros = paginacion.totalElements as number;
      this.paginator._intl.itemsPerPageLabel= 'Registros por página:'
    });
  }
  paginar(event:PageEvent):void{
    this.paginaActual = event.pageIndex;
    this.totalPorPaginas = event.pageSize;
    this.listarPaginado();
  }
  cargarDepartamentos():void{
    this.departamentoservice.obtenerDepartamentos().subscribe(departa=>{
      this.deparatamentos=departa;
    })

  }

  cargarCiudades(departamentoSeleccionado):void{
    //this.ciudadService.listaCiudades().subscribe(ciuda=>{
      this.ciudadService.obtenerCiudadId(departamentoSeleccionado.id).subscribe(ciuda=>{
      this.ciudad=ciuda;
     });
  }
  
 cargarClientesPorciudadId(id){
   console.log(id);
   this.clienteService.obtenerClentesCiudadId(id).subscribe(clienteciudad=>{
     this.client=clienteciudad;
     //console.log(this.client);
   });
 }
  
  delete (cliente : Cliente) : void{
    this.clienteService.delete(cliente.id).subscribe( respuesta => {
      //this.cliente = this.cliente.filter( cli => cli !== cliente )
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
