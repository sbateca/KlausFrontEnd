import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBodegaInventarioComponent } from '../form-bodega-inventario/form-bodega-inventario.component';
import { BodegaInventarioService } from '../bodega-inventario.service';
import { BodegaInventario } from '../bodega-inventario';

@Component({
  selector: 'app-detalle-bodega-inventario',
  templateUrl: './detalle-bodega-inventario.component.html',
  styleUrls: ['./detalle-bodega-inventario.component.css']
})
export class DetalleBodegaInventarioComponent implements OnInit {

  constructor(private referenciaVentanaModalDetalle: MatDialogRef<DetalleBodegaInventarioComponent>,
              @Inject(MAT_DIALOG_DATA) public idBodegaInventario: number,
              private bodegaInventarioService: BodegaInventarioService) { }

  public bodegaInventario: BodegaInventario;
  ngOnInit(): void {
    this.ObtenerBodegaInventarioPorID(this.idBodegaInventario);
    console.log(this.idBodegaInventario);
  }
  // Obtener Pedido Por Id
  ObtenerBodegaInventarioPorID(idBodegaInventario): void {
    if (idBodegaInventario) {
      this.bodegaInventarioService.VerBodegaInventarioPorId(idBodegaInventario).subscribe(detalle => {
        this.bodegaInventario = detalle;
      });
    }
  }
  // Cerrar Ventana Modal De Detalle
  CerrarVentanDetalle(): void {
    this.referenciaVentanaModalDetalle.close();
  }


}
