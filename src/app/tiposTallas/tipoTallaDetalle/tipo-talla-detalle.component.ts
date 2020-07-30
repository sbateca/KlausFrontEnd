import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TipoTallaService } from '../tipo-talla.service';
import { TipoTalla } from '../TipoTalla';



@Component({
  selector: 'app-tipo-talla-detalle',
  templateUrl: './tipo-talla-detalle.component.html',
  styleUrls: ['./tipo-talla-detalle.component.css']
})



export class TipoTallaDetalleComponent implements OnInit {

  // el tipo de talla donde quedará almacenado el resultado de la petición
  tipoTalla: TipoTalla;

  funcionalidad = 'Detalle de Tipo de Talla';


  constructor(public referenciaVentanamodal: MatDialogRef<TipoTallaDetalleComponent>,
              @Inject(MAT_DIALOG_DATA) public idTipoTalla,
              private tipoTallaService: TipoTallaService) { }


  ngOnInit(): void {
    this.obtenerTipoTallaPorID();
  }



  obtenerTipoTallaPorID(): void {
    if (this.idTipoTalla) {
      this.tipoTallaService.obtenerTipoTallaPorID(this.idTipoTalla).subscribe(resultado => {
        this.tipoTalla = resultado;
      });
    }
  }


  cerrarVentana(): void {
    this.referenciaVentanamodal.close();
  }



}
