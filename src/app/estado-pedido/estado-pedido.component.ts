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
  public estadoNuevo = '';
  public listaEstadoPedido = ['Alistamiento', 'En Camino', 'Entregado', 'Devuelto En Camino', 'Devuelto Entregado'];

  public columnasTabla = ['fechaRegistro', 'horaRegistro', 'Estado'];
  datos: MatTableDataSource<EstadoPedido>;
  finEstado=false;

  constructor(private constructorFormulario: FormBuilder,
              private pedidoService: PedidoService,
              private referenciaVentanaModal: MatDialogRef<EstadoPedidoComponent>,
              @Inject(MAT_DIALOG_DATA) public idPedido: number,
              private estadoPedidoService: EstadoPedidoService) { }

  ngOnInit(): void {
    this.ObtenerEstadoPedidoPorPedido();
    this.FormularioDatoAdicional();
  }

  // checkbox verdadero bloquea finaliza el proceso
  FinProceso(evento){
    this.finEstado = evento;
  }
  Fin(){
    this.finEstado = true;
  }
  // Formulario Dato Adicional 
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
        text: '¿Desea pasar al estado, ' + this.estadoNuevo + '?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#ad3333',
        cancelButtonText: 'No, cancelar!',
        confirmButtonText: 'Si, pasar!'
      }).then((result) => {

        if (result.value) {

      // Estado
      this.estadoNuevo = this.listaEstadoPedido[this.contador];   

      console.log(this.estadoNuevo);

          // Contador o posicion de estados
          this.contador++;

          // Se Llena campo de Estado seleccionado en Estado Pedido
          this.estadoPedido.nombre = this.estadoNuevo;

          // Se agrega el dato adicional al estado Pedido
          this.estadoPedido.datoAdicional = this.camposFormularioDatoAdicionalEstado.get('datoAdicional').value;

          // si se  marco que ya el pedido fue finalizo
          if(this.finEstado){
             // Proceso estado pedido finalizado verdadero en el campo estado pedido
             this.estadoPedido.finEstado = this.finEstado;
          }
         
    
          // Se  LLena el campo Pedido en Estado Pedido
          this.estadoPedido.pedido = pedido;

          /* console.log("Pedido");
          console.log(pedido); */
          /* this.pedidoService.ActualizarPedido(pedido).subscribe(r=>{}); */

          // Se agrega este Nuevo Estado
          this.estadoPedidoService.agregarElemento(this.estadoPedido).subscribe(rta => {
            // Se Carga los cambios a la lista en la tabla en tiempo real
            this.ObtenerEstadoPedidoPorPedido();
          });
          // Se limpia el campo datoAdicional
          this.camposFormularioDatoAdicionalEstado.get('datoAdicional').setValue(null);
        }
      });
    });
   
  }

  public estadoActual;
  ultimoEstado;
  // Se obtiene y carga la lista de Estados de un pedido y se consulta el estado actual
  ObtenerEstadoPedidoPorPedido() {
    this.estadoPedidoService.ObtenerEstadosPedidosPorPedidos(this.idPedido).subscribe(respuesta => {
      this.listaEstadoPedidos = respuesta;

      /* console.log(this.listaEstadoPedidos); */

      // si hay estados calcula si el ultimo es el final
      if(this.listaEstadoPedidos.length!=0){
        this.ultimoEstado = this.listaEstadoPedidos[this.listaEstadoPedidos.length-1].finEstado;
      }
        
      // Numero de Vueltas(una vuelta es cuando pasan por todos los estados)
      let n = Number.parseInt((this.listaEstadoPedidos.length / this.listaEstadoPedido.length).toString());
      
      // Se calcula el contador de posicion de Estado para saber el estado actual
      this.contador = this.listaEstadoPedidos.length - (n * this.listaEstadoPedido.length);

      // lista para graficar en la tabla la lista de estados de pedido
      this.datos = new MatTableDataSource<EstadoPedido>(this.listaEstadoPedidos)

      // Se halla el Estado Actual
      if(this.contador == 0 && this.listaEstadoPedidos.length !=0){
        this.estadoActual = this.listaEstadoPedido[this.listaEstadoPedido.length-1];
      } else {
        this.estadoActual = this.listaEstadoPedido[this.contador-1];
      }

      this.estadoNuevo = this.listaEstadoPedido[this.contador]; // estado actual apartir de la lista de estados con la pocision(contador)
     
    });
  }
  // ventana modal cerrada
  cancelarOperacion(): void {
    this.referenciaVentanaModal.close();
  }
}

