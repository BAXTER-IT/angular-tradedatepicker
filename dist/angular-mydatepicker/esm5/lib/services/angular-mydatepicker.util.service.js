/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Injectable } from "@angular/core";
import { KeyCode } from "../enums/key-code.enum";
import { KeyName } from "../enums/key-name.enum";
import { D, DD, M, MM, MMM, YYYY, SU, MO, TU, WE, TH, FR, SA, ZERO_STR, EMPTY_STR, PIPE } from "../constants/constants";
var UtilService = /** @class */ (function () {
    function UtilService() {
        this.weekDays = [SU, MO, TU, WE, TH, FR, SA];
    }
    /**
     * @param {?} dateStr
     * @param {?} options
     * @param {?} validateOpts
     * @return {?}
     */
    UtilService.prototype.isDateValid = /**
     * @param {?} dateStr
     * @param {?} options
     * @param {?} validateOpts
     * @return {?}
     */
    function (dateStr, options, validateOpts) {
        var e_1, _a;
        var dateFormat = options.dateFormat, minYear = options.minYear, maxYear = options.maxYear, monthLabels = options.monthLabels;
        /** @type {?} */
        var returnDate = this.resetDate();
        /** @type {?} */
        var datesInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        /** @type {?} */
        var isMonthStr = dateFormat.indexOf(MMM) !== -1;
        /** @type {?} */
        var delimeters = dateFormat.match(/[^(dmy)]{1,}/g);
        if (!dateStr || dateStr === EMPTY_STR) {
            return returnDate;
        }
        /** @type {?} */
        var dateValues = this.getDateValue(dateStr, dateFormat, delimeters);
        /** @type {?} */
        var year = 0;
        /** @type {?} */
        var month = 0;
        /** @type {?} */
        var day = 0;
        try {
            for (var dateValues_1 = tslib_1.__values(dateValues), dateValues_1_1 = dateValues_1.next(); !dateValues_1_1.done; dateValues_1_1 = dateValues_1.next()) {
                var dv = dateValues_1_1.value;
                var format = dv.format;
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
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (dateValues_1_1 && !dateValues_1_1.done && (_a = dateValues_1.return)) _a.call(dateValues_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var validateDisabledDates = validateOpts.validateDisabledDates, selectedValue = validateOpts.selectedValue;
        year = year === 0 && selectedValue ? selectedValue.year : year;
        month = month === 0 && selectedValue ? selectedValue.month : month;
        day = day === 0 && selectedValue ? selectedValue.day : day;
        /** @type {?} */
        var today = this.getToday();
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
            var date = { year: year, month: month, day: day };
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
    };
    /**
     * @param {?} dateRangeStr
     * @param {?} options
     * @param {?} validateOpts
     * @return {?}
     */
    UtilService.prototype.isDateValidDateRange = /**
     * @param {?} dateRangeStr
     * @param {?} options
     * @param {?} validateOpts
     * @return {?}
     */
    function (dateRangeStr, options, validateOpts) {
        /** @type {?} */
        var dateRange = { begin: this.resetDate(), end: this.resetDate() };
        if (dateRangeStr && dateRangeStr.length) {
            /** @type {?} */
            var dates = dateRangeStr.split(options.dateRangeDatesDelimiter);
            if (dates && dates.length === 2) {
                var _a = tslib_1.__read(dates, 2), beginDate = _a[0], endDate = _a[1];
                var selectedValue = validateOpts.selectedValue;
                if (selectedValue) {
                    validateOpts.selectedValue = selectedValue.begin;
                }
                /** @type {?} */
                var begin = this.isDateValid(beginDate, options, validateOpts);
                if (this.isInitializedDate(begin)) {
                    if (selectedValue) {
                        validateOpts.selectedValue = selectedValue.end;
                    }
                    /** @type {?} */
                    var end = this.isDateValid(endDate, options, validateOpts);
                    if (this.isInitializedDate(end) && this.isDateSameOrEarlier(begin, end)) {
                        dateRange = { begin: begin, end: end };
                    }
                }
            }
        }
        return dateRange;
    };
    /**
     * @param {?} dateStr
     * @param {?} dateFormat
     * @param {?} delimeters
     * @return {?}
     */
    UtilService.prototype.getDateValue = /**
     * @param {?} dateStr
     * @param {?} dateFormat
     * @param {?} delimeters
     * @return {?}
     */
    function (dateStr, dateFormat, delimeters) {
        var e_2, _a;
        /** @type {?} */
        var del = EMPTY_STR;
        if (delimeters) {
            try {
                for (var delimeters_1 = tslib_1.__values(delimeters), delimeters_1_1 = delimeters_1.next(); !delimeters_1_1.done; delimeters_1_1 = delimeters_1.next()) {
                    var d = delimeters_1_1.value;
                    if (del.indexOf(d) === -1) {
                        del += d;
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (delimeters_1_1 && !delimeters_1_1.done && (_a = delimeters_1.return)) _a.call(delimeters_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
        /** @type {?} */
        var re = new RegExp("[" + del + "]");
        /** @type {?} */
        var ds = dateStr.split(re);
        /** @type {?} */
        var df = dateFormat.split(re);
        /** @type {?} */
        var da = [];
        for (var i = 0; i < df.length; i++) {
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
    };
    /**
     * @param {?} df
     * @param {?} monthLabels
     * @return {?}
     */
    UtilService.prototype.getMonthNumberByMonthName = /**
     * @param {?} df
     * @param {?} monthLabels
     * @return {?}
     */
    function (df, monthLabels) {
        if (df.value) {
            for (var key = 1; key <= 12; key++) {
                if (df.value.toLowerCase() === monthLabels[key].toLowerCase()) {
                    return key;
                }
            }
        }
        return -1;
    };
    /**
     * @param {?} df
     * @return {?}
     */
    UtilService.prototype.getNumberByValue = /**
     * @param {?} df
     * @return {?}
     */
    function (df) {
        if (!/^\d+$/.test(df.value)) {
            return -1;
        }
        /** @type {?} */
        var nbr = Number(df.value);
        if (df.format.length === 1 && df.value.length !== 1 && nbr < 10 || df.format.length === 1 && df.value.length !== 2 && nbr >= 10) {
            nbr = -1;
        }
        else if (df.format.length === 2 && df.value.length > 2) {
            nbr = -1;
        }
        return nbr;
    };
    /**
     * @param {?} monthString
     * @return {?}
     */
    UtilService.prototype.parseDefaultMonth = /**
     * @param {?} monthString
     * @return {?}
     */
    function (monthString) {
        /** @type {?} */
        var month = { monthTxt: EMPTY_STR, monthNbr: 0, year: 0 };
        if (monthString !== EMPTY_STR) {
            /** @type {?} */
            var split = monthString.split(monthString.match(/[^0-9]/)[0]);
            month.monthNbr = split[0].length === 2 ? Number(split[0]) : Number(split[1]);
            month.year = split[0].length === 2 ? Number(split[1]) : Number(split[0]);
        }
        return month;
    };
    /**
     * @param {?} date
     * @param {?} options
     * @return {?}
     */
    UtilService.prototype.isDisabledDate = /**
     * @param {?} date
     * @param {?} options
     * @return {?}
     */
    function (date, options) {
        var e_3, _a, e_4, _b;
        var minYear = options.minYear, maxYear = options.maxYear, disableUntil = options.disableUntil, disableSince = options.disableSince, disableWeekends = options.disableWeekends, disableDates = options.disableDates, disableDateRanges = options.disableDateRanges, disableWeekdays = options.disableWeekdays, enableDates = options.enableDates;
        if (this.dateMatchToDates(date, enableDates)) {
            return this.getDisabledValue(false, EMPTY_STR);
        }
        if (date.year < minYear && date.month === 12 || date.year > maxYear && date.month === 1) {
            return this.getDisabledValue(true, EMPTY_STR);
        }
        /** @type {?} */
        var inputDates = (/** @type {?} */ (disableDates));
        /** @type {?} */
        var result = inputDates.find((/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            return d.dates;
        }));
        if (!result) {
            if (this.dateMatchToDates(date, inputDates)) {
                return this.getDisabledValue(true, EMPTY_STR);
            }
        }
        else {
            try {
                for (var inputDates_1 = tslib_1.__values(inputDates), inputDates_1_1 = inputDates_1.next(); !inputDates_1_1.done; inputDates_1_1 = inputDates_1.next()) {
                    var dd = inputDates_1_1.value;
                    if (this.dateMatchToDates(date, dd.dates)) {
                        return this.getDisabledValue(true, dd.styleClass);
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (inputDates_1_1 && !inputDates_1_1.done && (_a = inputDates_1.return)) _a.call(inputDates_1);
                }
                finally { if (e_3) throw e_3.error; }
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
            var dayNbr = this.getDayNumber(date);
            if (dayNbr === 0 || dayNbr === 6) {
                return this.getDisabledValue(true, EMPTY_STR);
            }
        }
        /** @type {?} */
        var dn = this.getDayNumber(date);
        if (disableWeekdays.length > 0) {
            try {
                for (var disableWeekdays_1 = tslib_1.__values(disableWeekdays), disableWeekdays_1_1 = disableWeekdays_1.next(); !disableWeekdays_1_1.done; disableWeekdays_1_1 = disableWeekdays_1.next()) {
                    var wd = disableWeekdays_1_1.value;
                    if (dn === this.getWeekdayIndex(wd)) {
                        return this.getDisabledValue(true, EMPTY_STR);
                    }
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (disableWeekdays_1_1 && !disableWeekdays_1_1.done && (_b = disableWeekdays_1.return)) _b.call(disableWeekdays_1);
                }
                finally { if (e_4) throw e_4.error; }
            }
        }
        if (this.isDisabledByDisableDateRange(date, date, disableDateRanges)) {
            return this.getDisabledValue(true, EMPTY_STR);
        }
        return this.getDisabledValue(false, EMPTY_STR);
    };
    /**
     * @param {?} disabled
     * @param {?} styleClass
     * @return {?}
     */
    UtilService.prototype.getDisabledValue = /**
     * @param {?} disabled
     * @param {?} styleClass
     * @return {?}
     */
    function (disabled, styleClass) {
        return { disabled: disabled, styleClass: styleClass };
    };
    /**
     * @param {?} date
     * @param {?} dates
     * @return {?}
     */
    UtilService.prototype.dateMatchToDates = /**
     * @param {?} date
     * @param {?} dates
     * @return {?}
     */
    function (date, dates) {
        var e_5, _a;
        try {
            for (var dates_1 = tslib_1.__values(dates), dates_1_1 = dates_1.next(); !dates_1_1.done; dates_1_1 = dates_1.next()) {
                var d = dates_1_1.value;
                if ((d.year === 0 || d.year === date.year) && (d.month === 0 || d.month === date.month) && d.day === date.day) {
                    return true;
                }
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (dates_1_1 && !dates_1_1.done && (_a = dates_1.return)) _a.call(dates_1);
            }
            finally { if (e_5) throw e_5.error; }
        }
        return false;
    };
    /**
     * @param {?} year
     * @param {?} month
     * @param {?} options
     * @return {?}
     */
    UtilService.prototype.isDisabledMonth = /**
     * @param {?} year
     * @param {?} month
     * @param {?} options
     * @return {?}
     */
    function (year, month, options) {
        var disableUntil = options.disableUntil, disableSince = options.disableSince, disableDateRanges = options.disableDateRanges, enableDates = options.enableDates;
        /** @type {?} */
        var dateEnd = { year: year, month: month, day: this.datesInMonth(month, year) };
        /** @type {?} */
        var dateBegin = { year: year, month: month, day: 1 };
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
    };
    /**
     * @param {?} year
     * @param {?} options
     * @return {?}
     */
    UtilService.prototype.isDisabledYear = /**
     * @param {?} year
     * @param {?} options
     * @return {?}
     */
    function (year, options) {
        var disableUntil = options.disableUntil, disableSince = options.disableSince, disableDateRanges = options.disableDateRanges, enableDates = options.enableDates, minYear = options.minYear, maxYear = options.maxYear;
        /** @type {?} */
        var dateEnd = { year: year, month: 12, day: 31 };
        /** @type {?} */
        var dateBegin = { year: year, month: 1, day: 1 };
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
    };
    /**
     * @param {?} date
     * @param {?} disableUntil
     * @return {?}
     */
    UtilService.prototype.isDisabledByDisableUntil = /**
     * @param {?} date
     * @param {?} disableUntil
     * @return {?}
     */
    function (date, disableUntil) {
        return this.isInitializedDate(disableUntil) && this.getTimeInMilliseconds(date) <= this.getTimeInMilliseconds(disableUntil);
    };
    /**
     * @param {?} date
     * @param {?} disableSince
     * @return {?}
     */
    UtilService.prototype.isDisabledByDisableSince = /**
     * @param {?} date
     * @param {?} disableSince
     * @return {?}
     */
    function (date, disableSince) {
        return this.isInitializedDate(disableSince) && this.getTimeInMilliseconds(date) >= this.getTimeInMilliseconds(disableSince);
    };
    /**
     * @param {?} date
     * @param {?} enableDates
     * @return {?}
     */
    UtilService.prototype.isPastDatesEnabled = /**
     * @param {?} date
     * @param {?} enableDates
     * @return {?}
     */
    function (date, enableDates) {
        var e_6, _a;
        try {
            for (var enableDates_1 = tslib_1.__values(enableDates), enableDates_1_1 = enableDates_1.next(); !enableDates_1_1.done; enableDates_1_1 = enableDates_1.next()) {
                var d = enableDates_1_1.value;
                if (this.getTimeInMilliseconds(d) <= this.getTimeInMilliseconds(date)) {
                    return true;
                }
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (enableDates_1_1 && !enableDates_1_1.done && (_a = enableDates_1.return)) _a.call(enableDates_1);
            }
            finally { if (e_6) throw e_6.error; }
        }
        return false;
    };
    /**
     * @param {?} date
     * @param {?} enableDates
     * @return {?}
     */
    UtilService.prototype.isFutureDatesEnabled = /**
     * @param {?} date
     * @param {?} enableDates
     * @return {?}
     */
    function (date, enableDates) {
        var e_7, _a;
        try {
            for (var enableDates_2 = tslib_1.__values(enableDates), enableDates_2_1 = enableDates_2.next(); !enableDates_2_1.done; enableDates_2_1 = enableDates_2.next()) {
                var d = enableDates_2_1.value;
                if (this.getTimeInMilliseconds(d) >= this.getTimeInMilliseconds(date)) {
                    return true;
                }
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (enableDates_2_1 && !enableDates_2_1.done && (_a = enableDates_2.return)) _a.call(enableDates_2);
            }
            finally { if (e_7) throw e_7.error; }
        }
        return false;
    };
    /**
     * @param {?} dateBegin
     * @param {?} dateEnd
     * @param {?} enableDates
     * @return {?}
     */
    UtilService.prototype.isDatesEnabled = /**
     * @param {?} dateBegin
     * @param {?} dateEnd
     * @param {?} enableDates
     * @return {?}
     */
    function (dateBegin, dateEnd, enableDates) {
        var e_8, _a;
        try {
            for (var enableDates_3 = tslib_1.__values(enableDates), enableDates_3_1 = enableDates_3.next(); !enableDates_3_1.done; enableDates_3_1 = enableDates_3.next()) {
                var d = enableDates_3_1.value;
                if (this.getTimeInMilliseconds(d) >= this.getTimeInMilliseconds(dateBegin)
                    && this.getTimeInMilliseconds(d) <= this.getTimeInMilliseconds(dateEnd)) {
                    return true;
                }
            }
        }
        catch (e_8_1) { e_8 = { error: e_8_1 }; }
        finally {
            try {
                if (enableDates_3_1 && !enableDates_3_1.done && (_a = enableDates_3.return)) _a.call(enableDates_3);
            }
            finally { if (e_8) throw e_8.error; }
        }
        return false;
    };
    /**
     * @param {?} dateBegin
     * @param {?} dateEnd
     * @param {?} disableDateRanges
     * @return {?}
     */
    UtilService.prototype.isDisabledByDisableDateRange = /**
     * @param {?} dateBegin
     * @param {?} dateEnd
     * @param {?} disableDateRanges
     * @return {?}
     */
    function (dateBegin, dateEnd, disableDateRanges) {
        var e_9, _a;
        /** @type {?} */
        var dateMsBegin = this.getTimeInMilliseconds(dateBegin);
        /** @type {?} */
        var dateMsEnd = this.getTimeInMilliseconds(dateEnd);
        try {
            for (var disableDateRanges_1 = tslib_1.__values(disableDateRanges), disableDateRanges_1_1 = disableDateRanges_1.next(); !disableDateRanges_1_1.done; disableDateRanges_1_1 = disableDateRanges_1.next()) {
                var d = disableDateRanges_1_1.value;
                if (this.isInitializedDate(d.begin) && this.isInitializedDate(d.end)
                    && dateMsBegin >= this.getTimeInMilliseconds(d.begin) && dateMsEnd <= this.getTimeInMilliseconds(d.end)) {
                    return true;
                }
            }
        }
        catch (e_9_1) { e_9 = { error: e_9_1 }; }
        finally {
            try {
                if (disableDateRanges_1_1 && !disableDateRanges_1_1.done && (_a = disableDateRanges_1.return)) _a.call(disableDateRanges_1);
            }
            finally { if (e_9) throw e_9.error; }
        }
        return false;
    };
    /**
     * @param {?} date
     * @param {?} labeledDates
     * @return {?}
     */
    UtilService.prototype.isLabeledDate = /**
     * @param {?} date
     * @param {?} labeledDates
     * @return {?}
     */
    function (date, labeledDates) {
        var e_10, _a, e_11, _b;
        try {
            for (var labeledDates_1 = tslib_1.__values(labeledDates), labeledDates_1_1 = labeledDates_1.next(); !labeledDates_1_1.done; labeledDates_1_1 = labeledDates_1.next()) {
                var md = labeledDates_1_1.value;
                try {
                    for (var _c = tslib_1.__values(md.dates), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var d = _d.value;
                        if (d.date.year === date.year && d.date.month === date.month && d.date.day === date.day) {
                            return { marked: true, label: d.label, style: d.style, title: d.title };
                        }
                    }
                }
                catch (e_11_1) { e_11 = { error: e_11_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
                    }
                    finally { if (e_11) throw e_11.error; }
                }
            }
        }
        catch (e_10_1) { e_10 = { error: e_10_1 }; }
        finally {
            try {
                if (labeledDates_1_1 && !labeledDates_1_1.done && (_a = labeledDates_1.return)) _a.call(labeledDates_1);
            }
            finally { if (e_10) throw e_10.error; }
        }
        /*if (markWeekends && markWeekends.marked) {
            let dayNbr = this.getDayNumber(date);
            if (dayNbr === 0 || dayNbr === 6) {
                return {marked: true, label: md.label, color: markWeekends.color};
            }
        }*/
        return { marked: false, style: "", label: '', title: '' };
    };
    /**
     * @param {?} date
     * @param {?} options
     * @return {?}
     */
    UtilService.prototype.isMarkedDate = /**
     * @param {?} date
     * @param {?} options
     * @return {?}
     */
    function (date, options) {
        var e_12, _a;
        var markDates = options.markDates, markWeekends = options.markWeekends;
        try {
            for (var markDates_1 = tslib_1.__values(markDates), markDates_1_1 = markDates_1.next(); !markDates_1_1.done; markDates_1_1 = markDates_1.next()) {
                var md = markDates_1_1.value;
                if (this.dateMatchToDates(date, md.dates)) {
                    return this.getMarkedValue(true, md.color, md.styleClass);
                }
            }
        }
        catch (e_12_1) { e_12 = { error: e_12_1 }; }
        finally {
            try {
                if (markDates_1_1 && !markDates_1_1.done && (_a = markDates_1.return)) _a.call(markDates_1);
            }
            finally { if (e_12) throw e_12.error; }
        }
        if (markWeekends && markWeekends.marked) {
            /** @type {?} */
            var dayNbr = this.getDayNumber(date);
            if (dayNbr === 0 || dayNbr === 6) {
                return this.getMarkedValue(true, markWeekends.color, EMPTY_STR);
            }
        }
        return this.getMarkedValue(false, EMPTY_STR, EMPTY_STR);
    };
    /**
     * @param {?} marked
     * @param {?} color
     * @param {?} styleClass
     * @return {?}
     */
    UtilService.prototype.getMarkedValue = /**
     * @param {?} marked
     * @param {?} color
     * @param {?} styleClass
     * @return {?}
     */
    function (marked, color, styleClass) {
        return { marked: marked, color: color ? color : EMPTY_STR, styleClass: styleClass ? styleClass : EMPTY_STR };
    };
    /**
     * @param {?} date
     * @param {?} options
     * @return {?}
     */
    UtilService.prototype.isHighlightedDate = /**
     * @param {?} date
     * @param {?} options
     * @return {?}
     */
    function (date, options) {
        var sunHighlight = options.sunHighlight, satHighlight = options.satHighlight, highlightDates = options.highlightDates;
        /** @type {?} */
        var dayNbr = this.getDayNumber(date);
        if (sunHighlight && dayNbr === 0 || satHighlight && dayNbr === 6) {
            return true;
        }
        if (this.dateMatchToDates(date, highlightDates)) {
            return true;
        }
        return false;
    };
    /**
     * @param {?} date
     * @return {?}
     */
    UtilService.prototype.getWeekNumber = /**
     * @param {?} date
     * @return {?}
     */
    function (date) {
        /** @type {?} */
        var d = new Date(date.year, date.month - 1, date.day, 0, 0, 0, 0);
        d.setDate(d.getDate() + (d.getDay() === 0 ? -3 : 4 - d.getDay()));
        return Math.round(((d.getTime() - new Date(d.getFullYear(), 0, 4).getTime()) / 86400000) / 7) + 1;
    };
    /**
     * @param {?} date
     * @param {?} dateRange
     * @param {?} dateFormat
     * @param {?} monthLabels
     * @param {?} rangeDelimiter
     * @param {?=} dateStr
     * @return {?}
     */
    UtilService.prototype.getDateModel = /**
     * @param {?} date
     * @param {?} dateRange
     * @param {?} dateFormat
     * @param {?} monthLabels
     * @param {?} rangeDelimiter
     * @param {?=} dateStr
     * @return {?}
     */
    function (date, dateRange, dateFormat, monthLabels, rangeDelimiter, dateStr) {
        if (dateStr === void 0) { dateStr = EMPTY_STR; }
        /** @type {?} */
        var singleDateModel = null;
        /** @type {?} */
        var dateRangeModel = null;
        if (date) {
            singleDateModel = {
                date: date,
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
    };
    /**
     * @param {?} date
     * @param {?} dateFormat
     * @param {?} monthLabels
     * @return {?}
     */
    UtilService.prototype.formatDate = /**
     * @param {?} date
     * @param {?} dateFormat
     * @param {?} monthLabels
     * @return {?}
     */
    function (date, dateFormat, monthLabels) {
        /** @type {?} */
        var formatted = dateFormat.replace(YYYY, String(date.year));
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
    };
    /**
     * @param {?} model
     * @return {?}
     */
    UtilService.prototype.getFormattedDate = /**
     * @param {?} model
     * @return {?}
     */
    function (model) {
        return !model.isRange ? model.singleDate.formatted : model.dateRange.formatted;
    };
    /**
     * @param {?} val
     * @return {?}
     */
    UtilService.prototype.preZero = /**
     * @param {?} val
     * @return {?}
     */
    function (val) {
        return val < 10 ? ZERO_STR + val : String(val);
    };
    /**
     * @param {?} date
     * @return {?}
     */
    UtilService.prototype.isInitializedDate = /**
     * @param {?} date
     * @return {?}
     */
    function (date) {
        return date.year !== 0 && date.month !== 0 && date.day !== 0;
    };
    /**
     * @param {?} firstDate
     * @param {?} secondDate
     * @return {?}
     */
    UtilService.prototype.isDateEarlier = /**
     * @param {?} firstDate
     * @param {?} secondDate
     * @return {?}
     */
    function (firstDate, secondDate) {
        return this.getTimeInMilliseconds(firstDate) < this.getTimeInMilliseconds(secondDate);
    };
    /**
     * @param {?} firstDate
     * @param {?} secondDate
     * @return {?}
     */
    UtilService.prototype.isDateSameOrEarlier = /**
     * @param {?} firstDate
     * @param {?} secondDate
     * @return {?}
     */
    function (firstDate, secondDate) {
        return this.getTimeInMilliseconds(firstDate) <= this.getTimeInMilliseconds(secondDate);
    };
    /**
     * @param {?} firstDate
     * @param {?} secondDate
     * @return {?}
     */
    UtilService.prototype.isDateSame = /**
     * @param {?} firstDate
     * @param {?} secondDate
     * @return {?}
     */
    function (firstDate, secondDate) {
        return this.getTimeInMilliseconds(firstDate) === this.getTimeInMilliseconds(secondDate);
    };
    /**
     * @param {?} dateRange
     * @param {?} date
     * @return {?}
     */
    UtilService.prototype.isDateRangeBeginOrEndSame = /**
     * @param {?} dateRange
     * @param {?} date
     * @return {?}
     */
    function (dateRange, date) {
        /** @type {?} */
        var dateMs = this.getTimeInMilliseconds(date);
        return this.getTimeInMilliseconds(dateRange.begin) === dateMs || this.getTimeInMilliseconds(dateRange.end) === dateMs;
    };
    /**
     * @param {?} date
     * @param {?} dateRange
     * @return {?}
     */
    UtilService.prototype.isDateInRange = /**
     * @param {?} date
     * @param {?} dateRange
     * @return {?}
     */
    function (date, dateRange) {
        if (!this.isInitializedDate(dateRange.begin) || !this.isInitializedDate(dateRange.end)) {
            return false;
        }
        return this.isDateSameOrEarlier(dateRange.begin, date) && this.isDateSameOrEarlier(date, dateRange.end);
    };
    /**
     * @return {?}
     */
    UtilService.prototype.resetDate = /**
     * @return {?}
     */
    function () {
        return { year: 0, month: 0, day: 0 };
    };
    /**
     * @param {?} date
     * @return {?}
     */
    UtilService.prototype.getTimeInMilliseconds = /**
     * @param {?} date
     * @return {?}
     */
    function (date) {
        return this.myDateToJsDate(date).getTime();
    };
    /**
     * @return {?}
     */
    UtilService.prototype.getToday = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var date = new Date();
        return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
    };
    /**
     * @param {?} date
     * @return {?}
     */
    UtilService.prototype.getDayNumber = /**
     * @param {?} date
     * @return {?}
     */
    function (date) {
        return new Date(date.year, date.month - 1, date.day, 0, 0, 0, 0).getDay();
    };
    /**
     * @param {?} wd
     * @return {?}
     */
    UtilService.prototype.getWeekdayIndex = /**
     * @param {?} wd
     * @return {?}
     */
    function (wd) {
        return this.weekDays.indexOf(wd);
    };
    /**
     * @param {?} date
     * @return {?}
     */
    UtilService.prototype.getEpocTime = /**
     * @param {?} date
     * @return {?}
     */
    function (date) {
        return Math.round(this.getTimeInMilliseconds(date) / 1000.0);
    };
    /**
     * @param {?} date
     * @return {?}
     */
    UtilService.prototype.jsDateToMyDate = /**
     * @param {?} date
     * @return {?}
     */
    function (date) {
        return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
    };
    /**
     * @param {?} date
     * @return {?}
     */
    UtilService.prototype.myDateToJsDate = /**
     * @param {?} date
     * @return {?}
     */
    function (date) {
        var year = date.year, month = date.month, day = date.day;
        return new Date(year, month - 1, day, 0, 0, 0, 0);
    };
    /**
     * @param {?} m
     * @param {?} y
     * @return {?}
     */
    UtilService.prototype.datesInMonth = /**
     * @param {?} m
     * @param {?} y
     * @return {?}
     */
    function (m, y) {
        return new Date(y, m, 0).getDate();
    };
    /**
     * @param {?} m
     * @param {?} y
     * @return {?}
     */
    UtilService.prototype.datesInPrevMonth = /**
     * @param {?} m
     * @param {?} y
     * @return {?}
     */
    function (m, y) {
        /** @type {?} */
        var d = this.getJsDate(y, m, 1);
        d.setMonth(d.getMonth() - 1);
        return this.datesInMonth(d.getMonth() + 1, d.getFullYear());
    };
    /**
     * @param {?} year
     * @param {?} month
     * @param {?} day
     * @return {?}
     */
    UtilService.prototype.getJsDate = /**
     * @param {?} year
     * @param {?} month
     * @param {?} day
     * @return {?}
     */
    function (year, month, day) {
        return new Date(year, month - 1, day, 0, 0, 0, 0);
    };
    /**
     * @param {?} selectedValue
     * @param {?} dateRange
     * @return {?}
     */
    UtilService.prototype.getSelectedValue = /**
     * @param {?} selectedValue
     * @param {?} dateRange
     * @return {?}
     */
    function (selectedValue, dateRange) {
        if (!selectedValue) {
            return null;
        }
        if (!dateRange) {
            return selectedValue.date;
        }
        else {
            var beginDate = selectedValue.beginDate, endDate = selectedValue.endDate;
            return { begin: beginDate, end: endDate };
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    UtilService.prototype.getKeyCodeFromEvent = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        /** @type {?} */
        var key = event.key || event.keyCode || event.which;
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
    };
    /**
     * @param {?} key
     * @param {?} keyName
     * @return {?}
     */
    UtilService.prototype.checkKeyName = /**
     * @param {?} key
     * @param {?} keyName
     * @return {?}
     */
    function (key, keyName) {
        /** @type {?} */
        var arr = keyName.split(PIPE);
        return arr.indexOf(key) !== -1;
    };
    UtilService.decorators = [
        { type: Injectable }
    ];
    return UtilService;
}());
export { UtilService };
if (false) {
    /** @type {?} */
    UtilService.prototype.weekDays;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1teWRhdGVwaWNrZXIudXRpbC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci10cmFkZWRhdGVwaWNrZXIvIiwic291cmNlcyI6WyJsaWIvc2VydmljZXMvYW5ndWxhci1teWRhdGVwaWNrZXIudXRpbC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQWF6QyxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDL0MsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQy9DLE9BQU8sRUFBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUl0SDtJQUFBO1FBRUUsYUFBUSxHQUFrQixDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBdWxCekQsQ0FBQzs7Ozs7OztJQXJsQkMsaUNBQVc7Ozs7OztJQUFYLFVBQVksT0FBZSxFQUFFLE9BQW1CLEVBQUUsWUFBZ0M7O1FBQ3pFLElBQUEsK0JBQVUsRUFBRSx5QkFBTyxFQUFFLHlCQUFPLEVBQUUsaUNBQVc7O1lBRTFDLFVBQVUsR0FBWSxJQUFJLENBQUMsU0FBUyxFQUFFOztZQUN0QyxZQUFZLEdBQWtCLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFB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Q0FBQzs7Ozs7O0lBRUQsa0NBQVk7Ozs7O0lBQVosVUFBYSxHQUFXLEVBQUUsT0FBZTs7WUFDakMsR0FBRyxHQUFrQixPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztRQUM5QyxPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDakMsQ0FBQzs7Z0JBeGxCRixVQUFVOztJQXlsQlgsa0JBQUM7Q0FBQSxBQXpsQkQsSUF5bEJDO1NBeGxCWSxXQUFXOzs7SUFDdEIsK0JBQXVEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHtJTXlEYXRlTW9kZWx9IGZyb20gXCIuLi9pbnRlcmZhY2VzL215LWRhdGUtbW9kZWwuaW50ZXJmYWNlXCI7XG5pbXBvcnQge0lNeVNpbmdsZURhdGVNb2RlbH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvbXktc2luZ2xlLWRhdGUtbW9kZWwuaW50ZXJmYWNlXCI7XG5pbXBvcnQge0lNeURhdGVSYW5nZU1vZGVsfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9teS1kYXRlLXJhbmdlLW1vZGVsLmludGVyZmFjZVwiO1xuaW1wb3J0IHtJTXlEYXRlfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9teS1kYXRlLmludGVyZmFjZVwiO1xuaW1wb3J0IHtJTXlEYXRlUmFuZ2V9IGZyb20gXCIuLi9pbnRlcmZhY2VzL215LWRhdGUtcmFuZ2UuaW50ZXJmYWNlXCI7XG5pbXBvcnQge0lNeU1vbnRofSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9teS1tb250aC5pbnRlcmZhY2VcIjtcbmltcG9ydCB7SU15TW9udGhMYWJlbHN9IGZyb20gXCIuLi9pbnRlcmZhY2VzL215LW1vbnRoLWxhYmVscy5pbnRlcmZhY2VcIjtcbmltcG9ydCB7SU15TWFya2VkRGF0ZX0gZnJvbSBcIi4uL2ludGVyZmFjZXMvbXktbWFya2VkLWRhdGUuaW50ZXJmYWNlXCI7XG5pbXBvcnQge0lNeURpc2FibGVkRGF0ZX0gZnJvbSBcIi4uL2ludGVyZmFjZXMvbXktZGlzYWJsZWQtZGF0ZS5pbnRlcmZhY2VcIjtcbmltcG9ydCB7SU15RGF0ZUZvcm1hdH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvbXktZGF0ZS1mb3JtYXQuaW50ZXJmYWNlXCI7XG5pbXBvcnQge0lNeVZhbGlkYXRlT3B0aW9uc30gZnJvbSBcIi4uL2ludGVyZmFjZXMvbXktdmFsaWRhdGUtb3B0aW9ucy5pbnRlcmZhY2VcIjtcbmltcG9ydCB7SU15T3B0aW9uc30gZnJvbSBcIi4uL2ludGVyZmFjZXMvbXktb3B0aW9ucy5pbnRlcmZhY2VcIjtcbmltcG9ydCB7S2V5Q29kZX0gZnJvbSBcIi4uL2VudW1zL2tleS1jb2RlLmVudW1cIjtcbmltcG9ydCB7S2V5TmFtZX0gZnJvbSBcIi4uL2VudW1zL2tleS1uYW1lLmVudW1cIjtcbmltcG9ydCB7RCwgREQsIE0sIE1NLCBNTU0sIFlZWVksIFNVLCBNTywgVFUsIFdFLCBUSCwgRlIsIFNBLCBaRVJPX1NUUiwgRU1QVFlfU1RSLCBQSVBFfSBmcm9tIFwiLi4vY29uc3RhbnRzL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgSU15TGFiZWxlZERhdGVzIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9teS1sYWJlbGVkLWRhdGVzLmludGVyZmFjZSc7XG5pbXBvcnQgeyBJTXlMYWJlbGVkRGF0ZSB9IGZyb20gJy4uL2ludGVyZmFjZXMvbXktbGFiZWxlZC1kYXRlLmludGVyZmFjZSc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBVdGlsU2VydmljZSB7XG4gIHdlZWtEYXlzOiBBcnJheTxzdHJpbmc+ID0gW1NVLCBNTywgVFUsIFdFLCBUSCwgRlIsIFNBXTtcblxuICBpc0RhdGVWYWxpZChkYXRlU3RyOiBzdHJpbmcsIG9wdGlvbnM6IElNeU9wdGlvbnMsIHZhbGlkYXRlT3B0czogSU15VmFsaWRhdGVPcHRpb25zKTogSU15RGF0ZSB7XG4gICAgY29uc3Qge2RhdGVGb3JtYXQsIG1pblllYXIsIG1heFllYXIsIG1vbnRoTGFiZWxzfSA9IG9wdGlvbnM7XG5cbiAgICBjb25zdCByZXR1cm5EYXRlOiBJTXlEYXRlID0gdGhpcy5yZXNldERhdGUoKTtcbiAgICBjb25zdCBkYXRlc0luTW9udGg6IEFycmF5PG51bWJlcj4gPSBbMzEsIDI4LCAzMSwgMzAsIDMxLCAzMCwgMzEsIDMxLCAzMCwgMzEsIDMwLCAzMV07XG4gICAgY29uc3QgaXNNb250aFN0cjogYm9vbGVhbiA9IGRhdGVGb3JtYXQuaW5kZXhPZihNTU0pICE9PSAtMTtcbiAgICBjb25zdCBkZWxpbWV0ZXJzOiBBcnJheTxzdHJpbmc+ID0gZGF0ZUZvcm1hdC5tYXRjaCgvW14oZG15KV17MSx9L2cpO1xuXG4gICAgaWYgKCFkYXRlU3RyIHx8IGRhdGVTdHIgPT09IEVNUFRZX1NUUikge1xuICAgICAgcmV0dXJuIHJldHVybkRhdGU7XG4gICAgfVxuXG4gICAgY29uc3QgZGF0ZVZhbHVlczogQXJyYXk8SU15RGF0ZUZvcm1hdD4gPSB0aGlzLmdldERhdGVWYWx1ZShkYXRlU3RyLCBkYXRlRm9ybWF0LCBkZWxpbWV0ZXJzKTtcblxuICAgIGxldCB5ZWFyOiBudW1iZXIgPSAwO1xuICAgIGxldCBtb250aDogbnVtYmVyID0gMDtcbiAgICBsZXQgZGF5OiBudW1iZXIgPSAwO1xuXG4gICAgZm9yKGNvbnN0IGR2IG9mIGRhdGVWYWx1ZXMpIHtcbiAgICAgIGNvbnN0IHtmb3JtYXR9ID0gZHY7XG4gICAgICBpZiAoZm9ybWF0LmluZGV4T2YoWVlZWSkgIT09IC0xKSB7XG4gICAgICAgIHllYXIgPSB0aGlzLmdldE51bWJlckJ5VmFsdWUoZHYpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoZm9ybWF0LmluZGV4T2YoTSkgIT09IC0xKSB7XG4gICAgICAgIG1vbnRoID0gaXNNb250aFN0ciA/IHRoaXMuZ2V0TW9udGhOdW1iZXJCeU1vbnRoTmFtZShkdiwgbW9udGhMYWJlbHMpIDogdGhpcy5nZXROdW1iZXJCeVZhbHVlKGR2KTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKGZvcm1hdC5pbmRleE9mKEQpICE9PSAtMSkge1xuICAgICAgICBkYXkgPSB0aGlzLmdldE51bWJlckJ5VmFsdWUoZHYpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHt2YWxpZGF0ZURpc2FibGVkRGF0ZXMsIHNlbGVjdGVkVmFsdWV9ID0gdmFsaWRhdGVPcHRzO1xuXG4gICAgeWVhciA9IHllYXIgPT09IDAgJiYgc2VsZWN0ZWRWYWx1ZSA/IHNlbGVjdGVkVmFsdWUueWVhciA6IHllYXI7XG4gICAgbW9udGggPSBtb250aCA9PT0gMCAmJiBzZWxlY3RlZFZhbHVlID8gc2VsZWN0ZWRWYWx1ZS5tb250aCA6IG1vbnRoO1xuICAgIGRheSA9IGRheSA9PT0gMCAmJiBzZWxlY3RlZFZhbHVlID8gc2VsZWN0ZWRWYWx1ZS5kYXkgOiBkYXk7XG5cbiAgICBjb25zdCB0b2RheTogSU15RGF0ZSA9IHRoaXMuZ2V0VG9kYXkoKTtcbiAgICBpZiAoeWVhciA9PT0gMCAmJiAobW9udGggIT09IDAgfHwgZGF5ICE9PSAwKSkge1xuICAgICAgeWVhciA9IHRvZGF5LnllYXI7XG4gICAgfVxuXG4gICAgaWYgKG1vbnRoID09PSAwICYmICh5ZWFyICE9PSAwIHx8IGRheSAhPT0gMCkpIHtcbiAgICAgIG1vbnRoID0gdG9kYXkubW9udGg7XG4gICAgfVxuXG4gICAgaWYgKGRheSA9PT0gMCAmJiAoeWVhciAhPT0gMCB8fCBtb250aCAhPT0gMCkpIHtcbiAgICAgIGRheSA9IHRvZGF5LmRheTtcbiAgICB9XG5cbiAgICBpZiAobW9udGggIT09IC0xICYmIGRheSAhPT0gLTEgJiYgeWVhciAhPT0gLTEpIHtcbiAgICAgIGlmICh5ZWFyIDwgbWluWWVhciB8fCB5ZWFyID4gbWF4WWVhciB8fCBtb250aCA8IDEgfHwgbW9udGggPiAxMikge1xuICAgICAgICByZXR1cm4gcmV0dXJuRGF0ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZGF0ZTogSU15RGF0ZSA9IHt5ZWFyLCBtb250aCwgZGF5fTtcblxuICAgICAgaWYgKHZhbGlkYXRlRGlzYWJsZWREYXRlcyAmJiB0aGlzLmlzRGlzYWJsZWREYXRlKGRhdGUsIG9wdGlvbnMpLmRpc2FibGVkKSB7XG4gICAgICAgIHJldHVybiByZXR1cm5EYXRlO1xuICAgICAgfVxuXG4gICAgICBpZiAoeWVhciAlIDQwMCA9PT0gMCB8fCAoeWVhciAlIDEwMCAhPT0gMCAmJiB5ZWFyICUgNCA9PT0gMCkpIHtcbiAgICAgICAgZGF0ZXNJbk1vbnRoWzFdID0gMjk7XG4gICAgICB9XG5cbiAgICAgIGlmIChkYXkgPCAxIHx8IGRheSA+IGRhdGVzSW5Nb250aFttb250aCAtIDFdKSB7XG4gICAgICAgIHJldHVybiByZXR1cm5EYXRlO1xuICAgICAgfVxuXG4gICAgICAvLyBWYWxpZCBkYXRlXG4gICAgICByZXR1cm4gZGF0ZTtcbiAgICB9XG4gICAgcmV0dXJuIHJldHVybkRhdGU7XG4gIH1cblxuICBpc0RhdGVWYWxpZERhdGVSYW5nZShkYXRlUmFuZ2VTdHI6IHN0cmluZywgb3B0aW9uczogSU15T3B0aW9ucywgdmFsaWRhdGVPcHRzOiBJTXlWYWxpZGF0ZU9wdGlvbnMpOiBJTXlEYXRlUmFuZ2Uge1xuICAgIGxldCBkYXRlUmFuZ2U6IElNeURhdGVSYW5nZSA9IHtiZWdpbjogdGhpcy5yZXNldERhdGUoKSwgZW5kOiB0aGlzLnJlc2V0RGF0ZSgpfTtcbiAgICBpZiAoZGF0ZVJhbmdlU3RyICYmIGRhdGVSYW5nZVN0ci5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGRhdGVzOiBBcnJheTxzdHJpbmc+ID0gZGF0ZVJhbmdlU3RyLnNwbGl0KG9wdGlvbnMuZGF0ZVJhbmdlRGF0ZXNEZWxpbWl0ZXIpO1xuICAgICAgaWYgKGRhdGVzICYmIGRhdGVzLmxlbmd0aCA9PT0gMikge1xuICAgICAgICBjb25zdCBbYmVnaW5EYXRlLCBlbmREYXRlXSA9IGRhdGVzO1xuICAgICAgICBsZXQge3NlbGVjdGVkVmFsdWV9ID0gdmFsaWRhdGVPcHRzO1xuXG4gICAgICAgIGlmIChzZWxlY3RlZFZhbHVlKSB7XG4gICAgICAgICAgdmFsaWRhdGVPcHRzLnNlbGVjdGVkVmFsdWUgPSBzZWxlY3RlZFZhbHVlLmJlZ2luO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYmVnaW46IElNeURhdGUgPSB0aGlzLmlzRGF0ZVZhbGlkKGJlZ2luRGF0ZSwgb3B0aW9ucywgdmFsaWRhdGVPcHRzKTtcblxuICAgICAgICBpZiAodGhpcy5pc0luaXRpYWxpemVkRGF0ZShiZWdpbikpIHtcbiAgICAgICAgICBpZiAoc2VsZWN0ZWRWYWx1ZSkge1xuICAgICAgICAgICAgdmFsaWRhdGVPcHRzLnNlbGVjdGVkVmFsdWUgPSBzZWxlY3RlZFZhbHVlLmVuZDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBlbmQ6IElNeURhdGUgPSB0aGlzLmlzRGF0ZVZhbGlkKGVuZERhdGUsIG9wdGlvbnMsIHZhbGlkYXRlT3B0cyk7XG5cbiAgICAgICAgICBpZiAodGhpcy5pc0luaXRpYWxpemVkRGF0ZShlbmQpICYmIHRoaXMuaXNEYXRlU2FtZU9yRWFybGllcihiZWdpbiwgZW5kKSkge1xuICAgICAgICAgICAgZGF0ZVJhbmdlID0ge2JlZ2luLCBlbmR9O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZGF0ZVJhbmdlO1xuICB9XG5cbiAgZ2V0RGF0ZVZhbHVlKGRhdGVTdHI6IHN0cmluZywgZGF0ZUZvcm1hdDogc3RyaW5nLCBkZWxpbWV0ZXJzOiBBcnJheTxzdHJpbmc+KTogQXJyYXk8SU15RGF0ZUZvcm1hdD4ge1xuICAgIGxldCBkZWw6IHN0cmluZyA9IEVNUFRZX1NUUjtcblxuICAgIGlmIChkZWxpbWV0ZXJzKSB7XG4gICAgICBmb3IoY29uc3QgZCBvZiBkZWxpbWV0ZXJzKSB7XG4gICAgICAgIGlmIChkZWwuaW5kZXhPZihkKSA9PT0gLTEpIHtcbiAgICAgICAgICBkZWwgKz0gZDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHJlOiBhbnkgPSBuZXcgUmVnRXhwKFwiW1wiICsgZGVsICsgXCJdXCIpO1xuICAgIGNvbnN0IGRzOiBBcnJheTxzdHJpbmc+ID0gZGF0ZVN0ci5zcGxpdChyZSk7XG4gICAgY29uc3QgZGY6IEFycmF5PHN0cmluZz4gPSBkYXRlRm9ybWF0LnNwbGl0KHJlKTtcbiAgICBjb25zdCBkYTogQXJyYXk8SU15RGF0ZUZvcm1hdD4gPSBbXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGYubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChkZltpXS5pbmRleE9mKFlZWVkpICE9PSAtMSkge1xuICAgICAgICBkYS5wdXNoKHt2YWx1ZTogZHNbaV0sIGZvcm1hdDogZGZbaV19KTtcbiAgICAgIH1cbiAgICAgIGlmIChkZltpXS5pbmRleE9mKE0pICE9PSAtMSkge1xuICAgICAgICBkYS5wdXNoKHt2YWx1ZTogZHNbaV0sIGZvcm1hdDogZGZbaV19KTtcbiAgICAgIH1cbiAgICAgIGlmIChkZltpXS5pbmRleE9mKEQpICE9PSAtMSkge1xuICAgICAgICBkYS5wdXNoKHt2YWx1ZTogZHNbaV0sIGZvcm1hdDogZGZbaV19KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRhO1xuICB9XG5cbiAgZ2V0TW9udGhOdW1iZXJCeU1vbnRoTmFtZShkZjogSU15RGF0ZUZvcm1hdCwgbW9udGhMYWJlbHM6IElNeU1vbnRoTGFiZWxzKTogbnVtYmVyIHtcbiAgICBpZiAoZGYudmFsdWUpIHtcbiAgICAgIGZvciAobGV0IGtleSA9IDE7IGtleSA8PSAxMjsga2V5KyspIHtcbiAgICAgICAgaWYgKGRmLnZhbHVlLnRvTG93ZXJDYXNlKCkgPT09IG1vbnRoTGFiZWxzW2tleV0udG9Mb3dlckNhc2UoKSkge1xuICAgICAgICAgIHJldHVybiBrZXk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgZ2V0TnVtYmVyQnlWYWx1ZShkZjogSU15RGF0ZUZvcm1hdCk6IG51bWJlciB7XG4gICAgaWYgKCEvXlxcZCskLy50ZXN0KGRmLnZhbHVlKSkge1xuICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIGxldCBuYnI6IG51bWJlciA9IE51bWJlcihkZi52YWx1ZSk7XG4gICAgaWYgKGRmLmZvcm1hdC5sZW5ndGggPT09IDEgJiYgZGYudmFsdWUubGVuZ3RoICE9PSAxICYmIG5iciA8IDEwIHx8IGRmLmZvcm1hdC5sZW5ndGggPT09IDEgJiYgZGYudmFsdWUubGVuZ3RoICE9PSAyICYmIG5iciA+PSAxMCkge1xuICAgICAgbmJyID0gLTE7XG4gICAgfVxuICAgIGVsc2UgaWYgKGRmLmZvcm1hdC5sZW5ndGggPT09IDIgJiYgZGYudmFsdWUubGVuZ3RoID4gMikge1xuICAgICAgbmJyID0gLTE7XG4gICAgfVxuICAgIHJldHVybiBuYnI7XG4gIH1cblxuICBwYXJzZURlZmF1bHRNb250aChtb250aFN0cmluZzogc3RyaW5nKTogSU15TW9udGgge1xuICAgIGNvbnN0IG1vbnRoOiBJTXlNb250aCA9IHttb250aFR4dDogRU1QVFlfU1RSLCBtb250aE5icjogMCwgeWVhcjogMH07XG4gICAgaWYgKG1vbnRoU3RyaW5nICE9PSBFTVBUWV9TVFIpIHtcbiAgICAgIGNvbnN0IHNwbGl0ID0gbW9udGhTdHJpbmcuc3BsaXQobW9udGhTdHJpbmcubWF0Y2goL1teMC05XS8pWzBdKTtcbiAgICAgIG1vbnRoLm1vbnRoTmJyID0gc3BsaXRbMF0ubGVuZ3RoID09PSAyID8gTnVtYmVyKHNwbGl0WzBdKSA6IE51bWJlcihzcGxpdFsxXSk7XG4gICAgICBtb250aC55ZWFyID0gc3BsaXRbMF0ubGVuZ3RoID09PSAyID8gTnVtYmVyKHNwbGl0WzFdKSA6IE51bWJlcihzcGxpdFswXSk7XG4gICAgfVxuICAgIHJldHVybiBtb250aDtcbiAgfVxuXG4gIGlzRGlzYWJsZWREYXRlKGRhdGU6IElNeURhdGUsIG9wdGlvbnM6IElNeU9wdGlvbnMpOiBJTXlEaXNhYmxlZERhdGUge1xuICAgIGNvbnN0IHttaW5ZZWFyLCBtYXhZZWFyLCBkaXNhYmxlVW50aWwsIGRpc2FibGVTaW5jZSwgZGlzYWJsZVdlZWtlbmRzLCBkaXNhYmxlRGF0ZXMsIGRpc2FibGVEYXRlUmFuZ2VzLCBkaXNhYmxlV2Vla2RheXMsIGVuYWJsZURhdGVzfSA9IG9wdGlvbnM7XG5cbiAgICBpZiAodGhpcy5kYXRlTWF0Y2hUb0RhdGVzKGRhdGUsIGVuYWJsZURhdGVzKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0RGlzYWJsZWRWYWx1ZShmYWxzZSwgRU1QVFlfU1RSKTtcbiAgICB9XG5cbiAgICBpZiAoZGF0ZS55ZWFyIDwgbWluWWVhciAmJiBkYXRlLm1vbnRoID09PSAxMiB8fCBkYXRlLnllYXIgPiBtYXhZZWFyICYmIGRhdGUubW9udGggPT09IDEpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldERpc2FibGVkVmFsdWUodHJ1ZSwgRU1QVFlfU1RSKTtcbiAgICB9XG5cbiAgICBjb25zdCBpbnB1dERhdGVzOiBhbnkgPSBkaXNhYmxlRGF0ZXMgYXMgYW55O1xuICAgIGNvbnN0IHJlc3VsdCA9IGlucHV0RGF0ZXMuZmluZCgoZCkgPT4ge1xuICAgICAgcmV0dXJuIGQuZGF0ZXM7XG4gICAgfSk7XG5cbiAgICBpZiAoIXJlc3VsdCkge1xuICAgICAgaWYgKHRoaXMuZGF0ZU1hdGNoVG9EYXRlcyhkYXRlLCBpbnB1dERhdGVzKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXREaXNhYmxlZFZhbHVlKHRydWUsIEVNUFRZX1NUUik7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgZm9yIChjb25zdCBkZCBvZiBpbnB1dERhdGVzKSB7XG4gICAgICAgIGlmICh0aGlzLmRhdGVNYXRjaFRvRGF0ZXMoZGF0ZSwgZGQuZGF0ZXMpKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RGlzYWJsZWRWYWx1ZSh0cnVlLCBkZC5zdHlsZUNsYXNzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLmlzRGlzYWJsZWRCeURpc2FibGVVbnRpbChkYXRlLCBkaXNhYmxlVW50aWwpKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXREaXNhYmxlZFZhbHVlKHRydWUsIEVNUFRZX1NUUik7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaXNEaXNhYmxlZEJ5RGlzYWJsZVNpbmNlKGRhdGUsIGRpc2FibGVTaW5jZSkpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldERpc2FibGVkVmFsdWUodHJ1ZSwgRU1QVFlfU1RSKTtcbiAgICB9XG5cbiAgICBpZiAoZGlzYWJsZVdlZWtlbmRzKSB7XG4gICAgICBjb25zdCBkYXlOYnIgPSB0aGlzLmdldERheU51bWJlcihkYXRlKTtcbiAgICAgIGlmIChkYXlOYnIgPT09IDAgfHwgZGF5TmJyID09PSA2KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldERpc2FibGVkVmFsdWUodHJ1ZSwgRU1QVFlfU1RSKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBkbiA9IHRoaXMuZ2V0RGF5TnVtYmVyKGRhdGUpO1xuICAgIGlmIChkaXNhYmxlV2Vla2RheXMubGVuZ3RoID4gMCkge1xuICAgICAgZm9yIChjb25zdCB3ZCBvZiBkaXNhYmxlV2Vla2RheXMpIHtcbiAgICAgICAgaWYgKGRuID09PSB0aGlzLmdldFdlZWtkYXlJbmRleCh3ZCkpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5nZXREaXNhYmxlZFZhbHVlKHRydWUsIEVNUFRZX1NUUik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5pc0Rpc2FibGVkQnlEaXNhYmxlRGF0ZVJhbmdlKGRhdGUsIGRhdGUsIGRpc2FibGVEYXRlUmFuZ2VzKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0RGlzYWJsZWRWYWx1ZSh0cnVlLCBFTVBUWV9TVFIpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmdldERpc2FibGVkVmFsdWUoZmFsc2UsIEVNUFRZX1NUUik7XG4gIH1cblxuICBnZXREaXNhYmxlZFZhbHVlKGRpc2FibGVkOiBib29sZWFuLCBzdHlsZUNsYXNzOiBzdHJpbmcpOiBJTXlEaXNhYmxlZERhdGUge1xuICAgIHJldHVybiB7ZGlzYWJsZWQsIHN0eWxlQ2xhc3N9O1xuICB9XG5cbiAgZGF0ZU1hdGNoVG9EYXRlcyhkYXRlOiBJTXlEYXRlLCBkYXRlczogQXJyYXk8SU15RGF0ZT4pOiBib29sZWFuIHtcbiAgICBmb3IgKGNvbnN0IGQgb2YgZGF0ZXMpIHtcbiAgICAgIGlmICgoZC55ZWFyID09PSAwIHx8IGQueWVhciA9PT0gZGF0ZS55ZWFyKSAmJiAoZC5tb250aCA9PT0gMCB8fCBkLm1vbnRoID09PSBkYXRlLm1vbnRoKSAmJiBkLmRheSA9PT0gZGF0ZS5kYXkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlzRGlzYWJsZWRNb250aCh5ZWFyOiBudW1iZXIsIG1vbnRoOiBudW1iZXIsIG9wdGlvbnM6IElNeU9wdGlvbnMpOiBib29sZWFuIHtcbiAgICBjb25zdCB7ZGlzYWJsZVVudGlsLCBkaXNhYmxlU2luY2UsIGRpc2FibGVEYXRlUmFuZ2VzLCBlbmFibGVEYXRlc30gPSBvcHRpb25zO1xuXG4gICAgY29uc3QgZGF0ZUVuZDogSU15RGF0ZSA9IHt5ZWFyLCBtb250aCwgZGF5OiB0aGlzLmRhdGVzSW5Nb250aChtb250aCwgeWVhcil9O1xuICAgIGNvbnN0IGRhdGVCZWdpbjogSU15RGF0ZSA9IHt5ZWFyLCBtb250aCwgZGF5OiAxfTtcblxuICAgIGlmICh0aGlzLmlzRGF0ZXNFbmFibGVkKGRhdGVCZWdpbiwgZGF0ZUVuZCwgZW5hYmxlRGF0ZXMpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaXNEaXNhYmxlZEJ5RGlzYWJsZVVudGlsKGRhdGVFbmQsIGRpc2FibGVVbnRpbCkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmlzRGlzYWJsZWRCeURpc2FibGVTaW5jZShkYXRlQmVnaW4sIGRpc2FibGVTaW5jZSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmlzRGlzYWJsZWRCeURpc2FibGVEYXRlUmFuZ2UoZGF0ZUJlZ2luLCBkYXRlRW5kLCBkaXNhYmxlRGF0ZVJhbmdlcykpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlzRGlzYWJsZWRZZWFyKHllYXI6IG51bWJlciwgb3B0aW9uczogSU15T3B0aW9ucyk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHtkaXNhYmxlVW50aWwsIGRpc2FibGVTaW5jZSwgZGlzYWJsZURhdGVSYW5nZXMsIGVuYWJsZURhdGVzLCBtaW5ZZWFyLCBtYXhZZWFyfSA9IG9wdGlvbnM7XG5cbiAgICBjb25zdCBkYXRlRW5kOiBJTXlEYXRlID0ge3llYXIsIG1vbnRoOiAxMiwgZGF5OiAzMX07XG4gICAgY29uc3QgZGF0ZUJlZ2luOiBJTXlEYXRlID0ge3llYXIsIG1vbnRoOiAxLCBkYXk6IDF9O1xuXG4gICAgaWYgKHRoaXMuaXNEYXRlc0VuYWJsZWQoZGF0ZUJlZ2luLCBkYXRlRW5kLCBlbmFibGVEYXRlcykpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5pc0Rpc2FibGVkQnlEaXNhYmxlVW50aWwoZGF0ZUVuZCwgZGlzYWJsZVVudGlsKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaXNEaXNhYmxlZEJ5RGlzYWJsZVNpbmNlKGRhdGVCZWdpbiwgZGlzYWJsZVNpbmNlKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaXNEaXNhYmxlZEJ5RGlzYWJsZURhdGVSYW5nZShkYXRlQmVnaW4sIGRhdGVFbmQsIGRpc2FibGVEYXRlUmFuZ2VzKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKHllYXIgPCBtaW5ZZWFyIHx8IHllYXIgPiBtYXhZZWFyKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpc0Rpc2FibGVkQnlEaXNhYmxlVW50aWwoZGF0ZTogSU15RGF0ZSwgZGlzYWJsZVVudGlsOiBJTXlEYXRlKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuaXNJbml0aWFsaXplZERhdGUoZGlzYWJsZVVudGlsKSAmJiB0aGlzLmdldFRpbWVJbk1pbGxpc2Vjb25kcyhkYXRlKSA8PSB0aGlzLmdldFRpbWVJbk1pbGxpc2Vjb25kcyhkaXNhYmxlVW50aWwpO1xuICB9XG5cbiAgaXNEaXNhYmxlZEJ5RGlzYWJsZVNpbmNlKGRhdGU6IElNeURhdGUsIGRpc2FibGVTaW5jZTogSU15RGF0ZSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmlzSW5pdGlhbGl6ZWREYXRlKGRpc2FibGVTaW5jZSkgJiYgdGhpcy5nZXRUaW1lSW5NaWxsaXNlY29uZHMoZGF0ZSkgPj0gdGhpcy5nZXRUaW1lSW5NaWxsaXNlY29uZHMoZGlzYWJsZVNpbmNlKTtcbiAgfVxuXG4gIGlzUGFzdERhdGVzRW5hYmxlZChkYXRlOiBJTXlEYXRlLCBlbmFibGVEYXRlczogQXJyYXk8SU15RGF0ZT4pOiBib29sZWFuIHtcbiAgICBmb3IoY29uc3QgZCBvZiBlbmFibGVEYXRlcykge1xuICAgICAgaWYgKHRoaXMuZ2V0VGltZUluTWlsbGlzZWNvbmRzKGQpIDw9IHRoaXMuZ2V0VGltZUluTWlsbGlzZWNvbmRzKGRhdGUpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpc0Z1dHVyZURhdGVzRW5hYmxlZChkYXRlOiBJTXlEYXRlLCBlbmFibGVEYXRlczogQXJyYXk8SU15RGF0ZT4pOiBib29sZWFuIHtcbiAgICBmb3IoY29uc3QgZCBvZiBlbmFibGVEYXRlcykge1xuICAgICAgaWYgKHRoaXMuZ2V0VGltZUluTWlsbGlzZWNvbmRzKGQpID49IHRoaXMuZ2V0VGltZUluTWlsbGlzZWNvbmRzKGRhdGUpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpc0RhdGVzRW5hYmxlZChkYXRlQmVnaW46IElNeURhdGUsIGRhdGVFbmQ6IElNeURhdGUsIGVuYWJsZURhdGVzOiBBcnJheTxJTXlEYXRlPik6IGJvb2xlYW4ge1xuICAgIGZvcihjb25zdCBkIG9mIGVuYWJsZURhdGVzKSB7XG4gICAgICBpZiAodGhpcy5nZXRUaW1lSW5NaWxsaXNlY29uZHMoZCkgPj0gdGhpcy5nZXRUaW1lSW5NaWxsaXNlY29uZHMoZGF0ZUJlZ2luKVxuICAgICAgICAmJiB0aGlzLmdldFRpbWVJbk1pbGxpc2Vjb25kcyhkKSA8PSB0aGlzLmdldFRpbWVJbk1pbGxpc2Vjb25kcyhkYXRlRW5kKSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlzRGlzYWJsZWRCeURpc2FibGVEYXRlUmFuZ2UoZGF0ZUJlZ2luOiBJTXlEYXRlLCBkYXRlRW5kOiBJTXlEYXRlLCBkaXNhYmxlRGF0ZVJhbmdlczogQXJyYXk8SU15RGF0ZVJhbmdlPik6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGRhdGVNc0JlZ2luOiBudW1iZXIgPSB0aGlzLmdldFRpbWVJbk1pbGxpc2Vjb25kcyhkYXRlQmVnaW4pO1xuICAgIGNvbnN0IGRhdGVNc0VuZDogbnVtYmVyID0gdGhpcy5nZXRUaW1lSW5NaWxsaXNlY29uZHMoZGF0ZUVuZCk7XG5cbiAgICBmb3IgKGNvbnN0IGQgb2YgZGlzYWJsZURhdGVSYW5nZXMpIHtcbiAgICAgIGlmICh0aGlzLmlzSW5pdGlhbGl6ZWREYXRlKGQuYmVnaW4pICYmIHRoaXMuaXNJbml0aWFsaXplZERhdGUoZC5lbmQpXG4gICAgICAgICYmIGRhdGVNc0JlZ2luID49IHRoaXMuZ2V0VGltZUluTWlsbGlzZWNvbmRzKGQuYmVnaW4pICYmIGRhdGVNc0VuZCA8PSB0aGlzLmdldFRpbWVJbk1pbGxpc2Vjb25kcyhkLmVuZCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlzTGFiZWxlZERhdGUoZGF0ZTogSU15RGF0ZSwgbGFiZWxlZERhdGVzOiBBcnJheTxJTXlMYWJlbGVkRGF0ZXM+KTogSU15TGFiZWxlZERhdGUge1xuICAgIGZvciAobGV0IG1kIG9mIGxhYmVsZWREYXRlcykge1xuICAgICAgZm9yIChsZXQgZCBvZiBtZC5kYXRlcykge1xuICAgICAgICBpZiAoZC5kYXRlLnllYXIgPT09IGRhdGUueWVhciAmJiBkLmRhdGUubW9udGggPT09IGRhdGUubW9udGggJiYgZC5kYXRlLmRheSA9PT0gZGF0ZS5kYXkpIHtcbiAgICAgICAgICByZXR1cm4ge21hcmtlZDogdHJ1ZSwgbGFiZWw6IGQubGFiZWwsIHN0eWxlOiBkLnN0eWxlLCB0aXRsZTogZC50aXRsZX07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgLyppZiAobWFya1dlZWtlbmRzICYmIG1hcmtXZWVrZW5kcy5tYXJrZWQpIHtcbiAgICAgICAgbGV0IGRheU5iciA9IHRoaXMuZ2V0RGF5TnVtYmVyKGRhdGUpO1xuICAgICAgICBpZiAoZGF5TmJyID09PSAwIHx8IGRheU5iciA9PT0gNikge1xuICAgICAgICAgICAgcmV0dXJuIHttYXJrZWQ6IHRydWUsIGxhYmVsOiBtZC5sYWJlbCwgY29sb3I6IG1hcmtXZWVrZW5kcy5jb2xvcn07XG4gICAgICAgIH1cbiAgICB9Ki9cbiAgICByZXR1cm4ge21hcmtlZDogZmFsc2UsIHN0eWxlOiBcIlwiLCBsYWJlbDogJycsIHRpdGxlOiAnJ307XG4gIH1cblxuXG4gIGlzTWFya2VkRGF0ZShkYXRlOiBJTXlEYXRlLCBvcHRpb25zOiBJTXlPcHRpb25zKTogSU15TWFya2VkRGF0ZSB7XG4gICAgY29uc3Qge21hcmtEYXRlcywgbWFya1dlZWtlbmRzfSA9IG9wdGlvbnM7XG5cbiAgICBmb3IgKGNvbnN0IG1kIG9mIG1hcmtEYXRlcykge1xuICAgICAgaWYgKHRoaXMuZGF0ZU1hdGNoVG9EYXRlcyhkYXRlLCBtZC5kYXRlcykpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0TWFya2VkVmFsdWUodHJ1ZSwgbWQuY29sb3IsIG1kLnN0eWxlQ2xhc3MpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAobWFya1dlZWtlbmRzICYmIG1hcmtXZWVrZW5kcy5tYXJrZWQpIHtcbiAgICAgIGNvbnN0IGRheU5iciA9IHRoaXMuZ2V0RGF5TnVtYmVyKGRhdGUpO1xuICAgICAgaWYgKGRheU5iciA9PT0gMCB8fCBkYXlOYnIgPT09IDYpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0TWFya2VkVmFsdWUodHJ1ZSwgbWFya1dlZWtlbmRzLmNvbG9yLCBFTVBUWV9TVFIpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5nZXRNYXJrZWRWYWx1ZShmYWxzZSwgRU1QVFlfU1RSLCBFTVBUWV9TVFIpO1xuICB9XG5cbiAgZ2V0TWFya2VkVmFsdWUobWFya2VkOiBib29sZWFuLCBjb2xvcjogc3RyaW5nLCBzdHlsZUNsYXNzOiBzdHJpbmcpOiBJTXlNYXJrZWREYXRlIHtcbiAgICByZXR1cm4ge21hcmtlZCwgY29sb3I6IGNvbG9yID8gY29sb3IgOiBFTVBUWV9TVFIsIHN0eWxlQ2xhc3M6IHN0eWxlQ2xhc3MgPyBzdHlsZUNsYXNzIDogRU1QVFlfU1RSfTtcbiAgfVxuXG4gIGlzSGlnaGxpZ2h0ZWREYXRlKGRhdGU6IElNeURhdGUsIG9wdGlvbnM6IElNeU9wdGlvbnMpOiBib29sZWFuIHtcbiAgICBjb25zdCB7c3VuSGlnaGxpZ2h0LCBzYXRIaWdobGlnaHQsIGhpZ2hsaWdodERhdGVzfSA9IG9wdGlvbnM7XG5cbiAgICBjb25zdCBkYXlOYnI6IG51bWJlciA9IHRoaXMuZ2V0RGF5TnVtYmVyKGRhdGUpO1xuICAgIGlmIChzdW5IaWdobGlnaHQgJiYgZGF5TmJyID09PSAwIHx8IHNhdEhpZ2hsaWdodCAmJiBkYXlOYnIgPT09IDYpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmRhdGVNYXRjaFRvRGF0ZXMoZGF0ZSwgaGlnaGxpZ2h0RGF0ZXMpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBnZXRXZWVrTnVtYmVyKGRhdGU6IElNeURhdGUpOiBudW1iZXIge1xuICAgIGNvbnN0IGQ6IERhdGUgPSBuZXcgRGF0ZShkYXRlLnllYXIsIGRhdGUubW9udGggLSAxLCBkYXRlLmRheSwgMCwgMCwgMCwgMCk7XG4gICAgZC5zZXREYXRlKGQuZ2V0RGF0ZSgpICsgKGQuZ2V0RGF5KCkgPT09IDAgPyAtMyA6IDQgLSBkLmdldERheSgpKSk7XG4gICAgcmV0dXJuIE1hdGgucm91bmQoKChkLmdldFRpbWUoKSAtIG5ldyBEYXRlKGQuZ2V0RnVsbFllYXIoKSwgMCwgNCkuZ2V0VGltZSgpKSAvIDg2NDAwMDAwKSAvIDcpICsgMTtcbiAgfVxuXG4gIGdldERhdGVNb2RlbChkYXRlOiBJTXlEYXRlLCBkYXRlUmFuZ2U6IElNeURhdGVSYW5nZSwgZGF0ZUZvcm1hdDogc3RyaW5nLCBtb250aExhYmVsczogSU15TW9udGhMYWJlbHMsIHJhbmdlRGVsaW1pdGVyOiBzdHJpbmcsIGRhdGVTdHI6IHN0cmluZyA9IEVNUFRZX1NUUik6IElNeURhdGVNb2RlbCB7XG4gICAgbGV0IHNpbmdsZURhdGVNb2RlbDogSU15U2luZ2xlRGF0ZU1vZGVsID0gbnVsbDtcbiAgICBsZXQgZGF0ZVJhbmdlTW9kZWw6IElNeURhdGVSYW5nZU1vZGVsID0gbnVsbDtcblxuICAgIGlmIChkYXRlKSB7XG4gICAgICBzaW5nbGVEYXRlTW9kZWwgPSB7XG4gICAgICAgIGRhdGUsXG4gICAgICAgIGpzRGF0ZTogdGhpcy5teURhdGVUb0pzRGF0ZShkYXRlKSxcbiAgICAgICAgZm9ybWF0dGVkOiBkYXRlU3RyLmxlbmd0aCA/IGRhdGVTdHIgOiB0aGlzLmZvcm1hdERhdGUoZGF0ZSwgZGF0ZUZvcm1hdCwgbW9udGhMYWJlbHMpLFxuICAgICAgICBlcG9jOiB0aGlzLmdldEVwb2NUaW1lKGRhdGUpXG4gICAgICB9O1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGRhdGVSYW5nZU1vZGVsID0ge1xuICAgICAgICBiZWdpbkRhdGU6IGRhdGVSYW5nZS5iZWdpbixcbiAgICAgICAgYmVnaW5Kc0RhdGU6IHRoaXMubXlEYXRlVG9Kc0RhdGUoZGF0ZVJhbmdlLmJlZ2luKSxcbiAgICAgICAgYmVnaW5FcG9jOiB0aGlzLmdldEVwb2NUaW1lKGRhdGVSYW5nZS5iZWdpbiksXG4gICAgICAgIGVuZERhdGU6IGRhdGVSYW5nZS5lbmQsXG4gICAgICAgIGVuZEpzRGF0ZTogdGhpcy5teURhdGVUb0pzRGF0ZShkYXRlUmFuZ2UuZW5kKSxcbiAgICAgICAgZW5kRXBvYzogdGhpcy5nZXRFcG9jVGltZShkYXRlUmFuZ2UuZW5kKSxcbiAgICAgICAgZm9ybWF0dGVkOiB0aGlzLmZvcm1hdERhdGUoZGF0ZVJhbmdlLmJlZ2luLCBkYXRlRm9ybWF0LCBtb250aExhYmVscykgKyByYW5nZURlbGltaXRlciArIHRoaXMuZm9ybWF0RGF0ZShkYXRlUmFuZ2UuZW5kLCBkYXRlRm9ybWF0LCBtb250aExhYmVscylcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGlzUmFuZ2U6IGRhdGUgPT09IG51bGwsXG4gICAgICBzaW5nbGVEYXRlOiBzaW5nbGVEYXRlTW9kZWwsXG4gICAgICBkYXRlUmFuZ2U6IGRhdGVSYW5nZU1vZGVsXG4gICAgfTtcbiAgfVxuXG4gIGZvcm1hdERhdGUoZGF0ZTogSU15RGF0ZSwgZGF0ZUZvcm1hdDogc3RyaW5nLCBtb250aExhYmVsczogSU15TW9udGhMYWJlbHMpOiBzdHJpbmcge1xuICAgIGxldCBmb3JtYXR0ZWQ6IHN0cmluZyA9IGRhdGVGb3JtYXQucmVwbGFjZShZWVlZLCBTdHJpbmcoZGF0ZS55ZWFyKSk7XG5cbiAgICBpZiAoZGF0ZUZvcm1hdC5pbmRleE9mKE1NTSkgIT09IC0xKSB7XG4gICAgICBmb3JtYXR0ZWQgPSBmb3JtYXR0ZWQucmVwbGFjZShNTU0sIG1vbnRoTGFiZWxzW2RhdGUubW9udGhdKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoZGF0ZUZvcm1hdC5pbmRleE9mKE1NKSAhPT0gLTEpIHtcbiAgICAgIGZvcm1hdHRlZCA9IGZvcm1hdHRlZC5yZXBsYWNlKE1NLCB0aGlzLnByZVplcm8oZGF0ZS5tb250aCkpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGZvcm1hdHRlZCA9IGZvcm1hdHRlZC5yZXBsYWNlKE0sIFN0cmluZyhkYXRlLm1vbnRoKSk7XG4gICAgfVxuXG4gICAgaWYgKGRhdGVGb3JtYXQuaW5kZXhPZihERCkgIT09IC0xKSB7XG4gICAgICBmb3JtYXR0ZWQgPSBmb3JtYXR0ZWQucmVwbGFjZShERCwgdGhpcy5wcmVaZXJvKGRhdGUuZGF5KSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgZm9ybWF0dGVkID0gZm9ybWF0dGVkLnJlcGxhY2UoRCwgU3RyaW5nKGRhdGUuZGF5KSk7XG4gICAgfVxuICAgIHJldHVybiBmb3JtYXR0ZWQ7XG4gIH1cblxuICBnZXRGb3JtYXR0ZWREYXRlKG1vZGVsOiBJTXlEYXRlTW9kZWwpOiBzdHJpbmcge1xuICAgIHJldHVybiAhbW9kZWwuaXNSYW5nZSA/IG1vZGVsLnNpbmdsZURhdGUuZm9ybWF0dGVkIDogbW9kZWwuZGF0ZVJhbmdlLmZvcm1hdHRlZDtcbiAgfVxuXG4gIHByZVplcm8odmFsOiBudW1iZXIpOiBzdHJpbmcge1xuICAgIHJldHVybiB2YWwgPCAxMCA/IFpFUk9fU1RSICsgdmFsIDogU3RyaW5nKHZhbCk7XG4gIH1cblxuICBpc0luaXRpYWxpemVkRGF0ZShkYXRlOiBJTXlEYXRlKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGRhdGUueWVhciAhPT0gMCAmJiBkYXRlLm1vbnRoICE9PSAwICYmIGRhdGUuZGF5ICE9PSAwO1xuICB9XG5cbiAgaXNEYXRlRWFybGllcihmaXJzdERhdGU6IElNeURhdGUsIHNlY29uZERhdGU6IElNeURhdGUpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5nZXRUaW1lSW5NaWxsaXNlY29uZHMoZmlyc3REYXRlKSA8IHRoaXMuZ2V0VGltZUluTWlsbGlzZWNvbmRzKHNlY29uZERhdGUpO1xuICB9XG5cbiAgaXNEYXRlU2FtZU9yRWFybGllcihmaXJzdERhdGU6IElNeURhdGUsIHNlY29uZERhdGU6IElNeURhdGUpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5nZXRUaW1lSW5NaWxsaXNlY29uZHMoZmlyc3REYXRlKSA8PSB0aGlzLmdldFRpbWVJbk1pbGxpc2Vjb25kcyhzZWNvbmREYXRlKTtcbiAgfVxuXG4gIGlzRGF0ZVNhbWUoZmlyc3REYXRlOiBJTXlEYXRlLCBzZWNvbmREYXRlOiBJTXlEYXRlKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0VGltZUluTWlsbGlzZWNvbmRzKGZpcnN0RGF0ZSkgPT09IHRoaXMuZ2V0VGltZUluTWlsbGlzZWNvbmRzKHNlY29uZERhdGUpO1xuICB9XG5cbiAgaXNEYXRlUmFuZ2VCZWdpbk9yRW5kU2FtZShkYXRlUmFuZ2U6IElNeURhdGVSYW5nZSwgZGF0ZTogSU15RGF0ZSk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGRhdGVNczogbnVtYmVyID0gdGhpcy5nZXRUaW1lSW5NaWxsaXNlY29uZHMoZGF0ZSk7XG4gICAgcmV0dXJuIHRoaXMuZ2V0VGltZUluTWlsbGlzZWNvbmRzKGRhdGVSYW5nZS5iZWdpbikgPT09IGRhdGVNcyB8fCB0aGlzLmdldFRpbWVJbk1pbGxpc2Vjb25kcyhkYXRlUmFuZ2UuZW5kKSA9PT0gZGF0ZU1zO1xuICB9XG5cbiAgaXNEYXRlSW5SYW5nZShkYXRlOiBJTXlEYXRlLCBkYXRlUmFuZ2U6IElNeURhdGVSYW5nZSk6IGJvb2xlYW4ge1xuICAgIGlmICghdGhpcy5pc0luaXRpYWxpemVkRGF0ZShkYXRlUmFuZ2UuYmVnaW4pIHx8ICF0aGlzLmlzSW5pdGlhbGl6ZWREYXRlKGRhdGVSYW5nZS5lbmQpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmlzRGF0ZVNhbWVPckVhcmxpZXIoZGF0ZVJhbmdlLmJlZ2luLCBkYXRlKSAmJiB0aGlzLmlzRGF0ZVNhbWVPckVhcmxpZXIoZGF0ZSwgZGF0ZVJhbmdlLmVuZCk7XG4gIH1cblxuICByZXNldERhdGUoKTogSU15RGF0ZSB7XG4gICAgcmV0dXJuIHt5ZWFyOiAwLCBtb250aDogMCwgZGF5OiAwfTtcbiAgfVxuXG4gIGdldFRpbWVJbk1pbGxpc2Vjb25kcyhkYXRlOiBJTXlEYXRlKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5teURhdGVUb0pzRGF0ZShkYXRlKS5nZXRUaW1lKCk7XG4gIH1cblxuICBnZXRUb2RheSgpOiBJTXlEYXRlIHtcbiAgICBjb25zdCBkYXRlOiBEYXRlID0gbmV3IERhdGUoKTtcbiAgICByZXR1cm4ge3llYXI6IGRhdGUuZ2V0RnVsbFllYXIoKSwgbW9udGg6IGRhdGUuZ2V0TW9udGgoKSArIDEsIGRheTogZGF0ZS5nZXREYXRlKCl9O1xuICB9XG5cbiAgZ2V0RGF5TnVtYmVyKGRhdGU6IElNeURhdGUpOiBudW1iZXIge1xuICAgIHJldHVybiBuZXcgRGF0ZShkYXRlLnllYXIsIGRhdGUubW9udGggLSAxLCBkYXRlLmRheSwgMCwgMCwgMCwgMCkuZ2V0RGF5KCk7XG4gIH1cblxuICBnZXRXZWVrZGF5SW5kZXgod2Q6IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzLndlZWtEYXlzLmluZGV4T2Yod2QpO1xuICB9XG5cbiAgZ2V0RXBvY1RpbWUoZGF0ZTogSU15RGF0ZSk6IG51bWJlciB7XG4gICAgcmV0dXJuIE1hdGgucm91bmQodGhpcy5nZXRUaW1lSW5NaWxsaXNlY29uZHMoZGF0ZSkgLyAxMDAwLjApO1xuICB9XG5cbiAganNEYXRlVG9NeURhdGUoZGF0ZTogRGF0ZSk6IElNeURhdGUge1xuICAgIHJldHVybiB7eWVhcjogZGF0ZS5nZXRGdWxsWWVhcigpLCBtb250aDogZGF0ZS5nZXRNb250aCgpICsgMSwgZGF5OiBkYXRlLmdldERhdGUoKX07XG4gIH1cblxuICBteURhdGVUb0pzRGF0ZShkYXRlOiBJTXlEYXRlKTogRGF0ZSB7XG4gICAgY29uc3Qge3llYXIsIG1vbnRoLCBkYXl9ID0gZGF0ZTtcbiAgICByZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGggLSAxLCBkYXksIDAsIDAsIDAsIDApO1xuICB9XG5cbiAgZGF0ZXNJbk1vbnRoKG06IG51bWJlciwgeTogbnVtYmVyKTogbnVtYmVyIHtcbiAgICByZXR1cm4gbmV3IERhdGUoeSwgbSwgMCkuZ2V0RGF0ZSgpO1xuICB9XG5cbiAgZGF0ZXNJblByZXZNb250aChtOiBudW1iZXIsIHk6IG51bWJlcik6IG51bWJlciB7XG4gICAgY29uc3QgZDogRGF0ZSA9IHRoaXMuZ2V0SnNEYXRlKHksIG0sIDEpO1xuICAgIGQuc2V0TW9udGgoZC5nZXRNb250aCgpIC0gMSk7XG4gICAgcmV0dXJuIHRoaXMuZGF0ZXNJbk1vbnRoKGQuZ2V0TW9udGgoKSArIDEsIGQuZ2V0RnVsbFllYXIoKSk7XG4gIH1cblxuICBnZXRKc0RhdGUoeWVhcjogbnVtYmVyLCBtb250aDogbnVtYmVyLCBkYXk6IG51bWJlcik6IERhdGUge1xuICAgIHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCAtIDEsIGRheSwgMCwgMCwgMCwgMCk7XG4gIH1cblxuICBnZXRTZWxlY3RlZFZhbHVlKHNlbGVjdGVkVmFsdWU6IGFueSwgZGF0ZVJhbmdlOiBib29sZWFuKTogYW55IHtcbiAgICBpZiAoIXNlbGVjdGVkVmFsdWUpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGlmICghZGF0ZVJhbmdlKSB7XG4gICAgICByZXR1cm4gc2VsZWN0ZWRWYWx1ZS5kYXRlO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGNvbnN0IHtiZWdpbkRhdGUsIGVuZERhdGV9ID0gc2VsZWN0ZWRWYWx1ZTtcbiAgICAgIHJldHVybiB7YmVnaW46IGJlZ2luRGF0ZSwgZW5kOiBlbmREYXRlfTtcbiAgICB9XG4gIH1cblxuICBnZXRLZXlDb2RlRnJvbUV2ZW50KGV2ZW50OiBhbnkpOiBudW1iZXIge1xuICAgIGxldCBrZXk6IGFueSA9IGV2ZW50LmtleSB8fCBldmVudC5rZXlDb2RlIHx8IGV2ZW50LndoaWNoO1xuXG4gICAgaWYgKHRoaXMuY2hlY2tLZXlOYW1lKGtleSwgS2V5TmFtZS5lbnRlcikgfHwga2V5ID09PSBLZXlDb2RlLmVudGVyKSB7XG4gICAgICByZXR1cm4gS2V5Q29kZS5lbnRlcjtcbiAgICB9XG4gICAgZWxzZSBpZiAodGhpcy5jaGVja0tleU5hbWUoa2V5LCBLZXlOYW1lLmVzYykgfHwga2V5ID09PSBLZXlDb2RlLmVzYykge1xuICAgICAgcmV0dXJuIEtleUNvZGUuZXNjO1xuICAgIH1cbiAgICBlbHNlIGlmICh0aGlzLmNoZWNrS2V5TmFtZShrZXksIEtleU5hbWUuc3BhY2UpIHx8IGtleSA9PT0gS2V5Q29kZS5zcGFjZSkge1xuICAgICAgcmV0dXJuIEtleUNvZGUuc3BhY2U7XG4gICAgfVxuICAgIGVsc2UgaWYgKHRoaXMuY2hlY2tLZXlOYW1lKGtleSwgS2V5TmFtZS5sZWZ0QXJyb3cpIHx8IGtleSA9PT0gS2V5Q29kZS5sZWZ0QXJyb3cpIHtcbiAgICAgIHJldHVybiBLZXlDb2RlLmxlZnRBcnJvdztcbiAgICB9XG4gICAgZWxzZSBpZiAodGhpcy5jaGVja0tleU5hbWUoa2V5LCBLZXlOYW1lLnVwQXJyb3cpIHx8IGtleSA9PT0gS2V5Q29kZS51cEFycm93KSB7XG4gICAgICByZXR1cm4gS2V5Q29kZS51cEFycm93O1xuICAgIH1cbiAgICBlbHNlIGlmICh0aGlzLmNoZWNrS2V5TmFtZShrZXksIEtleU5hbWUucmlnaHRBcnJvdykgfHwga2V5ID09PSBLZXlDb2RlLnJpZ2h0QXJyb3cpIHtcbiAgICAgIHJldHVybiBLZXlDb2RlLnJpZ2h0QXJyb3c7XG4gICAgfVxuICAgIGVsc2UgaWYgKHRoaXMuY2hlY2tLZXlOYW1lKGtleSwgS2V5TmFtZS5kb3duQXJyb3cpfHwga2V5ID09PSBLZXlDb2RlLmRvd25BcnJvdykge1xuICAgICAgcmV0dXJuIEtleUNvZGUuZG93bkFycm93O1xuICAgIH1cbiAgICBlbHNlIGlmICh0aGlzLmNoZWNrS2V5TmFtZShrZXksIEtleU5hbWUudGFiKSB8fCBrZXkgPT09IEtleUNvZGUudGFiKSB7XG4gICAgICByZXR1cm4gS2V5Q29kZS50YWI7XG4gICAgfVxuICAgIGVsc2UgaWYgKHRoaXMuY2hlY2tLZXlOYW1lKGtleSwgS2V5TmFtZS5zaGlmdCkgfHwga2V5ID09PSBLZXlDb2RlLnNoaWZ0KSB7XG4gICAgICByZXR1cm4gS2V5Q29kZS5zaGlmdDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICBjaGVja0tleU5hbWUoa2V5OiBzdHJpbmcsIGtleU5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGFycjogQXJyYXk8c3RyaW5nPiA9IGtleU5hbWUuc3BsaXQoUElQRSk7XG4gICAgcmV0dXJuIGFyci5pbmRleE9mKGtleSkgIT09IC0xO1xuICB9XG59XG4iXX0=