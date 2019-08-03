export interface IEventEmitter {
    // maintain a list of listeners
    add(theEvent: string, theHandler: any): void;

    // remove a listener
    remove(theEvent: string, theHandler: any): void;

    // dispatch event to all listeners
    emit(theEvent: string, args: any): void;

}