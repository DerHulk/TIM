import { me } from "companion";
import { CompanionController } from './companionController';

const MILLISECONDS_PER_MINUTE = 1000 * 60;

me.wakeInterval = 30 * MILLISECONDS_PER_MINUTE;

let controler = new CompanionController();

//Companion: The 'wake-interval' API is not yet supported in the Fitbit OS Simulator. Behavior may not match the documentation or real devices.
controler.syncTasks();

if (me.launchReasons.peerAppLaunched || me.launchReasons.wokenUp) {
    controler.syncTasks();
}
else {
    me.yield();
}