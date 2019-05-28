import { Interface } from 'readline';
import { UrlContext } from './urlContext';
import { TaskEntity } from '../common/taskEntity';
import { requestContext } from './requestContext';
import { outbox } from "file-transfer";
import { ArrayBufferHelper } from '../common/arrayBufferHelper';

export interface IUploadStrategy {

}

export interface IDownloadStrategy {
    download(context:UrlContext): Promise<ArrayBuffer>;
    map(request: requestContext): TaskEntity[]
}

export function getUploadStrategy(selection:string): IUploadStrategy	{    
    return null;
}

export  function getDownStrategy(selection:string): IDownloadStrategy	{

    switch (selection) {
        case "Azure DevOps Server": {
            throw Error("Not Implementated");            
        }
        case "Git": {
            throw Error("Not Implementated");            
        }
        case "Dropbox": {
            return new UrlDownloadStrategy();            
        }
        default: { 
            throw Error("Not Implementated");           
         } 
    }            
}

export class UrlDownloadStrategy implements IDownloadStrategy{
    download(context: UrlContext): Promise<ArrayBuffer> {    
        return fetch(context.url).then(function (response) {
            return response.arrayBuffer();
        })
    }    
    map(request: requestContext): TaskEntity[] {

        var debugObj = ArrayBufferHelper.BufferToObject<Array<any>>(request.data);
        return debugObj.map(x => new TaskEntity(x.id, x.description));
    }    
}