import { Component, OnInit, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-detalle-cliente',
  templateUrl: './detalle-cliente.component.html'
})
export class DetalleClienteComponent implements OnInit {

  cliente: Cliente;
  // Titulos de cada Columna
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

// Separador de decimales por "."
public FormatoSeparadorDecimal(n): any {
  let sep = n || "."; // Por defecto, el punto como separador decimal
  return n.toLocaleString().split(sep)[0];
 }

/*
    El método cerrarVentana() cierra la ventana modal
  */
 cerrarVentana(): void {
  this.referenciaVentanaModal.close();
}


}
