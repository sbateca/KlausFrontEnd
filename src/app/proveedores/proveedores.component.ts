import { Component, OnInit, ViewChild } from '@angular/core';
import { Proveedor } from './proveedor';
import { ProveedorService } from './proveedor.service';
import alertasSweet from 'sweetalert2';

import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';





@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})




export class ProveedoresComponent implements OnInit {


  // listado de Proveedores
  proveedores: Proveedor[];
  titulo: string = 'Proveedores';
  rutaFuncionalidades: string = 'Proveedores / Listar proveedores';

  // se declara una variable de tipo ProveedorService (debe ser privada)
  private proveedorService: ProveedorService;




  // instanciamos el ProveedorService
  constructor(proveedorService: ProveedorService) {
      this.proveedorService = proveedorService;
   }





  columnasTabla: string[] = ['nombres', 'apellidos', 'documento', 'acciones']; // contiene los ID de cada una de las columnas de la tabla
  datos: MatTableDataSource<Proveedor>;
  @ViewChild(MatPaginator, {static: true}) paginador: MatPaginator;

  /*
    Al inicializar el componente se mostrará el listado de proveedores,
    es por ello que  en esta parte se ejecutan dichas acciones
  */
  ngOnInit(): void {

    this.proveedorService.getProveedores().subscribe(
        proveedores => {
            this.proveedores = proveedores;
            // se organiza la información en un MatTableDataSource para usar los componentes de Angular Material
            this.datos = new MatTableDataSource<Proveedor>(this.proveedores);
            this.datos.paginator = this.paginador;
        }
    );
  }

  /*
    El método eliminarProveedor(Proveedor) ejecuta el método eliminarProveedor del ClienteService.
      Parámetros: El proveedor a eliminar
      Retorna: nada
  */
  eliminarProveedor(proveedor: Proveedor){

   this.proveedorService.eliminarProveedor(proveedor.id).subscribe(
     respuesta => {
       this.proveedores = this.proveedores.filter( prov => prov !== proveedor)
     }
   )
  }


}
