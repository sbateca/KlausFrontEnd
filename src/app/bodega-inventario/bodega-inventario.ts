import { Producto } from '../productos/producto';
import { Talla } from '../tallas/talla';
export class BodegaInventario {
    id: number;
    cantidad: number;
    estadoDescuento: boolean;
    descuento: number;
    producto: Producto;
    talla: Talla;

    constructor(){
    }
}
