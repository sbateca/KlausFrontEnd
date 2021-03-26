import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmpresaTransportadora } from '../empresa-transportadora';
import { EmpresaTransportadoraService } from '../empresa-transportadora.service';

@Component({
  selector: 'app-form-empresa-transportadora',
  templateUrl: './form-empresa-transportadora.component.html',
  styleUrls: ['./form-empresa-transportadora.component.css']
})
export class FormEmpresaTransportadoraComponent implements OnInit {

  public camposFormularioEmpresaTransportadora: FormGroup;
  public empresaTransportadora: EmpresaTransportadora;
  constructor(private VentanaModal: MatDialogRef<FormEmpresaTransportadoraComponent>,
              @Inject(MAT_DIALOG_DATA) public idEmpresaTransportadora: number,
              private empresaTransportadoraService: EmpresaTransportadoraService,
              private constructorFormularioEmpresaTransportadora: FormBuilder) { }

  ngOnInit(): void {
    this.CrearFormularioEmpresaTransportadora();
    this.CargarEmpresaTransportadora();
  }

// Formulario
CrearFormularioEmpresaTransportadora(): void {
    this.camposFormularioEmpresaTransportadora = this.constructorFormularioEmpresaTransportadora.group(
      {
        nombre: ['', Validators.required],
        descripcion: ['']
      }
    );
  }
// Boton Cancelar Formulario
 cancelarOperacion(): void {
    this.VentanaModal.close();
  }
// Boton Envio Formulario
public EnviarFormularioEmpresaTransportadora() {
     if (this.camposFormularioEmpresaTransportadora.invalid) {
       return this.camposFormularioEmpresaTransportadora.markAllAsTouched();
     } else {
        this.VentanaModal.close(this.camposFormularioEmpresaTransportadora.value);
     }
}

// Cargar Tipo Envio en formulario editar
CargarEmpresaTransportadora(): void {
  if (this.idEmpresaTransportadora) {
    this.empresaTransportadoraService.verEmpresaTransportadoraPorId(this.idEmpresaTransportadora).subscribe(respuesta => {
      this.empresaTransportadora = respuesta;
      this.camposFormularioEmpresaTransportadora.setValue({
         nombre: this.empresaTransportadora.nombre,
         descripcion: this.empresaTransportadora.descripcion
      });
    });
  }
}

}
