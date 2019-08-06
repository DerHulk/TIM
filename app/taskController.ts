import { ApplicationContext } from './applicationContext';
import { TaskEntity } from '../common/taskEntity';
import { TaskStatusTuple } from '../common/taskStatusTuple';
import { TaskStatus } from '../common/enums';
import * as appEvent from './constant';
import { IApplicationContext } from './IApplicationContext';
import { TaskMerger } from '../common/taskMerger';


export class TaskController {

    private  loadedItems: Array<TaskEntity>;

    constructor(private appContext: IApplicationContext) {

        //event
        appContext.Emitter.add(appEvent.OnSyncTasks, (x: Array<TaskEntity>) => {
            this.updateLocal(x);
        });
    }

    public loadLocal() {
        var current = this.appContext.ReadTaskFile();
        this.appContext.Emitter.emit(appEvent.OnTaskListChanged, current);
    }

    public updateLocal(serverTasks: Array<TaskEntity>) {
        
        var current = this.appContext.ReadTaskFile();        
        
        if (current && current.length > 0){

            var merger = new TaskMerger();
            current = merger.Merge(serverTasks, current);
            
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