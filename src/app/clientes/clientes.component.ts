import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  cliente: Cliente[];
  constructor(private clienteService:ClienteService) { }

  ngOnInit() {
    this.clienteService.getClientes().subscribe(
      cliente=>this.cliente=cliente//Actializa listado
    );
  }
}
