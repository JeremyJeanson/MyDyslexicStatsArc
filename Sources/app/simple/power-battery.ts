import { battery } from "power";

// Method to update battery level inforamtions
export function initialize(callback : (batteryLevel:number)=>void) : void {
  // On battery level change
  battery.onchange = (evt)=> {
    callback(battery.chargeLevel);
  };
  
  // First call
  callback(battery.chargeLevel);
}