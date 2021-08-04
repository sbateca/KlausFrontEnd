import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Movimiento } from '../movimiento';
import { MovimientoService } from '../movimiento.service';
import { Pedido } from '../../pedido/pedido';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Sort, MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { DetalleMovimientosComponent } from '../detalle-movimientos/detalle-movimientos.component';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BodegaInventario } from '../../bodega-inventario/bodega-inventario';
import { TokenService } from '../../service/token.service';


@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.css']
})
export class MovimientosComponent implements OnInit {

  public listaMovimientos: Movimiento[];
  public listaPedido: Pedido[];
  public camposFormularioPorTipos: FormGroup;
  public fechaPorDefecto = new FormControl(new Date());
  public nuevaListaPorTipos:boolean = false;
  public esAdmin: boolean;
  public esPropietario: boolean;

  // Variables con valores iniciales para el paginador
  totalRegistros = 0;
  paginaActual = 0;
  totalPorPaginas = 100;
  pageSizeOptions: number[] = [3, 5, 10, 25, 100, 200, 300];
  @ViewChild(MatPaginator, {static: true}) paginador: MatPaginator;
  @ViewChild(MatSort, {static: true}) ordenadorRegistros: MatSort;

  public listaTipoMovimiento= [  {nombre:'Bodega', valor:1}, 
                                 {nombre:'Pedido', valor:2},
                                 {nombre:'Pedido Eliminado (Manual)', valor:3},
                                 {nombre:'Bodega Eliminada (Manual)', valor:4}, 
                                 {nombre:'Bodega Actualizada (Manual) (-)', valor:5}, 
                                 {nombre:'Bodega Actualizada (Manual) (+)', valor:6} ];

  // Titulos de cada Columna
  columnasTabla: string [] = ['fecha', 'hora', 'tipo', 'dinero', 'acciones'];
  datos: MatTableDataSource<Movimiento>;

  constructor(private movimientoService: MovimientoService,
              private constructorFormulario: FormBuilder,
              private tokenService:TokenService,
              public ventanaModal: MatDialog) { }

  ngOnInit(): void {
    this.listarPaginado();
    this.FormularioMovimientosPorTipo();  
    this.esAdmin = this.tokenService.isAdmin();
    this.esPropietario = this.tokenService.esPropietario();
  }

  // Calcular Movimiento Por Tipo 
  CalcularMovimientoPorTipo(){

    let tipo = this.camposFormularioPorTipos.get('tipo').value.valor;
    let fechaI = this.camposFormularioPorTipos.get('fechaInicial').value.toLocaleString();
    let fechaF = this.camposFormularioPorTipos.get('fechaFinal').value.toLocaleString();
    let horaI = this.camposFormularioPorTipos.get('horaInicial').value;
    let horaF = this.camposFormularioPorTipos.get('horaFinal').value;

    // Se acomoda a la estructura de el backen
    fechaI=fechaI.split("/")[2].slice(0,4)+'-'+fechaI.split("/")[1]+'-'+fechaI.split("/")[0];

    // Se acomoda a la estructura de el backen
    fechaF=fechaF.split("/")[2].slice(0,4)+'-'+fechaF.split("/")[1]+'-'+fechaF.split("/")[0];
  
    // Se pasa A 24 Horas y se acomoda ala estructura del backend
    let horaInicial=this.SeparaTiempoEnteros(horaI);
    
    // Se pasa A 24 Horas y se acomoda ala estructura del backend
    let horaFinal=this.SeparaTiempoEnteros(horaF);
   
    // Se hace la consulta y obtenemos la Lista de Movimientos Por tipos en un rango de tiempo
    this.ObtenerListaMovimientosPorTipos(tipo, fechaI ,fechaF, horaInicial, horaFinal);

   /*  console.log(this.nuevaListaMovimiento); */
    this.nuevaListaPorTipos=true;
   
  }

  // Se separa (hora, minutos) en entero  y formato en string
  SeparaTiempoEnteros(Hora){
    // Valores enteros, minutos y segundos 
    let hora =  Number.parseInt(Hora.split(":")[0]);
    let minutos = Number.parseInt(Hora.split(":")[1].slice(0,2));
    // Formato ' AM' y ' PM' en string
    let formato = Hora.split(":")[1].slice(2);

    let hora_24 = '';
    if(formato == ' AM'){
      // Se arma el string de la hora en 24
      hora_24=this.HaceStringEn_24Horas(hora, minutos);
    } 
    if(formato == ' PM'){
      // Se convierte de 12Horas a 24 sumando 12h
      hora=hora+12;
      // Se arma el string de la hora en 24
      hora_24=this.HaceStringEn_24Horas(hora, minutos);
    }
   return hora_24;
  }

  // Se arma el string de la hora en 24
  HaceStringEn_24Horas(hora, minutos){
    
    // Se cambia el valor de (hora, minutos) en entero y pasa a String
    let horaString = hora.toString();
    let minString = minutos.toString();
    let hora_24 = '';
    if(minutos>=10 && hora>=10){
      hora_24=hora.toString()+':'+minutos.toString()+':00';
    }else {
      if(hora<10 ) {
        horaString='0'+hora.toString();
      } 
      if(minutos<10 ){
        minString='0'+minutos.toString();
      } 
      // Se arma el string hora 24h
      hora_24=horaString +':'+minString+':00';
    }
    return hora_24;
  }

  nuevaListaMovimiento;
  public utilidades = 0;
  public cantidadesVendidos = 0;
  // Obtener lista movimientos por tipos
  ObtenerListaMovimientosPorTipos(tipo, fechaI ,fechaF, horaI,horaF){
    this.movimientoService.ObtenerMovimientosPorTipo(tipo, fechaI ,fechaF, horaI,horaF).subscribe(listaMovimientos => {
      this.nuevaListaMovimiento=listaMovimientos;
      this.datos = new MatTableDataSource<Movimiento>(this.nuevaListaMovimiento);
      this.utilidades=0;
      this.cantidadesVendidos=0;
      if(tipo==2){
        this.nuevaListaMovimiento.forEach(elementoListaMovimiento => {
          /* console.log(elementLista); */
         /*  console.log("valorEnvioPedido: "+elementoListaMovimiento.pedido.valorEnvio); */
          let valorEnvioPedido = elementoListaMovimiento.pedido.valorEnvio;
         /*  console.log("valorEnvioReal: "+elementoListaMovimiento.pedido.envioCiudad.valorEnvio); */
          let valorEnvioReal = elementoListaMovimiento.pedido.envioCiudad.valorEnvio;
         
          let valorDeEnvioCosteado = valorEnvioReal - valorEnvioPedido;
         
          
          elementoListaMovimiento.pedido.listaCotizacion.forEach(elementoListaCotizacion => {
            console.log("cotizacion: ");
            console.log(elementoListaCotizacion);
            // Cantidad de Productos Pedidos o Vendidos
            this.cantidadesVendidos = this.cantidadesVendidos + elementoListaCotizacion.cantidad;
            this.utilidades = this.utilidades + (elementoListaCotizacion.importe - (elementoListaCotizacion.cantidad*elementoListaCotizacion.bodegaInventario.producto.costo));
          });
          // Se tiene encuenta el envio en la utilidad
          this.utilidades = this.utilidades - valorDeEnvioCosteado;
        });
      }
      
        
    })
  }
  // Se muestra de nuevo la lista completa de movimientos
  VolverListaCompletaMovimientos(){
    this.nuevaListaPorTipos=false;
    this.datos = new MatTableDataSource<Movimiento>(this.listaMovimientos);
  }
  
public fecha: FormGroup;
  FormularioMovimientosPorTipo(){
    this.camposFormularioPorTipos = this.constructorFormulario.group({
      tipo: ['', Validators.required],
      fechaInicial: ['', Validators.required],
      fechaFinal: ['', Validators.required],
      horaInicial: ['', Validators.required],
      horaFinal: ['', Validators.required]
    });

    
  }

  // Cargar Movimiento
  CargarMovimientos(){
    this.movimientoService.listarElementos().subscribe(movimientos => {
      this.listaMovimientos = movimientos;
      console.log("movimientos");
      console.log(this.listaMovimientos);
    });
  }
  
   // Calcular Tipo
   public CalcularTipo(movimiento): any{
    if(movimiento.tipo == 1){
      return 'Pedido';
     }
     if(movimiento.tipo == 2){
      return 'Bodega';
     }
     if(movimiento.tipo == 3){
      return 'Pedido Eliminado Manual';
     }
     if(movimiento.tipo == 4){
      return 'Producto Eliminado de Bodega Manual';
     }
    }

    // Buscador
    aplicarFiltro(event: Event) {
      const textoFiltro = (event.target as HTMLInputElement).value;
      this.datos.filter = textoFiltro.trim().toLowerCase();
    }

  // Realiza el control de la paginacion, y las pagina.
  // Cada vez que se seleccione un boton del paginador se actualizan los valores
  // PageEvent--> El evento de tipo PageEvent
  paginar(evento: PageEvent): void {
    this.paginaActual = evento.pageIndex;
    this.totalPorPaginas = evento.pageSize; // Lo que enviamos al backend
    this.totalRegistros = evento.length;
    this.listarPaginado();
  }

    
    // Listar paginado : Realiza el get deacuerdo a los valores actualizados de cada pagina
private listarPaginado() {

  this.movimientoService.obtenerElementosPaginado(this.paginaActual.toString(), this.totalPorPaginas.toString())
  .subscribe(paginacion => {

    // Se extrae el contenido Json paginador
    this.listaMovimientos = paginacion.content as Movimiento[]; // Arreglo de Movimientos lista paginada
    this.totalRegistros = paginacion.totalElements as number; // Cantidad de registros
    this.paginador._intl.itemsPerPageLabel = 'Registros por página:';

    // Para utilizar la Tabla en Angular Material
    // Organiza la la informacion en MatTableDataSource para usar los componentes de Angular
    this.datos = new MatTableDataSource<Movimiento>(this.listaMovimientos);

    // asigna el sorting al MatTableDataSource
    this.datos.sort = this.ordenadorRegistros;
    /* this.datos.sort.active = 'nombres'; */
    /* this.datos.sort.direction = 'asc'; */

  });
}

reordenar(sort: Sort) {

  // Lista movimientos
  const listaMovimientos = this.listaMovimientos.slice(); 

  /* Si no está activo el sorting o no se ha establecido la dirección del sorting (asc ó desc)
  se asigna los mismos datos (sin ordenar) */

  if (!sort.active || sort.direction === '' ) {
     this.datos = new MatTableDataSource<Movimiento>(this.listaMovimientos);
     return;
  }
  this.datos = new MatTableDataSource<Movimiento>(
  this.listaMovimientos = listaMovimientos.sort( (a, b) => {
    const esAscendente = sort.direction === 'asc'; // se determina si es ascendente
    switch (sort.active) { // sort.active obtiene el id (string) de la columna seleccionada
      case 'fecha': return this.comparar(a.id, b.id, esAscendente);
      case 'hora': return this.comparar(a.id, b.id, esAscendente);
      case 'tipo': return this.comparar( a.tipo, b.tipo, esAscendente);
      case 'dinero': return this.comparar( a.dinero, b.dinero, esAscendente);
    }
  }));
      // cada vez que se haga clic en un botón para reordenar es necesario paginar de nuevo
  }
  // Esta función compara dos String junto con el valor de la variable isAsc y retorna:
  comparar(a: number | string, b: number | string, esAscendente: boolean) {
  return (a < b ? -1 : 1) * (esAscendente ? 1 : -1);
  }

  
/* La función abrirVentanaVer() permite abrir una ventana modal la cual carga la vista
  donde se observa el detalle del proveedor seleccionado */

  abrirVentanaVer(idMovimiento): void {
    this.ventanaModal.open(DetalleMovimientosComponent, {
      width: '60%',
      height: 'auto',
      position: {left: '30%', top: '60px'},
      data: idMovimiento
    });
  }
   
}
