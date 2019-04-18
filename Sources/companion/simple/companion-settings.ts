import * as messaging from "messaging";
import { settingsStorage } from "settings";

export function initialize(): void {
  settingsStorage.onchange = evt => {
    if (evt.oldValue !== evt.newValue) {
      if (evt.newValue) sendValue(evt.key, evt.newValue);
    }
  };
}

function sendValue(key: string, val: string): void {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send({
      key: key,
      value: JSON.parse(val)
    });
  } else {
    console.log("No peerSocket connection");
  }
}

export function setDefaultSetting(key: string, value: any): void {
  let extantValue = settingsStorage.getItem(key);
  if (extantValue === null) settingsStorage.setItem(key, JSON.stringify(value));
}