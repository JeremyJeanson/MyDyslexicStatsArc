import clock  from "clock" 
import { preferences, locale  } from "user-settings";

// Localisation
import {months as monthsEn} from "../locales/en";
import {months as monthsFr} from "../locales/fr";
import * as util from "./utils";
type Granularity = 'off' | 'seconds' | 'minutes' | 'hours';

// Last values
let hoursLast:string;
let minsLast:string;
let dateLast:string;

// Initialize the call back
export function initialize(granularity:Granularity, callback: (hours:string, mins:string, date:string)=>void) : void {
    // Tick every minutes
    clock.granularity = granularity;

    // Tick
    clock.ontick = (evt) => {
        let today = evt.date;

        // Format the hour
        let hoursNumber = today.getHours();
        let hoursOut = preferences.clockDisplay === "12h"
            ? (hoursNumber % 12 || 12).toString()
            : util.zeroPad(hoursNumber);
        if(hoursOut.length===1) hoursOut = " " + hoursOut;

        // Format the minutes
        let minOut = util.zeroPad(today.getMinutes());

        // Foramat the date
        let day = today.getDate();
        let languageFr = locale.language === "fr-fr" ;
        let month = languageFr
          ? monthsFr[today.getMonth()]
          : monthsEn[today.getMonth()];
        let dateOut = languageFr 
            ?`${day} ${month}`
            :`${month} ${day}`;

        // Save or updage states
        if(hoursLast != hoursOut) {
            hoursLast = hoursOut;
        }
        else {
            hoursOut = null;
        }

        if(minsLast != minOut) {
            minsLast = minOut;
        }
        else {
            minOut = null;
        }

        if(dateLast != dateOut) {
            dateLast = dateOut;
        }
        else {
            dateOut = null;
        }
        // Call the callback
        callback(hoursOut, minOut, dateOut)
    };
}