import { expect } from 'chai';
import { TaskController } from '../app/taskController';
import { TaskEntity } from '../common/taskEntity';
import { TaskStatusTuple } from '../common/taskStatusTuple';
import * as appEvent from '../app/constant';
import { IApplicationContext } from '../app/IApplicationContext';
import { EventEmitter } from '../app/EventEmitter';


describe('taskController', () => {

    var newFromCompanion = new Array<TaskStatusTuple>();
    var oldOnDevice = new Array<TaskEntity>();
    var result = new Array<TaskEntity>();
    var appContext: IApplicationContext;
    var target : TaskController;

    beforeEach(() => {
        appContext = {
            Emitter: new EventEmitter(),
            ReadTaskFile: () => {
                return oldOnDevice;
            },
            WriteTaskFile: (toWrite: Array<TaskEntity>) => {
                result = toWrite;
            },
            device: null,
        };

        target = new TaskController(appContext);
    })
   
    context('updateLocal', ()=> {
        it('updates the local list with the new from the companion',()=> {
            //arrange

            //act
            target.updateLocal(null);
            //assert
                
        });        
    });
});