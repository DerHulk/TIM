export interface ICompanionContext  {
    enqueue:(arrayBuffer: ArrayBuffer)=> void;     
    getSettingsObject: (key:string)=> any;
    getLocalObject: (key:string)=> any;
    saveLocalObject: (key: string, obj:any)=> void;
    getNextFileNameFromInbox(): ArrayBuffer;
}