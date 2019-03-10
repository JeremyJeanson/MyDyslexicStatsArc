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
const dateContainer = document.getElementById("date-container") as GraphicsElement;
const dates = dateContainer.getElementsByTagName("image") as ImageElement[];

// Hours
const cloks = document.getElementById("clock-container").getElementsByTagName("image") as ImageElement[];

// Battery
const batteryValue = document.getElementById("battery-bar-value") as GradientRectElement;
const batteries = document.getElementById("battery-container").getElementsByTagName("image") as ImageElement[];

// Stats
const stats = document.getElementsByClassName("stats-container")[0].getElementsByTagName("svg") as GraphicsElement[];
// --------------------------------------------------------------------------------
// Clock
// --------------------------------------------------------------------------------
// Update the clock every seconds
simpleMinutes.initialize("seconds", (hours, mins, date) => {
  // hours="20";
  // mins="38";
  // date = "17 jan";
  // Hours
  if(hours) {
    cloks[0].href = util.getImageFromLeft(hours,0);
    cloks[1].href = util.getImageFromLeft(hours,1);
  }

  // Minutes
  if(mins) {    
    cloks[3].href = util.getImageFromLeft(mins,0);
    cloks[4].href = util.getImageFromLeft(mins,1);  
  }

  // Date
  if(date) {
    // Position
    dateContainer.x = (device.screen.width) - (date.length * 20);
    // Values
    for(let i=0; i<dates.length; i++){
      dates[i].href = util.getImageFromLeft(date, i);
    }
  }

    // update od stats
    UpdateActivities();
});

// --------------------------------------------------------------------------------
// Power
// --------------------------------------------------------------------------------
import * as batterySimple from "./simple/power-battery";

// Method to update battery level informations
batterySimple.initialize((battery)=>{
  let batteryString = battery.toString() + "%";
  // Battery bar
  batteryValue.width = Math.floor(battery) * device.screen.width / 100;
  
  // Battery text
  let max = batteries.length - 1;
  for(let i=0; i<max; i++){
    batteries[i+1].href = util.getImageFromLeft(batteryString,i);  
  }
});
// --------------------------------------------------------------------------------
// Settings
// --------------------------------------------------------------------------------
import * as simpleSettings from "./simple/device-settings";

simpleSettings.initialize((data:any) => {
  if (!data) {
    return;
  }

  if (data.colorBackground) {
    background.style.fill = data.colorBackground;
    batteryBackground.gradient.colors.c2 = data.colorBackground;
    UpdateActivities(); // For achivement color
  }

  if (data.colorForeground) {
    container.style.fill = data.colorForeground;
  }
});
// --------------------------------------------------------------------------------
// Activity
// --------------------------------------------------------------------------------
import { goals,today } from "user-activity";

goals.onreachgoal = (evt)=>{
  UpdateActivities();
};

// Update Activities informations
function UpdateActivities():void
{
  RenderActivity(stats[0],goals.steps, today.local.steps);
  RenderActivity(stats[1],goals.elevationGain, today.local.elevationGain);
  RenderActivity(stats[2],goals.calories, today.local.calories);
  RenderActivity(stats[3],goals.activeMinutes, today.local.activeMinutes);
  RenderActivity(stats[4],goals.distance, today.local.distance);  
}

// Render an activity
function RenderActivity(container:GraphicsElement, goal:number, done:number):void
{
  let arc = container.getElementsByTagName("arc")[1] as ArcElement;
  let circle = container.getElementsByTagName("circle")[0] as CircleElement;
  let image = container.getElementsByTagName("image")[0] as ImageElement;

  // Goals ok
  if(done >= goal){
    circle.style.display = "inline";
    arc.style.display= "none";
    image.style.fill = background.style.fill;
  }
  else{
    circle.style.display = "none";
    arc.style.display= "inline";
    arc.sweepAngle = util.activityToAngle(goal,done);
    image.style.fill = container.style.fill;
  }
}