import * as utils from "./utils";
import { Activity } from "simple-fitbit-activities";
import document from 'document';

/**
 * Class to manage activity symbol
 */
export class ActivitySymbol {
    /**
     * Symbol managed by this class
     */
    private _symbol: GraphicsElement;
    private _appBackground: GraphicsElement
    private _activity: Activity;

    constructor(symbol: GraphicsElement, appBackground: GraphicsElement) {
        this._symbol = symbol;
        this._appBackground = appBackground;
        this._activity = new Activity(undefined,undefined);
        const arcs= document.getElementsByTagName("arc") as ArcElement[];
        utils.fill(arcs[0],symbol.style.fill);
        utils.fill(arcs[1],symbol.style.fill);
    }

    /**
     * Set the activity values
     * @param activity 
     */
    set(activity: Activity) {
        // Update only if activity is set
        if (activity === undefined) return;
        // Goal was reached?
        const goalReached =  this._activity.goalReached();

        // Update cache
        this._activity = activity;

        // update the UI
        this.refresh();

        // Animation if state changed
        if(activity.goalReached() && !goalReached) utils.highlight(this._symbol);
    }

    public refresh() {
        let arc = this._symbol.getElementById("arc") as ArcElement; // First Arc is used for background
        let circle = this._symbol.getElementById("circle") as CircleElement;
        let image = this._symbol.getElementById("image") as ImageElement;

        // Goals ok
        if (this._activity.goalReached()) {
            utils.show(circle);
            utils.hide(arc);
            utils.fill(image, this._appBackground.style.fill);
        }
        else {
            utils.show(arc);
            utils.hide(circle);
            arc.sweepAngle = this._activity.as360Arc(); //util.activityToAngle(activity.goal, activity.actual);
            utils.fill(image, this._symbol.style.fill);
        }
    }

    /**
     * Call it to highlight the symbol when display go on if goal was reached
     */
    public onDiplayGoOn() {
        // Test if cache was set
        if (this._activity === undefined) return;
        // Test if goel was reached
        if (this._activity.goalReached()) utils.highlight(this._symbol);
    }

    // --------------------------------------------------------------------------------
    // Utility to reduce code
    // --------------------------------------------------------------------------------
    /**
     * Show this symbol
     */
    public show() {
        utils.show(this._symbol);
    }

    /**
     * hide this symbol
     */
    public hide() {
        utils.hide(this._symbol);
    }
}