import { expect } from 'chai';
import { processNewFiles } from '../app/taskBinder';
import { ApplicationContext } from '../app/applicationContext';
import { IApplicationContext } from '../app/IApplicationContext';
import { TaskEntity } from '../common/taskEntity';
import { EventEmitter } from '../app/EventEmitter';
import * as appEvent from '../app/constant';
import { bindRecord } from '../app/recordBinder';
import { RecordController } from '../app/recordController';
import { strict } from 'assert';

describe('recordBinder', () => {

    var appContext: IApplicationContext;

    beforeEach(() => {
        appContext = {
            device: {
                getNextFileNameFromInbox: null,
                readTaskListFile: null,
                onNewInboxFile: null,
                enqueue: null,
                getDocumentElementById: null,
                isDisplayOn: null,
                onClockTick: null,
                onDisplayChange: null,
            },
            Emitter: new EventEmitter(),
            ReadTaskFile: null,
            WriteTaskFile: null,
            UpdateTaskFile: null
        };
    });

    context('bindRecord', () => {

        it('', () => {
            //arrange
            //var controller = new RecordController(appContext);            
            //act
            //bindRecord(appContext, controller);            

            //assert
            
        });
    });
});