import { Component, OnInit, Inject } from '@angular/core';
import { Color } from '../color';
import { TallasColoresService } from '../tallas-colores.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';



@Component({
  selector: 'app-color-detalle',
  templateUrl: './color-detalle.component.html',
  styleUrls: ['./color-detalle.component.css']
})



export class ColorDetalleComponent implements OnInit {



  // declaramos una variable donde quedará almacenado el color
  color: Color;

  // funcionalidad
  funcionalidad = 'Detalle de color';


  constructor(private tallaColorService: TallasColoresService,
              @Inject(MAT_DIALOG_DATA) public idColor,
              private referenciaVentanaModal: MatDialogRef<ColorDetalleComponent>) { }

  ngOnInit(): void {
    this.obtenerColorPorID();
  }


  obtenerColorPorID(): void {
    if (this.idColor) {
      this.tallaColorService.getColorPorID(this.idColor).subscribe( resultado => {
        this.color = resultado;
      });
    }
  }


  cerrarVentana(): void {
    this.referenciaVentanaModal.close();
  }


}
