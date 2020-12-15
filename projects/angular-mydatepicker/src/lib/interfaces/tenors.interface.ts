import {IMyBTNRow} from "./my-right-btn-row.interface";
import {IMyHolidayDates} from "./my-holiday-dates.interface";
import {IMyLabeledDates} from "./my-labeled-dates.interface";
import {IMyOptions} from "./my-options.interface";

export interface IMyOptions {
  rightButtons?: Array<IMyBTNRow>;
  labelDates?: Array<IMyLabeledDates>;
  holidayDates?: Array<IMyHolidayDates>;
  showCalendarIcon?: boolean;
}

export interface IAngularMyDpOptions extends IMyOptions { }
