import { Component, OnInit, Inject } from '@angular/core';
import { Color } from '../color';
import { ColorService } from '../color.service';
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


  constructor(private colorService: ColorService,
              @Inject(MAT_DIALOG_DATA) public idColor,
              private referenciaVentanaModal: MatDialogRef<ColorDetalleComponent>) { }

  ngOnInit(): void {
    this.obtenerColorPorID();
  }


  obtenerColorPorID(): void {
    if (this.idColor) {
      this.colorService.getColorPorID(this.idColor).subscribe( resultado => {
        this.color = resultado;
      });
    }
  }


  cerrarVentana(): void {
    this.referenciaVentanaModal.close();
  }


}
