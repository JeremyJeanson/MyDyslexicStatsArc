import * as simpleSettings from "simple-fitbit-settings/common";
/**
 * Settings of the application
 */
export class Settings {
    clockFormat: simpleSettings.Selection = { selected: [0], values: [{ name: "user", value: "user" }] };
    showBatteryPourcentage: boolean = true;
    showBatteryBar: boolean = true;
    colorBackground: string = "black";
    colorForeground: string = "white";
}