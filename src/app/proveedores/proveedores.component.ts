import { Component, OnInit } from '@angular/core';
import { Proveedor } from './proveedor';
import { ProveedorService } from './proveedor.service';



@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})




export class ProveedoresComponent implements OnInit {


  // listado de Proveedores
  proveedores: Proveedor[];

  // se declara una variable de tipo ProveedorService (debe ser privada)
  private proveedorService: ProveedorService;




  // instanciamos el ProveedorService
  constructor(proveedorService: ProveedorService) {
      this.proveedorService = proveedorService;
   }




  /*
    Al inicializar el componente se mostrará el listado de proveedores,
    es por ello que  en esta parte se ejecutan dichas acciones
  */
  ngOnInit(): void {

    this.proveedorService.getProveedores().subscribe(
        proveedores => this.proveedores = proveedores // asignamos la lista de proveedores para que esta sea pintada en el html
    );
  }

}
