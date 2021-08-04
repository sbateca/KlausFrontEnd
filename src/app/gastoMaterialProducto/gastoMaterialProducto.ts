import { Producto } from '../productos/producto';
import { UnidadMedida } from '../UnidadesMedidas/UnidadMedida';
import { Talla } from '../tallas/talla';
import { Pieza } from '../piezas/pieza';

export class GastoMaterialProducto {
    id: number;
    producto: Producto;
    talla: Talla;
    pieza: Pieza;
    unidadMedida: UnidadMedida;
    cantidad: number;
    valor: number;
}