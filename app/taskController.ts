import { ApplicationContext } from './applicationContext';
import { TaskEntity } from '../common/taskEntity';
import { TaskStatusTuple } from '../common/taskStatusTuple';
import { TaskStatus } from '../common/enums';
import * as appEvent from './constant';
import { IApplicationContext } from './IApplicationContext';
import { TaskMerger } from '../common/taskMerger';


export class TaskController {

    public  loadedItems: Array<TaskEntity>;

    constructor(private appContext: IApplicationContext) {

        //event
        appContext.Emitter.add(appEvent.OnSyncTasks, (x: Array<TaskEntity>) => {
            this.updateLocal(x);
        });
    }

    public loadLocal() {
        this.loadedItems = this.appContext.ReadTaskFile();        
        this.appContext.Emitter.emit(appEvent.OnTaskListChanged, this.loadedItems);
    }

    public updateLocal(serverTasks: Array<TaskEntity>) {
        
        var current = this.appContext.ReadTaskFile();        
        
        console.log("[updateLocal] " + current.length);

        if (current && current.length > 0){

            var merger = new TaskMerger();
            current = merger.Merge(serverTasks, current);
            
        }    
        else {
            current = serverTasks;
        }    
            
        current.forEach(x=> {
            if(!x.timeInMs)
                x.timeInMs = 0;            
        });        

        this.appContext.Emitter.emit(appEvent.OnTaskListChanged, current);
        this.appContext.WriteTaskFile(current);
        this.loadedItems = current;         
    }

    public selectByIndex(index:number){              
        this.appContext.Emitter.emit(appEvent.OnTaskSelected, this.loadedItems[index] );
    }
}