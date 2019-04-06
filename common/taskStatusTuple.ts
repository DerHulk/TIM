import { TaskEntity } from './taskEntity';
import { TaskStatus } from './enums';

export class TaskStatusTuple {

    constructor(public task?: TaskEntity, public status?: TaskStatus) {        
    }
   
}