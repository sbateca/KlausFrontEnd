import { TipoTalla } from '../tiposTallas/TipoTalla';
import { BodegaInventario } from '../bodega-inventario/bodega-inventario';

export class Talla {
    id: number;
    talla: number;
    descripcion: string;
    tipoTalla: TipoTalla;
    listaBodegaInventario: BodegaInventario[];
}
