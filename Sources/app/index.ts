import document from "document";
import * as util from "./simple/utils";

// import clock from "clock";
import * as simpleMinutes from "./simple/clock-strings";

// Device form screen detection
import { me as device } from "device";

// Elements for style
const container = document.getElementById("container") as GraphicsElement;
const background = document.getElementById("background") as RectElement;
const batteryBackground = document.getElementById("battery-bar-background") as GradientArcElement;

// Date
const dates1Container = document.getElementById("date1-container") as GraphicsElement;
const dates1 = dates1Container.getElementsByTagName("image") as ImageElement[];
const dates2Container = document.getElementById("date2-container") as GraphicsElement;
const dates2 = dates2Container.getElementsByTagName("image") as ImageElement[];

// Hours
const cloks = document.getElementById("clock-container").getElementsByTagName("image") as ImageElement[];

// Battery
const _batteryBarContainer = document.getElementById("battery-bar-container") as GraphicsElement;
const _batteryBar = document.getElementById("battery-bar-value") as GradientRectElement;
const _batteriesContainer = document.getElementById("battery-container") as GraphicsElement;
const _batteries = _batteriesContainer.getElementsByTagName("image") as ImageElement[];

// Stats
const stats = document.getElementsByClassName("stats-container")[0].getElementsByTagName("svg") as GraphicsElement[];
// --------------------------------------------------------------------------------
// Clock
// --------------------------------------------------------------------------------
// Update the clock every seconds
simpleMinutes.initialize("seconds", (clock) => {
  // clock.Hours = "21";
  // clock.Minutes ="38";
  // Hours
  if (clock.Hours !== undefined) {
    cloks[0].href = util.getImageFromLeft(clock.Hours, 0);
    cloks[1].href = util.getImageFromLeft(clock.Hours, 1);
  }

  // Minutes
  if (clock.Minutes !== undefined) {
    cloks[3].href = util.getImageFromLeft(clock.Minutes, 0);
    cloks[4].href = util.getImageFromLeft(clock.Minutes, 1);
  }

  // Date 1
  if (clock.Date1 !== undefined) {
    // Position
    dates1Container.x = (device.screen.width) - (clock.Date1.length * 20);
    // Values
    util.display(clock.Date1, dates1);
  }

  // Date 2
  if (clock.Date2 !== undefined) {
    // Position
    dates2Container.x = (device.screen.width) - (clock.Date2.length * 20);
    // Values
    util.display(clock.Date2, dates2);
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
import * as simpleSettings from "./simple/device-settings";

simpleSettings.initialize((settings: any) => {
  if (!settings) {
    return;
  }

  if (settings.showBatteryPourcentage !== undefined) {
    _batteriesContainer.style.display = settings.showBatteryPourcentage === true
      ? "inline"
      : "none";
  }

  if (settings.showBatteryBar !== undefined) {
    _batteryBarContainer.style.display = settings.showBatteryBar === true
      ? "inline"
      : "none";
  }

  if (settings.colorBackground) {
    background.style.fill = settings.colorBackground;
    batteryBackground.gradient.colors.c2 = settings.colorBackground;
    UpdateActivities(); // For achivement color
  }

  if (settings.colorForeground) {
    container.style.fill = settings.colorForeground;
  }

  // Display based on 12H or 24H format
  if (settings.clockDisplay24 !== undefined) {
    simpleMinutes.updateClockDisplay24(settings.clockDisplay24 as boolean);
  }
});
// --------------------------------------------------------------------------------
// Activity
// --------------------------------------------------------------------------------
import { goals, today } from "user-activity";
import { me as appbit } from "appbit";

// Detect limitations of versa light
const _elevationIsAvailablle = appbit.permissions.granted("access_activity")
  && today.local.elevationGain !== undefined;

// Update Style when elevation isnot available
if (!_elevationIsAvailablle) {
  // Hide the elevation informations
  stats[1].style.display = "none";
  stats[2].x = 90;
  stats[3].x = 170;
}

// When goals are reached
goals.onreachgoal = (evt) => {
  UpdateActivities();
};

// Update Activities informations
function UpdateActivities(): void {
  RenderActivity(stats[0], goals.steps, today.local.steps);
  if (_elevationIsAvailablle) RenderActivity(stats[1], goals.elevationGain, today.local.elevationGain);
  RenderActivity(stats[2], goals.calories, today.local.calories);
  RenderActivity(stats[3], goals.activeMinutes, today.local.activeMinutes);
  RenderActivity(stats[4], goals.distance, today.local.distance);
}

// Render an activity
function RenderActivity(container: GraphicsElement, goal: number, done: number): void {
  let arc = container.getElementsByTagName("arc")[1] as ArcElement;
  let circle = container.getElementsByTagName("circle")[0] as CircleElement;
  let image = container.getElementsByTagName("image")[0] as ImageElement;

  // Goals ok
  if (done >= goal) {
    circle.style.display = "inline";
    arc.style.display = "none";
    image.style.fill = background.style.fill;
  }
  else {
    circle.style.display = "none";
    arc.style.display = "inline";
    arc.sweepAngle = util.activityToAngle(goal, done);
    image.style.fill = container.style.fill;
  }
}