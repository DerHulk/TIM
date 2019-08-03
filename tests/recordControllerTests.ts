import { expect, assert } from 'chai';
import { RecordController } from '../app/recordController';
import { ApplicationContext } from '../app/applicationContext';
import { TaskEntity } from '../common/taskEntity';
import { doesNotReject, AssertionError } from 'assert';
import * as appEvent from '../app/constant';

describe('RecordController', () => {
    it('throws event if finished', () => {
        var appcontext = new ApplicationContext();
        var target = new RecordController(appcontext);
        var task = new TaskEntity();

        appcontext.Emitter.add(appEvent.OnTaskUpdated, (args:TaskEntity) => {
            assert.equal(args, task);
            expect(args).to.be.equal(task);
         });

        target.finished();
    });
});