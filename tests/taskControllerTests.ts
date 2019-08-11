import { expect } from 'chai';
import { TaskController } from '../app/taskController';
import { TaskEntity } from '../common/taskEntity';
import { TaskStatusTuple } from '../common/taskStatusTuple';
import * as appEvent from '../app/constant';
import { IApplicationContext } from '../app/IApplicationContext';
import { EventEmitter } from '../app/EventEmitter';
import { equal } from 'assert';


describe('taskController', () => {

    var newFromCompanion = new Array<TaskEntity>();
    var oldOnDevice = new Array<TaskEntity>();
    var result = new Array<TaskEntity>();
    var appContext: IApplicationContext;
    var target: TaskController;

    beforeEach(() => {
        appContext = {
            Emitter: new EventEmitter(),
            ReadTaskFile: () => {
                return oldOnDevice;
            },
            WriteTaskFile: (toWrite: Array<TaskEntity>) => {
                result = toWrite;
            },
            UpdateTaskFile: null,
            device: null,
        };

        target = new TaskController(appContext);
    })

    context('updateLocal', () => {

        //arrange           
        newFromCompanion.push(new TaskEntity(1, 'I am already on the device. But my title has changed.'));
        newFromCompanion.push(new TaskEntity(2, 'I am new at the device'));
        oldOnDevice.push(new TaskEntity(1, 'I am already on the device'));
        oldOnDevice[0].timeInMs = 999;

        it('updates the local list with the new from the companion', () => {


            //act
            target.updateLocal(newFromCompanion);

            //assert            
            expect(result[1].titel).to.be.eq(newFromCompanion[1].titel);
            expect(result[1].timeInMs).to.be.eq(0);
        });

        it('keep the time for existing', () => {


            //act
            target.updateLocal(newFromCompanion);

            //assert                        
            expect(result[0].timeInMs).to.be.eq(oldOnDevice[0].timeInMs);
        });

        it('updates the titel for the existing', () => {


            //act
            target.updateLocal(newFromCompanion);

            //assert            
            expect(result[0].titel).to.be.eq(newFromCompanion[0].titel);
        });

        it('has the new and the old item', () => {
            //act
            target.updateLocal(newFromCompanion);

            //assert            
            expect(result.length).to.be.eq(2);
        });

        it('set the serverlist to the current if nothing is on the device', () => {
            //arrange
            oldOnDevice = new Array<TaskEntity>();

            //act
            target.updateLocal(newFromCompanion);

            //assert
            expect(result).to.be.eq(newFromCompanion);
        });
    });

    context('loadLocal', () => {

        it('loads the local task to the property', () => {

            //arrange
            oldOnDevice.push(new TaskEntity(1,"test"));
            oldOnDevice.push(new TaskEntity(2,"test 2"));

            //act
            target.loadLocal();

            //assert
            expect(target.loadedItems).to.be.equals(oldOnDevice);
        });
    });
});