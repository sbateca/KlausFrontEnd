import { Component, OnInit, Inject } from '@angular/core';
import { ProveedorService } from '../proveedor.service';
import { Proveedor } from '../proveedor';

// Botones de angular Material
import { MatButtonModule } from '@angular/material/button';

// Librerías de ventana modal
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';




@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})







export class DetalleComponent implements OnInit {

  funcionalidad = 'Detalle Proveedor'
  
  // El proveedor que guarda la información de la consulta (detalle)
  proveedor: Proveedor;

  // declaramos un ProveedorService
  private proveedorService: ProveedorService;


  // se declaran las variables que se requieren para el uso de la ventana modal
  
  // referencia a la ventana modal de tipo DetalleComponent
  referenciaVentanaModal: MatDialogRef<DetalleComponent>;
  // se declara la variable a inyectar (esta variable recibe la información de otro componente)
  public idProveedor: number;




  constructor(proveedorService: ProveedorService,
              referenciaVentanaModal: MatDialogRef<DetalleComponent>,
              @Inject(MAT_DIALOG_DATA) idProveedor) {
                  this.proveedorService = proveedorService;
                  this.referenciaVentanaModal = referenciaVentanaModal;
                  this.idProveedor = idProveedor;
              }




  ngOnInit(): void {
    this.obtenerProveedorPorID(this.idProveedor);
  }



  /*
      El método obtenerProveedorPorID(idProveedor) asigna el proveedor que ha sido obtenido por su id.
      Al suscribirse lo asigna
      Parámetros: el id del proveedor a consultar
  */
  obtenerProveedorPorID(idProveedor): void {
    if (idProveedor) {
      this.proveedorService.getProveedor(idProveedor).subscribe(proveedor => this.proveedor = proveedor);
    }
  }


  /*
    El método cerrarVentana() cierra la ventana modal
  */
  cerrarVentana(): void {
    this.referenciaVentanaModal.close();
  }



}
