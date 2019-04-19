
import { outbox } from "file-transfer";
import { settingsStorage } from "settings";
import { SSL_OP_SSLREF2_REUSE_CERT_TYPE_BUG } from 'constants';
import { ArrayBufferHelper } from '../common/arrayBufferHelper';
import { TaskEntity } from '../common/taskEntity';
import { localStorage } from "local-storage";
import { TaskManager } from './taskManager';
import { TaskSource, TaskStatus } from '../common/enums';
import { UrlContext } from './urlContext';
import { requestContext } from './requestContext';

export class CompanionController {

    constructor() {

    }
       
    public syncTasks() {

        var that = this;
        var serviceUrl = JSON.parse(settingsStorage.getItem("ServerUrl"));

        if (!serviceUrl)
            return;
        
        var url = serviceUrl.name;
        console.log("Url:" + url);

        fetch(url).then(function (response) {   
                        
            return response.arrayBuffer();                                     

        }).then(function (arrayBuffer:ArrayBuffer) {

            var manager = new TaskManager();
            var context = that.loadContext(url);
            var request = new requestContext(url, TaskSource.Unkown, arrayBuffer);
            var tupels = manager.Convert( context, request)  ;
            var appArrayBuffer = ArrayBufferHelper.ObjectToBuffer(tupels);

            context.tasks= tupels.map(x=> x.task);
            that.saveContext(context);
            
            console.log('tupels:' + tupels.length);
                    
            outbox.enqueue("task.json", appArrayBuffer)
                .then((ft: any) => {
                    console.log('Transfer of ' + ft.name + ' successfully queued.');
                })
                .catch((error) => {
                    console.log(`Failed to queue $‌{filename}: $‌{error}`);
                });

        }).catch(function (error) {
            console.log("fetched faild:" + error);
        });
    }

    public loadContext(url: string) :UrlContext {
        var raw = localStorage.getItem('UrlContext');

        if(raw){
            return JSON.parse(raw);
        }

        var result = new UrlContext();
        result.url = url;
        result.tasks = [];
        return result;
    }

    public saveContext(urlContext:UrlContext){
        var raw = JSON.stringify(urlContext);
        localStorage.setItem('UrlContext', raw);

    }

}