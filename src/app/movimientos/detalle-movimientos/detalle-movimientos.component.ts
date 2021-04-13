import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Movimiento } from '../movimiento';
import { MovimientoService } from '../movimiento.service';
import { TokenService } from '../../service/token.service';

@Component({
  selector: 'app-detalle-movimientos',
  templateUrl: './detalle-movimientos.component.html',
  styleUrls: ['./detalle-movimientos.component.css']
})
export class DetalleMovimientosComponent implements OnInit {

  public movimiento: Movimiento;
  
  constructor(private ventanaModalDetalle: MatDialogRef<DetalleMovimientosComponent>,
              private movimientoService: MovimientoService,
              @Inject(MAT_DIALOG_DATA) public idMovimiento: number) { }

  ngOnInit(): void {
    this.ObtenerMovimientosPorId(this.idMovimiento);
  }
  
  // Cargar Movimientos
  ObtenerMovimientosPorId(id){
    if(id){
      this.movimientoService.obtenerElementoPorID(id).subscribe(movimiento =>  {
        this.movimiento = movimiento;
        console.log("movimiento");
        console.log(this.movimiento);
      });                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
    }
  }

  // Cerrar Ventana Modal De Detalle
  CerrarVentanDetalle(): void {
    this.ventanaModalDetalle.close();
  }
    

}
