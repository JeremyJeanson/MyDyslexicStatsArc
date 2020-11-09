// --------------------------------------------------------------------------------
// Methode to simplify acces to event of Display and management of AOD
// --------------------------------------------------------------------------------
import { me } from "appbit";
import { display } from "display";
import clock from "clock"

/**
 * Return true if AOD is available on this device
 */
export const aodAvailable = display.aodAvailable && me.permissions.granted("access_aod");

/**
 * Check if device is in AOD mode
 */
export function isInAodMode(): boolean {
    return aodAvailable && !(!display.aodActive && display.on);
}

/**
 * Initilize this module
 * @param onEnteredAOD 
 * @param onLeavedAOD 
 * @param onDisplayGoOn good place to start animation whe display go on
 */
export function initialize(onEnteredAOD: () => void, onLeavedAOD: () => void, onDisplayGoOn: () => void = undefined) {
    // When display state changed
    display.addEventListener("change", () => {
        // AOD management
        if (aodAvailable) {
            // Is AOD inactive and the display is on?
            if (isInAodMode()) {
                clock.granularity = "minutes";
                onEnteredAOD();
            } else {
                clock.granularity = "seconds";
                onLeavedAOD();
            }
        }
        // Display is on
        if (onDisplayGoOn && display.on) onDisplayGoOn();
    });

    // does the device support AOD, and can I use it?
    if (aodAvailable) {
        // tell the system we support AOD
        display.aodAllowed = true;
    }
}