import { BodegaInventario } from '../bodega-inventario/bodega-inventario';
import { Pedido } from '../pedido/pedido';
export class Cotizacion {
    id: number;
    importe: number;
    bodegaInventario: BodegaInventario;
    cantidad: number;
    pedido: Pedido;
    descuento: number;
}
