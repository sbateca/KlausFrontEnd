import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormEstadoEnvioCiudadComponent } from './form-estado-envio-ciudad/form-estado-envio-ciudad.component';
import { EstadoEnvioCiudad } from './estado-envio-ciudad';
import { EstadoEnvioCiudadService } from './estado-envio-ciudad.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-estado-envio-ciudad',
  templateUrl: './estado-envio-ciudad.component.html',
  styleUrls: ['./estado-envio-ciudad.component.css']
})
export class EstadoEnvioCiudadComponent implements OnInit {

  public estadoEnvioCiudad: EstadoEnvioCiudad;
  constructor(public ventanaModal: MatDialog,
              public estadoEnvioCiudadService: EstadoEnvioCiudadService) { }

  ngOnInit(): void {
  }

  // Abrir Ventana Formulario Estado Envío Ciudad
  AbrirVentanaFormulario(): void {
    const ventanaModalEstadoEnvioCiudad = this.ventanaModal.open(FormEstadoEnvioCiudadComponent,
        {
          width: '60%',
          height: 'auto',
          position: {left: '30%', top: '60px'}
        });
    ventanaModalEstadoEnvioCiudad.afterClosed().subscribe( resultado => {
      if (resultado != null) {
        this.estadoEnvioCiudad = resultado;
        this.CrearEstadoEnvioCiudad();
      }
    });
  }

  public CrearEstadoEnvioCiudad(): void {
    this.estadoEnvioCiudadService.CrearEstadoEnvioCiudad(this.estadoEnvioCiudad).subscribe(response => {// Sube a la base de datos
          swal.fire('Nuevo Estado Envio Ciudad', `Estado Envio Ciudad ${this.estadoEnvioCiudad.envioCiudad.ciudad} creado con exito!`, 'success');
    });
  }

}
