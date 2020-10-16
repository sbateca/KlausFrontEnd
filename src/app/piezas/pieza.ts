import { Color } from '../colores/color';
import { Material } from '../materiales/Material';
import { Producto } from '../productos/producto';


export class Pieza {
    id: number;
    nombrePieza: string;
    observacion: string;
    color: Color;
    material: Material;
    producto: Producto;
}
