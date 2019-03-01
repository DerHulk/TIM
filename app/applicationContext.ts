
interface IEventEmitter {
    // maintain a list of listeners
    add(theEvent: string, theHandler: any): void;

    // remove a listener
    remove(theEvent: string, theHandler: any): void;

    // dispatch event to all listeners
    emit(theEvent: string, args: any): void;

}

class EventEmitter implements IEventEmitter {
    private _eventHandlers: { [id: string]: any; } = {};

    // maintain a list of listeners
    public add(theEvent: string, theHandler: any) {
        this._eventHandlers[theEvent] = this._eventHandlers[theEvent] || [];
        this._eventHandlers[theEvent].push(theHandler);
    }

    // remove a listener
    remove(theEvent: string, theHandler: any) {
        // TODO
    }

    // remove all listeners
    removeAllListeners(theEvent: string) {
        // TODO
    }

    // dispatch event to all listeners
    emit(theEvent: string, args: any) {
        var theHandlers = this._eventHandlers[theEvent];
        if (theHandlers) {
            for (var i = 0; i < theHandlers.length; i += 1) {
                theHandlers[i](args);
                
            }
        }
    }
}

export class ApplicationContext {

    public static OnUpdateElapseTime: string = "1d9ef731-b016-4178-baf4-2ebe2c728260";

    Emitter: IEventEmitter;

    constructor() {
        this.Emitter = new EventEmitter();

    }

}