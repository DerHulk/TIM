import { TaskEntity } from '../common/taskEntity';

export class TaskExchanger {

    constructor(private localTasks: Array<TaskEntity>) {

    }

    NeedDeviceUpdate(serverTasks: Array<any>): boolean {

        if (!serverTasks)
            return false;

        var result = false;
        serverTasks = this.WhereIsValid(serverTasks);

        if (!serverTasks || serverTasks.length <= 0)
            return false;

        serverTasks.forEach(serverItem => {

            if (!result) {
                if (!this.localTasks.some(local => local.id === serverItem.id))
                    result = true;

                if (this.localTasks.some(local => local.id === serverItem.id && local.titel !== serverItem.titel))
                    result = true;
            }
        });

        this.localTasks.forEach(local => {
            if (!result) {
                if (!serverTasks.some(serverItem => local.id === serverItem.id))
                    result = true;
            }
        });

        return result;
    }

    public WhereIsValid(source: Array<TaskEntity>): Array<TaskEntity> {
        return source.filter(x => x.id && x.titel);
    }
}