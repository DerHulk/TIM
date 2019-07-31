
import { outbox } from "file-transfer";
import { inbox } from "file-transfer";
import { settingsStorage } from "settings";
import { SSL_OP_SSLREF2_REUSE_CERT_TYPE_BUG } from 'constants';
import { ArrayBufferHelper } from '../common/arrayBufferHelper';
import { TaskEntity } from '../common/taskEntity';
import { localStorage } from "local-storage";
import { TaskConverter } from './taskConverter';
import { UrlContext } from './urlContext';
import { requestContext } from './requestContext';
import { getDownStrategy as getDownloadStrategy} from './strategyFactory';
import { getUploadStrategy as getUploadStrategy} from './strategyFactory';

export class CompanionController {

    constructor() {

    }

    public syncTasks() {
                  
        

        var that = this;
        var urlRaw = JSON.parse(settingsStorage.getItem("ServerUrl"));
        var sourceTypRaw = JSON.parse(settingsStorage.getItem("SourceTyp"))
                
        if (!urlRaw && !sourceTypRaw)
            return;
            
        if(sourceTypRaw.values[0].name == 'Dropbox')
            urlRaw ='Dropbox';

        console.log("Url:" + urlRaw.name);
        console.log("Source:" + sourceTypRaw.values[0].name);

        var url = urlRaw.name;
        var sourceTyp = sourceTypRaw.values[0].name;
        var context = that.loadContext(url);
        console.log('current context has ' + context.tasks.length + ' tasks.');

        context.downloader = getDownloadStrategy(sourceTyp);
        context.uploader = getUploadStrategy(sourceTyp);

        this.pullFromServerPushToDevice(context);
        this.receiveFromDevicePushToServer(context);
        //read inputbox and push to url
    }

    private pullFromServerPushToDevice(context: UrlContext) {

        context.downloader.download(context).then((function (arrayBuffer: ArrayBuffer) {

            var request = new requestContext(context.url, arrayBuffer);
            var tupels = context.taskConverter.Convert(context, request);
            var appArrayBuffer = ArrayBufferHelper.ObjectToBuffer(tupels);

            context.tasks = tupels.map(x => x.task);
            context.save();

            console.log('tupels:' + tupels.length);
            context.enqueue(appArrayBuffer);

        })).catch(function (error) {
            console.log("fetched faild:" + error);
        });
    }

    private async receiveFromDevicePushToServer(context: UrlContext) {

        let file;
        while ((file = await inbox.pop())) {
            var buffer = await file.arrayBuffer();            
            var incoming = ArrayBufferHelper.BufferToObject<TaskEntity>(buffer, true);                                    
            var corresponding = context.tasks.find(x=> x.id == incoming.id)

            console.log('Incoming has timeInMs...' + incoming.timeInMs);

            if(corresponding){
                console.log('Found corresponding in context...');
                corresponding.timeInMs = incoming.timeInMs;
            }
            else {
                console.log('Not Found corresponding in context...');
                context.tasks.push(incoming);
            }
                                  
            context.uploader.upload(context).then(x=> {
                console.log('Upload finished')
                context.save();
            }).catch(x=> 
                    console.log('Error by Upload:' + x));
        }
    }

    public loadContext(url: string): UrlContext {
        var raw = localStorage.getItem('UrlContext');
        var result = new UrlContext();

        if (raw) {
            result = JSON.parse(raw);
        }
        else {
            result.url = url;
            result.tasks = [];
        }

        result.taskConverter = new TaskConverter();
        result.save = () => {
            var raw = JSON.stringify(result);
            localStorage.setItem('UrlContext', raw);
        };

        result.enqueue = (arrayBuffer: ArrayBuffer) => {
            outbox.enqueue("task.json", arrayBuffer)
                .then((ft: any) => {
                    console.log('Transfer of ' + ft.name + ' successfully queued.');
                })
                .catch((error) => {
                    console.log(`Failed to queue $‌{filename}: $‌{error}`);
                });
        };

        return result;
    }
}