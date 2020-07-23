import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TallasColoresService } from '../tallas-colores.service';
import { Talla } from '../talla';



@Component({
  selector: 'app-talla-detalle',
  templateUrl: './talla-detalle.component.html',
  styleUrls: ['./talla-detalle.component.css']
})



export class TallaDetalleComponent implements OnInit {

  // variable que almacena la información de la talla
  talla: Talla;

  funcionalidad = 'Detalle Talla';

  constructor(public referenciaVentanaModal: MatDialogRef<TallaDetalleComponent>,
              @Inject(MAT_DIALOG_DATA) public idTalla: number,
              private tallasColoresService: TallasColoresService) { }



  ngOnInit(): void {
    this.verDetalleTalla(this.idTalla);
  }


  verDetalleTalla(idTalla): void {
    this.tallasColoresService.getTallaPorID(this.idTalla).subscribe( resultado => {
      if (resultado) {
        this.talla = resultado;
      }
    });
  }


  cerrarVentana(): void {
    this.referenciaVentanaModal.close();
  }




}
