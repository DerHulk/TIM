import {expect } from 'chai';
import { TaskManager } from '../companion/taskManager';

describe('TaskManager', () => {
    it('can be initialized without an initializer', () => {
        var target = new TaskManager();
        expect(target).to.be.not.null;
    });
});