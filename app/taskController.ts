import { ApplicationContext } from './applicationContext';
import { TaskEntity } from '../common/taskEntity';
import { TaskStatusTuple } from '../common/taskStatusTuple';
import { TaskStatus } from '../common/enums';


export class TaskController {

    constructor(private appContext: ApplicationContext) {

        //load local if exist.
        var current = this.appContext.ReadTaskFile();
        this.appContext.Emitter.emit(ApplicationContext.OnTaskListChanged, current);

        //event
        appContext.Emitter.add(ApplicationContext.OnSyncTasks, (x: Array<TaskStatusTuple>) => {                               

            var current = this.appContext.ReadTaskFile();

            var toDelete = x.filter(x=> x.status === TaskStatus.Deleted).map(x=> x.task);
            var toUpdate = x.filter(x=> x.status === TaskStatus.Deleted).map(x=> x.task);
            var toAdd = x.filter(x=> x.status === TaskStatus.New).map(x=> x.task);


            current = current.concat(toAdd);            
            current = current.filter(x=> !toDelete.some(d=> d.id == x.id));
            
            toUpdate.forEach(x=>{
                current.filter(f=> f.id == x.id)
                .forEach(u=> u.titel = x.titel);
            });

            this.appContext.Emitter.emit(ApplicationContext.OnTaskListChanged, current);
            this.appContext.WriteTaskFile(current);
        });
    }    
}