import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Talla } from '../../tallas/talla';
import { TallaService } from '../../tallas/talla.service';
import { MaterialService } from '../material.service';
import { Material } from '../Material';

@Component({
  selector: 'app-material-detalle',
  templateUrl: './material-detalle.component.html',
  styleUrls: ['./material-detalle.component.css']
})
export class MaterialDetalleComponent implements OnInit {

    // variable que almacena la información de la talla
    material: Material;

    funcionalidad = 'Detalle Talla';

    constructor(public referenciaVentanaModal: MatDialogRef<MaterialDetalleComponent>,
                @Inject(MAT_DIALOG_DATA) public idMaterial: number,
                private materialService: MaterialService) { }

    ngOnInit(): void {
      this.verDetalleMaterial(this.idMaterial);
    }

    verDetalleMaterial(idTalla): void {
      this.materialService.obtenerMaterialPorID(this.idMaterial).subscribe( resultado => {
        if (resultado) {
          this.material = resultado;
          console.log(resultado);
        }
      });
    }

    cerrarVentana(): void {
      this.referenciaVentanaModal.close();
    }

  }
