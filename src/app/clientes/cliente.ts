import { Ciudad } from '../ciudades/ciudad';

export class Cliente {
  id: number;
  documento: number;
  nombres: string;
  apellidos: string;
  numero_contacto: number;
  ciudad: Ciudad ;
  direccion: string;
  correo: string;
  codigo_postal: number;
}
