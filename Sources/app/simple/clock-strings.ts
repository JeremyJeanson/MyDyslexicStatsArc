import clock from "clock"
import { locale } from "user-settings";

// Localisation
import { gettext } from "i18n";
const _months = [
    gettext("month01"),
    gettext("month02"),
    gettext("month03"),
    gettext("month04"),
    gettext("month05"),
    gettext("month06"),
    gettext("month07"),
    gettext("month08"),
    gettext("month09"),
    gettext("month10"),
    gettext("month11"),
    gettext("month12")
];

const _days = [
    gettext("day0"),
    gettext("day1"),
    gettext("day2"),
    gettext("day3"),
    gettext("day4"),
    gettext("day5"),
    gettext("day6")
];

import * as util from "./utils";
type Granularity = "off" | "seconds" | "minutes" | "hours";
type AmOrPm = "AM" | "PM" | "";

export class FormatedDate {
    Hours: string;
    Minutes: string;
    Date1: string;
    Date2: string;
    AmOrPm: AmOrPm;
}

// Callback
let _callback: (clock: FormatedDate) => void;

// H24 setting
let _clockDisplay24: boolean;

// Last values
let _lastDate: Date;

// Ouputs
let _lastFormatedDate: FormatedDate;

// Initialize the call back
export function initialize(granularity: Granularity, callback: (clock: FormatedDate) => void): void {
    // Tick every minutes
    clock.granularity = granularity;

    _callback = callback;

    // Tick
    clock.ontick = (evt) => {
        update(evt.date);
    };
}

// Update the user setting
export function updateClockDisplay24(value: boolean): void {
    _clockDisplay24 = value;
    update(_lastDate);
}

// Return the last date
export function getLast(): FormatedDate {
    return _lastFormatedDate;
}

// Update the clock
function update(date: Date): void {
    if (date === undefined) return;
    // last date
    _lastDate = date;

    // Las output
    if (_lastFormatedDate === undefined) {
        _lastFormatedDate = new FormatedDate();
    }

    // Declare ouputs
    const ouput = new FormatedDate();
    const hours: number = date.getHours();

    // Format the hour
    ouput.Hours = formatHours(hours);

    // Format AM / PM if requested
    if (_clockDisplay24 === undefined || _clockDisplay24 === true) {
        // No AM or PM
        ouput.AmOrPm = "";
    }
    else {
        // AM / PM are available
        ouput.AmOrPm = hours < 12 ? "AM" : "PM";
    }

    // Format the minutes
    ouput.Minutes = util.zeroPad(date.getMinutes());

    // Format the date
    setDate(ouput, date);

    // Save or updage states
    if (ouput.Hours !== _lastFormatedDate.Hours) {
        _lastFormatedDate.Hours = ouput.Hours;
    }
    else {
        ouput.Hours = undefined;
    }

    if (ouput.Minutes !== _lastFormatedDate.Minutes) {
        _lastFormatedDate.Minutes = ouput.Minutes;
    }
    else {
        ouput.Minutes = undefined;
    }

    if (ouput.Date1 !== _lastFormatedDate.Date1) {
        _lastFormatedDate.Date1 = ouput.Date1;
    }
    else {
        ouput.Date1 = undefined;
    }

    if (ouput.Date2 !== _lastFormatedDate.Date2) {
        _lastFormatedDate.Date2 = ouput.Date2;
    }
    else {
        ouput.Date2 = undefined;
    }


    if (ouput.AmOrPm !== _lastFormatedDate.AmOrPm) {
        _lastFormatedDate.AmOrPm = ouput.AmOrPm;
    }
    else {
        ouput.AmOrPm = undefined;
    }
    
    // Call the callback
    _callback(ouput)
};

// Format the hours, based on user preferences
function formatHours(hours: number): string {
    if (hours === undefined) return undefined;
    let result = _clockDisplay24 === undefined || _clockDisplay24 === true
        ? util.zeroPad(hours)
        : (hours % 12 || 12).toString();
    if (result.length === 1) result = " " + result;
    return result;
}

// Format the date, based on user language
function setDate(output: FormatedDate, date: Date): void {
    const month = _months[date.getMonth()];
    const day = date.getDate();
    const dayOfWeeck = _days[date.getDay()];

    if (locale.language === "fr-fr") {
        output.Date1 = `${day} ${month}`;
    }
    else {
        output.Date1 = `${month} ${day}`;
    }
    output.Date2 = `${dayOfWeeck} ${day}`;
}