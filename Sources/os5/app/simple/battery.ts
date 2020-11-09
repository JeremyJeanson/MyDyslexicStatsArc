import document from 'document';
import { battery } from "power";
import * as utils from "./utils";

const _low = 30;
let _callback: (number) => void;

/**
 * Method to update battery level inforamtions
 * @param callback 
 */
export function initialize(callback: (batteryLevel: number) => void): void {
  // Save callback
  _callback = callback;

  // On battery level change
  battery.onchange = update;

  // First call
  update();
}

/**
 * Update the symbol icon and use the callback
 */
function update() {
  const result = battery.chargeLevel;
  const symbol = document.getElementById("battery-symbol") as GraphicsElement;
  const image = document.getElementById("battery-icon") as GraphicsElement;
  if (symbol && image) {
    if (result <= _low) {
      image.class = "low";
      utils.highlight(symbol);
    } else if (result <= 50) {
      image.class = "middle";
    } else {
      image.class = "";
    }
  }

  // Call
  _callback(result);
}

/**
 * Is battery low
 */
export function isLow(): boolean {
  return battery.chargeLevel <= _low;
}