import { ApplicationContext } from './applicationContext';
import { TaskEntity } from '../common/taskEntity';


export class TaskController {

    constructor(private appContext: ApplicationContext) {

        //load local if exist.
        var current = this.appContext.ReadTaskFile();
        this.appContext.Emitter.emit(ApplicationContext.OnTaskListChanged, current);

        //event
        appContext.Emitter.add(ApplicationContext.OnSyncTasks, (x: Array<TaskEntity>) => {                               
            this.appContext.Emitter.emit(ApplicationContext.OnTaskListChanged, x);
            this.appContext.WriteTaskFile(x);
        });
    }
}