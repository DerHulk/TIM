import { expect } from 'chai';
import { CompanionController } from '../companion/companionController';
import { UrlContext } from '../companion/urlContext';
import { promises } from 'fs';
import { TaskEntity } from '../common/taskEntity';
import { Done } from 'mocha';

describe('CompanionController', () => {

    var target: CompanionController;
    var urlContext: UrlContext;
    var localItems = new Array<TaskEntity>();
    var serveritems = new Array<TaskEntity>();

    beforeEach(() => {
        target = new CompanionController();
        urlContext = {
            companionContext: { enqueue: () => { }, handleInbox: null, getLocalObject: null, getSettingsObject: null, saveLocalObject: null },
            downloader: {
                download: (x) => new Promise<ArrayBuffer>((resolve:any, reject:any) => resolve(Buffer.from('test'))),
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
        
        it('should not push to the device if the exchanger say it is not needed.', (done:Done) => {
            //arrange
            var enqueWasCalled = false;
            var saveWasCalled = false;

            urlContext.companionContext.enqueue = () => { enqueWasCalled = true };
            urlContext.save = () => { saveWasCalled = true };

            //act
            target.pullFromServerPushToDevice(urlContext).then(x => {

                //assert
                expect(enqueWasCalled).to.be.false;
                expect(saveWasCalled).to.be.false;
                done();
            });
        });

        it('should push to the device if the exchanger say it is needed.', (done:Done) => {
            //arrange
            var enqueWasCalled = false;
            var saveWasCalled = false;
            
            serveritems.push(new TaskEntity(1,'test'));

            urlContext.companionContext.enqueue = () => { enqueWasCalled = true };
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
  
});