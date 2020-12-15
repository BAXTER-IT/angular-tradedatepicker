/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from "@angular/core";
import { KeyCode } from "../enums/key-code.enum";
import { KeyName } from "../enums/key-name.enum";
import { D, DD, M, MM, MMM, YYYY, SU, MO, TU, WE, TH, FR, SA, ZERO_STR, EMPTY_STR, PIPE } from "../constants/constants";
export class UtilService {
    constructor() {
        this.weekDays = [SU, MO, TU, WE, TH, FR, SA];
    }
    /**
     * @param {?} dateStr
     * @param {?} options
     * @param {?} validateOpts
     * @return {?}
     */
    isDateValid(dateStr, options, validateOpts) {
        const { dateFormat, minYear, maxYear, monthLabels } = options;
        /** @type {?} */
        const returnDate = this.resetDate();
        /** @type {?} */
        const datesInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        /** @type {?} */
        const isMonthStr = dateFormat.indexOf(MMM) !== -1;
        /** @type {?} */
        const delimeters = dateFormat.match(/[^(dmy)]{1,}/g);
        if (!dateStr || dateStr === EMPTY_STR) {
            return returnDate;
        }
        /** @type {?} */
        const dateValues = this.getDateValue(dateStr, dateFormat, delimeters);
        /** @type {?} */
        let year = 0;
        /** @type {?} */
        let month = 0;
        /** @type {?} */
        let day = 0;
        for (const dv of dateValues) {
            const { format } = dv;
            if (format.indexOf(YYYY) !== -1) {
                year = this.getNumberByValue(dv);
            }
            else if (format.indexOf(M) !== -1) {
                month = isMonthStr ? this.getMonthNumberByMonthName(dv, monthLabels) : this.getNumberByValue(dv);
            }
            else if (format.indexOf(D) !== -1) {
                day = this.getNumberByValue(dv);
            }
        }
        const { validateDisabledDates, selectedValue } = validateOpts;
        year = year === 0 && selectedValue ? selectedValue.year : year;
        month = month === 0 && selectedValue ? selectedValue.month : month;
        day = day === 0 && selectedValue ? selectedValue.day : day;
        /** @type {?} */
        const today = this.getToday();
        if (year === 0 && (month !== 0 || day !== 0)) {
            year = today.year;
        }
        if (month === 0 && (year !== 0 || day !== 0)) {
            month = today.month;
        }
        if (day === 0 && (year !== 0 || month !== 0)) {
            day = today.day;
        }
        if (month !== -1 && day !== -1 && year !== -1) {
            if (year < minYear || year > maxYear || month < 1 || month > 12) {
                return returnDate;
            }
            /** @type {?} */
            const date = { year, month, day };
            if (validateDisabledDates && this.isDisabledDate(date, options).disabled) {
                return returnDate;
            }
            if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
                datesInMonth[1] = 29;
            }
            if (day < 1 || day > datesInMonth[month - 1]) {
                return returnDate;
            }
            // Valid date
            return date;
        }
        return returnDate;
    }
    /**
     * @param {?} dateRangeStr
     * @param {?} options
     * @param {?} validateOpts
     * @return {?}
     */
    isDateValidDateRange(dateRangeStr, options, validateOpts) {
        /** @type {?} */
        let dateRange = { begin: this.resetDate(), end: this.resetDate() };
        if (dateRangeStr && dateRangeStr.length) {
            /** @type {?} */
            const dates = dateRangeStr.split(options.dateRangeDatesDelimiter);
            if (dates && dates.length === 2) {
                const [beginDate, endDate] = dates;
                let { selectedValue } = validateOpts;
                if (selectedValue) {
                    validateOpts.selectedValue = selectedValue.begin;
                }
                /** @type {?} */
                const begin = this.isDateValid(beginDate, options, validateOpts);
                if (this.isInitializedDate(begin)) {
                    if (selectedValue) {
                        validateOpts.selectedValue = selectedValue.end;
                    }
                    /** @type {?} */
                    const end = this.isDateValid(endDate, options, validateOpts);
                    if (this.isInitializedDate(end) && this.isDateSameOrEarlier(begin, end)) {
                        dateRange = { begin, end };
                    }
                }
            }
        }
        return dateRange;
    }
    /**
     * @param {?} dateStr
     * @param {?} dateFormat
     * @param {?} delimeters
     * @return {?}
     */
    getDateValue(dateStr, dateFormat, delimeters) {
        /** @type {?} */
        let del = EMPTY_STR;
        if (delimeters) {
            for (const d of delimeters) {
                if (del.indexOf(d) === -1) {
                    del += d;
                }
            }
        }
        /** @type {?} */
        const re = new RegExp("[" + del + "]");
        /** @type {?} */
        const ds = dateStr.split(re);
        /** @type {?} */
        const df = dateFormat.split(re);
        /** @type {?} */
        const da = [];
        for (let i = 0; i < df.length; i++) {
            if (df[i].indexOf(YYYY) !== -1) {
                da.push({ value: ds[i], format: df[i] });
            }
            if (df[i].indexOf(M) !== -1) {
                da.push({ value: ds[i], format: df[i] });
            }
            if (df[i].indexOf(D) !== -1) {
                da.push({ value: ds[i], format: df[i] });
            }
        }
        return da;
    }
    /**
     * @param {?} df
     * @param {?} monthLabels
     * @return {?}
     */
    getMonthNumberByMonthName(df, monthLabels) {
        if (df.value) {
            for (let key = 1; key <= 12; key++) {
                if (df.value.toLowerCase() === monthLabels[key].toLowerCase()) {
                    return key;
                }
            }
        }
        return -1;
    }
    /**
     * @param {?} df
     * @return {?}
     */
    getNumberByValue(df) {
        if (!/^\d+$/.test(df.value)) {
            return -1;
        }
        /** @type {?} */
        let nbr = Number(df.value);
        if (df.format.length === 1 && df.value.length !== 1 && nbr < 10 || df.format.length === 1 && df.value.length !== 2 && nbr >= 10) {
            nbr = -1;
        }
        else if (df.format.length === 2 && df.value.length > 2) {
            nbr = -1;
        }
        return nbr;
    }
    /**
     * @param {?} monthString
     * @return {?}
     */
    parseDefaultMonth(monthString) {
        /** @type {?} */
        const month = { monthTxt: EMPTY_STR, monthNbr: 0, year: 0 };
        if (monthString !== EMPTY_STR) {
            /** @type {?} */
            const split = monthString.split(monthString.match(/[^0-9]/)[0]);
            month.monthNbr = split[0].length === 2 ? Number(split[0]) : Number(split[1]);
            month.year = split[0].length === 2 ? Number(split[1]) : Number(split[0]);
        }
        return month;
    }
    /**
     * @param {?} date
     * @param {?} options
     * @return {?}
     */
    isDisabledDate(date, options) {
        const { minYear, maxYear, disableUntil, disableSince, disableWeekends, disableDates, disableDateRanges, disableWeekdays, enableDates } = options;
        if (this.dateMatchToDates(date, enableDates)) {
            return this.getDisabledValue(false, EMPTY_STR);
        }
        if (date.year < minYear && date.month === 12 || date.year > maxYear && date.month === 1) {
            return this.getDisabledValue(true, EMPTY_STR);
        }
        /** @type {?} */
        const inputDates = (/** @type {?} */ (disableDates));
        /** @type {?} */
        const result = inputDates.find((/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            return d.dates;
        }));
        if (!result) {
            if (this.dateMatchToDates(date, inputDates)) {
                return this.getDisabledValue(true, EMPTY_STR);
            }
        }
        else {
            for (const dd of inputDates) {
                if (this.dateMatchToDates(date, dd.dates)) {
                    return this.getDisabledValue(true, dd.styleClass);
                }
            }
        }
        if (this.isDisabledByDisableUntil(date, disableUntil)) {
            return this.getDisabledValue(true, EMPTY_STR);
        }
        if (this.isDisabledByDisableSince(date, disableSince)) {
            return this.getDisabledValue(true, EMPTY_STR);
        }
        if (disableWeekends) {
            /** @type {?} */
            const dayNbr = this.getDayNumber(date);
            if (dayNbr === 0 || dayNbr === 6) {
                return this.getDisabledValue(true, EMPTY_STR);
            }
        }
        /** @type {?} */
        const dn = this.getDayNumber(date);
        if (disableWeekdays.length > 0) {
            for (const wd of disableWeekdays) {
                if (dn === this.getWeekdayIndex(wd)) {
                    return this.getDisabledValue(true, EMPTY_STR);
                }
            }
        }
        if (this.isDisabledByDisableDateRange(date, date, disableDateRanges)) {
            return this.getDisabledValue(true, EMPTY_STR);
        }
        return this.getDisabledValue(false, EMPTY_STR);
    }
    /**
     * @param {?} disabled
     * @param {?} styleClass
     * @return {?}
     */
    getDisabledValue(disabled, styleClass) {
        return { disabled, styleClass };
    }
    /**
     * @param {?} date
     * @param {?} dates
     * @return {?}
     */
    dateMatchToDates(date, dates) {
        for (const d of dates) {
            if ((d.year === 0 || d.year === date.year) && (d.month === 0 || d.month === date.month) && d.day === date.day) {
                return true;
            }
        }
        return false;
    }
    /**
     * @param {?} year
     * @param {?} month
     * @param {?} options
     * @return {?}
     */
    isDisabledMonth(year, month, options) {
        const { disableUntil, disableSince, disableDateRanges, enableDates } = options;
        /** @type {?} */
        const dateEnd = { year, month, day: this.datesInMonth(month, year) };
        /** @type {?} */
        const dateBegin = { year, month, day: 1 };
        if (this.isDatesEnabled(dateBegin, dateEnd, enableDates)) {
            return false;
        }
        if (this.isDisabledByDisableUntil(dateEnd, disableUntil)) {
            return true;
        }
        if (this.isDisabledByDisableSince(dateBegin, disableSince)) {
            return true;
        }
        if (this.isDisabledByDisableDateRange(dateBegin, dateEnd, disableDateRanges)) {
            return true;
        }
        return false;
    }
    /**
     * @param {?} year
     * @param {?} options
     * @return {?}
     */
    isDisabledYear(year, options) {
        const { disableUntil, disableSince, disableDateRanges, enableDates, minYear, maxYear } = options;
        /** @type {?} */
        const dateEnd = { year, month: 12, day: 31 };
        /** @type {?} */
        const dateBegin = { year, month: 1, day: 1 };
        if (this.isDatesEnabled(dateBegin, dateEnd, enableDates)) {
            return false;
        }
        if (this.isDisabledByDisableUntil(dateEnd, disableUntil)) {
            return true;
        }
        if (this.isDisabledByDisableSince(dateBegin, disableSince)) {
            return true;
        }
        if (this.isDisabledByDisableDateRange(dateBegin, dateEnd, disableDateRanges)) {
            return true;
        }
        if (year < minYear || year > maxYear) {
            return true;
        }
        return false;
    }
    /**
     * @param {?} date
     * @param {?} disableUntil
     * @return {?}
     */
    isDisabledByDisableUntil(date, disableUntil) {
        return this.isInitializedDate(disableUntil) && this.getTimeInMilliseconds(date) <= this.getTimeInMilliseconds(disableUntil);
    }
    /**
     * @param {?} date
     * @param {?} disableSince
     * @return {?}
     */
    isDisabledByDisableSince(date, disableSince) {
        return this.isInitializedDate(disableSince) && this.getTimeInMilliseconds(date) >= this.getTimeInMilliseconds(disableSince);
    }
    /**
     * @param {?} date
     * @param {?} enableDates
     * @return {?}
     */
    isPastDatesEnabled(date, enableDates) {
        for (const d of enableDates) {
            if (this.getTimeInMilliseconds(d) <= this.getTimeInMilliseconds(date)) {
                return true;
            }
        }
        return false;
    }
    /**
     * @param {?} date
     * @param {?} enableDates
     * @return {?}
     */
    isFutureDatesEnabled(date, enableDates) {
        for (const d of enableDates) {
            if (this.getTimeInMilliseconds(d) >= this.getTimeInMilliseconds(date)) {
                return true;
            }
        }
        return false;
    }
    /**
     * @param {?} dateBegin
     * @param {?} dateEnd
     * @param {?} enableDates
     * @return {?}
     */
    isDatesEnabled(dateBegin, dateEnd, enableDates) {
        for (const d of enableDates) {
            if (this.getTimeInMilliseconds(d) >= this.getTimeInMilliseconds(dateBegin)
                && this.getTimeInMilliseconds(d) <= this.getTimeInMilliseconds(dateEnd)) {
                return true;
            }
        }
        return false;
    }
    /**
     * @param {?} dateBegin
     * @param {?} dateEnd
     * @param {?} disableDateRanges
     * @return {?}
     */
    isDisabledByDisableDateRange(dateBegin, dateEnd, disableDateRanges) {
        /** @type {?} */
        const dateMsBegin = this.getTimeInMilliseconds(dateBegin);
        /** @type {?} */
        const dateMsEnd = this.getTimeInMilliseconds(dateEnd);
        for (const d of disableDateRanges) {
            if (this.isInitializedDate(d.begin) && this.isInitializedDate(d.end)
                && dateMsBegin >= this.getTimeInMilliseconds(d.begin) && dateMsEnd <= this.getTimeInMilliseconds(d.end)) {
                return true;
            }
        }
        return false;
    }
    /**
     * @param {?} date
     * @param {?} labeledDates
     * @return {?}
     */
    isLabeledDate(date, labeledDates) {
        for (let md of labeledDates) {
            for (let d of md.dates) {
                if (d.date.year === date.year && d.date.month === date.month && d.date.day === date.day) {
                    return { marked: true, label: d.label, style: d.style, title: d.title };
                }
            }
        }
        /*if (markWeekends && markWeekends.marked) {
            let dayNbr = this.getDayNumber(date);
            if (dayNbr === 0 || dayNbr === 6) {
                return {marked: true, label: md.label, color: markWeekends.color};
            }
        }*/
        return { marked: false, style: "", label: '', title: '' };
    }
    /**
     * @param {?} date
     * @param {?} options
     * @return {?}
     */
    isMarkedDate(date, options) {
        const { markDates, markWeekends } = options;
        for (const md of markDates) {
            if (this.dateMatchToDates(date, md.dates)) {
                return this.getMarkedValue(true, md.color, md.styleClass);
            }
        }
        if (markWeekends && markWeekends.marked) {
            /** @type {?} */
            const dayNbr = this.getDayNumber(date);
            if (dayNbr === 0 || dayNbr === 6) {
                return this.getMarkedValue(true, markWeekends.color, EMPTY_STR);
            }
        }
        return this.getMarkedValue(false, EMPTY_STR, EMPTY_STR);
    }
    /**
     * @param {?} marked
     * @param {?} color
     * @param {?} styleClass
     * @return {?}
     */
    getMarkedValue(marked, color, styleClass) {
        return { marked, color: color ? color : EMPTY_STR, styleClass: styleClass ? styleClass : EMPTY_STR };
    }
    /**
     * @param {?} date
     * @param {?} options
     * @return {?}
     */
    isHighlightedDate(date, options) {
        const { sunHighlight, satHighlight, highlightDates } = options;
        /** @type {?} */
        const dayNbr = this.getDayNumber(date);
        if (sunHighlight && dayNbr === 0 || satHighlight && dayNbr === 6) {
            return true;
        }
        if (this.dateMatchToDates(date, highlightDates)) {
            return true;
        }
        return false;
    }
    /**
     * @param {?} date
     * @return {?}
     */
    getWeekNumber(date) {
        /** @type {?} */
        const d = new Date(date.year, date.month - 1, date.day, 0, 0, 0, 0);
        d.setDate(d.getDate() + (d.getDay() === 0 ? -3 : 4 - d.getDay()));
        return Math.round(((d.getTime() - new Date(d.getFullYear(), 0, 4).getTime()) / 86400000) / 7) + 1;
    }
    /**
     * @param {?} date
     * @param {?} dateRange
     * @param {?} dateFormat
     * @param {?} monthLabels
     * @param {?} rangeDelimiter
     * @param {?=} dateStr
     * @return {?}
     */
    getDateModel(date, dateRange, dateFormat, monthLabels, rangeDelimiter, dateStr = EMPTY_STR) {
        /** @type {?} */
        let singleDateModel = null;
        /** @type {?} */
        let dateRangeModel = null;
        if (date) {
            singleDateModel = {
                date,
                jsDate: this.myDateToJsDate(date),
                formatted: dateStr.length ? dateStr : this.formatDate(date, dateFormat, monthLabels),
                epoc: this.getEpocTime(date)
            };
        }
        else {
            dateRangeModel = {
                beginDate: dateRange.begin,
                beginJsDate: this.myDateToJsDate(dateRange.begin),
                beginEpoc: this.getEpocTime(dateRange.begin),
                endDate: dateRange.end,
                endJsDate: this.myDateToJsDate(dateRange.end),
                endEpoc: this.getEpocTime(dateRange.end),
                formatted: this.formatDate(dateRange.begin, dateFormat, monthLabels) + rangeDelimiter + this.formatDate(dateRange.end, dateFormat, monthLabels)
            };
        }
        return {
            isRange: date === null,
            singleDate: singleDateModel,
            dateRange: dateRangeModel
        };
    }
    /**
     * @param {?} date
     * @param {?} dateFormat
     * @param {?} monthLabels
     * @return {?}
     */
    formatDate(date, dateFormat, monthLabels) {
        /** @type {?} */
        let formatted = dateFormat.replace(YYYY, String(date.year));
        if (dateFormat.indexOf(MMM) !== -1) {
            formatted = formatted.replace(MMM, monthLabels[date.month]);
        }
        else if (dateFormat.indexOf(MM) !== -1) {
            formatted = formatted.replace(MM, this.preZero(date.month));
        }
        else {
            formatted = formatted.replace(M, String(date.month));
        }
        if (dateFormat.indexOf(DD) !== -1) {
            formatted = formatted.replace(DD, this.preZero(date.day));
        }
        else {
            formatted = formatted.replace(D, String(date.day));
        }
        return formatted;
    }
    /**
     * @param {?} model
     * @return {?}
     */
    getFormattedDate(model) {
        return !model.isRange ? model.singleDate.formatted : model.dateRange.formatted;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    preZero(val) {
        return val < 10 ? ZERO_STR + val : String(val);
    }
    /**
     * @param {?} date
     * @return {?}
     */
    isInitializedDate(date) {
        return date.year !== 0 && date.month !== 0 && date.day !== 0;
    }
    /**
     * @param {?} firstDate
     * @param {?} secondDate
     * @return {?}
     */
    isDateEarlier(firstDate, secondDate) {
        return this.getTimeInMilliseconds(firstDate) < this.getTimeInMilliseconds(secondDate);
    }
    /**
     * @param {?} firstDate
     * @param {?} secondDate
     * @return {?}
     */
    isDateSameOrEarlier(firstDate, secondDate) {
        return this.getTimeInMilliseconds(firstDate) <= this.getTimeInMilliseconds(secondDate);
    }
    /**
     * @param {?} firstDate
     * @param {?} secondDate
     * @return {?}
     */
    isDateSame(firstDate, secondDate) {
        return this.getTimeInMilliseconds(firstDate) === this.getTimeInMilliseconds(secondDate);
    }
    /**
     * @param {?} dateRange
     * @param {?} date
     * @return {?}
     */
    isDateRangeBeginOrEndSame(dateRange, date) {
        /** @type {?} */
        const dateMs = this.getTimeInMilliseconds(date);
        return this.getTimeInMilliseconds(dateRange.begin) === dateMs || this.getTimeInMilliseconds(dateRange.end) === dateMs;
    }
    /**
     * @param {?} date
     * @param {?} dateRange
     * @return {?}
     */
    isDateInRange(date, dateRange) {
        if (!this.isInitializedDate(dateRange.begin) || !this.isInitializedDate(dateRange.end)) {
            return false;
        }
        return this.isDateSameOrEarlier(dateRange.begin, date) && this.isDateSameOrEarlier(date, dateRange.end);
    }
    /**
     * @return {?}
     */
    resetDate() {
        return { year: 0, month: 0, day: 0 };
    }
    /**
     * @param {?} date
     * @return {?}
     */
    getTimeInMilliseconds(date) {
        return this.myDateToJsDate(date).getTime();
    }
    /**
     * @return {?}
     */
    getToday() {
        /** @type {?} */
        const date = new Date();
        return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
    }
    /**
     * @param {?} date
     * @return {?}
     */
    getDayNumber(date) {
        return new Date(date.year, date.month - 1, date.day, 0, 0, 0, 0).getDay();
    }
    /**
     * @param {?} wd
     * @return {?}
     */
    getWeekdayIndex(wd) {
        return this.weekDays.indexOf(wd);
    }
    /**
     * @param {?} date
     * @return {?}
     */
    getEpocTime(date) {
        return Math.round(this.getTimeInMilliseconds(date) / 1000.0);
    }
    /**
     * @param {?} date
     * @return {?}
     */
    jsDateToMyDate(date) {
        return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
    }
    /**
     * @param {?} date
     * @return {?}
     */
    myDateToJsDate(date) {
        const { year, month, day } = date;
        return new Date(year, month - 1, day, 0, 0, 0, 0);
    }
    /**
     * @param {?} m
     * @param {?} y
     * @return {?}
     */
    datesInMonth(m, y) {
        return new Date(y, m, 0).getDate();
    }
    /**
     * @param {?} m
     * @param {?} y
     * @return {?}
     */
    datesInPrevMonth(m, y) {
        /** @type {?} */
        const d = this.getJsDate(y, m, 1);
        d.setMonth(d.getMonth() - 1);
        return this.datesInMonth(d.getMonth() + 1, d.getFullYear());
    }
    /**
     * @param {?} year
     * @param {?} month
     * @param {?} day
     * @return {?}
     */
    getJsDate(year, month, day) {
        return new Date(year, month - 1, day, 0, 0, 0, 0);
    }
    /**
     * @param {?} selectedValue
     * @param {?} dateRange
     * @return {?}
     */
    getSelectedValue(selectedValue, dateRange) {
        if (!selectedValue) {
            return null;
        }
        if (!dateRange) {
            return selectedValue.date;
        }
        else {
            const { beginDate, endDate } = selectedValue;
            return { begin: beginDate, end: endDate };
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    getKeyCodeFromEvent(event) {
        /** @type {?} */
        let key = event.key || event.keyCode || event.which;
        if (this.checkKeyName(key, KeyName.enter) || key === KeyCode.enter) {
            return KeyCode.enter;
        }
        else if (this.checkKeyName(key, KeyName.esc) || key === KeyCode.esc) {
            return KeyCode.esc;
        }
        else if (this.checkKeyName(key, KeyName.space) || key === KeyCode.space) {
            return KeyCode.space;
        }
        else if (this.checkKeyName(key, KeyName.leftArrow) || key === KeyCode.leftArrow) {
            return KeyCode.leftArrow;
        }
        else if (this.checkKeyName(key, KeyName.upArrow) || key === KeyCode.upArrow) {
            return KeyCode.upArrow;
        }
        else if (this.checkKeyName(key, KeyName.rightArrow) || key === KeyCode.rightArrow) {
            return KeyCode.rightArrow;
        }
        else if (this.checkKeyName(key, KeyName.downArrow) || key === KeyCode.downArrow) {
            return KeyCode.downArrow;
        }
        else if (this.checkKeyName(key, KeyName.tab) || key === KeyCode.tab) {
            return KeyCode.tab;
        }
        else if (this.checkKeyName(key, KeyName.shift) || key === KeyCode.shift) {
            return KeyCode.shift;
        }
        else {
            return null;
        }
    }
    /**
     * @param {?} key
     * @param {?} keyName
     * @return {?}
     */
    checkKeyName(key, keyName) {
        /** @type {?} */
        const arr = keyName.split(PIPE);
        return arr.indexOf(key) !== -1;
    }
}
UtilService.decorators = [
    { type: Injectable }
];
if (false) {
    /** @type {?} */
    UtilService.prototype.weekDays;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1teWRhdGVwaWNrZXIudXRpbC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci10cmFkZWRhdGVwaWNrZXIvIiwic291cmNlcyI6WyJsaWIvc2VydmljZXMvYW5ndWxhci1teWRhdGVwaWNrZXIudXRpbC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBYXpDLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUMvQyxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDL0MsT0FBTyxFQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBS3RILE1BQU0sT0FBTyxXQUFXO0lBRHhCO1FBRUUsYUFBUSxHQUFrQixDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBdWxCekQsQ0FBQzs7Ozs7OztJQXJsQkMsV0FBVyxDQUFDLE9BQWUsRUFBRSxPQUFtQixFQUFFLFlBQWdDO2NBQzFFLEVBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFDLEdBQUcsT0FBTzs7Y0FFckQsVUFBVSxHQUFZLElBQUksQ0FBQyxTQUFTLEVBQUU7O2NBQ3RDLFlBQVksR0FBa0IsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFF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QUMsSUFBSSxDQUFDO1FBQzlDLE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUNqQyxDQUFDOzs7WUF4bEJGLFVBQVU7Ozs7SUFFVCwrQkFBdUQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGV9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQge0lNeURhdGVNb2RlbH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvbXktZGF0ZS1tb2RlbC5pbnRlcmZhY2VcIjtcbmltcG9ydCB7SU15U2luZ2xlRGF0ZU1vZGVsfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9teS1zaW5nbGUtZGF0ZS1tb2RlbC5pbnRlcmZhY2VcIjtcbmltcG9ydCB7SU15RGF0ZVJhbmdlTW9kZWx9IGZyb20gXCIuLi9pbnRlcmZhY2VzL215LWRhdGUtcmFuZ2UtbW9kZWwuaW50ZXJmYWNlXCI7XG5pbXBvcnQge0lNeURhdGV9IGZyb20gXCIuLi9pbnRlcmZhY2VzL215LWRhdGUuaW50ZXJmYWNlXCI7XG5pbXBvcnQge0lNeURhdGVSYW5nZX0gZnJvbSBcIi4uL2ludGVyZmFjZXMvbXktZGF0ZS1yYW5nZS5pbnRlcmZhY2VcIjtcbmltcG9ydCB7SU15TW9udGh9IGZyb20gXCIuLi9pbnRlcmZhY2VzL215LW1vbnRoLmludGVyZmFjZVwiO1xuaW1wb3J0IHtJTXlNb250aExhYmVsc30gZnJvbSBcIi4uL2ludGVyZmFjZXMvbXktbW9udGgtbGFiZWxzLmludGVyZmFjZVwiO1xuaW1wb3J0IHtJTXlNYXJrZWREYXRlfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9teS1tYXJrZWQtZGF0ZS5pbnRlcmZhY2VcIjtcbmltcG9ydCB7SU15RGlzYWJsZWREYXRlfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9teS1kaXNhYmxlZC1kYXRlLmludGVyZmFjZVwiO1xuaW1wb3J0IHtJTXlEYXRlRm9ybWF0fSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9teS1kYXRlLWZvcm1hdC5pbnRlcmZhY2VcIjtcbmltcG9ydCB7SU15VmFsaWRhdGVPcHRpb25zfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9teS12YWxpZGF0ZS1vcHRpb25zLmludGVyZmFjZVwiO1xuaW1wb3J0IHtJTXlPcHRpb25zfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9teS1vcHRpb25zLmludGVyZmFjZVwiO1xuaW1wb3J0IHtLZXlDb2RlfSBmcm9tIFwiLi4vZW51bXMva2V5LWNvZGUuZW51bVwiO1xuaW1wb3J0IHtLZXlOYW1lfSBmcm9tIFwiLi4vZW51bXMva2V5LW5hbWUuZW51bVwiO1xuaW1wb3J0IHtELCBERCwgTSwgTU0sIE1NTSwgWVlZWSwgU1UsIE1PLCBUVSwgV0UsIFRILCBGUiwgU0EsIFpFUk9fU1RSLCBFTVBUWV9TVFIsIFBJUEV9IGZyb20gXCIuLi9jb25zdGFudHMvY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBJTXlMYWJlbGVkRGF0ZXMgfSBmcm9tICcuLi9pbnRlcmZhY2VzL215LWxhYmVsZWQtZGF0ZXMuaW50ZXJmYWNlJztcbmltcG9ydCB7IElNeUxhYmVsZWREYXRlIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9teS1sYWJlbGVkLWRhdGUuaW50ZXJmYWNlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFV0aWxTZXJ2aWNlIHtcbiAgd2Vla0RheXM6IEFycmF5PHN0cmluZz4gPSBbU1UsIE1PLCBUVSwgV0UsIFRILCBGUiwgU0FdO1xuXG4gIGlzRGF0ZVZhbGlkKGRhdGVTdHI6IHN0cmluZywgb3B0aW9uczogSU15T3B0aW9ucywgdmFsaWRhdGVPcHRzOiBJTXlWYWxpZGF0ZU9wdGlvbnMpOiBJTXlEYXRlIHtcbiAgICBjb25zdCB7ZGF0ZUZvcm1hdCwgbWluWWVhciwgbWF4WWVhciwgbW9udGhMYWJlbHN9ID0gb3B0aW9ucztcblxuICAgIGNvbnN0IHJldHVybkRhdGU6IElNeURhdGUgPSB0aGlzLnJlc2V0RGF0ZSgpO1xuICAgIGNvbnN0IGRhdGVzSW5Nb250aDogQXJyYXk8bnVtYmVyPiA9IFszMSwgMjgsIDMxLCAzMCwgMzEsIDMwLCAzMSwgMzEsIDMwLCAzMSwgMzAsIDMxXTtcbiAgICBjb25zdCBpc01vbnRoU3RyOiBib29sZWFuID0gZGF0ZUZvcm1hdC5pbmRleE9mKE1NTSkgIT09IC0xO1xuICAgIGNvbnN0IGRlbGltZXRlcnM6IEFycmF5PHN0cmluZz4gPSBkYXRlRm9ybWF0Lm1hdGNoKC9bXihkbXkpXXsxLH0vZyk7XG5cbiAgICBpZiAoIWRhdGVTdHIgfHwgZGF0ZVN0ciA9PT0gRU1QVFlfU1RSKSB7XG4gICAgICByZXR1cm4gcmV0dXJuRGF0ZTtcbiAgICB9XG5cbiAgICBjb25zdCBkYXRlVmFsdWVzOiBBcnJheTxJTXlEYXRlRm9ybWF0PiA9IHRoaXMuZ2V0RGF0ZVZhbHVlKGRhdGVTdHIsIGRhdGVGb3JtYXQsIGRlbGltZXRlcnMpO1xuXG4gICAgbGV0IHllYXI6IG51bWJlciA9IDA7XG4gICAgbGV0IG1vbnRoOiBudW1iZXIgPSAwO1xuICAgIGxldCBkYXk6IG51bWJlciA9IDA7XG5cbiAgICBmb3IoY29uc3QgZHYgb2YgZGF0ZVZhbHVlcykge1xuICAgICAgY29uc3Qge2Zvcm1hdH0gPSBkdjtcbiAgICAgIGlmIChmb3JtYXQuaW5kZXhPZihZWVlZKSAhPT0gLTEpIHtcbiAgICAgICAgeWVhciA9IHRoaXMuZ2V0TnVtYmVyQnlWYWx1ZShkdik7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChmb3JtYXQuaW5kZXhPZihNKSAhPT0gLTEpIHtcbiAgICAgICAgbW9udGggPSBpc01vbnRoU3RyID8gdGhpcy5nZXRNb250aE51bWJlckJ5TW9udGhOYW1lKGR2LCBtb250aExhYmVscykgOiB0aGlzLmdldE51bWJlckJ5VmFsdWUoZHYpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoZm9ybWF0LmluZGV4T2YoRCkgIT09IC0xKSB7XG4gICAgICAgIGRheSA9IHRoaXMuZ2V0TnVtYmVyQnlWYWx1ZShkdik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qge3ZhbGlkYXRlRGlzYWJsZWREYXRlcywgc2VsZWN0ZWRWYWx1ZX0gPSB2YWxpZGF0ZU9wdHM7XG5cbiAgICB5ZWFyID0geWVhciA9PT0gMCAmJiBzZWxlY3RlZFZhbHVlID8gc2VsZWN0ZWRWYWx1ZS55ZWFyIDogeWVhcjtcbiAgICBtb250aCA9IG1vbnRoID09PSAwICYmIHNlbGVjdGVkVmFsdWUgPyBzZWxlY3RlZFZhbHVlLm1vbnRoIDogbW9udGg7XG4gICAgZGF5ID0gZGF5ID09PSAwICYmIHNlbGVjdGVkVmFsdWUgPyBzZWxlY3RlZFZhbHVlLmRheSA6IGRheTtcblxuICAgIGNvbnN0IHRvZGF5OiBJTXlEYXRlID0gdGhpcy5nZXRUb2RheSgpO1xuICAgIGlmICh5ZWFyID09PSAwICYmIChtb250aCAhPT0gMCB8fCBkYXkgIT09IDApKSB7XG4gICAgICB5ZWFyID0gdG9kYXkueWVhcjtcbiAgICB9XG5cbiAgICBpZiAobW9udGggPT09IDAgJiYgKHllYXIgIT09IDAgfHwgZGF5ICE9PSAwKSkge1xuICAgICAgbW9udGggPSB0b2RheS5tb250aDtcbiAgICB9XG5cbiAgICBpZiAoZGF5ID09PSAwICYmICh5ZWFyICE9PSAwIHx8IG1vbnRoICE9PSAwKSkge1xuICAgICAgZGF5ID0gdG9kYXkuZGF5O1xuICAgIH1cblxuICAgIGlmIChtb250aCAhPT0gLTEgJiYgZGF5ICE9PSAtMSAmJiB5ZWFyICE9PSAtMSkge1xuICAgICAgaWYgKHllYXIgPCBtaW5ZZWFyIHx8IHllYXIgPiBtYXhZZWFyIHx8IG1vbnRoIDwgMSB8fCBtb250aCA+IDEyKSB7XG4gICAgICAgIHJldHVybiByZXR1cm5EYXRlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBkYXRlOiBJTXlEYXRlID0ge3llYXIsIG1vbnRoLCBkYXl9O1xuXG4gICAgICBpZiAodmFsaWRhdGVEaXNhYmxlZERhdGVzICYmIHRoaXMuaXNEaXNhYmxlZERhdGUoZGF0ZSwgb3B0aW9ucykuZGlzYWJsZWQpIHtcbiAgICAgICAgcmV0dXJuIHJldHVybkRhdGU7XG4gICAgICB9XG5cbiAgICAgIGlmICh5ZWFyICUgNDAwID09PSAwIHx8ICh5ZWFyICUgMTAwICE9PSAwICYmIHllYXIgJSA0ID09PSAwKSkge1xuICAgICAgICBkYXRlc0luTW9udGhbMV0gPSAyOTtcbiAgICAgIH1cblxuICAgICAgaWYgKGRheSA8IDEgfHwgZGF5ID4gZGF0ZXNJbk1vbnRoW21vbnRoIC0gMV0pIHtcbiAgICAgICAgcmV0dXJuIHJldHVybkRhdGU7XG4gICAgICB9XG5cbiAgICAgIC8vIFZhbGlkIGRhdGVcbiAgICAgIHJldHVybiBkYXRlO1xuICAgIH1cbiAgICByZXR1cm4gcmV0dXJuRGF0ZTtcbiAgfVxuXG4gIGlzRGF0ZVZhbGlkRGF0ZVJhbmdlKGRhdGVSYW5nZVN0cjogc3RyaW5nLCBvcHRpb25zOiBJTXlPcHRpb25zLCB2YWxpZGF0ZU9wdHM6IElNeVZhbGlkYXRlT3B0aW9ucyk6IElNeURhdGVSYW5nZSB7XG4gICAgbGV0IGRhdGVSYW5nZTogSU15RGF0ZVJhbmdlID0ge2JlZ2luOiB0aGlzLnJlc2V0RGF0ZSgpLCBlbmQ6IHRoaXMucmVzZXREYXRlKCl9O1xuICAgIGlmIChkYXRlUmFuZ2VTdHIgJiYgZGF0ZVJhbmdlU3RyLmxlbmd0aCkge1xuICAgICAgY29uc3QgZGF0ZXM6IEFycmF5PHN0cmluZz4gPSBkYXRlUmFuZ2VTdHIuc3BsaXQob3B0aW9ucy5kYXRlUmFuZ2VEYXRlc0RlbGltaXRlcik7XG4gICAgICBpZiAoZGF0ZXMgJiYgZGF0ZXMubGVuZ3RoID09PSAyKSB7XG4gICAgICAgIGNvbnN0IFtiZWdpbkRhdGUsIGVuZERhdGVdID0gZGF0ZXM7XG4gICAgICAgIGxldCB7c2VsZWN0ZWRWYWx1ZX0gPSB2YWxpZGF0ZU9wdHM7XG5cbiAgICAgICAgaWYgKHNlbGVjdGVkVmFsdWUpIHtcbiAgICAgICAgICB2YWxpZGF0ZU9wdHMuc2VsZWN0ZWRWYWx1ZSA9IHNlbGVjdGVkVmFsdWUuYmVnaW47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBiZWdpbjogSU15RGF0ZSA9IHRoaXMuaXNEYXRlVmFsaWQoYmVnaW5EYXRlLCBvcHRpb25zLCB2YWxpZGF0ZU9wdHMpO1xuXG4gICAgICAgIGlmICh0aGlzLmlzSW5pdGlhbGl6ZWREYXRlKGJlZ2luKSkge1xuICAgICAgICAgIGlmIChzZWxlY3RlZFZhbHVlKSB7XG4gICAgICAgICAgICB2YWxpZGF0ZU9wdHMuc2VsZWN0ZWRWYWx1ZSA9IHNlbGVjdGVkVmFsdWUuZW5kO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IGVuZDogSU15RGF0ZSA9IHRoaXMuaXNEYXRlVmFsaWQoZW5kRGF0ZSwgb3B0aW9ucywgdmFsaWRhdGVPcHRzKTtcblxuICAgICAgICAgIGlmICh0aGlzLmlzSW5pdGlhbGl6ZWREYXRlKGVuZCkgJiYgdGhpcy5pc0RhdGVTYW1lT3JFYXJsaWVyKGJlZ2luLCBlbmQpKSB7XG4gICAgICAgICAgICBkYXRlUmFuZ2UgPSB7YmVnaW4sIGVuZH07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkYXRlUmFuZ2U7XG4gIH1cblxuICBnZXREYXRlVmFsdWUoZGF0ZVN0cjogc3RyaW5nLCBkYXRlRm9ybWF0OiBzdHJpbmcsIGRlbGltZXRlcnM6IEFycmF5PHN0cmluZz4pOiBBcnJheTxJTXlEYXRlRm9ybWF0PiB7XG4gICAgbGV0IGRlbDogc3RyaW5nID0gRU1QVFlfU1RSO1xuXG4gICAgaWYgKGRlbGltZXRlcnMpIHtcbiAgICAgIGZvcihjb25zdCBkIG9mIGRlbGltZXRlcnMpIHtcbiAgICAgICAgaWYgKGRlbC5pbmRleE9mKGQpID09PSAtMSkge1xuICAgICAgICAgIGRlbCArPSBkO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgcmU6IGFueSA9IG5ldyBSZWdFeHAoXCJbXCIgKyBkZWwgKyBcIl1cIik7XG4gICAgY29uc3QgZHM6IEFycmF5PHN0cmluZz4gPSBkYXRlU3RyLnNwbGl0KHJlKTtcbiAgICBjb25zdCBkZjogQXJyYXk8c3RyaW5nPiA9IGRhdGVGb3JtYXQuc3BsaXQocmUpO1xuICAgIGNvbnN0IGRhOiBBcnJheTxJTXlEYXRlRm9ybWF0PiA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkZi5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGRmW2ldLmluZGV4T2YoWVlZWSkgIT09IC0xKSB7XG4gICAgICAgIGRhLnB1c2goe3ZhbHVlOiBkc1tpXSwgZm9ybWF0OiBkZltpXX0pO1xuICAgICAgfVxuICAgICAgaWYgKGRmW2ldLmluZGV4T2YoTSkgIT09IC0xKSB7XG4gICAgICAgIGRhLnB1c2goe3ZhbHVlOiBkc1tpXSwgZm9ybWF0OiBkZltpXX0pO1xuICAgICAgfVxuICAgICAgaWYgKGRmW2ldLmluZGV4T2YoRCkgIT09IC0xKSB7XG4gICAgICAgIGRhLnB1c2goe3ZhbHVlOiBkc1tpXSwgZm9ybWF0OiBkZltpXX0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZGE7XG4gIH1cblxuICBnZXRNb250aE51bWJlckJ5TW9udGhOYW1lKGRmOiBJTXlEYXRlRm9ybWF0LCBtb250aExhYmVsczogSU15TW9udGhMYWJlbHMpOiBudW1iZXIge1xuICAgIGlmIChkZi52YWx1ZSkge1xuICAgICAgZm9yIChsZXQga2V5ID0gMTsga2V5IDw9IDEyOyBrZXkrKykge1xuICAgICAgICBpZiAoZGYudmFsdWUudG9Mb3dlckNhc2UoKSA9PT0gbW9udGhMYWJlbHNba2V5XS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgICAgcmV0dXJuIGtleTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICBnZXROdW1iZXJCeVZhbHVlKGRmOiBJTXlEYXRlRm9ybWF0KTogbnVtYmVyIHtcbiAgICBpZiAoIS9eXFxkKyQvLnRlc3QoZGYudmFsdWUpKSB7XG4gICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgbGV0IG5icjogbnVtYmVyID0gTnVtYmVyKGRmLnZhbHVlKTtcbiAgICBpZiAoZGYuZm9ybWF0Lmxlbmd0aCA9PT0gMSAmJiBkZi52YWx1ZS5sZW5ndGggIT09IDEgJiYgbmJyIDwgMTAgfHwgZGYuZm9ybWF0Lmxlbmd0aCA9PT0gMSAmJiBkZi52YWx1ZS5sZW5ndGggIT09IDIgJiYgbmJyID49IDEwKSB7XG4gICAgICBuYnIgPSAtMTtcbiAgICB9XG4gICAgZWxzZSBpZiAoZGYuZm9ybWF0Lmxlbmd0aCA9PT0gMiAmJiBkZi52YWx1ZS5sZW5ndGggPiAyKSB7XG4gICAgICBuYnIgPSAtMTtcbiAgICB9XG4gICAgcmV0dXJuIG5icjtcbiAgfVxuXG4gIHBhcnNlRGVmYXVsdE1vbnRoKG1vbnRoU3RyaW5nOiBzdHJpbmcpOiBJTXlNb250aCB7XG4gICAgY29uc3QgbW9udGg6IElNeU1vbnRoID0ge21vbnRoVHh0OiBFTVBUWV9TVFIsIG1vbnRoTmJyOiAwLCB5ZWFyOiAwfTtcbiAgICBpZiAobW9udGhTdHJpbmcgIT09IEVNUFRZX1NUUikge1xuICAgICAgY29uc3Qgc3BsaXQgPSBtb250aFN0cmluZy5zcGxpdChtb250aFN0cmluZy5tYXRjaCgvW14wLTldLylbMF0pO1xuICAgICAgbW9udGgubW9udGhOYnIgPSBzcGxpdFswXS5sZW5ndGggPT09IDIgPyBOdW1iZXIoc3BsaXRbMF0pIDogTnVtYmVyKHNwbGl0WzFdKTtcbiAgICAgIG1vbnRoLnllYXIgPSBzcGxpdFswXS5sZW5ndGggPT09IDIgPyBOdW1iZXIoc3BsaXRbMV0pIDogTnVtYmVyKHNwbGl0WzBdKTtcbiAgICB9XG4gICAgcmV0dXJuIG1vbnRoO1xuICB9XG5cbiAgaXNEaXNhYmxlZERhdGUoZGF0ZTogSU15RGF0ZSwgb3B0aW9uczogSU15T3B0aW9ucyk6IElNeURpc2FibGVkRGF0ZSB7XG4gICAgY29uc3Qge21pblllYXIsIG1heFllYXIsIGRpc2FibGVVbnRpbCwgZGlzYWJsZVNpbmNlLCBkaXNhYmxlV2Vla2VuZHMsIGRpc2FibGVEYXRlcywgZGlzYWJsZURhdGVSYW5nZXMsIGRpc2FibGVXZWVrZGF5cywgZW5hYmxlRGF0ZXN9ID0gb3B0aW9ucztcblxuICAgIGlmICh0aGlzLmRhdGVNYXRjaFRvRGF0ZXMoZGF0ZSwgZW5hYmxlRGF0ZXMpKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXREaXNhYmxlZFZhbHVlKGZhbHNlLCBFTVBUWV9TVFIpO1xuICAgIH1cblxuICAgIGlmIChkYXRlLnllYXIgPCBtaW5ZZWFyICYmIGRhdGUubW9udGggPT09IDEyIHx8IGRhdGUueWVhciA+IG1heFllYXIgJiYgZGF0ZS5tb250aCA9PT0gMSkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0RGlzYWJsZWRWYWx1ZSh0cnVlLCBFTVBUWV9TVFIpO1xuICAgIH1cblxuICAgIGNvbnN0IGlucHV0RGF0ZXM6IGFueSA9IGRpc2FibGVEYXRlcyBhcyBhbnk7XG4gICAgY29uc3QgcmVzdWx0ID0gaW5wdXREYXRlcy5maW5kKChkKSA9PiB7XG4gICAgICByZXR1cm4gZC5kYXRlcztcbiAgICB9KTtcblxuICAgIGlmICghcmVzdWx0KSB7XG4gICAgICBpZiAodGhpcy5kYXRlTWF0Y2hUb0RhdGVzKGRhdGUsIGlucHV0RGF0ZXMpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldERpc2FibGVkVmFsdWUodHJ1ZSwgRU1QVFlfU1RSKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBmb3IgKGNvbnN0IGRkIG9mIGlucHV0RGF0ZXMpIHtcbiAgICAgICAgaWYgKHRoaXMuZGF0ZU1hdGNoVG9EYXRlcyhkYXRlLCBkZC5kYXRlcykpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5nZXREaXNhYmxlZFZhbHVlKHRydWUsIGRkLnN0eWxlQ2xhc3MpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaXNEaXNhYmxlZEJ5RGlzYWJsZVVudGlsKGRhdGUsIGRpc2FibGVVbnRpbCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldERpc2FibGVkVmFsdWUodHJ1ZSwgRU1QVFlfU1RSKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5pc0Rpc2FibGVkQnlEaXNhYmxlU2luY2UoZGF0ZSwgZGlzYWJsZVNpbmNlKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0RGlzYWJsZWRWYWx1ZSh0cnVlLCBFTVBUWV9TVFIpO1xuICAgIH1cblxuICAgIGlmIChkaXNhYmxlV2Vla2VuZHMpIHtcbiAgICAgIGNvbnN0IGRheU5iciA9IHRoaXMuZ2V0RGF5TnVtYmVyKGRhdGUpO1xuICAgICAgaWYgKGRheU5iciA9PT0gMCB8fCBkYXlOYnIgPT09IDYpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RGlzYWJsZWRWYWx1ZSh0cnVlLCBFTVBUWV9TVFIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGRuID0gdGhpcy5nZXREYXlOdW1iZXIoZGF0ZSk7XG4gICAgaWYgKGRpc2FibGVXZWVrZGF5cy5sZW5ndGggPiAwKSB7XG4gICAgICBmb3IgKGNvbnN0IHdkIG9mIGRpc2FibGVXZWVrZGF5cykge1xuICAgICAgICBpZiAoZG4gPT09IHRoaXMuZ2V0V2Vla2RheUluZGV4KHdkKSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmdldERpc2FibGVkVmFsdWUodHJ1ZSwgRU1QVFlfU1RSKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLmlzRGlzYWJsZWRCeURpc2FibGVEYXRlUmFuZ2UoZGF0ZSwgZGF0ZSwgZGlzYWJsZURhdGVSYW5nZXMpKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXREaXNhYmxlZFZhbHVlKHRydWUsIEVNUFRZX1NUUik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZ2V0RGlzYWJsZWRWYWx1ZShmYWxzZSwgRU1QVFlfU1RSKTtcbiAgfVxuXG4gIGdldERpc2FibGVkVmFsdWUoZGlzYWJsZWQ6IGJvb2xlYW4sIHN0eWxlQ2xhc3M6IHN0cmluZyk6IElNeURpc2FibGVkRGF0ZSB7XG4gICAgcmV0dXJuIHtkaXNhYmxlZCwgc3R5bGVDbGFzc307XG4gIH1cblxuICBkYXRlTWF0Y2hUb0RhdGVzKGRhdGU6IElNeURhdGUsIGRhdGVzOiBBcnJheTxJTXlEYXRlPik6IGJvb2xlYW4ge1xuICAgIGZvciAoY29uc3QgZCBvZiBkYXRlcykge1xuICAgICAgaWYgKChkLnllYXIgPT09IDAgfHwgZC55ZWFyID09PSBkYXRlLnllYXIpICYmIChkLm1vbnRoID09PSAwIHx8IGQubW9udGggPT09IGRhdGUubW9udGgpICYmIGQuZGF5ID09PSBkYXRlLmRheSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaXNEaXNhYmxlZE1vbnRoKHllYXI6IG51bWJlciwgbW9udGg6IG51bWJlciwgb3B0aW9uczogSU15T3B0aW9ucyk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHtkaXNhYmxlVW50aWwsIGRpc2FibGVTaW5jZSwgZGlzYWJsZURhdGVSYW5nZXMsIGVuYWJsZURhdGVzfSA9IG9wdGlvbnM7XG5cbiAgICBjb25zdCBkYXRlRW5kOiBJTXlEYXRlID0ge3llYXIsIG1vbnRoLCBkYXk6IHRoaXMuZGF0ZXNJbk1vbnRoKG1vbnRoLCB5ZWFyKX07XG4gICAgY29uc3QgZGF0ZUJlZ2luOiBJTXlEYXRlID0ge3llYXIsIG1vbnRoLCBkYXk6IDF9O1xuXG4gICAgaWYgKHRoaXMuaXNEYXRlc0VuYWJsZWQoZGF0ZUJlZ2luLCBkYXRlRW5kLCBlbmFibGVEYXRlcykpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5pc0Rpc2FibGVkQnlEaXNhYmxlVW50aWwoZGF0ZUVuZCwgZGlzYWJsZVVudGlsKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaXNEaXNhYmxlZEJ5RGlzYWJsZVNpbmNlKGRhdGVCZWdpbiwgZGlzYWJsZVNpbmNlKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaXNEaXNhYmxlZEJ5RGlzYWJsZURhdGVSYW5nZShkYXRlQmVnaW4sIGRhdGVFbmQsIGRpc2FibGVEYXRlUmFuZ2VzKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaXNEaXNhYmxlZFllYXIoeWVhcjogbnVtYmVyLCBvcHRpb25zOiBJTXlPcHRpb25zKTogYm9vbGVhbiB7XG4gICAgY29uc3Qge2Rpc2FibGVVbnRpbCwgZGlzYWJsZVNpbmNlLCBkaXNhYmxlRGF0ZVJhbmdlcywgZW5hYmxlRGF0ZXMsIG1pblllYXIsIG1heFllYXJ9ID0gb3B0aW9ucztcblxuICAgIGNvbnN0IGRhdGVFbmQ6IElNeURhdGUgPSB7eWVhciwgbW9udGg6IDEyLCBkYXk6IDMxfTtcbiAgICBjb25zdCBkYXRlQmVnaW46IElNeURhdGUgPSB7eWVhciwgbW9udGg6IDEsIGRheTogMX07XG5cbiAgICBpZiAodGhpcy5pc0RhdGVzRW5hYmxlZChkYXRlQmVnaW4sIGRhdGVFbmQsIGVuYWJsZURhdGVzKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmlzRGlzYWJsZWRCeURpc2FibGVVbnRpbChkYXRlRW5kLCBkaXNhYmxlVW50aWwpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5pc0Rpc2FibGVkQnlEaXNhYmxlU2luY2UoZGF0ZUJlZ2luLCBkaXNhYmxlU2luY2UpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5pc0Rpc2FibGVkQnlEaXNhYmxlRGF0ZVJhbmdlKGRhdGVCZWdpbiwgZGF0ZUVuZCwgZGlzYWJsZURhdGVSYW5nZXMpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoeWVhciA8IG1pblllYXIgfHwgeWVhciA+IG1heFllYXIpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlzRGlzYWJsZWRCeURpc2FibGVVbnRpbChkYXRlOiBJTXlEYXRlLCBkaXNhYmxlVW50aWw6IElNeURhdGUpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5pc0luaXRpYWxpemVkRGF0ZShkaXNhYmxlVW50aWwpICYmIHRoaXMuZ2V0VGltZUluTWlsbGlzZWNvbmRzKGRhdGUpIDw9IHRoaXMuZ2V0VGltZUluTWlsbGlzZWNvbmRzKGRpc2FibGVVbnRpbCk7XG4gIH1cblxuICBpc0Rpc2FibGVkQnlEaXNhYmxlU2luY2UoZGF0ZTogSU15RGF0ZSwgZGlzYWJsZVNpbmNlOiBJTXlEYXRlKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuaXNJbml0aWFsaXplZERhdGUoZGlzYWJsZVNpbmNlKSAmJiB0aGlzLmdldFRpbWVJbk1pbGxpc2Vjb25kcyhkYXRlKSA+PSB0aGlzLmdldFRpbWVJbk1pbGxpc2Vjb25kcyhkaXNhYmxlU2luY2UpO1xuICB9XG5cbiAgaXNQYXN0RGF0ZXNFbmFibGVkKGRhdGU6IElNeURhdGUsIGVuYWJsZURhdGVzOiBBcnJheTxJTXlEYXRlPik6IGJvb2xlYW4ge1xuICAgIGZvcihjb25zdCBkIG9mIGVuYWJsZURhdGVzKSB7XG4gICAgICBpZiAodGhpcy5nZXRUaW1lSW5NaWxsaXNlY29uZHMoZCkgPD0gdGhpcy5nZXRUaW1lSW5NaWxsaXNlY29uZHMoZGF0ZSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlzRnV0dXJlRGF0ZXNFbmFibGVkKGRhdGU6IElNeURhdGUsIGVuYWJsZURhdGVzOiBBcnJheTxJTXlEYXRlPik6IGJvb2xlYW4ge1xuICAgIGZvcihjb25zdCBkIG9mIGVuYWJsZURhdGVzKSB7XG4gICAgICBpZiAodGhpcy5nZXRUaW1lSW5NaWxsaXNlY29uZHMoZCkgPj0gdGhpcy5nZXRUaW1lSW5NaWxsaXNlY29uZHMoZGF0ZSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlzRGF0ZXNFbmFibGVkKGRhdGVCZWdpbjogSU15RGF0ZSwgZGF0ZUVuZDogSU15RGF0ZSwgZW5hYmxlRGF0ZXM6IEFycmF5PElNeURhdGU+KTogYm9vbGVhbiB7XG4gICAgZm9yKGNvbnN0IGQgb2YgZW5hYmxlRGF0ZXMpIHtcbiAgICAgIGlmICh0aGlzLmdldFRpbWVJbk1pbGxpc2Vjb25kcyhkKSA+PSB0aGlzLmdldFRpbWVJbk1pbGxpc2Vjb25kcyhkYXRlQmVnaW4pXG4gICAgICAgICYmIHRoaXMuZ2V0VGltZUluTWlsbGlzZWNvbmRzKGQpIDw9IHRoaXMuZ2V0VGltZUluTWlsbGlzZWNvbmRzKGRhdGVFbmQpKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaXNEaXNhYmxlZEJ5RGlzYWJsZURhdGVSYW5nZShkYXRlQmVnaW46IElNeURhdGUsIGRhdGVFbmQ6IElNeURhdGUsIGRpc2FibGVEYXRlUmFuZ2VzOiBBcnJheTxJTXlEYXRlUmFuZ2U+KTogYm9vbGVhbiB7XG4gICAgY29uc3QgZGF0ZU1zQmVnaW46IG51bWJlciA9IHRoaXMuZ2V0VGltZUluTWlsbGlzZWNvbmRzKGRhdGVCZWdpbik7XG4gICAgY29uc3QgZGF0ZU1zRW5kOiBudW1iZXIgPSB0aGlzLmdldFRpbWVJbk1pbGxpc2Vjb25kcyhkYXRlRW5kKTtcblxuICAgIGZvciAoY29uc3QgZCBvZiBkaXNhYmxlRGF0ZVJhbmdlcykge1xuICAgICAgaWYgKHRoaXMuaXNJbml0aWFsaXplZERhdGUoZC5iZWdpbikgJiYgdGhpcy5pc0luaXRpYWxpemVkRGF0ZShkLmVuZClcbiAgICAgICAgJiYgZGF0ZU1zQmVnaW4gPj0gdGhpcy5nZXRUaW1lSW5NaWxsaXNlY29uZHMoZC5iZWdpbikgJiYgZGF0ZU1zRW5kIDw9IHRoaXMuZ2V0VGltZUluTWlsbGlzZWNvbmRzKGQuZW5kKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaXNMYWJlbGVkRGF0ZShkYXRlOiBJTXlEYXRlLCBsYWJlbGVkRGF0ZXM6IEFycmF5PElNeUxhYmVsZWREYXRlcz4pOiBJTXlMYWJlbGVkRGF0ZSB7XG4gICAgZm9yIChsZXQgbWQgb2YgbGFiZWxlZERhdGVzKSB7XG4gICAgICBmb3IgKGxldCBkIG9mIG1kLmRhdGVzKSB7XG4gICAgICAgIGlmIChkLmRhdGUueWVhciA9PT0gZGF0ZS55ZWFyICYmIGQuZGF0ZS5tb250aCA9PT0gZGF0ZS5tb250aCAmJiBkLmRhdGUuZGF5ID09PSBkYXRlLmRheSkge1xuICAgICAgICAgIHJldHVybiB7bWFya2VkOiB0cnVlLCBsYWJlbDogZC5sYWJlbCwgc3R5bGU6IGQuc3R5bGUsIHRpdGxlOiBkLnRpdGxlfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICAvKmlmIChtYXJrV2Vla2VuZHMgJiYgbWFya1dlZWtlbmRzLm1hcmtlZCkge1xuICAgICAgICBsZXQgZGF5TmJyID0gdGhpcy5nZXREYXlOdW1iZXIoZGF0ZSk7XG4gICAgICAgIGlmIChkYXlOYnIgPT09IDAgfHwgZGF5TmJyID09PSA2KSB7XG4gICAgICAgICAgICByZXR1cm4ge21hcmtlZDogdHJ1ZSwgbGFiZWw6IG1kLmxhYmVsLCBjb2xvcjogbWFya1dlZWtlbmRzLmNvbG9yfTtcbiAgICAgICAgfVxuICAgIH0qL1xuICAgIHJldHVybiB7bWFya2VkOiBmYWxzZSwgc3R5bGU6IFwiXCIsIGxhYmVsOiAnJywgdGl0bGU6ICcnfTtcbiAgfVxuXG5cbiAgaXNNYXJrZWREYXRlKGRhdGU6IElNeURhdGUsIG9wdGlvbnM6IElNeU9wdGlvbnMpOiBJTXlNYXJrZWREYXRlIHtcbiAgICBjb25zdCB7bWFya0RhdGVzLCBtYXJrV2Vla2VuZHN9ID0gb3B0aW9ucztcblxuICAgIGZvciAoY29uc3QgbWQgb2YgbWFya0RhdGVzKSB7XG4gICAgICBpZiAodGhpcy5kYXRlTWF0Y2hUb0RhdGVzKGRhdGUsIG1kLmRhdGVzKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRNYXJrZWRWYWx1ZSh0cnVlLCBtZC5jb2xvciwgbWQuc3R5bGVDbGFzcyk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChtYXJrV2Vla2VuZHMgJiYgbWFya1dlZWtlbmRzLm1hcmtlZCkge1xuICAgICAgY29uc3QgZGF5TmJyID0gdGhpcy5nZXREYXlOdW1iZXIoZGF0ZSk7XG4gICAgICBpZiAoZGF5TmJyID09PSAwIHx8IGRheU5iciA9PT0gNikge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRNYXJrZWRWYWx1ZSh0cnVlLCBtYXJrV2Vla2VuZHMuY29sb3IsIEVNUFRZX1NUUik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmdldE1hcmtlZFZhbHVlKGZhbHNlLCBFTVBUWV9TVFIsIEVNUFRZX1NUUik7XG4gIH1cblxuICBnZXRNYXJrZWRWYWx1ZShtYXJrZWQ6IGJvb2xlYW4sIGNvbG9yOiBzdHJpbmcsIHN0eWxlQ2xhc3M6IHN0cmluZyk6IElNeU1hcmtlZERhdGUge1xuICAgIHJldHVybiB7bWFya2VkLCBjb2xvcjogY29sb3IgPyBjb2xvciA6IEVNUFRZX1NUUiwgc3R5bGVDbGFzczogc3R5bGVDbGFzcyA/IHN0eWxlQ2xhc3MgOiBFTVBUWV9TVFJ9O1xuICB9XG5cbiAgaXNIaWdobGlnaHRlZERhdGUoZGF0ZTogSU15RGF0ZSwgb3B0aW9uczogSU15T3B0aW9ucyk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHtzdW5IaWdobGlnaHQsIHNhdEhpZ2hsaWdodCwgaGlnaGxpZ2h0RGF0ZXN9ID0gb3B0aW9ucztcblxuICAgIGNvbnN0IGRheU5icjogbnVtYmVyID0gdGhpcy5nZXREYXlOdW1iZXIoZGF0ZSk7XG4gICAgaWYgKHN1bkhpZ2hsaWdodCAmJiBkYXlOYnIgPT09IDAgfHwgc2F0SGlnaGxpZ2h0ICYmIGRheU5iciA9PT0gNikge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZGF0ZU1hdGNoVG9EYXRlcyhkYXRlLCBoaWdobGlnaHREYXRlcykpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGdldFdlZWtOdW1iZXIoZGF0ZTogSU15RGF0ZSk6IG51bWJlciB7XG4gICAgY29uc3QgZDogRGF0ZSA9IG5ldyBEYXRlKGRhdGUueWVhciwgZGF0ZS5tb250aCAtIDEsIGRhdGUuZGF5LCAwLCAwLCAwLCAwKTtcbiAgICBkLnNldERhdGUoZC5nZXREYXRlKCkgKyAoZC5nZXREYXkoKSA9PT0gMCA/IC0zIDogNCAtIGQuZ2V0RGF5KCkpKTtcbiAgICByZXR1cm4gTWF0aC5yb3VuZCgoKGQuZ2V0VGltZSgpIC0gbmV3IERhdGUoZC5nZXRGdWxsWWVhcigpLCAwLCA0KS5nZXRUaW1lKCkpIC8gODY0MDAwMDApIC8gNykgKyAxO1xuICB9XG5cbiAgZ2V0RGF0ZU1vZGVsKGRhdGU6IElNeURhdGUsIGRhdGVSYW5nZTogSU15RGF0ZVJhbmdlLCBkYXRlRm9ybWF0OiBzdHJpbmcsIG1vbnRoTGFiZWxzOiBJTXlNb250aExhYmVscywgcmFuZ2VEZWxpbWl0ZXI6IHN0cmluZywgZGF0ZVN0cjogc3RyaW5nID0gRU1QVFlfU1RSKTogSU15RGF0ZU1vZGVsIHtcbiAgICBsZXQgc2luZ2xlRGF0ZU1vZGVsOiBJTXlTaW5nbGVEYXRlTW9kZWwgPSBudWxsO1xuICAgIGxldCBkYXRlUmFuZ2VNb2RlbDogSU15RGF0ZVJhbmdlTW9kZWwgPSBudWxsO1xuXG4gICAgaWYgKGRhdGUpIHtcbiAgICAgIHNpbmdsZURhdGVNb2RlbCA9IHtcbiAgICAgICAgZGF0ZSxcbiAgICAgICAganNEYXRlOiB0aGlzLm15RGF0ZVRvSnNEYXRlKGRhdGUpLFxuICAgICAgICBmb3JtYXR0ZWQ6IGRhdGVTdHIubGVuZ3RoID8gZGF0ZVN0ciA6IHRoaXMuZm9ybWF0RGF0ZShkYXRlLCBkYXRlRm9ybWF0LCBtb250aExhYmVscyksXG4gICAgICAgIGVwb2M6IHRoaXMuZ2V0RXBvY1RpbWUoZGF0ZSlcbiAgICAgIH07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgZGF0ZVJhbmdlTW9kZWwgPSB7XG4gICAgICAgIGJlZ2luRGF0ZTogZGF0ZVJhbmdlLmJlZ2luLFxuICAgICAgICBiZWdpbkpzRGF0ZTogdGhpcy5teURhdGVUb0pzRGF0ZShkYXRlUmFuZ2UuYmVnaW4pLFxuICAgICAgICBiZWdpbkVwb2M6IHRoaXMuZ2V0RXBvY1RpbWUoZGF0ZVJhbmdlLmJlZ2luKSxcbiAgICAgICAgZW5kRGF0ZTogZGF0ZVJhbmdlLmVuZCxcbiAgICAgICAgZW5kSnNEYXRlOiB0aGlzLm15RGF0ZVRvSnNEYXRlKGRhdGVSYW5nZS5lbmQpLFxuICAgICAgICBlbmRFcG9jOiB0aGlzLmdldEVwb2NUaW1lKGRhdGVSYW5nZS5lbmQpLFxuICAgICAgICBmb3JtYXR0ZWQ6IHRoaXMuZm9ybWF0RGF0ZShkYXRlUmFuZ2UuYmVnaW4sIGRhdGVGb3JtYXQsIG1vbnRoTGFiZWxzKSArIHJhbmdlRGVsaW1pdGVyICsgdGhpcy5mb3JtYXREYXRlKGRhdGVSYW5nZS5lbmQsIGRhdGVGb3JtYXQsIG1vbnRoTGFiZWxzKVxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgaXNSYW5nZTogZGF0ZSA9PT0gbnVsbCxcbiAgICAgIHNpbmdsZURhdGU6IHNpbmdsZURhdGVNb2RlbCxcbiAgICAgIGRhdGVSYW5nZTogZGF0ZVJhbmdlTW9kZWxcbiAgICB9O1xuICB9XG5cbiAgZm9ybWF0RGF0ZShkYXRlOiBJTXlEYXRlLCBkYXRlRm9ybWF0OiBzdHJpbmcsIG1vbnRoTGFiZWxzOiBJTXlNb250aExhYmVscyk6IHN0cmluZyB7XG4gICAgbGV0IGZvcm1hdHRlZDogc3RyaW5nID0gZGF0ZUZvcm1hdC5yZXBsYWNlKFlZWVksIFN0cmluZyhkYXRlLnllYXIpKTtcblxuICAgIGlmIChkYXRlRm9ybWF0LmluZGV4T2YoTU1NKSAhPT0gLTEpIHtcbiAgICAgIGZvcm1hdHRlZCA9IGZvcm1hdHRlZC5yZXBsYWNlKE1NTSwgbW9udGhMYWJlbHNbZGF0ZS5tb250aF0pO1xuICAgIH1cbiAgICBlbHNlIGlmIChkYXRlRm9ybWF0LmluZGV4T2YoTU0pICE9PSAtMSkge1xuICAgICAgZm9ybWF0dGVkID0gZm9ybWF0dGVkLnJlcGxhY2UoTU0sIHRoaXMucHJlWmVybyhkYXRlLm1vbnRoKSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgZm9ybWF0dGVkID0gZm9ybWF0dGVkLnJlcGxhY2UoTSwgU3RyaW5nKGRhdGUubW9udGgpKTtcbiAgICB9XG5cbiAgICBpZiAoZGF0ZUZvcm1hdC5pbmRleE9mKEREKSAhPT0gLTEpIHtcbiAgICAgIGZvcm1hdHRlZCA9IGZvcm1hdHRlZC5yZXBsYWNlKERELCB0aGlzLnByZVplcm8oZGF0ZS5kYXkpKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBmb3JtYXR0ZWQgPSBmb3JtYXR0ZWQucmVwbGFjZShELCBTdHJpbmcoZGF0ZS5kYXkpKTtcbiAgICB9XG4gICAgcmV0dXJuIGZvcm1hdHRlZDtcbiAgfVxuXG4gIGdldEZvcm1hdHRlZERhdGUobW9kZWw6IElNeURhdGVNb2RlbCk6IHN0cmluZyB7XG4gICAgcmV0dXJuICFtb2RlbC5pc1JhbmdlID8gbW9kZWwuc2luZ2xlRGF0ZS5mb3JtYXR0ZWQgOiBtb2RlbC5kYXRlUmFuZ2UuZm9ybWF0dGVkO1xuICB9XG5cbiAgcHJlWmVybyh2YWw6IG51bWJlcik6IHN0cmluZyB7XG4gICAgcmV0dXJuIHZhbCA8IDEwID8gWkVST19TVFIgKyB2YWwgOiBTdHJpbmcodmFsKTtcbiAgfVxuXG4gIGlzSW5pdGlhbGl6ZWREYXRlKGRhdGU6IElNeURhdGUpOiBib29sZWFuIHtcbiAgICByZXR1cm4gZGF0ZS55ZWFyICE9PSAwICYmIGRhdGUubW9udGggIT09IDAgJiYgZGF0ZS5kYXkgIT09IDA7XG4gIH1cblxuICBpc0RhdGVFYXJsaWVyKGZpcnN0RGF0ZTogSU15RGF0ZSwgc2Vjb25kRGF0ZTogSU15RGF0ZSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmdldFRpbWVJbk1pbGxpc2Vjb25kcyhmaXJzdERhdGUpIDwgdGhpcy5nZXRUaW1lSW5NaWxsaXNlY29uZHMoc2Vjb25kRGF0ZSk7XG4gIH1cblxuICBpc0RhdGVTYW1lT3JFYXJsaWVyKGZpcnN0RGF0ZTogSU15RGF0ZSwgc2Vjb25kRGF0ZTogSU15RGF0ZSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmdldFRpbWVJbk1pbGxpc2Vjb25kcyhmaXJzdERhdGUpIDw9IHRoaXMuZ2V0VGltZUluTWlsbGlzZWNvbmRzKHNlY29uZERhdGUpO1xuICB9XG5cbiAgaXNEYXRlU2FtZShmaXJzdERhdGU6IElNeURhdGUsIHNlY29uZERhdGU6IElNeURhdGUpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5nZXRUaW1lSW5NaWxsaXNlY29uZHMoZmlyc3REYXRlKSA9PT0gdGhpcy5nZXRUaW1lSW5NaWxsaXNlY29uZHMoc2Vjb25kRGF0ZSk7XG4gIH1cblxuICBpc0RhdGVSYW5nZUJlZ2luT3JFbmRTYW1lKGRhdGVSYW5nZTogSU15RGF0ZVJhbmdlLCBkYXRlOiBJTXlEYXRlKTogYm9vbGVhbiB7XG4gICAgY29uc3QgZGF0ZU1zOiBudW1iZXIgPSB0aGlzLmdldFRpbWVJbk1pbGxpc2Vjb25kcyhkYXRlKTtcbiAgICByZXR1cm4gdGhpcy5nZXRUaW1lSW5NaWxsaXNlY29uZHMoZGF0ZVJhbmdlLmJlZ2luKSA9PT0gZGF0ZU1zIHx8IHRoaXMuZ2V0VGltZUluTWlsbGlzZWNvbmRzKGRhdGVSYW5nZS5lbmQpID09PSBkYXRlTXM7XG4gIH1cblxuICBpc0RhdGVJblJhbmdlKGRhdGU6IElNeURhdGUsIGRhdGVSYW5nZTogSU15RGF0ZVJhbmdlKTogYm9vbGVhbiB7XG4gICAgaWYgKCF0aGlzLmlzSW5pdGlhbGl6ZWREYXRlKGRhdGVSYW5nZS5iZWdpbikgfHwgIXRoaXMuaXNJbml0aWFsaXplZERhdGUoZGF0ZVJhbmdlLmVuZCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuaXNEYXRlU2FtZU9yRWFybGllcihkYXRlUmFuZ2UuYmVnaW4sIGRhdGUpICYmIHRoaXMuaXNEYXRlU2FtZU9yRWFybGllcihkYXRlLCBkYXRlUmFuZ2UuZW5kKTtcbiAgfVxuXG4gIHJlc2V0RGF0ZSgpOiBJTXlEYXRlIHtcbiAgICByZXR1cm4ge3llYXI6IDAsIG1vbnRoOiAwLCBkYXk6IDB9O1xuICB9XG5cbiAgZ2V0VGltZUluTWlsbGlzZWNvbmRzKGRhdGU6IElNeURhdGUpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLm15RGF0ZVRvSnNEYXRlKGRhdGUpLmdldFRpbWUoKTtcbiAgfVxuXG4gIGdldFRvZGF5KCk6IElNeURhdGUge1xuICAgIGNvbnN0IGRhdGU6IERhdGUgPSBuZXcgRGF0ZSgpO1xuICAgIHJldHVybiB7eWVhcjogZGF0ZS5nZXRGdWxsWWVhcigpLCBtb250aDogZGF0ZS5nZXRNb250aCgpICsgMSwgZGF5OiBkYXRlLmdldERhdGUoKX07XG4gIH1cblxuICBnZXREYXlOdW1iZXIoZGF0ZTogSU15RGF0ZSk6IG51bWJlciB7XG4gICAgcmV0dXJuIG5ldyBEYXRlKGRhdGUueWVhciwgZGF0ZS5tb250aCAtIDEsIGRhdGUuZGF5LCAwLCAwLCAwLCAwKS5nZXREYXkoKTtcbiAgfVxuXG4gIGdldFdlZWtkYXlJbmRleCh3ZDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMud2Vla0RheXMuaW5kZXhPZih3ZCk7XG4gIH1cblxuICBnZXRFcG9jVGltZShkYXRlOiBJTXlEYXRlKTogbnVtYmVyIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZCh0aGlzLmdldFRpbWVJbk1pbGxpc2Vjb25kcyhkYXRlKSAvIDEwMDAuMCk7XG4gIH1cblxuICBqc0RhdGVUb015RGF0ZShkYXRlOiBEYXRlKTogSU15RGF0ZSB7XG4gICAgcmV0dXJuIHt5ZWFyOiBkYXRlLmdldEZ1bGxZZWFyKCksIG1vbnRoOiBkYXRlLmdldE1vbnRoKCkgKyAxLCBkYXk6IGRhdGUuZ2V0RGF0ZSgpfTtcbiAgfVxuXG4gIG15RGF0ZVRvSnNEYXRlKGRhdGU6IElNeURhdGUpOiBEYXRlIHtcbiAgICBjb25zdCB7eWVhciwgbW9udGgsIGRheX0gPSBkYXRlO1xuICAgIHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCAtIDEsIGRheSwgMCwgMCwgMCwgMCk7XG4gIH1cblxuICBkYXRlc0luTW9udGgobTogbnVtYmVyLCB5OiBudW1iZXIpOiBudW1iZXIge1xuICAgIHJldHVybiBuZXcgRGF0ZSh5LCBtLCAwKS5nZXREYXRlKCk7XG4gIH1cblxuICBkYXRlc0luUHJldk1vbnRoKG06IG51bWJlciwgeTogbnVtYmVyKTogbnVtYmVyIHtcbiAgICBjb25zdCBkOiBEYXRlID0gdGhpcy5nZXRKc0RhdGUoeSwgbSwgMSk7XG4gICAgZC5zZXRNb250aChkLmdldE1vbnRoKCkgLSAxKTtcbiAgICByZXR1cm4gdGhpcy5kYXRlc0luTW9udGgoZC5nZXRNb250aCgpICsgMSwgZC5nZXRGdWxsWWVhcigpKTtcbiAgfVxuXG4gIGdldEpzRGF0ZSh5ZWFyOiBudW1iZXIsIG1vbnRoOiBudW1iZXIsIGRheTogbnVtYmVyKTogRGF0ZSB7XG4gICAgcmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoIC0gMSwgZGF5LCAwLCAwLCAwLCAwKTtcbiAgfVxuXG4gIGdldFNlbGVjdGVkVmFsdWUoc2VsZWN0ZWRWYWx1ZTogYW55LCBkYXRlUmFuZ2U6IGJvb2xlYW4pOiBhbnkge1xuICAgIGlmICghc2VsZWN0ZWRWYWx1ZSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgaWYgKCFkYXRlUmFuZ2UpIHtcbiAgICAgIHJldHVybiBzZWxlY3RlZFZhbHVlLmRhdGU7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgY29uc3Qge2JlZ2luRGF0ZSwgZW5kRGF0ZX0gPSBzZWxlY3RlZFZhbHVlO1xuICAgICAgcmV0dXJuIHtiZWdpbjogYmVnaW5EYXRlLCBlbmQ6IGVuZERhdGV9O1xuICAgIH1cbiAgfVxuXG4gIGdldEtleUNvZGVGcm9tRXZlbnQoZXZlbnQ6IGFueSk6IG51bWJlciB7XG4gICAgbGV0IGtleTogYW55ID0gZXZlbnQua2V5IHx8IGV2ZW50LmtleUNvZGUgfHwgZXZlbnQud2hpY2g7XG5cbiAgICBpZiAodGhpcy5jaGVja0tleU5hbWUoa2V5LCBLZXlOYW1lLmVudGVyKSB8fCBrZXkgPT09IEtleUNvZGUuZW50ZXIpIHtcbiAgICAgIHJldHVybiBLZXlDb2RlLmVudGVyO1xuICAgIH1cbiAgICBlbHNlIGlmICh0aGlzLmNoZWNrS2V5TmFtZShrZXksIEtleU5hbWUuZXNjKSB8fCBrZXkgPT09IEtleUNvZGUuZXNjKSB7XG4gICAgICByZXR1cm4gS2V5Q29kZS5lc2M7XG4gICAgfVxuICAgIGVsc2UgaWYgKHRoaXMuY2hlY2tLZXlOYW1lKGtleSwgS2V5TmFtZS5zcGFjZSkgfHwga2V5ID09PSBLZXlDb2RlLnNwYWNlKSB7XG4gICAgICByZXR1cm4gS2V5Q29kZS5zcGFjZTtcbiAgICB9XG4gICAgZWxzZSBpZiAodGhpcy5jaGVja0tleU5hbWUoa2V5LCBLZXlOYW1lLmxlZnRBcnJvdykgfHwga2V5ID09PSBLZXlDb2RlLmxlZnRBcnJvdykge1xuICAgICAgcmV0dXJuIEtleUNvZGUubGVmdEFycm93O1xuICAgIH1cbiAgICBlbHNlIGlmICh0aGlzLmNoZWNrS2V5TmFtZShrZXksIEtleU5hbWUudXBBcnJvdykgfHwga2V5ID09PSBLZXlDb2RlLnVwQXJyb3cpIHtcbiAgICAgIHJldHVybiBLZXlDb2RlLnVwQXJyb3c7XG4gICAgfVxuICAgIGVsc2UgaWYgKHRoaXMuY2hlY2tLZXlOYW1lKGtleSwgS2V5TmFtZS5yaWdodEFycm93KSB8fCBrZXkgPT09IEtleUNvZGUucmlnaHRBcnJvdykge1xuICAgICAgcmV0dXJuIEtleUNvZGUucmlnaHRBcnJvdztcbiAgICB9XG4gICAgZWxzZSBpZiAodGhpcy5jaGVja0tleU5hbWUoa2V5LCBLZXlOYW1lLmRvd25BcnJvdyl8fCBrZXkgPT09IEtleUNvZGUuZG93bkFycm93KSB7XG4gICAgICByZXR1cm4gS2V5Q29kZS5kb3duQXJyb3c7XG4gICAgfVxuICAgIGVsc2UgaWYgKHRoaXMuY2hlY2tLZXlOYW1lKGtleSwgS2V5TmFtZS50YWIpIHx8IGtleSA9PT0gS2V5Q29kZS50YWIpIHtcbiAgICAgIHJldHVybiBLZXlDb2RlLnRhYjtcbiAgICB9XG4gICAgZWxzZSBpZiAodGhpcy5jaGVja0tleU5hbWUoa2V5LCBLZXlOYW1lLnNoaWZ0KSB8fCBrZXkgPT09IEtleUNvZGUuc2hpZnQpIHtcbiAgICAgIHJldHVybiBLZXlDb2RlLnNoaWZ0O1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGNoZWNrS2V5TmFtZShrZXk6IHN0cmluZywga2V5TmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgY29uc3QgYXJyOiBBcnJheTxzdHJpbmc+ID0ga2V5TmFtZS5zcGxpdChQSVBFKTtcbiAgICByZXR1cm4gYXJyLmluZGV4T2Yoa2V5KSAhPT0gLTE7XG4gIH1cbn1cbiJdfQ==