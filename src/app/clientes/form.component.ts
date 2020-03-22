import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';//implementamos
import { DepartamentoService } from '../departamentos/departamento.service';
import { Departamento } from '../departamentos/departamento';
import { Ciudad } from '../ciudades/ciudad';
import { CiudadService } from '../ciudades/ciudad.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  public departamento:Departamento[];
  public cliente:Cliente =new Cliente();
  public ciudad:Ciudad;
  public departamentoseleccionado:Departamento; 
  private titulo:string = "Crear cliente";
  constructor(private clienteService:ClienteService,
              private router:Router,
              private activatedRoute: ActivatedRoute,
              private departamentoService:DepartamentoService,
              private ciudadSrvice:CiudadService) { }

  ngOnInit() {
    this.cargarCliente();
    this.getDept();
    console.log(this.cliente);
   }
 getDept():void{
    this.departamentoService.obtenerDepartamentos().subscribe(dpto=>{
      this.departamento=dpto;//Actualiza listado
    },
    error=>{
      console.log('Error al listar los usuarios desde el servidor')
    }
  );
}
 
 cargarCiudadDeptId(departamentoseleccionado):void{
    this.ciudadSrvice.obtenerCiudadId(departamentoseleccionado.id).subscribe(ciud=>{
      this.ciudad=ciud;
      this.cliente.departamento=departamentoseleccionado.nombre;
    });
  }

  cargarCliente():void{
    this.activatedRoute.params.subscribe(params=>{
      let id = params['id']
      if(id){
        this.clienteService.getCliente(id).subscribe((cliente)=>this.cliente=cliente)
    }
    })
  }
  public create():void {
    this.clienteService.create(this.cliente)
    .subscribe(response=>{//Sube a la base de datos
      this.router.navigate(['/clientes'])//vamos a la clientes  muestra la tabla
       swal.fire('Nuevo cliente', `Cliente ${this.cliente.nombres} creado con exito!`, 'success')
    }
    );
  }
  update():void{
    this.clienteService.update(this.cliente)
    .subscribe(cliente=>{
      this.router.navigate(['/clientes'])//vamos a cualquier ruta
      swal.fire('Cliente Actializado', `Cliente ${this.cliente.nombres} actualizado con éxito!`,'success')
    })
  }
}
