import { expect } from 'chai';
import { TaskEntity } from '../common/taskEntity';
import { TaskMerger } from '../common/taskMerger';

describe('taskMerger', ()=> {

    var target = new TaskMerger();

    context('MergeItem', ()=> {

        it('merge the timeInMs to an object where the id is the same as the task entity', ()=> {

            var task = new TaskEntity(-1, 'test');
            task.timeInMs = 1245464545;
            var fromServer = { };

            var result = target.MergeItem(fromServer, task );

            expect(result.timeInMs).to.exist;
            expect(result.timeInMs).to.be.equal(task.timeInMs);
        });
        it('return null if the source is null', ()=> {

            var task = new TaskEntity(-1, 'test');
            task.timeInMs = 1245464545;            

            var result = target.MergeItem(null, task );

            expect(result).to.be.null;            
        });
        it('return null if the task is null', ()=> {
            
            var fromServer = { };           
            var result = target.MergeItem(fromServer, null );

            expect(result).to.be.null;            
        });

    });

    context('Merge', ()=> {
        it('will only merge objects with the same id and keep other untouched', ()=> {
            //arrange
            var serverList = new Array<any>();
            var compantionList = new Array<TaskEntity>();

            serverList.push( {id: 1});
            serverList.push( {Id: 2});
            serverList.push( {ID: 3});

            serverList.push( {id: 4});

            compantionList.push(new TaskEntity(1, 'I was on the device.'))
            compantionList.push(new TaskEntity(2, 'Oh me too.'))
            compantionList.push(new TaskEntity(3, 'Really me too.'))

            compantionList[0].timeInMs = 12435894;
            compantionList[1].timeInMs = 89332022;
            compantionList[2].timeInMs = 12;

            //act
            var result = target.Merge(serverList, compantionList);

            //assert
            expect(result.some(x=> {
                if(x.id === 1){
                    expect(x.timeInMs).exist.and.be.eql(compantionList[0].timeInMs);
                    return true;
                }                    
            })).to.be.true;

            expect(result.some(x=> {
                if(x.Id === 2){
                    expect(x.timeInMs).exist.and.be.eql(compantionList[1].timeInMs);
                    return true;
                }                    
            })).to.be.true;

            expect(result.some(x=> {
                if(x.ID === 3){
                    expect(x.timeInMs).exist.and.be.eql(compantionList[2].timeInMs);
                    return true;
                }                    
            })).to.be.true;

            expect(result.some(x=> {
                if(x.id === 4){
                    expect(x.timeInMs).not.exist;
                    return true;
                }                    
            })).to.be.true;

        });
    });

});