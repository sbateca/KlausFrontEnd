import { BodegaInventario } from '../bodega-inventario/bodega-inventario';
import { Pedido } from '../pedido/pedido';

export class Movimiento {
    id: number;
    dinero: number;
    tipo: number;
    pedido: Pedido;
    bodegaInventario: BodegaInventario;
}
