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

            var currentData = ArrayBufferHelper.BufferToObject<Array<any>>(download);
            var result = new Array<any>();

            currentData.forEach(d=> {

                console.log('download item...' + d); 
                if(d.id){
                    
                    console.log('Item to change ' + d.id); 

                    var corresponding = <any>context.tasks.find(x=> x.id == d.id);
                    var merge :any = {};

                    Object.keys(d)
                    .forEach(key => merge[key] = d[key]);

                    Object.keys(corresponding)
                        .forEach(key => merge[key] = corresponding[key]);
                     
                    merge['test'] = 'Hallo';
                    var test = JSON.stringify(merge);
                    console.log('Merge ' +test);

                    result.push(merge);
                }                
            });
                        
            var accessTokenRaw = JSON.parse(settingsStorage.getItem("AccessToken"));
            var accessToken = (accessTokenRaw) ?  accessTokenRaw.name : '';
    
            var dbx = new Dropbox({ accessToken: accessToken, fetch: fetch });       
            var jsonData = JSON.stringify(result);

            var buffer = Buffer.from( jsonData);

            dbx.setAccessToken(accessToken); 
            console.log('start dropbox upload buffer-lenght:' + buffer.length);                   
            return dbx.filesUpload( { path: '/Tasks.json', contents: buffer,  mode:   { '.tag': 'overwrite'}});
        });
    }

}