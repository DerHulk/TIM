import { TaskEntity } from './taskEntity';
import { TaskStatus } from './enums';

export class TaskStatusTuple {

    constructor(task?: TaskEntity, status?: TaskStatus) {
        this.task = task;
        this.status = status;
    }

    task: TaskEntity;
    status: TaskStatus;
}