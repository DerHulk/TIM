import { Interface } from 'readline';
import { UrlContext } from './urlContext';
import { TaskEntity } from '../common/taskEntity';
import { requestContext } from './requestContext';
import { outbox } from "file-transfer";
import { ArrayBufferHelper } from '../common/arrayBufferHelper';
import { Dropbox } from 'dropbox'
import { settingsStorage } from 'settings';

export interface IUploadStrategy {
    upload(context: UrlContext) : Promise<any>;
}

export interface IDownloadStrategy {
    download(context: UrlContext): Promise<ArrayBuffer>;
    map(request: requestContext): TaskEntity[]
}

export function getUploadStrategy(selection: string): IUploadStrategy {
    switch (selection) {
        case "Azure DevOps Server": {
            throw Error("Not Implementated");
        }
        case "Git": {
            throw Error("Not Implementated");
        }
        case "Dropbox": {
            return new DropboxUploadStrategy();
        }
        default: {
            throw Error("Not Implementated");
        }
    }
}

export function getDownStrategy(selection: string): IDownloadStrategy {

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

export class UrlDownloadStrategy implements IDownloadStrategy {
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
export class DropboxDownloadStrategy implements IDownloadStrategy {

    constructor(private donwloadStrategy: UrlDownloadStrategy) {

    }

    download(context: UrlContext): Promise<ArrayBuffer> {

        var accessTokenRaw = JSON.parse(settingsStorage.getItem("AccessToken"));
        var accessToken = (accessTokenRaw) ? accessTokenRaw.name : '';

        var dbx = new Dropbox({ accessToken: accessToken, fetch: fetch });
        dbx.setAccessToken(accessToken);

        return dbx.filesGetTemporaryLink({ path: '/Tasks.json' }).then(x => {
            context.url = x.link;
            return this.donwloadStrategy.download(context);
        })
            .catch(function (error) {
                console.log(error);
                return null;
            });
    }
    map(request: requestContext): TaskEntity[] {

        return this.donwloadStrategy.map(request);
    }
}

export class DropboxUploadStrategy implements IUploadStrategy {

    upload(context: UrlContext): Promise<any> {

        console.log('start upload...');   

        return context.downloader.download(context).then(download=> {
            
            console.log('got download...');   

            var serverData = ArrayBufferHelper.BufferToObject<Array<any>>(download);
            var result = new Array<any>();

            serverData.forEach(serverItem=> {

                console.log('download item...' + serverItem); 
                if(serverItem.id){
                    
                    console.log('Item to change ' + serverItem.id); 

                    var corresponding = context.tasks.find(x=> x.id == serverItem.id && x.timeInMs != undefined);

                    if(corresponding){
                        var merge :any = {};

                        Object.keys(serverItem)
                            .forEach(key => merge[key] = serverItem[key]);
                                             
                        merge.timeInMs = corresponding.timeInMs;
                        var test = JSON.stringify(merge);
                        console.log('Merge ' +test);
                        console.log('Merge timeInMs' + merge.timeInMs);
                        console.log('Merge corresponding' + corresponding.timeInMs);
                        result.push(merge);
                    }
                    else {
                        result.push(serverItem);
                    }                                                                
                }                
            });
                        
            if(result.some(x=> x.timeInMs)){
                var accessTokenRaw = JSON.parse(settingsStorage.getItem("AccessToken"));
                var accessToken = (accessTokenRaw) ?  accessTokenRaw.name : '';
        
                var dbx = new Dropbox({ accessToken: accessToken, fetch: fetch });       
                var jsonData = JSON.stringify(result);
    
                var buffer = Buffer.from( jsonData);
    
                dbx.setAccessToken(accessToken); 
                console.log('start dropbox upload buffer-lenght:' + buffer.length);                   
                return dbx.filesUpload( { path: '/Tasks.json', contents: buffer,  mode:   { '.tag': 'overwrite'}});
            }            
        });
    }

}