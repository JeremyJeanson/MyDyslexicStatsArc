import document from "document";
import * as util from "./simple/utils";

// import clock from "clock";
import * as simpleMinutes from "./simple/clock-strings";

// Device form screen detection
import { me as device } from "device";

// Elements for style
const _container = document.getElementById("container") as GraphicsElement;
const _background = document.getElementById("background") as RectElement;
const _batteryBackground = document.getElementById("battery-bar-background") as GradientArcElement;

// Date
const _datesContainer = document.getElementById("date-container") as GraphicsElement
const _dates1Container = document.getElementById("date1-container") as GraphicsElement;
const _dates1 = _dates1Container.getElementsByTagName("image") as ImageElement[];
const _dates2Container = document.getElementById("date2-container") as GraphicsElement;
const _dates2 = _dates2Container.getElementsByTagName("image") as ImageElement[];

// Hours
const _clockContainer = document.getElementById("clock-container") as GraphicsElement;
const _cloks = document.getElementById("clock-container").getElementsByTagName("image") as ImageElement[];

// Battery
const _batteryValueContainer = document.getElementById("battery-bar-container") as GraphicsElement;
const _batteryBar = document.getElementById("battery-bar-value") as GradientRectElement;
const _batteryTextContainer = document.getElementById("battery-container") as GraphicsElement;
const _batteries = _batteryTextContainer.getElementsByTagName("image") as ImageElement[];

// Stats
const _statsContainer = document.getElementsByClassName("stats-container")[0] as GraphicsElement;
const _stats = _statsContainer.getElementsByTagName("svg") as GraphicsElement[];

// Current settings
import { Settings } from "../common";
const _settings = new Settings();
// --------------------------------------------------------------------------------
// Clock
// --------------------------------------------------------------------------------
// Update the clock every seconds
simpleMinutes.initialize("seconds", (clock) => {
  // clock.Hours = "21";
  // clock.Minutes ="38";
  // Hours
  if (clock.Hours !== undefined) {
    _cloks[0].href = util.getImageFromLeft(clock.Hours, 0);
    _cloks[1].href = util.getImageFromLeft(clock.Hours, 1);
  }

  // Minutes
  if (clock.Minutes !== undefined) {
    _cloks[3].href = util.getImageFromLeft(clock.Minutes, 0);
    _cloks[4].href = util.getImageFromLeft(clock.Minutes, 1);
  }

  // Date 1
  if (clock.Date1 !== undefined) {
    // Position
    _dates1Container.x = (device.screen.width) - (clock.Date1.length * 20);
    // Values
    util.display(clock.Date1, _dates1);
  }

  // Date 2
  if (clock.Date2 !== undefined) {
    // Position
    _dates2Container.x = (device.screen.width) - (clock.Date2.length * 20);
    // Values
    util.display(clock.Date2, _dates2);
  }

  // update all stats
  UpdateActivities();
});

// --------------------------------------------------------------------------------
// Power
// --------------------------------------------------------------------------------
import * as batterySimple from "./simple/power-battery";

// Method to update battery level informations
batterySimple.initialize((battery) => {
  let batteryString = battery.toString() + "%";
  // Battery bar
  _batteryBar.width = Math.floor(battery) * device.screen.width / 100;

  // Battery text
  let max = _batteries.length - 1;
  for (let i = 0; i < max; i++) {
    _batteries[i + 1].href = util.getImageFromLeft(batteryString, i);
  }
});
// --------------------------------------------------------------------------------
// Settings
// --------------------------------------------------------------------------------
import * as simpleSettings from "simple-fitbit-settings/app";

simpleSettings.initialize(
  _settings,
  (settingsNew: Settings) => {
    if (!settingsNew) {
      return;
    }

    if (settingsNew.showBatteryPourcentage !== undefined) {
      _batteryTextContainer.style.display = settingsNew.showBatteryPourcentage
        ? "inline"
        : "none";
    }

    if (settingsNew.showBatteryBar !== undefined) {
      _batteryValueContainer.style.display = settingsNew.showBatteryBar
        ? "inline"
        : "none";
    }

    if (settingsNew.colorBackground !== undefined) {
      _background.style.fill = settingsNew.colorBackground;
      _batteryBackground.gradient.colors.c2 = settingsNew.colorBackground;
      UpdateActivities(); // For achivement color
    }

    if (settingsNew.colorForeground !== undefined) {
      _container.style.fill = settingsNew.colorForeground;
    }

    // Display based on 12H or 24H format
    if (settingsNew.clockDisplay24 !== undefined) {
      simpleMinutes.updateClockDisplay24(settingsNew.clockDisplay24);
    }
  });
// --------------------------------------------------------------------------------
// Activity
// --------------------------------------------------------------------------------
import * as simpleActivities from "simple-fitbit-activities";

// Update Style when elevation isnot available
if (!simpleActivities.elevationIsAvailable()) {
  // Hide the elevation informations
  _stats[4].style.display = "none";
  _statsContainer.class="stats-container no-elevation";
}

simpleActivities.initialize(UpdateActivities);

// Update Activities informations
function UpdateActivities(): void {
  const activities = simpleActivities.getNewValues();
  RenderActivity(_stats[0], activities.steps);  
  RenderActivity(_stats[1], activities.calories);
  RenderActivity(_stats[2], activities.activeMinutes);
  RenderActivity(_stats[3], activities.distance);
  RenderActivity(_stats[4], activities.elevationGain);
}

// Render an activity
function RenderActivity(container: GraphicsElement, activity: simpleActivities.Activity): void {
  if (activity === undefined) return;
  let arc = container.getElementsByTagName("arc")[1] as ArcElement;
  let circle = container.getElementsByTagName("circle")[0] as CircleElement;
  let image = container.getElementsByTagName("image")[0] as ImageElement;

  // Goals ok
  if (activity.goalReached()) {
    circle.style.display = "inline";
    arc.style.display = "none";
    image.style.fill = _background.style.fill;
  }
  else {
    circle.style.display = "none";
    arc.style.display = "inline";
    arc.sweepAngle = activity.as360Arc();
    image.style.fill = container.style.fill;
  }
}

// --------------------------------------------------------------------------------
// Allways On Display
// --------------------------------------------------------------------------------
import { me } from "appbit";
import { display } from "display";
import clock from "clock"

// does the device support AOD, and can I use it?
if (display.aodAvailable && me.permissions.granted("access_aod")) {
  // tell the system we support AOD
  display.aodAllowed = true;

  // respond to display change events
  display.addEventListener("change", () => {

    // console.info(`${display.aodAvailable} ${display.aodEnabled} ${me.permissions.granted("access_aod")} ${display.aodAllowed} ${display.aodActive}`);

    // Is AOD inactive and the display is on?
    if (!display.aodActive && display.on) {
      clock.granularity = "seconds";

      // Show elements & start sensors
      _background.style.display = "inline";
      if (_settings.showBatteryPourcentage) _batteryTextContainer.style.display = "inline";
      if (_settings.showBatteryBar) _batteryValueContainer.style.display = "inline";
      _datesContainer.style.display = "inline";
      _statsContainer.style.display = "inline";

      // hours position
      _clockContainer.height = 100;
      _clockContainer.width = 300;
      _clockContainer.x = (device.screen.width - 300) / 2;
      _clockContainer.y = (device.screen.height - 100) / 2 - 15;
    } else {
      clock.granularity = "minutes";

      // hours position
      _clockContainer.height = 50;
      _clockContainer.width = 150;
      _clockContainer.x = (device.screen.width - 150) / 2;
      _clockContainer.y = (device.screen.height - 50) / 2;

      // Hide elements
      _background.style.display = "none";
      _datesContainer.style.display = "none";
      _batteryTextContainer.style.display = "none";
      _batteryValueContainer.style.display = "none";
      _statsContainer.style.display = "none";
    }
  });
}