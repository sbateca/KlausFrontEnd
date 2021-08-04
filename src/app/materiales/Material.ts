import { UnidadMedida } from '../UnidadesMedidas/UnidadMedida';

export class Material {
    id: number;
    nombre: string;
    descripcion: string;
    unidadMedida: UnidadMedida;
    cantidad: number;
}
