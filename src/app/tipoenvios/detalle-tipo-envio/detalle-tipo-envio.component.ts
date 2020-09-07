import { Component, OnInit, Inject } from '@angular/core';
import { tick } from '@angular/core/testing';
import { TipoEnvio } from '../tipoenvios';
import { TipoenviosService } from '../tipoenvios.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';



@Component({
  selector: 'app-detalle-tipo-envio',
  templateUrl: './detalle-tipo-envio.component.html'
})
export class DetalleTipoEnvioComponent implements OnInit {

  constructor(public tipoenvioservicio: TipoenviosService,
              private referenciaVentanaModal: MatDialogRef<DetalleTipoEnvioComponent>, // variable de referencia a la ventana modal
              @Inject(MAT_DIALOG_DATA) public idTipoEnvio: number) { }

  public tipoenvio: TipoEnvio;

  ngOnInit(): void {
    this.tipoenvioporId(this.idTipoEnvio);
  }
  public tipoenvioporId(idTipoEnvio): void {
    this.tipoenvioservicio.verTipoEnvioPorId(idTipoEnvio).subscribe(respuesta => {
      this.tipoenvio = respuesta;
      console.log(this.tipoenvio);
    });
  }
  cerrarVentana(): void {
    this.referenciaVentanaModal.close();
  }

}
