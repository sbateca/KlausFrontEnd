import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidadoresService {

  constructor() { }


  /**
   * Este método realiza la petición al backend para saber si un material ya está registrado
   * @param idMaterial El ID del material a buscar
   * @param idUnidadMedida El ID de la unidadMedida a ubscar
   * @returns boolean
   */
  materialExiste(control: FormControl): Boolean {
    let existe = false;
    
    return false;
  }

}
