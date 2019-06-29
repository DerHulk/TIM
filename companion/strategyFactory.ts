import { Interface } from 'readline';
import { UrlContext } from './urlContext';
import { TaskEntity } from '../common/taskEntity';
import { requestContext } from './requestContext';
import { outbox } from "file-transfer";
import { ArrayBufferHelper } from '../common/arrayBufferHelper';
import { Dropbox } from 'dropbox'
import { settingsStorage } from 'settings';

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
            return new DropboxDownloadStrategy(new UrlDownloadStrategy());            
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

///how to get dropbox-sdk to run https://community.fitbit.com/t5/SDK-Development/Import-dropbox-sdk-to-companion/m-p/3521234#M8978
export class DropboxDownloadStrategy implements IDownloadStrategy{

    constructor( private donwloadStrategy: UrlDownloadStrategy){

    }

    download(context: UrlContext): Promise<ArrayBuffer> {    
        
        var accessTokenRaw = JSON.parse(settingsStorage.getItem("AccessToken"));
        var accessToken = (accessTokenRaw) ?  accessTokenRaw.name : '';

        var dbx = new Dropbox({ accessToken: accessToken, fetch: fetch });       
        dbx.setAccessToken(accessToken);

        return dbx.filesGetTemporaryLink( { path: '/Tasks.json'}).then(x=> {
            context.url = x.link;
            return this.donwloadStrategy.download(context);
        })       
        .catch(function(error) {
            console.log(error);   
            return null;        
        });
    }    
    map(request: requestContext): TaskEntity[] {

       return this.donwloadStrategy.map(request);
    }    
}