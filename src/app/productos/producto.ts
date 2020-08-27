import { Pieza } from '../piezas/pieza';
import { ProductoPieza } from '../productoPieza/ProductoPieza';

export class Producto {
    id: number;
    nombre: string;
    referencia: string;
    costo: number;
    precioVenta: number;
    activo: boolean;
    piezas: Pieza[];
}
