/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Component, ElementRef, ViewEncapsulation, ViewChild, Renderer2, ChangeDetectorRef, HostBinding } from "@angular/core";
import { UtilService } from "../../services/angular-mydatepicker.util.service";
import { KeyCode } from "../../enums/key-code.enum";
import { MonthId } from "../../enums/month-id.enum";
import { DefaultView } from "../../enums/default-view.enum";
import { CalAnimation } from "../../enums/cal-animation.enum";
import { HeaderAction } from "../../enums/header-action.enum";
import { DOT, UNDER_LINE, D, M, Y, DATE_ROW_COUNT, DATE_COL_COUNT, MONTH_ROW_COUNT, MONTH_COL_COUNT, YEAR_ROW_COUNT, YEAR_COL_COUNT, SU, MO, TU, WE, TH, FR, SA, EMPTY_STR, CLICK, STYLE, MY_DP_ANIMATION, ANIMATION_NAMES, IN, OUT, TABINDEX, TD_SELECTOR, ZERO_STR, YEAR_SEPARATOR } from "../../constants/constants";
var CalendarComponent = /** @class */ (function () {
    function CalendarComponent(elem, renderer, cdr, utilService) {
        var _this = this;
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
        function (event) {
            if ((_this.opts.monthSelector || _this.opts.yearSelector) && event.target) {
                _this.resetMonthYearSelect();
            }
        }));
    }
    /**
     * @return {?}
     */
    CalendarComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        var _a = this.opts, stylesData = _a.stylesData, calendarAnimation = _a.calendarAnimation, inline = _a.inline;
        if (stylesData.styles.length) {
            /** @type {?} */
            var styleElTemp = this.renderer.createElement(STYLE);
            this.renderer.appendChild(styleElTemp, this.renderer.createText(stylesData.styles));
            this.renderer.appendChild(this.styleEl.nativeElement, styleElTemp);
        }
        if (calendarAnimation.in !== CalAnimation.None) {
            this.setCalendarAnimation(calendarAnimation, true);
        }
        if (!inline) {
            this.focusToSelector();
        }
    };
    /**
     * @return {?}
     */
    CalendarComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.clickListener();
    };
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
    CalendarComponent.prototype.initializeComponent = /**
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
    function (opts, defaultMonth, selectedValue, inputValue, selectorPos, dc, cvc, rds, va, cbe) {
        this.opts = opts;
        this.selectorPos = selectorPos;
        this.dateChanged = dc;
        this.calendarViewChanged = cvc;
        this.rangeDateSelection = rds;
        this.viewActivated = va;
        this.closedByEsc = cbe;
        var defaultView = opts.defaultView, firstDayOfWeek = opts.firstDayOfWeek, dayLabels = opts.dayLabels;
        this.weekDays.length = 0;
        this.dayIdx = this.weekDayOpts.indexOf(firstDayOfWeek);
        if (this.dayIdx !== -1) {
            /** @type {?} */
            var idx = this.dayIdx;
            for (var i = 0; i < this.weekDayOpts.length; i++) {
                this.weekDays.push(dayLabels[this.weekDayOpts[idx]]);
                idx = this.weekDayOpts[idx] === SA ? 0 : idx + 1;
            }
        }
        this.initializeView(defaultMonth, selectedValue, inputValue);
        this.setCalendarVisibleMonth();
        this.setDefaultView(defaultView);
    };
    /**
     * @param {?} defaultMonth
     * @param {?} selectedValue
     * @param {?} inputValue
     * @return {?}
     */
    CalendarComponent.prototype.initializeView = /**
     * @param {?} defaultMonth
     * @param {?} selectedValue
     * @param {?} inputValue
     * @return {?}
     */
    function (defaultMonth, selectedValue, inputValue) {
        var dateRange = this.opts.dateRange;
        // use today as a selected month
        /** @type {?} */
        var today = this.utilService.getToday();
        this.selectedMonth = { monthNbr: today.month, year: today.year };
        // If default month attribute valur given use it as a selected month
        var defMonth = defaultMonth.defMonth, overrideSelection = defaultMonth.overrideSelection;
        if (defMonth && defMonth.length) {
            this.selectedMonth = this.utilService.parseDefaultMonth(defMonth);
        }
        /** @type {?} */
        var validateOpts = null;
        if (!dateRange) {
            // Single date mode - If date selected use it as selected month
            validateOpts = { validateDisabledDates: false, selectedValue: this.utilService.getSelectedValue(selectedValue, dateRange) };
            /** @type {?} */
            var date = this.utilService.isDateValid(inputValue, this.opts, validateOpts);
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
            var _a = this.utilService.isDateValidDateRange(inputValue, this.opts, validateOpts), begin = _a.begin, end = _a.end;
            if (this.utilService.isInitializedDate(begin) && this.utilService.isInitializedDate(end)) {
                this.selectedDateRange = { begin: begin, end: end };
                if (!overrideSelection) {
                    this.selectedMonth = { monthNbr: begin.month, year: begin.year };
                }
            }
        }
    };
    /**
     * @param {?} opts
     * @param {?} defaultMonth
     * @param {?} selectedValue
     * @param {?} inputValue
     * @return {?}
     */
    CalendarComponent.prototype.refreshComponent = /**
     * @param {?} opts
     * @param {?} defaultMonth
     * @param {?} selectedValue
     * @param {?} inputValue
     * @return {?}
     */
    function (opts, defaultMonth, selectedValue, inputValue) {
        this.opts = opts;
        var defaultView = opts.defaultView;
        this.initializeView(defaultMonth, selectedValue, inputValue);
        this.setCalendarVisibleMonth();
        this.setDefaultView(defaultView);
    };
    /**
     * @param {?} headerAction
     * @return {?}
     */
    CalendarComponent.prototype.headerAction = /**
     * @param {?} headerAction
     * @return {?}
     */
    function (headerAction) {
        var _a = this.opts, monthSelector = _a.monthSelector, yearSelector = _a.yearSelector;
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
    };
    /**
     * @param {?} defaultView
     * @return {?}
     */
    CalendarComponent.prototype.setDefaultView = /**
     * @param {?} defaultView
     * @return {?}
     */
    function (defaultView) {
        if (defaultView === DefaultView.Month) {
            this.monthViewBtnClicked();
        }
        else if (defaultView === DefaultView.Year) {
            this.yearViewBtnClicked();
        }
    };
    /**
     * @param {?} calAnimation
     * @param {?} isOpen
     * @return {?}
     */
    CalendarComponent.prototype.setCalendarAnimation = /**
     * @param {?} calAnimation
     * @param {?} isOpen
     * @return {?}
     */
    function (calAnimation, isOpen) {
        var nativeElement = this.selectorEl.nativeElement;
        var renderer = this.renderer;
        /** @type {?} */
        var classIn = MY_DP_ANIMATION + ANIMATION_NAMES[calAnimation.in - 1];
        if (isOpen) {
            renderer.addClass(nativeElement, classIn + IN);
        }
        else {
            /** @type {?} */
            var classOut = MY_DP_ANIMATION + ANIMATION_NAMES[calAnimation.out - 1];
            renderer.removeClass(nativeElement, classIn + IN);
            renderer.addClass(nativeElement, classOut + OUT);
        }
    };
    /**
     * @return {?}
     */
    CalendarComponent.prototype.resetDateValue = /**
     * @return {?}
     */
    function () {
        if (!this.opts.dateRange) {
            this.selectedDate = this.utilService.resetDate();
        }
        else {
            this.selectedDateRange.begin = this.utilService.resetDate();
            this.selectedDateRange.end = this.utilService.resetDate();
        }
    };
    /**
     * @return {?}
     */
    CalendarComponent.prototype.clearDate = /**
     * @return {?}
     */
    function () {
        var _a = this.utilService.getToday(), month = _a.month, year = _a.year;
        this.selectedMonth = { monthNbr: month, year: year };
        this.resetDateValue();
        this.setCalendarVisibleMonth();
        this.resetMonthYearSelect();
    };
    /**
     * @return {?}
     */
    CalendarComponent.prototype.resetMonthYearSelect = /**
     * @return {?}
     */
    function () {
        this.selectMonth = false;
        this.selectYear = false;
    };
    /**
     * @return {?}
     */
    CalendarComponent.prototype.onMonthViewBtnClicked = /**
     * @return {?}
     */
    function () {
        this.viewChanged = true;
        this.monthViewBtnClicked();
    };
    /**
     * @return {?}
     */
    CalendarComponent.prototype.monthViewBtnClicked = /**
     * @return {?}
     */
    function () {
        this.selectMonth = !this.selectMonth;
        this.selectYear = false;
        this.cdr.detectChanges();
        if (this.selectMonth) {
            this.generateMonths();
        }
        else {
            var _a = this.selectedMonth, year = _a.year, monthNbr = _a.monthNbr;
            this.visibleMonth = { monthTxt: this.opts.monthLabels[monthNbr], monthNbr: monthNbr, year: year };
            this.generateCalendar(monthNbr, year, true);
        }
    };
    /**
     * @param {?} cell
     * @return {?}
     */
    CalendarComponent.prototype.onMonthCellClicked = /**
     * @param {?} cell
     * @return {?}
     */
    function (cell) {
        this.viewChanged = true;
        var _a = this.visibleMonth, year = _a.year, monthNbr = _a.monthNbr;
        /** @type {?} */
        var monthChange = cell.nbr !== monthNbr;
        this.visibleMonth = { monthTxt: this.opts.monthLabels[cell.nbr], monthNbr: cell.nbr, year: year };
        this.selectedMonth.year = year;
        this.generateCalendar(cell.nbr, year, monthChange);
        this.selectMonth = false;
        this.focusToSelector();
    };
    /**
     * @param {?} event
     * @return {?}
     */
    CalendarComponent.prototype.onMonthCellKeyDown = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        // Move focus by arrow keys
        var _a = this.getSourceRowAndColumnFromEvent(event), sourceRow = _a.sourceRow, sourceCol = _a.sourceCol;
        var _b = this.getTargetFocusRowAndColumn(event, sourceRow, sourceCol, MONTH_ROW_COUNT, MONTH_COL_COUNT), moveFocus = _b.moveFocus, targetRow = _b.targetRow, targetCol = _b.targetCol, direction = _b.direction;
        if (moveFocus) {
            this.focusCellElement(M, targetRow, targetCol, direction, MONTH_COL_COUNT);
        }
    };
    /**
     * @return {?}
     */
    CalendarComponent.prototype.onYearViewBtnClicked = /**
     * @return {?}
     */
    function () {
        this.viewChanged = true;
        this.yearViewBtnClicked();
    };
    /**
     * @return {?}
     */
    CalendarComponent.prototype.yearViewBtnClicked = /**
     * @return {?}
     */
    function () {
        this.selectYear = !this.selectYear;
        this.selectMonth = false;
        this.cdr.detectChanges();
        if (this.selectYear) {
            this.generateYears(this.visibleMonth.year);
        }
        else {
            var _a = this.selectedMonth, year = _a.year, monthNbr = _a.monthNbr;
            this.visibleMonth = { monthTxt: this.opts.monthLabels[monthNbr], monthNbr: monthNbr, year: year };
            this.generateCalendar(monthNbr, year, true);
        }
    };
    /**
     * @param {?} cell
     * @return {?}
     */
    CalendarComponent.prototype.onYearCellClicked = /**
     * @param {?} cell
     * @return {?}
     */
    function (cell) {
        this.viewChanged = true;
        var _a = this.visibleMonth, year = _a.year, monthNbr = _a.monthNbr, monthTxt = _a.monthTxt;
        /** @type {?} */
        var yc = cell.year !== year;
        this.visibleMonth = { monthTxt: monthTxt, monthNbr: monthNbr, year: cell.year };
        this.selectedMonth.year = cell.year;
        this.generateCalendar(monthNbr, cell.year, yc);
        this.selectYear = false;
        this.focusToSelector();
    };
    /**
     * @param {?} event
     * @return {?}
     */
    CalendarComponent.prototype.onYearCellKeyDown = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        // Move focus by arrow keys
        var _a = this.getSourceRowAndColumnFromEvent(event), sourceRow = _a.sourceRow, sourceCol = _a.sourceCol;
        var _b = this.getTargetFocusRowAndColumn(event, sourceRow, sourceCol, YEAR_ROW_COUNT, YEAR_COL_COUNT), moveFocus = _b.moveFocus, targetRow = _b.targetRow, targetCol = _b.targetCol, direction = _b.direction;
        if (moveFocus) {
            this.focusCellElement(Y, targetRow, targetCol, direction, YEAR_COL_COUNT);
        }
    };
    /**
     * @return {?}
     */
    CalendarComponent.prototype.generateMonths = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var today = this.utilService.getToday();
        this.months.length = 0;
        var _a = this.visibleMonth, year = _a.year, monthNbr = _a.monthNbr;
        var _b = this.opts, rtl = _b.rtl, monthLabels = _b.monthLabels;
        /** @type {?} */
        var row = 0;
        for (var i = 1; i <= 12; i += 3) {
            /** @type {?} */
            var rowData = [];
            /** @type {?} */
            var col = rtl ? 2 : 0;
            for (var j = i; j < i + 3; j++) {
                /** @type {?} */
                var disabled = this.utilService.isDisabledMonth(year, j, this.opts);
                rowData.push({
                    nbr: j,
                    name: monthLabels[j],
                    currMonth: j === today.month && year === today.year,
                    selected: j === monthNbr && year === this.selectedMonth.year,
                    disabled: disabled,
                    row: row,
                    col: rtl ? col-- : col++
                });
            }
            row++;
            this.months.push(rowData);
        }
        this.setMonthViewHeaderBtnDisabledState(year);
    };
    /**
     * @param {?} inputYear
     * @return {?}
     */
    CalendarComponent.prototype.generateYears = /**
     * @param {?} inputYear
     * @return {?}
     */
    function (inputYear) {
        var _a = this.opts, minYear = _a.minYear, maxYear = _a.maxYear, rtl = _a.rtl;
        /** @type {?} */
        var y = inputYear - 12;
        if (inputYear < minYear) {
            y = minYear;
        }
        if (inputYear + 25 > maxYear) {
            y = maxYear - 24;
        }
        var year = this.visibleMonth.year;
        this.years.length = 0;
        /** @type {?} */
        var today = this.utilService.getToday();
        /** @type {?} */
        var row = 0;
        for (var i = y; i < y + 25; i += 5) {
            /** @type {?} */
            var rowData = [];
            /** @type {?} */
            var col = rtl ? 4 : 0;
            for (var j = i; j < i + 5; j++) {
                /** @type {?} */
                var disabled = this.utilService.isDisabledYear(j, this.opts);
                rowData.push({
                    year: j,
                    currYear: j === today.year,
                    selected: j === year,
                    disabled: disabled,
                    row: row,
                    col: rtl ? col-- : col++
                });
            }
            row++;
            this.years.push(rowData);
        }
        /** @type {?} */
        var beginYear = this.getYearValueByRowAndCol(0, 0);
        /** @type {?} */
        var endYear = beginYear + 24;
        this.yearsDuration = (!rtl ? beginYear : endYear) + YEAR_SEPARATOR + (!rtl ? endYear : beginYear);
        this.setYearViewHeaderBtnDisabledState(beginYear, endYear);
    };
    /**
     * @return {?}
     */
    CalendarComponent.prototype.onTodayFooterClicked = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var date = this.utilService.getToday();
        this.selectDate(date);
    };
    /**
     * @param {?} row
     * @param {?} col
     * @return {?}
     */
    CalendarComponent.prototype.getYearValueByRowAndCol = /**
     * @param {?} row
     * @param {?} col
     * @return {?}
     */
    function (row, col) {
        var years = this.years;
        if (!years || years.length === 0) {
            var year = this.utilService.getToday().year;
            return year;
        }
        return years[row][col].year;
    };
    /**
     * @return {?}
     */
    CalendarComponent.prototype.setCalendarVisibleMonth = /**
     * @return {?}
     */
    function () {
        // Sets visible month of calendar
        var _a = this.selectedMonth, year = _a.year, monthNbr = _a.monthNbr;
        this.visibleMonth = { monthTxt: this.opts.monthLabels[monthNbr], monthNbr: monthNbr, year: year };
        // Create current month
        this.generateCalendar(monthNbr, year, true);
    };
    /**
     * @param {?} event
     * @return {?}
     */
    CalendarComponent.prototype.onViewActivated = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.viewActivated(event);
    };
    /**
     * @return {?}
     */
    CalendarComponent.prototype.onPrevNavigateBtnClicked = /**
     * @return {?}
     */
    function () {
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
    };
    /**
     * @return {?}
     */
    CalendarComponent.prototype.onNextNavigateBtnClicked = /**
     * @return {?}
     */
    function () {
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
    };
    /**
     * @param {?} isNext
     * @return {?}
     */
    CalendarComponent.prototype.setDateViewMonth = /**
     * @param {?} isNext
     * @return {?}
     */
    function (isNext) {
        /** @type {?} */
        var change = isNext ? 1 : -1;
        var _a = this.visibleMonth, year = _a.year, monthNbr = _a.monthNbr;
        /** @type {?} */
        var d = this.utilService.getJsDate(year, monthNbr, 1);
        d.setMonth(d.getMonth() + change);
        /** @type {?} */
        var y = d.getFullYear();
        /** @type {?} */
        var m = d.getMonth() + 1;
        this.visibleMonth = { monthTxt: this.opts.monthLabels[m], monthNbr: m, year: y };
        this.generateCalendar(m, y, true);
    };
    /**
     * @param {?} event
     * @return {?}
     */
    CalendarComponent.prototype.onCloseSelector = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        /** @type {?} */
        var keyCode = this.utilService.getKeyCodeFromEvent(event);
        if (keyCode === KeyCode.esc) {
            this.closedByEsc();
        }
    };
    /**
     * @param {?} cell
     * @return {?}
     */
    CalendarComponent.prototype.onDayCellClicked = /**
     * @param {?} cell
     * @return {?}
     */
    function (cell) {
        // Cell clicked on the calendar
        this.selectDate(cell.dateObj);
        this.resetMonthYearSelect();
    };
    /**
     * @param {?} event
     * @return {?}
     */
    CalendarComponent.prototype.onDayCellKeyDown = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        // Move focus by arrow keys
        var _a = this.getSourceRowAndColumnFromEvent(event), sourceRow = _a.sourceRow, sourceCol = _a.sourceCol;
        var _b = this.getTargetFocusRowAndColumn(event, sourceRow, sourceCol, DATE_ROW_COUNT, DATE_COL_COUNT), moveFocus = _b.moveFocus, targetRow = _b.targetRow, targetCol = _b.targetCol, direction = _b.direction;
        if (moveFocus) {
            this.focusCellElement(D, targetRow, targetCol, direction, DATE_COL_COUNT);
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    CalendarComponent.prototype.getSourceRowAndColumnFromEvent = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        /** @type {?} */
        var sourceRow = 0;
        /** @type {?} */
        var sourceCol = 0;
        if (event.target && event.target.id) {
            // value of id is for example: m_0_1 (first number = row, second number = column)
            /** @type {?} */
            var arr = event.target.id.split(UNDER_LINE);
            sourceRow = Number(arr[1]);
            sourceCol = Number(arr[2]);
        }
        return { sourceRow: sourceRow, sourceCol: sourceCol };
    };
    /**
     * @param {?} event
     * @param {?} row
     * @param {?} col
     * @param {?} rowCount
     * @param {?} colCount
     * @return {?}
     */
    CalendarComponent.prototype.getTargetFocusRowAndColumn = /**
     * @param {?} event
     * @param {?} row
     * @param {?} col
     * @param {?} rowCount
     * @param {?} colCount
     * @return {?}
     */
    function (event, row, col, rowCount, colCount) {
        /** @type {?} */
        var moveFocus = true;
        /** @type {?} */
        var targetRow = row;
        /** @type {?} */
        var targetCol = col;
        /** @type {?} */
        var direction = false;
        /** @type {?} */
        var keyCode = this.utilService.getKeyCodeFromEvent(event);
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
        return { moveFocus: moveFocus, targetRow: targetRow, targetCol: targetCol, direction: direction };
    };
    /**
     * @param {?} type
     * @param {?} row
     * @param {?} col
     * @param {?} direction
     * @param {?} colCount
     * @return {?}
     */
    CalendarComponent.prototype.focusCellElement = /**
     * @param {?} type
     * @param {?} row
     * @param {?} col
     * @param {?} direction
     * @param {?} colCount
     * @return {?}
     */
    function (type, row, col, direction, colCount) {
        /** @type {?} */
        var className = type + UNDER_LINE + row + UNDER_LINE + col;
        /** @type {?} */
        var elem = this.selectorEl.nativeElement.querySelector(DOT + className);
        if (elem.getAttribute(TABINDEX) !== ZERO_STR) {
            // if the selected element is disabled move a focus to next/previous enabled element
            /** @type {?} */
            var tdList = this.getCalendarElements();
            /** @type {?} */
            var idx = row * (colCount + 1) + col;
            /** @type {?} */
            var enabledElem = null;
            if (direction) {
                // find next enabled
                enabledElem = tdList.slice(idx).find((/**
                 * @param {?} td
                 * @return {?}
                 */
                function (td) { return td.getAttribute(TABINDEX) === ZERO_STR; }));
            }
            else {
                // find previous enabled
                enabledElem = tdList.slice(0, idx).reverse().find((/**
                 * @param {?} td
                 * @return {?}
                 */
                function (td) { return td.getAttribute(TABINDEX) === ZERO_STR; }));
            }
            elem = enabledElem ? enabledElem : this.selectorEl.nativeElement;
        }
        else {
            elem.focus();
        }
    };
    /**
     * @return {?}
     */
    CalendarComponent.prototype.focusToSelector = /**
     * @return {?}
     */
    function () {
        this.selectorEl.nativeElement.focus();
    };
    /**
     * @return {?}
     */
    CalendarComponent.prototype.getCalendarElements = /**
     * @return {?}
     */
    function () {
        return Array.from(this.selectorEl.nativeElement.querySelectorAll(TD_SELECTOR));
    };
    /**
     * @param {?} date
     * @return {?}
     */
    CalendarComponent.prototype.selectDate = /**
     * @param {?} date
     * @return {?}
     */
    function (date) {
        var _a = this.opts, dateRange = _a.dateRange, dateFormat = _a.dateFormat, monthLabels = _a.monthLabels, dateRangeDatesDelimiter = _a.dateRangeDatesDelimiter, closeSelectorOnDateSelect = _a.closeSelectorOnDateSelect;
        if (dateRange) {
            // Date range
            /** @type {?} */
            var isBeginDateInitialized = this.utilService.isInitializedDate(this.selectedDateRange.begin);
            /** @type {?} */
            var isEndDateInitialized = this.utilService.isInitializedDate(this.selectedDateRange.end);
            if (isBeginDateInitialized && isEndDateInitialized) {
                // both already selected - set begin date and reset end date
                this.selectedDateRange.begin = date;
                this.selectedDateRange.end = this.utilService.resetDate();
                this.rangeDateSelection({
                    isBegin: true,
                    date: date,
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
                    date: date,
                    jsDate: this.utilService.myDateToJsDate(date),
                    dateFormat: dateFormat,
                    formatted: this.utilService.formatDate(date, dateFormat, monthLabels),
                    epoc: this.utilService.getEpocTime(date)
                });
            }
            else {
                // second selection
                /** @type {?} */
                var firstDateEarlier = this.utilService.isDateEarlier(date, this.selectedDateRange.begin);
                if (firstDateEarlier) {
                    this.selectedDateRange.begin = date;
                    this.rangeDateSelection({
                        isBegin: true,
                        date: date,
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
                        date: date,
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
    };
    /**
     * @param {?} y
     * @param {?} m
     * @return {?}
     */
    CalendarComponent.prototype.monthStartIdx = /**
     * @param {?} y
     * @param {?} m
     * @return {?}
     */
    function (y, m) {
        // Month start index
        /** @type {?} */
        var d = new Date();
        d.setDate(1);
        d.setMonth(m - 1);
        d.setFullYear(y);
        /** @type {?} */
        var idx = d.getDay() + this.sundayIdx();
        return idx >= 7 ? idx - 7 : idx;
    };
    /**
     * @param {?} d
     * @param {?} m
     * @param {?} y
     * @param {?} today
     * @return {?}
     */
    CalendarComponent.prototype.isCurrDay = /**
     * @param {?} d
     * @param {?} m
     * @param {?} y
     * @param {?} today
     * @return {?}
     */
    function (d, m, y, today) {
        // Check is a given date the today
        return d === today.day && m === today.month && y === today.year;
    };
    /**
     * @param {?} date
     * @return {?}
     */
    CalendarComponent.prototype.getDayNumber = /**
     * @param {?} date
     * @return {?}
     */
    function (date) {
        // Get day number: su=0, mo=1, tu=2, we=3 ...
        var year = date.year, month = date.month, day = date.day;
        /** @type {?} */
        var d = this.utilService.getJsDate(year, month, day);
        return d.getDay();
    };
    /**
     * @param {?} date
     * @return {?}
     */
    CalendarComponent.prototype.getWeekday = /**
     * @param {?} date
     * @return {?}
     */
    function (date) {
        // Get weekday: su, mo, tu, we ...
        return this.weekDayOpts[this.getDayNumber(date)];
    };
    /**
     * @return {?}
     */
    CalendarComponent.prototype.sundayIdx = /**
     * @return {?}
     */
    function () {
        // Index of Sunday day
        return this.dayIdx > 0 ? 7 - this.dayIdx : 0;
    };
    /**
     * @param {?} m
     * @param {?} y
     * @param {?} notifyChange
     * @return {?}
     */
    CalendarComponent.prototype.generateCalendar = /**
     * @param {?} m
     * @param {?} y
     * @param {?} notifyChange
     * @return {?}
     */
    function (m, y, notifyChange) {
        this.dates.length = 0;
        /** @type {?} */
        var today = this.utilService.getToday();
        /** @type {?} */
        var monthStart = this.monthStartIdx(y, m);
        /** @type {?} */
        var dInThisM = this.utilService.datesInMonth(m, y);
        /** @type {?} */
        var dInPrevM = this.utilService.datesInPrevMonth(m, y);
        /** @type {?} */
        var dayNbr = 1;
        /** @type {?} */
        var month = m;
        /** @type {?} */
        var cmo = MonthId.prev;
        var _a = this.opts, rtl = _a.rtl, showWeekNumbers = _a.showWeekNumbers, firstDayOfWeek = _a.firstDayOfWeek;
        for (var i = 1; i < 7; i++) {
            /** @type {?} */
            var col = rtl ? 6 : 0;
            /** @type {?} */
            var week = [];
            if (i === 1) {
                // First week
                /** @type {?} */
                var pm = dInPrevM - monthStart + 1;
                // Previous month
                for (var j = pm; j <= dInPrevM; j++) {
                    /** @type {?} */
                    var date = { year: m === 1 ? y - 1 : y, month: m === 1 ? 12 : m - 1, day: j };
                    week.push({
                        dateObj: date,
                        cmo: cmo,
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
                var daysLeft = 7 - week.length;
                for (var j = 0; j < daysLeft; j++) {
                    /** @type {?} */
                    var date = { year: y, month: m, day: dayNbr };
                    week.push({
                        dateObj: date,
                        cmo: cmo,
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
                for (var j = 1; j < 8; j++) {
                    if (dayNbr > dInThisM) {
                        // Next month
                        dayNbr = 1;
                        cmo = MonthId.next;
                        month = m + 1;
                    }
                    /** @type {?} */
                    var date = { year: cmo === MonthId.next && m === 12 ? y + 1 : y, month: cmo === MonthId.curr ? m : cmo === MonthId.next && m < 12 ? m + 1 : 1, day: dayNbr };
                    week.push({
                        dateObj: date,
                        cmo: cmo,
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
            var weekNbr = showWeekNumbers && firstDayOfWeek === MO ? this.utilService.getWeekNumber(week[0].dateObj) : 0;
            this.dates.push({ week: week, weekNbr: weekNbr });
        }
        this.setDateViewHeaderBtnDisabledState(m, y);
        if (notifyChange) {
            // Notify parent
            this.calendarViewChanged({ year: y, month: m, first: { number: 1, weekday: this.getWeekday({ year: y, month: m, day: 1 }) }, last: { number: dInThisM, weekday: this.getWeekday({ year: y, month: m, day: dInThisM }) } });
        }
    };
    /**
     * @param {?} m
     * @param {?} y
     * @return {?}
     */
    CalendarComponent.prototype.setDateViewHeaderBtnDisabledState = /**
     * @param {?} m
     * @param {?} y
     * @return {?}
     */
    function (m, y) {
        /** @type {?} */
        var dpm = false;
        /** @type {?} */
        var dnm = false;
        var _a = this.opts, disableHeaderButtons = _a.disableHeaderButtons, disableUntil = _a.disableUntil, disableSince = _a.disableSince, enableDates = _a.enableDates, minYear = _a.minYear, maxYear = _a.maxYear, rtl = _a.rtl;
        if (disableHeaderButtons) {
            /** @type {?} */
            var duDate = { year: m === 1 ? y - 1 : y, month: m === 1 ? 12 : m - 1, day: this.utilService.datesInMonth(m === 1 ? 12 : m - 1, m === 1 ? y - 1 : y) };
            /** @type {?} */
            var dsDate = { year: m === 12 ? y + 1 : y, month: m === 12 ? 1 : m + 1, day: 1 };
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
    };
    /**
     * @param {?} y
     * @return {?}
     */
    CalendarComponent.prototype.setMonthViewHeaderBtnDisabledState = /**
     * @param {?} y
     * @return {?}
     */
    function (y) {
        /** @type {?} */
        var dpm = false;
        /** @type {?} */
        var dnm = false;
        var _a = this.opts, disableHeaderButtons = _a.disableHeaderButtons, disableUntil = _a.disableUntil, disableSince = _a.disableSince, enableDates = _a.enableDates, minYear = _a.minYear, maxYear = _a.maxYear, rtl = _a.rtl;
        if (disableHeaderButtons) {
            /** @type {?} */
            var duDate = { year: y - 1, month: 12, day: 31 };
            /** @type {?} */
            var dsDate = { year: y + 1, month: 1, day: 1 };
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
    };
    /**
     * @param {?} yp
     * @param {?} yn
     * @return {?}
     */
    CalendarComponent.prototype.setYearViewHeaderBtnDisabledState = /**
     * @param {?} yp
     * @param {?} yn
     * @return {?}
     */
    function (yp, yn) {
        /** @type {?} */
        var dpy = false;
        /** @type {?} */
        var dny = false;
        var _a = this.opts, disableHeaderButtons = _a.disableHeaderButtons, disableUntil = _a.disableUntil, disableSince = _a.disableSince, enableDates = _a.enableDates, minYear = _a.minYear, maxYear = _a.maxYear, rtl = _a.rtl;
        if (disableHeaderButtons) {
            /** @type {?} */
            var duDate = { year: yp - 1, month: 12, day: 31 };
            /** @type {?} */
            var dsDate = { year: yn + 1, month: 1, day: 1 };
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
    };
    /**
     * @return {?}
     */
    CalendarComponent.prototype.swapHeaderBtnDisabled = /**
     * @return {?}
     */
    function () {
        var _a;
        _a = tslib_1.__read([this.nextViewDisabled, this.prevViewDisabled], 2), this.prevViewDisabled = _a[0], this.nextViewDisabled = _a[1];
    };
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
    CalendarComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: ChangeDetectorRef },
        { type: UtilService }
    ]; };
    CalendarComponent.propDecorators = {
        selectorEl: [{ type: ViewChild, args: ["selectorEl",] }],
        styleEl: [{ type: ViewChild, args: ["styleEl",] }],
        position: [{ type: HostBinding, args: ["style.position",] }]
    };
    return CalendarComponent;
}());
export { CalendarComponent };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci10cmFkZWRhdGVwaWNrZXIvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9jYWxlbmRhci9jYWxlbmRhci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxpQkFBaUIsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLGlCQUFpQixFQUE0QixXQUFXLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFnQnZKLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxrREFBa0QsQ0FBQztBQUM3RSxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sMkJBQTJCLENBQUM7QUFDbEQsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLDJCQUEyQixDQUFDO0FBQ2xELE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSwrQkFBK0IsQ0FBQztBQUMxRCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sZ0NBQWdDLENBQUM7QUFDNUQsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGdDQUFnQyxDQUFDO0FBRTVELE9BQU8sRUFBQyxHQUFHLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsZUFBZSxFQUFFLGVBQWUsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUNoSSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsZUFBZSxFQUFFLGVBQWUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLGNBQWMsRUFBQyxNQUFNLDJCQUEyQixDQUFDO0FBRXBMO0lBNENFLDJCQUFvQixJQUFnQixFQUFVLFFBQW1C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QUFFLHFDQUEyQjs7Ozs7SUFBRSxnQ0FBOEI7Ozs7O0lBQUUsd0NBQWdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wb25lbnQsIEVsZW1lbnRSZWYsIFZpZXdFbmNhcHN1bGF0aW9uLCBWaWV3Q2hpbGQsIFJlbmRlcmVyMiwgQ2hhbmdlRGV0ZWN0b3JSZWYsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSwgSG9zdEJpbmRpbmd9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQge0lNeURhdGV9IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL215LWRhdGUuaW50ZXJmYWNlXCI7XG5pbXBvcnQge0lNeURhdGVSYW5nZX0gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvbXktZGF0ZS1yYW5nZS5pbnRlcmZhY2VcIjtcbmltcG9ydCB7SU15TW9udGh9IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL215LW1vbnRoLmludGVyZmFjZVwiO1xuaW1wb3J0IHtJTXlDYWxlbmRhckRheX0gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvbXktY2FsZW5kYXItZGF5LmludGVyZmFjZVwiO1xuaW1wb3J0IHtJTXlDYWxlbmRhck1vbnRofSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9teS1jYWxlbmRhci1tb250aC5pbnRlcmZhY2VcIjtcbmltcG9ydCB7SU15Q2FsZW5kYXJZZWFyfSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9teS1jYWxlbmRhci15ZWFyLmludGVyZmFjZVwiO1xuaW1wb3J0IHtJTXlXZWVrfSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9teS13ZWVrLmludGVyZmFjZVwiO1xuaW1wb3J0IHtJTXlPcHRpb25zfSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9teS1vcHRpb25zLmludGVyZmFjZVwiO1xuaW1wb3J0IHtJTXlTZWxlY3RvclBvc2l0aW9ufSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9teS1zZWxlY3Rvci1wb3MuaW50ZXJmYWNlXCI7XG5pbXBvcnQge0lNeUNhbGVuZGFyVmlld0NoYW5nZWR9IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL215LWNhbGVuZGFyLXZpZXctY2hhbmdlZC5pbnRlcmZhY2VcIjtcbmltcG9ydCB7SU15RGF0ZU1vZGVsfSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9teS1kYXRlLW1vZGVsLmludGVyZmFjZVwiO1xuaW1wb3J0IHtJTXlSYW5nZURhdGVTZWxlY3Rpb259IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL215LXJhbmdlLWRhdGUtc2VsZWN0aW9uLmludGVyZmFjZVwiO1xuaW1wb3J0IHtJTXlDYWxlbmRhckFuaW1hdGlvbn0gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvbXktY2FsZW5kYXItYW5pbWF0aW9uLmludGVyZmFjZVwiO1xuaW1wb3J0IHtJTXlWYWxpZGF0ZU9wdGlvbnN9IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL215LXZhbGlkYXRlLW9wdGlvbnMuaW50ZXJmYWNlXCI7XG5pbXBvcnQge0lNeURlZmF1bHRNb250aH0gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvbXktZGVmYXVsdC1tb250aC5pbnRlcmZhY2VcIjtcbmltcG9ydCB7VXRpbFNlcnZpY2V9IGZyb20gXCIuLi8uLi9zZXJ2aWNlcy9hbmd1bGFyLW15ZGF0ZXBpY2tlci51dGlsLnNlcnZpY2VcIjtcbmltcG9ydCB7S2V5Q29kZX0gZnJvbSBcIi4uLy4uL2VudW1zL2tleS1jb2RlLmVudW1cIjtcbmltcG9ydCB7TW9udGhJZH0gZnJvbSBcIi4uLy4uL2VudW1zL21vbnRoLWlkLmVudW1cIjtcbmltcG9ydCB7RGVmYXVsdFZpZXd9IGZyb20gXCIuLi8uLi9lbnVtcy9kZWZhdWx0LXZpZXcuZW51bVwiO1xuaW1wb3J0IHtDYWxBbmltYXRpb259IGZyb20gXCIuLi8uLi9lbnVtcy9jYWwtYW5pbWF0aW9uLmVudW1cIjtcbmltcG9ydCB7SGVhZGVyQWN0aW9ufSBmcm9tIFwiLi4vLi4vZW51bXMvaGVhZGVyLWFjdGlvbi5lbnVtXCI7XG5pbXBvcnQge0FjdGl2ZVZpZXd9IGZyb20gXCIuLi8uLi9lbnVtcy9hY3RpdmUtdmlldy5lbnVtXCI7XG5pbXBvcnQge0RPVCwgVU5ERVJfTElORSwgRCwgTSwgWSwgREFURV9ST1dfQ09VTlQsIERBVEVfQ09MX0NPVU5ULCBNT05USF9ST1dfQ09VTlQsIE1PTlRIX0NPTF9DT1VOVCwgWUVBUl9ST1dfQ09VTlQsIFlFQVJfQ09MX0NPVU5ULFxuICBTVSwgTU8sIFRVLCBXRSwgVEgsIEZSLCBTQSwgRU1QVFlfU1RSLCBDTElDSywgU1RZTEUsIE1ZX0RQX0FOSU1BVElPTiwgQU5JTUFUSU9OX05BTUVTLCBJTiwgT1VULCBUQUJJTkRFWCwgVERfU0VMRUNUT1IsIFpFUk9fU1RSLCBZRUFSX1NFUEFSQVRPUn0gZnJvbSBcIi4uLy4uL2NvbnN0YW50cy9jb25zdGFudHNcIjtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiBcImxpYi1hbmd1bGFyLW15ZGF0ZXBpY2tlci1jYWxlbmRhclwiLFxuICB0ZW1wbGF0ZVVybDogJy4vY2FsZW5kYXIuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi4vLi4vY3NzL2FuZ3VsYXItbXlkYXRlcGlja2VyLnN0eWxlLmNzcyddLFxuICBwcm92aWRlcnM6IFtVdGlsU2VydmljZV0sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcbn0pXG5leHBvcnQgY2xhc3MgQ2FsZW5kYXJDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuICBAVmlld0NoaWxkKFwic2VsZWN0b3JFbFwiKSBzZWxlY3RvckVsOiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKFwic3R5bGVFbFwiKSBzdHlsZUVsOiBFbGVtZW50UmVmO1xuXG4gIEBIb3N0QmluZGluZyhcInN0eWxlLnBvc2l0aW9uXCIpIHBvc2l0aW9uID0gXCJzdGF0aWNcIjtcblxuICBvcHRzOiBJTXlPcHRpb25zO1xuICB2aXNpYmxlTW9udGg6IElNeU1vbnRoID0ge21vbnRoVHh0OiBFTVBUWV9TVFIsIG1vbnRoTmJyOiAwLCB5ZWFyOiAwfTtcbiAgc2VsZWN0ZWRNb250aDogSU15TW9udGggPSB7bW9udGhOYnI6IDAsIHllYXI6IDB9O1xuICBzZWxlY3RlZERhdGU6IElNeURhdGUgPSB7eWVhcjogMCwgbW9udGg6IDAsIGRheTogMH07XG4gIHNlbGVjdGVkRGF0ZVJhbmdlOiBJTXlEYXRlUmFuZ2UgPSB7YmVnaW46IHt5ZWFyOiAwLCBtb250aDogMCwgZGF5OiAwfSwgZW5kOiB7eWVhcjogMCwgbW9udGg6IDAsIGRheTogMH19O1xuICB3ZWVrRGF5czogQXJyYXk8c3RyaW5nPiA9IFtdO1xuICBkYXRlczogQXJyYXk8SU15V2Vlaz4gPSBbXTtcbiAgbW9udGhzOiBBcnJheTxBcnJheTxJTXlDYWxlbmRhck1vbnRoPj4gPSBbXTtcbiAgeWVhcnM6IEFycmF5PEFycmF5PElNeUNhbGVuZGFyWWVhcj4+ID0gW107XG4gIHllYXJzRHVyYXRpb246IHN0cmluZyA9IFwiXCI7XG4gIGRheUlkeDogbnVtYmVyID0gMDtcbiAgd2Vla0RheU9wdHM6IEFycmF5PHN0cmluZz4gPSBbU1UsIE1PLCBUVSwgV0UsIFRILCBGUiwgU0FdO1xuXG4gIHNlbGVjdE1vbnRoOiBib29sZWFuID0gZmFsc2U7XG4gIHNlbGVjdFllYXI6IGJvb2xlYW4gPSBmYWxzZTtcblxuICB2aWV3Q2hhbmdlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIGRhdGVDaGFuZ2VkOiAoZG06IElNeURhdGVNb2RlbCwgY2xvc2U6IGJvb2xlYW4pID0+IHZvaWQ7XG4gIGNhbGVuZGFyVmlld0NoYW5nZWQ6IChjdmM6IElNeUNhbGVuZGFyVmlld0NoYW5nZWQpID0+IHZvaWQ7XG4gIHJhbmdlRGF0ZVNlbGVjdGlvbjogKHJkczogSU15UmFuZ2VEYXRlU2VsZWN0aW9uKSA9PiB2b2lkO1xuICB2aWV3QWN0aXZhdGVkOiAodmE6IEFjdGl2ZVZpZXcpID0+IHZvaWQ7XG4gIGNsb3NlZEJ5RXNjOiAoKSA9PiB2b2lkO1xuXG4gIHNlbGVjdG9yUG9zOiBJTXlTZWxlY3RvclBvc2l0aW9uID0gbnVsbDtcblxuICBwcmV2Vmlld0Rpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG4gIG5leHRWaWV3RGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBjbGlja0xpc3RlbmVyOiAoKSA9PiB2b2lkO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZWxlbTogRWxlbWVudFJlZiwgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLCBwcml2YXRlIGNkcjogQ2hhbmdlRGV0ZWN0b3JSZWYsIHByaXZhdGUgdXRpbFNlcnZpY2U6IFV0aWxTZXJ2aWNlKSB7XG4gICAgdGhpcy5jbGlja0xpc3RlbmVyID0gcmVuZGVyZXIubGlzdGVuKGVsZW0ubmF0aXZlRWxlbWVudCwgQ0xJQ0ssIChldmVudDogYW55KSA9PiB7XG4gICAgICBpZiAoKHRoaXMub3B0cy5tb250aFNlbGVjdG9yIHx8IHRoaXMub3B0cy55ZWFyU2VsZWN0b3IpICYmIGV2ZW50LnRhcmdldCkge1xuICAgICAgICB0aGlzLnJlc2V0TW9udGhZZWFyU2VsZWN0KCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgY29uc3Qge3N0eWxlc0RhdGEsIGNhbGVuZGFyQW5pbWF0aW9uLCBpbmxpbmV9ID0gdGhpcy5vcHRzO1xuXG4gICAgaWYgKHN0eWxlc0RhdGEuc3R5bGVzLmxlbmd0aCkge1xuICAgICAgY29uc3Qgc3R5bGVFbFRlbXA6IGFueSA9IHRoaXMucmVuZGVyZXIuY3JlYXRlRWxlbWVudChTVFlMRSk7XG4gICAgICB0aGlzLnJlbmRlcmVyLmFwcGVuZENoaWxkKHN0eWxlRWxUZW1wLCB0aGlzLnJlbmRlcmVyLmNyZWF0ZVRleHQoc3R5bGVzRGF0YS5zdHlsZXMpKTtcbiAgICAgIHRoaXMucmVuZGVyZXIuYXBwZW5kQ2hpbGQodGhpcy5zdHlsZUVsLm5hdGl2ZUVsZW1lbnQsIHN0eWxlRWxUZW1wKTtcbiAgICB9XG5cbiAgICBpZiAoY2FsZW5kYXJBbmltYXRpb24uaW4gIT09IENhbEFuaW1hdGlvbi5Ob25lKSB7XG4gICAgICB0aGlzLnNldENhbGVuZGFyQW5pbWF0aW9uKGNhbGVuZGFyQW5pbWF0aW9uLCB0cnVlKTtcbiAgICB9XG5cbiAgICBpZiAoIWlubGluZSkge1xuICAgICAgdGhpcy5mb2N1c1RvU2VsZWN0b3IoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLmNsaWNrTGlzdGVuZXIoKTtcbiAgfVxuXG4gIGluaXRpYWxpemVDb21wb25lbnQob3B0czogSU15T3B0aW9ucywgZGVmYXVsdE1vbnRoOiBJTXlEZWZhdWx0TW9udGgsIHNlbGVjdGVkVmFsdWU6IGFueSwgaW5wdXRWYWx1ZTogc3RyaW5nLCBzZWxlY3RvclBvczogSU15U2VsZWN0b3JQb3NpdGlvbiwgZGM6IChkbTogSU15RGF0ZU1vZGVsLCBjbG9zZTogYm9vbGVhbikgPT4gdm9pZCwgY3ZjOiAoY3ZjOiBJTXlDYWxlbmRhclZpZXdDaGFuZ2VkKSA9PiB2b2lkLCByZHM6IChyZHM6IElNeVJhbmdlRGF0ZVNlbGVjdGlvbikgPT4gdm9pZCwgdmE6ICh2YTogQWN0aXZlVmlldykgPT4gdm9pZCwgY2JlOiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5vcHRzID0gb3B0cztcbiAgICB0aGlzLnNlbGVjdG9yUG9zID0gc2VsZWN0b3JQb3M7XG5cbiAgICB0aGlzLmRhdGVDaGFuZ2VkID0gZGM7XG4gICAgdGhpcy5jYWxlbmRhclZpZXdDaGFuZ2VkID0gY3ZjO1xuICAgIHRoaXMucmFuZ2VEYXRlU2VsZWN0aW9uID0gcmRzO1xuICAgIHRoaXMudmlld0FjdGl2YXRlZCA9IHZhO1xuICAgIHRoaXMuY2xvc2VkQnlFc2MgPSBjYmU7XG5cbiAgICBjb25zdCB7ZGVmYXVsdFZpZXcsIGZpcnN0RGF5T2ZXZWVrLCBkYXlMYWJlbHN9ID0gb3B0cztcblxuICAgIHRoaXMud2Vla0RheXMubGVuZ3RoID0gMDtcbiAgICB0aGlzLmRheUlkeCA9IHRoaXMud2Vla0RheU9wdHMuaW5kZXhPZihmaXJzdERheU9mV2Vlayk7XG4gICAgaWYgKHRoaXMuZGF5SWR4ICE9PSAtMSkge1xuICAgICAgbGV0IGlkeDogbnVtYmVyID0gdGhpcy5kYXlJZHg7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMud2Vla0RheU9wdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy53ZWVrRGF5cy5wdXNoKGRheUxhYmVsc1t0aGlzLndlZWtEYXlPcHRzW2lkeF1dKTtcbiAgICAgICAgaWR4ID0gdGhpcy53ZWVrRGF5T3B0c1tpZHhdID09PSBTQSA/IDAgOiBpZHggKyAxO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuaW5pdGlhbGl6ZVZpZXcoZGVmYXVsdE1vbnRoLCBzZWxlY3RlZFZhbHVlLCBpbnB1dFZhbHVlKTtcbiAgICB0aGlzLnNldENhbGVuZGFyVmlzaWJsZU1vbnRoKCk7XG4gICAgdGhpcy5zZXREZWZhdWx0VmlldyhkZWZhdWx0Vmlldyk7XG4gIH1cblxuICBpbml0aWFsaXplVmlldyhkZWZhdWx0TW9udGg6IElNeURlZmF1bHRNb250aCwgc2VsZWN0ZWRWYWx1ZTogYW55LCBpbnB1dFZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCB7ZGF0ZVJhbmdlfSA9IHRoaXMub3B0cztcblxuICAgIC8vIHVzZSB0b2RheSBhcyBhIHNlbGVjdGVkIG1vbnRoXG4gICAgY29uc3QgdG9kYXk6IElNeURhdGUgPSB0aGlzLnV0aWxTZXJ2aWNlLmdldFRvZGF5KCk7XG4gICAgdGhpcy5zZWxlY3RlZE1vbnRoID0ge21vbnRoTmJyOiB0b2RheS5tb250aCwgeWVhcjogdG9kYXkueWVhcn07XG5cbiAgICAvLyBJZiBkZWZhdWx0IG1vbnRoIGF0dHJpYnV0ZSB2YWx1ciBnaXZlbiB1c2UgaXQgYXMgYSBzZWxlY3RlZCBtb250aFxuICAgIGNvbnN0IHtkZWZNb250aCwgb3ZlcnJpZGVTZWxlY3Rpb259ID0gZGVmYXVsdE1vbnRoO1xuICAgIGlmIChkZWZNb250aCAmJiBkZWZNb250aC5sZW5ndGgpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWRNb250aCA9IHRoaXMudXRpbFNlcnZpY2UucGFyc2VEZWZhdWx0TW9udGgoZGVmTW9udGgpO1xuICAgIH1cblxuICAgIGxldCB2YWxpZGF0ZU9wdHM6IElNeVZhbGlkYXRlT3B0aW9ucyA9IG51bGw7XG4gICAgaWYgKCFkYXRlUmFuZ2UpIHtcbiAgICAgIC8vIFNpbmdsZSBkYXRlIG1vZGUgLSBJZiBkYXRlIHNlbGVjdGVkIHVzZSBpdCBhcyBzZWxlY3RlZCBtb250aFxuICAgICAgdmFsaWRhdGVPcHRzID0ge3ZhbGlkYXRlRGlzYWJsZWREYXRlczogZmFsc2UsIHNlbGVjdGVkVmFsdWU6IHRoaXMudXRpbFNlcnZpY2UuZ2V0U2VsZWN0ZWRWYWx1ZShzZWxlY3RlZFZhbHVlLCBkYXRlUmFuZ2UpfTtcbiAgICAgIGNvbnN0IGRhdGU6IElNeURhdGUgPSB0aGlzLnV0aWxTZXJ2aWNlLmlzRGF0ZVZhbGlkKGlucHV0VmFsdWUsIHRoaXMub3B0cywgdmFsaWRhdGVPcHRzKTtcblxuICAgICAgaWYgKHRoaXMudXRpbFNlcnZpY2UuaXNJbml0aWFsaXplZERhdGUoZGF0ZSkpIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZERhdGUgPSBkYXRlO1xuICAgICAgICBpZiAoIW92ZXJyaWRlU2VsZWN0aW9uKSB7XG4gICAgICAgICAgdGhpcy5zZWxlY3RlZE1vbnRoID0ge21vbnRoTmJyOiBkYXRlLm1vbnRoLCB5ZWFyOiBkYXRlLnllYXJ9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgLy8gRGF0ZSByYW5nZSBtb2RlIC0gSWYgZGF0ZSByYW5nZSBzZWxlY3RlZCB1c2UgYmVnaW4gZGF0ZSBhcyBzZWxlY3RlZCBtb250aFxuICAgICAgdmFsaWRhdGVPcHRzID0ge3ZhbGlkYXRlRGlzYWJsZWREYXRlczogZmFsc2UsIHNlbGVjdGVkVmFsdWU6IHRoaXMudXRpbFNlcnZpY2UuZ2V0U2VsZWN0ZWRWYWx1ZShzZWxlY3RlZFZhbHVlLCBkYXRlUmFuZ2UpfTtcbiAgICAgIGNvbnN0IHtiZWdpbiwgZW5kfSA9IHRoaXMudXRpbFNlcnZpY2UuaXNEYXRlVmFsaWREYXRlUmFuZ2UoaW5wdXRWYWx1ZSwgdGhpcy5vcHRzLCB2YWxpZGF0ZU9wdHMpO1xuXG4gICAgICBpZiAodGhpcy51dGlsU2VydmljZS5pc0luaXRpYWxpemVkRGF0ZShiZWdpbikgJiYgdGhpcy51dGlsU2VydmljZS5pc0luaXRpYWxpemVkRGF0ZShlbmQpKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWREYXRlUmFuZ2UgPSB7YmVnaW4sIGVuZH07XG4gICAgICAgIGlmICghb3ZlcnJpZGVTZWxlY3Rpb24pIHtcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkTW9udGggPSB7bW9udGhOYnI6IGJlZ2luLm1vbnRoLCB5ZWFyOiBiZWdpbi55ZWFyfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlZnJlc2hDb21wb25lbnQob3B0czogSU15T3B0aW9ucywgZGVmYXVsdE1vbnRoOiBJTXlEZWZhdWx0TW9udGgsIHNlbGVjdGVkVmFsdWU6IGFueSwgaW5wdXRWYWx1ZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5vcHRzID0gb3B0cztcblxuICAgIGNvbnN0IHtkZWZhdWx0Vmlld30gPSBvcHRzO1xuXG4gICAgdGhpcy5pbml0aWFsaXplVmlldyhkZWZhdWx0TW9udGgsIHNlbGVjdGVkVmFsdWUsIGlucHV0VmFsdWUpO1xuICAgIHRoaXMuc2V0Q2FsZW5kYXJWaXNpYmxlTW9udGgoKTtcbiAgICB0aGlzLnNldERlZmF1bHRWaWV3KGRlZmF1bHRWaWV3KTtcbiAgfVxuXG4gIGhlYWRlckFjdGlvbihoZWFkZXJBY3Rpb246IEhlYWRlckFjdGlvbik6IHZvaWQge1xuICAgIGNvbnN0IHttb250aFNlbGVjdG9yLCB5ZWFyU2VsZWN0b3J9ID0gdGhpcy5vcHRzO1xuXG4gICAgaWYgKGhlYWRlckFjdGlvbiA9PT0gSGVhZGVyQWN0aW9uLlByZXZCdG5DbGljaykge1xuICAgICAgaWYgKCF0aGlzLnByZXZWaWV3RGlzYWJsZWQpIHtcbiAgICAgICAgdGhpcy5vblByZXZOYXZpZ2F0ZUJ0bkNsaWNrZWQoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoaGVhZGVyQWN0aW9uID09PSBIZWFkZXJBY3Rpb24uTmV4dEJ0bkNsaWNrKSB7XG4gICAgICBpZiAoIXRoaXMubmV4dFZpZXdEaXNhYmxlZCkge1xuICAgICAgICB0aGlzLm9uTmV4dE5hdmlnYXRlQnRuQ2xpY2tlZCgpO1xuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmIChoZWFkZXJBY3Rpb24gPT09IEhlYWRlckFjdGlvbi5Nb250aEJ0bkNsaWNrKSB7XG4gICAgICBpZiAobW9udGhTZWxlY3Rvcikge1xuICAgICAgICB0aGlzLm9uTW9udGhWaWV3QnRuQ2xpY2tlZCgpO1xuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmIChoZWFkZXJBY3Rpb24gPT09IEhlYWRlckFjdGlvbi5ZZWFyQnRuQ2xpY2spIHtcbiAgICAgIGlmICh5ZWFyU2VsZWN0b3IpIHtcbiAgICAgICAgdGhpcy5vblllYXJWaWV3QnRuQ2xpY2tlZCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNldERlZmF1bHRWaWV3KGRlZmF1bHRWaWV3OiBEZWZhdWx0Vmlldyk6IHZvaWQge1xuICAgIGlmIChkZWZhdWx0VmlldyA9PT0gRGVmYXVsdFZpZXcuTW9udGgpIHtcbiAgICAgIHRoaXMubW9udGhWaWV3QnRuQ2xpY2tlZCgpO1xuICAgIH1cbiAgICBlbHNlIGlmIChkZWZhdWx0VmlldyA9PT0gRGVmYXVsdFZpZXcuWWVhcikge1xuICAgICAgdGhpcy55ZWFyVmlld0J0bkNsaWNrZWQoKTtcbiAgICB9XG4gIH1cblxuICBzZXRDYWxlbmRhckFuaW1hdGlvbihjYWxBbmltYXRpb246IElNeUNhbGVuZGFyQW5pbWF0aW9uLCBpc09wZW46IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBjb25zdCB7bmF0aXZlRWxlbWVudH0gPSB0aGlzLnNlbGVjdG9yRWw7XG4gICAgY29uc3Qge3JlbmRlcmVyfSA9IHRoaXM7XG5cbiAgICBjb25zdCBjbGFzc0luID0gTVlfRFBfQU5JTUFUSU9OICsgQU5JTUFUSU9OX05BTUVTW2NhbEFuaW1hdGlvbi5pbiAtIDFdO1xuICAgIGlmIChpc09wZW4pIHtcbiAgICAgIHJlbmRlcmVyLmFkZENsYXNzKG5hdGl2ZUVsZW1lbnQsIGNsYXNzSW4gKyBJTik7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgY29uc3QgY2xhc3NPdXQgPSBNWV9EUF9BTklNQVRJT04gKyBBTklNQVRJT05fTkFNRVNbY2FsQW5pbWF0aW9uLm91dCAtIDFdO1xuICAgICAgcmVuZGVyZXIucmVtb3ZlQ2xhc3MobmF0aXZlRWxlbWVudCwgY2xhc3NJbiArIElOKTtcbiAgICAgIHJlbmRlcmVyLmFkZENsYXNzKG5hdGl2ZUVsZW1lbnQsIGNsYXNzT3V0ICsgT1VUKTtcbiAgICB9XG4gIH1cblxuICByZXNldERhdGVWYWx1ZSgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMub3B0cy5kYXRlUmFuZ2UpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWREYXRlID0gdGhpcy51dGlsU2VydmljZS5yZXNldERhdGUoKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLnNlbGVjdGVkRGF0ZVJhbmdlLmJlZ2luID0gdGhpcy51dGlsU2VydmljZS5yZXNldERhdGUoKTtcbiAgICAgIHRoaXMuc2VsZWN0ZWREYXRlUmFuZ2UuZW5kID0gdGhpcy51dGlsU2VydmljZS5yZXNldERhdGUoKTtcbiAgICB9XG4gIH1cblxuICBjbGVhckRhdGUoKTogdm9pZCB7XG4gICAgY29uc3Qge21vbnRoLCB5ZWFyfSA9IHRoaXMudXRpbFNlcnZpY2UuZ2V0VG9kYXkoKTtcbiAgICB0aGlzLnNlbGVjdGVkTW9udGggPSB7bW9udGhOYnI6IG1vbnRoLCB5ZWFyOiB5ZWFyfTtcblxuICAgIHRoaXMucmVzZXREYXRlVmFsdWUoKTtcbiAgICB0aGlzLnNldENhbGVuZGFyVmlzaWJsZU1vbnRoKCk7XG4gICAgdGhpcy5yZXNldE1vbnRoWWVhclNlbGVjdCgpO1xuICB9XG5cbiAgcmVzZXRNb250aFllYXJTZWxlY3QoKTogdm9pZCB7XG4gICAgdGhpcy5zZWxlY3RNb250aCA9IGZhbHNlO1xuICAgIHRoaXMuc2VsZWN0WWVhciA9IGZhbHNlO1xuICB9XG5cbiAgb25Nb250aFZpZXdCdG5DbGlja2VkKCk6IHZvaWQge1xuICAgIHRoaXMudmlld0NoYW5nZWQgPSB0cnVlO1xuICAgIHRoaXMubW9udGhWaWV3QnRuQ2xpY2tlZCgpO1xuICB9XG5cbiAgbW9udGhWaWV3QnRuQ2xpY2tlZCgpOiB2b2lkIHtcbiAgICB0aGlzLnNlbGVjdE1vbnRoID0gIXRoaXMuc2VsZWN0TW9udGg7XG4gICAgdGhpcy5zZWxlY3RZZWFyID0gZmFsc2U7XG5cbiAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgaWYgKHRoaXMuc2VsZWN0TW9udGgpIHtcbiAgICAgIHRoaXMuZ2VuZXJhdGVNb250aHMoKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBjb25zdCB7eWVhciwgbW9udGhOYnJ9ID0gdGhpcy5zZWxlY3RlZE1vbnRoO1xuICAgICAgdGhpcy52aXNpYmxlTW9udGggPSB7bW9udGhUeHQ6IHRoaXMub3B0cy5tb250aExhYmVsc1ttb250aE5icl0sIG1vbnRoTmJyLCB5ZWFyfTtcbiAgICAgIHRoaXMuZ2VuZXJhdGVDYWxlbmRhcihtb250aE5iciwgeWVhciwgdHJ1ZSk7XG4gICAgfVxuICB9XG5cbiAgb25Nb250aENlbGxDbGlja2VkKGNlbGw6IElNeUNhbGVuZGFyTW9udGgpOiB2b2lkIHtcbiAgICB0aGlzLnZpZXdDaGFuZ2VkID0gdHJ1ZTtcblxuICAgIGNvbnN0IHt5ZWFyLCBtb250aE5icn0gPSB0aGlzLnZpc2libGVNb250aDtcbiAgICBjb25zdCBtb250aENoYW5nZTogYm9vbGVhbiA9IGNlbGwubmJyICE9PSBtb250aE5icjtcbiAgICB0aGlzLnZpc2libGVNb250aCA9IHttb250aFR4dDogdGhpcy5vcHRzLm1vbnRoTGFiZWxzW2NlbGwubmJyXSwgbW9udGhOYnI6IGNlbGwubmJyLCB5ZWFyfTtcbiAgICB0aGlzLnNlbGVjdGVkTW9udGgueWVhciA9IHllYXI7XG4gICAgdGhpcy5nZW5lcmF0ZUNhbGVuZGFyKGNlbGwubmJyLCB5ZWFyLCBtb250aENoYW5nZSk7XG4gICAgdGhpcy5zZWxlY3RNb250aCA9IGZhbHNlO1xuICAgIHRoaXMuZm9jdXNUb1NlbGVjdG9yKCk7XG4gIH1cblxuICBvbk1vbnRoQ2VsbEtleURvd24oZXZlbnQ6IGFueSkge1xuICAgIC8vIE1vdmUgZm9jdXMgYnkgYXJyb3cga2V5c1xuICAgIGNvbnN0IHtzb3VyY2VSb3csIHNvdXJjZUNvbH0gPSB0aGlzLmdldFNvdXJjZVJvd0FuZENvbHVtbkZyb21FdmVudChldmVudCk7XG4gICAgY29uc3Qge21vdmVGb2N1cywgdGFyZ2V0Um93LCB0YXJnZXRDb2wsIGRpcmVjdGlvbn0gPSB0aGlzLmdldFRhcmdldEZvY3VzUm93QW5kQ29sdW1uKGV2ZW50LCBzb3VyY2VSb3csIHNvdXJjZUNvbCwgTU9OVEhfUk9XX0NPVU5ULCBNT05USF9DT0xfQ09VTlQpO1xuXG4gICAgaWYgKG1vdmVGb2N1cykge1xuICAgICAgdGhpcy5mb2N1c0NlbGxFbGVtZW50KE0sIHRhcmdldFJvdywgdGFyZ2V0Q29sLCBkaXJlY3Rpb24sIE1PTlRIX0NPTF9DT1VOVCk7XG4gICAgfVxuICB9XG5cbiAgb25ZZWFyVmlld0J0bkNsaWNrZWQoKTogdm9pZCB7XG4gICAgdGhpcy52aWV3Q2hhbmdlZCA9IHRydWU7XG4gICAgdGhpcy55ZWFyVmlld0J0bkNsaWNrZWQoKTtcbiAgfVxuXG4gIHllYXJWaWV3QnRuQ2xpY2tlZCgpOiB2b2lkIHtcbiAgICB0aGlzLnNlbGVjdFllYXIgPSAhdGhpcy5zZWxlY3RZZWFyO1xuICAgIHRoaXMuc2VsZWN0TW9udGggPSBmYWxzZTtcblxuICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICBpZiAodGhpcy5zZWxlY3RZZWFyKSB7XG4gICAgICB0aGlzLmdlbmVyYXRlWWVhcnModGhpcy52aXNpYmxlTW9udGgueWVhcik7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgY29uc3Qge3llYXIsIG1vbnRoTmJyfSA9IHRoaXMuc2VsZWN0ZWRNb250aDtcbiAgICAgIHRoaXMudmlzaWJsZU1vbnRoID0ge21vbnRoVHh0OiB0aGlzLm9wdHMubW9udGhMYWJlbHNbbW9udGhOYnJdLCBtb250aE5iciwgeWVhcn07XG4gICAgICB0aGlzLmdlbmVyYXRlQ2FsZW5kYXIobW9udGhOYnIsIHllYXIsIHRydWUpO1xuICAgIH1cbiAgfVxuXG4gIG9uWWVhckNlbGxDbGlja2VkKGNlbGw6IElNeUNhbGVuZGFyWWVhcik6IHZvaWQge1xuICAgIHRoaXMudmlld0NoYW5nZWQgPSB0cnVlO1xuXG4gICAgY29uc3Qge3llYXIsIG1vbnRoTmJyLCBtb250aFR4dH0gPSB0aGlzLnZpc2libGVNb250aDtcbiAgICBjb25zdCB5YzogYm9vbGVhbiA9IGNlbGwueWVhciAhPT0geWVhcjtcbiAgICB0aGlzLnZpc2libGVNb250aCA9IHttb250aFR4dCwgbW9udGhOYnIsIHllYXI6IGNlbGwueWVhcn07XG4gICAgdGhpcy5zZWxlY3RlZE1vbnRoLnllYXIgPSBjZWxsLnllYXI7XG4gICAgdGhpcy5nZW5lcmF0ZUNhbGVuZGFyKG1vbnRoTmJyLCBjZWxsLnllYXIsIHljKTtcbiAgICB0aGlzLnNlbGVjdFllYXIgPSBmYWxzZTtcbiAgICB0aGlzLmZvY3VzVG9TZWxlY3RvcigpO1xuICB9XG5cbiAgb25ZZWFyQ2VsbEtleURvd24oZXZlbnQ6IGFueSkge1xuICAgIC8vIE1vdmUgZm9jdXMgYnkgYXJyb3cga2V5c1xuICAgIGNvbnN0IHtzb3VyY2VSb3csIHNvdXJjZUNvbH0gPSB0aGlzLmdldFNvdXJjZVJvd0FuZENvbHVtbkZyb21FdmVudChldmVudCk7XG4gICAgY29uc3Qge21vdmVGb2N1cywgdGFyZ2V0Um93LCB0YXJnZXRDb2wsIGRpcmVjdGlvbn0gPSB0aGlzLmdldFRhcmdldEZvY3VzUm93QW5kQ29sdW1uKGV2ZW50LCBzb3VyY2VSb3csIHNvdXJjZUNvbCwgWUVBUl9ST1dfQ09VTlQsIFlFQVJfQ09MX0NPVU5UKTtcblxuICAgIGlmIChtb3ZlRm9jdXMpIHtcbiAgICAgIHRoaXMuZm9jdXNDZWxsRWxlbWVudChZLCB0YXJnZXRSb3csIHRhcmdldENvbCwgZGlyZWN0aW9uLCBZRUFSX0NPTF9DT1VOVCk7XG4gICAgfVxuICB9XG5cbiAgZ2VuZXJhdGVNb250aHMoKTogdm9pZCB7XG4gICAgY29uc3QgdG9kYXk6IElNeURhdGUgPSB0aGlzLnV0aWxTZXJ2aWNlLmdldFRvZGF5KCk7XG4gICAgdGhpcy5tb250aHMubGVuZ3RoID0gMDtcblxuICAgIGNvbnN0IHt5ZWFyLCBtb250aE5icn0gPSB0aGlzLnZpc2libGVNb250aDtcbiAgICBjb25zdCB7cnRsLCBtb250aExhYmVsc30gPSB0aGlzLm9wdHM7XG5cbiAgICBsZXQgcm93OiBudW1iZXIgPSAwO1xuICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IDEyOyBpICs9IDMpIHtcbiAgICAgIGNvbnN0IHJvd0RhdGE6IEFycmF5PElNeUNhbGVuZGFyTW9udGg+ID0gW107XG4gICAgICBsZXQgY29sID0gcnRsID8gMiA6IDA7XG5cbiAgICAgIGZvciAobGV0IGogPSBpOyBqIDwgaSArIDM7IGorKykge1xuICAgICAgICBjb25zdCBkaXNhYmxlZDogYm9vbGVhbiA9IHRoaXMudXRpbFNlcnZpY2UuaXNEaXNhYmxlZE1vbnRoKHllYXIsIGosIHRoaXMub3B0cyk7XG4gICAgICAgIHJvd0RhdGEucHVzaCh7XG4gICAgICAgICAgbmJyOiBqLFxuICAgICAgICAgIG5hbWU6IG1vbnRoTGFiZWxzW2pdLFxuICAgICAgICAgIGN1cnJNb250aDogaiA9PT0gdG9kYXkubW9udGggJiYgeWVhciA9PT0gdG9kYXkueWVhcixcbiAgICAgICAgICBzZWxlY3RlZDogaiA9PT0gbW9udGhOYnIgJiYgeWVhciA9PT0gdGhpcy5zZWxlY3RlZE1vbnRoLnllYXIsXG4gICAgICAgICAgZGlzYWJsZWQsXG4gICAgICAgICAgcm93LFxuICAgICAgICAgIGNvbDogcnRsID8gY29sLS0gOiBjb2wrK1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJvdysrO1xuICAgICAgdGhpcy5tb250aHMucHVzaChyb3dEYXRhKTtcbiAgICB9XG5cbiAgICB0aGlzLnNldE1vbnRoVmlld0hlYWRlckJ0bkRpc2FibGVkU3RhdGUoeWVhcik7XG4gIH1cblxuICBnZW5lcmF0ZVllYXJzKGlucHV0WWVhcjogbnVtYmVyKTogdm9pZCB7XG4gICAgY29uc3Qge21pblllYXIsIG1heFllYXIsIHJ0bH0gPSB0aGlzLm9wdHM7XG5cbiAgICBsZXQgeTogbnVtYmVyID0gaW5wdXRZZWFyIC0gMTI7XG4gICAgaWYgKGlucHV0WWVhciA8IG1pblllYXIpIHtcbiAgICAgIHkgPSBtaW5ZZWFyO1xuICAgIH1cblxuICAgIGlmIChpbnB1dFllYXIgKyAyNSA+IG1heFllYXIpIHtcbiAgICAgIHkgPSBtYXhZZWFyIC0gMjQ7XG4gICAgfVxuXG4gICAgY29uc3Qge3llYXJ9ID0gdGhpcy52aXNpYmxlTW9udGg7XG5cbiAgICB0aGlzLnllYXJzLmxlbmd0aCA9IDA7XG4gICAgY29uc3QgdG9kYXk6IElNeURhdGUgPSB0aGlzLnV0aWxTZXJ2aWNlLmdldFRvZGF5KCk7XG5cbiAgICBsZXQgcm93OiBudW1iZXIgPSAwO1xuICAgIGZvciAobGV0IGkgPSB5OyBpIDwgeSArIDI1OyBpICs9IDUpIHtcbiAgICAgIGNvbnN0IHJvd0RhdGE6IEFycmF5PElNeUNhbGVuZGFyWWVhcj4gPSBbXTtcbiAgICAgIGxldCBjb2w6IG51bWJlciA9IHJ0bCA/IDQgOiAwO1xuXG4gICAgICBmb3IgKGxldCBqID0gaTsgaiA8IGkgKyA1OyBqKyspIHtcbiAgICAgICAgY29uc3QgZGlzYWJsZWQ6IGJvb2xlYW4gPSB0aGlzLnV0aWxTZXJ2aWNlLmlzRGlzYWJsZWRZZWFyKGosIHRoaXMub3B0cyk7XG4gICAgICAgIHJvd0RhdGEucHVzaCh7XG4gICAgICAgICAgeWVhcjogaixcbiAgICAgICAgICBjdXJyWWVhcjogaiA9PT0gdG9kYXkueWVhcixcbiAgICAgICAgICBzZWxlY3RlZDogaiA9PT0geWVhcixcbiAgICAgICAgICBkaXNhYmxlZCxcbiAgICAgICAgICByb3csXG4gICAgICAgICAgY29sOiBydGwgPyBjb2wtLSA6IGNvbCsrXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcm93Kys7XG4gICAgICB0aGlzLnllYXJzLnB1c2gocm93RGF0YSk7XG4gICAgfVxuXG4gICAgY29uc3QgYmVnaW5ZZWFyOiBudW1iZXIgPSB0aGlzLmdldFllYXJWYWx1ZUJ5Um93QW5kQ29sKDAsIDApO1xuICAgIGNvbnN0IGVuZFllYXI6IG51bWJlciA9IGJlZ2luWWVhciArIDI0O1xuICAgIHRoaXMueWVhcnNEdXJhdGlvbiA9ICghcnRsID8gYmVnaW5ZZWFyIDogZW5kWWVhcikgKyBZRUFSX1NFUEFSQVRPUiArICghcnRsID8gZW5kWWVhciA6IGJlZ2luWWVhcik7XG5cbiAgICB0aGlzLnNldFllYXJWaWV3SGVhZGVyQnRuRGlzYWJsZWRTdGF0ZShiZWdpblllYXIsIGVuZFllYXIpO1xuICB9XG5cbiAgb25Ub2RheUZvb3RlckNsaWNrZWQoKTogdm9pZCB7XG4gICAgY29uc3QgZGF0ZSA9IHRoaXMudXRpbFNlcnZpY2UuZ2V0VG9kYXkoKTtcbiAgICB0aGlzLnNlbGVjdERhdGUoZGF0ZSk7XG4gIH1cblxuICBnZXRZZWFyVmFsdWVCeVJvd0FuZENvbChyb3c6IG51bWJlciwgY29sOiBudW1iZXIpOiBudW1iZXIge1xuICAgIGNvbnN0IHt5ZWFyc30gPSB0aGlzO1xuICAgIGlmICgheWVhcnMgfHwgeWVhcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICBjb25zdCB7eWVhcn0gPSB0aGlzLnV0aWxTZXJ2aWNlLmdldFRvZGF5KCk7XG4gICAgICByZXR1cm4geWVhcjtcbiAgICB9XG4gICAgcmV0dXJuIHllYXJzW3Jvd11bY29sXS55ZWFyO1xuICB9XG5cbiAgc2V0Q2FsZW5kYXJWaXNpYmxlTW9udGgoKTogdm9pZCB7XG4gICAgLy8gU2V0cyB2aXNpYmxlIG1vbnRoIG9mIGNhbGVuZGFyXG4gICAgY29uc3Qge3llYXIsIG1vbnRoTmJyfSA9IHRoaXMuc2VsZWN0ZWRNb250aDtcbiAgICB0aGlzLnZpc2libGVNb250aCA9IHttb250aFR4dDogdGhpcy5vcHRzLm1vbnRoTGFiZWxzW21vbnRoTmJyXSwgbW9udGhOYnIsIHllYXJ9O1xuXG4gICAgLy8gQ3JlYXRlIGN1cnJlbnQgbW9udGhcbiAgICB0aGlzLmdlbmVyYXRlQ2FsZW5kYXIobW9udGhOYnIsIHllYXIsIHRydWUpO1xuICB9XG5cbiAgb25WaWV3QWN0aXZhdGVkKGV2ZW50OiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLnZpZXdBY3RpdmF0ZWQoZXZlbnQpO1xuICB9XG5cbiAgb25QcmV2TmF2aWdhdGVCdG5DbGlja2VkKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5zZWxlY3RNb250aCAmJiAhdGhpcy5zZWxlY3RZZWFyKSB7XG4gICAgICB0aGlzLnNldERhdGVWaWV3TW9udGgoZmFsc2UpO1xuICAgIH1cbiAgICBlbHNlIGlmICh0aGlzLnNlbGVjdE1vbnRoKSB7XG4gICAgICB0aGlzLnZpc2libGVNb250aC55ZWFyLS07XG4gICAgICB0aGlzLmdlbmVyYXRlTW9udGhzKCk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHRoaXMuc2VsZWN0WWVhcikge1xuICAgICAgdGhpcy5nZW5lcmF0ZVllYXJzKHRoaXMuZ2V0WWVhclZhbHVlQnlSb3dBbmRDb2woMiwgMikgLSAyNSk7XG4gICAgfVxuICB9XG5cbiAgb25OZXh0TmF2aWdhdGVCdG5DbGlja2VkKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5zZWxlY3RNb250aCAmJiAhdGhpcy5zZWxlY3RZZWFyKSB7XG4gICAgICB0aGlzLnNldERhdGVWaWV3TW9udGgodHJ1ZSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHRoaXMuc2VsZWN0TW9udGgpIHtcbiAgICAgIHRoaXMudmlzaWJsZU1vbnRoLnllYXIrKztcbiAgICAgIHRoaXMuZ2VuZXJhdGVNb250aHMoKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodGhpcy5zZWxlY3RZZWFyKSB7XG4gICAgICB0aGlzLmdlbmVyYXRlWWVhcnModGhpcy5nZXRZZWFyVmFsdWVCeVJvd0FuZENvbCgyLCAyKSArIDI1KTtcbiAgICB9XG4gIH1cblxuICBzZXREYXRlVmlld01vbnRoKGlzTmV4dDogYm9vbGVhbik6IHZvaWQge1xuICAgIGxldCBjaGFuZ2U6IG51bWJlciA9IGlzTmV4dCA/IDEgOiAtMTtcblxuICAgIGNvbnN0IHt5ZWFyLCBtb250aE5icn0gPSB0aGlzLnZpc2libGVNb250aDtcblxuICAgIGNvbnN0IGQ6IERhdGUgPSB0aGlzLnV0aWxTZXJ2aWNlLmdldEpzRGF0ZSh5ZWFyLCBtb250aE5iciwgMSk7XG4gICAgZC5zZXRNb250aChkLmdldE1vbnRoKCkgKyBjaGFuZ2UpO1xuXG4gICAgY29uc3QgeTogbnVtYmVyID0gZC5nZXRGdWxsWWVhcigpO1xuICAgIGNvbnN0IG06IG51bWJlciA9IGQuZ2V0TW9udGgoKSArIDE7XG5cbiAgICB0aGlzLnZpc2libGVNb250aCA9IHttb250aFR4dDogdGhpcy5vcHRzLm1vbnRoTGFiZWxzW21dLCBtb250aE5icjogbSwgeWVhcjogeX07XG4gICAgdGhpcy5nZW5lcmF0ZUNhbGVuZGFyKG0sIHksIHRydWUpO1xuICB9XG5cbiAgb25DbG9zZVNlbGVjdG9yKGV2ZW50OiBhbnkpOiB2b2lkIHtcbiAgICBjb25zdCBrZXlDb2RlOiBudW1iZXIgPSB0aGlzLnV0aWxTZXJ2aWNlLmdldEtleUNvZGVGcm9tRXZlbnQoZXZlbnQpO1xuICAgIGlmIChrZXlDb2RlID09PSBLZXlDb2RlLmVzYykge1xuICAgICAgdGhpcy5jbG9zZWRCeUVzYygpO1xuICAgIH1cbiAgfVxuXG4gIG9uRGF5Q2VsbENsaWNrZWQoY2VsbDogSU15Q2FsZW5kYXJEYXkpOiB2b2lkIHtcbiAgICAvLyBDZWxsIGNsaWNrZWQgb24gdGhlIGNhbGVuZGFyXG4gICAgdGhpcy5zZWxlY3REYXRlKGNlbGwuZGF0ZU9iaik7XG4gICAgdGhpcy5yZXNldE1vbnRoWWVhclNlbGVjdCgpO1xuICB9XG5cbiAgb25EYXlDZWxsS2V5RG93bihldmVudDogYW55KSB7XG4gICAgLy8gTW92ZSBmb2N1cyBieSBhcnJvdyBrZXlzXG4gICAgY29uc3Qge3NvdXJjZVJvdywgc291cmNlQ29sfSA9IHRoaXMuZ2V0U291cmNlUm93QW5kQ29sdW1uRnJvbUV2ZW50KGV2ZW50KTtcbiAgICBjb25zdCB7bW92ZUZvY3VzLCB0YXJnZXRSb3csIHRhcmdldENvbCwgZGlyZWN0aW9ufSA9IHRoaXMuZ2V0VGFyZ2V0Rm9jdXNSb3dBbmRDb2x1bW4oZXZlbnQsIHNvdXJjZVJvdywgc291cmNlQ29sLCBEQVRFX1JPV19DT1VOVCwgREFURV9DT0xfQ09VTlQpO1xuICAgIGlmIChtb3ZlRm9jdXMpIHtcbiAgICAgIHRoaXMuZm9jdXNDZWxsRWxlbWVudChELCB0YXJnZXRSb3csIHRhcmdldENvbCwgZGlyZWN0aW9uLCBEQVRFX0NPTF9DT1VOVCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0U291cmNlUm93QW5kQ29sdW1uRnJvbUV2ZW50KGV2ZW50OiBhbnkpOiBhbnkge1xuICAgIGxldCBzb3VyY2VSb3c6IG51bWJlciA9IDA7XG4gICAgbGV0IHNvdXJjZUNvbDogbnVtYmVyID0gMDtcbiAgICBpZiAoZXZlbnQudGFyZ2V0ICYmIGV2ZW50LnRhcmdldC5pZCkge1xuICAgICAgLy8gdmFsdWUgb2YgaWQgaXMgZm9yIGV4YW1wbGU6IG1fMF8xIChmaXJzdCBudW1iZXIgPSByb3csIHNlY29uZCBudW1iZXIgPSBjb2x1bW4pXG4gICAgICBjb25zdCBhcnI6IEFycmF5PHN0cmluZz4gPSBldmVudC50YXJnZXQuaWQuc3BsaXQoVU5ERVJfTElORSk7XG4gICAgICBzb3VyY2VSb3cgPSBOdW1iZXIoYXJyWzFdKTtcbiAgICAgIHNvdXJjZUNvbCA9IE51bWJlcihhcnJbMl0pO1xuICAgIH1cbiAgICByZXR1cm4ge3NvdXJjZVJvdywgc291cmNlQ29sfTtcbiAgfVxuXG4gIGdldFRhcmdldEZvY3VzUm93QW5kQ29sdW1uKGV2ZW50OiBhbnksIHJvdzogbnVtYmVyLCBjb2w6IG51bWJlciwgcm93Q291bnQ6IG51bWJlciwgY29sQ291bnQ6IG51bWJlcik6IGFueSB7XG4gICAgbGV0IG1vdmVGb2N1czogYm9vbGVhbiA9IHRydWU7XG4gICAgbGV0IHRhcmdldFJvdzogbnVtYmVyID0gcm93O1xuICAgIGxldCB0YXJnZXRDb2w6IG51bWJlciA9IGNvbDtcbiAgICBsZXQgZGlyZWN0aW9uOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBjb25zdCBrZXlDb2RlOiBudW1iZXIgPSB0aGlzLnV0aWxTZXJ2aWNlLmdldEtleUNvZGVGcm9tRXZlbnQoZXZlbnQpO1xuICAgIGlmIChrZXlDb2RlID09PSBLZXlDb2RlLnVwQXJyb3cgJiYgcm93ID4gMCkge1xuICAgICAgdGFyZ2V0Um93LS07XG4gICAgfVxuICAgIGVsc2UgaWYgKGtleUNvZGUgPT09IEtleUNvZGUuZG93bkFycm93ICYmIHJvdyA8IHJvd0NvdW50KSB7XG4gICAgICB0YXJnZXRSb3crKztcbiAgICAgIGRpcmVjdGlvbiA9IHRydWU7XG4gICAgfVxuICAgIGVsc2UgaWYgKGtleUNvZGUgPT09IEtleUNvZGUubGVmdEFycm93ICYmIGNvbCA+IDApIHtcbiAgICAgIHRhcmdldENvbC0tO1xuICAgIH1cbiAgICBlbHNlIGlmIChrZXlDb2RlID09PSBLZXlDb2RlLnJpZ2h0QXJyb3cgJiYgY29sIDwgY29sQ291bnQpIHtcbiAgICAgIHRhcmdldENvbCsrO1xuICAgICAgZGlyZWN0aW9uID0gdHJ1ZTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBtb3ZlRm9jdXMgPSBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHttb3ZlRm9jdXMsIHRhcmdldFJvdywgdGFyZ2V0Q29sLCBkaXJlY3Rpb259O1xuICB9XG5cbiAgZm9jdXNDZWxsRWxlbWVudCh0eXBlOiBzdHJpbmcsIHJvdzogbnVtYmVyLCBjb2w6IG51bWJlciwgZGlyZWN0aW9uOiBib29sZWFuLCBjb2xDb3VudDogbnVtYmVyKTogdm9pZCB7XG4gICAgY29uc3QgY2xhc3NOYW1lOiBzdHJpbmcgPSB0eXBlICsgVU5ERVJfTElORSArIHJvdyArIFVOREVSX0xJTkUgKyBjb2w7XG4gICAgbGV0IGVsZW06IGFueSA9IHRoaXMuc2VsZWN0b3JFbC5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoRE9UICsgY2xhc3NOYW1lKTtcblxuICAgIGlmIChlbGVtLmdldEF0dHJpYnV0ZShUQUJJTkRFWCkgIT09IFpFUk9fU1RSKSB7XG4gICAgICAvLyBpZiB0aGUgc2VsZWN0ZWQgZWxlbWVudCBpcyBkaXNhYmxlZCBtb3ZlIGEgZm9jdXMgdG8gbmV4dC9wcmV2aW91cyBlbmFibGVkIGVsZW1lbnRcbiAgICAgIGxldCB0ZExpc3Q6IGFueSA9IHRoaXMuZ2V0Q2FsZW5kYXJFbGVtZW50cygpO1xuICAgICAgY29uc3QgaWR4OiBudW1iZXIgPSByb3cgKiAoY29sQ291bnQgKyAxKSArIGNvbDtcblxuICAgICAgbGV0IGVuYWJsZWRFbGVtOiBhbnkgPSBudWxsO1xuICAgICAgaWYgKGRpcmVjdGlvbikge1xuICAgICAgICAvLyBmaW5kIG5leHQgZW5hYmxlZFxuICAgICAgICBlbmFibGVkRWxlbSA9IHRkTGlzdC5zbGljZShpZHgpLmZpbmQoKHRkOiBhbnkpID0+IHRkLmdldEF0dHJpYnV0ZShUQUJJTkRFWCkgPT09IFpFUk9fU1RSKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICAvLyBmaW5kIHByZXZpb3VzIGVuYWJsZWRcbiAgICAgICAgZW5hYmxlZEVsZW0gPSB0ZExpc3Quc2xpY2UoMCwgaWR4KS5yZXZlcnNlKCkuZmluZCgodGQ6IGFueSkgPT4gdGQuZ2V0QXR0cmlidXRlKFRBQklOREVYKSA9PT0gWkVST19TVFIpO1xuICAgICAgfVxuXG4gICAgICBlbGVtID0gZW5hYmxlZEVsZW0gPyBlbmFibGVkRWxlbSA6IHRoaXMuc2VsZWN0b3JFbC5uYXRpdmVFbGVtZW50O1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGVsZW0uZm9jdXMoKTtcbiAgICB9XG4gIH1cblxuICBmb2N1c1RvU2VsZWN0b3IoKTogdm9pZCB7XG4gICAgdGhpcy5zZWxlY3RvckVsLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgfVxuXG4gIGdldENhbGVuZGFyRWxlbWVudHMoKTogYW55IHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLnNlbGVjdG9yRWwubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKFREX1NFTEVDVE9SKSk7XG4gIH1cblxuICBzZWxlY3REYXRlKGRhdGU6IElNeURhdGUpOiB2b2lkIHtcbiAgICBjb25zdCB7ZGF0ZVJhbmdlLCBkYXRlRm9ybWF0LCBtb250aExhYmVscywgZGF0ZVJhbmdlRGF0ZXNEZWxpbWl0ZXIsIGNsb3NlU2VsZWN0b3JPbkRhdGVTZWxlY3R9ID0gdGhpcy5vcHRzO1xuXG4gICAgaWYgKGRhdGVSYW5nZSkge1xuICAgICAgLy8gRGF0ZSByYW5nZVxuICAgICAgY29uc3QgaXNCZWdpbkRhdGVJbml0aWFsaXplZDogYm9vbGVhbiA9IHRoaXMudXRpbFNlcnZpY2UuaXNJbml0aWFsaXplZERhdGUodGhpcy5zZWxlY3RlZERhdGVSYW5nZS5iZWdpbik7XG4gICAgICBjb25zdCBpc0VuZERhdGVJbml0aWFsaXplZDogYm9vbGVhbiA9IHRoaXMudXRpbFNlcnZpY2UuaXNJbml0aWFsaXplZERhdGUodGhpcy5zZWxlY3RlZERhdGVSYW5nZS5lbmQpO1xuICAgICAgaWYgKGlzQmVnaW5EYXRlSW5pdGlhbGl6ZWQgJiYgaXNFbmREYXRlSW5pdGlhbGl6ZWQpIHtcbiAgICAgICAgLy8gYm90aCBhbHJlYWR5IHNlbGVjdGVkIC0gc2V0IGJlZ2luIGRhdGUgYW5kIHJlc2V0IGVuZCBkYXRlXG4gICAgICAgIHRoaXMuc2VsZWN0ZWREYXRlUmFuZ2UuYmVnaW4gPSBkYXRlO1xuICAgICAgICB0aGlzLnNlbGVjdGVkRGF0ZVJhbmdlLmVuZCA9IHRoaXMudXRpbFNlcnZpY2UucmVzZXREYXRlKCk7XG4gICAgICAgIHRoaXMucmFuZ2VEYXRlU2VsZWN0aW9uKHtcbiAgICAgICAgICBpc0JlZ2luOiB0cnVlLFxuICAgICAgICAgIGRhdGUsXG4gICAgICAgICAganNEYXRlOiB0aGlzLnV0aWxTZXJ2aWNlLm15RGF0ZVRvSnNEYXRlKGRhdGUpLFxuICAgICAgICAgIGRhdGVGb3JtYXQ6IGRhdGVGb3JtYXQsXG4gICAgICAgICAgZm9ybWF0dGVkOiB0aGlzLnV0aWxTZXJ2aWNlLmZvcm1hdERhdGUoZGF0ZSwgZGF0ZUZvcm1hdCwgbW9udGhMYWJlbHMpLFxuICAgICAgICAgIGVwb2M6IHRoaXMudXRpbFNlcnZpY2UuZ2V0RXBvY1RpbWUoZGF0ZSlcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmICghaXNCZWdpbkRhdGVJbml0aWFsaXplZCkge1xuICAgICAgICAvLyBiZWdpbiBkYXRlXG4gICAgICAgIHRoaXMuc2VsZWN0ZWREYXRlUmFuZ2UuYmVnaW4gPSBkYXRlO1xuICAgICAgICB0aGlzLnJhbmdlRGF0ZVNlbGVjdGlvbih7XG4gICAgICAgICAgaXNCZWdpbjogdHJ1ZSxcbiAgICAgICAgICBkYXRlLFxuICAgICAgICAgIGpzRGF0ZTogdGhpcy51dGlsU2VydmljZS5teURhdGVUb0pzRGF0ZShkYXRlKSxcbiAgICAgICAgICBkYXRlRm9ybWF0OiBkYXRlRm9ybWF0LFxuICAgICAgICAgIGZvcm1hdHRlZDogdGhpcy51dGlsU2VydmljZS5mb3JtYXREYXRlKGRhdGUsIGRhdGVGb3JtYXQsIG1vbnRoTGFiZWxzKSxcbiAgICAgICAgICBlcG9jOiB0aGlzLnV0aWxTZXJ2aWNlLmdldEVwb2NUaW1lKGRhdGUpXG4gICAgICAgIH0pO1xuXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgLy8gc2Vjb25kIHNlbGVjdGlvblxuICAgICAgICBjb25zdCBmaXJzdERhdGVFYXJsaWVyOiBib29sZWFuID0gdGhpcy51dGlsU2VydmljZS5pc0RhdGVFYXJsaWVyKGRhdGUsIHRoaXMuc2VsZWN0ZWREYXRlUmFuZ2UuYmVnaW4pO1xuICAgICAgICBpZiAoZmlyc3REYXRlRWFybGllcikge1xuICAgICAgICAgIHRoaXMuc2VsZWN0ZWREYXRlUmFuZ2UuYmVnaW4gPSBkYXRlO1xuICAgICAgICAgIHRoaXMucmFuZ2VEYXRlU2VsZWN0aW9uKHtcbiAgICAgICAgICAgIGlzQmVnaW46IHRydWUsXG4gICAgICAgICAgICBkYXRlLFxuICAgICAgICAgICAganNEYXRlOiB0aGlzLnV0aWxTZXJ2aWNlLm15RGF0ZVRvSnNEYXRlKGRhdGUpLFxuICAgICAgICAgICAgZGF0ZUZvcm1hdDogZGF0ZUZvcm1hdCxcbiAgICAgICAgICAgIGZvcm1hdHRlZDogdGhpcy51dGlsU2VydmljZS5mb3JtYXREYXRlKGRhdGUsIGRhdGVGb3JtYXQsIG1vbnRoTGFiZWxzKSxcbiAgICAgICAgICAgIGVwb2M6IHRoaXMudXRpbFNlcnZpY2UuZ2V0RXBvY1RpbWUoZGF0ZSlcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkRGF0ZVJhbmdlLmVuZCA9IGRhdGU7XG4gICAgICAgICAgdGhpcy5yYW5nZURhdGVTZWxlY3Rpb24oe1xuICAgICAgICAgICAgaXNCZWdpbjogZmFsc2UsXG4gICAgICAgICAgICBkYXRlLFxuICAgICAgICAgICAganNEYXRlOiB0aGlzLnV0aWxTZXJ2aWNlLm15RGF0ZVRvSnNEYXRlKGRhdGUpLFxuICAgICAgICAgICAgZGF0ZUZvcm1hdDogZGF0ZUZvcm1hdCxcbiAgICAgICAgICAgIGZvcm1hdHRlZDogdGhpcy51dGlsU2VydmljZS5mb3JtYXREYXRlKGRhdGUsIGRhdGVGb3JtYXQsIG1vbnRoTGFiZWxzKSxcbiAgICAgICAgICAgIGVwb2M6IHRoaXMudXRpbFNlcnZpY2UuZ2V0RXBvY1RpbWUoZGF0ZSlcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHRoaXMuZGF0ZUNoYW5nZWQodGhpcy51dGlsU2VydmljZS5nZXREYXRlTW9kZWwobnVsbCwgdGhpcy5zZWxlY3RlZERhdGVSYW5nZSwgZGF0ZUZvcm1hdCwgbW9udGhMYWJlbHMsIGRhdGVSYW5nZURhdGVzRGVsaW1pdGVyKSwgY2xvc2VTZWxlY3Rvck9uRGF0ZVNlbGVjdCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAvLyBTaW5nbGUgZGF0ZVxuICAgICAgdGhpcy5zZWxlY3RlZERhdGUgPSBkYXRlO1xuICAgICAgdGhpcy5kYXRlQ2hhbmdlZCh0aGlzLnV0aWxTZXJ2aWNlLmdldERhdGVNb2RlbCh0aGlzLnNlbGVjdGVkRGF0ZSwgbnVsbCwgZGF0ZUZvcm1hdCwgbW9udGhMYWJlbHMsIGRhdGVSYW5nZURhdGVzRGVsaW1pdGVyKSwgY2xvc2VTZWxlY3Rvck9uRGF0ZVNlbGVjdCk7XG4gICAgfVxuICB9XG5cbiAgbW9udGhTdGFydElkeCh5OiBudW1iZXIsIG06IG51bWJlcik6IG51bWJlciB7XG4gICAgLy8gTW9udGggc3RhcnQgaW5kZXhcbiAgICBjb25zdCBkOiBEYXRlID0gbmV3IERhdGUoKTtcbiAgICBkLnNldERhdGUoMSk7XG4gICAgZC5zZXRNb250aChtIC0gMSk7XG4gICAgZC5zZXRGdWxsWWVhcih5KTtcbiAgICBjb25zdCBpZHggPSBkLmdldERheSgpICsgdGhpcy5zdW5kYXlJZHgoKTtcbiAgICByZXR1cm4gaWR4ID49IDcgPyBpZHggLSA3IDogaWR4O1xuICB9XG5cbiAgaXNDdXJyRGF5KGQ6IG51bWJlciwgbTogbnVtYmVyLCB5OiBudW1iZXIsIHRvZGF5OiBJTXlEYXRlKTogYm9vbGVhbiB7XG4gICAgLy8gQ2hlY2sgaXMgYSBnaXZlbiBkYXRlIHRoZSB0b2RheVxuICAgIHJldHVybiBkID09PSB0b2RheS5kYXkgJiYgbSA9PT0gdG9kYXkubW9udGggJiYgeSA9PT0gdG9kYXkueWVhcjtcbiAgfVxuXG4gIGdldERheU51bWJlcihkYXRlOiBJTXlEYXRlKTogbnVtYmVyIHtcbiAgICAvLyBHZXQgZGF5IG51bWJlcjogc3U9MCwgbW89MSwgdHU9Miwgd2U9MyAuLi5cbiAgICBjb25zdCB7eWVhciwgbW9udGgsIGRheX0gPSBkYXRlO1xuICAgIGNvbnN0IGQ6IERhdGUgPSB0aGlzLnV0aWxTZXJ2aWNlLmdldEpzRGF0ZSh5ZWFyLCBtb250aCwgZGF5KTtcbiAgICByZXR1cm4gZC5nZXREYXkoKTtcbiAgfVxuXG4gIGdldFdlZWtkYXkoZGF0ZTogSU15RGF0ZSk6IHN0cmluZyB7XG4gICAgLy8gR2V0IHdlZWtkYXk6IHN1LCBtbywgdHUsIHdlIC4uLlxuICAgIHJldHVybiB0aGlzLndlZWtEYXlPcHRzW3RoaXMuZ2V0RGF5TnVtYmVyKGRhdGUpXTtcbiAgfVxuXG4gIHN1bmRheUlkeCgpOiBudW1iZXIge1xuICAgIC8vIEluZGV4IG9mIFN1bmRheSBkYXlcbiAgICByZXR1cm4gdGhpcy5kYXlJZHggPiAwID8gNyAtIHRoaXMuZGF5SWR4IDogMDtcbiAgfVxuXG4gIGdlbmVyYXRlQ2FsZW5kYXIobTogbnVtYmVyLCB5OiBudW1iZXIsIG5vdGlmeUNoYW5nZTogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuZGF0ZXMubGVuZ3RoID0gMDtcbiAgICBjb25zdCB0b2RheTogSU15RGF0ZSA9IHRoaXMudXRpbFNlcnZpY2UuZ2V0VG9kYXkoKTtcbiAgICBjb25zdCBtb250aFN0YXJ0OiBudW1iZXIgPSB0aGlzLm1vbnRoU3RhcnRJZHgoeSwgbSk7XG4gICAgY29uc3QgZEluVGhpc006IG51bWJlciA9IHRoaXMudXRpbFNlcnZpY2UuZGF0ZXNJbk1vbnRoKG0sIHkpO1xuICAgIGNvbnN0IGRJblByZXZNOiBudW1iZXIgPSB0aGlzLnV0aWxTZXJ2aWNlLmRhdGVzSW5QcmV2TW9udGgobSwgeSk7XG5cbiAgICBsZXQgZGF5TmJyOiBudW1iZXIgPSAxO1xuICAgIGxldCBtb250aDogbnVtYmVyID0gbTtcbiAgICBsZXQgY21vOiBudW1iZXIgPSBNb250aElkLnByZXY7XG4gICAgY29uc3Qge3J0bCwgc2hvd1dlZWtOdW1iZXJzLCBmaXJzdERheU9mV2Vla30gPSB0aGlzLm9wdHM7XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCA3OyBpKyspIHtcbiAgICAgIGxldCBjb2w6IG51bWJlciA9IHJ0bCA/IDYgOiAwO1xuICAgICAgY29uc3Qgd2VlazogQXJyYXk8SU15Q2FsZW5kYXJEYXk+ID0gW107XG4gICAgICBpZiAoaSA9PT0gMSkge1xuICAgICAgICAvLyBGaXJzdCB3ZWVrXG4gICAgICAgIGNvbnN0IHBtID0gZEluUHJldk0gLSBtb250aFN0YXJ0ICsgMTtcbiAgICAgICAgLy8gUHJldmlvdXMgbW9udGhcbiAgICAgICAgZm9yIChsZXQgaiA9IHBtOyBqIDw9IGRJblByZXZNOyBqKyspIHtcbiAgICAgICAgICBjb25zdCBkYXRlOiBJTXlEYXRlID0ge3llYXI6IG0gPT09IDEgPyB5IC0gMSA6IHksIG1vbnRoOiBtID09PSAxID8gMTIgOiBtIC0gMSwgZGF5OiBqfTtcbiAgICAgICAgICB3ZWVrLnB1c2goe1xuICAgICAgICAgICAgZGF0ZU9iajogZGF0ZSxcbiAgICAgICAgICAgIGNtbyxcbiAgICAgICAgICAgIGN1cnJEYXk6IHRoaXMuaXNDdXJyRGF5KGosIG1vbnRoIC0gMSwgeSwgdG9kYXkpLFxuICAgICAgICAgICAgZGlzYWJsZWREYXRlOiB0aGlzLnV0aWxTZXJ2aWNlLmlzRGlzYWJsZWREYXRlKGRhdGUsIHRoaXMub3B0cyksXG4gICAgICAgICAgICBtYXJrZWREYXRlOiB0aGlzLnV0aWxTZXJ2aWNlLmlzTWFya2VkRGF0ZShkYXRlLCB0aGlzLm9wdHMpLFxuICAgICAgICAgICAgbGFiZWxlZERhdGU6IHRoaXMudXRpbFNlcnZpY2UuaXNMYWJlbGVkRGF0ZShkYXRlLCB0aGlzLm9wdHMubGFiZWxEYXRlcyksXG4gICAgICAgICAgICBoaWdobGlnaHQ6IHRoaXMudXRpbFNlcnZpY2UuaXNIaWdobGlnaHRlZERhdGUoZGF0ZSwgdGhpcy5vcHRzKSxcbiAgICAgICAgICAgIHJvdzogaSAtIDEsXG4gICAgICAgICAgICBjb2w6IHJ0bCA/IGNvbC0tIDogY29sKytcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNtbyA9IE1vbnRoSWQuY3VycjtcbiAgICAgICAgLy8gQ3VycmVudCBtb250aFxuICAgICAgICBjb25zdCBkYXlzTGVmdDogbnVtYmVyID0gNyAtIHdlZWsubGVuZ3RoO1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGRheXNMZWZ0OyBqKyspIHtcbiAgICAgICAgICBjb25zdCBkYXRlOiBJTXlEYXRlID0ge3llYXI6IHksIG1vbnRoOiBtLCBkYXk6IGRheU5icn07XG4gICAgICAgICAgd2Vlay5wdXNoKHtcbiAgICAgICAgICAgIGRhdGVPYmo6IGRhdGUsXG4gICAgICAgICAgICBjbW8sXG4gICAgICAgICAgICBjdXJyRGF5OiB0aGlzLmlzQ3VyckRheShkYXlOYnIsIG0sIHksIHRvZGF5KSxcbiAgICAgICAgICAgIGRpc2FibGVkRGF0ZTogdGhpcy51dGlsU2VydmljZS5pc0Rpc2FibGVkRGF0ZShkYXRlLCB0aGlzLm9wdHMpLFxuICAgICAgICAgICAgbWFya2VkRGF0ZTogdGhpcy51dGlsU2VydmljZS5pc01hcmtlZERhdGUoZGF0ZSwgdGhpcy5vcHRzKSxcbiAgICAgICAgICAgIGxhYmVsZWREYXRlOiB0aGlzLnV0aWxTZXJ2aWNlLmlzTGFiZWxlZERhdGUoZGF0ZSwgdGhpcy5vcHRzLmxhYmVsRGF0ZXMpLFxuICAgICAgICAgICAgaGlnaGxpZ2h0OiB0aGlzLnV0aWxTZXJ2aWNlLmlzSGlnaGxpZ2h0ZWREYXRlKGRhdGUsIHRoaXMub3B0cyksXG4gICAgICAgICAgICByb3c6IGkgLSAxLFxuICAgICAgICAgICAgY29sOiBydGwgPyBjb2wtLSA6IGNvbCsrXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgZGF5TmJyKys7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICAvLyBSZXN0IG9mIHRoZSB3ZWVrc1xuICAgICAgICBmb3IgKGxldCBqID0gMTsgaiA8IDg7IGorKykge1xuICAgICAgICAgIGlmIChkYXlOYnIgPiBkSW5UaGlzTSkge1xuICAgICAgICAgICAgLy8gTmV4dCBtb250aFxuICAgICAgICAgICAgZGF5TmJyID0gMTtcbiAgICAgICAgICAgIGNtbyA9IE1vbnRoSWQubmV4dDtcbiAgICAgICAgICAgIG1vbnRoID0gbSArIDE7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IGRhdGU6IElNeURhdGUgPSB7eWVhcjogY21vID09PSBNb250aElkLm5leHQgJiYgbSA9PT0gMTIgPyB5ICsgMSA6IHksIG1vbnRoOiBjbW8gPT09IE1vbnRoSWQuY3VyciA/IG0gOiBjbW8gPT09IE1vbnRoSWQubmV4dCAmJiBtIDwgMTIgPyBtICsgMSA6IDEsIGRheTogZGF5TmJyfTtcbiAgICAgICAgICB3ZWVrLnB1c2goe1xuICAgICAgICAgICAgZGF0ZU9iajogZGF0ZSxcbiAgICAgICAgICAgIGNtbyxcbiAgICAgICAgICAgIGN1cnJEYXk6IHRoaXMuaXNDdXJyRGF5KGRheU5iciwgbW9udGgsIHksIHRvZGF5KSxcbiAgICAgICAgICAgIGRpc2FibGVkRGF0ZTogdGhpcy51dGlsU2VydmljZS5pc0Rpc2FibGVkRGF0ZShkYXRlLCB0aGlzLm9wdHMpLFxuICAgICAgICAgICAgbWFya2VkRGF0ZTogdGhpcy51dGlsU2VydmljZS5pc01hcmtlZERhdGUoZGF0ZSwgdGhpcy5vcHRzKSxcbiAgICAgICAgICAgIGxhYmVsZWREYXRlOiB0aGlzLnV0aWxTZXJ2aWNlLmlzTGFiZWxlZERhdGUoZGF0ZSwgdGhpcy5vcHRzLmxhYmVsRGF0ZXMpLFxuICAgICAgICAgICAgaGlnaGxpZ2h0OiB0aGlzLnV0aWxTZXJ2aWNlLmlzSGlnaGxpZ2h0ZWREYXRlKGRhdGUsIHRoaXMub3B0cyksXG4gICAgICAgICAgICByb3c6IGkgLSAxLFxuICAgICAgICAgICAgY29sOiBydGwgPyBjb2wtLSA6IGNvbCsrXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgZGF5TmJyKys7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IHdlZWtOYnI6IG51bWJlciA9IHNob3dXZWVrTnVtYmVycyAgJiYgZmlyc3REYXlPZldlZWsgPT09IE1PID8gdGhpcy51dGlsU2VydmljZS5nZXRXZWVrTnVtYmVyKHdlZWtbMF0uZGF0ZU9iaikgOiAwO1xuICAgICAgdGhpcy5kYXRlcy5wdXNoKHt3ZWVrLCB3ZWVrTmJyfSk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXREYXRlVmlld0hlYWRlckJ0bkRpc2FibGVkU3RhdGUobSwgeSk7XG5cbiAgICBpZiAobm90aWZ5Q2hhbmdlKSB7XG4gICAgICAvLyBOb3RpZnkgcGFyZW50XG4gICAgICB0aGlzLmNhbGVuZGFyVmlld0NoYW5nZWQoe3llYXI6IHksIG1vbnRoOiBtLCBmaXJzdDoge251bWJlcjogMSwgd2Vla2RheTogdGhpcy5nZXRXZWVrZGF5KHt5ZWFyOiB5LCBtb250aDogbSwgZGF5OiAxfSl9LCBsYXN0OiB7bnVtYmVyOiBkSW5UaGlzTSwgd2Vla2RheTogdGhpcy5nZXRXZWVrZGF5KHt5ZWFyOiB5LCBtb250aDogbSwgZGF5OiBkSW5UaGlzTX0pfX0pO1xuICAgIH1cbiAgfVxuXG4gIHNldERhdGVWaWV3SGVhZGVyQnRuRGlzYWJsZWRTdGF0ZShtOiBudW1iZXIsIHk6IG51bWJlcik6IHZvaWQge1xuICAgIGxldCBkcG06IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBsZXQgZG5tOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBjb25zdCB7ZGlzYWJsZUhlYWRlckJ1dHRvbnMsIGRpc2FibGVVbnRpbCwgZGlzYWJsZVNpbmNlLCBlbmFibGVEYXRlcywgbWluWWVhciwgbWF4WWVhciwgcnRsfSA9IHRoaXMub3B0cztcblxuICAgIGlmIChkaXNhYmxlSGVhZGVyQnV0dG9ucykge1xuICAgICAgY29uc3QgZHVEYXRlOiBJTXlEYXRlID0ge3llYXI6IG0gPT09IDEgPyB5IC0gMSA6IHksIG1vbnRoOiBtID09PSAxID8gMTIgOiBtIC0gMSwgZGF5OiB0aGlzLnV0aWxTZXJ2aWNlLmRhdGVzSW5Nb250aChtID09PSAxID8gMTIgOiBtIC0gMSwgbSA9PT0gMSA/IHkgLSAxIDogeSl9O1xuICAgICAgY29uc3QgZHNEYXRlOiBJTXlEYXRlID0ge3llYXI6IG0gPT09IDEyID8geSArIDEgOiB5LCBtb250aDogbSA9PT0gMTIgPyAxIDogbSArIDEsIGRheTogMX07XG5cbiAgICAgIGRwbSA9IHRoaXMudXRpbFNlcnZpY2UuaXNEaXNhYmxlZEJ5RGlzYWJsZVVudGlsKGR1RGF0ZSwgZGlzYWJsZVVudGlsKVxuICAgICAgICAmJiAhdGhpcy51dGlsU2VydmljZS5pc1Bhc3REYXRlc0VuYWJsZWQoZHVEYXRlLCBlbmFibGVEYXRlcyk7XG4gICAgICBkbm0gPSB0aGlzLnV0aWxTZXJ2aWNlLmlzRGlzYWJsZWRCeURpc2FibGVTaW5jZShkc0RhdGUsIGRpc2FibGVTaW5jZSlcbiAgICAgICAgJiYgIXRoaXMudXRpbFNlcnZpY2UuaXNGdXR1cmVEYXRlc0VuYWJsZWQoZHNEYXRlLCBlbmFibGVEYXRlcyk7XG4gICAgfVxuXG4gICAgdGhpcy5wcmV2Vmlld0Rpc2FibGVkID0gbSA9PT0gMSAmJiB5ID09PSBtaW5ZZWFyIHx8IGRwbTtcbiAgICB0aGlzLm5leHRWaWV3RGlzYWJsZWQgPSBtID09PSAxMiAmJiB5ID09PSBtYXhZZWFyIHx8IGRubTtcblxuICAgIGlmIChydGwpIHtcbiAgICAgIHRoaXMuc3dhcEhlYWRlckJ0bkRpc2FibGVkKCk7XG4gICAgfVxuICB9XG5cbiAgc2V0TW9udGhWaWV3SGVhZGVyQnRuRGlzYWJsZWRTdGF0ZSh5OiBudW1iZXIpOiB2b2lkIHtcbiAgICBsZXQgZHBtOiBib29sZWFuID0gZmFsc2U7XG4gICAgbGV0IGRubTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgY29uc3Qge2Rpc2FibGVIZWFkZXJCdXR0b25zLCBkaXNhYmxlVW50aWwsIGRpc2FibGVTaW5jZSwgZW5hYmxlRGF0ZXMsIG1pblllYXIsIG1heFllYXIsIHJ0bH0gPSB0aGlzLm9wdHM7XG5cbiAgICBpZiAoZGlzYWJsZUhlYWRlckJ1dHRvbnMpIHtcbiAgICAgIGNvbnN0IGR1RGF0ZTogSU15RGF0ZSA9IHt5ZWFyOiB5IC0gMSwgbW9udGg6IDEyLCBkYXk6IDMxfTtcbiAgICAgIGNvbnN0IGRzRGF0ZTogSU15RGF0ZSA9IHt5ZWFyOiB5ICsgMSwgbW9udGg6IDEsIGRheTogMX07XG5cbiAgICAgIGRwbSA9IHRoaXMudXRpbFNlcnZpY2UuaXNEaXNhYmxlZEJ5RGlzYWJsZVVudGlsKGR1RGF0ZSwgZGlzYWJsZVVudGlsKVxuICAgICAgICAmJiAhdGhpcy51dGlsU2VydmljZS5pc1Bhc3REYXRlc0VuYWJsZWQoZHVEYXRlLCBlbmFibGVEYXRlcyk7XG4gICAgICBkbm0gPSB0aGlzLnV0aWxTZXJ2aWNlLmlzRGlzYWJsZWRCeURpc2FibGVTaW5jZShkc0RhdGUsIGRpc2FibGVTaW5jZSlcbiAgICAgICAgJiYgIXRoaXMudXRpbFNlcnZpY2UuaXNGdXR1cmVEYXRlc0VuYWJsZWQoZHNEYXRlLCBlbmFibGVEYXRlcyk7XG4gICAgfVxuXG4gICAgdGhpcy5wcmV2Vmlld0Rpc2FibGVkID0geSA9PT0gbWluWWVhciB8fCBkcG07XG4gICAgdGhpcy5uZXh0Vmlld0Rpc2FibGVkID0geSA9PT0gbWF4WWVhciB8fCBkbm07XG5cbiAgICBpZiAocnRsKSB7XG4gICAgICB0aGlzLnN3YXBIZWFkZXJCdG5EaXNhYmxlZCgpO1xuICAgIH1cbiAgfVxuXG4gIHNldFllYXJWaWV3SGVhZGVyQnRuRGlzYWJsZWRTdGF0ZSh5cDogbnVtYmVyLCB5bjogbnVtYmVyKTogdm9pZCB7XG4gICAgbGV0IGRweTogYm9vbGVhbiA9IGZhbHNlO1xuICAgIGxldCBkbnk6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIGNvbnN0IHtkaXNhYmxlSGVhZGVyQnV0dG9ucywgZGlzYWJsZVVudGlsLCBkaXNhYmxlU2luY2UsIGVuYWJsZURhdGVzLCBtaW5ZZWFyLCBtYXhZZWFyLCBydGx9ID0gdGhpcy5vcHRzO1xuXG4gICAgaWYgKGRpc2FibGVIZWFkZXJCdXR0b25zKSB7XG4gICAgICBjb25zdCBkdURhdGU6IElNeURhdGUgPSB7eWVhcjogeXAgLSAxLCBtb250aDogMTIsIGRheTogMzF9O1xuICAgICAgY29uc3QgZHNEYXRlOiBJTXlEYXRlID0ge3llYXI6IHluICsgMSwgbW9udGg6IDEsIGRheTogMX07XG5cbiAgICAgIGRweSA9IHRoaXMudXRpbFNlcnZpY2UuaXNEaXNhYmxlZEJ5RGlzYWJsZVVudGlsKGR1RGF0ZSwgZGlzYWJsZVVudGlsKVxuICAgICAgICAmJiAhdGhpcy51dGlsU2VydmljZS5pc1Bhc3REYXRlc0VuYWJsZWQoZHVEYXRlLCBlbmFibGVEYXRlcyk7XG4gICAgICBkbnkgPSB0aGlzLnV0aWxTZXJ2aWNlLmlzRGlzYWJsZWRCeURpc2FibGVTaW5jZShkc0RhdGUsIGRpc2FibGVTaW5jZSlcbiAgICAgICAgJiYgIXRoaXMudXRpbFNlcnZpY2UuaXNGdXR1cmVEYXRlc0VuYWJsZWQoZHNEYXRlLCBlbmFibGVEYXRlcyk7XG4gICAgfVxuICAgIHRoaXMucHJldlZpZXdEaXNhYmxlZCA9IHlwIDw9IG1pblllYXIgfHwgZHB5O1xuICAgIHRoaXMubmV4dFZpZXdEaXNhYmxlZCA9IHluID49IG1heFllYXIgfHwgZG55O1xuXG4gICAgaWYgKHJ0bCkge1xuICAgICAgdGhpcy5zd2FwSGVhZGVyQnRuRGlzYWJsZWQoKTtcbiAgICB9XG4gIH1cblxuICBzd2FwSGVhZGVyQnRuRGlzYWJsZWQoKTogdm9pZCB7XG4gICAgW3RoaXMucHJldlZpZXdEaXNhYmxlZCwgdGhpcy5uZXh0Vmlld0Rpc2FibGVkXSA9IFt0aGlzLm5leHRWaWV3RGlzYWJsZWQsIHRoaXMucHJldlZpZXdEaXNhYmxlZF07XG4gIH1cbn1cbiJdfQ==