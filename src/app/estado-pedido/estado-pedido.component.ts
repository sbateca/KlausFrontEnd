import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EstadoPedido } from './estado-pedido';
import { EstadoPedidoService } from './estado-pedido.service';
import { PedidoService } from '../pedido/pedido.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import swal from 'sweetalert2';

@Component({
  selector: 'app-estado-pedido',
  templateUrl: './estado-pedido.component.html',
  styleUrls: ['./estado-pedido.component.css']
})
export class EstadoPedidoComponent implements OnInit {

  public camposFormularioDatoAdicionalEstado: FormGroup;
  public estadoPedido = new EstadoPedido();
  public listaEstadoPedidos: EstadoPedido[];
  public estado = '';
  public listaEstadoPedido = ['Alistamiento', 'En Camino', 'Entregado', 'Devuelto En Camino', 'Devuelto Entregado'];

  public columnasTabla = ['fechaRegistro', 'horaRegistro', 'Estado'];
  datos: MatTableDataSource<EstadoPedido>;


  constructor(private constructorFormulario: FormBuilder,
    private pedidoService: PedidoService,
    @Inject(MAT_DIALOG_DATA) public idPedido: number,
    private estadoPedidoService: EstadoPedidoService) { }

  ngOnInit(): void {
    this.ObtenerEstadoPedidoPorPedido();
    this.FormularioDatoAdicional();
  }

  FormularioDatoAdicional(){
    this.camposFormularioDatoAdicionalEstado = this.constructorFormulario.group({
      datoAdicional: ['',Validators.required]
    })
  }

  public contador = 0;

  // Se Inserta un nuevo EstadoPedido
  AgregarEstado() {

    // Se obtiene el Pedido
    this.pedidoService.VerPedidoPorId(this.idPedido).subscribe(pedido => {

      swal.fire({
        title: '¿Estas seguro?',
        text: '¿Desea pasar al estado, ' + this.estado + '?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#ad3333',
        cancelButtonText: 'No, cancelar!',
        confirmButtonText: 'Si, pasar!'
      }).then((result) => {

        if (result.value) {

      // Estado
      this.estado = this.listaEstadoPedido[this.contador];   

      console.log(this.estado);

          // Contador o posicion de estados
          this.contador++;

          // Se Llena campo de Estado seleccionado en Estado Pedido
          this.estadoPedido.nombre = this.estado;

          // Se agrega el dato adicional al estado Pedido
          this.estadoPedido.datoAdicional = this.camposFormularioDatoAdicionalEstado.get('datoAdicional').value;
    
          // Se  LLena el campo Pedido en Estado Pedido
          this.estadoPedido.pedido = pedido;

          console.log("Pedido");
          console.log(pedido);
          /* this.pedidoService.ActualizarPedido(pedido).subscribe(r=>{}); */

          // Se agrega este Nuevo Estado
          this.estadoPedidoService.agregarElemento(this.estadoPedido).subscribe(rta => {
            // Se Carga la lista en la tabla
            this.ObtenerEstadoPedidoPorPedido();
          });
          // Se limpia el campo datoAdicional
          this.camposFormularioDatoAdicionalEstado.get('datoAdicional').setValue(null);
        }
      });
    });
   
  }

  public estadoActual;
  // Se obtiene la lista de Estados de Cada Pedido
  ObtenerEstadoPedidoPorPedido() {
    this.estadoPedidoService.ObtenerEstadosPedidosPorPedidos(this.idPedido).subscribe(respuesta => {
      this.listaEstadoPedidos = respuesta;

      // Numero de Vueltas(una vuelta es cuando pasan por todos los estados)
      let n = Number.parseInt((this.listaEstadoPedidos.length / this.listaEstadoPedido.length).toString());
      
      // Contador de posicion de Estado
      this.contador = this.listaEstadoPedidos.length - (n * this.listaEstadoPedido.length);

      this.datos = new MatTableDataSource<EstadoPedido>(this.listaEstadoPedidos)

      /* console.log(this.listaEstadoPedidos); */

      // Se halla el Estado Actual
      if(this.contador == 0 && this.listaEstadoPedidos.length !=0){
        this.estadoActual = this.listaEstadoPedido[this.listaEstadoPedido.length-1];
      } else {
        this.estadoActual = this.listaEstadoPedido[this.contador-1];
      }

      /* console.log("estadoActual: "+this.estadoActual); */
    
      this.estado = this.listaEstadoPedido[this.contador]; 
      /* console.log("estado: "+this.estado); */
      
    });
  }
}

