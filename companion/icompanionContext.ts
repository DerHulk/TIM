export interface ICompanionContext  {
    enqueue:(arrayBuffer: ArrayBuffer)=> void; 
    handleInbox: (handler: (x:ArrayBuffer)=> void)=> void;
    getSettingsObject: (key:string)=> any;
    getLocalObject: (key:string)=> any;
    saveLocalObject: (key: string, obj:any)=> void;
}