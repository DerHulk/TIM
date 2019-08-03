import { SSL_OP_SSLREF2_REUSE_CERT_TYPE_BUG } from 'constants';
import { ArrayBufferHelper } from '../common/arrayBufferHelper';
import { TaskEntity } from '../common/taskEntity';
import { TaskConverter } from './taskConverter';
import { UrlContext } from './urlContext';
import { requestContext } from './requestContext';
import { getDownStrategy as getDownloadStrategy} from './strategyFactory';
import { getUploadStrategy as getUploadStrategy} from './strategyFactory';
import { TaskExchanger } from './taskExchanger';
import { ICompanionContext } from './icompanionContext';

export class CompanionController {

    constructor() {

    }

    public syncTasks(companionContext : ICompanionContext) {                  
        
        var that = this;
        var urlRaw = companionContext.getSettingsObject("ServerUrl");
        var sourceTypRaw = companionContext.getSettingsObject("SourceTyp");
                
        if (!urlRaw && !sourceTypRaw)
            return;
            
        if(sourceTypRaw.values[0].name == 'Dropbox')
            urlRaw ='Dropbox';

        console.log("Url:" + urlRaw.name);
        console.log("Source:" + sourceTypRaw.values[0].name);

        var url = urlRaw.name;
        var sourceTyp = sourceTypRaw.values[0].name;
        var context = that.loadContext(companionContext, url);
        console.log('current context has ' + context.tasks.length + ' tasks.');

        context.downloader = getDownloadStrategy(sourceTyp);
        context.uploader = getUploadStrategy(sourceTyp);

        this.pullFromServerPushToDevice(context);
        this.receiveFromDevicePushToServer(context);      
    }

    public pullFromServerPushToDevice(context: UrlContext) : Promise<any> {

        return context.downloader.download(context).then((function (arrayBuffer: ArrayBuffer) {

            var request = new requestContext(context.url, arrayBuffer);
            var exchanger = new TaskExchanger(context.tasks);
            var serverTasks = context.downloader.map(request);            
            
            if(exchanger.NeedDeviceUpdate(serverTasks) ){
                serverTasks = exchanger.WhereIsValid(serverTasks);

                context.tasks = serverTasks;
                context.save();

                var appArrayBuffer = ArrayBufferHelper.ObjectToBuffer(serverTasks);
                context.companionContext.enqueue(appArrayBuffer);
            }           
        })).catch(function (error) {
            console.log("fetched faild:" + error);
        });
    }

    private async receiveFromDevicePushToServer(context: UrlContext) {
        
        context.companionContext.handleInbox((buffer)=> {
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
        });      
    }

    public loadContext(companionContext:ICompanionContext, url: string): UrlContext {
        var result : UrlContext;
         result = companionContext.getLocalObject('UrlContext');
         

        if (result == null) {
            result = new UrlContext();
            result.url = url;
            result.tasks = [];
        }        

        result.companionContext = companionContext;        
        result.taskConverter = new TaskConverter();

        result.save = () => {
            companionContext.saveLocalObject('UrlContext', result);            
        };
        
        return result;
    }
}