import { Producto } from '../productos/producto';
import { Talla } from '../tallas/talla';
import { Pedido } from '../pedido/pedido';

export class BodegaInventario {
    id: number;

    referencia: string;
    cantidad: number;
    producto: Producto;
    talla: Talla;
    listaPedido: Pedido[];
    
    constructor(){
    }
}
