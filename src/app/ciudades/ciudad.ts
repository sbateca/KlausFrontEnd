import { Departamento } from '../departamentos/departamento';
export class Ciudad {
    id:number;
    nombre:string;
    departamento: Departamento;

    constructor(id, nombre, departamento){
        this.id = id;
        this.nombre = nombre;
        this.departamento = departamento;
    }
}
