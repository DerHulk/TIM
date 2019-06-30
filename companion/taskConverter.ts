import { TaskEntity } from '../common/taskEntity';
import { TaskStatus } from '../common/enums';
import { TaskStatusTuple } from '../common/taskStatusTuple';
import { ArrayBufferHelper } from '../common/arrayBufferHelper';
import { X_OK } from 'constants';
import { UrlContext } from './urlContext';
import { requestContext } from './requestContext';

export class TaskConverter {

    public Convert(context: UrlContext, request: requestContext): Array<TaskStatusTuple> {

        if (!context)
            throw Error("context is null");

        var serverTasks = context.downloader.map(request);        
        var result = new Array<TaskStatusTuple>();
        var existing = this.WhereIsValid(context.tasks);
        serverTasks = this.WhereIsValid(serverTasks);

        serverTasks.forEach(s => {
            if (!existing.some(x => x.id === s.id))
                result.push(new TaskStatusTuple(s, TaskStatus.New));
            else {
                if (existing.some(f => f.id === s.id && f.titel === s.titel)) {
                    result.push(new TaskStatusTuple(s, TaskStatus.None));
                }
                else {
                    console.log("[TaskManager].Update:" + s.titel + " id " + s.id);
                    result.push(new TaskStatusTuple(s, TaskStatus.Updated));
                }
            }
        });

        existing.forEach(x => {
            console.log("[TaskManager].Existing:" + x.titel + " id " + x.id);

            if (!serverTasks.some(f => f.id === x.id)) {
                console.log("[TaskManager].Delete:" + x.titel + " id " + x.id);
                result.push(new TaskStatusTuple(x, TaskStatus.Deleted));
            }
        });

        if (context.url !== request.url)
            existing.forEach(x => result.push(new TaskStatusTuple(x, TaskStatus.Deleted)));

        result.forEach(x => {
            console.log("[TaskManager].Convert result status:" + x.status + " id " + x.task.id + "titel " + x.task.titel);
        });

        return result;
    }

    private WhereIsValid(source: Array<TaskEntity>): Array<TaskEntity> {
        return source.filter(x => x.id && x.titel);
    }
}