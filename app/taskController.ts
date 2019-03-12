import { ApplicationContext } from './applicationContext';
import { TaskEntity } from '../common/taskEntity';


export class TaskController {

    constructor(private appContext: ApplicationContext) {

        appContext.Emitter.add(ApplicationContext.OnSyncTasks, (x: Array<TaskEntity>) => {

            //test mix it.
            var current = this.getLocalTasks();
            
            x.forEach(item=> current.push(item));
            this.appContext.Emitter.emit(ApplicationContext.OnTaskListChanged, current);

        });
    }

    public getLocalTasks(): Array<TaskEntity>{
        var result = new Array<TaskEntity>();
        var t1 = new TaskEntity();
        var t2 = new TaskEntity();

        t1.titel = "test 123";
        t2.titel = "Hallo World!";

        result.push(t1, t2);

        return result;
    }
}