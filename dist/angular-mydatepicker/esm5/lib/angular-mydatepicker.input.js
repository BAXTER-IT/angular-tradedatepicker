/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Directive, Input, ElementRef, ViewContainerRef, Renderer2, ChangeDetectorRef, ComponentFactoryResolver, forwardRef, EventEmitter, Output, HostListener } from "@angular/core";
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from "@angular/forms";
import { CalendarComponent } from "./components/calendar/calendar.component";
import { LocaleService } from "./services/angular-mydatepicker.locale.service";
import { UtilService } from "./services/angular-mydatepicker.util.service";
import { DefaultConfigService } from "./services/angular-mydatepicker.config.service";
import { CalToggle } from "./enums/cal-toggle.enum";
import { Year } from "./enums/year.enum";
import { KeyCode } from "./enums/key-code.enum";
import { CalAnimation } from "./enums/cal-animation.enum";
import { KEYUP, BLUR, EMPTY_STR, DISABLED, CLICK, BODY, VALUE, PREVENT_CLOSE_TIMEOUT, OPTIONS, DEFAULT_MONTH, LOCALE, OBJECT, PX, INNER_HTML, ANIMATION_END, ANIMATION_TIMEOUT } from "./constants/constants";
/** @type {?} */
var NGX_DP_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef((/**
     * @return {?}
     */
    function () { return AngularMyDatePickerDirective; })),
    multi: true
};
/** @type {?} */
var NGX_DP_VALIDATORS = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef((/**
     * @return {?}
     */
    function () { return AngularMyDatePickerDirective; })),
    multi: true
};
var AngularMyDatePickerDirective = /** @class */ (function () {
    function AngularMyDatePickerDirective(localeService, utilService, vcRef, cfr, renderer, cdr, elem, config) {
        var _this = this;
        this.localeService = localeService;
        this.utilService = utilService;
        this.vcRef = vcRef;
        this.cfr = cfr;
        this.renderer = renderer;
        this.cdr = cdr;
        this.elem = elem;
        this.config = config;
        this.defaultMonth = { defMonth: EMPTY_STR, overrideSelection: false };
        this.dateChanged = new EventEmitter();
        this.inputFieldChanged = new EventEmitter();
        this.calendarViewChanged = new EventEmitter();
        this.calendarToggle = new EventEmitter();
        this.rangeDateSelection = new EventEmitter();
        this.viewActivated = new EventEmitter();
        this.cRef = null;
        this.hostText = EMPTY_STR;
        this.preventClose = false;
        this.disabled = false;
        this.selectedValue = null;
        this.onChangeCb = (/**
         * @return {?}
         */
        function () { });
        this.onTouchedCb = (/**
         * @return {?}
         */
        function () { });
        this.onClickWrapper = (/**
         * @param {?} event
         * @return {?}
         */
        function (event) { return _this.onClick(event); });
        this.onAnimateWrapper = (/**
         * @param {?} reason
         * @return {?}
         */
        function (reason) { return _this.animationEnd(reason); });
        this.opts = this.config.getDefaultConfig();
        this.parseOptions(this.opts);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    AngularMyDatePickerDirective.prototype.onKeyUp = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        /** @type {?} */
        var keyCode = this.utilService.getKeyCodeFromEvent(event);
        if (this.ignoreKeyPress(keyCode)) {
            return;
        }
        if (keyCode === KeyCode.esc) {
            this.closeSelector(CalToggle.CloseByEsc);
        }
        else {
            var _a = this.opts, dateRange = _a.dateRange, dateFormat = _a.dateFormat, monthLabels = _a.monthLabels, dateRangeDatesDelimiter = _a.dateRangeDatesDelimiter;
            /** @type {?} */
            var value = this.getHostValue();
            /** @type {?} */
            var dateModel = null;
            /** @type {?} */
            var valid = false;
            /** @type {?} */
            var validateOpts = null;
            if (!dateRange) {
                validateOpts = { validateDisabledDates: true, selectedValue: this.utilService.getSelectedValue(this.selectedValue, false) };
                /** @type {?} */
                var date = this.utilService.isDateValid(value, this.opts, validateOpts);
                valid = this.utilService.isInitializedDate(date);
                if (valid) {
                    dateModel = this.utilService.getDateModel(date, null, dateFormat, monthLabels, dateRangeDatesDelimiter);
                }
            }
            else {
                validateOpts = { validateDisabledDates: true, selectedValue: this.utilService.getSelectedValue(this.selectedValue, true) };
                /** @type {?} */
                var range = this.utilService.isDateValidDateRange(value, this.opts, validateOpts);
                var begin = range.begin, end = range.end;
                valid = this.utilService.isInitializedDate(begin) && this.utilService.isInitializedDate(end);
                if (valid) {
                    dateModel = this.utilService.getDateModel(null, range, dateFormat, monthLabels, dateRangeDatesDelimiter);
                }
            }
            this.onChangeCb(dateModel);
            this.emitInputFieldChanged(value, valid);
        }
    };
    /**
     * @return {?}
     */
    AngularMyDatePickerDirective.prototype.onBlur = /**
     * @return {?}
     */
    function () {
        var _a = this.opts, inputFieldValidation = _a.inputFieldValidation, dateRange = _a.dateRange, dateFormat = _a.dateFormat, monthLabels = _a.monthLabels, dateRangeDatesDelimiter = _a.dateRangeDatesDelimiter, closeSelectorOnDateSelect = _a.closeSelectorOnDateSelect;
        if (inputFieldValidation) {
            /** @type {?} */
            var value = this.getHostValue();
            /** @type {?} */
            var valid = false;
            /** @type {?} */
            var validateOpts = null;
            if (!dateRange) {
                validateOpts = { validateDisabledDates: true, selectedValue: this.utilService.getSelectedValue(this.selectedValue, false) };
                /** @type {?} */
                var date = this.utilService.isDateValid(value, this.opts, validateOpts);
                valid = this.utilService.isInitializedDate(date);
                if (valid && this.hostText !== value) {
                    // Valid date
                    /** @type {?} */
                    var dateModel = this.utilService.getDateModel(date, null, dateFormat, monthLabels, dateRangeDatesDelimiter);
                    this.emitDateChanged(dateModel);
                    this.updateModel(dateModel);
                    if (closeSelectorOnDateSelect) {
                        this.closeSelector(CalToggle.CloseByDateSel);
                    }
                }
            }
            else {
                validateOpts = { validateDisabledDates: true, selectedValue: this.utilService.getSelectedValue(this.selectedValue, true) };
                /** @type {?} */
                var dateRange_1 = this.utilService.isDateValidDateRange(value, this.opts, validateOpts);
                var begin = dateRange_1.begin, end = dateRange_1.end;
                valid = this.utilService.isInitializedDate(begin) && this.utilService.isInitializedDate(end);
                if (valid && this.hostText !== value) {
                    // Valid date range
                    /** @type {?} */
                    var dateModel = this.utilService.getDateModel(null, dateRange_1, dateFormat, monthLabels, dateRangeDatesDelimiter);
                    this.emitDateChanged(dateModel);
                    this.updateModel(dateModel);
                    if (closeSelectorOnDateSelect) {
                        this.closeSelector(CalToggle.CloseByDateSel);
                    }
                }
            }
            if (!valid && this.hostText !== value) {
                if (value === EMPTY_STR) {
                    this.clearDate();
                }
                else {
                    this.onChangeCb(null);
                }
            }
            this.hostText = value;
        }
        this.onTouchedCb();
    };
    /**
     * @private
     * @param {?} event
     * @return {?}
     */
    AngularMyDatePickerDirective.prototype.onClick = /**
     * @private
     * @param {?} event
     * @return {?}
     */
    function (event) {
        if (this.opts.closeSelectorOnDocumentClick && !this.preventClose && event.target && this.cRef
            && this.elem.nativeElement !== event.target && !this.cRef.location.nativeElement.contains(event.target)
            && !this.disabled) {
            this.closeSelector(CalToggle.CloseByOutClick);
        }
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    AngularMyDatePickerDirective.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        if (changes.hasOwnProperty(LOCALE)) {
            this.setLocaleOptions();
        }
        if (changes.hasOwnProperty(DEFAULT_MONTH)) {
            /** @type {?} */
            var dm = changes[DEFAULT_MONTH].currentValue;
            if (typeof dm === OBJECT) {
                if (!dm.overrideSelection) {
                    dm.overrideSelection = false;
                }
            }
            else {
                dm = { defMonth: dm, overrideSelection: false };
            }
            this.defaultMonth = dm;
        }
        if (changes.hasOwnProperty(OPTIONS)) {
            this.parseOptions(changes[OPTIONS].currentValue);
        }
        if (this.cRef) {
            this.cRef.instance.refreshComponent(this.opts, this.defaultMonth, this.selectedValue, this.getHostValue());
        }
    };
    /**
     * @return {?}
     */
    AngularMyDatePickerDirective.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.closeCalendar();
    };
    /**
     * @return {?}
     */
    AngularMyDatePickerDirective.prototype.setLocaleOptions = /**
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var opts = this.localeService.getLocaleOptions(this.locale);
        Object.keys(opts).forEach((/**
         * @param {?} k
         * @return {?}
         */
        function (k) {
            ((/** @type {?} */ (_this.opts)))[k] = opts[k];
        }));
    };
    /**
     * @param {?} opts
     * @return {?}
     */
    AngularMyDatePickerDirective.prototype.parseOptions = /**
     * @param {?} opts
     * @return {?}
     */
    function (opts) {
        var _this = this;
        if (opts) {
            Object.keys(opts).forEach((/**
             * @param {?} k
             * @return {?}
             */
            function (k) {
                ((/** @type {?} */ (_this.opts)))[k] = opts[k];
            }));
        }
        var _a = this.opts, minYear = _a.minYear, maxYear = _a.maxYear, openSelectorTopOfInput = _a.openSelectorTopOfInput, inline = _a.inline;
        if (minYear < Year.min) {
            this.opts.minYear = Year.min;
        }
        if (maxYear > Year.max) {
            this.opts.maxYear = Year.max;
        }
        if (openSelectorTopOfInput || inline) {
            this.opts.showSelectorArrow = false;
        }
        if (inline) {
            this.openCalendar();
        }
    };
    /**
     * @param {?} value
     * @return {?}
     */
    AngularMyDatePickerDirective.prototype.writeValue = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        if (this.disabled) {
            return;
        }
        /** @type {?} */
        var validateOpts = null;
        var _a = this.opts, dateFormat = _a.dateFormat, monthLabels = _a.monthLabels, dateRangeDatesDelimiter = _a.dateRangeDatesDelimiter, inline = _a.inline;
        if (!value) {
            this.setHostValue(EMPTY_STR);
            this.emitInputFieldChanged(EMPTY_STR, false);
            if (this.cRef) {
                this.cRef.instance.resetDateValue();
            }
        }
        else if (!value.isRange && value.singleDate) {
            // single date
            var _b = value.singleDate, date = _b.date, jsDate = _b.jsDate;
            if (!date) {
                date = this.utilService.jsDateToMyDate(jsDate);
            }
            /** @type {?} */
            var formatted = this.utilService.formatDate(date, dateFormat, monthLabels);
            validateOpts = { validateDisabledDates: false, selectedValue: this.utilService.getSelectedValue(this.selectedValue, false) };
            /** @type {?} */
            var valid = this.utilService.isInitializedDate(this.utilService.isDateValid(formatted, this.opts, validateOpts));
            if (valid) {
                this.setHostValue(formatted);
                this.emitInputFieldChanged(formatted, valid);
                this.setSelectedValue(this.utilService.getDateModel(date, null, dateFormat, monthLabels, dateRangeDatesDelimiter));
                if (this.cRef) {
                    this.cRef.instance.refreshComponent(this.opts, this.defaultMonth, this.selectedValue, this.getHostValue());
                }
            }
        }
        else if (value.isRange && value.dateRange) {
            // date range
            var _c = value.dateRange, beginDate = _c.beginDate, beginJsDate = _c.beginJsDate, endDate = _c.endDate, endJsDate = _c.endJsDate;
            if (!beginDate || !endDate) {
                beginDate = this.utilService.jsDateToMyDate(beginJsDate);
                endDate = this.utilService.jsDateToMyDate(endJsDate);
            }
            /** @type {?} */
            var formatted = this.utilService.formatDate(beginDate, dateFormat, monthLabels) + dateRangeDatesDelimiter +
                this.utilService.formatDate(endDate, dateFormat, monthLabels);
            validateOpts = { validateDisabledDates: false, selectedValue: this.utilService.getSelectedValue(this.selectedValue, true) };
            var _d = this.utilService.isDateValidDateRange(formatted, this.opts, validateOpts), begin = _d.begin, end = _d.end;
            /** @type {?} */
            var valid = this.utilService.isInitializedDate(begin) && this.utilService.isInitializedDate(end);
            if (valid) {
                this.setHostValue(formatted);
                this.emitInputFieldChanged(formatted, valid);
                /** @type {?} */
                var dateRange = { begin: beginDate, end: endDate };
                this.setSelectedValue(this.utilService.getDateModel(null, dateRange, dateFormat, monthLabels, dateRangeDatesDelimiter));
                if (this.cRef) {
                    this.cRef.instance.refreshComponent(this.opts, this.defaultMonth, this.selectedValue, this.getHostValue());
                }
            }
        }
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    AngularMyDatePickerDirective.prototype.registerOnChange = /**
     * @param {?} fn
     * @return {?}
     */
    function (fn) {
        this.onChangeCb = fn;
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    AngularMyDatePickerDirective.prototype.registerOnTouched = /**
     * @param {?} fn
     * @return {?}
     */
    function (fn) {
        this.onTouchedCb = fn;
    };
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    AngularMyDatePickerDirective.prototype.setDisabledState = /**
     * @param {?} isDisabled
     * @return {?}
     */
    function (isDisabled) {
        this.disabled = isDisabled;
        this.renderer.setProperty(this.elem.nativeElement, DISABLED, isDisabled);
        if (isDisabled) {
            this.closeCalendar();
        }
    };
    /**
     * @param {?} c
     * @return {?}
     */
    AngularMyDatePickerDirective.prototype.validate = /**
     * @param {?} c
     * @return {?}
     */
    function (c) {
        /** @type {?} */
        var value = this.getHostValue();
        if (value === null || value === EMPTY_STR) {
            return null;
        }
        /** @type {?} */
        var validateOpts = null;
        if (!this.opts.dateRange) {
            validateOpts = { validateDisabledDates: true, selectedValue: this.utilService.getSelectedValue(this.selectedValue, false) };
            /** @type {?} */
            var date = this.utilService.isDateValid(value, this.opts, validateOpts);
            if (!this.utilService.isInitializedDate(date)) {
                return { invalidDateFormat: true };
            }
        }
        else {
            validateOpts = { validateDisabledDates: true, selectedValue: this.utilService.getSelectedValue(this.selectedValue, true) };
            var _a = this.utilService.isDateValidDateRange(value, this.opts, validateOpts), begin = _a.begin, end = _a.end;
            if (!this.utilService.isInitializedDate(begin) || !this.utilService.isInitializedDate(end)) {
                return { invalidDateFormat: true };
            }
        }
        return null;
    };
    /**
     * @return {?}
     */
    AngularMyDatePickerDirective.prototype.openCalendar = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (this.disabled) {
            return;
        }
        this.preventClose = true;
        this.cdr.detectChanges();
        if (this.cRef === null) {
            this.cRef = this.vcRef.createComponent(this.cfr.resolveComponentFactory(CalendarComponent));
            this.appendSelector(this.cRef.location.nativeElement);
            this.cRef.instance.initializeComponent(this.opts, this.defaultMonth, this.selectedValue, this.getHostValue(), this.getSelectorPosition(this.elem.nativeElement), (/**
             * @param {?} dm
             * @param {?} close
             * @return {?}
             */
            function (dm, close) {
                _this.focusToInput();
                _this.emitDateChanged(dm);
                _this.emitInputFieldChanged(_this.utilService.getFormattedDate(dm), true);
                _this.updateModel(dm);
                if (close) {
                    _this.closeSelector(CalToggle.CloseByDateSel);
                }
            }), (/**
             * @param {?} cvc
             * @return {?}
             */
            function (cvc) {
                _this.emitCalendarChanged(cvc);
            }), (/**
             * @param {?} rds
             * @return {?}
             */
            function (rds) {
                _this.emitRangeDateSelection(rds);
            }), (/**
             * @param {?} va
             * @return {?}
             */
            function (va) {
                _this.emitViewActivated(va);
            }), (/**
             * @return {?}
             */
            function () {
                _this.closeSelector(CalToggle.CloseByEsc);
            }));
            this.emitCalendarToggle(CalToggle.Open);
            if (!this.opts.inline) {
                document.addEventListener(CLICK, this.onClickWrapper);
            }
        }
        setTimeout((/**
         * @return {?}
         */
        function () {
            _this.preventClose = false;
        }), PREVENT_CLOSE_TIMEOUT);
    };
    /**
     * @return {?}
     */
    AngularMyDatePickerDirective.prototype.closeCalendar = /**
     * @return {?}
     */
    function () {
        this.closeSelector(CalToggle.CloseByCalBtn);
    };
    /**
     * @return {?}
     */
    AngularMyDatePickerDirective.prototype.toggleCalendar = /**
     * @return {?}
     */
    function () {
        if (this.disabled) {
            return;
        }
        /** @type {?} */
        var isOpen = this.cRef === null;
        if (isOpen) {
            this.openCalendar();
        }
        else {
            this.closeSelector(CalToggle.CloseByCalBtn);
        }
        return isOpen;
    };
    /**
     * @return {?}
     */
    AngularMyDatePickerDirective.prototype.clearDate = /**
     * @return {?}
     */
    function () {
        if (this.disabled) {
            return;
        }
        var inline = this.opts.inline;
        this.setHostValue(EMPTY_STR);
        this.emitDateChanged({
            isRange: this.opts.dateRange,
            singleDate: {
                date: this.utilService.resetDate(),
                jsDate: null,
                formatted: EMPTY_STR,
                epoc: 0
            },
            dateRange: {
                beginDate: this.utilService.resetDate(),
                beginJsDate: null,
                beginEpoc: 0,
                endDate: this.utilService.resetDate(),
                endJsDate: null,
                endEpoc: 0,
                formatted: EMPTY_STR
            }
        });
        this.onChangeCb(null);
        this.onTouchedCb();
        if (this.cRef) {
            this.cRef.instance.clearDate();
        }
        if (!inline) {
            this.closeSelector(CalToggle.CloseByCalBtn);
        }
    };
    /**
     * @return {?}
     */
    AngularMyDatePickerDirective.prototype.isDateValid = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var value = this.getHostValue();
        if (value === null || value === EMPTY_STR) {
            return false;
        }
        /** @type {?} */
        var validateOpts = null;
        if (!this.opts.dateRange) {
            validateOpts = { validateDisabledDates: true, selectedValue: this.utilService.getSelectedValue(this.selectedValue, false) };
            /** @type {?} */
            var date = this.utilService.isDateValid(value, this.opts, validateOpts);
            if (this.utilService.isInitializedDate(date)) {
                this.emitInputFieldChanged(value, true);
                return true;
            }
        }
        else {
            validateOpts = { validateDisabledDates: true, selectedValue: this.utilService.getSelectedValue(this.selectedValue, true) };
            var _a = this.utilService.isDateValidDateRange(value, this.opts, validateOpts), begin = _a.begin, end = _a.end;
            if (this.utilService.isInitializedDate(begin) && this.utilService.isInitializedDate(end)) {
                this.emitInputFieldChanged(value, true);
                return true;
            }
        }
        this.emitInputFieldChanged(value, false);
        return false;
    };
    /**
     * @param {?} headerAction
     * @return {?}
     */
    AngularMyDatePickerDirective.prototype.headerAction = /**
     * @param {?} headerAction
     * @return {?}
     */
    function (headerAction) {
        if (this.cRef) {
            this.cRef.instance.headerAction(headerAction);
        }
    };
    /**
     * @private
     * @param {?} keyCode
     * @return {?}
     */
    AngularMyDatePickerDirective.prototype.ignoreKeyPress = /**
     * @private
     * @param {?} keyCode
     * @return {?}
     */
    function (keyCode) {
        return keyCode === KeyCode.leftArrow || keyCode === KeyCode.rightArrow || keyCode === KeyCode.upArrow || keyCode === KeyCode.downArrow || keyCode === KeyCode.tab || keyCode === KeyCode.shift;
    };
    /**
     * @private
     * @param {?} reason
     * @return {?}
     */
    AngularMyDatePickerDirective.prototype.animationEnd = /**
     * @private
     * @param {?} reason
     * @return {?}
     */
    function (reason) {
        if (this.cRef) {
            this.cRef.instance.selectorEl.nativeElement.removeEventListener(ANIMATION_END, this.onAnimateWrapper);
            this.removeComponent();
            this.emitCalendarToggle(reason);
        }
    };
    /**
     * @private
     * @param {?} reason
     * @return {?}
     */
    AngularMyDatePickerDirective.prototype.closeSelector = /**
     * @private
     * @param {?} reason
     * @return {?}
     */
    function (reason) {
        var _a = this.opts, inline = _a.inline, calendarAnimation = _a.calendarAnimation;
        if (this.cRef && !inline) {
            if (calendarAnimation.out !== CalAnimation.None) {
                var instance = this.cRef.instance;
                instance.selectorEl.nativeElement.addEventListener(ANIMATION_END, this.onAnimateWrapper.bind(this, reason));
                instance.setCalendarAnimation(calendarAnimation, false);
                // In case the animationend event is not fired
                setTimeout(this.onAnimateWrapper.bind(this, reason), ANIMATION_TIMEOUT);
            }
            else {
                this.removeComponent();
                this.emitCalendarToggle(reason);
            }
            document.removeEventListener(CLICK, this.onClickWrapper);
        }
    };
    /**
     * @private
     * @return {?}
     */
    AngularMyDatePickerDirective.prototype.removeComponent = /**
     * @private
     * @return {?}
     */
    function () {
        if (this.vcRef !== null) {
            this.vcRef.remove(this.vcRef.indexOf(this.cRef.hostView));
            this.cRef = null;
        }
    };
    /**
     * @private
     * @param {?} model
     * @return {?}
     */
    AngularMyDatePickerDirective.prototype.updateModel = /**
     * @private
     * @param {?} model
     * @return {?}
     */
    function (model) {
        this.setHostValue(this.utilService.getFormattedDate(model));
        this.onChangeCb(model);
        this.onTouchedCb();
    };
    /**
     * @private
     * @param {?} value
     * @return {?}
     */
    AngularMyDatePickerDirective.prototype.setHostValue = /**
     * @private
     * @param {?} value
     * @return {?}
     */
    function (value) {
        var divHostElement = this.opts.divHostElement;
        this.hostText = value;
        /** @type {?} */
        var valueType = !divHostElement.enabled ? VALUE : INNER_HTML;
        value = valueType === INNER_HTML && value === EMPTY_STR ? divHostElement.placeholder : value;
        this.renderer.setProperty(this.elem.nativeElement, valueType, value);
    };
    /**
     * @private
     * @return {?}
     */
    AngularMyDatePickerDirective.prototype.getHostValue = /**
     * @private
     * @return {?}
     */
    function () {
        var _a = this.elem.nativeElement, value = _a.value, innerHTML = _a.innerHTML;
        return !this.opts.divHostElement.enabled ? value : innerHTML;
    };
    /**
     * @private
     * @return {?}
     */
    AngularMyDatePickerDirective.prototype.focusToInput = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        var _a = this.opts, focusInputOnDateSelect = _a.focusInputOnDateSelect, divHostElement = _a.divHostElement;
        if (focusInputOnDateSelect && !divHostElement.enabled) {
            setTimeout((/**
             * @return {?}
             */
            function () {
                _this.elem.nativeElement.focus();
            }));
        }
    };
    /**
     * @private
     * @param {?} dateModel
     * @return {?}
     */
    AngularMyDatePickerDirective.prototype.emitDateChanged = /**
     * @private
     * @param {?} dateModel
     * @return {?}
     */
    function (dateModel) {
        this.dateChanged.emit(dateModel);
        this.setSelectedValue(dateModel);
    };
    /**
     * @private
     * @param {?} dateModel
     * @return {?}
     */
    AngularMyDatePickerDirective.prototype.setSelectedValue = /**
     * @private
     * @param {?} dateModel
     * @return {?}
     */
    function (dateModel) {
        var isRange = dateModel.isRange, dateRange = dateModel.dateRange, singleDate = dateModel.singleDate;
        this.selectedValue = isRange ? dateRange : singleDate;
    };
    /**
     * @private
     * @param {?} value
     * @param {?} valid
     * @return {?}
     */
    AngularMyDatePickerDirective.prototype.emitInputFieldChanged = /**
     * @private
     * @param {?} value
     * @param {?} valid
     * @return {?}
     */
    function (value, valid) {
        this.inputFieldChanged.emit({ value: value, dateFormat: this.opts.dateFormat, valid: valid });
    };
    /**
     * @private
     * @param {?} cvc
     * @return {?}
     */
    AngularMyDatePickerDirective.prototype.emitCalendarChanged = /**
     * @private
     * @param {?} cvc
     * @return {?}
     */
    function (cvc) {
        this.calendarViewChanged.emit(cvc);
    };
    /**
     * @private
     * @param {?} rds
     * @return {?}
     */
    AngularMyDatePickerDirective.prototype.emitRangeDateSelection = /**
     * @private
     * @param {?} rds
     * @return {?}
     */
    function (rds) {
        this.rangeDateSelection.emit(rds);
    };
    /**
     * @private
     * @param {?} va
     * @return {?}
     */
    AngularMyDatePickerDirective.prototype.emitViewActivated = /**
     * @private
     * @param {?} va
     * @return {?}
     */
    function (va) {
        this.viewActivated.emit(va);
    };
    /**
     * @private
     * @param {?} reason
     * @return {?}
     */
    AngularMyDatePickerDirective.prototype.emitCalendarToggle = /**
     * @private
     * @param {?} reason
     * @return {?}
     */
    function (reason) {
        this.calendarToggle.emit(reason);
    };
    /**
     * @private
     * @param {?} elem
     * @return {?}
     */
    AngularMyDatePickerDirective.prototype.appendSelector = /**
     * @private
     * @param {?} elem
     * @return {?}
     */
    function (elem) {
        if (this.opts.appendSelectorToBody) {
            document.querySelector(BODY).appendChild(elem);
        }
    };
    /**
     * @private
     * @param {?} elem
     * @return {?}
     */
    AngularMyDatePickerDirective.prototype.getSelectorPosition = /**
     * @private
     * @param {?} elem
     * @return {?}
     */
    function (elem) {
        /** @type {?} */
        var top = 0;
        /** @type {?} */
        var left = 0;
        var _a = this.opts, appendSelectorToBody = _a.appendSelectorToBody, openSelectorTopOfInput = _a.openSelectorTopOfInput, selectorHeight = _a.selectorHeight, selectorWidth = _a.selectorWidth, showSelectorArrow = _a.showSelectorArrow, alignSelectorRight = _a.alignSelectorRight;
        if (appendSelectorToBody) {
            /** @type {?} */
            var b = document.body.getBoundingClientRect();
            /** @type {?} */
            var e = elem.getBoundingClientRect();
            top = e.top - b.top;
            left = e.left - b.left;
        }
        if (openSelectorTopOfInput) {
            top = top - this.getSelectorDimension(selectorHeight) - 2;
        }
        else {
            top = top + elem.offsetHeight + (showSelectorArrow ? 12 : 2);
        }
        if (alignSelectorRight) {
            left = left + elem.offsetWidth - this.getSelectorDimension(selectorWidth);
        }
        return { top: top + PX, left: left + PX };
    };
    /**
     * @private
     * @param {?} value
     * @return {?}
     */
    AngularMyDatePickerDirective.prototype.getSelectorDimension = /**
     * @private
     * @param {?} value
     * @return {?}
     */
    function (value) {
        return Number(value.replace(PX, EMPTY_STR));
    };
    AngularMyDatePickerDirective.decorators = [
        { type: Directive, args: [{
                    selector: "[angular-mydatepicker]",
                    exportAs: "angular-mydatepicker",
                    providers: [UtilService, LocaleService, DefaultConfigService, NGX_DP_VALUE_ACCESSOR, NGX_DP_VALIDATORS]
                },] }
    ];
    /** @nocollapse */
    AngularMyDatePickerDirective.ctorParameters = function () { return [
        { type: LocaleService },
        { type: UtilService },
        { type: ViewContainerRef },
        { type: ComponentFactoryResolver },
        { type: Renderer2 },
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: DefaultConfigService }
    ]; };
    AngularMyDatePickerDirective.propDecorators = {
        options: [{ type: Input }],
        locale: [{ type: Input }],
        defaultMonth: [{ type: Input }],
        dateChanged: [{ type: Output }],
        inputFieldChanged: [{ type: Output }],
        calendarViewChanged: [{ type: Output }],
        calendarToggle: [{ type: Output }],
        rangeDateSelection: [{ type: Output }],
        viewActivated: [{ type: Output }],
        onKeyUp: [{ type: HostListener, args: [KEYUP, ["$event"],] }],
        onBlur: [{ type: HostListener, args: [BLUR,] }]
    };
    return AngularMyDatePickerDirective;
}());
export { AngularMyDatePickerDirective };
if (false) {
    /** @type {?} */
    AngularMyDatePickerDirective.prototype.options;
    /** @type {?} */
    AngularMyDatePickerDirective.prototype.locale;
    /** @type {?} */
    AngularMyDatePickerDirective.prototype.defaultMonth;
    /** @type {?} */
    AngularMyDatePickerDirective.prototype.dateChanged;
    /** @type {?} */
    AngularMyDatePickerDirective.prototype.inputFieldChanged;
    /** @type {?} */
    AngularMyDatePickerDirective.prototype.calendarViewChanged;
    /** @type {?} */
    AngularMyDatePickerDirective.prototype.calendarToggle;
    /** @type {?} */
    AngularMyDatePickerDirective.prototype.rangeDateSelection;
    /** @type {?} */
    AngularMyDatePickerDirective.prototype.viewActivated;
    /**
     * @type {?}
     * @private
     */
    AngularMyDatePickerDirective.prototype.cRef;
    /**
     * @type {?}
     * @private
     */
    AngularMyDatePickerDirective.prototype.hostText;
    /**
     * @type {?}
     * @private
     */
    AngularMyDatePickerDirective.prototype.preventClose;
    /**
     * @type {?}
     * @private
     */
    AngularMyDatePickerDirective.prototype.disabled;
    /**
     * @type {?}
     * @private
     */
    AngularMyDatePickerDirective.prototype.selectedValue;
    /**
     * @type {?}
     * @private
     */
    AngularMyDatePickerDirective.prototype.opts;
    /** @type {?} */
    AngularMyDatePickerDirective.prototype.onChangeCb;
    /** @type {?} */
    AngularMyDatePickerDirective.prototype.onTouchedCb;
    /**
     * @type {?}
     * @private
     */
    AngularMyDatePickerDirective.prototype.onClickWrapper;
    /**
     * @type {?}
     * @private
     */
    AngularMyDatePickerDirective.prototype.onAnimateWrapper;
    /**
     * @type {?}
     * @private
     */
    AngularMyDatePickerDirective.prototype.localeService;
    /**
     * @type {?}
     * @private
     */
    AngularMyDatePickerDirective.prototype.utilService;
    /**
     * @type {?}
     * @private
     */
    AngularMyDatePickerDirective.prototype.vcRef;
    /**
     * @type {?}
     * @private
     */
    AngularMyDatePickerDirective.prototype.cfr;
    /**
     * @type {?}
     * @private
     */
    AngularMyDatePickerDirective.prototype.renderer;
    /**
     * @type {?}
     * @private
     */
    AngularMyDatePickerDirective.prototype.cdr;
    /**
     * @type {?}
     * @private
     */
    AngularMyDatePickerDirective.prototype.elem;
    /**
     * @type {?}
     * @private
     */
    AngularMyDatePickerDirective.prototype.config;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1teWRhdGVwaWNrZXIuaW5wdXQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLXRyYWRlZGF0ZXBpY2tlci8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLW15ZGF0ZXBpY2tlci5pbnB1dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQWdCLFVBQVUsRUFBRSxnQkFBZ0IsRUFBRSxTQUFTLEVBQUUsaUJBQWlCLEVBQ2hHLHdCQUF3QixFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUE0QixZQUFZLEVBQVksTUFBTSxlQUFlLENBQUM7QUFDdEksT0FBTyxFQUF3QyxhQUFhLEVBQUUsaUJBQWlCLEVBQVksTUFBTSxnQkFBZ0IsQ0FBQztBQUNsSCxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSwwQ0FBMEMsQ0FBQztBQVczRSxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sZ0RBQWdELENBQUM7QUFDN0UsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLDhDQUE4QyxDQUFDO0FBQ3pFLE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLGdEQUFnRCxDQUFDO0FBQ3BGLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUNsRCxPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDdkMsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzlDLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSw0QkFBNEIsQ0FBQztBQUd4RCxPQUFPLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLHFCQUFxQixFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQ3pHLE1BQU0sRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxhQUFhLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQzs7SUFFM0YscUJBQXFCLEdBQUc7SUFDNUIsT0FBTyxFQUFFLGlCQUFpQjtJQUMxQixXQUFXLEVBQUUsVUFBVTs7O0lBQUMsY0FBTSxPQUFBLDRCQUE0QixFQUE1QixDQUE0QixFQUFDO0lBQzNELEtBQUssRUFBRSxJQUFJO0NBQ1o7O0lBRUssaUJBQWlCLEdBQUc7SUFDeEIsT0FBTyxFQUFFLGFBQWE7SUFDdEIsV0FBVyxFQUFFLFVBQVU7OztJQUFDLGNBQU0sT0FBQSw0QkFBNEIsRUFBNUIsQ0FBNEIsRUFBQztJQUMzRCxLQUFLLEVBQUUsSUFBSTtDQUNaO0FBRUQ7SUE0QkUsc0NBQW9CLGFBQTRCLEVBQzVCLFdBQXdCLEVBQ3hCLEtBQXVCLEVBQ3ZCLEdBQTZCLEVBQzdCLFFBQW1CLEVBQ25CLEdBQXNCLEVBQ3RCLElBQWdCLEVBQ2hCLE1BQTRCO1FBUGhELGlCQVVDO1FBVm1CLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQzVCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQ3hCLFVBQUssR0FBTCxLQUFLLENBQWtCO1FBQ3ZCLFFBQUcsR0FBSCxHQUFHLENBQTBCO1FBQzdCLGFBQVEsR0FBUixRQUFRLENBQVc7UUFDbkIsUUFBRyxHQUFILEdBQUcsQ0FBbUI7UUFDdEIsU0FBSSxHQUFKLElBQUksQ0FBWTtRQUNoQixXQUFNLEdBQU4sTUFBTSxDQUFzQjtRQTNCdkMsaUJBQVksR0FBb0IsRUFBQyxRQUFRLEVBQUUsU0FBUyxFQUFFLGlCQUFpQixFQUFFLEtBQUssRUFBQyxDQUFDO1FBRS9FLGdCQUFXLEdBQStCLElBQUksWUFBWSxFQUFnQixDQUFDO1FBQzNFLHNCQUFpQixHQUF1QyxJQUFJLFlBQVksRUFBd0IsQ0FBQztRQUNqRyx3QkFBbUIsR0FBeUMsSUFBSSxZQUFZLEVBQTBCLENBQUM7UUFDdkcsbUJBQWMsR0FBeUIsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUNsRSx1QkFBa0IsR0FBd0MsSUFBSSxZQUFZLEVBQXlCLENBQUM7UUFDcEcsa0JBQWEsR0FBNkIsSUFBSSxZQUFZLEVBQWMsQ0FBQztRQUUzRSxTQUFJLEdBQW9DLElBQUksQ0FBQztRQUM3QyxhQUFRLEdBQVcsU0FBUyxDQUFDO1FBQzdCLGlCQUFZLEdBQVksS0FBSyxDQUFDO1FBQzlCLGFBQVEsR0FBRyxLQUFLLENBQUM7UUFDakIsa0JBQWEsR0FBUSxJQUFJLENBQUM7UUFJbEMsZUFBVTs7O1FBQXFCLGNBQVEsQ0FBQyxFQUFDO1FBQ3pDLGdCQUFXOzs7UUFBZSxjQUFRLENBQUMsRUFBQztRQTBHNUIsbUJBQWM7Ozs7UUFBRyxVQUFDLEtBQVUsSUFBSyxPQUFBLEtBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQW5CLENBQW1CLEVBQUM7UUF1VXJELHFCQUFnQjs7OztRQUFHLFVBQUMsTUFBYyxJQUFLLE9BQUEsS0FBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsRUFBekIsQ0FBeUIsRUFBQztRQXZhdkUsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFDM0MsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDL0IsQ0FBQzs7Ozs7SUFFZ0MsOENBQU87Ozs7SUFBeEMsVUFBeUMsS0FBVTs7WUFDM0MsT0FBTyxHQUFXLElBQUksQ0FBQyxXQUFXLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDO1FBQ25FLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUNoQyxPQUFPO1NBQ1I7UUFFRCxJQUFJLE9BQU8sS0FBSyxPQUFPLENBQUMsR0FBRyxFQUFFO1lBQzNCLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQzFDO2FBQ0k7WUFDRyxJQUFBLGNBQXlFLEVBQXhFLHdCQUFTLEVBQUUsMEJBQVUsRUFBRSw0QkFBVyxFQUFFLG9EQUFvQzs7Z0JBQ3pFLEtBQUssR0FBVyxJQUFJLENBQUMsWUFBWSxFQUFFOztnQkFFckMsU0FBUyxHQUFpQixJQUFJOztnQkFDOUIsS0FBSyxHQUFZLEtBQUs7O2dCQUN0QixZQUFZLEdBQXVCLElBQUk7WUFDM0MsSUFBSSxDQUFDLFNBQVMsRUFBRTtnQkFDZCxZQUFZLEdBQUcsRUFBQyxxQkFBcUIsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsRUFBQyxDQUFDOztvQkFDcEgsSUFBSSxHQUFZLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQztnQkFDbEYsS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2pELElBQUksS0FBSyxFQUFFO29CQUNULFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztpQkFDekc7YUFDRjtpQkFDSTtnQkFDSCxZQUFZLEdBQUcsRUFBQyxxQkFBcUIsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsRUFBQyxDQUFDOztvQkFDbkgsS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsb0JBQW9CLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDO2dCQUM1RSxJQUFBLG1CQUFLLEVBQUUsZUFBRztnQkFDakIsS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDN0YsSUFBSSxLQUFLLEVBQUU7b0JBQ1QsU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO2lCQUMxRzthQUNGO1lBRUQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUMzQixJQUFJLENBQUMscUJBQXFCLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQzFDO0lBQ0gsQ0FBQzs7OztJQUVtQiw2Q0FBTTs7O0lBQTFCO1FBQ1EsSUFBQSxjQUEwSCxFQUF6SCw4Q0FBb0IsRUFBRSx3QkFBUyxFQUFFLDBCQUFVLEVBQUUsNEJBQVcsRUFBRSxvREFBdUIsRUFBRSx3REFBc0M7UUFFaEksSUFBSSxvQkFBb0IsRUFBRTs7Z0JBQ2xCLEtBQUssR0FBVyxJQUFJLENBQUMsWUFBWSxFQUFFOztnQkFFckMsS0FBSyxHQUFZLEtBQUs7O2dCQUN0QixZQUFZLEdBQXVCLElBQUk7WUFDM0MsSUFBSSxDQUFDLFNBQVMsRUFBRTtnQkFDZCxZQUFZLEdBQUcsRUFBQyxxQkFBcUIsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsRUFBQyxDQUFDOztvQkFDcEgsSUFBSSxHQUFZLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQztnQkFDbEYsS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2pELElBQUksS0FBSyxJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssS0FBSyxFQUFFOzs7d0JBRTlCLFNBQVMsR0FBaUIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLHVCQUF1QixDQUFDO29CQUMzSCxJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDO29CQUNoQyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO29CQUM1QixJQUFJLHlCQUF5QixFQUFFO3dCQUM3QixJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQztxQkFDOUM7aUJBQ0Y7YUFDRjtpQkFDSTtnQkFDSCxZQUFZLEdBQUcsRUFBQyxxQkFBcUIsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsRUFBQyxDQUFDOztvQkFDbkgsV0FBUyxHQUFpQixJQUFJLENBQUMsV0FBVyxDQUFDLG9CQUFvQixDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQztnQkFDOUYsSUFBQSx5QkFBSyxFQUFFLHFCQUFHO2dCQUNqQixLQUFLLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUM3RixJQUFJLEtBQUssSUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLEtBQUssRUFBRTs7O3dCQUU5QixTQUFTLEdBQWlCLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxXQUFTLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSx1QkFBdUIsQ0FBQztvQkFDaEksSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQztvQkFDaEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztvQkFDNUIsSUFBSSx5QkFBeUIsRUFBRTt3QkFDN0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLENBQUM7cUJBQzlDO2lCQUNGO2FBQ0Y7WUFFRCxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssS0FBSyxFQUFFO2dCQUNyQyxJQUFJLEtBQUssS0FBSyxTQUFTLEVBQUU7b0JBQ3ZCLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztpQkFDbEI7cUJBQ0k7b0JBQ0gsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDdkI7YUFDRjtZQUVELElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1NBQ3ZCO1FBRUQsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3JCLENBQUM7Ozs7OztJQUlPLDhDQUFPOzs7OztJQUFmLFVBQWdCLEtBQVU7UUFDeEIsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLDRCQUE0QixJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksSUFBSSxLQUFLLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxJQUFJO2VBQ3RGLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxLQUFLLEtBQUssQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7ZUFDcEcsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ3JCLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1NBQy9DO0lBQ0gsQ0FBQzs7Ozs7SUFFTSxrREFBVzs7OztJQUFsQixVQUFtQixPQUFzQjtRQUN2QyxJQUFJLE9BQU8sQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDbEMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7U0FDekI7UUFFRCxJQUFJLE9BQU8sQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLEVBQUU7O2dCQUNyQyxFQUFFLEdBQVEsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFlBQVk7WUFDakQsSUFBSSxPQUFPLEVBQUUsS0FBSyxNQUFNLEVBQUU7Z0JBQ3hCLElBQUksQ0FBQyxFQUFFLENBQUMsaUJBQWlCLEVBQUU7b0JBQ3pCLEVBQUUsQ0FBQyxpQkFBaUIsR0FBRyxLQUFLLENBQUM7aUJBQzlCO2FBQ0Y7aUJBQ0k7Z0JBQ0gsRUFBRSxHQUFHLEVBQUMsUUFBUSxFQUFFLEVBQUUsRUFBRSxpQkFBaUIsRUFBRSxLQUFLLEVBQUMsQ0FBQzthQUMvQztZQUVELElBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO1NBQ3hCO1FBRUQsSUFBSSxPQUFPLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ25DLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDO1NBQ2xEO1FBRUQsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ2IsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7U0FDNUc7SUFDSCxDQUFDOzs7O0lBRU0sa0RBQVc7OztJQUFsQjtRQUNFLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUN2QixDQUFDOzs7O0lBRU0sdURBQWdCOzs7SUFBdkI7UUFBQSxpQkFLQzs7WUFKTyxJQUFJLEdBQWUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3pFLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTzs7OztRQUFDLFVBQUMsQ0FBQztZQUMxQixDQUFDLG1CQUFhLEtBQUksQ0FBQyxJQUFJLEVBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4QyxDQUFDLEVBQUMsQ0FBQztJQUNMLENBQUM7Ozs7O0lBRU0sbURBQVk7Ozs7SUFBbkIsVUFBb0IsSUFBZ0I7UUFBcEMsaUJBd0JDO1FBdkJDLElBQUksSUFBSSxFQUFFO1lBQ1IsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPOzs7O1lBQUMsVUFBQyxDQUFDO2dCQUMxQixDQUFDLG1CQUFhLEtBQUksQ0FBQyxJQUFJLEVBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4QyxDQUFDLEVBQUMsQ0FBQztTQUNKO1FBRUssSUFBQSxjQUE4RCxFQUE3RCxvQkFBTyxFQUFFLG9CQUFPLEVBQUUsa0RBQXNCLEVBQUUsa0JBQW1CO1FBRXBFLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztTQUM5QjtRQUVELElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztTQUM5QjtRQUVELElBQUksc0JBQXNCLElBQUksTUFBTSxFQUFFO1lBQ3BDLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsS0FBSyxDQUFDO1NBQ3JDO1FBRUQsSUFBSSxNQUFNLEVBQUU7WUFDVixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7U0FDckI7SUFDSCxDQUFDOzs7OztJQUVNLGlEQUFVOzs7O0lBQWpCLFVBQWtCLEtBQVU7UUFDMUIsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2pCLE9BQU87U0FDUjs7WUFFRyxZQUFZLEdBQXVCLElBQUk7UUFDckMsSUFBQSxjQUFzRSxFQUFyRSwwQkFBVSxFQUFFLDRCQUFXLEVBQUUsb0RBQXVCLEVBQUUsa0JBQW1CO1FBRTVFLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDVixJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzdCLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFFN0MsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO2dCQUNiLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRSxDQUFDO2FBQ3JDO1NBQ0Y7YUFDSSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sSUFBSSxLQUFLLENBQUMsVUFBVSxFQUFFOztZQUV2QyxJQUFBLHFCQUFpQyxFQUFoQyxjQUFJLEVBQUUsa0JBQTBCO1lBQ3JDLElBQUksQ0FBQyxJQUFJLEVBQUU7Z0JBQ1QsSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQ2hEOztnQkFFSyxTQUFTLEdBQVcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxXQUFXLENBQUM7WUFFcEYsWUFBWSxHQUFHLEVBQUMscUJBQXFCLEVBQUUsS0FBSyxFQUFFLGFBQWEsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLEVBQUMsQ0FBQzs7Z0JBQ3JILEtBQUssR0FBWSxJQUFJLENBQUMsV0FBVyxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBQzNILElBQUksS0FBSyxFQUFFO2dCQUNULElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQzdCLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQzdDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsdUJBQXVCLENBQUMsQ0FBQyxDQUFDO2dCQUVuSCxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7b0JBQ2IsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7aUJBQzVHO2FBQ0Y7U0FDRjthQUNJLElBQUksS0FBSyxDQUFDLE9BQU8sSUFBSSxLQUFLLENBQUMsU0FBUyxFQUFFOztZQUVyQyxJQUFBLG9CQUE4RCxFQUE3RCx3QkFBUyxFQUFFLDRCQUFXLEVBQUUsb0JBQU8sRUFBRSx3QkFBNEI7WUFDbEUsSUFBSSxDQUFDLFNBQVMsSUFBSSxDQUFDLE9BQU8sRUFBRTtnQkFDMUIsU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUN6RCxPQUFPLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUM7YUFDdEQ7O2dCQUVLLFNBQVMsR0FBVyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLFdBQVcsQ0FBQyxHQUFHLHVCQUF1QjtnQkFDakgsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxXQUFXLENBQUM7WUFDL0QsWUFBWSxHQUFHLEVBQUMscUJBQXFCLEVBQUUsS0FBSyxFQUFFLGFBQWEsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLEVBQUMsQ0FBQztZQUNwSCxJQUFBLDhFQUF3RixFQUF2RixnQkFBSyxFQUFFLFlBQWdGOztnQkFDeEYsS0FBSyxHQUFZLElBQUksQ0FBQyxXQUFXLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUM7WUFDM0csSUFBSSxLQUFLLEVBQUU7Z0JBQ1QsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDN0IsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQzs7b0JBRXZDLFNBQVMsR0FBaUIsRUFBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUM7Z0JBQ2hFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsdUJBQXVCLENBQUMsQ0FBQyxDQUFDO2dCQUV4SCxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7b0JBQ2IsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7aUJBQzVHO2FBQ0Y7U0FDRjtJQUNILENBQUM7Ozs7O0lBRU0sdURBQWdCOzs7O0lBQXZCLFVBQXdCLEVBQU87UUFDN0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7SUFDdkIsQ0FBQzs7Ozs7SUFFTSx3REFBaUI7Ozs7SUFBeEIsVUFBeUIsRUFBTztRQUM5QixJQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztJQUN4QixDQUFDOzs7OztJQUVNLHVEQUFnQjs7OztJQUF2QixVQUF3QixVQUFtQjtRQUN6QyxJQUFJLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQztRQUMzQixJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFFekUsSUFBSSxVQUFVLEVBQUU7WUFDZCxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7U0FDdEI7SUFDSCxDQUFDOzs7OztJQUVNLCtDQUFROzs7O0lBQWYsVUFBZ0IsQ0FBa0I7O1lBQzFCLEtBQUssR0FBVyxJQUFJLENBQUMsWUFBWSxFQUFFO1FBRXpDLElBQUksS0FBSyxLQUFLLElBQUksSUFBSSxLQUFLLEtBQUssU0FBUyxFQUFFO1lBQ3pDLE9BQU8sSUFBSSxDQUFDO1NBQ2I7O1lBRUcsWUFBWSxHQUF1QixJQUFJO1FBQzNDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUN4QixZQUFZLEdBQUcsRUFBQyxxQkFBcUIsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsRUFBQyxDQUFDOztnQkFDcEgsSUFBSSxHQUFZLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQztZQUNsRixJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDN0MsT0FBTyxFQUFDLGlCQUFpQixFQUFFLElBQUksRUFBQyxDQUFDO2FBQ2xDO1NBQ0Y7YUFDSTtZQUNILFlBQVksR0FBRyxFQUFDLHFCQUFxQixFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxFQUFDLENBQUM7WUFDbkgsSUFBQSwwRUFBb0YsRUFBbkYsZ0JBQUssRUFBRSxZQUE0RTtZQUMxRixJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQzFGLE9BQU8sRUFBQyxpQkFBaUIsRUFBRSxJQUFJLEVBQUMsQ0FBQzthQUNsQztTQUNGO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDOzs7O0lBRU0sbURBQVk7OztJQUFuQjtRQUFBLGlCQThDQztRQTdDQyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDakIsT0FBTztTQUNSO1FBQ0QsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7UUFDekIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUN6QixJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssSUFBSSxFQUFFO1lBQ3RCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7WUFDNUYsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUN0RCxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FDcEMsSUFBSSxDQUFDLElBQUksRUFDVCxJQUFJLENBQUMsWUFBWSxFQUNqQixJQUFJLENBQUMsYUFBYSxFQUNsQixJQUFJLENBQUMsWUFBWSxFQUFFLEVBQ25CLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQzs7Ozs7WUFDakQsVUFBQyxFQUFnQixFQUFFLEtBQWM7Z0JBQy9CLEtBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztnQkFDcEIsS0FBSSxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDekIsS0FBSSxDQUFDLHFCQUFxQixDQUFDLEtBQUksQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ3hFLEtBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ3JCLElBQUksS0FBSyxFQUFFO29CQUNULEtBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDO2lCQUM5QztZQUNILENBQUM7Ozs7WUFDRCxVQUFDLEdBQTJCO2dCQUMxQixLQUFJLENBQUMsbUJBQW1CLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDaEMsQ0FBQzs7OztZQUNELFVBQUMsR0FBMEI7Z0JBQ3pCLEtBQUksQ0FBQyxzQkFBc0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNuQyxDQUFDOzs7O1lBQ0QsVUFBQyxFQUFjO2dCQUNiLEtBQUksQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUM3QixDQUFDOzs7WUFDRDtnQkFDRSxLQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUMzQyxDQUFDLEVBQ0YsQ0FBQztZQUNGLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFeEMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO2dCQUNyQixRQUFRLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQzthQUN2RDtTQUNGO1FBQ0QsVUFBVTs7O1FBQUM7WUFDVCxLQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztRQUM1QixDQUFDLEdBQUUscUJBQXFCLENBQUMsQ0FBQztJQUM1QixDQUFDOzs7O0lBRU0sb0RBQWE7OztJQUFwQjtRQUNFLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQzlDLENBQUM7Ozs7SUFFTSxxREFBYzs7O0lBQXJCO1FBQ0UsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2pCLE9BQU87U0FDUjs7WUFFSyxNQUFNLEdBQVksSUFBSSxDQUFDLElBQUksS0FBSyxJQUFJO1FBRTFDLElBQUksTUFBTSxFQUFFO1lBQ1YsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1NBQ3JCO2FBQ0k7WUFDSCxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQztTQUM3QztRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7Ozs7SUFFTSxnREFBUzs7O0lBQWhCO1FBQ0UsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2pCLE9BQU87U0FDUjtRQUVNLElBQUEseUJBQU07UUFFYixJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxlQUFlLENBQUM7WUFDbkIsT0FBTyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUztZQUM1QixVQUFVLEVBQUU7Z0JBQ1YsSUFBSSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFO2dCQUNsQyxNQUFNLEVBQUUsSUFBSTtnQkFDWixTQUFTLEVBQUUsU0FBUztnQkFDcEIsSUFBSSxFQUFFLENBQUM7YUFDUjtZQUNELFNBQVMsRUFBRTtnQkFDVCxTQUFTLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUU7Z0JBQ3ZDLFdBQVcsRUFBRSxJQUFJO2dCQUNqQixTQUFTLEVBQUUsQ0FBQztnQkFDWixPQUFPLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUU7Z0JBQ3JDLFNBQVMsRUFBRSxJQUFJO2dCQUNmLE9BQU8sRUFBRSxDQUFDO2dCQUNWLFNBQVMsRUFBRSxTQUFTO2FBQ3JCO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN0QixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFFbkIsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ2IsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLENBQUM7U0FDaEM7UUFFRCxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ1gsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDN0M7SUFDSCxDQUFDOzs7O0lBRU0sa0RBQVc7OztJQUFsQjs7WUFDUSxLQUFLLEdBQVcsSUFBSSxDQUFDLFlBQVksRUFBRTtRQUV6QyxJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtZQUN6QyxPQUFPLEtBQUssQ0FBQztTQUNkOztZQUVHLFlBQVksR0FBdUIsSUFBSTtRQUMzQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDeEIsWUFBWSxHQUFHLEVBQUMscUJBQXFCLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLEVBQUMsQ0FBQzs7Z0JBQ3BILElBQUksR0FBWSxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxZQUFZLENBQUM7WUFDbEYsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUM1QyxJQUFJLENBQUMscUJBQXFCLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUN4QyxPQUFPLElBQUksQ0FBQzthQUNiO1NBQ0Y7YUFDSTtZQUNILFlBQVksR0FBRyxFQUFDLHFCQUFxQixFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxFQUFDLENBQUM7WUFDbkgsSUFBQSwwRUFBb0YsRUFBbkYsZ0JBQUssRUFBRSxZQUE0RTtZQUMxRixJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDeEYsSUFBSSxDQUFDLHFCQUFxQixDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDeEMsT0FBTyxJQUFJLENBQUM7YUFDYjtTQUNGO1FBRUQsSUFBSSxDQUFDLHFCQUFxQixDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN6QyxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7Ozs7O0lBRU0sbURBQVk7Ozs7SUFBbkIsVUFBb0IsWUFBMEI7UUFDNUMsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ2IsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxDQUFDO1NBQy9DO0lBQ0gsQ0FBQzs7Ozs7O0lBRU8scURBQWM7Ozs7O0lBQXRCLFVBQXVCLE9BQWU7UUFDcEMsT0FBTyxPQUFPLEtBQUssT0FBTyxDQUFDLFNBQVMsSUFBSSxPQUFPLEtBQUssT0FBTyxDQUFDLFVBQVUsSUFBSSxPQUFPLEtBQUssT0FBTyxDQUFDLE9BQU8sSUFBSSxPQUFPLEtBQUssT0FBTyxDQUFDLFNBQVMsSUFBSSxPQUFPLEtBQUssT0FBTyxDQUFDLEdBQUcsSUFBSSxPQUFPLEtBQUssT0FBTyxDQUFDLEtBQUssQ0FBQztJQUNqTSxDQUFDOzs7Ozs7SUFJTyxtREFBWTs7Ozs7SUFBcEIsVUFBcUIsTUFBYztRQUNqQyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDYixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLG1CQUFtQixDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUN0RyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDdkIsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ2pDO0lBQ0gsQ0FBQzs7Ozs7O0lBRU8sb0RBQWE7Ozs7O0lBQXJCLFVBQXNCLE1BQWM7UUFDNUIsSUFBQSxjQUF1QyxFQUF0QyxrQkFBTSxFQUFFLHdDQUE4QjtRQUU3QyxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDeEIsSUFBSSxpQkFBaUIsQ0FBQyxHQUFHLEtBQUssWUFBWSxDQUFDLElBQUksRUFBRTtnQkFDeEMsSUFBQSw2QkFBUTtnQkFDZixRQUFRLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDNUcsUUFBUSxDQUFDLG9CQUFvQixDQUFDLGlCQUFpQixFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUV4RCw4Q0FBOEM7Z0JBQzlDLFVBQVUsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO2FBQ3pFO2lCQUNJO2dCQUNILElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztnQkFDdkIsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQ2pDO1lBRUQsUUFBUSxDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7U0FDMUQ7SUFDSCxDQUFDOzs7OztJQUVPLHNEQUFlOzs7O0lBQXZCO1FBQ0UsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLElBQUksRUFBRTtZQUN2QixJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDMUQsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7U0FDbEI7SUFDSCxDQUFDOzs7Ozs7SUFFTyxrREFBVzs7Ozs7SUFBbkIsVUFBb0IsS0FBbUI7UUFDckMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDNUQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN2QixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDckIsQ0FBQzs7Ozs7O0lBRU8sbURBQVk7Ozs7O0lBQXBCLFVBQXFCLEtBQWE7UUFDekIsSUFBQSx5Q0FBYztRQUNyQixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQzs7WUFDaEIsU0FBUyxHQUFXLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxVQUFVO1FBQ3RFLEtBQUssR0FBRyxTQUFTLEtBQUssVUFBVSxJQUFJLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUM3RixJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDdkUsQ0FBQzs7Ozs7SUFFTyxtREFBWTs7OztJQUFwQjtRQUNRLElBQUEsNEJBQTRDLEVBQTNDLGdCQUFLLEVBQUUsd0JBQW9DO1FBQ2xELE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0lBQy9ELENBQUM7Ozs7O0lBRU8sbURBQVk7Ozs7SUFBcEI7UUFBQSxpQkFPQztRQU5PLElBQUEsY0FBb0QsRUFBbkQsa0RBQXNCLEVBQUUsa0NBQTJCO1FBQzFELElBQUksc0JBQXNCLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFO1lBQ3JELFVBQVU7OztZQUFDO2dCQUNULEtBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2xDLENBQUMsRUFBQyxDQUFDO1NBQ0o7SUFDSCxDQUFDOzs7Ozs7SUFFTyxzREFBZTs7Ozs7SUFBdkIsVUFBd0IsU0FBdUI7UUFDN0MsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDakMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ25DLENBQUM7Ozs7OztJQUVPLHVEQUFnQjs7Ozs7SUFBeEIsVUFBeUIsU0FBdUI7UUFDdkMsSUFBQSwyQkFBTyxFQUFFLCtCQUFTLEVBQUUsaUNBQVU7UUFDckMsSUFBSSxDQUFDLGFBQWEsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO0lBQ3hELENBQUM7Ozs7Ozs7SUFFTyw0REFBcUI7Ozs7OztJQUE3QixVQUE4QixLQUFhLEVBQUUsS0FBYztRQUN6RCxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLEVBQUMsS0FBSyxPQUFBLEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEtBQUssT0FBQSxFQUFDLENBQUMsQ0FBQztJQUNoRixDQUFDOzs7Ozs7SUFFTywwREFBbUI7Ozs7O0lBQTNCLFVBQTRCLEdBQTJCO1FBQ3JELElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDckMsQ0FBQzs7Ozs7O0lBRU8sNkRBQXNCOzs7OztJQUE5QixVQUErQixHQUEwQjtRQUN2RCxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7Ozs7OztJQUVPLHdEQUFpQjs7Ozs7SUFBekIsVUFBMEIsRUFBYztRQUN0QyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUM5QixDQUFDOzs7Ozs7SUFFTyx5REFBa0I7Ozs7O0lBQTFCLFVBQTJCLE1BQWM7UUFDdkMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbkMsQ0FBQzs7Ozs7O0lBRU8scURBQWM7Ozs7O0lBQXRCLFVBQXVCLElBQVM7UUFDOUIsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFO1lBQ2xDLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ2hEO0lBQ0gsQ0FBQzs7Ozs7O0lBRU8sMERBQW1COzs7OztJQUEzQixVQUE0QixJQUFTOztZQUMvQixHQUFHLEdBQVcsQ0FBQzs7WUFDZixJQUFJLEdBQVcsQ0FBQztRQUVkLElBQUEsY0FBZ0ksRUFBL0gsOENBQW9CLEVBQUUsa0RBQXNCLEVBQUUsa0NBQWMsRUFBRSxnQ0FBYSxFQUFFLHdDQUFpQixFQUFFLDBDQUErQjtRQUV0SSxJQUFJLG9CQUFvQixFQUFFOztnQkFDbEIsQ0FBQyxHQUFRLFFBQVEsQ0FBQyxJQUFJLENBQUMscUJBQXFCLEVBQUU7O2dCQUM5QyxDQUFDLEdBQVEsSUFBSSxDQUFDLHFCQUFxQixFQUFFO1lBQzNDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUM7WUFDcEIsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztTQUN4QjtRQUVELElBQUksc0JBQXNCLEVBQUU7WUFDMUIsR0FBRyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQzNEO2FBQ0k7WUFDSCxHQUFHLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUM5RDtRQUVELElBQUksa0JBQWtCLEVBQUU7WUFDdEIsSUFBSSxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxhQUFhLENBQUMsQ0FBQztTQUMzRTtRQUNELE9BQU8sRUFBQyxHQUFHLEVBQUUsR0FBRyxHQUFHLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxHQUFHLEVBQUUsRUFBQyxDQUFDO0lBQzFDLENBQUM7Ozs7OztJQUVPLDJEQUFvQjs7Ozs7SUFBNUIsVUFBNkIsS0FBYTtRQUN4QyxPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBQzlDLENBQUM7O2dCQTdrQkYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSx3QkFBd0I7b0JBQ2xDLFFBQVEsRUFBRSxzQkFBc0I7b0JBQ2hDLFNBQVMsRUFBRSxDQUFDLFdBQVcsRUFBRSxhQUFhLEVBQUUsb0JBQW9CLEVBQUUscUJBQXFCLEVBQUUsaUJBQWlCLENBQUM7aUJBQ3hHOzs7O2dCQTVCTyxhQUFhO2dCQUNiLFdBQVc7Z0JBZmlDLGdCQUFnQjtnQkFDbEUsd0JBQXdCO2dCQUQ0QyxTQUFTO2dCQUFFLGlCQUFpQjtnQkFBMUQsVUFBVTtnQkFnQjFDLG9CQUFvQjs7OzBCQTRCekIsS0FBSzt5QkFDTCxLQUFLOytCQUNMLEtBQUs7OEJBRUwsTUFBTTtvQ0FDTixNQUFNO3NDQUNOLE1BQU07aUNBQ04sTUFBTTtxQ0FDTixNQUFNO2dDQUNOLE1BQU07MEJBeUJOLFlBQVksU0FBQyxLQUFLLEVBQUUsQ0FBQyxRQUFRLENBQUM7eUJBdUM5QixZQUFZLFNBQUMsSUFBSTs7SUErZnBCLG1DQUFDO0NBQUEsQUE5a0JELElBOGtCQztTQXprQlksNEJBQTRCOzs7SUFDdkMsK0NBQTZCOztJQUM3Qiw4Q0FBd0I7O0lBQ3hCLG9EQUF5Rjs7SUFFekYsbURBQXFGOztJQUNyRix5REFBMkc7O0lBQzNHLDJEQUFpSDs7SUFDakgsc0RBQTRFOztJQUM1RSwwREFBOEc7O0lBQzlHLHFEQUFtRjs7Ozs7SUFFbkYsNENBQXFEOzs7OztJQUNyRCxnREFBcUM7Ozs7O0lBQ3JDLG9EQUFzQzs7Ozs7SUFDdEMsZ0RBQXlCOzs7OztJQUN6QixxREFBa0M7Ozs7O0lBRWxDLDRDQUF5Qjs7SUFFekIsa0RBQXlDOztJQUN6QyxtREFBb0M7Ozs7O0lBMEdwQyxzREFBNkQ7Ozs7O0lBdVU3RCx3REFBeUU7Ozs7O0lBL2E3RCxxREFBb0M7Ozs7O0lBQ3BDLG1EQUFnQzs7Ozs7SUFDaEMsNkNBQStCOzs7OztJQUMvQiwyQ0FBcUM7Ozs7O0lBQ3JDLGdEQUEyQjs7Ozs7SUFDM0IsMkNBQThCOzs7OztJQUM5Qiw0Q0FBd0I7Ozs7O0lBQ3hCLDhDQUFvQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7RGlyZWN0aXZlLCBJbnB1dCwgQ29tcG9uZW50UmVmLCBFbGVtZW50UmVmLCBWaWV3Q29udGFpbmVyUmVmLCBSZW5kZXJlcjIsIENoYW5nZURldGVjdG9yUmVmLCBcbiAgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLCBmb3J3YXJkUmVmLCBFdmVudEVtaXR0ZXIsIE91dHB1dCwgU2ltcGxlQ2hhbmdlcywgT25DaGFuZ2VzLCBIb3N0TGlzdGVuZXIsIE9uRGVzdHJveX0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7QWJzdHJhY3RDb250cm9sLCBDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMSURBVE9SUywgTkdfVkFMVUVfQUNDRVNTT1IsIFZhbGlkYXRvcn0gZnJvbSBcIkBhbmd1bGFyL2Zvcm1zXCI7XG5pbXBvcnQge0NhbGVuZGFyQ29tcG9uZW50fSBmcm9tIFwiLi9jb21wb25lbnRzL2NhbGVuZGFyL2NhbGVuZGFyLmNvbXBvbmVudFwiO1xuaW1wb3J0IHtJTXlEYXRlfSBmcm9tIFwiLi9pbnRlcmZhY2VzL215LWRhdGUuaW50ZXJmYWNlXCI7XG5pbXBvcnQge0lNeU9wdGlvbnN9IGZyb20gXCIuL2ludGVyZmFjZXMvbXktb3B0aW9ucy5pbnRlcmZhY2VcIjtcbmltcG9ydCB7SU15RGF0ZU1vZGVsfSBmcm9tIFwiLi9pbnRlcmZhY2VzL215LWRhdGUtbW9kZWwuaW50ZXJmYWNlXCI7XG5pbXBvcnQge0lNeURhdGVSYW5nZX0gZnJvbSBcIi4vaW50ZXJmYWNlcy9teS1kYXRlLXJhbmdlLmludGVyZmFjZVwiO1xuaW1wb3J0IHtJTXlSYW5nZURhdGVTZWxlY3Rpb259IGZyb20gXCIuL2ludGVyZmFjZXMvbXktcmFuZ2UtZGF0ZS1zZWxlY3Rpb24uaW50ZXJmYWNlXCI7XG5pbXBvcnQge0lNeUNhbGVuZGFyVmlld0NoYW5nZWR9IGZyb20gXCIuL2ludGVyZmFjZXMvbXktY2FsZW5kYXItdmlldy1jaGFuZ2VkLmludGVyZmFjZVwiO1xuaW1wb3J0IHtJTXlJbnB1dEZpZWxkQ2hhbmdlZH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9teS1pbnB1dC1maWVsZC1jaGFuZ2VkLmludGVyZmFjZVwiO1xuaW1wb3J0IHtJTXlTZWxlY3RvclBvc2l0aW9ufSBmcm9tIFwiLi9pbnRlcmZhY2VzL215LXNlbGVjdG9yLXBvcy5pbnRlcmZhY2VcIjtcbmltcG9ydCB7SU15VmFsaWRhdGVPcHRpb25zfSBmcm9tIFwiLi9pbnRlcmZhY2VzL215LXZhbGlkYXRlLW9wdGlvbnMuaW50ZXJmYWNlXCI7XG5pbXBvcnQge0lNeURlZmF1bHRNb250aH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9teS1kZWZhdWx0LW1vbnRoLmludGVyZmFjZVwiO1xuaW1wb3J0IHtMb2NhbGVTZXJ2aWNlfSBmcm9tIFwiLi9zZXJ2aWNlcy9hbmd1bGFyLW15ZGF0ZXBpY2tlci5sb2NhbGUuc2VydmljZVwiO1xuaW1wb3J0IHtVdGlsU2VydmljZX0gZnJvbSBcIi4vc2VydmljZXMvYW5ndWxhci1teWRhdGVwaWNrZXIudXRpbC5zZXJ2aWNlXCI7XG5pbXBvcnQge0RlZmF1bHRDb25maWdTZXJ2aWNlfSBmcm9tIFwiLi9zZXJ2aWNlcy9hbmd1bGFyLW15ZGF0ZXBpY2tlci5jb25maWcuc2VydmljZVwiO1xuaW1wb3J0IHtDYWxUb2dnbGV9IGZyb20gXCIuL2VudW1zL2NhbC10b2dnbGUuZW51bVwiO1xuaW1wb3J0IHtZZWFyfSBmcm9tIFwiLi9lbnVtcy95ZWFyLmVudW1cIjtcbmltcG9ydCB7S2V5Q29kZX0gZnJvbSBcIi4vZW51bXMva2V5LWNvZGUuZW51bVwiO1xuaW1wb3J0IHtDYWxBbmltYXRpb259IGZyb20gXCIuL2VudW1zL2NhbC1hbmltYXRpb24uZW51bVwiO1xuaW1wb3J0IHtIZWFkZXJBY3Rpb259IGZyb20gXCIuL2VudW1zL2hlYWRlci1hY3Rpb24uZW51bVwiO1xuaW1wb3J0IHtBY3RpdmVWaWV3fSBmcm9tIFwiLi9lbnVtcy9hY3RpdmUtdmlldy5lbnVtXCI7XG5pbXBvcnQge0tFWVVQLCBCTFVSLCBFTVBUWV9TVFIsIERJU0FCTEVELCBDTElDSywgQk9EWSwgVkFMVUUsIFBSRVZFTlRfQ0xPU0VfVElNRU9VVCwgT1BUSU9OUywgREVGQVVMVF9NT05USCwgXG4gIExPQ0FMRSwgT0JKRUNULCBQWCwgSU5ORVJfSFRNTCwgQU5JTUFUSU9OX0VORCwgQU5JTUFUSU9OX1RJTUVPVVR9IGZyb20gXCIuL2NvbnN0YW50cy9jb25zdGFudHNcIjtcblxuY29uc3QgTkdYX0RQX1ZBTFVFX0FDQ0VTU09SID0ge1xuICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gQW5ndWxhck15RGF0ZVBpY2tlckRpcmVjdGl2ZSksXG4gIG11bHRpOiB0cnVlXG59O1xuXG5jb25zdCBOR1hfRFBfVkFMSURBVE9SUyA9IHtcbiAgcHJvdmlkZTogTkdfVkFMSURBVE9SUyxcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gQW5ndWxhck15RGF0ZVBpY2tlckRpcmVjdGl2ZSksXG4gIG11bHRpOiB0cnVlXG59O1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IFwiW2FuZ3VsYXItbXlkYXRlcGlja2VyXVwiLFxuICBleHBvcnRBczogXCJhbmd1bGFyLW15ZGF0ZXBpY2tlclwiLFxuICBwcm92aWRlcnM6IFtVdGlsU2VydmljZSwgTG9jYWxlU2VydmljZSwgRGVmYXVsdENvbmZpZ1NlcnZpY2UsIE5HWF9EUF9WQUxVRV9BQ0NFU1NPUiwgTkdYX0RQX1ZBTElEQVRPUlNdXG59KVxuZXhwb3J0IGNsYXNzIEFuZ3VsYXJNeURhdGVQaWNrZXJEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkNoYW5nZXMsIE9uRGVzdHJveSwgQ29udHJvbFZhbHVlQWNjZXNzb3IsIFZhbGlkYXRvciB7XG4gIEBJbnB1dCgpIG9wdGlvbnM6IElNeU9wdGlvbnM7XG4gIEBJbnB1dCgpIGxvY2FsZTogc3RyaW5nO1xuICBASW5wdXQoKSBkZWZhdWx0TW9udGg6IElNeURlZmF1bHRNb250aCA9IHtkZWZNb250aDogRU1QVFlfU1RSLCBvdmVycmlkZVNlbGVjdGlvbjogZmFsc2V9O1xuXG4gIEBPdXRwdXQoKSBkYXRlQ2hhbmdlZDogRXZlbnRFbWl0dGVyPElNeURhdGVNb2RlbD4gPSBuZXcgRXZlbnRFbWl0dGVyPElNeURhdGVNb2RlbD4oKTtcbiAgQE91dHB1dCgpIGlucHV0RmllbGRDaGFuZ2VkOiBFdmVudEVtaXR0ZXI8SU15SW5wdXRGaWVsZENoYW5nZWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxJTXlJbnB1dEZpZWxkQ2hhbmdlZD4oKTtcbiAgQE91dHB1dCgpIGNhbGVuZGFyVmlld0NoYW5nZWQ6IEV2ZW50RW1pdHRlcjxJTXlDYWxlbmRhclZpZXdDaGFuZ2VkPiA9IG5ldyBFdmVudEVtaXR0ZXI8SU15Q2FsZW5kYXJWaWV3Q2hhbmdlZD4oKTtcbiAgQE91dHB1dCgpIGNhbGVuZGFyVG9nZ2xlOiBFdmVudEVtaXR0ZXI8bnVtYmVyPiA9IG5ldyBFdmVudEVtaXR0ZXI8bnVtYmVyPigpO1xuICBAT3V0cHV0KCkgcmFuZ2VEYXRlU2VsZWN0aW9uOiBFdmVudEVtaXR0ZXI8SU15UmFuZ2VEYXRlU2VsZWN0aW9uPiA9IG5ldyBFdmVudEVtaXR0ZXI8SU15UmFuZ2VEYXRlU2VsZWN0aW9uPigpO1xuICBAT3V0cHV0KCkgdmlld0FjdGl2YXRlZDogRXZlbnRFbWl0dGVyPEFjdGl2ZVZpZXc+ID0gbmV3IEV2ZW50RW1pdHRlcjxBY3RpdmVWaWV3PigpO1xuXG4gIHByaXZhdGUgY1JlZjogQ29tcG9uZW50UmVmPENhbGVuZGFyQ29tcG9uZW50PiA9IG51bGw7XG4gIHByaXZhdGUgaG9zdFRleHQ6IHN0cmluZyA9IEVNUFRZX1NUUjtcbiAgcHJpdmF0ZSBwcmV2ZW50Q2xvc2U6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSBkaXNhYmxlZCA9IGZhbHNlO1xuICBwcml2YXRlIHNlbGVjdGVkVmFsdWU6IGFueSA9IG51bGw7XG5cbiAgcHJpdmF0ZSBvcHRzOiBJTXlPcHRpb25zO1xuXG4gIG9uQ2hhbmdlQ2I6IChfOiBhbnkpID0+IHZvaWQgPSAoKSA9PiB7IH07XG4gIG9uVG91Y2hlZENiOiAoKSA9PiB2b2lkID0gKCkgPT4geyB9O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgbG9jYWxlU2VydmljZTogTG9jYWxlU2VydmljZSxcbiAgICAgICAgICAgICAgcHJpdmF0ZSB1dGlsU2VydmljZTogVXRpbFNlcnZpY2UsXG4gICAgICAgICAgICAgIHByaXZhdGUgdmNSZWY6IFZpZXdDb250YWluZXJSZWYsXG4gICAgICAgICAgICAgIHByaXZhdGUgY2ZyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gICAgICAgICAgICAgIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBjZHI6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICAgICAgICBwcml2YXRlIGVsZW06IEVsZW1lbnRSZWYsXG4gICAgICAgICAgICAgIHByaXZhdGUgY29uZmlnOiBEZWZhdWx0Q29uZmlnU2VydmljZSkge1xuICAgIHRoaXMub3B0cyA9IHRoaXMuY29uZmlnLmdldERlZmF1bHRDb25maWcoKTtcbiAgICB0aGlzLnBhcnNlT3B0aW9ucyh0aGlzLm9wdHMpO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcihLRVlVUCwgW1wiJGV2ZW50XCJdKSBvbktleVVwKGV2ZW50OiBhbnkpIHtcbiAgICBjb25zdCBrZXlDb2RlOiBudW1iZXIgPSB0aGlzLnV0aWxTZXJ2aWNlLmdldEtleUNvZGVGcm9tRXZlbnQoZXZlbnQpO1xuICAgIGlmICh0aGlzLmlnbm9yZUtleVByZXNzKGtleUNvZGUpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIFxuICAgIGlmIChrZXlDb2RlID09PSBLZXlDb2RlLmVzYykge1xuICAgICAgdGhpcy5jbG9zZVNlbGVjdG9yKENhbFRvZ2dsZS5DbG9zZUJ5RXNjKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBjb25zdCB7ZGF0ZVJhbmdlLCBkYXRlRm9ybWF0LCBtb250aExhYmVscywgZGF0ZVJhbmdlRGF0ZXNEZWxpbWl0ZXJ9ID0gdGhpcy5vcHRzO1xuICAgICAgY29uc3QgdmFsdWU6IHN0cmluZyA9IHRoaXMuZ2V0SG9zdFZhbHVlKCk7XG5cbiAgICAgIGxldCBkYXRlTW9kZWw6IElNeURhdGVNb2RlbCA9IG51bGw7XG4gICAgICBsZXQgdmFsaWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgIGxldCB2YWxpZGF0ZU9wdHM6IElNeVZhbGlkYXRlT3B0aW9ucyA9IG51bGw7XG4gICAgICBpZiAoIWRhdGVSYW5nZSkge1xuICAgICAgICB2YWxpZGF0ZU9wdHMgPSB7dmFsaWRhdGVEaXNhYmxlZERhdGVzOiB0cnVlLCBzZWxlY3RlZFZhbHVlOiB0aGlzLnV0aWxTZXJ2aWNlLmdldFNlbGVjdGVkVmFsdWUodGhpcy5zZWxlY3RlZFZhbHVlLCBmYWxzZSl9O1xuICAgICAgICBjb25zdCBkYXRlOiBJTXlEYXRlID0gdGhpcy51dGlsU2VydmljZS5pc0RhdGVWYWxpZCh2YWx1ZSwgdGhpcy5vcHRzLCB2YWxpZGF0ZU9wdHMpO1xuICAgICAgICB2YWxpZCA9IHRoaXMudXRpbFNlcnZpY2UuaXNJbml0aWFsaXplZERhdGUoZGF0ZSk7XG4gICAgICAgIGlmICh2YWxpZCkge1xuICAgICAgICAgIGRhdGVNb2RlbCA9IHRoaXMudXRpbFNlcnZpY2UuZ2V0RGF0ZU1vZGVsKGRhdGUsIG51bGwsIGRhdGVGb3JtYXQsIG1vbnRoTGFiZWxzLCBkYXRlUmFuZ2VEYXRlc0RlbGltaXRlcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB2YWxpZGF0ZU9wdHMgPSB7dmFsaWRhdGVEaXNhYmxlZERhdGVzOiB0cnVlLCBzZWxlY3RlZFZhbHVlOiB0aGlzLnV0aWxTZXJ2aWNlLmdldFNlbGVjdGVkVmFsdWUodGhpcy5zZWxlY3RlZFZhbHVlLCB0cnVlKX07XG4gICAgICAgIGNvbnN0IHJhbmdlID0gdGhpcy51dGlsU2VydmljZS5pc0RhdGVWYWxpZERhdGVSYW5nZSh2YWx1ZSwgdGhpcy5vcHRzLCB2YWxpZGF0ZU9wdHMpO1xuICAgICAgICBjb25zdCB7YmVnaW4sIGVuZH0gPSByYW5nZTtcbiAgICAgICAgdmFsaWQgPSB0aGlzLnV0aWxTZXJ2aWNlLmlzSW5pdGlhbGl6ZWREYXRlKGJlZ2luKSAmJiB0aGlzLnV0aWxTZXJ2aWNlLmlzSW5pdGlhbGl6ZWREYXRlKGVuZCk7XG4gICAgICAgIGlmICh2YWxpZCkge1xuICAgICAgICAgIGRhdGVNb2RlbCA9IHRoaXMudXRpbFNlcnZpY2UuZ2V0RGF0ZU1vZGVsKG51bGwsIHJhbmdlLCBkYXRlRm9ybWF0LCBtb250aExhYmVscywgZGF0ZVJhbmdlRGF0ZXNEZWxpbWl0ZXIpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMub25DaGFuZ2VDYihkYXRlTW9kZWwpO1xuICAgICAgdGhpcy5lbWl0SW5wdXRGaWVsZENoYW5nZWQodmFsdWUsIHZhbGlkKTtcbiAgICB9XG4gIH1cblxuICBASG9zdExpc3RlbmVyKEJMVVIpIG9uQmx1cigpIHtcbiAgICBjb25zdCB7aW5wdXRGaWVsZFZhbGlkYXRpb24sIGRhdGVSYW5nZSwgZGF0ZUZvcm1hdCwgbW9udGhMYWJlbHMsIGRhdGVSYW5nZURhdGVzRGVsaW1pdGVyLCBjbG9zZVNlbGVjdG9yT25EYXRlU2VsZWN0fSA9IHRoaXMub3B0cztcblxuICAgIGlmIChpbnB1dEZpZWxkVmFsaWRhdGlvbikge1xuICAgICAgY29uc3QgdmFsdWU6IHN0cmluZyA9IHRoaXMuZ2V0SG9zdFZhbHVlKCk7XG5cbiAgICAgIGxldCB2YWxpZDogYm9vbGVhbiA9IGZhbHNlO1xuICAgICAgbGV0IHZhbGlkYXRlT3B0czogSU15VmFsaWRhdGVPcHRpb25zID0gbnVsbDtcbiAgICAgIGlmICghZGF0ZVJhbmdlKSB7XG4gICAgICAgIHZhbGlkYXRlT3B0cyA9IHt2YWxpZGF0ZURpc2FibGVkRGF0ZXM6IHRydWUsIHNlbGVjdGVkVmFsdWU6IHRoaXMudXRpbFNlcnZpY2UuZ2V0U2VsZWN0ZWRWYWx1ZSh0aGlzLnNlbGVjdGVkVmFsdWUsIGZhbHNlKX07XG4gICAgICAgIGNvbnN0IGRhdGU6IElNeURhdGUgPSB0aGlzLnV0aWxTZXJ2aWNlLmlzRGF0ZVZhbGlkKHZhbHVlLCB0aGlzLm9wdHMsIHZhbGlkYXRlT3B0cyk7XG4gICAgICAgIHZhbGlkID0gdGhpcy51dGlsU2VydmljZS5pc0luaXRpYWxpemVkRGF0ZShkYXRlKTtcbiAgICAgICAgaWYgKHZhbGlkICYmIHRoaXMuaG9zdFRleHQgIT09IHZhbHVlKSB7XG4gICAgICAgICAgLy8gVmFsaWQgZGF0ZVxuICAgICAgICAgIGNvbnN0IGRhdGVNb2RlbDogSU15RGF0ZU1vZGVsID0gdGhpcy51dGlsU2VydmljZS5nZXREYXRlTW9kZWwoZGF0ZSwgbnVsbCwgZGF0ZUZvcm1hdCwgbW9udGhMYWJlbHMsIGRhdGVSYW5nZURhdGVzRGVsaW1pdGVyKTtcbiAgICAgICAgICB0aGlzLmVtaXREYXRlQ2hhbmdlZChkYXRlTW9kZWwpO1xuICAgICAgICAgIHRoaXMudXBkYXRlTW9kZWwoZGF0ZU1vZGVsKTtcbiAgICAgICAgICBpZiAoY2xvc2VTZWxlY3Rvck9uRGF0ZVNlbGVjdCkge1xuICAgICAgICAgICAgdGhpcy5jbG9zZVNlbGVjdG9yKENhbFRvZ2dsZS5DbG9zZUJ5RGF0ZVNlbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdmFsaWRhdGVPcHRzID0ge3ZhbGlkYXRlRGlzYWJsZWREYXRlczogdHJ1ZSwgc2VsZWN0ZWRWYWx1ZTogdGhpcy51dGlsU2VydmljZS5nZXRTZWxlY3RlZFZhbHVlKHRoaXMuc2VsZWN0ZWRWYWx1ZSwgdHJ1ZSl9O1xuICAgICAgICBjb25zdCBkYXRlUmFuZ2U6IElNeURhdGVSYW5nZSA9IHRoaXMudXRpbFNlcnZpY2UuaXNEYXRlVmFsaWREYXRlUmFuZ2UodmFsdWUsIHRoaXMub3B0cywgdmFsaWRhdGVPcHRzKTtcbiAgICAgICAgY29uc3Qge2JlZ2luLCBlbmR9ID0gZGF0ZVJhbmdlO1xuICAgICAgICB2YWxpZCA9IHRoaXMudXRpbFNlcnZpY2UuaXNJbml0aWFsaXplZERhdGUoYmVnaW4pICYmIHRoaXMudXRpbFNlcnZpY2UuaXNJbml0aWFsaXplZERhdGUoZW5kKTtcbiAgICAgICAgaWYgKHZhbGlkICYmIHRoaXMuaG9zdFRleHQgIT09IHZhbHVlKSB7XG4gICAgICAgICAgLy8gVmFsaWQgZGF0ZSByYW5nZVxuICAgICAgICAgIGNvbnN0IGRhdGVNb2RlbDogSU15RGF0ZU1vZGVsID0gdGhpcy51dGlsU2VydmljZS5nZXREYXRlTW9kZWwobnVsbCwgZGF0ZVJhbmdlLCBkYXRlRm9ybWF0LCBtb250aExhYmVscywgZGF0ZVJhbmdlRGF0ZXNEZWxpbWl0ZXIpO1xuICAgICAgICAgIHRoaXMuZW1pdERhdGVDaGFuZ2VkKGRhdGVNb2RlbCk7XG4gICAgICAgICAgdGhpcy51cGRhdGVNb2RlbChkYXRlTW9kZWwpO1xuICAgICAgICAgIGlmIChjbG9zZVNlbGVjdG9yT25EYXRlU2VsZWN0KSB7XG4gICAgICAgICAgICB0aGlzLmNsb3NlU2VsZWN0b3IoQ2FsVG9nZ2xlLkNsb3NlQnlEYXRlU2VsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKCF2YWxpZCAmJiB0aGlzLmhvc3RUZXh0ICE9PSB2YWx1ZSkge1xuICAgICAgICBpZiAodmFsdWUgPT09IEVNUFRZX1NUUikge1xuICAgICAgICAgIHRoaXMuY2xlYXJEYXRlKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdGhpcy5vbkNoYW5nZUNiKG51bGwpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuaG9zdFRleHQgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICB0aGlzLm9uVG91Y2hlZENiKCk7XG4gIH1cblxuICBwcml2YXRlIG9uQ2xpY2tXcmFwcGVyID0gKGV2ZW50OiBhbnkpID0+IHRoaXMub25DbGljayhldmVudCk7XG5cbiAgcHJpdmF0ZSBvbkNsaWNrKGV2ZW50OiBhbnkpIHtcbiAgICBpZiAodGhpcy5vcHRzLmNsb3NlU2VsZWN0b3JPbkRvY3VtZW50Q2xpY2sgJiYgIXRoaXMucHJldmVudENsb3NlICYmIGV2ZW50LnRhcmdldCAmJiB0aGlzLmNSZWYgXG4gICAgICAgICYmIHRoaXMuZWxlbS5uYXRpdmVFbGVtZW50ICE9PSBldmVudC50YXJnZXQgJiYgIXRoaXMuY1JlZi5sb2NhdGlvbi5uYXRpdmVFbGVtZW50LmNvbnRhaW5zKGV2ZW50LnRhcmdldCkgXG4gICAgICAgICYmICF0aGlzLmRpc2FibGVkKSB7XG4gICAgICB0aGlzLmNsb3NlU2VsZWN0b3IoQ2FsVG9nZ2xlLkNsb3NlQnlPdXRDbGljayk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBpZiAoY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eShMT0NBTEUpKSB7XG4gICAgICB0aGlzLnNldExvY2FsZU9wdGlvbnMoKTtcbiAgICB9XG5cbiAgICBpZiAoY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eShERUZBVUxUX01PTlRIKSkge1xuICAgICAgbGV0IGRtOiBhbnkgPSBjaGFuZ2VzW0RFRkFVTFRfTU9OVEhdLmN1cnJlbnRWYWx1ZTtcbiAgICAgIGlmICh0eXBlb2YgZG0gPT09IE9CSkVDVCkge1xuICAgICAgICBpZiAoIWRtLm92ZXJyaWRlU2VsZWN0aW9uKSB7XG4gICAgICAgICAgZG0ub3ZlcnJpZGVTZWxlY3Rpb24gPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGRtID0ge2RlZk1vbnRoOiBkbSwgb3ZlcnJpZGVTZWxlY3Rpb246IGZhbHNlfTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgdGhpcy5kZWZhdWx0TW9udGggPSBkbTtcbiAgICB9XG5cbiAgICBpZiAoY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eShPUFRJT05TKSkge1xuICAgICAgdGhpcy5wYXJzZU9wdGlvbnMoY2hhbmdlc1tPUFRJT05TXS5jdXJyZW50VmFsdWUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNSZWYpIHtcbiAgICAgIHRoaXMuY1JlZi5pbnN0YW5jZS5yZWZyZXNoQ29tcG9uZW50KHRoaXMub3B0cywgdGhpcy5kZWZhdWx0TW9udGgsIHRoaXMuc2VsZWN0ZWRWYWx1ZSwgdGhpcy5nZXRIb3N0VmFsdWUoKSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuY2xvc2VDYWxlbmRhcigpO1xuICB9XG5cbiAgcHVibGljIHNldExvY2FsZU9wdGlvbnMoKTogdm9pZCB7XG4gICAgY29uc3Qgb3B0czogSU15T3B0aW9ucyA9IHRoaXMubG9jYWxlU2VydmljZS5nZXRMb2NhbGVPcHRpb25zKHRoaXMubG9jYWxlKTtcbiAgICBPYmplY3Qua2V5cyhvcHRzKS5mb3JFYWNoKChrKSA9PiB7XG4gICAgICAoPElNeU9wdGlvbnM+IHRoaXMub3B0cylba10gPSBvcHRzW2tdO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIHBhcnNlT3B0aW9ucyhvcHRzOiBJTXlPcHRpb25zKTogdm9pZCB7XG4gICAgaWYgKG9wdHMpIHtcbiAgICAgIE9iamVjdC5rZXlzKG9wdHMpLmZvckVhY2goKGspID0+IHtcbiAgICAgICAgKDxJTXlPcHRpb25zPiB0aGlzLm9wdHMpW2tdID0gb3B0c1trXTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IHttaW5ZZWFyLCBtYXhZZWFyLCBvcGVuU2VsZWN0b3JUb3BPZklucHV0LCBpbmxpbmV9ID0gdGhpcy5vcHRzO1xuXG4gICAgaWYgKG1pblllYXIgPCBZZWFyLm1pbikge1xuICAgICAgdGhpcy5vcHRzLm1pblllYXIgPSBZZWFyLm1pbjtcbiAgICB9XG5cbiAgICBpZiAobWF4WWVhciA+IFllYXIubWF4KSB7XG4gICAgICB0aGlzLm9wdHMubWF4WWVhciA9IFllYXIubWF4O1xuICAgIH1cblxuICAgIGlmIChvcGVuU2VsZWN0b3JUb3BPZklucHV0IHx8IGlubGluZSkge1xuICAgICAgdGhpcy5vcHRzLnNob3dTZWxlY3RvckFycm93ID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKGlubGluZSkge1xuICAgICAgdGhpcy5vcGVuQ2FsZW5kYXIoKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgdmFsaWRhdGVPcHRzOiBJTXlWYWxpZGF0ZU9wdGlvbnMgPSBudWxsO1xuICAgIGNvbnN0IHtkYXRlRm9ybWF0LCBtb250aExhYmVscywgZGF0ZVJhbmdlRGF0ZXNEZWxpbWl0ZXIsIGlubGluZX0gPSB0aGlzLm9wdHM7XG5cbiAgICBpZiAoIXZhbHVlKSB7XG4gICAgICB0aGlzLnNldEhvc3RWYWx1ZShFTVBUWV9TVFIpO1xuICAgICAgdGhpcy5lbWl0SW5wdXRGaWVsZENoYW5nZWQoRU1QVFlfU1RSLCBmYWxzZSk7XG5cbiAgICAgIGlmICh0aGlzLmNSZWYpIHtcbiAgICAgICAgdGhpcy5jUmVmLmluc3RhbmNlLnJlc2V0RGF0ZVZhbHVlKCk7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKCF2YWx1ZS5pc1JhbmdlICYmIHZhbHVlLnNpbmdsZURhdGUpIHtcbiAgICAgIC8vIHNpbmdsZSBkYXRlXG4gICAgICBsZXQge2RhdGUsIGpzRGF0ZX0gPSB2YWx1ZS5zaW5nbGVEYXRlO1xuICAgICAgaWYgKCFkYXRlKSB7XG4gICAgICAgIGRhdGUgPSB0aGlzLnV0aWxTZXJ2aWNlLmpzRGF0ZVRvTXlEYXRlKGpzRGF0ZSk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIGNvbnN0IGZvcm1hdHRlZDogc3RyaW5nID0gdGhpcy51dGlsU2VydmljZS5mb3JtYXREYXRlKGRhdGUsIGRhdGVGb3JtYXQsIG1vbnRoTGFiZWxzKTtcblxuICAgICAgdmFsaWRhdGVPcHRzID0ge3ZhbGlkYXRlRGlzYWJsZWREYXRlczogZmFsc2UsIHNlbGVjdGVkVmFsdWU6IHRoaXMudXRpbFNlcnZpY2UuZ2V0U2VsZWN0ZWRWYWx1ZSh0aGlzLnNlbGVjdGVkVmFsdWUsIGZhbHNlKX07XG4gICAgICBjb25zdCB2YWxpZDogYm9vbGVhbiA9IHRoaXMudXRpbFNlcnZpY2UuaXNJbml0aWFsaXplZERhdGUodGhpcy51dGlsU2VydmljZS5pc0RhdGVWYWxpZChmb3JtYXR0ZWQsIHRoaXMub3B0cywgdmFsaWRhdGVPcHRzKSk7XG4gICAgICBpZiAodmFsaWQpIHtcbiAgICAgICAgdGhpcy5zZXRIb3N0VmFsdWUoZm9ybWF0dGVkKTtcbiAgICAgICAgdGhpcy5lbWl0SW5wdXRGaWVsZENoYW5nZWQoZm9ybWF0dGVkLCB2YWxpZCk7XG4gICAgICAgIHRoaXMuc2V0U2VsZWN0ZWRWYWx1ZSh0aGlzLnV0aWxTZXJ2aWNlLmdldERhdGVNb2RlbChkYXRlLCBudWxsLCBkYXRlRm9ybWF0LCBtb250aExhYmVscywgZGF0ZVJhbmdlRGF0ZXNEZWxpbWl0ZXIpKTtcblxuICAgICAgICBpZiAodGhpcy5jUmVmKSB7XG4gICAgICAgICAgdGhpcy5jUmVmLmluc3RhbmNlLnJlZnJlc2hDb21wb25lbnQodGhpcy5vcHRzLCB0aGlzLmRlZmF1bHRNb250aCwgdGhpcy5zZWxlY3RlZFZhbHVlLCB0aGlzLmdldEhvc3RWYWx1ZSgpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmICh2YWx1ZS5pc1JhbmdlICYmIHZhbHVlLmRhdGVSYW5nZSkge1xuICAgICAgLy8gZGF0ZSByYW5nZVxuICAgICAgbGV0IHtiZWdpbkRhdGUsIGJlZ2luSnNEYXRlLCBlbmREYXRlLCBlbmRKc0RhdGV9ID0gdmFsdWUuZGF0ZVJhbmdlO1xuICAgICAgaWYgKCFiZWdpbkRhdGUgfHwgIWVuZERhdGUpIHtcbiAgICAgICAgYmVnaW5EYXRlID0gdGhpcy51dGlsU2VydmljZS5qc0RhdGVUb015RGF0ZShiZWdpbkpzRGF0ZSk7XG4gICAgICAgIGVuZERhdGUgPSB0aGlzLnV0aWxTZXJ2aWNlLmpzRGF0ZVRvTXlEYXRlKGVuZEpzRGF0ZSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGZvcm1hdHRlZDogc3RyaW5nID0gdGhpcy51dGlsU2VydmljZS5mb3JtYXREYXRlKGJlZ2luRGF0ZSwgZGF0ZUZvcm1hdCwgbW9udGhMYWJlbHMpICsgZGF0ZVJhbmdlRGF0ZXNEZWxpbWl0ZXIgK1xuICAgICAgICB0aGlzLnV0aWxTZXJ2aWNlLmZvcm1hdERhdGUoZW5kRGF0ZSwgZGF0ZUZvcm1hdCwgbW9udGhMYWJlbHMpO1xuICAgICAgdmFsaWRhdGVPcHRzID0ge3ZhbGlkYXRlRGlzYWJsZWREYXRlczogZmFsc2UsIHNlbGVjdGVkVmFsdWU6IHRoaXMudXRpbFNlcnZpY2UuZ2V0U2VsZWN0ZWRWYWx1ZSh0aGlzLnNlbGVjdGVkVmFsdWUsIHRydWUpfTtcbiAgICAgIGNvbnN0IHtiZWdpbiwgZW5kfSA9IHRoaXMudXRpbFNlcnZpY2UuaXNEYXRlVmFsaWREYXRlUmFuZ2UoZm9ybWF0dGVkLCB0aGlzLm9wdHMsIHZhbGlkYXRlT3B0cyk7XG4gICAgICBjb25zdCB2YWxpZDogYm9vbGVhbiA9IHRoaXMudXRpbFNlcnZpY2UuaXNJbml0aWFsaXplZERhdGUoYmVnaW4pICYmIHRoaXMudXRpbFNlcnZpY2UuaXNJbml0aWFsaXplZERhdGUoZW5kKTtcbiAgICAgIGlmICh2YWxpZCkge1xuICAgICAgICB0aGlzLnNldEhvc3RWYWx1ZShmb3JtYXR0ZWQpO1xuICAgICAgICB0aGlzLmVtaXRJbnB1dEZpZWxkQ2hhbmdlZChmb3JtYXR0ZWQsIHZhbGlkKTtcblxuICAgICAgICBjb25zdCBkYXRlUmFuZ2U6IElNeURhdGVSYW5nZSA9IHtiZWdpbjogYmVnaW5EYXRlLCBlbmQ6IGVuZERhdGV9O1xuICAgICAgICB0aGlzLnNldFNlbGVjdGVkVmFsdWUodGhpcy51dGlsU2VydmljZS5nZXREYXRlTW9kZWwobnVsbCwgZGF0ZVJhbmdlLCBkYXRlRm9ybWF0LCBtb250aExhYmVscywgZGF0ZVJhbmdlRGF0ZXNEZWxpbWl0ZXIpKTtcblxuICAgICAgICBpZiAodGhpcy5jUmVmKSB7XG4gICAgICAgICAgdGhpcy5jUmVmLmluc3RhbmNlLnJlZnJlc2hDb21wb25lbnQodGhpcy5vcHRzLCB0aGlzLmRlZmF1bHRNb250aCwgdGhpcy5zZWxlY3RlZFZhbHVlLCB0aGlzLmdldEhvc3RWYWx1ZSgpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyByZWdpc3Rlck9uQ2hhbmdlKGZuOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLm9uQ2hhbmdlQ2IgPSBmbjtcbiAgfVxuXG4gIHB1YmxpYyByZWdpc3Rlck9uVG91Y2hlZChmbjogYW55KTogdm9pZCB7XG4gICAgdGhpcy5vblRvdWNoZWRDYiA9IGZuO1xuICB9XG5cbiAgcHVibGljIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy5lbGVtLm5hdGl2ZUVsZW1lbnQsIERJU0FCTEVELCBpc0Rpc2FibGVkKTtcblxuICAgIGlmIChpc0Rpc2FibGVkKSB7XG4gICAgICB0aGlzLmNsb3NlQ2FsZW5kYXIoKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdmFsaWRhdGUoYzogQWJzdHJhY3RDb250cm9sKTogeyBbcDogc3RyaW5nXTogYW55IH0ge1xuICAgIGNvbnN0IHZhbHVlOiBzdHJpbmcgPSB0aGlzLmdldEhvc3RWYWx1ZSgpO1xuXG4gICAgaWYgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSBFTVBUWV9TVFIpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGxldCB2YWxpZGF0ZU9wdHM6IElNeVZhbGlkYXRlT3B0aW9ucyA9IG51bGw7XG4gICAgaWYgKCF0aGlzLm9wdHMuZGF0ZVJhbmdlKSB7XG4gICAgICB2YWxpZGF0ZU9wdHMgPSB7dmFsaWRhdGVEaXNhYmxlZERhdGVzOiB0cnVlLCBzZWxlY3RlZFZhbHVlOiB0aGlzLnV0aWxTZXJ2aWNlLmdldFNlbGVjdGVkVmFsdWUodGhpcy5zZWxlY3RlZFZhbHVlLCBmYWxzZSl9O1xuICAgICAgY29uc3QgZGF0ZTogSU15RGF0ZSA9IHRoaXMudXRpbFNlcnZpY2UuaXNEYXRlVmFsaWQodmFsdWUsIHRoaXMub3B0cywgdmFsaWRhdGVPcHRzKTtcbiAgICAgIGlmICghdGhpcy51dGlsU2VydmljZS5pc0luaXRpYWxpemVkRGF0ZShkYXRlKSkge1xuICAgICAgICByZXR1cm4ge2ludmFsaWREYXRlRm9ybWF0OiB0cnVlfTtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2YWxpZGF0ZU9wdHMgPSB7dmFsaWRhdGVEaXNhYmxlZERhdGVzOiB0cnVlLCBzZWxlY3RlZFZhbHVlOiB0aGlzLnV0aWxTZXJ2aWNlLmdldFNlbGVjdGVkVmFsdWUodGhpcy5zZWxlY3RlZFZhbHVlLCB0cnVlKX07XG4gICAgICBjb25zdCB7YmVnaW4sIGVuZH0gPSB0aGlzLnV0aWxTZXJ2aWNlLmlzRGF0ZVZhbGlkRGF0ZVJhbmdlKHZhbHVlLCB0aGlzLm9wdHMsIHZhbGlkYXRlT3B0cyk7XG4gICAgICBpZiAoIXRoaXMudXRpbFNlcnZpY2UuaXNJbml0aWFsaXplZERhdGUoYmVnaW4pIHx8ICF0aGlzLnV0aWxTZXJ2aWNlLmlzSW5pdGlhbGl6ZWREYXRlKGVuZCkpIHtcbiAgICAgICAgcmV0dXJuIHtpbnZhbGlkRGF0ZUZvcm1hdDogdHJ1ZX07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcHVibGljIG9wZW5DYWxlbmRhcigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5kaXNhYmxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnByZXZlbnRDbG9zZSA9IHRydWU7XG4gICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIGlmICh0aGlzLmNSZWYgPT09IG51bGwpIHtcbiAgICAgIHRoaXMuY1JlZiA9IHRoaXMudmNSZWYuY3JlYXRlQ29tcG9uZW50KHRoaXMuY2ZyLnJlc29sdmVDb21wb25lbnRGYWN0b3J5KENhbGVuZGFyQ29tcG9uZW50KSk7XG4gICAgICB0aGlzLmFwcGVuZFNlbGVjdG9yKHRoaXMuY1JlZi5sb2NhdGlvbi5uYXRpdmVFbGVtZW50KTtcbiAgICAgIHRoaXMuY1JlZi5pbnN0YW5jZS5pbml0aWFsaXplQ29tcG9uZW50KFxuICAgICAgICB0aGlzLm9wdHMsXG4gICAgICAgIHRoaXMuZGVmYXVsdE1vbnRoLFxuICAgICAgICB0aGlzLnNlbGVjdGVkVmFsdWUsXG4gICAgICAgIHRoaXMuZ2V0SG9zdFZhbHVlKCksXG4gICAgICAgIHRoaXMuZ2V0U2VsZWN0b3JQb3NpdGlvbih0aGlzLmVsZW0ubmF0aXZlRWxlbWVudCksXG4gICAgICAgIChkbTogSU15RGF0ZU1vZGVsLCBjbG9zZTogYm9vbGVhbikgPT4ge1xuICAgICAgICAgIHRoaXMuZm9jdXNUb0lucHV0KCk7XG4gICAgICAgICAgdGhpcy5lbWl0RGF0ZUNoYW5nZWQoZG0pO1xuICAgICAgICAgIHRoaXMuZW1pdElucHV0RmllbGRDaGFuZ2VkKHRoaXMudXRpbFNlcnZpY2UuZ2V0Rm9ybWF0dGVkRGF0ZShkbSksIHRydWUpO1xuICAgICAgICAgIHRoaXMudXBkYXRlTW9kZWwoZG0pO1xuICAgICAgICAgIGlmIChjbG9zZSkge1xuICAgICAgICAgICAgdGhpcy5jbG9zZVNlbGVjdG9yKENhbFRvZ2dsZS5DbG9zZUJ5RGF0ZVNlbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAoY3ZjOiBJTXlDYWxlbmRhclZpZXdDaGFuZ2VkKSA9PiB7XG4gICAgICAgICAgdGhpcy5lbWl0Q2FsZW5kYXJDaGFuZ2VkKGN2Yyk7XG4gICAgICAgIH0sXG4gICAgICAgIChyZHM6IElNeVJhbmdlRGF0ZVNlbGVjdGlvbikgPT4ge1xuICAgICAgICAgIHRoaXMuZW1pdFJhbmdlRGF0ZVNlbGVjdGlvbihyZHMpO1xuICAgICAgICB9LFxuICAgICAgICAodmE6IEFjdGl2ZVZpZXcpID0+IHtcbiAgICAgICAgICB0aGlzLmVtaXRWaWV3QWN0aXZhdGVkKHZhKTtcbiAgICAgICAgfSxcbiAgICAgICAgKCkgPT4ge1xuICAgICAgICAgIHRoaXMuY2xvc2VTZWxlY3RvcihDYWxUb2dnbGUuQ2xvc2VCeUVzYyk7XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgICB0aGlzLmVtaXRDYWxlbmRhclRvZ2dsZShDYWxUb2dnbGUuT3Blbik7XG5cbiAgICAgIGlmICghdGhpcy5vcHRzLmlubGluZSkge1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKENMSUNLLCB0aGlzLm9uQ2xpY2tXcmFwcGVyKTtcbiAgICAgIH1cbiAgICB9XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnByZXZlbnRDbG9zZSA9IGZhbHNlO1xuICAgIH0sIFBSRVZFTlRfQ0xPU0VfVElNRU9VVCk7XG4gIH1cblxuICBwdWJsaWMgY2xvc2VDYWxlbmRhcigpOiB2b2lkIHtcbiAgICB0aGlzLmNsb3NlU2VsZWN0b3IoQ2FsVG9nZ2xlLkNsb3NlQnlDYWxCdG4pO1xuICB9XG5cbiAgcHVibGljIHRvZ2dsZUNhbGVuZGFyKCk6IGJvb2xlYW4gfCBudWxsIHtcbiAgICBpZiAodGhpcy5kaXNhYmxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGlzT3BlbjogYm9vbGVhbiA9IHRoaXMuY1JlZiA9PT0gbnVsbDtcblxuICAgIGlmIChpc09wZW4pIHtcbiAgICAgIHRoaXMub3BlbkNhbGVuZGFyKCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhpcy5jbG9zZVNlbGVjdG9yKENhbFRvZ2dsZS5DbG9zZUJ5Q2FsQnRuKTtcbiAgICB9XG4gICAgcmV0dXJuIGlzT3BlbjtcbiAgfVxuXG4gIHB1YmxpYyBjbGVhckRhdGUoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB7aW5saW5lfSA9IHRoaXMub3B0cztcblxuICAgIHRoaXMuc2V0SG9zdFZhbHVlKEVNUFRZX1NUUik7XG4gICAgdGhpcy5lbWl0RGF0ZUNoYW5nZWQoe1xuICAgICAgaXNSYW5nZTogdGhpcy5vcHRzLmRhdGVSYW5nZSxcbiAgICAgIHNpbmdsZURhdGU6IHtcbiAgICAgICAgZGF0ZTogdGhpcy51dGlsU2VydmljZS5yZXNldERhdGUoKSxcbiAgICAgICAganNEYXRlOiBudWxsLFxuICAgICAgICBmb3JtYXR0ZWQ6IEVNUFRZX1NUUixcbiAgICAgICAgZXBvYzogMFxuICAgICAgfSxcbiAgICAgIGRhdGVSYW5nZToge1xuICAgICAgICBiZWdpbkRhdGU6IHRoaXMudXRpbFNlcnZpY2UucmVzZXREYXRlKCksXG4gICAgICAgIGJlZ2luSnNEYXRlOiBudWxsLFxuICAgICAgICBiZWdpbkVwb2M6IDAsXG4gICAgICAgIGVuZERhdGU6IHRoaXMudXRpbFNlcnZpY2UucmVzZXREYXRlKCksXG4gICAgICAgIGVuZEpzRGF0ZTogbnVsbCxcbiAgICAgICAgZW5kRXBvYzogMCxcbiAgICAgICAgZm9ybWF0dGVkOiBFTVBUWV9TVFJcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMub25DaGFuZ2VDYihudWxsKTtcbiAgICB0aGlzLm9uVG91Y2hlZENiKCk7XG5cbiAgICBpZiAodGhpcy5jUmVmKSB7XG4gICAgICB0aGlzLmNSZWYuaW5zdGFuY2UuY2xlYXJEYXRlKCk7XG4gICAgfVxuXG4gICAgaWYgKCFpbmxpbmUpIHtcbiAgICAgIHRoaXMuY2xvc2VTZWxlY3RvcihDYWxUb2dnbGUuQ2xvc2VCeUNhbEJ0bik7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGlzRGF0ZVZhbGlkKCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHZhbHVlOiBzdHJpbmcgPSB0aGlzLmdldEhvc3RWYWx1ZSgpO1xuXG4gICAgaWYgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSBFTVBUWV9TVFIpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBsZXQgdmFsaWRhdGVPcHRzOiBJTXlWYWxpZGF0ZU9wdGlvbnMgPSBudWxsO1xuICAgIGlmICghdGhpcy5vcHRzLmRhdGVSYW5nZSkge1xuICAgICAgdmFsaWRhdGVPcHRzID0ge3ZhbGlkYXRlRGlzYWJsZWREYXRlczogdHJ1ZSwgc2VsZWN0ZWRWYWx1ZTogdGhpcy51dGlsU2VydmljZS5nZXRTZWxlY3RlZFZhbHVlKHRoaXMuc2VsZWN0ZWRWYWx1ZSwgZmFsc2UpfTtcbiAgICAgIGNvbnN0IGRhdGU6IElNeURhdGUgPSB0aGlzLnV0aWxTZXJ2aWNlLmlzRGF0ZVZhbGlkKHZhbHVlLCB0aGlzLm9wdHMsIHZhbGlkYXRlT3B0cyk7XG4gICAgICBpZiAodGhpcy51dGlsU2VydmljZS5pc0luaXRpYWxpemVkRGF0ZShkYXRlKSkge1xuICAgICAgICB0aGlzLmVtaXRJbnB1dEZpZWxkQ2hhbmdlZCh2YWx1ZSwgdHJ1ZSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHZhbGlkYXRlT3B0cyA9IHt2YWxpZGF0ZURpc2FibGVkRGF0ZXM6IHRydWUsIHNlbGVjdGVkVmFsdWU6IHRoaXMudXRpbFNlcnZpY2UuZ2V0U2VsZWN0ZWRWYWx1ZSh0aGlzLnNlbGVjdGVkVmFsdWUsIHRydWUpfTtcbiAgICAgIGNvbnN0IHtiZWdpbiwgZW5kfSA9IHRoaXMudXRpbFNlcnZpY2UuaXNEYXRlVmFsaWREYXRlUmFuZ2UodmFsdWUsIHRoaXMub3B0cywgdmFsaWRhdGVPcHRzKTtcbiAgICAgIGlmICh0aGlzLnV0aWxTZXJ2aWNlLmlzSW5pdGlhbGl6ZWREYXRlKGJlZ2luKSAmJiB0aGlzLnV0aWxTZXJ2aWNlLmlzSW5pdGlhbGl6ZWREYXRlKGVuZCkpIHtcbiAgICAgICAgdGhpcy5lbWl0SW5wdXRGaWVsZENoYW5nZWQodmFsdWUsIHRydWUpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgdGhpcy5lbWl0SW5wdXRGaWVsZENoYW5nZWQodmFsdWUsIGZhbHNlKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBwdWJsaWMgaGVhZGVyQWN0aW9uKGhlYWRlckFjdGlvbjogSGVhZGVyQWN0aW9uKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuY1JlZikge1xuICAgICAgdGhpcy5jUmVmLmluc3RhbmNlLmhlYWRlckFjdGlvbihoZWFkZXJBY3Rpb24pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaWdub3JlS2V5UHJlc3Moa2V5Q29kZTogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGtleUNvZGUgPT09IEtleUNvZGUubGVmdEFycm93IHx8IGtleUNvZGUgPT09IEtleUNvZGUucmlnaHRBcnJvdyB8fCBrZXlDb2RlID09PSBLZXlDb2RlLnVwQXJyb3cgfHwga2V5Q29kZSA9PT0gS2V5Q29kZS5kb3duQXJyb3cgfHwga2V5Q29kZSA9PT0gS2V5Q29kZS50YWIgfHwga2V5Q29kZSA9PT0gS2V5Q29kZS5zaGlmdDtcbiAgfVxuXG4gIHByaXZhdGUgb25BbmltYXRlV3JhcHBlciA9IChyZWFzb246IG51bWJlcikgPT4gdGhpcy5hbmltYXRpb25FbmQocmVhc29uKTtcblxuICBwcml2YXRlIGFuaW1hdGlvbkVuZChyZWFzb246IG51bWJlcik6IHZvaWQge1xuICAgIGlmICh0aGlzLmNSZWYpIHtcbiAgICAgIHRoaXMuY1JlZi5pbnN0YW5jZS5zZWxlY3RvckVsLm5hdGl2ZUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihBTklNQVRJT05fRU5ELCB0aGlzLm9uQW5pbWF0ZVdyYXBwZXIpO1xuICAgICAgdGhpcy5yZW1vdmVDb21wb25lbnQoKTtcbiAgICAgIHRoaXMuZW1pdENhbGVuZGFyVG9nZ2xlKHJlYXNvbik7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjbG9zZVNlbGVjdG9yKHJlYXNvbjogbnVtYmVyKTogdm9pZCB7XG4gICAgY29uc3Qge2lubGluZSwgY2FsZW5kYXJBbmltYXRpb259ID0gdGhpcy5vcHRzO1xuICAgIFxuICAgIGlmICh0aGlzLmNSZWYgJiYgIWlubGluZSkge1xuICAgICAgaWYgKGNhbGVuZGFyQW5pbWF0aW9uLm91dCAhPT0gQ2FsQW5pbWF0aW9uLk5vbmUpIHtcbiAgICAgICAgY29uc3Qge2luc3RhbmNlfSA9IHRoaXMuY1JlZjtcbiAgICAgICAgaW5zdGFuY2Uuc2VsZWN0b3JFbC5uYXRpdmVFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoQU5JTUFUSU9OX0VORCwgdGhpcy5vbkFuaW1hdGVXcmFwcGVyLmJpbmQodGhpcywgcmVhc29uKSk7XG4gICAgICAgIGluc3RhbmNlLnNldENhbGVuZGFyQW5pbWF0aW9uKGNhbGVuZGFyQW5pbWF0aW9uLCBmYWxzZSk7XG5cbiAgICAgICAgLy8gSW4gY2FzZSB0aGUgYW5pbWF0aW9uZW5kIGV2ZW50IGlzIG5vdCBmaXJlZFxuICAgICAgICBzZXRUaW1lb3V0KHRoaXMub25BbmltYXRlV3JhcHBlci5iaW5kKHRoaXMsIHJlYXNvbiksIEFOSU1BVElPTl9USU1FT1VUKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB0aGlzLnJlbW92ZUNvbXBvbmVudCgpO1xuICAgICAgICB0aGlzLmVtaXRDYWxlbmRhclRvZ2dsZShyZWFzb24pO1xuICAgICAgfVxuXG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKENMSUNLLCB0aGlzLm9uQ2xpY2tXcmFwcGVyKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHJlbW92ZUNvbXBvbmVudCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy52Y1JlZiAhPT0gbnVsbCkge1xuICAgICAgdGhpcy52Y1JlZi5yZW1vdmUodGhpcy52Y1JlZi5pbmRleE9mKHRoaXMuY1JlZi5ob3N0VmlldykpO1xuICAgICAgdGhpcy5jUmVmID0gbnVsbDtcbiAgICB9XG4gIH1cbiAgXG4gIHByaXZhdGUgdXBkYXRlTW9kZWwobW9kZWw6IElNeURhdGVNb2RlbCk6IHZvaWQge1xuICAgIHRoaXMuc2V0SG9zdFZhbHVlKHRoaXMudXRpbFNlcnZpY2UuZ2V0Rm9ybWF0dGVkRGF0ZShtb2RlbCkpO1xuICAgIHRoaXMub25DaGFuZ2VDYihtb2RlbCk7XG4gICAgdGhpcy5vblRvdWNoZWRDYigpO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRIb3N0VmFsdWUodmFsdWU6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IHtkaXZIb3N0RWxlbWVudH0gPSB0aGlzLm9wdHM7XG4gICAgdGhpcy5ob3N0VGV4dCA9IHZhbHVlO1xuICAgIGNvbnN0IHZhbHVlVHlwZTogc3RyaW5nID0gIWRpdkhvc3RFbGVtZW50LmVuYWJsZWQgPyBWQUxVRSA6IElOTkVSX0hUTUw7XG4gICAgdmFsdWUgPSB2YWx1ZVR5cGUgPT09IElOTkVSX0hUTUwgJiYgdmFsdWUgPT09IEVNUFRZX1NUUiA/IGRpdkhvc3RFbGVtZW50LnBsYWNlaG9sZGVyIDogdmFsdWU7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRQcm9wZXJ0eSh0aGlzLmVsZW0ubmF0aXZlRWxlbWVudCwgdmFsdWVUeXBlLCB2YWx1ZSk7XG4gIH1cblxuICBwcml2YXRlIGdldEhvc3RWYWx1ZSgpOiBzdHJpbmcge1xuICAgIGNvbnN0IHt2YWx1ZSwgaW5uZXJIVE1MfSA9IHRoaXMuZWxlbS5uYXRpdmVFbGVtZW50O1xuICAgIHJldHVybiAhdGhpcy5vcHRzLmRpdkhvc3RFbGVtZW50LmVuYWJsZWQgPyB2YWx1ZSA6IGlubmVySFRNTDtcbiAgfVxuXG4gIHByaXZhdGUgZm9jdXNUb0lucHV0KCk6IHZvaWQge1xuICAgIGNvbnN0IHtmb2N1c0lucHV0T25EYXRlU2VsZWN0LCBkaXZIb3N0RWxlbWVudH0gPSB0aGlzLm9wdHM7XG4gICAgaWYgKGZvY3VzSW5wdXRPbkRhdGVTZWxlY3QgJiYgIWRpdkhvc3RFbGVtZW50LmVuYWJsZWQpIHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLmVsZW0ubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBlbWl0RGF0ZUNoYW5nZWQoZGF0ZU1vZGVsOiBJTXlEYXRlTW9kZWwpOiB2b2lkIHtcbiAgICB0aGlzLmRhdGVDaGFuZ2VkLmVtaXQoZGF0ZU1vZGVsKTtcbiAgICB0aGlzLnNldFNlbGVjdGVkVmFsdWUoZGF0ZU1vZGVsKTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0U2VsZWN0ZWRWYWx1ZShkYXRlTW9kZWw6IElNeURhdGVNb2RlbCk6IHZvaWQge1xuICAgIGNvbnN0IHtpc1JhbmdlLCBkYXRlUmFuZ2UsIHNpbmdsZURhdGV9ID0gZGF0ZU1vZGVsO1xuICAgIHRoaXMuc2VsZWN0ZWRWYWx1ZSA9IGlzUmFuZ2UgPyBkYXRlUmFuZ2UgOiBzaW5nbGVEYXRlO1xuICB9XG5cbiAgcHJpdmF0ZSBlbWl0SW5wdXRGaWVsZENoYW5nZWQodmFsdWU6IHN0cmluZywgdmFsaWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLmlucHV0RmllbGRDaGFuZ2VkLmVtaXQoe3ZhbHVlLCBkYXRlRm9ybWF0OiB0aGlzLm9wdHMuZGF0ZUZvcm1hdCwgdmFsaWR9KTtcbiAgfVxuXG4gIHByaXZhdGUgZW1pdENhbGVuZGFyQ2hhbmdlZChjdmM6IElNeUNhbGVuZGFyVmlld0NoYW5nZWQpOiB2b2lkIHtcbiAgICB0aGlzLmNhbGVuZGFyVmlld0NoYW5nZWQuZW1pdChjdmMpO1xuICB9XG5cbiAgcHJpdmF0ZSBlbWl0UmFuZ2VEYXRlU2VsZWN0aW9uKHJkczogSU15UmFuZ2VEYXRlU2VsZWN0aW9uKTogdm9pZCB7XG4gICAgdGhpcy5yYW5nZURhdGVTZWxlY3Rpb24uZW1pdChyZHMpO1xuICB9XG5cbiAgcHJpdmF0ZSBlbWl0Vmlld0FjdGl2YXRlZCh2YTogQWN0aXZlVmlldyk6IHZvaWQge1xuICAgIHRoaXMudmlld0FjdGl2YXRlZC5lbWl0KHZhKTtcbiAgfVxuXG4gIHByaXZhdGUgZW1pdENhbGVuZGFyVG9nZ2xlKHJlYXNvbjogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy5jYWxlbmRhclRvZ2dsZS5lbWl0KHJlYXNvbik7XG4gIH1cblxuICBwcml2YXRlIGFwcGVuZFNlbGVjdG9yKGVsZW06IGFueSk6IHZvaWQge1xuICAgIGlmICh0aGlzLm9wdHMuYXBwZW5kU2VsZWN0b3JUb0JvZHkpIHtcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoQk9EWSkuYXBwZW5kQ2hpbGQoZWxlbSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXRTZWxlY3RvclBvc2l0aW9uKGVsZW06IGFueSk6IElNeVNlbGVjdG9yUG9zaXRpb24ge1xuICAgIGxldCB0b3A6IG51bWJlciA9IDA7XG4gICAgbGV0IGxlZnQ6IG51bWJlciA9IDA7XG5cbiAgICBjb25zdCB7YXBwZW5kU2VsZWN0b3JUb0JvZHksIG9wZW5TZWxlY3RvclRvcE9mSW5wdXQsIHNlbGVjdG9ySGVpZ2h0LCBzZWxlY3RvcldpZHRoLCBzaG93U2VsZWN0b3JBcnJvdywgYWxpZ25TZWxlY3RvclJpZ2h0fSA9IHRoaXMub3B0cztcblxuICAgIGlmIChhcHBlbmRTZWxlY3RvclRvQm9keSkge1xuICAgICAgY29uc3QgYjogYW55ID0gZG9jdW1lbnQuYm9keS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIGNvbnN0IGU6IGFueSA9IGVsZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICB0b3AgPSBlLnRvcCAtIGIudG9wO1xuICAgICAgbGVmdCA9IGUubGVmdCAtIGIubGVmdDtcbiAgICB9XG5cbiAgICBpZiAob3BlblNlbGVjdG9yVG9wT2ZJbnB1dCkge1xuICAgICAgdG9wID0gdG9wIC0gdGhpcy5nZXRTZWxlY3RvckRpbWVuc2lvbihzZWxlY3RvckhlaWdodCkgLSAyO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRvcCA9IHRvcCArIGVsZW0ub2Zmc2V0SGVpZ2h0ICsgKHNob3dTZWxlY3RvckFycm93ID8gMTIgOiAyKTtcbiAgICB9XG5cbiAgICBpZiAoYWxpZ25TZWxlY3RvclJpZ2h0KSB7XG4gICAgICBsZWZ0ID0gbGVmdCArIGVsZW0ub2Zmc2V0V2lkdGggLSB0aGlzLmdldFNlbGVjdG9yRGltZW5zaW9uKHNlbGVjdG9yV2lkdGgpO1xuICAgIH1cbiAgICByZXR1cm4ge3RvcDogdG9wICsgUFgsIGxlZnQ6IGxlZnQgKyBQWH07XG4gIH1cblxuICBwcml2YXRlIGdldFNlbGVjdG9yRGltZW5zaW9uKHZhbHVlOiBzdHJpbmcpOiBudW1iZXIge1xuICAgIHJldHVybiBOdW1iZXIodmFsdWUucmVwbGFjZShQWCwgRU1QVFlfU1RSKSk7XG4gIH1cbn1cbiJdfQ==