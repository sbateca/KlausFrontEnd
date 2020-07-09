import { Departamento } from '../departamentos/departamento';

export class Ciudad {
    id: number;
    nombre: string;
    departamento: Departamento;

    constructor(id: number, nombre: string){
        this.id = id;
        this.nombre = nombre;
    }
}
