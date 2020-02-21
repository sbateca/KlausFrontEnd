import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';//implementamos

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormClientesComponent implements OnInit {

  private cliente:Cliente =new Cliente();
  private titulo:string = "Crear cliente";
  constructor(private clienteService:ClienteService,
              private router:Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.cargarCliente();
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
    .subscribe(response=>{
      this.router.navigate(['/clientes'])
       //swal.fire('Nuevo cliente', `Cliente ${this.cliente.nombres} creado con exito!`, 'success')
     }
    );
  }
  update():void{
    this.clienteService.update(this.cliente)
    .subscribe(cliente=>{
      this.router.navigate(['/clientes'])
      swal.fire('Cliente Actializado', `Cliente ${this.cliente.nombres} actualizado con éxito!`,'success')
    })
  }
}
