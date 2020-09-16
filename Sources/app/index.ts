import document from "document";
import * as util from "./simple/utils";
import * as font from "./simple/font";
// Display & AOD
import * as simpleDisplay from "./simple/display";

// Simpl activities
import * as simpleActivities from "simple-fitbit-activities";
import { ActivitySymbol } from "./simple/activity-symbol";

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
const _clocks = document.getElementById("clock-container").getElementsByTagName("image") as ImageElement[];
const _cloksHours = _clocks.slice(0, 2);
const _cloksMinutes = _clocks.slice(3, 5);

// Battery
const _batteryValueContainer = document.getElementById("battery-bar-container") as GraphicsElement;
const _batteryBar = document.getElementById("battery-bar-value") as GradientRectElement;
const _batteryTextContainer = document.getElementById("battery-container") as GraphicsElement;
const _batteries = document.getElementById("battery-text").getElementsByTagName("image") as ImageElement[];

// Stats
const _statsContainer = document.getElementsByClassName("stats-container")[0] as GraphicsElement;
const _steps = new ActivitySymbol(document.getElementById("steps") as GraphicsElement, _background);
const _calories = new ActivitySymbol(document.getElementById("calories") as GraphicsElement, _background);
const _activesMinutes = new ActivitySymbol(document.getElementById("activesminutes") as GraphicsElement, _background);
const _distance = new ActivitySymbol(document.getElementById("distance") as GraphicsElement, _background);
const _elevation = new ActivitySymbol(document.getElementById("elevation") as GraphicsElement, _background);

// Current settings
import { Settings } from "../common";
const _settings = new Settings();
// --------------------------------------------------------------------------------
// Clock
// --------------------------------------------------------------------------------
// Update the clock every seconds
simpleMinutes.initialize("seconds", (clock) => {
  const folder: font.folder = simpleDisplay.isInAodMode()
    ? "chars-aod"
    : "chars";

  // Hours
  if (clock.Hours !== undefined) {
    font.print(clock.Hours, _cloksHours, folder);
  }

  // Minutes
  if (clock.Minutes !== undefined) {
    font.print(clock.Minutes, _cloksMinutes, folder);
  }

  // Date 1
  if (clock.Date1 !== undefined) {
    // Position
    _dates1Container.x = (device.screen.width) - (clock.Date1.length * 20);
    // Values
    font.print(clock.Date1, _dates1);
  }

  // Date 2
  if (clock.Date2 !== undefined) {
    // Position
    _dates2Container.x = (device.screen.width) - (clock.Date2.length * 20);
    // Values
    font.print(clock.Date2, _dates2);
  }

  // update all stats
  UpdateActivities();
});

function setHoursMinutes(folder: font.folder) {
  // Hours
  font.print(simpleMinutes.last.Hours + ":" + simpleMinutes.last.Minutes, _clocks, folder);
}
// --------------------------------------------------------------------------------
// Power
// --------------------------------------------------------------------------------
import * as batterySimple from "./simple/battery";

// Method to update battery level informations
batterySimple.initialize((battery) => {
  let batteryString = battery.toString() + "%";
  // Battery text
  font.print(batteryString, _batteries);
  // Battery bar
  _batteryBar.width = Math.floor(battery) * device.screen.width / 100;
});

// --------------------------------------------------------------------------------
// Activity
// --------------------------------------------------------------------------------

// Update Style when elevation isnot available
if (!simpleActivities.elevationIsAvailable()) {
  // Hide the elevation informations
  _elevation.hide();
  _statsContainer.class = "stats-container no-elevation";
}

simpleActivities.initialize(UpdateActivities);

// Update Activities informations
function UpdateActivities(): void {
  const activities = simpleActivities.getNewValues();
  _steps.set(activities.steps);
  _calories.set(activities.calories);
  _activesMinutes.set(activities.activeZoneMinutes);
  _distance.set(activities.distance);
  _elevation.set(activities.elevationGain);
}

function refreshActivitiesColors() {
  _steps.refresh();
  _calories.refresh();
  _activesMinutes.refresh();
  _distance.refresh();
  _elevation.refresh();
}

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
      util.setVisibility(_batteryTextContainer, settingsNew.showBatteryPourcentage);
    }

    if (settingsNew.showBatteryBar !== undefined) {
      util.setVisibility(_batteryValueContainer, settingsNew.showBatteryBar);
    }

    if (settingsNew.colorBackground !== undefined) {
      util.fill(_background, settingsNew.colorBackground);
      _batteryBackground.gradient.colors.c2 = settingsNew.colorBackground;
      refreshActivitiesColors(); // For achivement color
    }

    if (settingsNew.colorForeground !== undefined) {
      util.fill(_container, settingsNew.colorForeground);
    }

    // Display based on 12H or 24H format
    if (settingsNew.clockDisplay24 !== undefined) {
      simpleMinutes.updateClockDisplay24(settingsNew.clockDisplay24);
    }
  });

// --------------------------------------------------------------------------------
// Allways On Display
// --------------------------------------------------------------------------------
simpleDisplay.initialize(onEnteredAOD, onLeavedAOD, onDisplayGoOn);

function onEnteredAOD() {
  setHoursMinutes("chars-aod");
  // // hours position
  // _clockContainer.height = 50;
  // _clockContainer.width = 150;
  // _clockContainer.x = (device.screen.width - 150) / 2;
  // _clockContainer.y = (device.screen.height - 50) / 2;

  // Hide elements
  _background.style.display = "none";
  _datesContainer.style.display = "none";
  _batteryTextContainer.style.display = "none";
  _batteryValueContainer.style.display = "none";
  _statsContainer.style.display = "none";
}

function onLeavedAOD() {
  setHoursMinutes("chars");
  // Show elements & start sensors
  _background.style.display = "inline";
  if (_settings.showBatteryPourcentage) _batteryTextContainer.style.display = "inline";
  if (_settings.showBatteryBar) _batteryValueContainer.style.display = "inline";
  _datesContainer.style.display = "inline";
  _statsContainer.style.display = "inline";

  // // hours position
  // _clockContainer.height = 100;
  // _clockContainer.width = 300;
  // _clockContainer.x = (device.screen.width - 300) / 2;
  // _clockContainer.y = (device.screen.height - 100) / 2 - 15;
}

function onDisplayGoOn() {
  _steps.onDiplayGoOn();
  _calories.onDiplayGoOn();
  _activesMinutes.onDiplayGoOn();
  _distance.onDiplayGoOn();
  _elevation.onDiplayGoOn();
  if(batterySimple.isLow()) util.highlight(document.getElementById("battery-symbol") as GraphicsElement);
}