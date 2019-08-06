import { expect } from 'chai';
import { processNewFiles, bindTask } from '../app/taskBinder';
import { ApplicationContext } from '../app/applicationContext';
import { IApplicationContext } from '../app/IApplicationContext';
import { TaskEntity } from '../common/taskEntity';
import { EventEmitter } from '../app/EventEmitter';
import * as appEvent from '../app/constant';
import { bindRecord } from '../app/recordBinder';
import { RecordController } from '../app/recordController';
import { TaskController } from '../app/taskController';

describe('taskBinder', () => {

    var appContext: IApplicationContext;

    beforeEach(() => {
        appContext = {
            device: null,
            Emitter: null,
            ReadTaskFile: null,
            WriteTaskFile: null,
            UpdateTaskFile: null
        };
    });
    context('processNewFiles', () => {



        it('emit the OnSyncTasks event if a new file comes from the inbox', () => {

            //arrange
            var eventWasCalled = false;
            var fileNameQueue = new Array<any>(); //https://stackoverflow.com/questions/1590247/how-do-you-implement-a-stack-and-a-queue-in-javascript
            fileNameQueue.push('someTaskname');
            fileNameQueue.push(null);

            appContext.Emitter = new EventEmitter();
            appContext.device = {
                getNextFileNameFromInbox: () => fileNameQueue.shift(),
                readTaskListFile: (fileName: string) => new Array<TaskEntity>(),
                onNewInboxFile: null,
                enqueue: null,
                getDocumentElementById: null,
                isDisplayOn: null,
                onClockTick: (x, y) => { },
                onDisplayChange: (x) => { },
            };

            appContext.Emitter.add(appEvent.OnSyncTasks, () => {
                eventWasCalled = true;
            });

            //act
            processNewFiles(appContext);

            //assert
            expect(eventWasCalled).to.be.true;

        });
    });

    context('bindTask', () => {

        it('add an event-hanler which enque a task back to the companion if the updateTask event was thrown', () => {

            //arrange
            appContext.Emitter = new EventEmitter();

            var controller = new TaskController(appContext);
            var updateTask = new TaskEntity(1, 'I was updated');
            var enqueuedTask: TaskEntity;

            appContext.ReadTaskFile = () => new Array<TaskEntity>();

            appContext.device = {
                getNextFileNameFromInbox: () => null,
                readTaskListFile: (fileName: string) => new Array<TaskEntity>(),
                onNewInboxFile: (x)=> {},
                enqueue: (x) => enqueuedTask = x,
                getDocumentElementById: (x)=> { return { forEach: (a:any,b:any)=> {} }},
                isDisplayOn: null,
                onClockTick: (x, y) => { },
                onDisplayChange: (x) => { },
            };

            //act
            bindTask(appContext, controller);
            appContext.Emitter.emit(appEvent.OnTaskUpdated, updateTask);

            //assert
            expect(enqueuedTask).to.be.equal(updateTask);

        });
    });
});