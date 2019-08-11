import { expect, assert } from 'chai';
import { RecordController } from '../app/recordController';
import { ApplicationContext } from '../app/applicationContext';
import { TaskEntity } from '../common/taskEntity';
import { doesNotReject, AssertionError } from 'assert';
import * as appEvent from '../app/constant';
import { TIMEOUT } from 'dns';
import { IApplicationContext } from '../app/IApplicationContext';
import { EventEmitter } from '../app/EventEmitter';
import { Done } from 'mocha';
import { IDeviceContext } from '../app/IdeviceContext';

describe('RecordController', () => {
    it('throws event if finished', () => {
        var device : IDeviceContext = {
            enqueue: null,
            getDocumentElementById: null,
            getNextFileNameFromInbox: null,
            isDisplayOn: null,
            onClockTick: null,
            onDisplayChange: null,
            onNewInboxFile: null,
            readTaskListFile: null,
        };
        var appcontext = new ApplicationContext(device);
        var target = new RecordController(appcontext);
        var task = new TaskEntity();

        appcontext.Emitter.add(appEvent.OnTaskUpdated, (args: TaskEntity) => {
            assert.equal(args, task);
            expect(args).to.be.equal(task);
        });

        target.finished();
    });

    context('finishe', () => {
        var toWriteParameter: TaskEntity;

        var appcontext: IApplicationContext = {
            Emitter: new EventEmitter,
            UpdateTaskFile: (toWrite) => {
                toWriteParameter = toWrite;
            },
            WriteTaskFile: null,
            ReadTaskFile: null,
            device: null,
        };
        var target = new RecordController(appcontext);

        it('updates the local tasks', (done: Done) => {

            //arrange
            var task = new TaskEntity(1, "test");
            appcontext.Emitter.emit(appEvent.OnTaskSelected, task);
            target.start();

            setTimeout(function () {
                //act            
                target.finished();

                //assert    
                expect(task.timeInMs).to.be.greaterThan(0)
                expect(task).to.be.equals(toWriteParameter);
                done();
            }, 100);
        });

        it('emit the OnTaskUpdated event', () => {
            //arrange
            var task = new TaskEntity(1, "test");
            var eventWasCalled = false;
            appcontext.Emitter.emit(appEvent.OnTaskUpdated, task);
            appcontext.Emitter.add(appEvent.OnTaskUpdated, () => eventWasCalled = true);

            //act            
            target.finished();

            //assert 
            expect(eventWasCalled).to.be.true;        
    });

});
});