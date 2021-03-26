
import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { Pedido } from '../pedido';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Cliente } from '../../clientes/cliente';
import { ClienteService } from '../../clientes/cliente.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { PedidoService } from '../pedido.service';
import { BodegaInventarioService } from '../../bodega-inventario/bodega-inventario.service';
import { BodegaInventario } from '../../bodega-inventario/bodega-inventario';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Producto } from '../../productos/producto';
import { TipoTalla } from '../../tiposTallas/TipoTalla';
import { Talla } from '../../tallas/talla';
import { ProductoService } from '../../productos/producto.service';
import { TallaService } from '../../tallas/talla.service';
import { MatSelectChange } from '@angular/material/select';
import { DepartamentoService } from '../../departamentos/departamento.service';
import { Departamento } from '../../departamentos/departamento';
import { Ciudad } from '../../ciudades/ciudad';
import { CiudadService } from '../../ciudades/ciudad.service';
import { EmpresaTransportadoraService } from '../../EmpresaTransportadora/empresa-transportadora.service';
import { EmpresaTransportadora } from '../../EmpresaTransportadora/empresa-transportadora';
import { TipoenviosService } from '../../tipoenvios/tipoenvios.service';
import { TipoEnvio } from '../../tipoenvios/tipoenvios';
import { EnviociudadService } from '../../enviociudad/enviociudad.service';
import { Enviociudad } from '../../enviociudad/Enviociudad';
import { FormClientesComponent } from '../../clientes/form.component';
import swal from 'sweetalert2';
import {QrScannerComponent} from 'angular2-qrscanner';
import { ScannearPedidoComponent } from '../scannear-pedido/scannear-pedido.component';
/* declare  var  jQuery: any;
declare var $: any;
 */

@Component({
  selector: 'app-form-pedido',
  templateUrl: './form-pedido.component.html',
  styleUrls: ['./form-pedido.component.css']
})
export class FormPedidoComponent implements OnInit {

  @ViewChild(QrScannerComponent, {static: false}) qrScannerComponent: QrScannerComponent ;

  public pedido = new Pedido();
  public camposFormulario: FormGroup;
  public camposFormularioEnvio: FormGroup;
  public listaClientes: Cliente[];
  public listaBodegaInventario: BodegaInventario[];
  public bodegaInventario: BodegaInventario;
  public listaCotizacion: FormArray;
  public listaProductos: Producto[];
  public listaTipoTalla: TipoTalla[];
  public listaTalla: Talla[];
  public tallaEliminada: Talla;
  public listaTalla1 = new Array<Talla>();
  public eventoTipoTalla: MatSelectChange;
  public eventoInput = 0;
  public indice = 0;
  public importe = 0;
  public contador = 0;
  public desactivado = true;
  public contador1 = new Array();
  public listaDepartamentos: Departamento[];
  public listaCiudadesPorDep: Ciudad[];
  public listaEmpresaTransportadora: EmpresaTransportadora[];
  public listaTipoEnvio: TipoEnvio[];
  public listaEnvioCiudad: Enviociudad[];
  public contadorIguales = 0;
  public envioCiudad = new Enviociudad();

  elementoInput;
  
  constructor(@Inject(MAT_DIALOG_DATA) private idPedido: number,
              public ventanaModalScanner: MatDialog,
              public  ventanaModalFormCliente: MatDialog,
              private pedidoService: PedidoService,
              private constructorFormulario: FormBuilder,
              private clienteService: ClienteService,
              private alertaSnackBar: MatSnackBar,
              private bodegaInventarioService: BodegaInventarioService,
              private productoService: ProductoService,
              private tallaService: TallaService,
              private departamentoService: DepartamentoService,
              private ciudadService: CiudadService,
              private tipoEnvioService: TipoenviosService,
              private envioCiudadService: EnviociudadService,
              private empresaTransportadoraService: EmpresaTransportadoraService,
              private changeRef: ChangeDetectorRef,
              private referenciaVentanaModal: MatDialogRef<FormPedidoComponent>) { }

  ngOnInit(): void {
    this.ListarClientes();
    this.CargarBodegaInventario();
    this.CargarProducto();
    this.ObtenerListaTipoEnvio();
    this.ObtenerListaDepartamento();
    this.ObtenerListaEmpresaTransportadora();
    this.CrearFormularioEnvio();
    this.CrearFormulario();
    this.CargarPedido();  
  }

// Quito el error ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. Previous value: 'true'. Current value: 'false'.
ngAfterViewChecked(): void { 
  this.changeRef.detectChanges(); 

}

// Apenas se digite algo en documento se quita la seleccion del cliente que hay
EventoDocumento(eventoDocumento){
  /* console.log("evento Documento: ");
  console.log(eventoDocumento); */
  if(eventoDocumento != null) {
    this.camposFormulario.get('cliente').setValue('');
  }
}

public activaScannerContinuo: boolean;
// Se escanea de forma continia
ScanneaContinuamenteCodigosQR(eventoCheckboxQR){

  // Validacion Debe llenar en orden Cliente, Observacion
  if(this.camposFormulario.get('cliente').value != '' && this.camposFormulario.get('observaciones').value != '' ) {
    if(eventoCheckboxQR){
      // Abre la ventana modal de scaner QR
      this.ScanneaCodigosQR();
    }
    this.activaScannerContinuo = eventoCheckboxQR;
  } else {
    // Se pone activaScannerContinuo en false
    this.camposFormulario.get('activaScannerContinuo').setValue(false);
      this.alertaSnackBar.open(' Debe llenar en orden Cliente, Observacion!!', 'Cerrar', {
        duration: 8000
      });
    }
}

 // Abrir Ventana Modal De Scanear
 ScanneaCodigosQR(): void {

  // Validacion Debe llenar en orden Cliente, Observacion
  if(this.camposFormulario.get('cliente').value != '' && this.camposFormulario.get('observaciones').value != '' ) {

    // Se Abre la ventana modal se escaneo de codigo QR
    const referenciaVentanaModal = this.ventanaModalScanner.open(ScannearPedidoComponent,
      {
        width: '45%',
        height: '25',
        position: { left: '30%', top: '60px' }
      });
    referenciaVentanaModal.afterClosed().subscribe(referenciaProducto => {

      if (referenciaProducto != null) {
    
        // Se carga el input con la referencia scanneada por QR
        this.camposFormulario.get('referencia').setValue(referenciaProducto);
        // Se selecciona automaticamente los select de Producto-Talla por referencia QR
        this.BuscarReferenciaInventario();
      }
    });

  } else {
    this.alertaSnackBar.open(' Debe llenar en orden Cliente, Observacion!!', 'Cerrar', {
      duration: 8000
    });
  }
}

// Cuando se empieza a escribir algo en el input limpia el select de Talla
EventoReferencia(event){
  
  if(this.camposFormulario.get('referencia').value !== 0){

    // Se limpia el campo talla en el formulario
    this.camposFormulario.get('talla').setValue('');
  }
}

// Buscador de Producto-Talla por referencia
BuscarReferenciaInventario(){

  if(this.camposFormulario.get('cliente').value != '' && this.camposFormulario.get('observaciones').value != '' ) {

   
    let referencia = this.camposFormulario.get('referencia').value;

  // obtenemos la Bodega Inventario del backend por su referencia
  this.bodegaInventarioService.ObtenerBodegaInventarioPorReferencia(referencia).subscribe(bodegaInventarioFiltrado => {

    

    if(bodegaInventarioFiltrado!=null){

      let productoBD: Producto =  bodegaInventarioFiltrado.producto;
      let tallaPorRef: Talla =  bodegaInventarioFiltrado.talla;
      let talla: Talla = null;
      
      // Se busca en la lista de select el Producto de la consulta por referencia
      this.listaProductos.forEach(elementoProducto=>{
        if(elementoProducto.id == productoBD.id){
          productoBD=elementoProducto;
        }
      });

      // Lista de tallas dependiendo de producto
      this.tallaService.ObtenerTallasPorProductoEnBodega( bodegaInventarioFiltrado.producto.id).subscribe( tallas => {

        // Lista Talla de Bodega Inventario
        this.listaTalla = tallas;

        // Se Sustrae la talla ya agregada en cotizacion de la listaTallas en el Select
        this.SustraeTallaAgregadaEnLista();

        // Se busca en la lista Tallas de select la Talla de la consulta por referencia
        this.listaTalla.forEach(tallaSelect => {
          if(tallaSelect.id == tallaPorRef.id){
            talla=tallaSelect;
          }
        });

        // Si la referencia ya Fue agregada talla es null
        if(talla === null) {
          // Cuando ya esta agregada esta referencia en la factura deja cargado lo que tiene
          this.camposFormulario.get('referencia').setValue(this.camposFormulario.get('referencia').value);
          this.alertaSnackBar.open('La Referencia '+ referencia +' ya fue agregada a la factura!!', 'Cerrar', {
            duration: 8000
          });
        }else {
          // Cuando no esta agregada esta referencia en la factura se limpia el input de referencia y carga cantidad=1 por defecto
          this.camposFormulario.get('referencia').setValue('');
          // Para el primer producto scaneado se le carga una cantidad '' para obligar a colocar una cantidad y dar enter
          if(this.listaCotizacion == null){
            this.camposFormulario.get('cantidad').setValue('');
          } else {
            this.camposFormulario.get('cantidad').setValue(1);
          }
        }

        // Se cargan los siguentes campos del formulario automaticamente
        this.camposFormulario.get('producto').setValue(productoBD);
        this.camposFormulario.get('talla').setValue(talla)
        
        // Toma el el indice de la talla seleccionada
        this.indice = this.listaTalla.indexOf(talla);
    });
    } else {
      // Cuando esta referencia no existe en bodega en la factura deja cargado lo que tiene 
      this.camposFormulario.get('referencia').setValue(this.camposFormulario.get('referencia').value);
      this.alertaSnackBar.open('La Referencia '+ referencia +' no existe en Bodega-Inventario!!', 'Cerrar', {
        duration: 8000
      });
    }
  });
  } else {
    this.alertaSnackBar.open(' Debe llenar en orden Cliente, Observacion!!', 'Cerrar', {
      duration: 8000
    });
  }
  
}

// Se Aplica la consulta de Cliente Por Documento
BuscarAgregarCliente(){
  let documento = this.camposFormulario.get('documento').value;
  
  this.clienteService.ObtenerClientePorDocumento(documento).subscribe( clienteFiltrado => {

    if(clienteFiltrado!=null){     
      
      // Se selecciona el cliente automaticamente llenando el input Documento
      this.camposFormulario.get('cliente').setValue(clienteFiltrado);
     
    } else {

      swal.fire({
        title: '¡Este Cliente no existe!',
        text: '¿Desea Agregar un cliente nuevo?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#ad3333',
        cancelButtonText: 'No, cancelar!',
        confirmButtonText: 'Si, agregar!'
      }).then((result) => {
  
          if (result.value) {
  
            // Formulario Cliente
            this.AbrirVentanaModalFormCliente();
  
           
          }
      });
    }
   });
}

// Ventana Modal de -Formulario Cliente
AbrirVentanaModalFormCliente(): void {
    const referenciaVentanaModal = this.ventanaModalFormCliente.open(FormClientesComponent,
      {
        width: '50%',
        height: '70%',
        position: { left: '30%', top: '60px' },
        data: [this.camposFormulario.get('documento').value, true] // Se envia a FormClientes un array con el documento y un true(Representando a Pedido)
      });
    referenciaVentanaModal.afterClosed().subscribe(cliente => {

      if (cliente != null) {
        
        // Se crea el cliente con la información del Formulario
        this.clienteService.crearCliente(cliente).subscribe( Cliente => {
          
          // Se listan los clientes para que tener el selec de clientes actualizado
          this.ListarClientes();

          // Se carga el input(documento) con el documento del nuevo cliente
          this.camposFormulario.get('documento').setValue(cliente.documento);
        });

        // Se muestra mensaje de se crea cliente nuevo
        swal.fire('Cliente Creado', `Cliente ${cliente.nombres} creado con éxito!`, 'success');
        
       
       
        // Se obtiene el cliente por documento y se carga el mismo en el select del formulario
        this.clienteService.ObtenerClientePorDocumento(cliente.documento).subscribe( clienteFiltrado => {

          if(clienteFiltrado!=null){     
            
            // Se selecciona el cliente automaticamente llenando el input Documento
            this.camposFormulario.get('cliente').setValue(clienteFiltrado);
          }
        });
          
      }
    });
}
// Se Carga el cliente
ListarClientes(): void {
  this.clienteService.getClientes().subscribe(clientes => {
    this.listaClientes = clientes;
  });
}

paginaActual = 0;
totalPorPaginas = 200; 

// Cargar Producto
CargarProducto(): void {  
  this.productoService.ListarProductosBodegaInventario(this.paginaActual.toString(), this.totalPorPaginas.toString()).subscribe( respuesta =>{ 
    // Lista Productos de Bodega Inventario
    this.listaProductos = respuesta.content;
  });
}
// CargarTallas
CargarTallas(id): void {
  
  this.tallaService.ObtenerTallasPorProductoEnBodega(id).subscribe( resultado => {
    // Lista Talla DE Bodega Inventario
    this.listaTalla = resultado;

    // Se va sacando la talla que ya ha sido agregada
    this.SustraeTallaAgregadaEnLista();
  });
}

// Se va sacando la talla que ya ha sido agregada
SustraeTallaAgregadaEnLista(){
  let contador2 = 0;
  let contador3 = 0;
  if (this.listaCotizacion != undefined) {

    
    this.listaCotizacion.value.forEach( (elementoCotizacion, index) => {
       
        this.listaTalla.forEach ( (elementoTalla, j) => {

          
          // Para iniciarlo en cero la primera y unica vez
          if (index < 1)  { 
            this.contador1[j] = 0;
          }
         
          // Con id por que la lista talla tiene la estructura diferente
          /* if(this.eventoProducto.value.id == elementoCotizacion.bodegaInventario.producto.id ){ */
          if(this.camposFormulario.get('producto').value.id == elementoCotizacion.bodegaInventario.producto.id ){
          
            if(elementoTalla.id != elementoCotizacion.bodegaInventario.talla.id){
              // Cuenta las tallas si no se selecciona del mismo Producto 
              this.contador1[j] ++;       
            }  else {// Si es igual la talla de la lista con la talla de cotizacion
                contador3++;
                if(contador3 == this.listaTalla.length){
                  this.listaTalla=[];
                  this.alertaSnackBar.open('Ya se selecciono toda la lista de Tallas de '+ elementoCotizacion.bodegaInventario.producto.nombre +' '+elementoCotizacion.bodegaInventario.producto.referencia+'!!', 'Cerrar', {
                    duration: 8000
                  });
                }
            } 
          } else {// Si No es el producto se suma la talla tampoco se selecciona
              this.contador1[j] ++;             
          }

          // Si la cantidad de tallas sin seleccionar es igual a la longitud de la lista cotizada, 
          // Las tallas sin seleccionar es (elementoTalla)
          if (this.listaCotizacion.length === this.contador1[j]) {  
        
            // Antes de crear o llenar limpio listaTalla1
            if(contador2==0){
              this.listaTalla1=[];
            } 
            contador2++;

            // lleno la lista con los elementos tallas no seleccionada
            this.listaTalla1.push(elementoTalla);
     
            // Se asigna(listaTalla) la lista de tallas sin seleccionar
            this.listaTalla= this.listaTalla1;     
            
          }
     }); 
    });    
  }
}

// Evento Select de Producto
ProductoSeleccionado(evento){
 
  // Se carga Lista de Talla apartir del id del producto de Bodega Inventario
  this.CargarTallas(evento.value.id);
}

// Se Carga el Bodega Inventario
CargarBodegaInventario(): void {
  this.bodegaInventarioService.ListaBodegaInventario().subscribe( bodegaInventarios => {
    this.listaBodegaInventario = bodegaInventarios;
  });
}

// Crea Array Con las Tallas que no se han Seleccionado
CrearArrayConTallasNoSeleccionadas(event): void {

  // Toma el el indice de la talla seleccionada
  this.indice = this.listaTalla.indexOf(event.value);

}

// Se inicializa 
descuentoForm = 0;
precioVentaForm = 0;
cantidadForm = 0;
subTotal = 0;
calculadora = false;

// Calcula Cuenta Pedido y
CalcularCuentaPedido(){
  this.calculadora = true;
  // Valor Descuento
  this.descuentoForm = this.camposFormulario.value.descuento;
  // Valor Cantidad
  this.cantidadForm = this.camposFormulario.value.cantidad;
  
  // Me desplazo por la lista de bodega y se busca el mismo elemento a partir de seleccionar Producto y Talla
  this.listaBodegaInventario.forEach(elementoBodegaInventario => {
   
    if(elementoBodegaInventario.producto.id === (this.camposFormulario.get('producto').value.id)){
      
      if(elementoBodegaInventario.talla.id === (this.camposFormulario.get('talla').value.id)) {

        // Bodega Inventario 
        this.bodegaInventario = elementoBodegaInventario;
        
        // Precio de Venta
        this.precioVentaForm = this.bodegaInventario.producto.precioVenta - (((this.descuentoForm)/100)*(this.bodegaInventario.producto.precioVenta));
        
        // Sub Total
        this.subTotal = this.precioVentaForm * this.cantidadForm;
      }
    } 
  });

  return this.calculadora;
}

EventoTeclado(teclasInputCantidad: KeyboardEvent ){
  /* console.log('teclasInputCantidad');
  console.log(teclasInputCantidad); */
}


// Evento input captura los numeros en value
EventoCantidad(cantidadInput: number): boolean {

  /* console.log('Cantidad');
  console.log(cantidadInput); */

  // Si hay seleccionado una talla
  if(this.camposFormulario.value.talla!=0){


    // Se busca el elemento de Bodega Inventario Seleccionado en el Formulario (this.bodegaInventario)
    this.CalcularCuentaPedido();

    // Siempre que digito una cantidad calculadora se pone false para no mostrar el calculo
    this.calculadora = false;

    // Observa si el valor del input de la cantidad de pedido es menor a la cantidad de producto en Bodega
    if (cantidadInput <= this.bodegaInventario.cantidad  ) {
      // Cero no es valido como cantidad
      if(cantidadInput != 0){
        if (this.bodegaInventario.cantidad === 0) {
          this.alertaSnackBar.open('Debe Agregar unidades de este Producto por que no hay en Bodega!!', 'Cerrar', {
            duration: 8000
          });
          this.desactivado = true;
        } else {
            this.alertaSnackBar.open("Hay " + this.bodegaInventario.cantidad +
            " unidades de este Producto, su Pedido SI se puede hacer efectivo!!", 'Cerrar', {
              duration: 8000
            });
            this.desactivado = false;
        }
      } else {
        this.alertaSnackBar.open("Debe digitar una cantidad, cantidad 0 no es valido!!", 'Cerrar', {
          duration: 8000
        });
        this.desactivado = true;
      }
      
    } else {
        this.alertaSnackBar.open("Hay " + this.bodegaInventario.cantidad +
        " unidades de este Producto, su Pedido NO se puede hacer efectivo!!", 'Cerrar', {
          duration: 8000
        });
        this.desactivado = true;
    }
    return this.desactivado;
  } else {
    this.alertaSnackBar.open("Debe digitar en orden!!", 'Cerrar', { duration: 8000});
  }
}


// Crea El formulario
CrearFormulario(): void {
  this.camposFormulario = this.constructorFormulario.group(
  {
    documento: ['', [Validators.minLength(6), Validators.maxLength(10)]],
    cliente: ['', Validators.required],
    observaciones: ['', Validators.required],
    valorIva: ['19', [Validators.required, Validators.max(19)]],
    descuento: ['0', [Validators.required, Validators.max(100)]],
    activaScannerContinuo: ['false'],
    referencia: [''],
    producto: ['', Validators.required],
    talla: ['', Validators.required],
    cantidad: ['', Validators.required],
    listaCotizacion: this.constructorFormulario.array([]),
   });
}

// Obtener Lista Cotizacion
get ObtenerListaCotizacion() {
  return this.camposFormulario.get('listaCotizacion') as FormArray;
}

// Crea Formulario Lista Cotizacion
CrearListaCotizacion(): FormGroup {

  // Se se utiliza bodega inventario de BD
  this.listaBodegaInventario.forEach(elementoBodegaInventario => {
  if(elementoBodegaInventario.producto.id === (this.camposFormulario.get('producto').value.id)){
    if(elementoBodegaInventario.talla.id === (this.camposFormulario.get('talla').value.id)) {

      // Bodega Inventario 
      this.bodegaInventario = elementoBodegaInventario;
    }
  }
});

 /*  console.log("bodega");
  console.log(this.bodegaInventario); */
  return this.constructorFormulario.group({
    bodegaInventario: this.bodegaInventario,
    cantidad: this.camposFormulario.get("cantidad").value,
    descuento: this.camposFormulario.get("descuento").value
  });
}

// FormularioEnvio
CrearFormularioEnvio(): void {
  this.camposFormularioEnvio = this.constructorFormulario.group({
    tipoEnvio: ['', Validators.required],
    departamento: ['', Validators.required],
    ciudad: ['', Validators.required],
    direccion: ['', Validators.required],
    empresaTransportadora: ['', Validators.required],
    valorEnvio: ['', Validators.required]    
  });
}

// Agrega Cotizacion
AgregarListaCotizacion(): void {
 
  // Ser Crea y se llena lista cotizacion
  this.listaCotizacion = this.camposFormulario.get('listaCotizacion') as FormArray;
  
  this.listaCotizacion.push(this.CrearListaCotizacion());

  // Limpia input
  
  this.camposFormulario.get('descuento').setValue(0);  
  this.camposFormulario.get('talla').setValue(null);
  this.camposFormulario.get('cantidad').setValue(null);

  // Inicializo una vez agrego
  this.precioVentaForm = 0;
  this.subTotal = 0;

  // Utiliza la posicion(indice) del objeto seleccionado y saca el mismo del la lista
  this.listaTalla.splice(this.indice, 1);

  // Importe suma los subtotales de cada pedido
  this.importe = this.importe + (this.camposFormulario.value.listaCotizacion[this.contador].bodegaInventario.producto.precioVenta - (this.camposFormulario.value.listaCotizacion[this.contador].bodegaInventario.producto.precioVenta*this.camposFormulario.value.listaCotizacion[this.contador].descuento/100))*(this.camposFormulario.value.listaCotizacion[this.contador].cantidad);
  this.contador++;

  // Siempre que agrego pongo calculadora en false para no mostrar el calculo
  this.calculadora = false;
 
  // Si se activa scanner continuo
  if(this.activaScannerContinuo == true){
    this.camposFormulario.get('referencia').setValue('');
    // Se abre la ventana modal de scanner
    this.ScanneaCodigosQR();
  }
}



activar = true;
// Enviar Formulario
EnviarFormularioCotizacion() {

  if(this.listaCotizacion == undefined){
    this.activar = false;
  }

  if (this.listaCotizacion == null && this.camposFormulario.invalid === true) {
    this.alertaSnackBar.open('Debe Agregar como minimo un Producto!!', 'Cerrar', {
      duration: 5000
    });
  } else {
     if (this.listaCotizacion.length === 0 && this.camposFormulario.invalid === true) {
          this.alertaSnackBar.open('Debe Agregar como minimo un Producto!!', 'Cerrar', {
          duration: 5000
        });
     } else {
        this.alertaSnackBar.open('Ya se puede Guardar!!', 'Cerrar', {
        duration: 5000
        });

        this.pedido.ciudadEnvio = this.camposFormularioEnvio.value.ciudad;
        this.pedido.direccionEnvio = this.camposFormularioEnvio.value.direccion;
        this.pedido.valorEnvio = this.camposFormularioEnvio.value.valorEnvio;
      
        // Se prepara el objeto Pedido
        this.pedido.cliente = this.camposFormulario.value.cliente;
        this.pedido.observaciones = this.camposFormulario.value.observaciones;
        this.pedido.listaCotizacion = this.camposFormulario.value.listaCotizacion;
        this.pedido.valorIva = this.camposFormulario.value.valorIva;

        // Se llena el Objeto Envio ciudad (Tarifas Reales de envío)
        this.envioCiudad.ciudad = this.camposFormularioEnvio.value.ciudad;
        this.envioCiudad.empresaTransportadora = this.camposFormularioEnvio.value.empresaTransportadora;
        this.envioCiudad.tipoEnvio = this.camposFormularioEnvio.value.tipoEnvio;
        this.envioCiudad.valorEnvio = this.camposFormularioEnvio.value.valorEnvio;
        
        // El Contador Iguales es 1 por que es unico en Base de Datos
        // Si es diferente no esta registrado y Se hace el registro nuevo en BD Envio Ciudad
        if(this.contadorIguales != 1) {

          // Se agrega Envio Ciudad en la tabla
          this.envioCiudadService.crearEnviociudad(this.envioCiudad).subscribe( respuesta => {
            // Se Agrega Envio Ciudad a Pedido Envio Ciudad
            this.pedido.envioCiudad = respuesta.envioCiudad;
            this.referenciaVentanaModal.close(this.pedido);
          });
          
        } else {
          
          // Si activo(Checkbox) se Actualiza el Valor de Envío en EnvioCiudad
          if(this.eventoCheckbox == true) {
            
              this.envioCiudad.id = this.pedido.envioCiudad.id

              // Se actualiza el Valor de Envío 
              this.envioCiudadService.ModificarEnvioCiudad(this.envioCiudad).subscribe( respuesta => {
                // Se Agrega Envio Ciudad a Pedido Envio Ciudad
                this.pedido.envioCiudad = respuesta.envioCiudad;
                this.referenciaVentanaModal.close(this.pedido);
              });
          } else {
            this.referenciaVentanaModal.close(this.pedido);
          }
        }
      
        
       /*  
        // Se iba envioCiudad null con esto se evita este error
        if(this.pedido.envioCiudad!=null){
         
          console.log("Pedido-EnvioCiudad-lleno");
          console.log(this.pedido.envioCiudad);
          // Envia el Formulario Cargado
          this.referenciaVentanaModal.close(this.pedido);
        } else {
          // Envio ciudad esta lleno
          if(this.envioCiudad!=null){
            console.log("Pedido-EnvioCiudad-null");
            console.log(this.pedido.envioCiudad);


            // Se Carga la lista Envio Ciudad Para calcular si existe el valor en la misma, sino existe se agrega
            this.envioCiudadService.verEnvioCiudad().subscribe( enviosCiudadesBD => {
        
              // Se recorre cada elemento la lista envioCiudad de BD
              enviosCiudadesBD.forEach((elementoEnvioBD) => {

                // Se consulta, si Ciudad y Departamento estan registradas en BD de Envio Ciudad
                if(this.envioCiudad.ciudad.id == elementoEnvioBD.ciudad.id ) {
                     
                  // Se consulta si Tipo Envio esta registrado en BD de Envio Ciudad
                  if(this.envioCiudad.tipoEnvio.id == elementoEnvioBD.tipoEnvio.id &&
                    this.envioCiudad.empresaTransportadora.id == elementoEnvioBD.empresaTransportadora.id) {
                      // Se carga en Pedido el campo Envia Ciudad de BD
                      this.pedido.envioCiudad = elementoEnvioBD;
                      this.referenciaVentanaModal.close(this.pedido);
                  }
                }
              });
            });
          }
        } */
      
      }
    }
  }

  
  public datosEnvio= false;

  // Activa el Boton Datos Envío
  ActivarDatosEnvio(){

    // Al dar click en el Boton Envio Ciudad y se activa el Formulario
    this.datosEnvio = true;

    // Cargo La lista Ciudades de unDepartamento apartir del Departamento
    this.cargarCiudadDeptIdporDefecto(this.camposFormulario.get('cliente').value.ciudad.departamento);

    // Deacuerdo al Cliente seleccionado en el Formulario, se carga los Campos Departamento, Ciudad, Dirección Por defecto.
    this.camposFormularioEnvio.setValue({
      tipoEnvio: [''],
      departamento: this.camposFormulario.get('cliente').value.ciudad.departamento, // Se carga el objeto Departamento completo
      ciudad: this.camposFormulario.get('cliente').value.ciudad, // Se carga el objeto Ciudad completo
      direccion: this.camposFormulario.get('cliente').value.direccion,
      empresaTransportadora: [''],
      valorEnvio: ['']  
    });
  }

 
  // Evento Tipo Envio Ciudad
  EventoTipoEnvio(evento){
    // Calculo de si Tipo Envio y Empresa Transportadora esta en base de datos
    this.CalculoSiEstaEnBD();
  }

  // Evento Select Empresa Transportadora
  EventoEmpresaTransportadora(evento){
    // Calculo de si Tipo Envio y Empresa Transportadora esta en base de datos
     this.CalculoSiEstaEnBD();
  }

  eventoCheckbox = false; 

  // Evento checkboxs de envioCiudad
  EventoCheckboxEnvio(evento){
    this.eventoCheckbox = evento;
  }

 
  // Calculo de si Tipo Envio y Empresa Transportadora esta en base de datos
  CalculoSiEstaEnBD(): void {

    // Cada consulta se inicializa el contador
    this.contadorIguales = 0;
       
    // Se asegura que este seleccionado Tipo Envio y Emporesa Transportadora
    if(this.camposFormularioEnvio.value.tipoEnvio != 0 && this.camposFormularioEnvio.value.empresaTransportadora !=0) {

      // Se Carga la lista Envio Ciudad Para calcular si existe el valor en la misma, sino existe se agrega
      this.envioCiudadService.verEnvioCiudad().subscribe( enviosCiudadesBD => {
        
        // Se recorre cada elemento la lista envioCiudad de BD
        enviosCiudadesBD.forEach((elementoEnvioBD) => {

          // Se consulta, si Ciudad y Departamento estan registradas en BD de Envio Ciudad
          if(this.camposFormularioEnvio.value.ciudad.id == elementoEnvioBD.ciudad.id ) {
                     
            // Se consulta si Tipo Envio esta registrado en BD de Envio Ciudad
            if(this.camposFormularioEnvio.value.tipoEnvio.id == elementoEnvioBD.tipoEnvio.id &&
               this.camposFormularioEnvio.value.empresaTransportadora.id == elementoEnvioBD.empresaTransportadora.id) {

              // Contador de pareja (tipoEnvio, empresaTransportadora) igual en la Base de datos
              this.contadorIguales++;
              
              // Deacuerdo al Cliente seleccionado en el Formulario, se carga los Campos Departamento, Ciudad, Dirección Por defecto.
              // Para la Pareja EnvioCiudad y Empresa Transportadora esta en BD se carga el valorEnvio del mismo
              this.camposFormularioEnvio.setValue({
                tipoEnvio: this.camposFormularioEnvio.value.tipoEnvio,
                departamento: this.camposFormularioEnvio.value.departamento,
                ciudad: this.camposFormularioEnvio.value.ciudad,
                direccion: this.camposFormularioEnvio.value.direccion,
                empresaTransportadora: this.camposFormularioEnvio.value.empresaTransportadora,
                valorEnvio: elementoEnvioBD.valorEnvio  
              });
              // Se carga en Pedido el campo Envia Ciudad
              this.pedido.envioCiudad = elementoEnvioBD; 
            } 
          }
        });
      });
    }
    // Como cada registro es unico, si el conteo de iguales es diferente de 1, es por que no esta en BD 
    // y valorEnvio se muestra en vacio en el Form
    if(this.contadorIguales != 1) {
      this.camposFormularioEnvio.setValue({
        tipoEnvio: this.camposFormularioEnvio.value.tipoEnvio,
        departamento:this.camposFormularioEnvio.value.departamento,
        ciudad: this.camposFormularioEnvio.value.ciudad,
        direccion: this.camposFormularioEnvio.value.direccion,
        empresaTransportadora: this.camposFormularioEnvio.value.empresaTransportadora,
        valorEnvio: ['']  
     });
    }
  }

  // Se Agrega o Registra Envio Ciudad a la tabla Envio Ciudad 
  AgregarEnvioCiudad(envioCiudadFormulario): any {

    this.envioCiudadService.crearEnviociudad(envioCiudadFormulario).subscribe( respuesta => {
      // Se Agrega Envio Ciudad a Pedido Envio Ciudad
      this.pedido.envioCiudad = respuesta.envioCiudad;
    });
  }

  // Desctiva el boton Agregar Cotizacion
  get FormularioNoValido(): boolean {
    if (this.camposFormulario.invalid || this.desactivado) {
      return true;
    }
  }

  // Quitar Lista de Componente inventario
  EliminarComponenteInventarioArray(posicion: number): void {

    // Resto uno al contador que es la cantidad de Productos en la lista cotizacion(index)
    this.contador--; 
 
    this.listaBodegaInventario.push(this.listaCotizacion.value[posicion].bodegaInventario);

    // Le resto al total el articulo que saco de la lista de pedido
    this.importe = this.importe - (this.camposFormulario.value.listaCotizacion[posicion].bodegaInventario.producto.precioVenta - (this.camposFormulario.value.listaCotizacion[posicion].bodegaInventario.producto.precioVenta*this.camposFormulario.value.listaCotizacion[posicion].descuento/100))*(this.camposFormulario.value.listaCotizacion[posicion].cantidad);

    // Evita que le adicione la talla eliminada la lista detallas de otro Producto 
    if(!this.camposFormulario.get('producto').value.id   != 
        this.camposFormulario.value.listaCotizacion[posicion].bodegaInventario.producto.id ){
    
      // Se carga la lista de tallas del producto seleccionado 
      this.CargarTallas(this.camposFormulario.get('producto').value.id);
    } 
    // Antes de eliminar se adiciona la lista Talla al producto eliminado del Pedido
    this.listaTalla.push(this.listaCotizacion.value[posicion].bodegaInventario.talla);
    // Se elimina el producto del pedido
    this.listaCotizacion.removeAt(posicion);
  }

  // Carga pedido
  CargarPedido(): void {
    if  (this.idPedido) {
      this.pedidoService.VerPedidoPorId(this.idPedido).subscribe(pedido => {
        this.pedido = pedido;
        this.camposFormulario.setValue({
          "valorIva": this.pedido.valorIva,
          "valorFinalVenta": this.pedido.valorFinalVenta,
          "observaciones": this.pedido.observaciones,
          "cliente": this.pedido.cliente
        });
      });
    }
  }

  // Cancela el formularioy sale del mismo
  CancelarOperacion(): void {
    this.referenciaVentanaModal.close();
  }

  // Separador de decimales
  FormatoSeparadorDecimal(n) {
    let sep = n || "."; // Por defecto, el punto como separador decimal
    // decimals = decimals || 2; // A 2 decimales
    return n.toLocaleString().split(sep)[0];
           // + n.toFixed(decimals).split(sep)[1];
   }
  
  // Obtener Departamento
  ObtenerListaDepartamento(): void {
    this.departamentoService.obtenerDepartamentos().subscribe(departamentos => {
      this.listaDepartamentos = departamentos;
    });
  }

  // Obtener Lista de Ciudades de Departamento Seleccionado
  ObtenerListaCiudadesPorDep(evento): void {
    this.ciudadService.obtenerCiudadId(evento.value.id).subscribe( ciudades => {
      const FiltroListaCiudades = [];
      ciudades.forEach(elemento => {
        FiltroListaCiudades.push({
          "id": elemento.id,
          "nombre": elemento.nombre,
          "departamento" : {
            "id": elemento.departamento.id,
            "nombre": elemento.departamento.nombre
          }
        });
      });
      this.listaCiudadesPorDep = FiltroListaCiudades;
    });
  }

  // Obtener Lista Empresa Transportadora
  ObtenerListaEmpresaTransportadora(): void {
    this.empresaTransportadoraService.verEmpresaTransportadora().subscribe( empresaTransportadora => {
      this.listaEmpresaTransportadora = empresaTransportadora;
    });
  }

  // Obtener Lista Tipo Envio
  ObtenerListaTipoEnvio(): void {
    this.tipoEnvioService.verTipoEnvio().subscribe( tipoEnvios => {
      this.listaTipoEnvio = tipoEnvios;
    });
  }

  cargarCiudadDeptIdporDefecto(departamento: Departamento): void {
    this.ciudadService.obtenerCiudadId(departamento.id).subscribe(ciud => {
      const FiltroListaCiudades = [];
      ciud.forEach(elemento => {
        FiltroListaCiudades.push({
          "id": elemento.id,
          "nombre": elemento.nombre,
          "departamento" :{
            "id": elemento.departamento.id,
            "nombre": elemento.departamento.nombre
          }
        });
      });
      this.listaCiudadesPorDep = FiltroListaCiudades;
    });
  }

  //  Compara el Cliente
  compararCliente( c1: Cliente, c2: Cliente): boolean {
    if (c1 === undefined && c2 === undefined) { // a1, a2  identico undefined
      return true;
    }
    return ( c1 === null || c2 === null || c1 === undefined || c2 === undefined )
      ? false : c1.id === c2.id;
  }

  // Comparar Departamentos
  compararDepartamentos( a1: Departamento, a2: Departamento): boolean {

    if (a1 === undefined && a2 === undefined) { // a1, a2  identico undefined
      return true;
    }

    return ( a1 === null || a2 === null || a1 === undefined || a2 === undefined )
    ? false : a1.id === a2.id;
  }

  // Comparar Ciudades
  compararCiudades( c1: Ciudad, c2: Ciudad): boolean {

    if (c1 === undefined && c2 === undefined) { // a1, a2  identico undefined
      return true;
    }

    return ( c1 === null || c2 === null || c1 === undefined || c2 === undefined )
    ? false : c1.id === c2.id;
  }
}