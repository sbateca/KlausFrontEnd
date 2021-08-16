import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductoService } from '../producto.service';
import { Producto } from '../producto';
import { Pieza } from '../../piezas/pieza';


// el archivo donde se encuentran variables comunes para la aplicación
import { RUTA_BASE } from '../../config/app';
import { CommonService } from '../../common/common.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { TipoTalla } from 'src/app/tiposTallas/TipoTalla';
import { TallaService } from '../../tallas/talla.service';
import { Talla } from '../../tallas/talla';
import { GastoMaterialProducto } from '../../gastoMaterialProducto/gastoMaterialProducto';


@Component({
  selector: 'app-producto-detalle',
  templateUrl: './producto-detalle.component.html',
  styleUrls: ['./producto-detalle.component.css']
})
export class ProductoDetalleComponent implements OnInit {

  // La ruta base
  rutaBase = RUTA_BASE + '/producto';

  producto: Producto;
  piezas: Pieza[];

  // en esta variable se almacena el Tipo de Talla del backend
  listaTallas: Talla[] = new Array();
  listaTallasFiltrada: Talla[] = new Array();

  funcionalidad = 'Detalle producto';

  constructor(@Inject(MAT_DIALOG_DATA)public idProducto,
              public referenciaVentanaModal: MatDialogRef<ProductoDetalleComponent>,
              protected productoService: ProductoService,
              private tallaService: TallaService) { }

  ngOnInit(): void {
    this.obtenerProductoPorID();
    this.obtenerTallas();
  }


  obtenerProductoPorID(): void {
    if (this.idProducto) {
      this.productoService.obtenerElementoPorID(this.idProducto).subscribe(resultado => {
        this.producto = resultado;
        console.log(this.producto);
      });
    }
  }



  
  /**
   * Este método obtiene una lista de tipos de talla registrados en el backend
   */
  obtenerTallas(): void {
    this.tallaService.getTallas().subscribe(lista => {
      this.listaTallas = lista;
      this.filtrarGastosPorProducto(this.listaTallas);
      console.log(this.listaTallasFiltrada);
    });
  }


  /**
   * (Variable de clase). Este array va a almacenar los valores de cada una de los gastos para calcular
   * el total por talla
   */ 
  arrayValores = new Array();

  /**
   * Este método realiza una limpieza a la lista de tallas dejando sólamente
   * aquellas que tienen gastos asociados para el producto seleccionado.
   * @param listaTalla la lista de tallas sobre la cual se va a hacer la
   * validación para extraer los gastos
   */
  filtrarGastosPorProducto(listaTalla: Talla[]): void {
    
    for(let i =0; i<listaTalla.length; i++){
      
      let listaGasto: GastoMaterialProducto[] = new Array();
      this.arrayValores = new Array(); // reseteo el array

      for(let j=0; j< listaTalla[i].listaGastoMaterialProducto.length; j++){
        
        if(listaTalla[i].listaGastoMaterialProducto[j].producto.id == this.idProducto){
          listaGasto.push(listaTalla[i].listaGastoMaterialProducto[j]);   
          
          this.arrayValores.push(listaTalla[i].listaGastoMaterialProducto[j].valor); // aprovechamos para extraer el valor y luego totalizar

        }
      }
      if(listaGasto.length>0){
        listaTalla[i].listaGastoMaterialProducto = listaGasto;
        this.listaTallasFiltrada.push(listaTalla[i]);
      }


    }
  }


  calcularTotal(arrayGasto: GastoMaterialProducto[]): number {
    let total = 0;
    arrayGasto.forEach(gasto => {
      if(gasto.producto.id == this.idProducto){
        total+=gasto.valor;
      }
    });
    return total;
  }


  /**
   * Este método cierra la ventana modal
   */
  cerrarVentana(): void {
    this.referenciaVentanaModal.close();
  }

  // Separador de decimales
  public FormatoSeparadorDecimal(n): any {
    let sep = n || "."; // Por defecto, el punto como separador decimal
    return n.toLocaleString().split(sep)[0];
   }


}
