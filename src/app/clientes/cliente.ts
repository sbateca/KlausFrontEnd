import { Ciudad } from '../ciudades/ciudad';
import { Pedido } from '../pedido/pedido';

export class Cliente {
  id: number;
  documento: number;
  nombres: string;
  apellidos: string;
  numero_contacto: number;
  fijo: number;
  ciudad: Ciudad ;
  direccion: string;
  listaPedido: Pedido[];
  // correo: string;
  // codigo_postal: number;
}
