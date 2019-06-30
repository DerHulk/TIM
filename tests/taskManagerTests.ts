import {expect } from 'chai';
import { TaskConverter } from '../companion/taskConverter';

describe('TaskManager', () => {
    it('can be initialized without an initializer', () => {
        var target = new TaskConverter();
        expect(target).to.be.not.null;
    });
});