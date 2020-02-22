import {Component, OnInit} from '@angular/core';
import { Proveedor } from './proveedor';
import { ProveedorService } from './proveedor.service';

// Para trabajar con enrutador 
import { Router, ActivatedRoute } from '@angular/router';
import alertasSweet from 'sweetalert2';


@Component({
    selector: 'app-proveedor-form',
    templateUrl: './form.component.html'

})

export class FormProveedoresComponent implements OnInit{

    titulo: string = 'Proveedores'; // título para el grupo de funcionalidades
    rutaFuncionalidades: string = 'Proveedores / Crear proveedor';
    funcionalidad: string = 'Crear proveedor';
    
    proveedor: Proveedor = new Proveedor(); // creamos un objeto proveedor donde se va a almecenar la información del formulario
    private proveedorService: ProveedorService; // Para efectuar las operaciones
    
    private enrutador: Router; // se usa para acceder a funciones de redirección
    private activatedRoute: ActivatedRoute; // se usa para extraer información de la ruta

    // instanciamos las variables (las private)
    constructor(proveedorService: ProveedorService, enrutador: Router, activatedRoute: ActivatedRoute){
        this.proveedorService = proveedorService;
        this.enrutador = enrutador;
        this.activatedRoute = activatedRoute;
    }


    /*
        cuando el componente carga se ejecuta el método cargaProveedorEnFormulario()
    */
    ngOnInit() {
        this.cargaProveedorEnFormulario();
    }


    /*
        Em método cargarProveedorEnFormulario() utliliza el ActivatedRoute para obtener variables de la URL.
        Luego busca el proveedor por su id para cargar su información en el formulario siempre y cuando exista.
        Parámetros: Ninguno
        Retorna: Nada
    */
    cargaProveedorEnFormulario(): void {
        this.activatedRoute.params.subscribe( parametros => {
            let id = parametros['id']; // Obtiene el ID
            if (id) {
                // obtiene el proveedor por su ID y lo asigna a la variable de clase
                this.proveedorService.getProveedor(id).subscribe( proveedor => this.proveedor = proveedor );
            }
        })
    }


    /*
        El método crearProveedor() ejecuta el método crearProveedor del ProveedorService y se suscribe en espera de una repuesta
        La respuesta se utiliza para mostrar un mensaje de confirmación con datos del proveedor creado
        Parámetros:
            - Nada
        Retorna: Nada
    */
    crearProveedor(): void {
        this.proveedorService.crearProveedor(this.proveedor).subscribe(
            respuesta => {
                 this.enrutador.navigate(['/proveedores']);
                 alertasSweet.fire('Nuevo proveedor', respuesta.mensaje);
            }
        );
    }




    /*
        El método actualizarProveedor() ejecuta el método actualizarProveedor del ProveedorService
        y se suscribe en espera de una repuesta.
        La respuesta se utiliza para mostrar un mensaje de confirmación con datos del proveedor actualizado
        Parámetros: Nada
        Retorna: Nada
    */
    actualizarProveedor(): void {
        this.proveedorService.actualizarProveedor(this.proveedor).subscribe(
            respuesta => {
                this.enrutador.navigate(['/proveedores']);
                alertasSweet.fire('Confirmación', respuesta.mensaje, 'success');
            }
        );
    }


}