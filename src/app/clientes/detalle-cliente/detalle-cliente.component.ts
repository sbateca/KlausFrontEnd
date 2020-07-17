import { Component, OnInit, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Ciudad } from '../../ciudades/ciudad';
import { Departamento } from '../../departamentos/departamento';







@Component({
  selector: 'app-detalle-cliente',
  templateUrl: './detalle-cliente.component.html',
  styleUrls: ['./detalle-cliente.component.css']
})
export class DetalleClienteComponent implements OnInit {

  cliente: Cliente;
  // Titulos de cada Columna
   //columnasTabla: string [] = ['id', 'documento','nombres', 'apellidos', 'numero_contacto', 'departamento', 'ciudad', 'direccion', 'correo', 'codigo_postal'];
  columnasTabla: string [] = ['documento'];
  datos: MatTableDataSource<Cliente>;

  constructor( private referenciaVentanaModal: MatDialogRef<DetalleClienteComponent>, // variable de referencia a la ventana modal
              @Inject(MAT_DIALOG_DATA) public idCliente: number,
              public clienteService: ClienteService)// Se inyecta un MAT_DIALOG_DATA idCliente al formulario
            { }

  ngOnInit(): void {
    this.obtenerClientePorID(this.idCliente);
  }
   /*
      El método obtenerProveedorPorID(idProveedor) asigna el proveedor que ha sido obtenido por su id.
      Al suscribirse lo asigna
      Parámetros: el id del proveedor a consultar
  */
 obtenerClientePorID(idcliente): void {
  if (idcliente) {
    this.clienteService.getCliente(idcliente).subscribe(cliente => this.cliente = cliente);
  }
}
/*
    El método cerrarVentana() cierra la ventana modal
  */
 cerrarVentana(): void {
  this.referenciaVentanaModal.close();
}


}
