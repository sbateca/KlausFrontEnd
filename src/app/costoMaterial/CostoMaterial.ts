import { UnidadMedida } from '../UnidadesMedidas/UnidadMedida';
import { Material } from '../materiales/Material';

export class CostoMaterial {
    id: number;
    cantidad: number;
    costo: number;
    unidadMedida: UnidadMedida;
    material: Material;
}