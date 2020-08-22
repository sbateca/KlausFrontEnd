import { Color } from '../colores/color';
import { Material } from '../materiales/Material';


export class Pieza {
    id: number;
    nombre: string;
    observacion: string;
    color: Color;
    material: Material;
}
