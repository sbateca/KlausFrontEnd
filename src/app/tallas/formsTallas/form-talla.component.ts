import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TallaService } from '../talla.service';
import { Talla } from '../talla';

// librerías para formularios de AngularMaterial
import {MatInputModule} from '@angular/material/input';

// librerías para formularios reactivos
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import alertasSweet from 'sweetalert2';
import { TipoTalla } from '../../tiposTallas/TipoTalla';
import { TipoTallaService } from '../../tiposTallas/tipo-talla.service';



@Component({
  selector: 'app-form-talla',
  templateUrl: './form-talla.component.html',
  styleUrls: ['./form-talla.component.css']
})



export class FormTallaComponent implements OnInit {

  // nombre de la funcionalidad
  funcionalidad = 'Crear Talla';

  // Variables Service
  private tallaService: TallaService;
  private tipoTallaService: TipoTallaService;

  // variables para la ventana modal
  public referenciaVentanaModal: MatDialogRef<FormTallaComponent>;

  /*
    Se declara la variable que almacena la información que ha sido enviada desde el otro componente
    Esta variable se debe inyectar en el constructor
  */
  public idTalla: number;

  // Se declara la variable donde quedará almacenada la información del formulario (NgModel)
  tallaFormulario: Talla = new Talla();

  // se declara la variable donde quedará alcacenado el listado de Tipos de Talla
  listaTipoTalla: TipoTalla[];


  // ----------------- campos para formularios reactivos -------------------------------- //
  forma: FormGroup;
  private constructorFormularios: FormBuilder;


  // ---------------------------- constructor de la clase ------------------------------- //

  constructor(tallaService: TallaService,
              tipoTallaService: TipoTallaService,
              referenciaVentanaModal: MatDialogRef<FormTallaComponent>,
              @Inject(MAT_DIALOG_DATA) idTalla: number,
              constructorFormularios: FormBuilder) {

                this.tallaService = tallaService;
                this.tipoTallaService = tipoTallaService;
                this.referenciaVentanaModal = referenciaVentanaModal;
                this.idTalla = idTalla;

                this.constructorFormularios = constructorFormularios;
              }

  ngOnInit(): void {
    this.crearFormulario();
    this.cargarDatosEnFormulario();
    this.obtenerListaTiposTalla();
  }




  /*
      El método crearFormulario() permite crear los campos del formulario
  */
  crearFormulario(): void {
    this.forma = this.constructorFormularios.group({
      talla:        ['', [Validators.required, Validators.max(99)]],
      descripcion:  [''],
      tipoTalla:    ['', Validators.required]
    });
  }

  // Este método permite cargar datos en el formulario
  cargarDatosEnFormulario(): void {

    if (this.idTalla) {
      this.tallaService.getTallaPorID(this.idTalla).subscribe(resultado => {
        this.tallaFormulario = resultado;
        this.forma.setValue({
          talla: this.tallaFormulario.talla,
          descripcion: this.tallaFormulario.descripcion,
          tipoTalla: this.tallaFormulario.tipoTalla
        });
      });
    }
  }




  obtenerListaTiposTalla(): void {
    this.tipoTallaService.obtenerTipoTallas().subscribe(resultado => {
      this.listaTipoTalla = resultado;
    });
  }




/*
    El método guardar revisa si el formulario fué inválido para lanzar los avisos.
    - Si el formulario el válido, cierra la ventana modal, enviando los campos del formulario
    los cuales son devueltos al otro componente y posteriormente se realiza el insertarTalla del service
*/
  guardar(): void {
    // esta parte marca todos los campos del formulario como tocados en caso de ser inválido el formulario
    if (this.forma.invalid) {
      return this.forma.markAllAsTouched();
    } else {
      this.referenciaVentanaModal.close(this.forma.value);
    }

  }

  /*
    Esta función permite comparar dos objetos TipoTalla y retorna un true cuando son iguales
  */
  compararTiposTalla(tt1: TipoTalla, tt2: TipoTalla): boolean {
    return tt1 && tt2 ? tt1.id === tt2.id : tt1 === tt2;
  }







  /*
      El método cancelarOperacion() cierra la ventana modal
  */
  cancelarOperacion(): void {
    this.referenciaVentanaModal.close();
  }





  // ------- getters del estado para los campos de los formularios. Se usan en validación ---------- //
  // estos métodos determinan si los campos del formulario son inválidos (invalid) y a su vez han sido tocados (touched)

  get tallaNoValida() {
    return this.forma.get('talla').invalid &&
    this.forma.get('talla').touched &&
    this.forma.get('talla').errors.required;
  }

  get tallaNumeroNoValido() {
    return this.forma.get('talla').invalid &&
    this.forma.get('talla').touched &&
    this.forma.get('talla').errors.max;
  }

  get tipoTallaNoValido() {
    return this.forma.get('tipoTalla').invalid &&
    this.forma.get('tipoTalla').touched;
  }

  // -------------------------------------------------------------------------------------------- //



}
