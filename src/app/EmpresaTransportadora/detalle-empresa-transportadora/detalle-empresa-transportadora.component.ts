import { Component, OnInit, Inject } from '@angular/core';
import { EmpresaTransportadoraService } from '../empresa-transportadora.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmpresaTransportadora } from '../empresa-transportadora';

@Component({
  selector: 'app-detalle-empresa-transportadora',
  templateUrl: './detalle-empresa-transportadora.component.html'  
})
export class DetalleEmpresaTransportadoraComponent implements OnInit {

  public empresaTransportadora: EmpresaTransportadora;
  constructor(private empresaTransportadoraService: EmpresaTransportadoraService,
              private referenciaVentanaModal: MatDialogRef<DetalleEmpresaTransportadoraComponent>,
              @Inject(MAT_DIALOG_DATA) public idEmpresaTransportadora: number) { }

  ngOnInit(): void {
    this.EmpresaTransportadoraPorId(this.idEmpresaTransportadora);
  }

  public EmpresaTransportadoraPorId(idEmpresaTransportadora): void {
    this.empresaTransportadoraService.verEmpresaTransportadoraPorId(idEmpresaTransportadora).subscribe(respuesta => {
      this.empresaTransportadora = respuesta;
      console.log(this.empresaTransportadora);
    });
  }

  CerrarVentana(): void {
    this.referenciaVentanaModal.close();
  }

}
