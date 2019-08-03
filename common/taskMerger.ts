import { TaskEntity } from './taskEntity';
import { TaskStatus } from './enums';

export class TaskMerger {

    public Merge(serverList: any[], compantionList: TaskEntity[]):Array<any> {

        var result = new Array<any>();
        serverList.forEach(serverItem=> {
            
            if(serverItem.id || serverItem.Id || serverItem.ID){                            

                var corresponding = compantionList.find(x=> (x.id === serverItem.id || x.id === serverItem.Id || x.id === serverItem.ID) && x.timeInMs != undefined);

                if(corresponding){
                    var merge = this.MergeItem(serverItem, corresponding);
                    result.push(merge);
                }
                else {
                    result.push(serverItem);
                }                                                                
            }                
        });

        return result;
    }
    
    public MergeItem(serverItem:any, companionItem: TaskEntity): any {

        if(serverItem && companionItem){
            var merge :any = {};

            Object.keys(serverItem)
                .forEach(key => merge[key] = serverItem[key]);
                                 
            merge.timeInMs = companionItem.timeInMs;        
            return merge;
        }

        return null;        
    }

}