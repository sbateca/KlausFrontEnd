import { Component, Inject, OnInit } from '@angular/core';
import { Pedido } from '../pedido';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Cliente } from '../../../../angularklausLeather/src/app/clientes/cliente';
import { ClienteService } from '../../../../angularklausLeather/src/app/clientes/cliente.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PedidoService } from '../pedido.service';


@Component({
  selector: 'app-form-pedido',
  templateUrl: './form-pedido.component.html',
  styleUrls: ['./form-pedido.component.css']
})
export class FormPedidoComponent implements OnInit {

  public pedido: Pedido;
  public camposFormulario: FormGroup;
  public listaClientes: Cliente[];

  constructor(@Inject(MAT_DIALOG_DATA) private idPedido: number,
              private pedidoService: PedidoService,
              private constructorFormulario: FormBuilder,
              private clienteService: ClienteService,
              private referenciaVentanaModal: MatDialogRef<FormPedidoComponent>) { }

  ngOnInit(): void {
    this.CargarPedido();
    this.CargarCliente();
    this.Crearformulario();
  }

  // Crea El formulario
  Crearformulario(): void {
    this.camposFormulario = this.constructorFormulario.group(
      {
        fechaPedido: ['', Validators.required],
        horaPedido: ['', Validators.required],
        valorIva: ['', Validators.required],
        valorFinalVenta: ['', Validators.required],
        observaciones: ['', Validators.required],
        cliente: ['', Validators.required]
      });
  }

  // Carga pedido
  CargarPedido(): void {
    if  (this.idPedido) {
      this.pedidoService.VerPedidoPorId(this.idPedido).subscribe(pedido => {
        this.pedido = pedido;
        this.camposFormulario.setValue({
          "fechaPedido": this.pedido.fechaPedido,
          "horaPedido": this.ConvierteElFormato24a12Horas(this.pedido.horaPedido),
          "valorIva": this.pedido.valorIva,
          "valorFinalVenta": this.pedido.valorFinalVenta,
          "observaciones": this.pedido.observaciones,
          "cliente": this.pedido.cliente
        });
      });
    }
  }


public ConvierteElFormato24a12Horas(TiempoFormato24H): string {
    let TiempoArray = TiempoFormato24H.split(":");
    TiempoArray.splice(2, 1); // Elimina un elemento desde 2, segundos
    let TiempoEn12H = "";
    if ( parseInt (TiempoArray[0]) <= 12) {
      TiempoEn12H +=  TiempoArray[0] + ":" + TiempoArray[1] + " AM";
    }
    else {
      var NuevaHora = (TiempoArray[0] - 12) + "";
      if (parseInt(NuevaHora) < 10) {
        NuevaHora = "0" + NuevaHora;
      }
      TiempoEn12H = NuevaHora + ":" + TiempoArray[1];
      TiempoEn12H += " PM";
    }
    return TiempoEn12H;
  }

  //  Compara el Cliente
  compararCliente( c1: Cliente, c2: Cliente): boolean {

     if (c1 === undefined && c2 === undefined) { // a1, a2  identico undefined
      return true;
     }

     return ( c1 === null || c2 === null || c1 === undefined || c2 === undefined )
    ? false : c1.id === c2.id;
  }

  // Se Carga el cliente
  CargarCliente(): void {
    this.clienteService.getClientes().subscribe(clientes => {
      this.listaClientes = clientes;
    });
  }

  // Cancela el formularioy sale del mismo
  CancelarOperacion(): void {
    this.referenciaVentanaModal.close();
  }

  // Enviar Formulario
  EnviarFormulario() {
    if (this.camposFormulario.invalid) {
      return this.camposFormulario.markAllAsTouched();
    } else {
      this.referenciaVentanaModal.close(this.camposFormulario.value);
    }
  }
}
