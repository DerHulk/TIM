import { outbox } from "file-transfer";
import { inbox } from "file-transfer";
import { settingsStorage } from "settings";
import { localStorage } from "local-storage";
import { ICompanionContext } from './icompanionContext';

export class CompanionContext implements ICompanionContext {   
    public enqueue(arrayBuffer: ArrayBuffer){
        outbox.enqueue("task.json", arrayBuffer)
        .then((ft: any) => {
            console.log('Transfer of ' + ft.name + ' successfully queued.');
        })
        .catch((error) => {
            console.log(`Failed to queue $‌{filename}: $‌{error}`);
        });
    };       

    public async handleInbox(handler: (x:ArrayBuffer)=> void){
        let file;
        while ((file = await inbox.pop())) {
            var buffer = await file.arrayBuffer();            
            handler(buffer);
        }
    }

    public getSettingsObject(key:string):any{
        return  JSON.parse(settingsStorage.getItem(key));
    }

    public saveLocalObject(key:string, obj:any){
        var raw = JSON.stringify(obj);
        localStorage.setItem(key, raw);
    }

    public getLocalObject(key:string):any {
        var raw = localStorage.getItem(key);

        if(!raw)
            return null;

        return JSON.parse(raw);
    }
}

