import { EntityGenerico } from '../common/EntityGenerico';

export class UnidadMedida implements EntityGenerico{
    id: number;
    categoria: string;
    nombre: string;
    abreviatura: string;
}