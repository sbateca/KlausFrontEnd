import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductoService } from '../producto.service';
import { Producto } from '../producto';
import { Pieza } from '../../piezas/pieza';

// el archivo donde se encuentran variables comunes para la aplicación
import { RUTA_BASE } from '../../config/app';
import { CommonService } from '../../common/common.service';


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

  funcionalidad = 'Detalle producto';

  constructor(@Inject(MAT_DIALOG_DATA)public idProducto,
              public referenciaVentanaModal: MatDialogRef<ProductoDetalleComponent>,
              protected productoService: ProductoService) { }

  ngOnInit(): void {
    this.obtenerProductoPorID();
  }


  obtenerProductoPorID(): void {
    if (this.idProducto) {
      this.productoService.obtenerElementoPorID(this.idProducto).subscribe(resultado => {
        this.producto = resultado;
      });
    }
  }


  cerrarVentana(): void {
    this.referenciaVentanaModal.close();
  }

  // Separador de decimales
  public FormatoSeparadorDecimal(n): any {
    let sep = n || "."; // Por defecto, el punto como separador decimal
    return n.toLocaleString().split(sep)[0];
   }


}
