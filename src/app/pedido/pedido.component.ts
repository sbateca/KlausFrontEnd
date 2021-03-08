import { Component, OnInit, ViewChild } from '@angular/core';
import { FormPedidoComponent } from './form-pedido/form-pedido.component';
import { MatDialog } from '@angular/material/dialog';
import { Pedido } from './pedido';
import { PedidoService } from './pedido.service';
import swal from 'sweetalert2';
import { Sort, MatSort } from '@angular/material/sort';
import { DetallePedidoComponent } from './detalle-pedido/detalle-pedido.component';
import alertasSweet from 'sweetalert2';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BodegaInventario } from '../bodega-inventario/bodega-inventario';
import { CotizacionService } from '../cotizacion/cotizacion.service';
import { Cliente } from '../clientes/cliente';
import { ClienteService } from '../clientes/cliente.service';
import { BodegaInventarioService } from '../bodega-inventario/bodega-inventario.service';
import { Movimiento } from '../movimientos/movimiento';
import { MovimientoService } from '../movimientos/movimiento.service';
import { EstadoPedidoComponent } from '../estado-pedido/estado-pedido.component';
import { EstadoPedidoService } from '../estado-pedido/estado-pedido.service';
import { EstadoPedido } from '../estado-pedido/estado-pedido';
import { PdfMakeWrapper, Stack, Table, QR, SVG} from 'pdfmake-wrapper';
import { ITable} from 'pdfmake-wrapper/lib/interfaces';
import { Logotipo } from './logo';
import { ScannearPedidoComponent } from './scannear-pedido/scannear-pedido.component';



@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent implements OnInit {

  public pedido = new Pedido();
  public listaPedidos: Pedido[];
  public pedidoConId: Pedido;
  public listaClientes: Cliente[];
  public bodegaInventario: BodegaInventario;
  public movimiento = new Movimiento();
  public listaEstadoPedido: EstadoPedido[];
  private logo = new Logotipo();

  // Titulos de cada Columna
  columnasTabla: string[] = ['valorFinalVenta', 'cliente', 'acciones'];
  datos: MatTableDataSource<Pedido>;

  // Variables con valores iniciales para el paginador
  totalRegistros = 0;
  paginaActual = 0;
  totalPorPaginas = 100;
  pageSizeOptions: number[] = [3, 5, 10, 25, 100];
  @ViewChild(MatPaginator, { static: true }) paginador: MatPaginator;
  @ViewChild(MatSort, { static: true }) ordenadorRegistros: MatSort;

  constructor(public ventanaModal: MatDialog,
    private cotizacionService: CotizacionService,
    private clienteService: ClienteService,
    private bodegaInventarioService: BodegaInventarioService,
    private movimientoService: MovimientoService,
    private estadoPedidoService: EstadoPedidoService,
   /*  private envioCiudadService: EnviociudadService,
    private router: Router, */
    private pedidoService: PedidoService) { }

  ngOnInit(): void {
    this.pedidoService.VerListaPedidos().subscribe(pedidos => {
      this.listaPedidos = pedidos;
    });
    this.listarPaginado();
  }

  // Abrir Ventana Modal De Scanear
  scannearPedido(): void {
    const referenciaVentanaModal = this.ventanaModal.open(ScannearPedidoComponent,
      {
        width: '400px',
        height: '400px',
        position: { left: '30%', top: '60px' }
      });
    referenciaVentanaModal.afterClosed().subscribe(referenciaPedido => {

      if (referenciaPedido != null) {
       /*  this.CrearPedido(pedido);
        this.ActualizarBodegaInventarioPorPedido(pedido); */
      }
    });
  }

  
 

  numeroDeProductos = 0;
  async GeneraPDF(idPedido) {
    const pdf = new PdfMakeWrapper();
    this.pedidoService.VerPedidoPorId(idPedido).subscribe(pedido => {
      const cliente = pedido.cliente;
      this.numeroDeProductos = pedido.listaCotizacion.length;
      pdf.defaultStyle({ bold: false, fontSize: 8 });
      pdf.pageMargins ( [  10 ,  10 ,  40 ,  60  ] );
      pdf.header('Klaus Leather');
      pdf . footer ( 'Pie de página Klaus Leather' ) ; 
      pdf.add( this.creaTablaFechaNit(pedido));
      pdf.add(this.creaTablaClienteEnvio(cliente, pedido));
      pdf.add(this.creaApilarTablaCotizacionTotalizar(pedido));      
      pdf.create().open();
    });
    
  }
  creaLogoSVG(){
    return new SVG(this.logo.LOGOTIPO).end
  }
  creaTablaFechaNit(pedido){
    return new Table ([
      [ this.creaLogoSVG(), this.creaTablaInformacion() ,this.creaTablaNitQr(pedido) ]
    ])
    .layout('noBorders')
    .widths([160,170,150])
    .margin([12, 0, 0, 0])
    .end
  }

  creaTablaInformacion(){
    return new Table([
      ['Klaus Leather Store'],
      ['FABRICACIÓN DE CALZADO DE CUERO'],
      ['Régimen simplificado NIT. 1094270792-5'],
      ['Calle 5N No. 9E -05 Barrio Los Pinos. Diagonal Centro Cristiano'],
      ['Cúcuta, Colombia'],
      ['Facebook: kleatherstore'],
      ['Instagram: Klaus Leather'],
    ])
    .layout('noBorders')
    .end
  }

  creaTablaNitQr(pedido){
    return new Table ([
      [ new QR(pedido.referencia).fit(50).end],
      [ this.creaTablaFechaFacturacion(pedido)]
    ])
  .margin([90, 0, 0 ,0])
  .layout('noBorders')
  .end
  }
  creaTablaFechaFacturacion(pedido){
    return new Table ([ 
      ['Fecha de Facturación'], [pedido.fechaRegistro],
      ['Fecha de Vencimiento'], [pedido.fechaRegistro]
    ])
    .layout('noBorders')
    .margin([0,5,0,0])
    .end
  }
  
  creaTablaClienteEnvio(cliente, pedido){
    return new Table ([ 
      ['Cliente', 'Datos De Envío'],
      [this.creaTablaCliente(cliente), this.creaTablaDatosEnvio(pedido)]
    ])
    .widths([267,199]) // Ancho de cada columna
    .margin([18,20,0,0])
    /* .alignment('center') */
    .layout('lightHorizontalLines')
    .end
  }

  creaTablaCliente(cliente: Cliente): ITable {
    return new Table([
      ['Documento: ', this.FormatoSeparadorDecimal(cliente.documento)],
      ['Nombres: ', cliente.nombres],
      ['Apellidos: ', cliente.apellidos],
      ['Numero Telefonico: ', cliente.numero_contacto],
      ['Numero Fijo: ', cliente.fijo],
      ['Ciudad: ', cliente.ciudad.nombre],
      ['Departamento: ', cliente.ciudad.departamento.nombre],
      ['Dirección: ', cliente.direccion],
    ])
    .widths([75, 85])
    .end;// implementacion
  }

  creaTablaDatosEnvio(pedido):ITable {
    return new Table([
      ['Tipo de Pedido: ', pedido.envioCiudad.tipoEnvio.nombre],
      ['Ciudad: ', pedido.ciudadEnvio.nombre],
      ['Departamento: ', pedido.ciudadEnvio.departamento.nombre],
      ['Dirección: ', pedido.direccionEnvio],
      ['Empresa Transportadora: ', pedido.envioCiudad.empresaTransportadora.nombre],
      ['Valor Envío: ', this.FormatoSeparadorDecimal(pedido.valorEnvio)]
    ])
    .widths([95, 85])
    .end
  }

  creaApilarTablaCotizacionTotalizar(pedido) {
    return new Stack ([ this.creaTablaCotizacion( pedido), this.creaTablaTotalizandoPedido(pedido)]).end;
  }
  creaTablaCotizacion(pedido): ITable{
   
      return new Table([
        ['#', 'Producto', 'Referencia', 'Talla', 'Precio Inicial', 'Descuento (%)', 'Precio Unitario', 'Iva', 'Precio (Iva Incluido)', 'Cantidad', 'Total' ],
         ...this.Cotizacion(pedido)
      ])
      .alignment('center') // Se alinea las letras en el centro
      .margin(20.10) // x=20 desde el eje, y=10 desde la tabla anterior 
      .widths([10, 40, 42, 20, 45, 40, 35, 32, 40, 33, 45]) // Anchos de cada columna de la Tabla
      .heights(rowIndex => { return rowIndex === 0 ? 15 : 0; }) // Alto para la fila 1 de 15
      .layout({fillColor: (rowIndex: number, node: any, columnIndex: number) => {
          return rowIndex ===  0 ? '#CCCCCC' :  ''; // Color a la fila 0
        }
      })
      .end
  }

  Cotizacion(pedido){
      return pedido.listaCotizacion.map((cotizacion, index)=>[
        1+index, // no
        cotizacion.bodegaInventario.producto.nombre, // Producto
        cotizacion.bodegaInventario.producto.referencia, // Ref
        cotizacion.bodegaInventario.talla.talla,  //Talla
        this.FormatoSeparadorDecimal(cotizacion.bodegaInventario.producto.precioVenta), //Precio Inicial
        cotizacion.descuento, // Descuento
        this.FormatoSeparadorDecimal((cotizacion.bodegaInventario.producto.precioVenta - (cotizacion.bodegaInventario.producto.precioVenta*(cotizacion.descuento/100)))-((cotizacion.bodegaInventario.producto.precioVenta - (cotizacion.bodegaInventario.producto.precioVenta*(cotizacion.descuento/100)))*pedido.valorIva/100)), // Precio Unitario
        this.FormatoSeparadorDecimal((cotizacion.bodegaInventario.producto.precioVenta - (cotizacion.bodegaInventario.producto.precioVenta*(cotizacion.descuento/100)))*pedido.valorIva/100), //Iva
        this.FormatoSeparadorDecimal(cotizacion.bodegaInventario.producto.precioVenta - (cotizacion.bodegaInventario.producto.precioVenta*(cotizacion.descuento/100))), //Precio Iva Incluido
        cotizacion.cantidad, // Cantidad
        this.FormatoSeparadorDecimal((cotizacion.bodegaInventario.producto.precioVenta - (cotizacion.bodegaInventario.producto.precioVenta*(cotizacion.descuento/100)))*cotizacion.cantidad) //Total
      ]);
  }

  creaTablaTotalizandoPedido(pedido): ITable {
    return new Table([
      ['SubTotal Valor Unitario:', this.FormatoSeparadorDecimal((pedido.valorFinalVenta-pedido.valorEnvio) - (pedido.valorIva/100*(pedido.valorFinalVenta - pedido.valorEnvio)))],
      ['Iva:', this.FormatoSeparadorDecimal(pedido.valorIva/100*(pedido.valorFinalVenta-pedido.valorEnvio))],
      ['Valor General:', this.FormatoSeparadorDecimal(pedido.valorFinalVenta - pedido.valorEnvio)],
      ['Valor Envío:', this.FormatoSeparadorDecimal(pedido.valorEnvio)],
      ['Valor General Total:', this.FormatoSeparadorDecimal(pedido.valorFinalVenta)],
    /*   ['Observaciones:', pedido.observaciones] */
    ])
    .layout({fillColor: (rowIndex: number, node: any, columnIndex: number) => {
        return rowIndex ===  4 ? '#CCCCCC' : rowIndex ===  2 ? '#CCCCCC': '';// La fila 4 y 2 tiene color
      }
    })
    .alignment('right') // e justifica 
    .widths([85,45]) // Ancho de cada columna
    .margin([350, 0, 0, 0])// x,y, ancho, alto
    .end
  }

  // Separador de decimales
  public FormatoSeparadorDecimal(n): any {
    /*  aux=n.toLocaleString('de-DE', { style: 'currency', currency: 'COP' }); */
    return n.toLocaleString('de-DE');
  }

  // Se Carga el cliente
  CargarCliente(): void {
    this.clienteService.getClientes().subscribe(clientes => {
      this.listaClientes = clientes;
    });
  }

  Reordenar(sort: Sort) {

    const listPedido = this.listaPedidos.slice(); // obtenemos el array*/

    /*
    Si no está activo el sorting o no se ha establecido la dirección del sorting (asc ó desc)
    se asigna los mismos datos (sin ordenar)
    */
    if (!sort.active || sort.direction === '') {
      this.datos = new MatTableDataSource<Pedido>(this.listaPedidos);
      return;
    }
    this.datos = new MatTableDataSource<Pedido>(
      this.listaPedidos = listPedido.sort((a, b) => {
        const esAscendente = sort.direction === 'asc'; // se determina si es ascendente
        switch (sort.active) { // sort.active obtiene el id (string) de la columna seleccionada
          case 'valorFinalVenta': return this.comparar(a.valorFinalVenta, b.valorFinalVenta, esAscendente);
          case 'cliente': return this.comparar(a.cliente.id, b.cliente.id, esAscendente);
        }
      }));
    // cada vez que se haga clic en un botón para reordenar es necesario paginar de nuevo
  }
  // Esta función compara dos String junto con el valor de la variable isAsc y retorna:
  comparar(a: number | string | Date, b: number | string | Date, esAscendente: boolean) {// Date
    return (a < b ? -1 : 1) * (esAscendente ? 1 : -1);
  }

  // Control de Paginación
  paginar(evento: PageEvent): void {
    this.paginaActual = evento.pageIndex;
    this.totalPorPaginas = evento.pageSize; // Lo que enviamos al backend
    this.listarPaginado();
  }

  // Paginar Lista Pedido
  listarPaginado(): void {

    this.pedidoService.ListarPedidosPaginado(this.paginaActual.toString(), this.totalPorPaginas.toString())
      .subscribe(paginacion => {

        // Se extrae el contenido Json paginador
        this.listaPedidos = paginacion.content as Pedido[]; // Arreglo de cliente lista paginada
        this.totalRegistros = paginacion.totalElements as number; // Cantidad de registros
        this.paginador._intl.itemsPerPageLabel = 'Registros por página:';

        // Para utilizar la Tabla en Angular Material organiza la la informacion en MatTableDataSource para usar los componentes de Angular
        this.datos = new MatTableDataSource<Pedido>(this.listaPedidos);

        // asigna el sorting al MatTableDataSource
        this.datos.sort = this.ordenadorRegistros;
        this.datos.sort.active = 'nombres';
        this.datos.sort.direction = 'asc';

      });
  }

  // Abrir Ventana Modal Del formulario
  AbrirVentanaFormulario(): void {
    const referenciaVentanaModal = this.ventanaModal.open(FormPedidoComponent,
      {
        width: '60%',
        height: 'auto',
        position: { left: '30%', top: '60px' }
      });
    referenciaVentanaModal.afterClosed().subscribe(pedido => {

      if (pedido != null) {
        this.CrearPedido(pedido);
        this.ActualizarBodegaInventarioPorPedido(pedido);
      }
    });
  }

  // Ventana Modal Del Formulario Estado Pedido
  VentanaFormularioEstado(idPedido): void {
    const referenciaVentanaModal = this.ventanaModal.open(EstadoPedidoComponent,
      {
        width: '60%',
        height: 'auto',
        position: { left: '30%', top: '60px' },
        data: idPedido
      });
    referenciaVentanaModal.afterClosed().subscribe(respuesta => {

      if (respuesta != null) {
        console.log(respuesta);
      }
    });
  }

  // Se actualiza la Bodega Inventario cada vez que se haga un Pedido
  ActualizarBodegaInventarioPorPedido(pedido): void {

    // Recorremos el la lista Cotizacion
    pedido.listaCotizacion.forEach((cotizacion) => {

      this.bodegaInventario = cotizacion.bodegaInventario;
      this.bodegaInventario.id = cotizacion.bodegaInventario.id;

      // Suastraemos de Bodega la cantidad pedida y asignamos a bodega la nueva cantidad 
      this.bodegaInventario.cantidad = cotizacion.bodegaInventario.cantidad - cotizacion.cantidad;

      // Actualizamos bodegaInventario
      this.bodegaInventarioService.ActualizarBodegaInventario(this.bodegaInventario).subscribe(resp => { });
    });
  }

  // Crea Pedido
  public CrearPedido(pedido): void {

    this.pedido = pedido;
    /* this.AgregarEnvioCiudad(this.pedido.envioCiudad); */
    // Pasamos las variables del Formulario a Pedido
    
     // SE asigna Referencia aleatoria En el campo Referencia Pedido
     this.pedido.referencia = this.GeneraReferenciaAleatoria();

    this.pedido.valorFinalVenta = 0;
    this.pedido.id = null; // El id se pone nulo para que se cree un pedido nuevo

    // Se Recorro la lista, para Calcular el valorFinalVenta
    this.pedido.listaCotizacion.forEach(cotizacion => {

      cotizacion.importe = (cotizacion.bodegaInventario.producto.precioVenta - (cotizacion.bodegaInventario.producto.precioVenta * cotizacion.descuento / 100)) * cotizacion.cantidad;

      // Sumatoria de los importes
      this.pedido.valorFinalVenta = cotizacion.importe + this.pedido.valorFinalVenta;
    });

    // Le sumo El valor del Envío al Pedido
    this.pedido.valorFinalVenta = this.pedido.valorFinalVenta + this.pedido.valorEnvio;

    // Crear Pedido
    this.pedidoService.CrearPedido(this.pedido).subscribe(respuesta => {


      // Le ponemos la id que se crea al pedido
      this.pedido.id = respuesta.pedido.id;

      // Llenamos el campo 
      this.movimiento.pedido = this.pedido;
      this.movimiento.dinero = this.pedido.valorFinalVenta;
      // Tipo de Movimiento Salida de Bodega # 2
      this.movimiento.tipo = 2;

      this.movimientoService.agregarElemento(this.movimiento).subscribe(agregarMovimiento => { this.listarPaginado() });


      // Se desplaza por la lista Cotizacion de Pedido
      this.pedido.listaCotizacion.forEach((cotizacion, index) => {

        // Se llena el campo Pedido en Cotizacion
        cotizacion.pedido = this.pedido;

        // Se limpia la lista de cotizacion del atributo Pedido para evitar bucle infinito en el JSON
        cotizacion.pedido.listaCotizacion = [];

        // Se crea la cotizacion
        this.cotizacionService.CrearCotizacion(cotizacion).subscribe(rta => { });

      });
    });
    this.listarPaginado();

    alertasSweet.fire('Nuevo pedido', this.pedido.cliente.nombres, 'success');

  }

  // Se genera una Referencia Aleatoria de 15 elementos
  GeneraReferenciaAleatoria() {
    let result = '';
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 15; i++) {
        result += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }

    // Mientras es true o ya esta la referencia se genera otra referencia
    while(this.comprobarExiteReferenciaBD(result)){
      result = '';
      for (let i = 0; i < 15; i++) {
        result += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
      } 
    }

    return result;
}

// Se compara si la Referencia generada no esta en BD 
comprobarExiteReferenciaBD(result: string): boolean{

  let verificar: boolean = false;

  // Se trae la lista de Pedidos de BD
  this.pedidoService.VerListaPedidos().subscribe(listaPedidos => {
    // Se Filtra La lista de Pedidos de BD que tienen la misma referencia
    listaPedidos.filter(pedido => pedido.referencia == result);

    // Si hay encuentra pedidos con la misma referencia se retorna verificar=true
    if(listaPedidos.length!=0){
      verificar = true;
    }
  });
  console.log("return:"+verificar);
  return verificar;
}

  // Ventana Detalle
  AbrirVentanaDetalle(idPedido): void {
    this.ventanaModal.open(DetallePedidoComponent, {
      width: '70%',
      height: 'auto',
      position: { left: '25%', top: '60px' },
      data: idPedido
    });
  }

  // Eliminar Pedido
  EliminarPedido(pedido: Pedido): void {

    this.pedido = pedido;
    swal.fire({
      title: '¿Estas seguro?',
      text: '¿Seguro que desea Eliminar el Pedido, ' + pedido.cliente.nombres + ' ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#ad3333',
      cancelButtonText: 'No, cancelar!',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {

      if (result.value) {

        // Se  Actualiza Bodega Inventario Al Eliminar Un Pedido
        this.ActualizarBodegaInventarioAlEliminarUnPedido(pedido);

        // Se obtiene la lista de Estados Por pedido
        this.estadoPedidoService.ObtenerEstadosPedidosPorPedidos(this.pedido.id).subscribe(listaEstado => {
          this.listaEstadoPedido = listaEstado;

          // Se recorre la lista de Cotizacion 
          pedido.listaCotizacion.forEach(cotizacion => {

            // Se Consulta la lista de Movimientos
            this.movimientoService.listarElementos().subscribe(movimientos => {

              // Se Recorre la lista de Movimientos
              movimientos.forEach(elementoMovimiento => {

                // Los Movimientos Tipo Pedidos    
                if (elementoMovimiento.pedido != null) {

                  // Se dectecta el Pedido a Eliminar en Pedido y en Movimiento se cambia el Tipo(estado eliminado)
                  if (pedido.id == elementoMovimiento.pedido.id) {

                    // Le pongo Tipo(# 3 de Eliminado manual)
                    this.movimiento = elementoMovimiento;
                    this.movimiento.tipo = 3;
                    
                    // Guardo en Movimientos los estados del pedido
                    this.movimiento.pedido.listaEstadoPedido = listaEstado;

                    // Actualizo Tipo(# 3 Eliminado manual) en Movimientos
                    this.movimientoService.editarElemento(this.movimiento).subscribe(resp => { this.listarPaginado(); });
                  }
                }
              })
            });

            // Se Elimina cada Elemento de la lista Cotizacion
            this.cotizacionService.EliminarCotizacion(cotizacion.id).subscribe(respuesta => { });
          });

          // Elimino Cada elemento de la lista Estados Pedido
          listaEstado.forEach(elementoEstado => {
            this.estadoPedidoService.eliminaElemento(elementoEstado.id).subscribe(rta => {});
          });
          // Se Elimina el Pedido
          this.pedidoService.EliminarPedido(pedido.id).subscribe(respuesta => { this.listarPaginado(); });
        });

        alertasSweet.fire('Pedido Eliminado!', 'Pedido <strong>' + pedido.cliente.nombres + '</strong> Eliminado con éxito.', 'success');
      }
    });
  }

  // Se  Actualiza Bodega Inventario Al Eliminar Un Pedido
  ActualizarBodegaInventarioAlEliminarUnPedido(pedido): void {

    // Recorremos el la lista Cotizacion
    pedido.listaCotizacion.forEach((cotizacion) => {

      this.bodegaInventario = cotizacion.bodegaInventario;
      this.bodegaInventario.id = cotizacion.bodegaInventario.id;

      // Suastraemos de Bodega la cantidad pedida y asignamos a bodega la nueva cantidad 
      this.bodegaInventario.cantidad = cotizacion.bodegaInventario.cantidad + cotizacion.cantidad;

      // Actualizamos bodegaInventario
      this.bodegaInventarioService.ActualizarBodegaInventario(this.bodegaInventario).subscribe(resp => { });
    });
  }


  // Abrir ventana Modal Formulario De Pedido
  AbrirVentanaEditarPedido(idPedido): void {
    const ventanaModalPedido = this.ventanaModal.open(FormPedidoComponent, {
      width: '60%',
      height: 'auto',
      position: { left: '30%', top: '60px' },
      data: idPedido
    });
    ventanaModalPedido.afterClosed().subscribe(pedidoEditadoFormulario => {
      if (pedidoEditadoFormulario) {
        this.pedido = pedidoEditadoFormulario;
        // this.pedido.id = idPedido;
        this.ActualizarPedido();
      }
    });
  }

  // Actualizar Pedido En Base de Datos
  ActualizarPedido(): void {
    this.pedidoService.CrearPedido(this.pedido).subscribe(pedido => {
      this.listarPaginado();
      swal.fire('Pedido Actializado', `Pedido ${this.pedido.cliente.nombres} actualizado con éxito!`, 'success');
    });
  }

  // Buscador
  AplicarFiltro(event: Event) {
    const textoFiltro = (event.target as HTMLInputElement).value;
    this.datos.filter = textoFiltro.trim().toLowerCase();
  }



}
