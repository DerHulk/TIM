import { TaskEntity } from '../common/taskEntity';
import { TaskSource, TaskStatus } from '../common/enums';
import { TaskStatusTuple } from '../common/taskStatusTuple';
import { ArrayBufferHelper } from '../common/arrayBufferHelper';

export class TaskManager {

    public Convert(source:TaskSource, serverResponse:ArrayBuffer, existing:Array<TaskEntity>) : Array<TaskStatusTuple> {

        var serverTasks :Array<TaskEntity>;

        if(!existing)
            existing = new Array<TaskEntity>();

        if(source === TaskSource.Unkown){
            serverTasks = ArrayBufferHelper.BufferToObject<Array<TaskEntity>>(serverResponse);            
        }   
        else
            throw Error("Not Implementated");

        var result = new Array<TaskStatusTuple>();

        serverTasks.forEach(s=> {                        
            if(!existing.some(x=> x.id == s.id))
                result.push(new TaskStatusTuple(s, TaskStatus.New));
        });

        existing.forEach(x=> {            
                        
            if(serverTasks.some(f=> f.id == x.id)){
                
                if(serverTasks.some(f=> f.id == x.id && f.titel == x.titel)){
                    result.push(new TaskStatusTuple(x, TaskStatus.None ));
                }
                else {
                    result.push(new TaskStatusTuple(x, TaskStatus.Updated));
                }

            }
            else{
                result.push(new TaskStatusTuple(x, TaskStatus.Deleted ));
            }

        });

        return result;
    }       
}