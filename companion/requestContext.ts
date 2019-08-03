
export class requestContext implements IRequestContext {

constructor(
    public url?: string,    
    public data?: ArrayBuffer){}
}

export interface IRequestContext {
    url?: string,    
    data?: ArrayBuffer
}