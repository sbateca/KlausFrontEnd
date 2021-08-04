import { Pieza } from '../piezas/pieza';
import { ProductoPieza } from '../productoPieza/ProductoPieza';
import { EntityGenerico } from '../common/EntityGenerico';
import { BodegaInventario } from '../bodega-inventario/bodega-inventario';

export class Producto implements EntityGenerico {
    id: number;
    nombre: string;
    referencia: string;
    costo: number;
    precioVenta: number;
    activo: boolean;
    piezas: Pieza[];
    fotoHashCode: number;
    nombreFoto: string;
    listaBodegaInventario: BodegaInventario[];
}
