
import { outbox } from "file-transfer";
import { settingsStorage } from "settings";
import { SSL_OP_SSLREF2_REUSE_CERT_TYPE_BUG } from 'constants';
import { ArrayBufferHelper } from '../common/arrayBufferHelper';
import { TaskEntity } from '../common/taskEntity';
import { localStorage } from "local-storage";
import { TaskConverter } from './taskConverter';
import { UrlContext } from './urlContext';
import { requestContext } from './requestContext';
import { getDownStrategy as getDownloadStrategy, getUploadStrategy } from './strategyFactory';

export class CompanionController {

    constructor() {

    }

    public syncTasks() {

        var that = this;
        var urlRaw = JSON.parse(settingsStorage.getItem("ServerUrl"));
        var sourceTypRaw = JSON.parse(settingsStorage.getItem("SourceTyp"))

        if (!urlRaw || !sourceTypRaw)
            return;

        console.log("Url:" + urlRaw.name);
        console.log("Source:" + sourceTypRaw.values[0].name);

        var url = urlRaw.name;
        var sourceTyp = sourceTypRaw.values[0].name;
        var context = that.loadContext(url);

        context.downloader = getDownloadStrategy(sourceTyp);
        context.uploader = getUploadStrategy(sourceTyp);

        this.pullFromServerPushToDevice(context);
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