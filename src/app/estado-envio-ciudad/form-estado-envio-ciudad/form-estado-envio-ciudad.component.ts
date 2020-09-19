import { Component, OnInit } from '@angular/core';
import { EstadoEnvioCiudad } from '../estado-envio-ciudad';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Pedido } from '../../pedido/pedido';
import { Enviociudad } from '../../enviociudad/Enviociudad';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-form-estado-envio-ciudad',
  templateUrl: './form-estado-envio-ciudad.component.html',
  styleUrls: ['./form-estado-envio-ciudad.component.css']
})
export class FormEstadoEnvioCiudadComponent implements OnInit {

  public estadoEnvioCiudad: EstadoEnvioCiudad;
  public camposFormulario: FormGroup;
  public listaPedidos: Pedido[];
  public listaEnvioCiudades: Enviociudad;
  constructor(private constructorFormulario: FormBuilder,
    private referenciaVentanaModal: MatDialogRef<FormEstadoEnvioCiudadComponent>) { }

  ngOnInit(): void {
  }

  // Crear Formulario Estado Envío Ciudad
  CrearFormulario(): void {
    this.camposFormulario = this.constructorFormulario.group(
      {
        fechaRegistro: ['', Validators.required],
        fechaEnvio: ['', Validators.required],
        entrega: ['', Validators.required],
        numeroGuia: ['', Validators.required],
        estadoEnvio: ['', Validators.required],
        archivoAdjunto: ['', Validators],
        observaciones: ['', Validators.required],
        Pedido: ['', Validators.required],
        envioCiudad: ['', Validators.required]
      }
    );
  }
  compararPedido( p1: Pedido, p2: Pedido): boolean {

    if (p1 === undefined && p2 === undefined) { // a1, a2  identico undefined
      return true;
    }

    return ( p1 === null || p2 === null || p1 === undefined || p2 === undefined )
    ? false : p1.id === p2.id;
  }

  compararEnvioCiudad( ec1: Enviociudad, ec2: Enviociudad): boolean {

    if (ec1 === undefined && ec2 === undefined) { // a1, a2  identico undefined
      return true;
    }

    return ( ec1 === null || ec2 === null || ec1 === undefined || ec2 === undefined )
    ? false : ec1.id === ec2.id;
  }

  cancelarOperacion(): void {
    this.referenciaVentanaModal.close();
  }

}
