import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import swal from 'sweetalert2';
import { Ciudad } from '../ciudades/ciudad';
import { CiudadService } from '../ciudades/ciudad.service';
import { DepartamentoService } from '../departamentos/departamento.service';
import { Departamento } from '../departamentos/departamento';


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
   //this.cargarCiudades(5);  
   this.cargarDepartamentos();
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
      this.cliente = this.cliente.filter( cli => cli !== cliente )
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
