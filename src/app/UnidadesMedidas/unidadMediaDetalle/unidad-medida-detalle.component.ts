import { Component, Inject, OnInit } from '@angular/core';
import { UnidadMedidaService } from '../unidad-medida.service';
import { UnidadMedida } from '../UnidadMedida';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-unidad-medida-detalle',
  templateUrl: './unidad-medida-detalle.component.html',
  styleUrls: ['./unidad-medida-detalle.component.css']
})
export class UnidadMedidaDetalleComponent implements OnInit {


  unidadMedida: UnidadMedida;
  funcionalidad = 'Detalle de unidad de medida';

  constructor(protected unidadMedidaService: UnidadMedidaService,
              public referenciaVentanaModal: MatDialogRef<UnidadMedidaDetalleComponent>,
              @Inject(MAT_DIALOG_DATA) public idUnidadMedida) { }

  ngOnInit(): void {
    if(this.idUnidadMedida){
      this.obtenerUnidadMedida(this.idUnidadMedida);
    }
  }

  obtenerUnidadMedida(id: number): void {
    this.unidadMedidaService.obtenerElementoPorID(id).subscribe(resultado => {
      this.unidadMedida = resultado as UnidadMedida;
    });
  }


  cerrarVentana():void {
    this.referenciaVentanaModal.close();
  }

}
