import { expect } from 'chai';
import { CompanionController } from '../companion/companionController';
import { UrlContext } from '../companion/urlContext';
import { promises } from 'fs';
import { TaskEntity } from '../common/taskEntity';
import { Done } from 'mocha';
import { ArrayBufferHelper } from '../common/arrayBufferHelper';

describe('CompanionController', () => {

    var target: CompanionController;
    var urlContext: UrlContext;
    var localItems = new Array<TaskEntity>();
    var serveritems = new Array<TaskEntity>();

    beforeEach(() => {
        target = new CompanionController();
        urlContext = {
            companion: { enqueue: () => { }, getNextFileNameFromInbox: null, getLocalObject: null, getSettingsObject: null, saveLocalObject: null },
            downloader: {
                download: (x) => new Promise<ArrayBuffer>((resolve: any, reject: any) => resolve(Buffer.from('test'))),
                map: (x) => serveritems
            },
            save: () => { },
            tasks: localItems,
            uploader: null,
            url: '',
            taskConverter: null,
        };
    });

    context('pullFromServerPushToDevice', () => {

        it('should not push to the device if the exchanger say it is not needed.', (done: Done) => {
            //arrange
            var enqueWasCalled = false;
            var saveWasCalled = false;

            urlContext.companion.enqueue = () => { enqueWasCalled = true };
            urlContext.save = () => { saveWasCalled = true };

            //act
            target.pullFromServerPushToDevice(urlContext).then(x => {

                //assert
                expect(enqueWasCalled).to.be.false;
                expect(saveWasCalled).to.be.false;
                done();
            });
        });

        it('should push to the device if the exchanger say it is needed.', (done: Done) => {
            //arrange
            var enqueWasCalled = false;
            var saveWasCalled = false;

            serveritems.push(new TaskEntity(1, 'test'));

            urlContext.companion.enqueue = () => { enqueWasCalled = true };
            urlContext.save = () => { saveWasCalled = true };

            //act
            target.pullFromServerPushToDevice(urlContext).then(x => {

                //assert
                expect(enqueWasCalled).to.be.true;
                expect(saveWasCalled).to.be.true;
                done();
            });
        });

    });

    context('receiveFromDevicePushToServer', () => {

        it('handle a new inbox file and updates the local tasks.', async () => {
            //arrange            
            var deviceQueue = new Array<TaskEntity>();
            localItems = new Array<TaskEntity>();
            localItems.push(new TaskEntity(1, "I am the first in the queue."));
            localItems.push(new TaskEntity(2, "I am the second in the queue."));
            localItems.push(new TaskEntity(3, "I am not in the queue."));

            localItems[0].timeInMs = 10;
            localItems[1].timeInMs = 0;

            deviceQueue.push(new TaskEntity(1, "I am the first in the queue."));
            deviceQueue.push(new TaskEntity(2, "I am the second in the queue."));

            deviceQueue[0].timeInMs = 100;
            deviceQueue[1].timeInMs = 200;

            urlContext.companion.getNextFileNameFromInbox = () => {

                return new Promise(resolve=> {
                    var pop = deviceQueue.shift()

                    if (pop)
                       resolve(ArrayBufferHelper.ObjectToBuffer(pop));
                    else
                        resolve(null);
                });                
            };
            urlContext.save = () => { };
            urlContext.uploader = {
                upload: (x) => { 
                    return new Promise<any>((r) => r(0)) },
            };

            //act
            await target.receiveFromDevicePushToServer(urlContext);

            //assert            
            expect(urlContext.tasks[0].timeInMs).to.be.equal(100);
            expect(urlContext.tasks[1].timeInMs).to.be.equal(200);
        });

        it('call the save methode on the context.', async () => {
            //arrange            
            var deviceQueue = new Array<TaskEntity>();
            var saveWasCalled = false;
            
            localItems = new Array<TaskEntity>();
            localItems.push(new TaskEntity(1, "I am the first in the queue."));
            deviceQueue.push(new TaskEntity(1, "I am the first in the queue."));
            deviceQueue[0].timeInMs = 100;

            urlContext.companion.getNextFileNameFromInbox = () => {

                return new Promise(resolve=> {
                    var pop = deviceQueue.shift()

                    if (pop)
                       resolve(ArrayBufferHelper.ObjectToBuffer(pop));
                    else
                        resolve(null);
                });                
            };
            urlContext.save = () => saveWasCalled = true;
            urlContext.uploader = {
                upload: (x) => { 
                    return new Promise<any>((r) => r(0)) },
            };

            //act
            await target.receiveFromDevicePushToServer(urlContext);

            //assert
            expect(saveWasCalled).to.be.true;
            expect(urlContext.tasks.length).to.be.equal(3);
        });
    });
});