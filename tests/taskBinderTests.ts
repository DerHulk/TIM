import { expect } from 'chai';
import { processNewFiles } from '../app/taskBinder';
import { ApplicationContext } from '../app/applicationContext';
import { IApplicationContext } from '../app/IApplicationContext';
import { TaskEntity } from '../common/taskEntity';
import { EventEmitter } from '../app/EventEmitter';
import * as appEvent from '../app/constant';

describe('taskBinder', () => {


    context('processNewFiles', () => {

        var appContext: IApplicationContext;


        beforeEach(() => {
            appContext = {
                device: null,
                Emitter: null,
                ReadTaskFile: null,
                WriteTaskFile: null
            };
        });

        it('emit the OnSyncTasks event if a new file comes from the inbox', () => {

            //arrange
            var eventWasCalled = false;
            var fileNameQueue = new Array<any>(); //https://stackoverflow.com/questions/1590247/how-do-you-implement-a-stack-and-a-queue-in-javascript
            fileNameQueue.push('someTaskname');         
            fileNameQueue.push(null);            
            
            appContext.Emitter = new EventEmitter();
            appContext.device = {                
                getNextFileNameFromInbox: ()=> fileNameQueue.shift(),                 
                readTaskListFile: (fileName:string)=> new Array<TaskEntity>(),
                onNewInboxFile: null, 
                enqueue: null, 
                getDocumentElementById: null,
            };

            appContext.Emitter.add(appEvent.OnSyncTasks, ()=> {
                eventWasCalled = true;
            });

            //act
            processNewFiles(appContext);

            //assert
            expect(eventWasCalled).to.be.true;

        });
    });
});