import { ApplicationContext, IApplicationContext } from './applicationContext';
import { TaskEntity } from '../common/taskEntity';
import { TaskStatusTuple } from '../common/taskStatusTuple';
import { TaskStatus } from '../common/enums';


export class TaskController {

    private  loadedItems: Array<TaskEntity>;

    constructor(private appContext: IApplicationContext) {

        //event
        appContext.Emitter.add(ApplicationContext.OnSyncTasks, (x: Array<TaskStatusTuple>) => {
            this.updateLocal(x);
        });
    }

    public loadLocal() {
        var current = this.appContext.ReadTaskFile();
        this.appContext.Emitter.emit(ApplicationContext.OnTaskListChanged, current);
    }

    private updateLocal(tupels: Array<TaskStatusTuple>) {

        console.log("[TaskController]updateLocal: was called with:" + tupels.length);

        var current = this.appContext.ReadTaskFile();
        var toDelete = tupels.filter(x => x.status === TaskStatus.Deleted).map(x => x.task);
        var toUpdate = tupels.filter(x => x.status === TaskStatus.Updated).map(x => x.task);
        var toAdd = tupels.filter(x => x.status === TaskStatus.New).map(x => x.task);
        var toKeep = tupels.filter(x => x.status === TaskStatus.None).map(x => x.task);

        console.log("[TaskController]toDelete:" + toDelete.length);
        console.log("[TaskController]toUpdate:" + toUpdate.length);
        console.log("[TaskController]toAdd:" + toAdd.length);
        console.log("[TaskController]totoKeep:" + toKeep.length);

        current = current.concat(toAdd);
        current = current.filter(x => !toDelete.some(d => d.id === x.id));

        toUpdate.forEach(x => {
            current.filter(f => f.id === x.id)
                .forEach(u => {
                    u.titel = x.titel;
                });
        });

        if (current.length === 0)
            current = toKeep.concat(toUpdate);
         
        this.appContext.Emitter.emit(ApplicationContext.OnTaskListChanged, current);
        this.appContext.WriteTaskFile(current);

        this.loadedItems = current;
    }

    public selectByIndex(index:number){          
        this.appContext.Emitter.emit(ApplicationContext.OnTaskSelected, this.loadedItems[index] );
    }
}