import { me } from "companion";
import { CompanionController } from './companionController';
import { CompanionContext } from './companionContext';

const MILLISECONDS_PER_MINUTE = 1000 * 60;

me.wakeInterval = 30 * MILLISECONDS_PER_MINUTE;

let context = new CompanionContext();
let controller = new CompanionController();

//Companion: The 'wake-interval' API is not yet supported in the Fitbit OS Simulator. Behavior may not match the documentation or real devices.
controller.syncTasks(context);

if (me.launchReasons.peerAppLaunched || me.launchReasons.wokenUp) {
    controller.syncTasks(context);
}
else {
    me.yield();
}