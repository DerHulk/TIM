import { ArrayBufferHelper } from '../common/arrayBufferHelper';
import { TaskEntity } from '../common/taskEntity';
import { TaskConverter } from './taskConverter';
import { UrlContext } from './urlContext';
import { requestContext } from './requestContext';
import { getDownStrategy as getDownloadStrategy } from './strategyFactory';
import { getUploadStrategy as getUploadStrategy } from './strategyFactory';
import { TaskExchanger } from './taskExchanger';
import { ICompanionContext } from './icompanionContext';

export class CompanionController {

    constructor() {

    }

    public async syncTasks(companionContext: ICompanionContext) {

        var that = this;
        var urlRaw = companionContext.getSettingsObject("ServerUrl");
        var sourceTypRaw = companionContext.getSettingsObject("SourceTyp");

        if (!urlRaw && !sourceTypRaw)
            return;

        if (sourceTypRaw.values[0].name == 'Dropbox')
            urlRaw = 'Dropbox';

        console.log("Url:" + urlRaw.name);
        console.log("Source:" + sourceTypRaw.values[0].name);

        var url = urlRaw.name;
        var sourceTyp = sourceTypRaw.values[0].name;
        var context = that.loadContext(companionContext, url);
        console.log('current context has ' + context.tasks.length + ' tasks.');

        context.downloader = getDownloadStrategy(sourceTyp);
        context.uploader = getUploadStrategy(sourceTyp);

        await this.pullFromServerPushToDevice(context);
        await this.receiveFromDevicePushToServer(context);
    }

    public async pullFromServerPushToDevice(context: UrlContext): Promise<any> {

        try {
            var arrayBuffer = await context.downloader.download(context);
            var request = new requestContext(context.url, arrayBuffer);
            var exchanger = new TaskExchanger(context.tasks);
            var serverTasks = context.downloader.map(request);

            if (exchanger.NeedDeviceUpdate(serverTasks)) {
                serverTasks = exchanger.WhereIsValid(serverTasks);

                context.tasks = serverTasks;
                context.save();

                var appArrayBuffer = ArrayBufferHelper.ObjectToBuffer(serverTasks);
                context.companion.enqueue(appArrayBuffer);
            }
        }
        catch (error) {
            console.log("fetched faild:" + error);
        }
    }

    public async receiveFromDevicePushToServer(context: UrlContext) {

        let buffer: ArrayBuffer;

        while (buffer = await context.companion.getNextFileNameFromInbox()) {

            if (buffer) {
                var incoming = ArrayBufferHelper.BufferToObject<TaskEntity>(buffer, true);
                var corresponding = context.tasks.find(x => x.id == incoming.id)

                if (corresponding) {
                    corresponding.timeInMs = incoming.timeInMs;
                }
                else {
                    context.tasks.push(incoming);
                }

                try {
                    await context.uploader.upload(context)
                    context.save();
                }
                catch (ex) {
                    console.log("Upload error: " + ex);
                }
            }
        }
    }

    public loadContext(companionContext: ICompanionContext, url: string): UrlContext {
        var result: UrlContext;
        result = companionContext.getLocalObject('UrlContext');


        if (result == null) {
            result = new UrlContext();
            result.url = url;
            result.tasks = [];
        }

        result.companion = companionContext;
        result.taskConverter = new TaskConverter();

        result.save = () => {
            companionContext.saveLocalObject('UrlContext', result);
        };

        return result;
    }
}