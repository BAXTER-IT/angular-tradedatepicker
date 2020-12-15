/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, ElementRef, ViewEncapsulation, ViewChild, Renderer2, ChangeDetectorRef, HostBinding } from "@angular/core";
import { UtilService } from "../../services/angular-mydatepicker.util.service";
import { KeyCode } from "../../enums/key-code.enum";
import { MonthId } from "../../enums/month-id.enum";
import { DefaultView } from "../../enums/default-view.enum";
import { CalAnimation } from "../../enums/cal-animation.enum";
import { HeaderAction } from "../../enums/header-action.enum";
import { DOT, UNDER_LINE, D, M, Y, DATE_ROW_COUNT, DATE_COL_COUNT, MONTH_ROW_COUNT, MONTH_COL_COUNT, YEAR_ROW_COUNT, YEAR_COL_COUNT, SU, MO, TU, WE, TH, FR, SA, EMPTY_STR, CLICK, STYLE, MY_DP_ANIMATION, ANIMATION_NAMES, IN, OUT, TABINDEX, TD_SELECTOR, ZERO_STR, YEAR_SEPARATOR } from "../../constants/constants";
export class CalendarComponent {
    /**
     * @param {?} elem
     * @param {?} renderer
     * @param {?} cdr
     * @param {?} utilService
     */
    constructor(elem, renderer, cdr, utilService) {
        this.elem = elem;
        this.renderer = renderer;
        this.cdr = cdr;
        this.utilService = utilService;
        this.position = "static";
        this.visibleMonth = { monthTxt: EMPTY_STR, monthNbr: 0, year: 0 };
        this.selectedMonth = { monthNbr: 0, year: 0 };
        this.selectedDate = { year: 0, month: 0, day: 0 };
        this.selectedDateRange = { begin: { year: 0, month: 0, day: 0 }, end: { year: 0, month: 0, day: 0 } };
        this.weekDays = [];
        this.dates = [];
        this.months = [];
        this.years = [];
        this.yearsDuration = "";
        this.dayIdx = 0;
        this.weekDayOpts = [SU, MO, TU, WE, TH, FR, SA];
        this.selectMonth = false;
        this.selectYear = false;
        this.viewChanged = false;
        this.selectorPos = null;
        this.prevViewDisabled = false;
        this.nextViewDisabled = false;
        this.clickListener = renderer.listen(elem.nativeElement, CLICK, (/**
         * @param {?} event
         * @return {?}
         */
        (event) => {
            if ((this.opts.monthSelector || this.opts.yearSelector) && event.target) {
                this.resetMonthYearSelect();
            }
        }));
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        const { stylesData, calendarAnimation, inline } = this.opts;
        if (stylesData.styles.length) {
            /** @type {?} */
            const styleElTemp = this.renderer.createElement(STYLE);
            this.renderer.appendChild(styleElTemp, this.renderer.createText(stylesData.styles));
            this.renderer.appendChild(this.styleEl.nativeElement, styleElTemp);
        }
        if (calendarAnimation.in !== CalAnimation.None) {
            this.setCalendarAnimation(calendarAnimation, true);
        }
        if (!inline) {
            this.focusToSelector();
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.clickListener();
    }
    /**
     * @param {?} opts
     * @param {?} defaultMonth
     * @param {?} selectedValue
     * @param {?} inputValue
     * @param {?} selectorPos
     * @param {?} dc
     * @param {?} cvc
     * @param {?} rds
     * @param {?} va
     * @param {?} cbe
     * @return {?}
     */
    initializeComponent(opts, defaultMonth, selectedValue, inputValue, selectorPos, dc, cvc, rds, va, cbe) {
        this.opts = opts;
        this.selectorPos = selectorPos;
        this.dateChanged = dc;
        this.calendarViewChanged = cvc;
        this.rangeDateSelection = rds;
        this.viewActivated = va;
        this.closedByEsc = cbe;
        const { defaultView, firstDayOfWeek, dayLabels } = opts;
        this.weekDays.length = 0;
        this.dayIdx = this.weekDayOpts.indexOf(firstDayOfWeek);
        if (this.dayIdx !== -1) {
            /** @type {?} */
            let idx = this.dayIdx;
            for (let i = 0; i < this.weekDayOpts.length; i++) {
                this.weekDays.push(dayLabels[this.weekDayOpts[idx]]);
                idx = this.weekDayOpts[idx] === SA ? 0 : idx + 1;
            }
        }
        this.initializeView(defaultMonth, selectedValue, inputValue);
        this.setCalendarVisibleMonth();
        this.setDefaultView(defaultView);
    }
    /**
     * @param {?} defaultMonth
     * @param {?} selectedValue
     * @param {?} inputValue
     * @return {?}
     */
    initializeView(defaultMonth, selectedValue, inputValue) {
        const { dateRange } = this.opts;
        // use today as a selected month
        /** @type {?} */
        const today = this.utilService.getToday();
        this.selectedMonth = { monthNbr: today.month, year: today.year };
        // If default month attribute valur given use it as a selected month
        const { defMonth, overrideSelection } = defaultMonth;
        if (defMonth && defMonth.length) {
            this.selectedMonth = this.utilService.parseDefaultMonth(defMonth);
        }
        /** @type {?} */
        let validateOpts = null;
        if (!dateRange) {
            // Single date mode - If date selected use it as selected month
            validateOpts = { validateDisabledDates: false, selectedValue: this.utilService.getSelectedValue(selectedValue, dateRange) };
            /** @type {?} */
            const date = this.utilService.isDateValid(inputValue, this.opts, validateOpts);
            if (this.utilService.isInitializedDate(date)) {
                this.selectedDate = date;
                if (!overrideSelection) {
                    this.selectedMonth = { monthNbr: date.month, year: date.year };
                }
            }
        }
        else {
            // Date range mode - If date range selected use begin date as selected month
            validateOpts = { validateDisabledDates: false, selectedValue: this.utilService.getSelectedValue(selectedValue, dateRange) };
            const { begin, end } = this.utilService.isDateValidDateRange(inputValue, this.opts, validateOpts);
            if (this.utilService.isInitializedDate(begin) && this.utilService.isInitializedDate(end)) {
                this.selectedDateRange = { begin, end };
                if (!overrideSelection) {
                    this.selectedMonth = { monthNbr: begin.month, year: begin.year };
                }
            }
        }
    }
    /**
     * @param {?} opts
     * @param {?} defaultMonth
     * @param {?} selectedValue
     * @param {?} inputValue
     * @return {?}
     */
    refreshComponent(opts, defaultMonth, selectedValue, inputValue) {
        this.opts = opts;
        const { defaultView } = opts;
        this.initializeView(defaultMonth, selectedValue, inputValue);
        this.setCalendarVisibleMonth();
        this.setDefaultView(defaultView);
    }
    /**
     * @param {?} headerAction
     * @return {?}
     */
    headerAction(headerAction) {
        const { monthSelector, yearSelector } = this.opts;
        if (headerAction === HeaderAction.PrevBtnClick) {
            if (!this.prevViewDisabled) {
                this.onPrevNavigateBtnClicked();
            }
        }
        else if (headerAction === HeaderAction.NextBtnClick) {
            if (!this.nextViewDisabled) {
                this.onNextNavigateBtnClicked();
            }
        }
        else if (headerAction === HeaderAction.MonthBtnClick) {
            if (monthSelector) {
                this.onMonthViewBtnClicked();
            }
        }
        else if (headerAction === HeaderAction.YearBtnClick) {
            if (yearSelector) {
                this.onYearViewBtnClicked();
            }
        }
    }
    /**
     * @param {?} defaultView
     * @return {?}
     */
    setDefaultView(defaultView) {
        if (defaultView === DefaultView.Month) {
            this.monthViewBtnClicked();
        }
        else if (defaultView === DefaultView.Year) {
            this.yearViewBtnClicked();
        }
    }
    /**
     * @param {?} calAnimation
     * @param {?} isOpen
     * @return {?}
     */
    setCalendarAnimation(calAnimation, isOpen) {
        const { nativeElement } = this.selectorEl;
        const { renderer } = this;
        /** @type {?} */
        const classIn = MY_DP_ANIMATION + ANIMATION_NAMES[calAnimation.in - 1];
        if (isOpen) {
            renderer.addClass(nativeElement, classIn + IN);
        }
        else {
            /** @type {?} */
            const classOut = MY_DP_ANIMATION + ANIMATION_NAMES[calAnimation.out - 1];
            renderer.removeClass(nativeElement, classIn + IN);
            renderer.addClass(nativeElement, classOut + OUT);
        }
    }
    /**
     * @return {?}
     */
    resetDateValue() {
        if (!this.opts.dateRange) {
            this.selectedDate = this.utilService.resetDate();
        }
        else {
            this.selectedDateRange.begin = this.utilService.resetDate();
            this.selectedDateRange.end = this.utilService.resetDate();
        }
    }
    /**
     * @return {?}
     */
    clearDate() {
        const { month, year } = this.utilService.getToday();
        this.selectedMonth = { monthNbr: month, year: year };
        this.resetDateValue();
        this.setCalendarVisibleMonth();
        this.resetMonthYearSelect();
    }
    /**
     * @return {?}
     */
    resetMonthYearSelect() {
        this.selectMonth = false;
        this.selectYear = false;
    }
    /**
     * @return {?}
     */
    onMonthViewBtnClicked() {
        this.viewChanged = true;
        this.monthViewBtnClicked();
    }
    /**
     * @return {?}
     */
    monthViewBtnClicked() {
        this.selectMonth = !this.selectMonth;
        this.selectYear = false;
        this.cdr.detectChanges();
        if (this.selectMonth) {
            this.generateMonths();
        }
        else {
            const { year, monthNbr } = this.selectedMonth;
            this.visibleMonth = { monthTxt: this.opts.monthLabels[monthNbr], monthNbr, year };
            this.generateCalendar(monthNbr, year, true);
        }
    }
    /**
     * @param {?} cell
     * @return {?}
     */
    onMonthCellClicked(cell) {
        this.viewChanged = true;
        const { year, monthNbr } = this.visibleMonth;
        /** @type {?} */
        const monthChange = cell.nbr !== monthNbr;
        this.visibleMonth = { monthTxt: this.opts.monthLabels[cell.nbr], monthNbr: cell.nbr, year };
        this.selectedMonth.year = year;
        this.generateCalendar(cell.nbr, year, monthChange);
        this.selectMonth = false;
        this.focusToSelector();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onMonthCellKeyDown(event) {
        // Move focus by arrow keys
        const { sourceRow, sourceCol } = this.getSourceRowAndColumnFromEvent(event);
        const { moveFocus, targetRow, targetCol, direction } = this.getTargetFocusRowAndColumn(event, sourceRow, sourceCol, MONTH_ROW_COUNT, MONTH_COL_COUNT);
        if (moveFocus) {
            this.focusCellElement(M, targetRow, targetCol, direction, MONTH_COL_COUNT);
        }
    }
    /**
     * @return {?}
     */
    onYearViewBtnClicked() {
        this.viewChanged = true;
        this.yearViewBtnClicked();
    }
    /**
     * @return {?}
     */
    yearViewBtnClicked() {
        this.selectYear = !this.selectYear;
        this.selectMonth = false;
        this.cdr.detectChanges();
        if (this.selectYear) {
            this.generateYears(this.visibleMonth.year);
        }
        else {
            const { year, monthNbr } = this.selectedMonth;
            this.visibleMonth = { monthTxt: this.opts.monthLabels[monthNbr], monthNbr, year };
            this.generateCalendar(monthNbr, year, true);
        }
    }
    /**
     * @param {?} cell
     * @return {?}
     */
    onYearCellClicked(cell) {
        this.viewChanged = true;
        const { year, monthNbr, monthTxt } = this.visibleMonth;
        /** @type {?} */
        const yc = cell.year !== year;
        this.visibleMonth = { monthTxt, monthNbr, year: cell.year };
        this.selectedMonth.year = cell.year;
        this.generateCalendar(monthNbr, cell.year, yc);
        this.selectYear = false;
        this.focusToSelector();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onYearCellKeyDown(event) {
        // Move focus by arrow keys
        const { sourceRow, sourceCol } = this.getSourceRowAndColumnFromEvent(event);
        const { moveFocus, targetRow, targetCol, direction } = this.getTargetFocusRowAndColumn(event, sourceRow, sourceCol, YEAR_ROW_COUNT, YEAR_COL_COUNT);
        if (moveFocus) {
            this.focusCellElement(Y, targetRow, targetCol, direction, YEAR_COL_COUNT);
        }
    }
    /**
     * @return {?}
     */
    generateMonths() {
        /** @type {?} */
        const today = this.utilService.getToday();
        this.months.length = 0;
        const { year, monthNbr } = this.visibleMonth;
        const { rtl, monthLabels } = this.opts;
        /** @type {?} */
        let row = 0;
        for (let i = 1; i <= 12; i += 3) {
            /** @type {?} */
            const rowData = [];
            /** @type {?} */
            let col = rtl ? 2 : 0;
            for (let j = i; j < i + 3; j++) {
                /** @type {?} */
                const disabled = this.utilService.isDisabledMonth(year, j, this.opts);
                rowData.push({
                    nbr: j,
                    name: monthLabels[j],
                    currMonth: j === today.month && year === today.year,
                    selected: j === monthNbr && year === this.selectedMonth.year,
                    disabled,
                    row,
                    col: rtl ? col-- : col++
                });
            }
            row++;
            this.months.push(rowData);
        }
        this.setMonthViewHeaderBtnDisabledState(year);
    }
    /**
     * @param {?} inputYear
     * @return {?}
     */
    generateYears(inputYear) {
        const { minYear, maxYear, rtl } = this.opts;
        /** @type {?} */
        let y = inputYear - 12;
        if (inputYear < minYear) {
            y = minYear;
        }
        if (inputYear + 25 > maxYear) {
            y = maxYear - 24;
        }
        const { year } = this.visibleMonth;
        this.years.length = 0;
        /** @type {?} */
        const today = this.utilService.getToday();
        /** @type {?} */
        let row = 0;
        for (let i = y; i < y + 25; i += 5) {
            /** @type {?} */
            const rowData = [];
            /** @type {?} */
            let col = rtl ? 4 : 0;
            for (let j = i; j < i + 5; j++) {
                /** @type {?} */
                const disabled = this.utilService.isDisabledYear(j, this.opts);
                rowData.push({
                    year: j,
                    currYear: j === today.year,
                    selected: j === year,
                    disabled,
                    row,
                    col: rtl ? col-- : col++
                });
            }
            row++;
            this.years.push(rowData);
        }
        /** @type {?} */
        const beginYear = this.getYearValueByRowAndCol(0, 0);
        /** @type {?} */
        const endYear = beginYear + 24;
        this.yearsDuration = (!rtl ? beginYear : endYear) + YEAR_SEPARATOR + (!rtl ? endYear : beginYear);
        this.setYearViewHeaderBtnDisabledState(beginYear, endYear);
    }
    /**
     * @return {?}
     */
    onTodayFooterClicked() {
        /** @type {?} */
        const date = this.utilService.getToday();
        this.selectDate(date);
    }
    /**
     * @param {?} row
     * @param {?} col
     * @return {?}
     */
    getYearValueByRowAndCol(row, col) {
        const { years } = this;
        if (!years || years.length === 0) {
            const { year } = this.utilService.getToday();
            return year;
        }
        return years[row][col].year;
    }
    /**
     * @return {?}
     */
    setCalendarVisibleMonth() {
        // Sets visible month of calendar
        const { year, monthNbr } = this.selectedMonth;
        this.visibleMonth = { monthTxt: this.opts.monthLabels[monthNbr], monthNbr, year };
        // Create current month
        this.generateCalendar(monthNbr, year, true);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onViewActivated(event) {
        this.viewActivated(event);
    }
    /**
     * @return {?}
     */
    onPrevNavigateBtnClicked() {
        if (!this.selectMonth && !this.selectYear) {
            this.setDateViewMonth(false);
        }
        else if (this.selectMonth) {
            this.visibleMonth.year--;
            this.generateMonths();
        }
        else if (this.selectYear) {
            this.generateYears(this.getYearValueByRowAndCol(2, 2) - 25);
        }
    }
    /**
     * @return {?}
     */
    onNextNavigateBtnClicked() {
        if (!this.selectMonth && !this.selectYear) {
            this.setDateViewMonth(true);
        }
        else if (this.selectMonth) {
            this.visibleMonth.year++;
            this.generateMonths();
        }
        else if (this.selectYear) {
            this.generateYears(this.getYearValueByRowAndCol(2, 2) + 25);
        }
    }
    /**
     * @param {?} isNext
     * @return {?}
     */
    setDateViewMonth(isNext) {
        /** @type {?} */
        let change = isNext ? 1 : -1;
        const { year, monthNbr } = this.visibleMonth;
        /** @type {?} */
        const d = this.utilService.getJsDate(year, monthNbr, 1);
        d.setMonth(d.getMonth() + change);
        /** @type {?} */
        const y = d.getFullYear();
        /** @type {?} */
        const m = d.getMonth() + 1;
        this.visibleMonth = { monthTxt: this.opts.monthLabels[m], monthNbr: m, year: y };
        this.generateCalendar(m, y, true);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onCloseSelector(event) {
        /** @type {?} */
        const keyCode = this.utilService.getKeyCodeFromEvent(event);
        if (keyCode === KeyCode.esc) {
            this.closedByEsc();
        }
    }
    /**
     * @param {?} cell
     * @return {?}
     */
    onDayCellClicked(cell) {
        // Cell clicked on the calendar
        this.selectDate(cell.dateObj);
        this.resetMonthYearSelect();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onDayCellKeyDown(event) {
        // Move focus by arrow keys
        const { sourceRow, sourceCol } = this.getSourceRowAndColumnFromEvent(event);
        const { moveFocus, targetRow, targetCol, direction } = this.getTargetFocusRowAndColumn(event, sourceRow, sourceCol, DATE_ROW_COUNT, DATE_COL_COUNT);
        if (moveFocus) {
            this.focusCellElement(D, targetRow, targetCol, direction, DATE_COL_COUNT);
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    getSourceRowAndColumnFromEvent(event) {
        /** @type {?} */
        let sourceRow = 0;
        /** @type {?} */
        let sourceCol = 0;
        if (event.target && event.target.id) {
            // value of id is for example: m_0_1 (first number = row, second number = column)
            /** @type {?} */
            const arr = event.target.id.split(UNDER_LINE);
            sourceRow = Number(arr[1]);
            sourceCol = Number(arr[2]);
        }
        return { sourceRow, sourceCol };
    }
    /**
     * @param {?} event
     * @param {?} row
     * @param {?} col
     * @param {?} rowCount
     * @param {?} colCount
     * @return {?}
     */
    getTargetFocusRowAndColumn(event, row, col, rowCount, colCount) {
        /** @type {?} */
        let moveFocus = true;
        /** @type {?} */
        let targetRow = row;
        /** @type {?} */
        let targetCol = col;
        /** @type {?} */
        let direction = false;
        /** @type {?} */
        const keyCode = this.utilService.getKeyCodeFromEvent(event);
        if (keyCode === KeyCode.upArrow && row > 0) {
            targetRow--;
        }
        else if (keyCode === KeyCode.downArrow && row < rowCount) {
            targetRow++;
            direction = true;
        }
        else if (keyCode === KeyCode.leftArrow && col > 0) {
            targetCol--;
        }
        else if (keyCode === KeyCode.rightArrow && col < colCount) {
            targetCol++;
            direction = true;
        }
        else {
            moveFocus = false;
        }
        return { moveFocus, targetRow, targetCol, direction };
    }
    /**
     * @param {?} type
     * @param {?} row
     * @param {?} col
     * @param {?} direction
     * @param {?} colCount
     * @return {?}
     */
    focusCellElement(type, row, col, direction, colCount) {
        /** @type {?} */
        const className = type + UNDER_LINE + row + UNDER_LINE + col;
        /** @type {?} */
        let elem = this.selectorEl.nativeElement.querySelector(DOT + className);
        if (elem.getAttribute(TABINDEX) !== ZERO_STR) {
            // if the selected element is disabled move a focus to next/previous enabled element
            /** @type {?} */
            let tdList = this.getCalendarElements();
            /** @type {?} */
            const idx = row * (colCount + 1) + col;
            /** @type {?} */
            let enabledElem = null;
            if (direction) {
                // find next enabled
                enabledElem = tdList.slice(idx).find((/**
                 * @param {?} td
                 * @return {?}
                 */
                (td) => td.getAttribute(TABINDEX) === ZERO_STR));
            }
            else {
                // find previous enabled
                enabledElem = tdList.slice(0, idx).reverse().find((/**
                 * @param {?} td
                 * @return {?}
                 */
                (td) => td.getAttribute(TABINDEX) === ZERO_STR));
            }
            elem = enabledElem ? enabledElem : this.selectorEl.nativeElement;
        }
        else {
            elem.focus();
        }
    }
    /**
     * @return {?}
     */
    focusToSelector() {
        this.selectorEl.nativeElement.focus();
    }
    /**
     * @return {?}
     */
    getCalendarElements() {
        return Array.from(this.selectorEl.nativeElement.querySelectorAll(TD_SELECTOR));
    }
    /**
     * @param {?} date
     * @return {?}
     */
    selectDate(date) {
        const { dateRange, dateFormat, monthLabels, dateRangeDatesDelimiter, closeSelectorOnDateSelect } = this.opts;
        if (dateRange) {
            // Date range
            /** @type {?} */
            const isBeginDateInitialized = this.utilService.isInitializedDate(this.selectedDateRange.begin);
            /** @type {?} */
            const isEndDateInitialized = this.utilService.isInitializedDate(this.selectedDateRange.end);
            if (isBeginDateInitialized && isEndDateInitialized) {
                // both already selected - set begin date and reset end date
                this.selectedDateRange.begin = date;
                this.selectedDateRange.end = this.utilService.resetDate();
                this.rangeDateSelection({
                    isBegin: true,
                    date,
                    jsDate: this.utilService.myDateToJsDate(date),
                    dateFormat: dateFormat,
                    formatted: this.utilService.formatDate(date, dateFormat, monthLabels),
                    epoc: this.utilService.getEpocTime(date)
                });
            }
            else if (!isBeginDateInitialized) {
                // begin date
                this.selectedDateRange.begin = date;
                this.rangeDateSelection({
                    isBegin: true,
                    date,
                    jsDate: this.utilService.myDateToJsDate(date),
                    dateFormat: dateFormat,
                    formatted: this.utilService.formatDate(date, dateFormat, monthLabels),
                    epoc: this.utilService.getEpocTime(date)
                });
            }
            else {
                // second selection
                /** @type {?} */
                const firstDateEarlier = this.utilService.isDateEarlier(date, this.selectedDateRange.begin);
                if (firstDateEarlier) {
                    this.selectedDateRange.begin = date;
                    this.rangeDateSelection({
                        isBegin: true,
                        date,
                        jsDate: this.utilService.myDateToJsDate(date),
                        dateFormat: dateFormat,
                        formatted: this.utilService.formatDate(date, dateFormat, monthLabels),
                        epoc: this.utilService.getEpocTime(date)
                    });
                }
                else {
                    this.selectedDateRange.end = date;
                    this.rangeDateSelection({
                        isBegin: false,
                        date,
                        jsDate: this.utilService.myDateToJsDate(date),
                        dateFormat: dateFormat,
                        formatted: this.utilService.formatDate(date, dateFormat, monthLabels),
                        epoc: this.utilService.getEpocTime(date)
                    });
                    this.dateChanged(this.utilService.getDateModel(null, this.selectedDateRange, dateFormat, monthLabels, dateRangeDatesDelimiter), closeSelectorOnDateSelect);
                }
            }
        }
        else {
            // Single date
            this.selectedDate = date;
            this.dateChanged(this.utilService.getDateModel(this.selectedDate, null, dateFormat, monthLabels, dateRangeDatesDelimiter), closeSelectorOnDateSelect);
        }
    }
    /**
     * @param {?} y
     * @param {?} m
     * @return {?}
     */
    monthStartIdx(y, m) {
        // Month start index
        /** @type {?} */
        const d = new Date();
        d.setDate(1);
        d.setMonth(m - 1);
        d.setFullYear(y);
        /** @type {?} */
        const idx = d.getDay() + this.sundayIdx();
        return idx >= 7 ? idx - 7 : idx;
    }
    /**
     * @param {?} d
     * @param {?} m
     * @param {?} y
     * @param {?} today
     * @return {?}
     */
    isCurrDay(d, m, y, today) {
        // Check is a given date the today
        return d === today.day && m === today.month && y === today.year;
    }
    /**
     * @param {?} date
     * @return {?}
     */
    getDayNumber(date) {
        // Get day number: su=0, mo=1, tu=2, we=3 ...
        const { year, month, day } = date;
        /** @type {?} */
        const d = this.utilService.getJsDate(year, month, day);
        return d.getDay();
    }
    /**
     * @param {?} date
     * @return {?}
     */
    getWeekday(date) {
        // Get weekday: su, mo, tu, we ...
        return this.weekDayOpts[this.getDayNumber(date)];
    }
    /**
     * @return {?}
     */
    sundayIdx() {
        // Index of Sunday day
        return this.dayIdx > 0 ? 7 - this.dayIdx : 0;
    }
    /**
     * @param {?} m
     * @param {?} y
     * @param {?} notifyChange
     * @return {?}
     */
    generateCalendar(m, y, notifyChange) {
        this.dates.length = 0;
        /** @type {?} */
        const today = this.utilService.getToday();
        /** @type {?} */
        const monthStart = this.monthStartIdx(y, m);
        /** @type {?} */
        const dInThisM = this.utilService.datesInMonth(m, y);
        /** @type {?} */
        const dInPrevM = this.utilService.datesInPrevMonth(m, y);
        /** @type {?} */
        let dayNbr = 1;
        /** @type {?} */
        let month = m;
        /** @type {?} */
        let cmo = MonthId.prev;
        const { rtl, showWeekNumbers, firstDayOfWeek } = this.opts;
        for (let i = 1; i < 7; i++) {
            /** @type {?} */
            let col = rtl ? 6 : 0;
            /** @type {?} */
            const week = [];
            if (i === 1) {
                // First week
                /** @type {?} */
                const pm = dInPrevM - monthStart + 1;
                // Previous month
                for (let j = pm; j <= dInPrevM; j++) {
                    /** @type {?} */
                    const date = { year: m === 1 ? y - 1 : y, month: m === 1 ? 12 : m - 1, day: j };
                    week.push({
                        dateObj: date,
                        cmo,
                        currDay: this.isCurrDay(j, month - 1, y, today),
                        disabledDate: this.utilService.isDisabledDate(date, this.opts),
                        markedDate: this.utilService.isMarkedDate(date, this.opts),
                        labeledDate: this.utilService.isLabeledDate(date, this.opts.labelDates),
                        highlight: this.utilService.isHighlightedDate(date, this.opts),
                        row: i - 1,
                        col: rtl ? col-- : col++
                    });
                }
                cmo = MonthId.curr;
                // Current month
                /** @type {?} */
                const daysLeft = 7 - week.length;
                for (let j = 0; j < daysLeft; j++) {
                    /** @type {?} */
                    const date = { year: y, month: m, day: dayNbr };
                    week.push({
                        dateObj: date,
                        cmo,
                        currDay: this.isCurrDay(dayNbr, m, y, today),
                        disabledDate: this.utilService.isDisabledDate(date, this.opts),
                        markedDate: this.utilService.isMarkedDate(date, this.opts),
                        labeledDate: this.utilService.isLabeledDate(date, this.opts.labelDates),
                        highlight: this.utilService.isHighlightedDate(date, this.opts),
                        row: i - 1,
                        col: rtl ? col-- : col++
                    });
                    dayNbr++;
                }
            }
            else {
                // Rest of the weeks
                for (let j = 1; j < 8; j++) {
                    if (dayNbr > dInThisM) {
                        // Next month
                        dayNbr = 1;
                        cmo = MonthId.next;
                        month = m + 1;
                    }
                    /** @type {?} */
                    const date = { year: cmo === MonthId.next && m === 12 ? y + 1 : y, month: cmo === MonthId.curr ? m : cmo === MonthId.next && m < 12 ? m + 1 : 1, day: dayNbr };
                    week.push({
                        dateObj: date,
                        cmo,
                        currDay: this.isCurrDay(dayNbr, month, y, today),
                        disabledDate: this.utilService.isDisabledDate(date, this.opts),
                        markedDate: this.utilService.isMarkedDate(date, this.opts),
                        labeledDate: this.utilService.isLabeledDate(date, this.opts.labelDates),
                        highlight: this.utilService.isHighlightedDate(date, this.opts),
                        row: i - 1,
                        col: rtl ? col-- : col++
                    });
                    dayNbr++;
                }
            }
            /** @type {?} */
            const weekNbr = showWeekNumbers && firstDayOfWeek === MO ? this.utilService.getWeekNumber(week[0].dateObj) : 0;
            this.dates.push({ week, weekNbr });
        }
        this.setDateViewHeaderBtnDisabledState(m, y);
        if (notifyChange) {
            // Notify parent
            this.calendarViewChanged({ year: y, month: m, first: { number: 1, weekday: this.getWeekday({ year: y, month: m, day: 1 }) }, last: { number: dInThisM, weekday: this.getWeekday({ year: y, month: m, day: dInThisM }) } });
        }
    }
    /**
     * @param {?} m
     * @param {?} y
     * @return {?}
     */
    setDateViewHeaderBtnDisabledState(m, y) {
        /** @type {?} */
        let dpm = false;
        /** @type {?} */
        let dnm = false;
        const { disableHeaderButtons, disableUntil, disableSince, enableDates, minYear, maxYear, rtl } = this.opts;
        if (disableHeaderButtons) {
            /** @type {?} */
            const duDate = { year: m === 1 ? y - 1 : y, month: m === 1 ? 12 : m - 1, day: this.utilService.datesInMonth(m === 1 ? 12 : m - 1, m === 1 ? y - 1 : y) };
            /** @type {?} */
            const dsDate = { year: m === 12 ? y + 1 : y, month: m === 12 ? 1 : m + 1, day: 1 };
            dpm = this.utilService.isDisabledByDisableUntil(duDate, disableUntil)
                && !this.utilService.isPastDatesEnabled(duDate, enableDates);
            dnm = this.utilService.isDisabledByDisableSince(dsDate, disableSince)
                && !this.utilService.isFutureDatesEnabled(dsDate, enableDates);
        }
        this.prevViewDisabled = m === 1 && y === minYear || dpm;
        this.nextViewDisabled = m === 12 && y === maxYear || dnm;
        if (rtl) {
            this.swapHeaderBtnDisabled();
        }
    }
    /**
     * @param {?} y
     * @return {?}
     */
    setMonthViewHeaderBtnDisabledState(y) {
        /** @type {?} */
        let dpm = false;
        /** @type {?} */
        let dnm = false;
        const { disableHeaderButtons, disableUntil, disableSince, enableDates, minYear, maxYear, rtl } = this.opts;
        if (disableHeaderButtons) {
            /** @type {?} */
            const duDate = { year: y - 1, month: 12, day: 31 };
            /** @type {?} */
            const dsDate = { year: y + 1, month: 1, day: 1 };
            dpm = this.utilService.isDisabledByDisableUntil(duDate, disableUntil)
                && !this.utilService.isPastDatesEnabled(duDate, enableDates);
            dnm = this.utilService.isDisabledByDisableSince(dsDate, disableSince)
                && !this.utilService.isFutureDatesEnabled(dsDate, enableDates);
        }
        this.prevViewDisabled = y === minYear || dpm;
        this.nextViewDisabled = y === maxYear || dnm;
        if (rtl) {
            this.swapHeaderBtnDisabled();
        }
    }
    /**
     * @param {?} yp
     * @param {?} yn
     * @return {?}
     */
    setYearViewHeaderBtnDisabledState(yp, yn) {
        /** @type {?} */
        let dpy = false;
        /** @type {?} */
        let dny = false;
        const { disableHeaderButtons, disableUntil, disableSince, enableDates, minYear, maxYear, rtl } = this.opts;
        if (disableHeaderButtons) {
            /** @type {?} */
            const duDate = { year: yp - 1, month: 12, day: 31 };
            /** @type {?} */
            const dsDate = { year: yn + 1, month: 1, day: 1 };
            dpy = this.utilService.isDisabledByDisableUntil(duDate, disableUntil)
                && !this.utilService.isPastDatesEnabled(duDate, enableDates);
            dny = this.utilService.isDisabledByDisableSince(dsDate, disableSince)
                && !this.utilService.isFutureDatesEnabled(dsDate, enableDates);
        }
        this.prevViewDisabled = yp <= minYear || dpy;
        this.nextViewDisabled = yn >= maxYear || dny;
        if (rtl) {
            this.swapHeaderBtnDisabled();
        }
    }
    /**
     * @return {?}
     */
    swapHeaderBtnDisabled() {
        [this.prevViewDisabled, this.nextViewDisabled] = [this.nextViewDisabled, this.prevViewDisabled];
    }
}
CalendarComponent.decorators = [
    { type: Component, args: [{
                selector: "lib-angular-mydatepicker-calendar",
                template: "<span #styleEl></span>\n\n<div class=\"ng-mydp {{opts.stylesData?.selector || ''}}\">\n  <div class=\"myDpSelector\" #selectorEl\n    [libAngularMyDatePickerCalendar]=\"{inline: opts.inline, selectorWidth: opts.selectorWidth, selectorHeight: opts.selectorHeight, selectorPos: selectorPos}\"\n    [ngClass]=\"{'myDpSelectorArrow': opts.showSelectorArrow, 'myDpSelectorArrowLeft': opts.showSelectorArrow && !opts.alignSelectorRight,\n      'myDpSelectorArrowRight': opts.showSelectorArrow&&opts.alignSelectorRight, 'myDpSelectorAbsolute': !opts.inline, 'myDpSelectorPosInitial': opts.inline}\"\n    (keyup)=\"onCloseSelector($event)\" tabindex=\"0\">\n\n    <lib-selection-bar [opts]=\"opts\" [yearsDuration]=\"yearsDuration\" [visibleMonth]=\"visibleMonth\" [selectMonth]=\"selectMonth\" [selectYear]=\"selectYear\"\n                    [prevViewDisabled]=\"prevViewDisabled\" [nextViewDisabled]=\"nextViewDisabled\"\n                    (prevNavigateBtnClicked)=\"onPrevNavigateBtnClicked()\" (nextNavigateBtnClicked)=\"onNextNavigateBtnClicked()\"\n                    (monthViewBtnClicked)=\"onMonthViewBtnClicked()\" (yearViewBtnClicked)=\"onYearViewBtnClicked()\"></lib-selection-bar>\n\n    <lib-day-view *ngIf=\"!selectMonth && !selectYear\" [opts]=\"opts\" [dates]=\"dates\" [weekDays]=\"weekDays\"\n                    [selectedDate]=\"selectedDate\" [selectedDateRange]=\"selectedDateRange\" [viewChanged]=\"viewChanged\"\n                    (dayCellClicked)=\"onDayCellClicked($event)\"\n                    (dayCellKeyDown)=\"onDayCellKeyDown($event)\"\n                    (viewActivated)=\"onViewActivated($event)\"></lib-day-view>\n\n    <lib-month-view *ngIf=\"selectMonth\" [opts]=\"opts\" [months]=\"months\" [viewChanged]=\"viewChanged\"\n                    (monthCellClicked)=\"onMonthCellClicked($event)\"\n                    (monthCellKeyDown)=\"onMonthCellKeyDown($event)\"\n                    (viewActivated)=\"onViewActivated($event)\"></lib-month-view>\n\n    <lib-year-view *ngIf=\"selectYear\" [opts]=\"opts\" [years]=\"years\" [viewChanged]=\"viewChanged\"\n                    (yearCellClicked)=\"onYearCellClicked($event)\"\n                    (yearCellKeyDown)=\"onYearCellKeyDown($event)\"\n                    (viewActivated)=\"onViewActivated($event)\"></lib-year-view>\n\n    <lib-footer-bar *ngIf=\"opts.showFooterToday\" [opts]=\"opts\"\n                    (footerBarTxtClicked)=\"onTodayFooterClicked()\"></lib-footer-bar>\n\n\n    <lib-tenors [opts]=\"opts\" (onSelectDate)=\"selectDate($event)\">\n    </lib-tenors>\n\n  </div>\n</div>\n\n\n\n\n\n\n\n\n\n\n",
                providers: [UtilService],
                encapsulation: ViewEncapsulation.None,
                styles: [".ng-mydp{position:static}.ng-myrtl{direction:rtl}.ng-mydp *{box-sizing:border-box;font-family:Arial,Helvetica,sans-serif;padding:0;margin:0}.ng-mydp table{display:table;border-spacing:0}.ng-mydp table td,.ng-mydp table th{padding:0;margin:0;vertical-align:middle;border:none}.myDpSelector{padding:4px;border:1px solid #ccc;background-color:#fff;border-radius:4px;z-index:100000}.myDpViewChangeAnimation{-webkit-animation:.2s linear myDpViewChangeAnimation;animation:.2s linear myDpViewChangeAnimation}@-webkit-keyframes myDpViewChangeAnimation{0%{transform:scale(.75);opacity:.1}100%{transform:scale(1);opacity:1}}@keyframes myDpViewChangeAnimation{0%{transform:scale(.75);opacity:.1}100%{transform:scale(1);opacity:1}}.myDpAnimationFadeIn{-webkit-animation:.5s linear myDpAnimationFadeIn;animation:.5s linear myDpAnimationFadeIn}@-webkit-keyframes myDpAnimationFadeIn{0%{transform:translateY(-50px);opacity:0}100%{transform:translateY(0);opacity:1}}@keyframes myDpAnimationFadeIn{0%{transform:translateY(-50px);opacity:0}100%{transform:translateY(0);opacity:1}}.myDpAnimationFadeOut{-webkit-animation:.3s linear forwards myDpAnimationFadeOut;animation:.3s linear forwards myDpAnimationFadeOut}@-webkit-keyframes myDpAnimationFadeOut{0%{transform:translateY(0);opacity:1}100%{transform:translateY(-50px);opacity:0}}@keyframes myDpAnimationFadeOut{0%{transform:translateY(0);opacity:1}100%{transform:translateY(-50px);opacity:0}}.myDpAnimationScaleTopIn{-webkit-animation:.3s linear myDpAnimationScaleTopIn;animation:.3s linear myDpAnimationScaleTopIn}@-webkit-keyframes myDpAnimationScaleTopIn{0%{transform:scaleY(0);transform-origin:100% 0}100%{transform:scaleY(1);transform-origin:100% 0}}@keyframes myDpAnimationScaleTopIn{0%{transform:scaleY(0);transform-origin:100% 0}100%{transform:scaleY(1);transform-origin:100% 0}}.myDpAnimationScaleTopOut{-webkit-animation:.3s linear forwards myDpAnimationScaleTopOut;animation:.3s linear forwards myDpAnimationScaleTopOut}@-webkit-keyframes myDpAnimationScaleTopOut{0%{transform:scaleY(1);transform-origin:100% 0;opacity:1}100%{transform:scaleY(0);transform-origin:100% 0;opacity:0}}@keyframes myDpAnimationScaleTopOut{0%{transform:scaleY(1);transform-origin:100% 0;opacity:1}100%{transform:scaleY(0);transform-origin:100% 0;opacity:0}}.myDpAnimationScaleCenterIn{-webkit-animation:.3s linear myDpAnimationScaleCenterIn;animation:.3s linear myDpAnimationScaleCenterIn}@-webkit-keyframes myDpAnimationScaleCenterIn{0%{transform:scale(0)}100%{transform:scale(1)}}@keyframes myDpAnimationScaleCenterIn{0%{transform:scale(0)}100%{transform:scale(1)}}.myDpAnimationScaleCenterOut{-webkit-animation:.3s linear forwards myDpAnimationScaleCenterOut;animation:.3s linear forwards myDpAnimationScaleCenterOut}@-webkit-keyframes myDpAnimationScaleCenterOut{0%{transform:scale(1);opacity:1}100%{transform:scale(0);opacity:0}}@keyframes myDpAnimationScaleCenterOut{0%{transform:scale(1);opacity:1}100%{transform:scale(0);opacity:0}}.myDpAnimationRotateIn{-webkit-animation:.3s linear myDpAnimationRotateIn;animation:.3s linear myDpAnimationRotateIn}@-webkit-keyframes myDpAnimationRotateIn{0%{transform:scale(.3) rotate(-45deg);opacity:0}100%{transform:scale(1) rotate(0);opacity:1}}@keyframes myDpAnimationRotateIn{0%{transform:scale(.3) rotate(-45deg);opacity:0}100%{transform:scale(1) rotate(0);opacity:1}}.myDpAnimationRotateOut{-webkit-animation:.3s linear forwards myDpAnimationRotateOut;animation:.3s linear forwards myDpAnimationRotateOut}@-webkit-keyframes myDpAnimationRotateOut{0%{transform:scale(1) rotate(0);opacity:1}100%{transform:scale(.3) rotate(-45deg);opacity:0}}@keyframes myDpAnimationRotateOut{0%{transform:scale(1) rotate(0);opacity:1}100%{transform:scale(.3) rotate(-45deg);opacity:0}}.myDpAnimationFlipDiagonalIn{-webkit-animation:.3s linear myDpAnimationFlipDiagonalIn;animation:.3s linear myDpAnimationFlipDiagonalIn}@-webkit-keyframes myDpAnimationFlipDiagonalIn{0%{transform:rotate3d(1,1,0,-78deg)}100%{transform:rotate3d(1,1,0,0deg)}}@keyframes myDpAnimationFlipDiagonalIn{0%{transform:rotate3d(1,1,0,-78deg)}100%{transform:rotate3d(1,1,0,0deg)}}.myDpAnimationFlipDiagonalOut{-webkit-animation:.3s linear forwards myDpAnimationFlipDiagonalOut;animation:.3s linear forwards myDpAnimationFlipDiagonalOut}@-webkit-keyframes myDpAnimationFlipDiagonalOut{0%{transform:rotate3d(1,1,0,0deg);opacity:1}100%{transform:rotate3d(1,1,0,78deg);opacity:0}}@keyframes myDpAnimationFlipDiagonalOut{0%{transform:rotate3d(1,1,0,0deg);opacity:1}100%{transform:rotate3d(1,1,0,78deg);opacity:0}}.myDpSelectorAbsolute{position:absolute}.myDpSelectorPosInitial{position:initial}.myDpSelector:focus{box-shadow:-1px 1px 6px 0 #add8e6;outline:0}.myDpSelectorArrow{background:#fff}.myDpSelectorArrow:after,.myDpSelectorArrow:before{bottom:100%;border:solid transparent;content:\" \";height:0;width:0;position:absolute}.myDpSelectorArrow:after{border-color:rgba(250,250,250,0);border-bottom-color:#fafafa;border-width:10px;margin-left:-10px}.myDpSelectorArrow:before{border-color:rgba(204,204,204,0);border-bottom-color:#ccc;border-width:11px;margin-left:-11px}.myDpSelectorArrow:focus:before{border-bottom-color:#add8e6}.myDpSelectorArrowLeft:after,.myDpSelectorArrowLeft:before{left:24px}.myDpSelectorArrowRight:after,.myDpSelectorArrowRight:before{left:86%}::-ms-clear{display:none}.myDpCalTable,.myDpFooterBar,.myDpMonthTable,.myDpYearTable{border-radius:0 0 4px 4px}.myDpCalTable.myDpNoFooter tbody tr:nth-child(6) td:first-child,.myDpMonthTable.myDpNoFooter tbody tr:nth-child(4) td:first-child,.myDpYearTable.myDpNoFooter tbody tr:nth-child(5) td:first-child{border-bottom-left-radius:4px}.myDpCalTable.myDpNoFooter tbody tr:nth-child(6) td:last-child,.myDpMonthTable.myDpNoFooter tbody tr:nth-child(4) td:last-child,.myDpYearTable.myDpNoFooter tbody tr:nth-child(5) td:last-child{border-bottom-right-radius:4px}.myDpCalTable,.myDpMonthTable,.myDpYearTable{table-layout:fixed;width:100%;background-color:#fff;font-size:14px}.myDpFooter{height:calc(100% - 60px)}.myDpNoFooter{height:calc(100% - 30px)}.myDpCalTable,.myDpDaycell,.myDpMonthTable,.myDpMonthcell,.myDpWeekDayTitle,.myDpYearTable,.myDpYearcell{border-collapse:collapse;color:#333;line-height:1.1}.myDpDaycell,.myDpMonthcell,.myDpYearcell{padding:4px;text-align:center;outline:0}.myDpDaycell{background-color:#fff;position:relative}.myDpWeekDayTitle{background-color:transparent;color:#333;font-size:13px;font-weight:400;vertical-align:middle;max-width:36px;overflow:hidden;white-space:nowrap;height:23px;text-align:center}.myDpWeekDayTitleWeekNbr{width:20px}.myDpMonthcell{background-color:#fff;overflow:hidden;white-space:nowrap}.myDpYearcell{background-color:#fff;width:20%}.myDpMonthNbr{font-size:10px;display:block}.myDpDaycellWeekNbr{font-size:9px;cursor:default;text-align:center;color:#333}.myDpNextMonth,.myDpPrevMonth{color:#999}.myDpMonthYearSelBar{display:flex;height:30px;background-color:#fff;border-top-left-radius:4px;border-top-right-radius:4px}.myDpPrevBtn{margin-left:10px}.myDpNextBtn{margin-left:auto;margin-right:10px}.myDpMonthYearText{width:100%;line-height:30px;text-align:center}.myDpFooterBar{display:flex;align-items:center;justify-content:center;height:30px;background-color:#fff}.myDpHeaderBtn{background:0 0;padding:0;border:none;line-height:30px;height:28px;margin-top:1px;color:#000;outline:0;cursor:default}.myDpFooterBtn{margin:0 10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.myDpMonthBtn,.myDpYearBtn{font-size:16px}.myDpMonthBtn{margin-right:6px}.myDpHighlight{color:#c30000}.myDpDimDay{opacity:.5}.myDpCurrMonth{background-color:#fff;font-weight:400}.myDpMarkDate{position:absolute;top:2px;left:2px;border-right:8px solid transparent}.myDpMarkCurrDay,.myDpMarkCurrMonth,.myDpMarkCurrYear{border-bottom:2px solid #333}.myDpHeaderLabelBtnNotEdit{cursor:default}.myDpHeaderBtn::-moz-focus-inner,.myDpNextBtn::-moz-focus-inner,.myDpPrevBtn::-moz-focus-inner{border:0}.myDpFooterBtn:focus,.myDpHeaderBtn:focus,.myDpMonthLabel:focus,.myDpYearLabel:focus{color:#66afe9;outline:0}.myDpDaycell:focus,.myDpMonthcell:focus,.myDpYearcell:focus{box-shadow:inset 0 0 0 1px #66afe9}.myDpTableSingleDay:hover,.myDpTableSingleMonth:hover,.myDpTableSingleYear:hover{background-color:#ddd}.myDpDaycell,.myDpMonthLabel,.myDpMonthcell,.myDpYearLabel,.myDpYearcell{cursor:pointer}.myDpFooterBtn:hover,.myDpHeaderBtnEnabled:hover,.myDpMonthLabel:hover,.myDpYearLabel:hover{color:#777}.myDpHeaderBtnEnabled{cursor:pointer}.myDpHeaderBtnDisabled{cursor:not-allowed;opacity:.65}.myDpDisabled{cursor:default;color:#777;background:repeating-linear-gradient(-45deg,#ccc 7px,#ccc 8px,transparent 7px,transparent 14px)}.myDpRangeColor{background-color:#dbeaff}.myDpSelectedDay,.myDpSelectedMonth,.myDpSelectedYear{border:none;background-color:#8ebfff}@font-face{font-family:angular-mydatepicker;src:url(data:application/octet-stream;base64,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) format('woff');font-weight:400;font-style:normal}.myDpIcon{font-family:angular-mydatepicker;font-style:normal;font-weight:400;font-variant:normal;text-transform:none;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;color:#222;font-size:20px}.myDpIconLeftArrow:before{content:\"\\e800\"}.myDpIconRightArrow:before{content:\"\\e801\"}.tbuttons{position:absolute;top:0;margin-left:260px!important;width:202px;height:232px;background-color:#e8f4f8;border:1px solid #add8e6!important;font-size:18px}.smButton{width:60px}.mdButton{width:92px;padding-top:6px;padding-bottom:6px}.lgButton{width:190px;padding-top:12px;padding-bottom:11px}.tbuttons button{margin-bottom:4px}.tbuttons button:hover{cursor:pointer}.buttons-inner{padding:5px 0 0 5px!important}.redbutton{background-color:red}"]
            }] }
];
/** @nocollapse */
CalendarComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: ChangeDetectorRef },
    { type: UtilService }
];
CalendarComponent.propDecorators = {
    selectorEl: [{ type: ViewChild, args: ["selectorEl",] }],
    styleEl: [{ type: ViewChild, args: ["styleEl",] }],
    position: [{ type: HostBinding, args: ["style.position",] }]
};
if (false) {
    /** @type {?} */
    CalendarComponent.prototype.selectorEl;
    /** @type {?} */
    CalendarComponent.prototype.styleEl;
    /** @type {?} */
    CalendarComponent.prototype.position;
    /** @type {?} */
    CalendarComponent.prototype.opts;
    /** @type {?} */
    CalendarComponent.prototype.visibleMonth;
    /** @type {?} */
    CalendarComponent.prototype.selectedMonth;
    /** @type {?} */
    CalendarComponent.prototype.selectedDate;
    /** @type {?} */
    CalendarComponent.prototype.selectedDateRange;
    /** @type {?} */
    CalendarComponent.prototype.weekDays;
    /** @type {?} */
    CalendarComponent.prototype.dates;
    /** @type {?} */
    CalendarComponent.prototype.months;
    /** @type {?} */
    CalendarComponent.prototype.years;
    /** @type {?} */
    CalendarComponent.prototype.yearsDuration;
    /** @type {?} */
    CalendarComponent.prototype.dayIdx;
    /** @type {?} */
    CalendarComponent.prototype.weekDayOpts;
    /** @type {?} */
    CalendarComponent.prototype.selectMonth;
    /** @type {?} */
    CalendarComponent.prototype.selectYear;
    /** @type {?} */
    CalendarComponent.prototype.viewChanged;
    /** @type {?} */
    CalendarComponent.prototype.dateChanged;
    /** @type {?} */
    CalendarComponent.prototype.calendarViewChanged;
    /** @type {?} */
    CalendarComponent.prototype.rangeDateSelection;
    /** @type {?} */
    CalendarComponent.prototype.viewActivated;
    /** @type {?} */
    CalendarComponent.prototype.closedByEsc;
    /** @type {?} */
    CalendarComponent.prototype.selectorPos;
    /** @type {?} */
    CalendarComponent.prototype.prevViewDisabled;
    /** @type {?} */
    CalendarComponent.prototype.nextViewDisabled;
    /** @type {?} */
    CalendarComponent.prototype.clickListener;
    /**
     * @type {?}
     * @private
     */
    CalendarComponent.prototype.elem;
    /**
     * @type {?}
     * @private
     */
    CalendarComponent.prototype.renderer;
    /**
     * @type {?}
     * @private
     */
    CalendarComponent.prototype.cdr;
    /**
     * @type {?}
     * @private
     */
    CalendarComponent.prototype.utilService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci10cmFkZWRhdGVwaWNrZXIvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9jYWxlbmRhci9jYWxlbmRhci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLGlCQUFpQixFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsaUJBQWlCLEVBQTRCLFdBQVcsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQWdCdkosT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGtEQUFrRCxDQUFDO0FBQzdFLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQUNsRCxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sMkJBQTJCLENBQUM7QUFDbEQsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBQzFELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxnQ0FBZ0MsQ0FBQztBQUM1RCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sZ0NBQWdDLENBQUM7QUFFNUQsT0FBTyxFQUFDLEdBQUcsRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxlQUFlLEVBQUUsZUFBZSxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQ2hJLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxlQUFlLEVBQUUsZUFBZSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUUsY0FBYyxFQUFDLE1BQU0sMkJBQTJCLENBQUM7QUFTcEwsTUFBTSxPQUFPLGlCQUFpQjs7Ozs7OztJQXFDNUIs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d0NBQXdEOztJQUN4RCxnREFBMkQ7O0lBQzNELCtDQUF5RDs7SUFDekQsMENBQXdDOztJQUN4Qyx3Q0FBd0I7O0lBRXhCLHdDQUF3Qzs7SUFFeEMsNkNBQWtDOztJQUNsQyw2Q0FBa0M7O0lBRWxDLDBDQUEwQjs7Ozs7SUFFZCxpQ0FBd0I7Ozs7O0lBQUUscUNBQTJCOzs7OztJQUFFLGdDQUE4Qjs7Ozs7SUFBRSx3Q0FBZ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbXBvbmVudCwgRWxlbWVudFJlZiwgVmlld0VuY2Fwc3VsYXRpb24sIFZpZXdDaGlsZCwgUmVuZGVyZXIyLCBDaGFuZ2VEZXRlY3RvclJlZiwgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95LCBIb3N0QmluZGluZ30gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7SU15RGF0ZX0gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvbXktZGF0ZS5pbnRlcmZhY2VcIjtcbmltcG9ydCB7SU15RGF0ZVJhbmdlfSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9teS1kYXRlLXJhbmdlLmludGVyZmFjZVwiO1xuaW1wb3J0IHtJTXlNb250aH0gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvbXktbW9udGguaW50ZXJmYWNlXCI7XG5pbXBvcnQge0lNeUNhbGVuZGFyRGF5fSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9teS1jYWxlbmRhci1kYXkuaW50ZXJmYWNlXCI7XG5pbXBvcnQge0lNeUNhbGVuZGFyTW9udGh9IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL215LWNhbGVuZGFyLW1vbnRoLmludGVyZmFjZVwiO1xuaW1wb3J0IHtJTXlDYWxlbmRhclllYXJ9IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL215LWNhbGVuZGFyLXllYXIuaW50ZXJmYWNlXCI7XG5pbXBvcnQge0lNeVdlZWt9IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL215LXdlZWsuaW50ZXJmYWNlXCI7XG5pbXBvcnQge0lNeU9wdGlvbnN9IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL215LW9wdGlvbnMuaW50ZXJmYWNlXCI7XG5pbXBvcnQge0lNeVNlbGVjdG9yUG9zaXRpb259IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL215LXNlbGVjdG9yLXBvcy5pbnRlcmZhY2VcIjtcbmltcG9ydCB7SU15Q2FsZW5kYXJWaWV3Q2hhbmdlZH0gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvbXktY2FsZW5kYXItdmlldy1jaGFuZ2VkLmludGVyZmFjZVwiO1xuaW1wb3J0IHtJTXlEYXRlTW9kZWx9IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL215LWRhdGUtbW9kZWwuaW50ZXJmYWNlXCI7XG5pbXBvcnQge0lNeVJhbmdlRGF0ZVNlbGVjdGlvbn0gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvbXktcmFuZ2UtZGF0ZS1zZWxlY3Rpb24uaW50ZXJmYWNlXCI7XG5pbXBvcnQge0lNeUNhbGVuZGFyQW5pbWF0aW9ufSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9teS1jYWxlbmRhci1hbmltYXRpb24uaW50ZXJmYWNlXCI7XG5pbXBvcnQge0lNeVZhbGlkYXRlT3B0aW9uc30gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvbXktdmFsaWRhdGUtb3B0aW9ucy5pbnRlcmZhY2VcIjtcbmltcG9ydCB7SU15RGVmYXVsdE1vbnRofSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9teS1kZWZhdWx0LW1vbnRoLmludGVyZmFjZVwiO1xuaW1wb3J0IHtVdGlsU2VydmljZX0gZnJvbSBcIi4uLy4uL3NlcnZpY2VzL2FuZ3VsYXItbXlkYXRlcGlja2VyLnV0aWwuc2VydmljZVwiO1xuaW1wb3J0IHtLZXlDb2RlfSBmcm9tIFwiLi4vLi4vZW51bXMva2V5LWNvZGUuZW51bVwiO1xuaW1wb3J0IHtNb250aElkfSBmcm9tIFwiLi4vLi4vZW51bXMvbW9udGgtaWQuZW51bVwiO1xuaW1wb3J0IHtEZWZhdWx0Vmlld30gZnJvbSBcIi4uLy4uL2VudW1zL2RlZmF1bHQtdmlldy5lbnVtXCI7XG5pbXBvcnQge0NhbEFuaW1hdGlvbn0gZnJvbSBcIi4uLy4uL2VudW1zL2NhbC1hbmltYXRpb24uZW51bVwiO1xuaW1wb3J0IHtIZWFkZXJBY3Rpb259IGZyb20gXCIuLi8uLi9lbnVtcy9oZWFkZXItYWN0aW9uLmVudW1cIjtcbmltcG9ydCB7QWN0aXZlVmlld30gZnJvbSBcIi4uLy4uL2VudW1zL2FjdGl2ZS12aWV3LmVudW1cIjtcbmltcG9ydCB7RE9ULCBVTkRFUl9MSU5FLCBELCBNLCBZLCBEQVRFX1JPV19DT1VOVCwgREFURV9DT0xfQ09VTlQsIE1PTlRIX1JPV19DT1VOVCwgTU9OVEhfQ09MX0NPVU5ULCBZRUFSX1JPV19DT1VOVCwgWUVBUl9DT0xfQ09VTlQsXG4gIFNVLCBNTywgVFUsIFdFLCBUSCwgRlIsIFNBLCBFTVBUWV9TVFIsIENMSUNLLCBTVFlMRSwgTVlfRFBfQU5JTUFUSU9OLCBBTklNQVRJT05fTkFNRVMsIElOLCBPVVQsIFRBQklOREVYLCBURF9TRUxFQ1RPUiwgWkVST19TVFIsIFlFQVJfU0VQQVJBVE9SfSBmcm9tIFwiLi4vLi4vY29uc3RhbnRzL2NvbnN0YW50c1wiO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6IFwibGliLWFuZ3VsYXItbXlkYXRlcGlja2VyLWNhbGVuZGFyXCIsXG4gIHRlbXBsYXRlVXJsOiAnLi9jYWxlbmRhci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuLi8uLi9jc3MvYW5ndWxhci1teWRhdGVwaWNrZXIuc3R5bGUuY3NzJ10sXG4gIHByb3ZpZGVyczogW1V0aWxTZXJ2aWNlXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxufSlcbmV4cG9ydCBjbGFzcyBDYWxlbmRhckNvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG4gIEBWaWV3Q2hpbGQoXCJzZWxlY3RvckVsXCIpIHNlbGVjdG9yRWw6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoXCJzdHlsZUVsXCIpIHN0eWxlRWw6IEVsZW1lbnRSZWY7XG5cbiAgQEhvc3RCaW5kaW5nKFwic3R5bGUucG9zaXRpb25cIikgcG9zaXRpb24gPSBcInN0YXRpY1wiO1xuXG4gIG9wdHM6IElNeU9wdGlvbnM7XG4gIHZpc2libGVNb250aDogSU15TW9udGggPSB7bW9udGhUeHQ6IEVNUFRZX1NUUiwgbW9udGhOYnI6IDAsIHllYXI6IDB9O1xuICBzZWxlY3RlZE1vbnRoOiBJTXlNb250aCA9IHttb250aE5icjogMCwgeWVhcjogMH07XG4gIHNlbGVjdGVkRGF0ZTogSU15RGF0ZSA9IHt5ZWFyOiAwLCBtb250aDogMCwgZGF5OiAwfTtcbiAgc2VsZWN0ZWREYXRlUmFuZ2U6IElNeURhdGVSYW5nZSA9IHtiZWdpbjoge3llYXI6IDAsIG1vbnRoOiAwLCBkYXk6IDB9LCBlbmQ6IHt5ZWFyOiAwLCBtb250aDogMCwgZGF5OiAwfX07XG4gIHdlZWtEYXlzOiBBcnJheTxzdHJpbmc+ID0gW107XG4gIGRhdGVzOiBBcnJheTxJTXlXZWVrPiA9IFtdO1xuICBtb250aHM6IEFycmF5PEFycmF5PElNeUNhbGVuZGFyTW9udGg+PiA9IFtdO1xuICB5ZWFyczogQXJyYXk8QXJyYXk8SU15Q2FsZW5kYXJZZWFyPj4gPSBbXTtcbiAgeWVhcnNEdXJhdGlvbjogc3RyaW5nID0gXCJcIjtcbiAgZGF5SWR4OiBudW1iZXIgPSAwO1xuICB3ZWVrRGF5T3B0czogQXJyYXk8c3RyaW5nPiA9IFtTVSwgTU8sIFRVLCBXRSwgVEgsIEZSLCBTQV07XG5cbiAgc2VsZWN0TW9udGg6IGJvb2xlYW4gPSBmYWxzZTtcbiAgc2VsZWN0WWVhcjogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIHZpZXdDaGFuZ2VkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgZGF0ZUNoYW5nZWQ6IChkbTogSU15RGF0ZU1vZGVsLCBjbG9zZTogYm9vbGVhbikgPT4gdm9pZDtcbiAgY2FsZW5kYXJWaWV3Q2hhbmdlZDogKGN2YzogSU15Q2FsZW5kYXJWaWV3Q2hhbmdlZCkgPT4gdm9pZDtcbiAgcmFuZ2VEYXRlU2VsZWN0aW9uOiAocmRzOiBJTXlSYW5nZURhdGVTZWxlY3Rpb24pID0+IHZvaWQ7XG4gIHZpZXdBY3RpdmF0ZWQ6ICh2YTogQWN0aXZlVmlldykgPT4gdm9pZDtcbiAgY2xvc2VkQnlFc2M6ICgpID0+IHZvaWQ7XG5cbiAgc2VsZWN0b3JQb3M6IElNeVNlbGVjdG9yUG9zaXRpb24gPSBudWxsO1xuXG4gIHByZXZWaWV3RGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgbmV4dFZpZXdEaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIGNsaWNrTGlzdGVuZXI6ICgpID0+IHZvaWQ7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlbGVtOiBFbGVtZW50UmVmLCBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsIHByaXZhdGUgY2RyOiBDaGFuZ2VEZXRlY3RvclJlZiwgcHJpdmF0ZSB1dGlsU2VydmljZTogVXRpbFNlcnZpY2UpIHtcbiAgICB0aGlzLmNsaWNrTGlzdGVuZXIgPSByZW5kZXJlci5saXN0ZW4oZWxlbS5uYXRpdmVFbGVtZW50LCBDTElDSywgKGV2ZW50OiBhbnkpID0+IHtcbiAgICAgIGlmICgodGhpcy5vcHRzLm1vbnRoU2VsZWN0b3IgfHwgdGhpcy5vcHRzLnllYXJTZWxlY3RvcikgJiYgZXZlbnQudGFyZ2V0KSB7XG4gICAgICAgIHRoaXMucmVzZXRNb250aFllYXJTZWxlY3QoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICBjb25zdCB7c3R5bGVzRGF0YSwgY2FsZW5kYXJBbmltYXRpb24sIGlubGluZX0gPSB0aGlzLm9wdHM7XG5cbiAgICBpZiAoc3R5bGVzRGF0YS5zdHlsZXMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBzdHlsZUVsVGVtcDogYW55ID0gdGhpcy5yZW5kZXJlci5jcmVhdGVFbGVtZW50KFNUWUxFKTtcbiAgICAgIHRoaXMucmVuZGVyZXIuYXBwZW5kQ2hpbGQoc3R5bGVFbFRlbXAsIHRoaXMucmVuZGVyZXIuY3JlYXRlVGV4dChzdHlsZXNEYXRhLnN0eWxlcykpO1xuICAgICAgdGhpcy5yZW5kZXJlci5hcHBlbmRDaGlsZCh0aGlzLnN0eWxlRWwubmF0aXZlRWxlbWVudCwgc3R5bGVFbFRlbXApO1xuICAgIH1cblxuICAgIGlmIChjYWxlbmRhckFuaW1hdGlvbi5pbiAhPT0gQ2FsQW5pbWF0aW9uLk5vbmUpIHtcbiAgICAgIHRoaXMuc2V0Q2FsZW5kYXJBbmltYXRpb24oY2FsZW5kYXJBbmltYXRpb24sIHRydWUpO1xuICAgIH1cblxuICAgIGlmICghaW5saW5lKSB7XG4gICAgICB0aGlzLmZvY3VzVG9TZWxlY3RvcigpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuY2xpY2tMaXN0ZW5lcigpO1xuICB9XG5cbiAgaW5pdGlhbGl6ZUNvbXBvbmVudChvcHRzOiBJTXlPcHRpb25zLCBkZWZhdWx0TW9udGg6IElNeURlZmF1bHRNb250aCwgc2VsZWN0ZWRWYWx1ZTogYW55LCBpbnB1dFZhbHVlOiBzdHJpbmcsIHNlbGVjdG9yUG9zOiBJTXlTZWxlY3RvclBvc2l0aW9uLCBkYzogKGRtOiBJTXlEYXRlTW9kZWwsIGNsb3NlOiBib29sZWFuKSA9PiB2b2lkLCBjdmM6IChjdmM6IElNeUNhbGVuZGFyVmlld0NoYW5nZWQpID0+IHZvaWQsIHJkczogKHJkczogSU15UmFuZ2VEYXRlU2VsZWN0aW9uKSA9PiB2b2lkLCB2YTogKHZhOiBBY3RpdmVWaWV3KSA9PiB2b2lkLCBjYmU6ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICB0aGlzLm9wdHMgPSBvcHRzO1xuICAgIHRoaXMuc2VsZWN0b3JQb3MgPSBzZWxlY3RvclBvcztcblxuICAgIHRoaXMuZGF0ZUNoYW5nZWQgPSBkYztcbiAgICB0aGlzLmNhbGVuZGFyVmlld0NoYW5nZWQgPSBjdmM7XG4gICAgdGhpcy5yYW5nZURhdGVTZWxlY3Rpb24gPSByZHM7XG4gICAgdGhpcy52aWV3QWN0aXZhdGVkID0gdmE7XG4gICAgdGhpcy5jbG9zZWRCeUVzYyA9IGNiZTtcblxuICAgIGNvbnN0IHtkZWZhdWx0VmlldywgZmlyc3REYXlPZldlZWssIGRheUxhYmVsc30gPSBvcHRzO1xuXG4gICAgdGhpcy53ZWVrRGF5cy5sZW5ndGggPSAwO1xuICAgIHRoaXMuZGF5SWR4ID0gdGhpcy53ZWVrRGF5T3B0cy5pbmRleE9mKGZpcnN0RGF5T2ZXZWVrKTtcbiAgICBpZiAodGhpcy5kYXlJZHggIT09IC0xKSB7XG4gICAgICBsZXQgaWR4OiBudW1iZXIgPSB0aGlzLmRheUlkeDtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy53ZWVrRGF5T3B0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzLndlZWtEYXlzLnB1c2goZGF5TGFiZWxzW3RoaXMud2Vla0RheU9wdHNbaWR4XV0pO1xuICAgICAgICBpZHggPSB0aGlzLndlZWtEYXlPcHRzW2lkeF0gPT09IFNBID8gMCA6IGlkeCArIDE7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5pbml0aWFsaXplVmlldyhkZWZhdWx0TW9udGgsIHNlbGVjdGVkVmFsdWUsIGlucHV0VmFsdWUpO1xuICAgIHRoaXMuc2V0Q2FsZW5kYXJWaXNpYmxlTW9udGgoKTtcbiAgICB0aGlzLnNldERlZmF1bHRWaWV3KGRlZmF1bHRWaWV3KTtcbiAgfVxuXG4gIGluaXRpYWxpemVWaWV3KGRlZmF1bHRNb250aDogSU15RGVmYXVsdE1vbnRoLCBzZWxlY3RlZFZhbHVlOiBhbnksIGlucHV0VmFsdWU6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IHtkYXRlUmFuZ2V9ID0gdGhpcy5vcHRzO1xuXG4gICAgLy8gdXNlIHRvZGF5IGFzIGEgc2VsZWN0ZWQgbW9udGhcbiAgICBjb25zdCB0b2RheTogSU15RGF0ZSA9IHRoaXMudXRpbFNlcnZpY2UuZ2V0VG9kYXkoKTtcbiAgICB0aGlzLnNlbGVjdGVkTW9udGggPSB7bW9udGhOYnI6IHRvZGF5Lm1vbnRoLCB5ZWFyOiB0b2RheS55ZWFyfTtcblxuICAgIC8vIElmIGRlZmF1bHQgbW9udGggYXR0cmlidXRlIHZhbHVyIGdpdmVuIHVzZSBpdCBhcyBhIHNlbGVjdGVkIG1vbnRoXG4gICAgY29uc3Qge2RlZk1vbnRoLCBvdmVycmlkZVNlbGVjdGlvbn0gPSBkZWZhdWx0TW9udGg7XG4gICAgaWYgKGRlZk1vbnRoICYmIGRlZk1vbnRoLmxlbmd0aCkge1xuICAgICAgdGhpcy5zZWxlY3RlZE1vbnRoID0gdGhpcy51dGlsU2VydmljZS5wYXJzZURlZmF1bHRNb250aChkZWZNb250aCk7XG4gICAgfVxuXG4gICAgbGV0IHZhbGlkYXRlT3B0czogSU15VmFsaWRhdGVPcHRpb25zID0gbnVsbDtcbiAgICBpZiAoIWRhdGVSYW5nZSkge1xuICAgICAgLy8gU2luZ2xlIGRhdGUgbW9kZSAtIElmIGRhdGUgc2VsZWN0ZWQgdXNlIGl0IGFzIHNlbGVjdGVkIG1vbnRoXG4gICAgICB2YWxpZGF0ZU9wdHMgPSB7dmFsaWRhdGVEaXNhYmxlZERhdGVzOiBmYWxzZSwgc2VsZWN0ZWRWYWx1ZTogdGhpcy51dGlsU2VydmljZS5nZXRTZWxlY3RlZFZhbHVlKHNlbGVjdGVkVmFsdWUsIGRhdGVSYW5nZSl9O1xuICAgICAgY29uc3QgZGF0ZTogSU15RGF0ZSA9IHRoaXMudXRpbFNlcnZpY2UuaXNEYXRlVmFsaWQoaW5wdXRWYWx1ZSwgdGhpcy5vcHRzLCB2YWxpZGF0ZU9wdHMpO1xuXG4gICAgICBpZiAodGhpcy51dGlsU2VydmljZS5pc0luaXRpYWxpemVkRGF0ZShkYXRlKSkge1xuICAgICAgICB0aGlzLnNlbGVjdGVkRGF0ZSA9IGRhdGU7XG4gICAgICAgIGlmICghb3ZlcnJpZGVTZWxlY3Rpb24pIHtcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkTW9udGggPSB7bW9udGhOYnI6IGRhdGUubW9udGgsIHllYXI6IGRhdGUueWVhcn07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAvLyBEYXRlIHJhbmdlIG1vZGUgLSBJZiBkYXRlIHJhbmdlIHNlbGVjdGVkIHVzZSBiZWdpbiBkYXRlIGFzIHNlbGVjdGVkIG1vbnRoXG4gICAgICB2YWxpZGF0ZU9wdHMgPSB7dmFsaWRhdGVEaXNhYmxlZERhdGVzOiBmYWxzZSwgc2VsZWN0ZWRWYWx1ZTogdGhpcy51dGlsU2VydmljZS5nZXRTZWxlY3RlZFZhbHVlKHNlbGVjdGVkVmFsdWUsIGRhdGVSYW5nZSl9O1xuICAgICAgY29uc3Qge2JlZ2luLCBlbmR9ID0gdGhpcy51dGlsU2VydmljZS5pc0RhdGVWYWxpZERhdGVSYW5nZShpbnB1dFZhbHVlLCB0aGlzLm9wdHMsIHZhbGlkYXRlT3B0cyk7XG5cbiAgICAgIGlmICh0aGlzLnV0aWxTZXJ2aWNlLmlzSW5pdGlhbGl6ZWREYXRlKGJlZ2luKSAmJiB0aGlzLnV0aWxTZXJ2aWNlLmlzSW5pdGlhbGl6ZWREYXRlKGVuZCkpIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZERhdGVSYW5nZSA9IHtiZWdpbiwgZW5kfTtcbiAgICAgICAgaWYgKCFvdmVycmlkZVNlbGVjdGlvbikge1xuICAgICAgICAgIHRoaXMuc2VsZWN0ZWRNb250aCA9IHttb250aE5icjogYmVnaW4ubW9udGgsIHllYXI6IGJlZ2luLnllYXJ9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVmcmVzaENvbXBvbmVudChvcHRzOiBJTXlPcHRpb25zLCBkZWZhdWx0TW9udGg6IElNeURlZmF1bHRNb250aCwgc2VsZWN0ZWRWYWx1ZTogYW55LCBpbnB1dFZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLm9wdHMgPSBvcHRzO1xuXG4gICAgY29uc3Qge2RlZmF1bHRWaWV3fSA9IG9wdHM7XG5cbiAgICB0aGlzLmluaXRpYWxpemVWaWV3KGRlZmF1bHRNb250aCwgc2VsZWN0ZWRWYWx1ZSwgaW5wdXRWYWx1ZSk7XG4gICAgdGhpcy5zZXRDYWxlbmRhclZpc2libGVNb250aCgpO1xuICAgIHRoaXMuc2V0RGVmYXVsdFZpZXcoZGVmYXVsdFZpZXcpO1xuICB9XG5cbiAgaGVhZGVyQWN0aW9uKGhlYWRlckFjdGlvbjogSGVhZGVyQWN0aW9uKTogdm9pZCB7XG4gICAgY29uc3Qge21vbnRoU2VsZWN0b3IsIHllYXJTZWxlY3Rvcn0gPSB0aGlzLm9wdHM7XG5cbiAgICBpZiAoaGVhZGVyQWN0aW9uID09PSBIZWFkZXJBY3Rpb24uUHJldkJ0bkNsaWNrKSB7XG4gICAgICBpZiAoIXRoaXMucHJldlZpZXdEaXNhYmxlZCkge1xuICAgICAgICB0aGlzLm9uUHJldk5hdmlnYXRlQnRuQ2xpY2tlZCgpO1xuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmIChoZWFkZXJBY3Rpb24gPT09IEhlYWRlckFjdGlvbi5OZXh0QnRuQ2xpY2spIHtcbiAgICAgIGlmICghdGhpcy5uZXh0Vmlld0Rpc2FibGVkKSB7XG4gICAgICAgIHRoaXMub25OZXh0TmF2aWdhdGVCdG5DbGlja2VkKCk7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKGhlYWRlckFjdGlvbiA9PT0gSGVhZGVyQWN0aW9uLk1vbnRoQnRuQ2xpY2spIHtcbiAgICAgIGlmIChtb250aFNlbGVjdG9yKSB7XG4gICAgICAgIHRoaXMub25Nb250aFZpZXdCdG5DbGlja2VkKCk7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKGhlYWRlckFjdGlvbiA9PT0gSGVhZGVyQWN0aW9uLlllYXJCdG5DbGljaykge1xuICAgICAgaWYgKHllYXJTZWxlY3Rvcikge1xuICAgICAgICB0aGlzLm9uWWVhclZpZXdCdG5DbGlja2VkKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc2V0RGVmYXVsdFZpZXcoZGVmYXVsdFZpZXc6IERlZmF1bHRWaWV3KTogdm9pZCB7XG4gICAgaWYgKGRlZmF1bHRWaWV3ID09PSBEZWZhdWx0Vmlldy5Nb250aCkge1xuICAgICAgdGhpcy5tb250aFZpZXdCdG5DbGlja2VkKCk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGRlZmF1bHRWaWV3ID09PSBEZWZhdWx0Vmlldy5ZZWFyKSB7XG4gICAgICB0aGlzLnllYXJWaWV3QnRuQ2xpY2tlZCgpO1xuICAgIH1cbiAgfVxuXG4gIHNldENhbGVuZGFyQW5pbWF0aW9uKGNhbEFuaW1hdGlvbjogSU15Q2FsZW5kYXJBbmltYXRpb24sIGlzT3BlbjogYm9vbGVhbik6IHZvaWQge1xuICAgIGNvbnN0IHtuYXRpdmVFbGVtZW50fSA9IHRoaXMuc2VsZWN0b3JFbDtcbiAgICBjb25zdCB7cmVuZGVyZXJ9ID0gdGhpcztcblxuICAgIGNvbnN0IGNsYXNzSW4gPSBNWV9EUF9BTklNQVRJT04gKyBBTklNQVRJT05fTkFNRVNbY2FsQW5pbWF0aW9uLmluIC0gMV07XG4gICAgaWYgKGlzT3Blbikge1xuICAgICAgcmVuZGVyZXIuYWRkQ2xhc3MobmF0aXZlRWxlbWVudCwgY2xhc3NJbiArIElOKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBjb25zdCBjbGFzc091dCA9IE1ZX0RQX0FOSU1BVElPTiArIEFOSU1BVElPTl9OQU1FU1tjYWxBbmltYXRpb24ub3V0IC0gMV07XG4gICAgICByZW5kZXJlci5yZW1vdmVDbGFzcyhuYXRpdmVFbGVtZW50LCBjbGFzc0luICsgSU4pO1xuICAgICAgcmVuZGVyZXIuYWRkQ2xhc3MobmF0aXZlRWxlbWVudCwgY2xhc3NPdXQgKyBPVVQpO1xuICAgIH1cbiAgfVxuXG4gIHJlc2V0RGF0ZVZhbHVlKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5vcHRzLmRhdGVSYW5nZSkge1xuICAgICAgdGhpcy5zZWxlY3RlZERhdGUgPSB0aGlzLnV0aWxTZXJ2aWNlLnJlc2V0RGF0ZSgpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWREYXRlUmFuZ2UuYmVnaW4gPSB0aGlzLnV0aWxTZXJ2aWNlLnJlc2V0RGF0ZSgpO1xuICAgICAgdGhpcy5zZWxlY3RlZERhdGVSYW5nZS5lbmQgPSB0aGlzLnV0aWxTZXJ2aWNlLnJlc2V0RGF0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIGNsZWFyRGF0ZSgpOiB2b2lkIHtcbiAgICBjb25zdCB7bW9udGgsIHllYXJ9ID0gdGhpcy51dGlsU2VydmljZS5nZXRUb2RheSgpO1xuICAgIHRoaXMuc2VsZWN0ZWRNb250aCA9IHttb250aE5icjogbW9udGgsIHllYXI6IHllYXJ9O1xuXG4gICAgdGhpcy5yZXNldERhdGVWYWx1ZSgpO1xuICAgIHRoaXMuc2V0Q2FsZW5kYXJWaXNpYmxlTW9udGgoKTtcbiAgICB0aGlzLnJlc2V0TW9udGhZZWFyU2VsZWN0KCk7XG4gIH1cblxuICByZXNldE1vbnRoWWVhclNlbGVjdCgpOiB2b2lkIHtcbiAgICB0aGlzLnNlbGVjdE1vbnRoID0gZmFsc2U7XG4gICAgdGhpcy5zZWxlY3RZZWFyID0gZmFsc2U7XG4gIH1cblxuICBvbk1vbnRoVmlld0J0bkNsaWNrZWQoKTogdm9pZCB7XG4gICAgdGhpcy52aWV3Q2hhbmdlZCA9IHRydWU7XG4gICAgdGhpcy5tb250aFZpZXdCdG5DbGlja2VkKCk7XG4gIH1cblxuICBtb250aFZpZXdCdG5DbGlja2VkKCk6IHZvaWQge1xuICAgIHRoaXMuc2VsZWN0TW9udGggPSAhdGhpcy5zZWxlY3RNb250aDtcbiAgICB0aGlzLnNlbGVjdFllYXIgPSBmYWxzZTtcblxuICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICBpZiAodGhpcy5zZWxlY3RNb250aCkge1xuICAgICAgdGhpcy5nZW5lcmF0ZU1vbnRocygpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGNvbnN0IHt5ZWFyLCBtb250aE5icn0gPSB0aGlzLnNlbGVjdGVkTW9udGg7XG4gICAgICB0aGlzLnZpc2libGVNb250aCA9IHttb250aFR4dDogdGhpcy5vcHRzLm1vbnRoTGFiZWxzW21vbnRoTmJyXSwgbW9udGhOYnIsIHllYXJ9O1xuICAgICAgdGhpcy5nZW5lcmF0ZUNhbGVuZGFyKG1vbnRoTmJyLCB5ZWFyLCB0cnVlKTtcbiAgICB9XG4gIH1cblxuICBvbk1vbnRoQ2VsbENsaWNrZWQoY2VsbDogSU15Q2FsZW5kYXJNb250aCk6IHZvaWQge1xuICAgIHRoaXMudmlld0NoYW5nZWQgPSB0cnVlO1xuXG4gICAgY29uc3Qge3llYXIsIG1vbnRoTmJyfSA9IHRoaXMudmlzaWJsZU1vbnRoO1xuICAgIGNvbnN0IG1vbnRoQ2hhbmdlOiBib29sZWFuID0gY2VsbC5uYnIgIT09IG1vbnRoTmJyO1xuICAgIHRoaXMudmlzaWJsZU1vbnRoID0ge21vbnRoVHh0OiB0aGlzLm9wdHMubW9udGhMYWJlbHNbY2VsbC5uYnJdLCBtb250aE5icjogY2VsbC5uYnIsIHllYXJ9O1xuICAgIHRoaXMuc2VsZWN0ZWRNb250aC55ZWFyID0geWVhcjtcbiAgICB0aGlzLmdlbmVyYXRlQ2FsZW5kYXIoY2VsbC5uYnIsIHllYXIsIG1vbnRoQ2hhbmdlKTtcbiAgICB0aGlzLnNlbGVjdE1vbnRoID0gZmFsc2U7XG4gICAgdGhpcy5mb2N1c1RvU2VsZWN0b3IoKTtcbiAgfVxuXG4gIG9uTW9udGhDZWxsS2V5RG93bihldmVudDogYW55KSB7XG4gICAgLy8gTW92ZSBmb2N1cyBieSBhcnJvdyBrZXlzXG4gICAgY29uc3Qge3NvdXJjZVJvdywgc291cmNlQ29sfSA9IHRoaXMuZ2V0U291cmNlUm93QW5kQ29sdW1uRnJvbUV2ZW50KGV2ZW50KTtcbiAgICBjb25zdCB7bW92ZUZvY3VzLCB0YXJnZXRSb3csIHRhcmdldENvbCwgZGlyZWN0aW9ufSA9IHRoaXMuZ2V0VGFyZ2V0Rm9jdXNSb3dBbmRDb2x1bW4oZXZlbnQsIHNvdXJjZVJvdywgc291cmNlQ29sLCBNT05USF9ST1dfQ09VTlQsIE1PTlRIX0NPTF9DT1VOVCk7XG5cbiAgICBpZiAobW92ZUZvY3VzKSB7XG4gICAgICB0aGlzLmZvY3VzQ2VsbEVsZW1lbnQoTSwgdGFyZ2V0Um93LCB0YXJnZXRDb2wsIGRpcmVjdGlvbiwgTU9OVEhfQ09MX0NPVU5UKTtcbiAgICB9XG4gIH1cblxuICBvblllYXJWaWV3QnRuQ2xpY2tlZCgpOiB2b2lkIHtcbiAgICB0aGlzLnZpZXdDaGFuZ2VkID0gdHJ1ZTtcbiAgICB0aGlzLnllYXJWaWV3QnRuQ2xpY2tlZCgpO1xuICB9XG5cbiAgeWVhclZpZXdCdG5DbGlja2VkKCk6IHZvaWQge1xuICAgIHRoaXMuc2VsZWN0WWVhciA9ICF0aGlzLnNlbGVjdFllYXI7XG4gICAgdGhpcy5zZWxlY3RNb250aCA9IGZhbHNlO1xuXG4gICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIGlmICh0aGlzLnNlbGVjdFllYXIpIHtcbiAgICAgIHRoaXMuZ2VuZXJhdGVZZWFycyh0aGlzLnZpc2libGVNb250aC55ZWFyKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBjb25zdCB7eWVhciwgbW9udGhOYnJ9ID0gdGhpcy5zZWxlY3RlZE1vbnRoO1xuICAgICAgdGhpcy52aXNpYmxlTW9udGggPSB7bW9udGhUeHQ6IHRoaXMub3B0cy5tb250aExhYmVsc1ttb250aE5icl0sIG1vbnRoTmJyLCB5ZWFyfTtcbiAgICAgIHRoaXMuZ2VuZXJhdGVDYWxlbmRhcihtb250aE5iciwgeWVhciwgdHJ1ZSk7XG4gICAgfVxuICB9XG5cbiAgb25ZZWFyQ2VsbENsaWNrZWQoY2VsbDogSU15Q2FsZW5kYXJZZWFyKTogdm9pZCB7XG4gICAgdGhpcy52aWV3Q2hhbmdlZCA9IHRydWU7XG5cbiAgICBjb25zdCB7eWVhciwgbW9udGhOYnIsIG1vbnRoVHh0fSA9IHRoaXMudmlzaWJsZU1vbnRoO1xuICAgIGNvbnN0IHljOiBib29sZWFuID0gY2VsbC55ZWFyICE9PSB5ZWFyO1xuICAgIHRoaXMudmlzaWJsZU1vbnRoID0ge21vbnRoVHh0LCBtb250aE5iciwgeWVhcjogY2VsbC55ZWFyfTtcbiAgICB0aGlzLnNlbGVjdGVkTW9udGgueWVhciA9IGNlbGwueWVhcjtcbiAgICB0aGlzLmdlbmVyYXRlQ2FsZW5kYXIobW9udGhOYnIsIGNlbGwueWVhciwgeWMpO1xuICAgIHRoaXMuc2VsZWN0WWVhciA9IGZhbHNlO1xuICAgIHRoaXMuZm9jdXNUb1NlbGVjdG9yKCk7XG4gIH1cblxuICBvblllYXJDZWxsS2V5RG93bihldmVudDogYW55KSB7XG4gICAgLy8gTW92ZSBmb2N1cyBieSBhcnJvdyBrZXlzXG4gICAgY29uc3Qge3NvdXJjZVJvdywgc291cmNlQ29sfSA9IHRoaXMuZ2V0U291cmNlUm93QW5kQ29sdW1uRnJvbUV2ZW50KGV2ZW50KTtcbiAgICBjb25zdCB7bW92ZUZvY3VzLCB0YXJnZXRSb3csIHRhcmdldENvbCwgZGlyZWN0aW9ufSA9IHRoaXMuZ2V0VGFyZ2V0Rm9jdXNSb3dBbmRDb2x1bW4oZXZlbnQsIHNvdXJjZVJvdywgc291cmNlQ29sLCBZRUFSX1JPV19DT1VOVCwgWUVBUl9DT0xfQ09VTlQpO1xuXG4gICAgaWYgKG1vdmVGb2N1cykge1xuICAgICAgdGhpcy5mb2N1c0NlbGxFbGVtZW50KFksIHRhcmdldFJvdywgdGFyZ2V0Q29sLCBkaXJlY3Rpb24sIFlFQVJfQ09MX0NPVU5UKTtcbiAgICB9XG4gIH1cblxuICBnZW5lcmF0ZU1vbnRocygpOiB2b2lkIHtcbiAgICBjb25zdCB0b2RheTogSU15RGF0ZSA9IHRoaXMudXRpbFNlcnZpY2UuZ2V0VG9kYXkoKTtcbiAgICB0aGlzLm1vbnRocy5sZW5ndGggPSAwO1xuXG4gICAgY29uc3Qge3llYXIsIG1vbnRoTmJyfSA9IHRoaXMudmlzaWJsZU1vbnRoO1xuICAgIGNvbnN0IHtydGwsIG1vbnRoTGFiZWxzfSA9IHRoaXMub3B0cztcblxuICAgIGxldCByb3c6IG51bWJlciA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gMTI7IGkgKz0gMykge1xuICAgICAgY29uc3Qgcm93RGF0YTogQXJyYXk8SU15Q2FsZW5kYXJNb250aD4gPSBbXTtcbiAgICAgIGxldCBjb2wgPSBydGwgPyAyIDogMDtcblxuICAgICAgZm9yIChsZXQgaiA9IGk7IGogPCBpICsgMzsgaisrKSB7XG4gICAgICAgIGNvbnN0IGRpc2FibGVkOiBib29sZWFuID0gdGhpcy51dGlsU2VydmljZS5pc0Rpc2FibGVkTW9udGgoeWVhciwgaiwgdGhpcy5vcHRzKTtcbiAgICAgICAgcm93RGF0YS5wdXNoKHtcbiAgICAgICAgICBuYnI6IGosXG4gICAgICAgICAgbmFtZTogbW9udGhMYWJlbHNbal0sXG4gICAgICAgICAgY3Vyck1vbnRoOiBqID09PSB0b2RheS5tb250aCAmJiB5ZWFyID09PSB0b2RheS55ZWFyLFxuICAgICAgICAgIHNlbGVjdGVkOiBqID09PSBtb250aE5iciAmJiB5ZWFyID09PSB0aGlzLnNlbGVjdGVkTW9udGgueWVhcixcbiAgICAgICAgICBkaXNhYmxlZCxcbiAgICAgICAgICByb3csXG4gICAgICAgICAgY29sOiBydGwgPyBjb2wtLSA6IGNvbCsrXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcm93Kys7XG4gICAgICB0aGlzLm1vbnRocy5wdXNoKHJvd0RhdGEpO1xuICAgIH1cblxuICAgIHRoaXMuc2V0TW9udGhWaWV3SGVhZGVyQnRuRGlzYWJsZWRTdGF0ZSh5ZWFyKTtcbiAgfVxuXG4gIGdlbmVyYXRlWWVhcnMoaW5wdXRZZWFyOiBudW1iZXIpOiB2b2lkIHtcbiAgICBjb25zdCB7bWluWWVhciwgbWF4WWVhciwgcnRsfSA9IHRoaXMub3B0cztcblxuICAgIGxldCB5OiBudW1iZXIgPSBpbnB1dFllYXIgLSAxMjtcbiAgICBpZiAoaW5wdXRZZWFyIDwgbWluWWVhcikge1xuICAgICAgeSA9IG1pblllYXI7XG4gICAgfVxuXG4gICAgaWYgKGlucHV0WWVhciArIDI1ID4gbWF4WWVhcikge1xuICAgICAgeSA9IG1heFllYXIgLSAyNDtcbiAgICB9XG5cbiAgICBjb25zdCB7eWVhcn0gPSB0aGlzLnZpc2libGVNb250aDtcblxuICAgIHRoaXMueWVhcnMubGVuZ3RoID0gMDtcbiAgICBjb25zdCB0b2RheTogSU15RGF0ZSA9IHRoaXMudXRpbFNlcnZpY2UuZ2V0VG9kYXkoKTtcblxuICAgIGxldCByb3c6IG51bWJlciA9IDA7XG4gICAgZm9yIChsZXQgaSA9IHk7IGkgPCB5ICsgMjU7IGkgKz0gNSkge1xuICAgICAgY29uc3Qgcm93RGF0YTogQXJyYXk8SU15Q2FsZW5kYXJZZWFyPiA9IFtdO1xuICAgICAgbGV0IGNvbDogbnVtYmVyID0gcnRsID8gNCA6IDA7XG5cbiAgICAgIGZvciAobGV0IGogPSBpOyBqIDwgaSArIDU7IGorKykge1xuICAgICAgICBjb25zdCBkaXNhYmxlZDogYm9vbGVhbiA9IHRoaXMudXRpbFNlcnZpY2UuaXNEaXNhYmxlZFllYXIoaiwgdGhpcy5vcHRzKTtcbiAgICAgICAgcm93RGF0YS5wdXNoKHtcbiAgICAgICAgICB5ZWFyOiBqLFxuICAgICAgICAgIGN1cnJZZWFyOiBqID09PSB0b2RheS55ZWFyLFxuICAgICAgICAgIHNlbGVjdGVkOiBqID09PSB5ZWFyLFxuICAgICAgICAgIGRpc2FibGVkLFxuICAgICAgICAgIHJvdyxcbiAgICAgICAgICBjb2w6IHJ0bCA/IGNvbC0tIDogY29sKytcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByb3crKztcbiAgICAgIHRoaXMueWVhcnMucHVzaChyb3dEYXRhKTtcbiAgICB9XG5cbiAgICBjb25zdCBiZWdpblllYXI6IG51bWJlciA9IHRoaXMuZ2V0WWVhclZhbHVlQnlSb3dBbmRDb2woMCwgMCk7XG4gICAgY29uc3QgZW5kWWVhcjogbnVtYmVyID0gYmVnaW5ZZWFyICsgMjQ7XG4gICAgdGhpcy55ZWFyc0R1cmF0aW9uID0gKCFydGwgPyBiZWdpblllYXIgOiBlbmRZZWFyKSArIFlFQVJfU0VQQVJBVE9SICsgKCFydGwgPyBlbmRZZWFyIDogYmVnaW5ZZWFyKTtcblxuICAgIHRoaXMuc2V0WWVhclZpZXdIZWFkZXJCdG5EaXNhYmxlZFN0YXRlKGJlZ2luWWVhciwgZW5kWWVhcik7XG4gIH1cblxuICBvblRvZGF5Rm9vdGVyQ2xpY2tlZCgpOiB2b2lkIHtcbiAgICBjb25zdCBkYXRlID0gdGhpcy51dGlsU2VydmljZS5nZXRUb2RheSgpO1xuICAgIHRoaXMuc2VsZWN0RGF0ZShkYXRlKTtcbiAgfVxuXG4gIGdldFllYXJWYWx1ZUJ5Um93QW5kQ29sKHJvdzogbnVtYmVyLCBjb2w6IG51bWJlcik6IG51bWJlciB7XG4gICAgY29uc3Qge3llYXJzfSA9IHRoaXM7XG4gICAgaWYgKCF5ZWFycyB8fCB5ZWFycy5sZW5ndGggPT09IDApIHtcbiAgICAgIGNvbnN0IHt5ZWFyfSA9IHRoaXMudXRpbFNlcnZpY2UuZ2V0VG9kYXkoKTtcbiAgICAgIHJldHVybiB5ZWFyO1xuICAgIH1cbiAgICByZXR1cm4geWVhcnNbcm93XVtjb2xdLnllYXI7XG4gIH1cblxuICBzZXRDYWxlbmRhclZpc2libGVNb250aCgpOiB2b2lkIHtcbiAgICAvLyBTZXRzIHZpc2libGUgbW9udGggb2YgY2FsZW5kYXJcbiAgICBjb25zdCB7eWVhciwgbW9udGhOYnJ9ID0gdGhpcy5zZWxlY3RlZE1vbnRoO1xuICAgIHRoaXMudmlzaWJsZU1vbnRoID0ge21vbnRoVHh0OiB0aGlzLm9wdHMubW9udGhMYWJlbHNbbW9udGhOYnJdLCBtb250aE5iciwgeWVhcn07XG5cbiAgICAvLyBDcmVhdGUgY3VycmVudCBtb250aFxuICAgIHRoaXMuZ2VuZXJhdGVDYWxlbmRhcihtb250aE5iciwgeWVhciwgdHJ1ZSk7XG4gIH1cblxuICBvblZpZXdBY3RpdmF0ZWQoZXZlbnQ6IGFueSk6IHZvaWQge1xuICAgIHRoaXMudmlld0FjdGl2YXRlZChldmVudCk7XG4gIH1cblxuICBvblByZXZOYXZpZ2F0ZUJ0bkNsaWNrZWQoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLnNlbGVjdE1vbnRoICYmICF0aGlzLnNlbGVjdFllYXIpIHtcbiAgICAgIHRoaXMuc2V0RGF0ZVZpZXdNb250aChmYWxzZSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHRoaXMuc2VsZWN0TW9udGgpIHtcbiAgICAgIHRoaXMudmlzaWJsZU1vbnRoLnllYXItLTtcbiAgICAgIHRoaXMuZ2VuZXJhdGVNb250aHMoKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodGhpcy5zZWxlY3RZZWFyKSB7XG4gICAgICB0aGlzLmdlbmVyYXRlWWVhcnModGhpcy5nZXRZZWFyVmFsdWVCeVJvd0FuZENvbCgyLCAyKSAtIDI1KTtcbiAgICB9XG4gIH1cblxuICBvbk5leHROYXZpZ2F0ZUJ0bkNsaWNrZWQoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLnNlbGVjdE1vbnRoICYmICF0aGlzLnNlbGVjdFllYXIpIHtcbiAgICAgIHRoaXMuc2V0RGF0ZVZpZXdNb250aCh0cnVlKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodGhpcy5zZWxlY3RNb250aCkge1xuICAgICAgdGhpcy52aXNpYmxlTW9udGgueWVhcisrO1xuICAgICAgdGhpcy5nZW5lcmF0ZU1vbnRocygpO1xuICAgIH1cbiAgICBlbHNlIGlmICh0aGlzLnNlbGVjdFllYXIpIHtcbiAgICAgIHRoaXMuZ2VuZXJhdGVZZWFycyh0aGlzLmdldFllYXJWYWx1ZUJ5Um93QW5kQ29sKDIsIDIpICsgMjUpO1xuICAgIH1cbiAgfVxuXG4gIHNldERhdGVWaWV3TW9udGgoaXNOZXh0OiBib29sZWFuKTogdm9pZCB7XG4gICAgbGV0IGNoYW5nZTogbnVtYmVyID0gaXNOZXh0ID8gMSA6IC0xO1xuXG4gICAgY29uc3Qge3llYXIsIG1vbnRoTmJyfSA9IHRoaXMudmlzaWJsZU1vbnRoO1xuXG4gICAgY29uc3QgZDogRGF0ZSA9IHRoaXMudXRpbFNlcnZpY2UuZ2V0SnNEYXRlKHllYXIsIG1vbnRoTmJyLCAxKTtcbiAgICBkLnNldE1vbnRoKGQuZ2V0TW9udGgoKSArIGNoYW5nZSk7XG5cbiAgICBjb25zdCB5OiBudW1iZXIgPSBkLmdldEZ1bGxZZWFyKCk7XG4gICAgY29uc3QgbTogbnVtYmVyID0gZC5nZXRNb250aCgpICsgMTtcblxuICAgIHRoaXMudmlzaWJsZU1vbnRoID0ge21vbnRoVHh0OiB0aGlzLm9wdHMubW9udGhMYWJlbHNbbV0sIG1vbnRoTmJyOiBtLCB5ZWFyOiB5fTtcbiAgICB0aGlzLmdlbmVyYXRlQ2FsZW5kYXIobSwgeSwgdHJ1ZSk7XG4gIH1cblxuICBvbkNsb3NlU2VsZWN0b3IoZXZlbnQ6IGFueSk6IHZvaWQge1xuICAgIGNvbnN0IGtleUNvZGU6IG51bWJlciA9IHRoaXMudXRpbFNlcnZpY2UuZ2V0S2V5Q29kZUZyb21FdmVudChldmVudCk7XG4gICAgaWYgKGtleUNvZGUgPT09IEtleUNvZGUuZXNjKSB7XG4gICAgICB0aGlzLmNsb3NlZEJ5RXNjKCk7XG4gICAgfVxuICB9XG5cbiAgb25EYXlDZWxsQ2xpY2tlZChjZWxsOiBJTXlDYWxlbmRhckRheSk6IHZvaWQge1xuICAgIC8vIENlbGwgY2xpY2tlZCBvbiB0aGUgY2FsZW5kYXJcbiAgICB0aGlzLnNlbGVjdERhdGUoY2VsbC5kYXRlT2JqKTtcbiAgICB0aGlzLnJlc2V0TW9udGhZZWFyU2VsZWN0KCk7XG4gIH1cblxuICBvbkRheUNlbGxLZXlEb3duKGV2ZW50OiBhbnkpIHtcbiAgICAvLyBNb3ZlIGZvY3VzIGJ5IGFycm93IGtleXNcbiAgICBjb25zdCB7c291cmNlUm93LCBzb3VyY2VDb2x9ID0gdGhpcy5nZXRTb3VyY2VSb3dBbmRDb2x1bW5Gcm9tRXZlbnQoZXZlbnQpO1xuICAgIGNvbnN0IHttb3ZlRm9jdXMsIHRhcmdldFJvdywgdGFyZ2V0Q29sLCBkaXJlY3Rpb259ID0gdGhpcy5nZXRUYXJnZXRGb2N1c1Jvd0FuZENvbHVtbihldmVudCwgc291cmNlUm93LCBzb3VyY2VDb2wsIERBVEVfUk9XX0NPVU5ULCBEQVRFX0NPTF9DT1VOVCk7XG4gICAgaWYgKG1vdmVGb2N1cykge1xuICAgICAgdGhpcy5mb2N1c0NlbGxFbGVtZW50KEQsIHRhcmdldFJvdywgdGFyZ2V0Q29sLCBkaXJlY3Rpb24sIERBVEVfQ09MX0NPVU5UKTtcbiAgICB9XG4gIH1cblxuICBnZXRTb3VyY2VSb3dBbmRDb2x1bW5Gcm9tRXZlbnQoZXZlbnQ6IGFueSk6IGFueSB7XG4gICAgbGV0IHNvdXJjZVJvdzogbnVtYmVyID0gMDtcbiAgICBsZXQgc291cmNlQ29sOiBudW1iZXIgPSAwO1xuICAgIGlmIChldmVudC50YXJnZXQgJiYgZXZlbnQudGFyZ2V0LmlkKSB7XG4gICAgICAvLyB2YWx1ZSBvZiBpZCBpcyBmb3IgZXhhbXBsZTogbV8wXzEgKGZpcnN0IG51bWJlciA9IHJvdywgc2Vjb25kIG51bWJlciA9IGNvbHVtbilcbiAgICAgIGNvbnN0IGFycjogQXJyYXk8c3RyaW5nPiA9IGV2ZW50LnRhcmdldC5pZC5zcGxpdChVTkRFUl9MSU5FKTtcbiAgICAgIHNvdXJjZVJvdyA9IE51bWJlcihhcnJbMV0pO1xuICAgICAgc291cmNlQ29sID0gTnVtYmVyKGFyclsyXSk7XG4gICAgfVxuICAgIHJldHVybiB7c291cmNlUm93LCBzb3VyY2VDb2x9O1xuICB9XG5cbiAgZ2V0VGFyZ2V0Rm9jdXNSb3dBbmRDb2x1bW4oZXZlbnQ6IGFueSwgcm93OiBudW1iZXIsIGNvbDogbnVtYmVyLCByb3dDb3VudDogbnVtYmVyLCBjb2xDb3VudDogbnVtYmVyKTogYW55IHtcbiAgICBsZXQgbW92ZUZvY3VzOiBib29sZWFuID0gdHJ1ZTtcbiAgICBsZXQgdGFyZ2V0Um93OiBudW1iZXIgPSByb3c7XG4gICAgbGV0IHRhcmdldENvbDogbnVtYmVyID0gY29sO1xuICAgIGxldCBkaXJlY3Rpb246IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIGNvbnN0IGtleUNvZGU6IG51bWJlciA9IHRoaXMudXRpbFNlcnZpY2UuZ2V0S2V5Q29kZUZyb21FdmVudChldmVudCk7XG4gICAgaWYgKGtleUNvZGUgPT09IEtleUNvZGUudXBBcnJvdyAmJiByb3cgPiAwKSB7XG4gICAgICB0YXJnZXRSb3ctLTtcbiAgICB9XG4gICAgZWxzZSBpZiAoa2V5Q29kZSA9PT0gS2V5Q29kZS5kb3duQXJyb3cgJiYgcm93IDwgcm93Q291bnQpIHtcbiAgICAgIHRhcmdldFJvdysrO1xuICAgICAgZGlyZWN0aW9uID0gdHJ1ZTtcbiAgICB9XG4gICAgZWxzZSBpZiAoa2V5Q29kZSA9PT0gS2V5Q29kZS5sZWZ0QXJyb3cgJiYgY29sID4gMCkge1xuICAgICAgdGFyZ2V0Q29sLS07XG4gICAgfVxuICAgIGVsc2UgaWYgKGtleUNvZGUgPT09IEtleUNvZGUucmlnaHRBcnJvdyAmJiBjb2wgPCBjb2xDb3VudCkge1xuICAgICAgdGFyZ2V0Q29sKys7XG4gICAgICBkaXJlY3Rpb24gPSB0cnVlO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIG1vdmVGb2N1cyA9IGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4ge21vdmVGb2N1cywgdGFyZ2V0Um93LCB0YXJnZXRDb2wsIGRpcmVjdGlvbn07XG4gIH1cblxuICBmb2N1c0NlbGxFbGVtZW50KHR5cGU6IHN0cmluZywgcm93OiBudW1iZXIsIGNvbDogbnVtYmVyLCBkaXJlY3Rpb246IGJvb2xlYW4sIGNvbENvdW50OiBudW1iZXIpOiB2b2lkIHtcbiAgICBjb25zdCBjbGFzc05hbWU6IHN0cmluZyA9IHR5cGUgKyBVTkRFUl9MSU5FICsgcm93ICsgVU5ERVJfTElORSArIGNvbDtcbiAgICBsZXQgZWxlbTogYW55ID0gdGhpcy5zZWxlY3RvckVsLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcihET1QgKyBjbGFzc05hbWUpO1xuXG4gICAgaWYgKGVsZW0uZ2V0QXR0cmlidXRlKFRBQklOREVYKSAhPT0gWkVST19TVFIpIHtcbiAgICAgIC8vIGlmIHRoZSBzZWxlY3RlZCBlbGVtZW50IGlzIGRpc2FibGVkIG1vdmUgYSBmb2N1cyB0byBuZXh0L3ByZXZpb3VzIGVuYWJsZWQgZWxlbWVudFxuICAgICAgbGV0IHRkTGlzdDogYW55ID0gdGhpcy5nZXRDYWxlbmRhckVsZW1lbnRzKCk7XG4gICAgICBjb25zdCBpZHg6IG51bWJlciA9IHJvdyAqIChjb2xDb3VudCArIDEpICsgY29sO1xuXG4gICAgICBsZXQgZW5hYmxlZEVsZW06IGFueSA9IG51bGw7XG4gICAgICBpZiAoZGlyZWN0aW9uKSB7XG4gICAgICAgIC8vIGZpbmQgbmV4dCBlbmFibGVkXG4gICAgICAgIGVuYWJsZWRFbGVtID0gdGRMaXN0LnNsaWNlKGlkeCkuZmluZCgodGQ6IGFueSkgPT4gdGQuZ2V0QXR0cmlidXRlKFRBQklOREVYKSA9PT0gWkVST19TVFIpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIC8vIGZpbmQgcHJldmlvdXMgZW5hYmxlZFxuICAgICAgICBlbmFibGVkRWxlbSA9IHRkTGlzdC5zbGljZSgwLCBpZHgpLnJldmVyc2UoKS5maW5kKCh0ZDogYW55KSA9PiB0ZC5nZXRBdHRyaWJ1dGUoVEFCSU5ERVgpID09PSBaRVJPX1NUUik7XG4gICAgICB9XG5cbiAgICAgIGVsZW0gPSBlbmFibGVkRWxlbSA/IGVuYWJsZWRFbGVtIDogdGhpcy5zZWxlY3RvckVsLm5hdGl2ZUVsZW1lbnQ7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgZWxlbS5mb2N1cygpO1xuICAgIH1cbiAgfVxuXG4gIGZvY3VzVG9TZWxlY3RvcigpOiB2b2lkIHtcbiAgICB0aGlzLnNlbGVjdG9yRWwubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICB9XG5cbiAgZ2V0Q2FsZW5kYXJFbGVtZW50cygpOiBhbnkge1xuICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMuc2VsZWN0b3JFbC5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoVERfU0VMRUNUT1IpKTtcbiAgfVxuXG4gIHNlbGVjdERhdGUoZGF0ZTogSU15RGF0ZSk6IHZvaWQge1xuICAgIGNvbnN0IHtkYXRlUmFuZ2UsIGRhdGVGb3JtYXQsIG1vbnRoTGFiZWxzLCBkYXRlUmFuZ2VEYXRlc0RlbGltaXRlciwgY2xvc2VTZWxlY3Rvck9uRGF0ZVNlbGVjdH0gPSB0aGlzLm9wdHM7XG5cbiAgICBpZiAoZGF0ZVJhbmdlKSB7XG4gICAgICAvLyBEYXRlIHJhbmdlXG4gICAgICBjb25zdCBpc0JlZ2luRGF0ZUluaXRpYWxpemVkOiBib29sZWFuID0gdGhpcy51dGlsU2VydmljZS5pc0luaXRpYWxpemVkRGF0ZSh0aGlzLnNlbGVjdGVkRGF0ZVJhbmdlLmJlZ2luKTtcbiAgICAgIGNvbnN0IGlzRW5kRGF0ZUluaXRpYWxpemVkOiBib29sZWFuID0gdGhpcy51dGlsU2VydmljZS5pc0luaXRpYWxpemVkRGF0ZSh0aGlzLnNlbGVjdGVkRGF0ZVJhbmdlLmVuZCk7XG4gICAgICBpZiAoaXNCZWdpbkRhdGVJbml0aWFsaXplZCAmJiBpc0VuZERhdGVJbml0aWFsaXplZCkge1xuICAgICAgICAvLyBib3RoIGFscmVhZHkgc2VsZWN0ZWQgLSBzZXQgYmVnaW4gZGF0ZSBhbmQgcmVzZXQgZW5kIGRhdGVcbiAgICAgICAgdGhpcy5zZWxlY3RlZERhdGVSYW5nZS5iZWdpbiA9IGRhdGU7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWREYXRlUmFuZ2UuZW5kID0gdGhpcy51dGlsU2VydmljZS5yZXNldERhdGUoKTtcbiAgICAgICAgdGhpcy5yYW5nZURhdGVTZWxlY3Rpb24oe1xuICAgICAgICAgIGlzQmVnaW46IHRydWUsXG4gICAgICAgICAgZGF0ZSxcbiAgICAgICAgICBqc0RhdGU6IHRoaXMudXRpbFNlcnZpY2UubXlEYXRlVG9Kc0RhdGUoZGF0ZSksXG4gICAgICAgICAgZGF0ZUZvcm1hdDogZGF0ZUZvcm1hdCxcbiAgICAgICAgICBmb3JtYXR0ZWQ6IHRoaXMudXRpbFNlcnZpY2UuZm9ybWF0RGF0ZShkYXRlLCBkYXRlRm9ybWF0LCBtb250aExhYmVscyksXG4gICAgICAgICAgZXBvYzogdGhpcy51dGlsU2VydmljZS5nZXRFcG9jVGltZShkYXRlKVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKCFpc0JlZ2luRGF0ZUluaXRpYWxpemVkKSB7XG4gICAgICAgIC8vIGJlZ2luIGRhdGVcbiAgICAgICAgdGhpcy5zZWxlY3RlZERhdGVSYW5nZS5iZWdpbiA9IGRhdGU7XG4gICAgICAgIHRoaXMucmFuZ2VEYXRlU2VsZWN0aW9uKHtcbiAgICAgICAgICBpc0JlZ2luOiB0cnVlLFxuICAgICAgICAgIGRhdGUsXG4gICAgICAgICAganNEYXRlOiB0aGlzLnV0aWxTZXJ2aWNlLm15RGF0ZVRvSnNEYXRlKGRhdGUpLFxuICAgICAgICAgIGRhdGVGb3JtYXQ6IGRhdGVGb3JtYXQsXG4gICAgICAgICAgZm9ybWF0dGVkOiB0aGlzLnV0aWxTZXJ2aWNlLmZvcm1hdERhdGUoZGF0ZSwgZGF0ZUZvcm1hdCwgbW9udGhMYWJlbHMpLFxuICAgICAgICAgIGVwb2M6IHRoaXMudXRpbFNlcnZpY2UuZ2V0RXBvY1RpbWUoZGF0ZSlcbiAgICAgICAgfSk7XG5cbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICAvLyBzZWNvbmQgc2VsZWN0aW9uXG4gICAgICAgIGNvbnN0IGZpcnN0RGF0ZUVhcmxpZXI6IGJvb2xlYW4gPSB0aGlzLnV0aWxTZXJ2aWNlLmlzRGF0ZUVhcmxpZXIoZGF0ZSwgdGhpcy5zZWxlY3RlZERhdGVSYW5nZS5iZWdpbik7XG4gICAgICAgIGlmIChmaXJzdERhdGVFYXJsaWVyKSB7XG4gICAgICAgICAgdGhpcy5zZWxlY3RlZERhdGVSYW5nZS5iZWdpbiA9IGRhdGU7XG4gICAgICAgICAgdGhpcy5yYW5nZURhdGVTZWxlY3Rpb24oe1xuICAgICAgICAgICAgaXNCZWdpbjogdHJ1ZSxcbiAgICAgICAgICAgIGRhdGUsXG4gICAgICAgICAgICBqc0RhdGU6IHRoaXMudXRpbFNlcnZpY2UubXlEYXRlVG9Kc0RhdGUoZGF0ZSksXG4gICAgICAgICAgICBkYXRlRm9ybWF0OiBkYXRlRm9ybWF0LFxuICAgICAgICAgICAgZm9ybWF0dGVkOiB0aGlzLnV0aWxTZXJ2aWNlLmZvcm1hdERhdGUoZGF0ZSwgZGF0ZUZvcm1hdCwgbW9udGhMYWJlbHMpLFxuICAgICAgICAgICAgZXBvYzogdGhpcy51dGlsU2VydmljZS5nZXRFcG9jVGltZShkYXRlKVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHRoaXMuc2VsZWN0ZWREYXRlUmFuZ2UuZW5kID0gZGF0ZTtcbiAgICAgICAgICB0aGlzLnJhbmdlRGF0ZVNlbGVjdGlvbih7XG4gICAgICAgICAgICBpc0JlZ2luOiBmYWxzZSxcbiAgICAgICAgICAgIGRhdGUsXG4gICAgICAgICAgICBqc0RhdGU6IHRoaXMudXRpbFNlcnZpY2UubXlEYXRlVG9Kc0RhdGUoZGF0ZSksXG4gICAgICAgICAgICBkYXRlRm9ybWF0OiBkYXRlRm9ybWF0LFxuICAgICAgICAgICAgZm9ybWF0dGVkOiB0aGlzLnV0aWxTZXJ2aWNlLmZvcm1hdERhdGUoZGF0ZSwgZGF0ZUZvcm1hdCwgbW9udGhMYWJlbHMpLFxuICAgICAgICAgICAgZXBvYzogdGhpcy51dGlsU2VydmljZS5nZXRFcG9jVGltZShkYXRlKVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgdGhpcy5kYXRlQ2hhbmdlZCh0aGlzLnV0aWxTZXJ2aWNlLmdldERhdGVNb2RlbChudWxsLCB0aGlzLnNlbGVjdGVkRGF0ZVJhbmdlLCBkYXRlRm9ybWF0LCBtb250aExhYmVscywgZGF0ZVJhbmdlRGF0ZXNEZWxpbWl0ZXIpLCBjbG9zZVNlbGVjdG9yT25EYXRlU2VsZWN0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIC8vIFNpbmdsZSBkYXRlXG4gICAgICB0aGlzLnNlbGVjdGVkRGF0ZSA9IGRhdGU7XG4gICAgICB0aGlzLmRhdGVDaGFuZ2VkKHRoaXMudXRpbFNlcnZpY2UuZ2V0RGF0ZU1vZGVsKHRoaXMuc2VsZWN0ZWREYXRlLCBudWxsLCBkYXRlRm9ybWF0LCBtb250aExhYmVscywgZGF0ZVJhbmdlRGF0ZXNEZWxpbWl0ZXIpLCBjbG9zZVNlbGVjdG9yT25EYXRlU2VsZWN0KTtcbiAgICB9XG4gIH1cblxuICBtb250aFN0YXJ0SWR4KHk6IG51bWJlciwgbTogbnVtYmVyKTogbnVtYmVyIHtcbiAgICAvLyBNb250aCBzdGFydCBpbmRleFxuICAgIGNvbnN0IGQ6IERhdGUgPSBuZXcgRGF0ZSgpO1xuICAgIGQuc2V0RGF0ZSgxKTtcbiAgICBkLnNldE1vbnRoKG0gLSAxKTtcbiAgICBkLnNldEZ1bGxZZWFyKHkpO1xuICAgIGNvbnN0IGlkeCA9IGQuZ2V0RGF5KCkgKyB0aGlzLnN1bmRheUlkeCgpO1xuICAgIHJldHVybiBpZHggPj0gNyA/IGlkeCAtIDcgOiBpZHg7XG4gIH1cblxuICBpc0N1cnJEYXkoZDogbnVtYmVyLCBtOiBudW1iZXIsIHk6IG51bWJlciwgdG9kYXk6IElNeURhdGUpOiBib29sZWFuIHtcbiAgICAvLyBDaGVjayBpcyBhIGdpdmVuIGRhdGUgdGhlIHRvZGF5XG4gICAgcmV0dXJuIGQgPT09IHRvZGF5LmRheSAmJiBtID09PSB0b2RheS5tb250aCAmJiB5ID09PSB0b2RheS55ZWFyO1xuICB9XG5cbiAgZ2V0RGF5TnVtYmVyKGRhdGU6IElNeURhdGUpOiBudW1iZXIge1xuICAgIC8vIEdldCBkYXkgbnVtYmVyOiBzdT0wLCBtbz0xLCB0dT0yLCB3ZT0zIC4uLlxuICAgIGNvbnN0IHt5ZWFyLCBtb250aCwgZGF5fSA9IGRhdGU7XG4gICAgY29uc3QgZDogRGF0ZSA9IHRoaXMudXRpbFNlcnZpY2UuZ2V0SnNEYXRlKHllYXIsIG1vbnRoLCBkYXkpO1xuICAgIHJldHVybiBkLmdldERheSgpO1xuICB9XG5cbiAgZ2V0V2Vla2RheShkYXRlOiBJTXlEYXRlKTogc3RyaW5nIHtcbiAgICAvLyBHZXQgd2Vla2RheTogc3UsIG1vLCB0dSwgd2UgLi4uXG4gICAgcmV0dXJuIHRoaXMud2Vla0RheU9wdHNbdGhpcy5nZXREYXlOdW1iZXIoZGF0ZSldO1xuICB9XG5cbiAgc3VuZGF5SWR4KCk6IG51bWJlciB7XG4gICAgLy8gSW5kZXggb2YgU3VuZGF5IGRheVxuICAgIHJldHVybiB0aGlzLmRheUlkeCA+IDAgPyA3IC0gdGhpcy5kYXlJZHggOiAwO1xuICB9XG5cbiAgZ2VuZXJhdGVDYWxlbmRhcihtOiBudW1iZXIsIHk6IG51bWJlciwgbm90aWZ5Q2hhbmdlOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5kYXRlcy5sZW5ndGggPSAwO1xuICAgIGNvbnN0IHRvZGF5OiBJTXlEYXRlID0gdGhpcy51dGlsU2VydmljZS5nZXRUb2RheSgpO1xuICAgIGNvbnN0IG1vbnRoU3RhcnQ6IG51bWJlciA9IHRoaXMubW9udGhTdGFydElkeCh5LCBtKTtcbiAgICBjb25zdCBkSW5UaGlzTTogbnVtYmVyID0gdGhpcy51dGlsU2VydmljZS5kYXRlc0luTW9udGgobSwgeSk7XG4gICAgY29uc3QgZEluUHJldk06IG51bWJlciA9IHRoaXMudXRpbFNlcnZpY2UuZGF0ZXNJblByZXZNb250aChtLCB5KTtcblxuICAgIGxldCBkYXlOYnI6IG51bWJlciA9IDE7XG4gICAgbGV0IG1vbnRoOiBudW1iZXIgPSBtO1xuICAgIGxldCBjbW86IG51bWJlciA9IE1vbnRoSWQucHJldjtcbiAgICBjb25zdCB7cnRsLCBzaG93V2Vla051bWJlcnMsIGZpcnN0RGF5T2ZXZWVrfSA9IHRoaXMub3B0cztcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IDc7IGkrKykge1xuICAgICAgbGV0IGNvbDogbnVtYmVyID0gcnRsID8gNiA6IDA7XG4gICAgICBjb25zdCB3ZWVrOiBBcnJheTxJTXlDYWxlbmRhckRheT4gPSBbXTtcbiAgICAgIGlmIChpID09PSAxKSB7XG4gICAgICAgIC8vIEZpcnN0IHdlZWtcbiAgICAgICAgY29uc3QgcG0gPSBkSW5QcmV2TSAtIG1vbnRoU3RhcnQgKyAxO1xuICAgICAgICAvLyBQcmV2aW91cyBtb250aFxuICAgICAgICBmb3IgKGxldCBqID0gcG07IGogPD0gZEluUHJldk07IGorKykge1xuICAgICAgICAgIGNvbnN0IGRhdGU6IElNeURhdGUgPSB7eWVhcjogbSA9PT0gMSA/IHkgLSAxIDogeSwgbW9udGg6IG0gPT09IDEgPyAxMiA6IG0gLSAxLCBkYXk6IGp9O1xuICAgICAgICAgIHdlZWsucHVzaCh7XG4gICAgICAgICAgICBkYXRlT2JqOiBkYXRlLFxuICAgICAgICAgICAgY21vLFxuICAgICAgICAgICAgY3VyckRheTogdGhpcy5pc0N1cnJEYXkoaiwgbW9udGggLSAxLCB5LCB0b2RheSksXG4gICAgICAgICAgICBkaXNhYmxlZERhdGU6IHRoaXMudXRpbFNlcnZpY2UuaXNEaXNhYmxlZERhdGUoZGF0ZSwgdGhpcy5vcHRzKSxcbiAgICAgICAgICAgIG1hcmtlZERhdGU6IHRoaXMudXRpbFNlcnZpY2UuaXNNYXJrZWREYXRlKGRhdGUsIHRoaXMub3B0cyksXG4gICAgICAgICAgICBsYWJlbGVkRGF0ZTogdGhpcy51dGlsU2VydmljZS5pc0xhYmVsZWREYXRlKGRhdGUsIHRoaXMub3B0cy5sYWJlbERhdGVzKSxcbiAgICAgICAgICAgIGhpZ2hsaWdodDogdGhpcy51dGlsU2VydmljZS5pc0hpZ2hsaWdodGVkRGF0ZShkYXRlLCB0aGlzLm9wdHMpLFxuICAgICAgICAgICAgcm93OiBpIC0gMSxcbiAgICAgICAgICAgIGNvbDogcnRsID8gY29sLS0gOiBjb2wrK1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgY21vID0gTW9udGhJZC5jdXJyO1xuICAgICAgICAvLyBDdXJyZW50IG1vbnRoXG4gICAgICAgIGNvbnN0IGRheXNMZWZ0OiBudW1iZXIgPSA3IC0gd2Vlay5sZW5ndGg7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZGF5c0xlZnQ7IGorKykge1xuICAgICAgICAgIGNvbnN0IGRhdGU6IElNeURhdGUgPSB7eWVhcjogeSwgbW9udGg6IG0sIGRheTogZGF5TmJyfTtcbiAgICAgICAgICB3ZWVrLnB1c2goe1xuICAgICAgICAgICAgZGF0ZU9iajogZGF0ZSxcbiAgICAgICAgICAgIGNtbyxcbiAgICAgICAgICAgIGN1cnJEYXk6IHRoaXMuaXNDdXJyRGF5KGRheU5iciwgbSwgeSwgdG9kYXkpLFxuICAgICAgICAgICAgZGlzYWJsZWREYXRlOiB0aGlzLnV0aWxTZXJ2aWNlLmlzRGlzYWJsZWREYXRlKGRhdGUsIHRoaXMub3B0cyksXG4gICAgICAgICAgICBtYXJrZWREYXRlOiB0aGlzLnV0aWxTZXJ2aWNlLmlzTWFya2VkRGF0ZShkYXRlLCB0aGlzLm9wdHMpLFxuICAgICAgICAgICAgbGFiZWxlZERhdGU6IHRoaXMudXRpbFNlcnZpY2UuaXNMYWJlbGVkRGF0ZShkYXRlLCB0aGlzLm9wdHMubGFiZWxEYXRlcyksXG4gICAgICAgICAgICBoaWdobGlnaHQ6IHRoaXMudXRpbFNlcnZpY2UuaXNIaWdobGlnaHRlZERhdGUoZGF0ZSwgdGhpcy5vcHRzKSxcbiAgICAgICAgICAgIHJvdzogaSAtIDEsXG4gICAgICAgICAgICBjb2w6IHJ0bCA/IGNvbC0tIDogY29sKytcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBkYXlOYnIrKztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIC8vIFJlc3Qgb2YgdGhlIHdlZWtzXG4gICAgICAgIGZvciAobGV0IGogPSAxOyBqIDwgODsgaisrKSB7XG4gICAgICAgICAgaWYgKGRheU5iciA+IGRJblRoaXNNKSB7XG4gICAgICAgICAgICAvLyBOZXh0IG1vbnRoXG4gICAgICAgICAgICBkYXlOYnIgPSAxO1xuICAgICAgICAgICAgY21vID0gTW9udGhJZC5uZXh0O1xuICAgICAgICAgICAgbW9udGggPSBtICsgMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgZGF0ZTogSU15RGF0ZSA9IHt5ZWFyOiBjbW8gPT09IE1vbnRoSWQubmV4dCAmJiBtID09PSAxMiA/IHkgKyAxIDogeSwgbW9udGg6IGNtbyA9PT0gTW9udGhJZC5jdXJyID8gbSA6IGNtbyA9PT0gTW9udGhJZC5uZXh0ICYmIG0gPCAxMiA/IG0gKyAxIDogMSwgZGF5OiBkYXlOYnJ9O1xuICAgICAgICAgIHdlZWsucHVzaCh7XG4gICAgICAgICAgICBkYXRlT2JqOiBkYXRlLFxuICAgICAgICAgICAgY21vLFxuICAgICAgICAgICAgY3VyckRheTogdGhpcy5pc0N1cnJEYXkoZGF5TmJyLCBtb250aCwgeSwgdG9kYXkpLFxuICAgICAgICAgICAgZGlzYWJsZWREYXRlOiB0aGlzLnV0aWxTZXJ2aWNlLmlzRGlzYWJsZWREYXRlKGRhdGUsIHRoaXMub3B0cyksXG4gICAgICAgICAgICBtYXJrZWREYXRlOiB0aGlzLnV0aWxTZXJ2aWNlLmlzTWFya2VkRGF0ZShkYXRlLCB0aGlzLm9wdHMpLFxuICAgICAgICAgICAgbGFiZWxlZERhdGU6IHRoaXMudXRpbFNlcnZpY2UuaXNMYWJlbGVkRGF0ZShkYXRlLCB0aGlzLm9wdHMubGFiZWxEYXRlcyksXG4gICAgICAgICAgICBoaWdobGlnaHQ6IHRoaXMudXRpbFNlcnZpY2UuaXNIaWdobGlnaHRlZERhdGUoZGF0ZSwgdGhpcy5vcHRzKSxcbiAgICAgICAgICAgIHJvdzogaSAtIDEsXG4gICAgICAgICAgICBjb2w6IHJ0bCA/IGNvbC0tIDogY29sKytcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBkYXlOYnIrKztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc3Qgd2Vla05icjogbnVtYmVyID0gc2hvd1dlZWtOdW1iZXJzICAmJiBmaXJzdERheU9mV2VlayA9PT0gTU8gPyB0aGlzLnV0aWxTZXJ2aWNlLmdldFdlZWtOdW1iZXIod2Vla1swXS5kYXRlT2JqKSA6IDA7XG4gICAgICB0aGlzLmRhdGVzLnB1c2goe3dlZWssIHdlZWtOYnJ9KTtcbiAgICB9XG5cbiAgICB0aGlzLnNldERhdGVWaWV3SGVhZGVyQnRuRGlzYWJsZWRTdGF0ZShtLCB5KTtcblxuICAgIGlmIChub3RpZnlDaGFuZ2UpIHtcbiAgICAgIC8vIE5vdGlmeSBwYXJlbnRcbiAgICAgIHRoaXMuY2FsZW5kYXJWaWV3Q2hhbmdlZCh7eWVhcjogeSwgbW9udGg6IG0sIGZpcnN0OiB7bnVtYmVyOiAxLCB3ZWVrZGF5OiB0aGlzLmdldFdlZWtkYXkoe3llYXI6IHksIG1vbnRoOiBtLCBkYXk6IDF9KX0sIGxhc3Q6IHtudW1iZXI6IGRJblRoaXNNLCB3ZWVrZGF5OiB0aGlzLmdldFdlZWtkYXkoe3llYXI6IHksIG1vbnRoOiBtLCBkYXk6IGRJblRoaXNNfSl9fSk7XG4gICAgfVxuICB9XG5cbiAgc2V0RGF0ZVZpZXdIZWFkZXJCdG5EaXNhYmxlZFN0YXRlKG06IG51bWJlciwgeTogbnVtYmVyKTogdm9pZCB7XG4gICAgbGV0IGRwbTogYm9vbGVhbiA9IGZhbHNlO1xuICAgIGxldCBkbm06IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIGNvbnN0IHtkaXNhYmxlSGVhZGVyQnV0dG9ucywgZGlzYWJsZVVudGlsLCBkaXNhYmxlU2luY2UsIGVuYWJsZURhdGVzLCBtaW5ZZWFyLCBtYXhZZWFyLCBydGx9ID0gdGhpcy5vcHRzO1xuXG4gICAgaWYgKGRpc2FibGVIZWFkZXJCdXR0b25zKSB7XG4gICAgICBjb25zdCBkdURhdGU6IElNeURhdGUgPSB7eWVhcjogbSA9PT0gMSA/IHkgLSAxIDogeSwgbW9udGg6IG0gPT09IDEgPyAxMiA6IG0gLSAxLCBkYXk6IHRoaXMudXRpbFNlcnZpY2UuZGF0ZXNJbk1vbnRoKG0gPT09IDEgPyAxMiA6IG0gLSAxLCBtID09PSAxID8geSAtIDEgOiB5KX07XG4gICAgICBjb25zdCBkc0RhdGU6IElNeURhdGUgPSB7eWVhcjogbSA9PT0gMTIgPyB5ICsgMSA6IHksIG1vbnRoOiBtID09PSAxMiA/IDEgOiBtICsgMSwgZGF5OiAxfTtcblxuICAgICAgZHBtID0gdGhpcy51dGlsU2VydmljZS5pc0Rpc2FibGVkQnlEaXNhYmxlVW50aWwoZHVEYXRlLCBkaXNhYmxlVW50aWwpXG4gICAgICAgICYmICF0aGlzLnV0aWxTZXJ2aWNlLmlzUGFzdERhdGVzRW5hYmxlZChkdURhdGUsIGVuYWJsZURhdGVzKTtcbiAgICAgIGRubSA9IHRoaXMudXRpbFNlcnZpY2UuaXNEaXNhYmxlZEJ5RGlzYWJsZVNpbmNlKGRzRGF0ZSwgZGlzYWJsZVNpbmNlKVxuICAgICAgICAmJiAhdGhpcy51dGlsU2VydmljZS5pc0Z1dHVyZURhdGVzRW5hYmxlZChkc0RhdGUsIGVuYWJsZURhdGVzKTtcbiAgICB9XG5cbiAgICB0aGlzLnByZXZWaWV3RGlzYWJsZWQgPSBtID09PSAxICYmIHkgPT09IG1pblllYXIgfHwgZHBtO1xuICAgIHRoaXMubmV4dFZpZXdEaXNhYmxlZCA9IG0gPT09IDEyICYmIHkgPT09IG1heFllYXIgfHwgZG5tO1xuXG4gICAgaWYgKHJ0bCkge1xuICAgICAgdGhpcy5zd2FwSGVhZGVyQnRuRGlzYWJsZWQoKTtcbiAgICB9XG4gIH1cblxuICBzZXRNb250aFZpZXdIZWFkZXJCdG5EaXNhYmxlZFN0YXRlKHk6IG51bWJlcik6IHZvaWQge1xuICAgIGxldCBkcG06IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBsZXQgZG5tOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBjb25zdCB7ZGlzYWJsZUhlYWRlckJ1dHRvbnMsIGRpc2FibGVVbnRpbCwgZGlzYWJsZVNpbmNlLCBlbmFibGVEYXRlcywgbWluWWVhciwgbWF4WWVhciwgcnRsfSA9IHRoaXMub3B0cztcblxuICAgIGlmIChkaXNhYmxlSGVhZGVyQnV0dG9ucykge1xuICAgICAgY29uc3QgZHVEYXRlOiBJTXlEYXRlID0ge3llYXI6IHkgLSAxLCBtb250aDogMTIsIGRheTogMzF9O1xuICAgICAgY29uc3QgZHNEYXRlOiBJTXlEYXRlID0ge3llYXI6IHkgKyAxLCBtb250aDogMSwgZGF5OiAxfTtcblxuICAgICAgZHBtID0gdGhpcy51dGlsU2VydmljZS5pc0Rpc2FibGVkQnlEaXNhYmxlVW50aWwoZHVEYXRlLCBkaXNhYmxlVW50aWwpXG4gICAgICAgICYmICF0aGlzLnV0aWxTZXJ2aWNlLmlzUGFzdERhdGVzRW5hYmxlZChkdURhdGUsIGVuYWJsZURhdGVzKTtcbiAgICAgIGRubSA9IHRoaXMudXRpbFNlcnZpY2UuaXNEaXNhYmxlZEJ5RGlzYWJsZVNpbmNlKGRzRGF0ZSwgZGlzYWJsZVNpbmNlKVxuICAgICAgICAmJiAhdGhpcy51dGlsU2VydmljZS5pc0Z1dHVyZURhdGVzRW5hYmxlZChkc0RhdGUsIGVuYWJsZURhdGVzKTtcbiAgICB9XG5cbiAgICB0aGlzLnByZXZWaWV3RGlzYWJsZWQgPSB5ID09PSBtaW5ZZWFyIHx8IGRwbTtcbiAgICB0aGlzLm5leHRWaWV3RGlzYWJsZWQgPSB5ID09PSBtYXhZZWFyIHx8IGRubTtcblxuICAgIGlmIChydGwpIHtcbiAgICAgIHRoaXMuc3dhcEhlYWRlckJ0bkRpc2FibGVkKCk7XG4gICAgfVxuICB9XG5cbiAgc2V0WWVhclZpZXdIZWFkZXJCdG5EaXNhYmxlZFN0YXRlKHlwOiBudW1iZXIsIHluOiBudW1iZXIpOiB2b2lkIHtcbiAgICBsZXQgZHB5OiBib29sZWFuID0gZmFsc2U7XG4gICAgbGV0IGRueTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgY29uc3Qge2Rpc2FibGVIZWFkZXJCdXR0b25zLCBkaXNhYmxlVW50aWwsIGRpc2FibGVTaW5jZSwgZW5hYmxlRGF0ZXMsIG1pblllYXIsIG1heFllYXIsIHJ0bH0gPSB0aGlzLm9wdHM7XG5cbiAgICBpZiAoZGlzYWJsZUhlYWRlckJ1dHRvbnMpIHtcbiAgICAgIGNvbnN0IGR1RGF0ZTogSU15RGF0ZSA9IHt5ZWFyOiB5cCAtIDEsIG1vbnRoOiAxMiwgZGF5OiAzMX07XG4gICAgICBjb25zdCBkc0RhdGU6IElNeURhdGUgPSB7eWVhcjogeW4gKyAxLCBtb250aDogMSwgZGF5OiAxfTtcblxuICAgICAgZHB5ID0gdGhpcy51dGlsU2VydmljZS5pc0Rpc2FibGVkQnlEaXNhYmxlVW50aWwoZHVEYXRlLCBkaXNhYmxlVW50aWwpXG4gICAgICAgICYmICF0aGlzLnV0aWxTZXJ2aWNlLmlzUGFzdERhdGVzRW5hYmxlZChkdURhdGUsIGVuYWJsZURhdGVzKTtcbiAgICAgIGRueSA9IHRoaXMudXRpbFNlcnZpY2UuaXNEaXNhYmxlZEJ5RGlzYWJsZVNpbmNlKGRzRGF0ZSwgZGlzYWJsZVNpbmNlKVxuICAgICAgICAmJiAhdGhpcy51dGlsU2VydmljZS5pc0Z1dHVyZURhdGVzRW5hYmxlZChkc0RhdGUsIGVuYWJsZURhdGVzKTtcbiAgICB9XG4gICAgdGhpcy5wcmV2Vmlld0Rpc2FibGVkID0geXAgPD0gbWluWWVhciB8fCBkcHk7XG4gICAgdGhpcy5uZXh0Vmlld0Rpc2FibGVkID0geW4gPj0gbWF4WWVhciB8fCBkbnk7XG5cbiAgICBpZiAocnRsKSB7XG4gICAgICB0aGlzLnN3YXBIZWFkZXJCdG5EaXNhYmxlZCgpO1xuICAgIH1cbiAgfVxuXG4gIHN3YXBIZWFkZXJCdG5EaXNhYmxlZCgpOiB2b2lkIHtcbiAgICBbdGhpcy5wcmV2Vmlld0Rpc2FibGVkLCB0aGlzLm5leHRWaWV3RGlzYWJsZWRdID0gW3RoaXMubmV4dFZpZXdEaXNhYmxlZCwgdGhpcy5wcmV2Vmlld0Rpc2FibGVkXTtcbiAgfVxufVxuIl19