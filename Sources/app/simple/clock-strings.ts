import clock from "clock"
import { preferences, locale } from "user-settings";

// Localisation
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

import * as util from "./utils";
type Granularity = 'off' | 'seconds' | 'minutes' | 'hours';

// Last values
let _hoursLast: string;
let _minsLast: string;
let _dateLast: string;

// Initialize the call back
export function initialize(granularity: Granularity, callback: (hours: string, mins: string, date: string) => void): void {
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
        if (hoursOut.length === 1) hoursOut = " " + hoursOut;

        // Format the minutes
        let minOut = util.zeroPad(today.getMinutes());

        // Foramat the date
        let day = today.getDate();
        let languageFr = locale.language === "fr-fr";
        let month = _months[today.getMonth()];

        let dateOut = languageFr
            ? `${day} ${month}`
            : `${month} ${day}`;

        // Save or updage states
        if (_hoursLast != hoursOut) {
            _hoursLast = hoursOut;
        }
        else {
            hoursOut = null;
        }

        if (_minsLast != minOut) {
            _minsLast = minOut;
        }
        else {
            minOut = null;
        }

        if (_dateLast != dateOut) {
            _dateLast = dateOut;
        }
        else {
            dateOut = null;
        }
        // Call the callback
        callback(hoursOut, minOut, dateOut)
    };
}