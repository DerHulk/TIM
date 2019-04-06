
export class TaskEntity {
    
    public id:number;
    public titel:string;      
    public timeInMs: number;  

    constructor(id?:number, titel?:string){
        this.id = id;
        this.titel = titel;
    }
}