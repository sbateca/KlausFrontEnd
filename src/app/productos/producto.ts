import { Pieza } from '../piezas/pieza';
import { ProductoPieza } from '../productoPieza/ProductoPieza';
import { EntityGenerico } from '../common/EntityGenerico';

export class Producto implements EntityGenerico {
    id: number;
    nombre: string;
    referencia: string;
    costo: number;
    /* precioAlPorMayor: number; */
    precioVenta: number;
    activo: boolean;
    piezas: Pieza[];
    fotoHashCode: number;
    nombreFoto: string;
}
