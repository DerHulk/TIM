
import { outbox } from "file-transfer";
import { settingsStorage } from "settings";
import { SSL_OP_SSLREF2_REUSE_CERT_TYPE_BUG } from 'constants';
import { ArrayBufferHelper } from '../common/arrayBufferHelper';
import { TaskEntity } from '../common/taskEntity';
import { localStorage } from "local-storage";
import { TaskManager } from './taskManager';
import { TaskSource, TaskStatus } from '../common/enums';

export class CompanionController {

    constructor() {

    }
       
    public syncTasks() {

        var serviceUrl = JSON.parse(settingsStorage.getItem("ServerUrl"));

        if (!serviceUrl)
            return;
        
        var url = serviceUrl.name;
        console.log("Url:" + url);

        fetch(url).then(function (response) {   
                        
            return response.arrayBuffer();                                     

        }).then(function (arrayBuffer:ArrayBuffer) {

            var manager = new TaskManager();
            var localKey = encodeURI(url);
            var currentTasksAsJson = localStorage.getItem(localKey);
            var existing = JSON.parse(currentTasksAsJson);
            var tupels = manager.Convert( TaskSource.Unkown, arrayBuffer, existing)  ;
            var loaclTask = tupels.map(x=> x.task);            
            localStorage.setItem(localKey, JSON.stringify(loaclTask));            
            
            var appArrayBuffer = ArrayBufferHelper.ObjectToBuffer(tupels);
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
}