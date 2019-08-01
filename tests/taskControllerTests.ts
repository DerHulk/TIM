import {expect } from 'chai';
import { IApplicationContext, EventEmitter, ApplicationContext } from '../app/applicationContext';
import { TaskController } from '../app/taskController';
import { TaskEntity } from '../common/taskEntity';


describe('taskController', () => {
    it('will sync the task from the companion with the local', () => {
        var context : IApplicationContext = {
             Emitter: new EventEmitter(),
             ReadTaskFile: ()=> { 
                 var result = new Array<TaskEntity>();
                 return result;
             },
            WriteTaskFile: ()=> {

            }
         } ;        
        var newFromCompanion = new Array<TaskEntity>();       
        var target = new TaskController(context);        

        context.Emitter.emit(ApplicationContext.OnSyncTasks, newFromCompanion );

        expect(target).to.be.not.null;
    });
});