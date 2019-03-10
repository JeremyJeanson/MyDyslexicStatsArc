/*
  Responsible for loading, applying and saving settings.
  Requires companion/simple/companion-settings.ts
  Callback should be used to update your UI.
*/
import { me } from "appbit";
import * as fs from "fs";
import * as messaging from "messaging";

const SETTINGS_TYPE = "cbor";
const SETTINGS_FILE = "settings.cbor";

let settings:any;
let onsettingschange:(settings:any)=>void;

export function initialize(callback:(settings:any)=>void) : void {
  settings = loadSettings();
  onsettingschange = callback;
  onsettingschange(settings);
}

// Received message containing settings data
messaging.peerSocket.addEventListener("message", function(evt):void {
  settings[evt.data.key] = evt.data.value;
  onsettingschange(settings);
});

// Register for the unload event
me.addEventListener("unload", saveSettings);

// Load settings from filesystem
function loadSettings(): any {
  try {
    return fs.readFileSync(SETTINGS_FILE, SETTINGS_TYPE);
  } catch (ex) {
    return {};
  }
}

// Save settings to the filesystem
function saveSettings() : void {
  fs.writeFileSync(SETTINGS_FILE, settings, SETTINGS_TYPE);
}
