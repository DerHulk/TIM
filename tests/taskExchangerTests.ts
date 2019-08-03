import { expect } from 'chai';
import { TaskEntity } from '../common/taskEntity';
import { TaskExchanger } from '../companion/taskExchanger';


describe('taskExchanger', () => {
    
    var target: TaskExchanger;
    var localTasks = new Array<TaskEntity>();
    var requestTasks = new Array<any>();

    beforeEach(() => {       
        target = new TaskExchanger(localTasks);
    });

    context('NeedDeviceUpdate', () => {

        it('returns false if all items from the server are still known.', () => {

            //arrange
            requestTasks.push({ id: 1, titel: 'test' });
            localTasks.push(new TaskEntity(1, 'test'));

            //act
            var result = target.NeedDeviceUpdate(requestTasks);

            //assert
            expect(result).to.be.false;
        });

        it('returns true if one items from the server is new.', () => {

            //arrange
            requestTasks.push({ id: 2, titel: 'test' });
            localTasks.push(new TaskEntity(1, 'test'));

            //act
            var result = target.NeedDeviceUpdate(requestTasks);

            //assert    
            expect(result).to.be.true;
        });

        it('returns true if one items from the server has a new titel.', () => {
            //arrange
            requestTasks.push({id: 1, titel: 'test 1'});
            localTasks.push(new TaskEntity(1, 'test'));
            //act
            var result = target.NeedDeviceUpdate(requestTasks);
            //assert
            expect(result).to.be.true;
        });

        it('returns true if one items from the server is removed.', () => {
            //arrange
            requestTasks.push({id: 1, titel: 'test 1'});
            localTasks.push(new TaskEntity(1, 'test 1'));
            localTasks.push(new TaskEntity(2, 'The server deleted my conterpart'));
            //act
            var result = target.NeedDeviceUpdate(requestTasks);
            //assert
            expect(result).to.be.true;
        });

    });
});