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
const NGX_DP_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef((/**
     * @return {?}
     */
    () => AngularMyDatePickerDirective)),
    multi: true
};
/** @type {?} */
const NGX_DP_VALIDATORS = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef((/**
     * @return {?}
     */
    () => AngularMyDatePickerDirective)),
    multi: true
};
export class AngularMyDatePickerDirective {
    /**
     * @param {?} localeService
     * @param {?} utilService
     * @param {?} vcRef
     * @param {?} cfr
     * @param {?} renderer
     * @param {?} cdr
     * @param {?} elem
     * @param {?} config
     */
    constructor(localeService, utilService, vcRef, cfr, renderer, cdr, elem, config) {
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
        () => { });
        this.onTouchedCb = (/**
         * @return {?}
         */
        () => { });
        this.onClickWrapper = (/**
         * @param {?} event
         * @return {?}
         */
        (event) => this.onClick(event));
        this.onAnimateWrapper = (/**
         * @param {?} reason
         * @return {?}
         */
        (reason) => this.animationEnd(reason));
        this.opts = this.config.getDefaultConfig();
        this.parseOptions(this.opts);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onKeyUp(event) {
        /** @type {?} */
        const keyCode = this.utilService.getKeyCodeFromEvent(event);
        if (this.ignoreKeyPress(keyCode)) {
            return;
        }
        if (keyCode === KeyCode.esc) {
            this.closeSelector(CalToggle.CloseByEsc);
        }
        else {
            const { dateRange, dateFormat, monthLabels, dateRangeDatesDelimiter } = this.opts;
            /** @type {?} */
            const value = this.getHostValue();
            /** @type {?} */
            let dateModel = null;
            /** @type {?} */
            let valid = false;
            /** @type {?} */
            let validateOpts = null;
            if (!dateRange) {
                validateOpts = { validateDisabledDates: true, selectedValue: this.utilService.getSelectedValue(this.selectedValue, false) };
                /** @type {?} */
                const date = this.utilService.isDateValid(value, this.opts, validateOpts);
                valid = this.utilService.isInitializedDate(date);
                if (valid) {
                    dateModel = this.utilService.getDateModel(date, null, dateFormat, monthLabels, dateRangeDatesDelimiter);
                }
            }
            else {
                validateOpts = { validateDisabledDates: true, selectedValue: this.utilService.getSelectedValue(this.selectedValue, true) };
                /** @type {?} */
                const range = this.utilService.isDateValidDateRange(value, this.opts, validateOpts);
                const { begin, end } = range;
                valid = this.utilService.isInitializedDate(begin) && this.utilService.isInitializedDate(end);
                if (valid) {
                    dateModel = this.utilService.getDateModel(null, range, dateFormat, monthLabels, dateRangeDatesDelimiter);
                }
            }
            this.onChangeCb(dateModel);
            this.emitInputFieldChanged(value, valid);
        }
    }
    /**
     * @return {?}
     */
    onBlur() {
        const { inputFieldValidation, dateRange, dateFormat, monthLabels, dateRangeDatesDelimiter, closeSelectorOnDateSelect } = this.opts;
        if (inputFieldValidation) {
            /** @type {?} */
            const value = this.getHostValue();
            /** @type {?} */
            let valid = false;
            /** @type {?} */
            let validateOpts = null;
            if (!dateRange) {
                validateOpts = { validateDisabledDates: true, selectedValue: this.utilService.getSelectedValue(this.selectedValue, false) };
                /** @type {?} */
                const date = this.utilService.isDateValid(value, this.opts, validateOpts);
                valid = this.utilService.isInitializedDate(date);
                if (valid && this.hostText !== value) {
                    // Valid date
                    /** @type {?} */
                    const dateModel = this.utilService.getDateModel(date, null, dateFormat, monthLabels, dateRangeDatesDelimiter);
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
                const dateRange = this.utilService.isDateValidDateRange(value, this.opts, validateOpts);
                const { begin, end } = dateRange;
                valid = this.utilService.isInitializedDate(begin) && this.utilService.isInitializedDate(end);
                if (valid && this.hostText !== value) {
                    // Valid date range
                    /** @type {?} */
                    const dateModel = this.utilService.getDateModel(null, dateRange, dateFormat, monthLabels, dateRangeDatesDelimiter);
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
    }
    /**
     * @private
     * @param {?} event
     * @return {?}
     */
    onClick(event) {
        if (this.opts.closeSelectorOnDocumentClick && !this.preventClose && event.target && this.cRef
            && this.elem.nativeElement !== event.target && !this.cRef.location.nativeElement.contains(event.target)
            && !this.disabled) {
            this.closeSelector(CalToggle.CloseByOutClick);
        }
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes.hasOwnProperty(LOCALE)) {
            this.setLocaleOptions();
        }
        if (changes.hasOwnProperty(DEFAULT_MONTH)) {
            /** @type {?} */
            let dm = changes[DEFAULT_MONTH].currentValue;
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
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.closeCalendar();
    }
    /**
     * @return {?}
     */
    setLocaleOptions() {
        /** @type {?} */
        const opts = this.localeService.getLocaleOptions(this.locale);
        Object.keys(opts).forEach((/**
         * @param {?} k
         * @return {?}
         */
        (k) => {
            ((/** @type {?} */ (this.opts)))[k] = opts[k];
        }));
    }
    /**
     * @param {?} opts
     * @return {?}
     */
    parseOptions(opts) {
        if (opts) {
            Object.keys(opts).forEach((/**
             * @param {?} k
             * @return {?}
             */
            (k) => {
                ((/** @type {?} */ (this.opts)))[k] = opts[k];
            }));
        }
        const { minYear, maxYear, openSelectorTopOfInput, inline } = this.opts;
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
    }
    /**
     * @param {?} value
     * @return {?}
     */
    writeValue(value) {
        if (this.disabled) {
            return;
        }
        /** @type {?} */
        let validateOpts = null;
        const { dateFormat, monthLabels, dateRangeDatesDelimiter, inline } = this.opts;
        if (!value) {
            this.setHostValue(EMPTY_STR);
            this.emitInputFieldChanged(EMPTY_STR, false);
            if (this.cRef) {
                this.cRef.instance.resetDateValue();
            }
        }
        else if (!value.isRange && value.singleDate) {
            // single date
            let { date, jsDate } = value.singleDate;
            if (!date) {
                date = this.utilService.jsDateToMyDate(jsDate);
            }
            /** @type {?} */
            const formatted = this.utilService.formatDate(date, dateFormat, monthLabels);
            validateOpts = { validateDisabledDates: false, selectedValue: this.utilService.getSelectedValue(this.selectedValue, false) };
            /** @type {?} */
            const valid = this.utilService.isInitializedDate(this.utilService.isDateValid(formatted, this.opts, validateOpts));
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
            let { beginDate, beginJsDate, endDate, endJsDate } = value.dateRange;
            if (!beginDate || !endDate) {
                beginDate = this.utilService.jsDateToMyDate(beginJsDate);
                endDate = this.utilService.jsDateToMyDate(endJsDate);
            }
            /** @type {?} */
            const formatted = this.utilService.formatDate(beginDate, dateFormat, monthLabels) + dateRangeDatesDelimiter +
                this.utilService.formatDate(endDate, dateFormat, monthLabels);
            validateOpts = { validateDisabledDates: false, selectedValue: this.utilService.getSelectedValue(this.selectedValue, true) };
            const { begin, end } = this.utilService.isDateValidDateRange(formatted, this.opts, validateOpts);
            /** @type {?} */
            const valid = this.utilService.isInitializedDate(begin) && this.utilService.isInitializedDate(end);
            if (valid) {
                this.setHostValue(formatted);
                this.emitInputFieldChanged(formatted, valid);
                /** @type {?} */
                const dateRange = { begin: beginDate, end: endDate };
                this.setSelectedValue(this.utilService.getDateModel(null, dateRange, dateFormat, monthLabels, dateRangeDatesDelimiter));
                if (this.cRef) {
                    this.cRef.instance.refreshComponent(this.opts, this.defaultMonth, this.selectedValue, this.getHostValue());
                }
            }
        }
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) {
        this.onChangeCb = fn;
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) {
        this.onTouchedCb = fn;
    }
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
        this.renderer.setProperty(this.elem.nativeElement, DISABLED, isDisabled);
        if (isDisabled) {
            this.closeCalendar();
        }
    }
    /**
     * @param {?} c
     * @return {?}
     */
    validate(c) {
        /** @type {?} */
        const value = this.getHostValue();
        if (value === null || value === EMPTY_STR) {
            return null;
        }
        /** @type {?} */
        let validateOpts = null;
        if (!this.opts.dateRange) {
            validateOpts = { validateDisabledDates: true, selectedValue: this.utilService.getSelectedValue(this.selectedValue, false) };
            /** @type {?} */
            const date = this.utilService.isDateValid(value, this.opts, validateOpts);
            if (!this.utilService.isInitializedDate(date)) {
                return { invalidDateFormat: true };
            }
        }
        else {
            validateOpts = { validateDisabledDates: true, selectedValue: this.utilService.getSelectedValue(this.selectedValue, true) };
            const { begin, end } = this.utilService.isDateValidDateRange(value, this.opts, validateOpts);
            if (!this.utilService.isInitializedDate(begin) || !this.utilService.isInitializedDate(end)) {
                return { invalidDateFormat: true };
            }
        }
        return null;
    }
    /**
     * @return {?}
     */
    openCalendar() {
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
            (dm, close) => {
                this.focusToInput();
                this.emitDateChanged(dm);
                this.emitInputFieldChanged(this.utilService.getFormattedDate(dm), true);
                this.updateModel(dm);
                if (close) {
                    this.closeSelector(CalToggle.CloseByDateSel);
                }
            }), (/**
             * @param {?} cvc
             * @return {?}
             */
            (cvc) => {
                this.emitCalendarChanged(cvc);
            }), (/**
             * @param {?} rds
             * @return {?}
             */
            (rds) => {
                this.emitRangeDateSelection(rds);
            }), (/**
             * @param {?} va
             * @return {?}
             */
            (va) => {
                this.emitViewActivated(va);
            }), (/**
             * @return {?}
             */
            () => {
                this.closeSelector(CalToggle.CloseByEsc);
            }));
            this.emitCalendarToggle(CalToggle.Open);
            if (!this.opts.inline) {
                document.addEventListener(CLICK, this.onClickWrapper);
            }
        }
        setTimeout((/**
         * @return {?}
         */
        () => {
            this.preventClose = false;
        }), PREVENT_CLOSE_TIMEOUT);
    }
    /**
     * @return {?}
     */
    closeCalendar() {
        this.closeSelector(CalToggle.CloseByCalBtn);
    }
    /**
     * @return {?}
     */
    toggleCalendar() {
        if (this.disabled) {
            return;
        }
        /** @type {?} */
        const isOpen = this.cRef === null;
        if (isOpen) {
            this.openCalendar();
        }
        else {
            this.closeSelector(CalToggle.CloseByCalBtn);
        }
        return isOpen;
    }
    /**
     * @return {?}
     */
    clearDate() {
        if (this.disabled) {
            return;
        }
        const { inline } = this.opts;
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
    }
    /**
     * @return {?}
     */
    isDateValid() {
        /** @type {?} */
        const value = this.getHostValue();
        if (value === null || value === EMPTY_STR) {
            return false;
        }
        /** @type {?} */
        let validateOpts = null;
        if (!this.opts.dateRange) {
            validateOpts = { validateDisabledDates: true, selectedValue: this.utilService.getSelectedValue(this.selectedValue, false) };
            /** @type {?} */
            const date = this.utilService.isDateValid(value, this.opts, validateOpts);
            if (this.utilService.isInitializedDate(date)) {
                this.emitInputFieldChanged(value, true);
                return true;
            }
        }
        else {
            validateOpts = { validateDisabledDates: true, selectedValue: this.utilService.getSelectedValue(this.selectedValue, true) };
            const { begin, end } = this.utilService.isDateValidDateRange(value, this.opts, validateOpts);
            if (this.utilService.isInitializedDate(begin) && this.utilService.isInitializedDate(end)) {
                this.emitInputFieldChanged(value, true);
                return true;
            }
        }
        this.emitInputFieldChanged(value, false);
        return false;
    }
    /**
     * @param {?} headerAction
     * @return {?}
     */
    headerAction(headerAction) {
        if (this.cRef) {
            this.cRef.instance.headerAction(headerAction);
        }
    }
    /**
     * @private
     * @param {?} keyCode
     * @return {?}
     */
    ignoreKeyPress(keyCode) {
        return keyCode === KeyCode.leftArrow || keyCode === KeyCode.rightArrow || keyCode === KeyCode.upArrow || keyCode === KeyCode.downArrow || keyCode === KeyCode.tab || keyCode === KeyCode.shift;
    }
    /**
     * @private
     * @param {?} reason
     * @return {?}
     */
    animationEnd(reason) {
        if (this.cRef) {
            this.cRef.instance.selectorEl.nativeElement.removeEventListener(ANIMATION_END, this.onAnimateWrapper);
            this.removeComponent();
            this.emitCalendarToggle(reason);
        }
    }
    /**
     * @private
     * @param {?} reason
     * @return {?}
     */
    closeSelector(reason) {
        const { inline, calendarAnimation } = this.opts;
        if (this.cRef && !inline) {
            if (calendarAnimation.out !== CalAnimation.None) {
                const { instance } = this.cRef;
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
    }
    /**
     * @private
     * @return {?}
     */
    removeComponent() {
        if (this.vcRef !== null) {
            this.vcRef.remove(this.vcRef.indexOf(this.cRef.hostView));
            this.cRef = null;
        }
    }
    /**
     * @private
     * @param {?} model
     * @return {?}
     */
    updateModel(model) {
        this.setHostValue(this.utilService.getFormattedDate(model));
        this.onChangeCb(model);
        this.onTouchedCb();
    }
    /**
     * @private
     * @param {?} value
     * @return {?}
     */
    setHostValue(value) {
        const { divHostElement } = this.opts;
        this.hostText = value;
        /** @type {?} */
        const valueType = !divHostElement.enabled ? VALUE : INNER_HTML;
        value = valueType === INNER_HTML && value === EMPTY_STR ? divHostElement.placeholder : value;
        this.renderer.setProperty(this.elem.nativeElement, valueType, value);
    }
    /**
     * @private
     * @return {?}
     */
    getHostValue() {
        const { value, innerHTML } = this.elem.nativeElement;
        return !this.opts.divHostElement.enabled ? value : innerHTML;
    }
    /**
     * @private
     * @return {?}
     */
    focusToInput() {
        const { focusInputOnDateSelect, divHostElement } = this.opts;
        if (focusInputOnDateSelect && !divHostElement.enabled) {
            setTimeout((/**
             * @return {?}
             */
            () => {
                this.elem.nativeElement.focus();
            }));
        }
    }
    /**
     * @private
     * @param {?} dateModel
     * @return {?}
     */
    emitDateChanged(dateModel) {
        this.dateChanged.emit(dateModel);
        this.setSelectedValue(dateModel);
    }
    /**
     * @private
     * @param {?} dateModel
     * @return {?}
     */
    setSelectedValue(dateModel) {
        const { isRange, dateRange, singleDate } = dateModel;
        this.selectedValue = isRange ? dateRange : singleDate;
    }
    /**
     * @private
     * @param {?} value
     * @param {?} valid
     * @return {?}
     */
    emitInputFieldChanged(value, valid) {
        this.inputFieldChanged.emit({ value, dateFormat: this.opts.dateFormat, valid });
    }
    /**
     * @private
     * @param {?} cvc
     * @return {?}
     */
    emitCalendarChanged(cvc) {
        this.calendarViewChanged.emit(cvc);
    }
    /**
     * @private
     * @param {?} rds
     * @return {?}
     */
    emitRangeDateSelection(rds) {
        this.rangeDateSelection.emit(rds);
    }
    /**
     * @private
     * @param {?} va
     * @return {?}
     */
    emitViewActivated(va) {
        this.viewActivated.emit(va);
    }
    /**
     * @private
     * @param {?} reason
     * @return {?}
     */
    emitCalendarToggle(reason) {
        this.calendarToggle.emit(reason);
    }
    /**
     * @private
     * @param {?} elem
     * @return {?}
     */
    appendSelector(elem) {
        if (this.opts.appendSelectorToBody) {
            document.querySelector(BODY).appendChild(elem);
        }
    }
    /**
     * @private
     * @param {?} elem
     * @return {?}
     */
    getSelectorPosition(elem) {
        /** @type {?} */
        let top = 0;
        /** @type {?} */
        let left = 0;
        const { appendSelectorToBody, openSelectorTopOfInput, selectorHeight, selectorWidth, showSelectorArrow, alignSelectorRight } = this.opts;
        if (appendSelectorToBody) {
            /** @type {?} */
            const b = document.body.getBoundingClientRect();
            /** @type {?} */
            const e = elem.getBoundingClientRect();
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
    }
    /**
     * @private
     * @param {?} value
     * @return {?}
     */
    getSelectorDimension(value) {
        return Number(value.replace(PX, EMPTY_STR));
    }
}
AngularMyDatePickerDirective.decorators = [
    { type: Directive, args: [{
                selector: "[angular-mydatepicker]",
                exportAs: "angular-mydatepicker",
                providers: [UtilService, LocaleService, DefaultConfigService, NGX_DP_VALUE_ACCESSOR, NGX_DP_VALIDATORS]
            },] }
];
/** @nocollapse */
AngularMyDatePickerDirective.ctorParameters = () => [
    { type: LocaleService },
    { type: UtilService },
    { type: ViewContainerRef },
    { type: ComponentFactoryResolver },
    { type: Renderer2 },
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: DefaultConfigService }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1teWRhdGVwaWNrZXIuaW5wdXQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLXRyYWRlZGF0ZXBpY2tlci8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLW15ZGF0ZXBpY2tlci5pbnB1dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQWdCLFVBQVUsRUFBRSxnQkFBZ0IsRUFBRSxTQUFTLEVBQUUsaUJBQWlCLEVBQ2hHLHdCQUF3QixFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUE0QixZQUFZLEVBQVksTUFBTSxlQUFlLENBQUM7QUFDdEksT0FBTyxFQUF3QyxhQUFhLEVBQUUsaUJBQWlCLEVBQVksTUFBTSxnQkFBZ0IsQ0FBQztBQUNsSCxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSwwQ0FBMEMsQ0FBQztBQVczRSxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sZ0RBQWdELENBQUM7QUFDN0UsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLDhDQUE4QyxDQUFDO0FBQ3pFLE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLGdEQUFnRCxDQUFDO0FBQ3BGLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUNsRCxPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDdkMsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzlDLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSw0QkFBNEIsQ0FBQztBQUd4RCxPQUFPLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLHFCQUFxQixFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQ3pHLE1BQU0sRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxhQUFhLEVBQUUsaUJBQWlC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bXBvbmVudFJlZiwgRWxlbWVudFJlZiwgVmlld0NvbnRhaW5lclJlZiwgUmVuZGVyZXIyLCBDaGFuZ2VEZXRlY3RvclJlZiwgXG4gIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlciwgZm9yd2FyZFJlZiwgRXZlbnRFbWl0dGVyLCBPdXRwdXQsIFNpbXBsZUNoYW5nZXMsIE9uQ2hhbmdlcywgSG9zdExpc3RlbmVyLCBPbkRlc3Ryb3l9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQge0Fic3RyYWN0Q29udHJvbCwgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTElEQVRPUlMsIE5HX1ZBTFVFX0FDQ0VTU09SLCBWYWxpZGF0b3J9IGZyb20gXCJAYW5ndWxhci9mb3Jtc1wiO1xuaW1wb3J0IHtDYWxlbmRhckNvbXBvbmVudH0gZnJvbSBcIi4vY29tcG9uZW50cy9jYWxlbmRhci9jYWxlbmRhci5jb21wb25lbnRcIjtcbmltcG9ydCB7SU15RGF0ZX0gZnJvbSBcIi4vaW50ZXJmYWNlcy9teS1kYXRlLmludGVyZmFjZVwiO1xuaW1wb3J0IHtJTXlPcHRpb25zfSBmcm9tIFwiLi9pbnRlcmZhY2VzL215LW9wdGlvbnMuaW50ZXJmYWNlXCI7XG5pbXBvcnQge0lNeURhdGVNb2RlbH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9teS1kYXRlLW1vZGVsLmludGVyZmFjZVwiO1xuaW1wb3J0IHtJTXlEYXRlUmFuZ2V9IGZyb20gXCIuL2ludGVyZmFjZXMvbXktZGF0ZS1yYW5nZS5pbnRlcmZhY2VcIjtcbmltcG9ydCB7SU15UmFuZ2VEYXRlU2VsZWN0aW9ufSBmcm9tIFwiLi9pbnRlcmZhY2VzL215LXJhbmdlLWRhdGUtc2VsZWN0aW9uLmludGVyZmFjZVwiO1xuaW1wb3J0IHtJTXlDYWxlbmRhclZpZXdDaGFuZ2VkfSBmcm9tIFwiLi9pbnRlcmZhY2VzL215LWNhbGVuZGFyLXZpZXctY2hhbmdlZC5pbnRlcmZhY2VcIjtcbmltcG9ydCB7SU15SW5wdXRGaWVsZENoYW5nZWR9IGZyb20gXCIuL2ludGVyZmFjZXMvbXktaW5wdXQtZmllbGQtY2hhbmdlZC5pbnRlcmZhY2VcIjtcbmltcG9ydCB7SU15U2VsZWN0b3JQb3NpdGlvbn0gZnJvbSBcIi4vaW50ZXJmYWNlcy9teS1zZWxlY3Rvci1wb3MuaW50ZXJmYWNlXCI7XG5pbXBvcnQge0lNeVZhbGlkYXRlT3B0aW9uc30gZnJvbSBcIi4vaW50ZXJmYWNlcy9teS12YWxpZGF0ZS1vcHRpb25zLmludGVyZmFjZVwiO1xuaW1wb3J0IHtJTXlEZWZhdWx0TW9udGh9IGZyb20gXCIuL2ludGVyZmFjZXMvbXktZGVmYXVsdC1tb250aC5pbnRlcmZhY2VcIjtcbmltcG9ydCB7TG9jYWxlU2VydmljZX0gZnJvbSBcIi4vc2VydmljZXMvYW5ndWxhci1teWRhdGVwaWNrZXIubG9jYWxlLnNlcnZpY2VcIjtcbmltcG9ydCB7VXRpbFNlcnZpY2V9IGZyb20gXCIuL3NlcnZpY2VzL2FuZ3VsYXItbXlkYXRlcGlja2VyLnV0aWwuc2VydmljZVwiO1xuaW1wb3J0IHtEZWZhdWx0Q29uZmlnU2VydmljZX0gZnJvbSBcIi4vc2VydmljZXMvYW5ndWxhci1teWRhdGVwaWNrZXIuY29uZmlnLnNlcnZpY2VcIjtcbmltcG9ydCB7Q2FsVG9nZ2xlfSBmcm9tIFwiLi9lbnVtcy9jYWwtdG9nZ2xlLmVudW1cIjtcbmltcG9ydCB7WWVhcn0gZnJvbSBcIi4vZW51bXMveWVhci5lbnVtXCI7XG5pbXBvcnQge0tleUNvZGV9IGZyb20gXCIuL2VudW1zL2tleS1jb2RlLmVudW1cIjtcbmltcG9ydCB7Q2FsQW5pbWF0aW9ufSBmcm9tIFwiLi9lbnVtcy9jYWwtYW5pbWF0aW9uLmVudW1cIjtcbmltcG9ydCB7SGVhZGVyQWN0aW9ufSBmcm9tIFwiLi9lbnVtcy9oZWFkZXItYWN0aW9uLmVudW1cIjtcbmltcG9ydCB7QWN0aXZlVmlld30gZnJvbSBcIi4vZW51bXMvYWN0aXZlLXZpZXcuZW51bVwiO1xuaW1wb3J0IHtLRVlVUCwgQkxVUiwgRU1QVFlfU1RSLCBESVNBQkxFRCwgQ0xJQ0ssIEJPRFksIFZBTFVFLCBQUkVWRU5UX0NMT1NFX1RJTUVPVVQsIE9QVElPTlMsIERFRkFVTFRfTU9OVEgsIFxuICBMT0NBTEUsIE9CSkVDVCwgUFgsIElOTkVSX0hUTUwsIEFOSU1BVElPTl9FTkQsIEFOSU1BVElPTl9USU1FT1VUfSBmcm9tIFwiLi9jb25zdGFudHMvY29uc3RhbnRzXCI7XG5cbmNvbnN0IE5HWF9EUF9WQUxVRV9BQ0NFU1NPUiA9IHtcbiAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IEFuZ3VsYXJNeURhdGVQaWNrZXJEaXJlY3RpdmUpLFxuICBtdWx0aTogdHJ1ZVxufTtcblxuY29uc3QgTkdYX0RQX1ZBTElEQVRPUlMgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTElEQVRPUlMsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IEFuZ3VsYXJNeURhdGVQaWNrZXJEaXJlY3RpdmUpLFxuICBtdWx0aTogdHJ1ZVxufTtcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBcIlthbmd1bGFyLW15ZGF0ZXBpY2tlcl1cIixcbiAgZXhwb3J0QXM6IFwiYW5ndWxhci1teWRhdGVwaWNrZXJcIixcbiAgcHJvdmlkZXJzOiBbVXRpbFNlcnZpY2UsIExvY2FsZVNlcnZpY2UsIERlZmF1bHRDb25maWdTZXJ2aWNlLCBOR1hfRFBfVkFMVUVfQUNDRVNTT1IsIE5HWF9EUF9WQUxJREFUT1JTXVxufSlcbmV4cG9ydCBjbGFzcyBBbmd1bGFyTXlEYXRlUGlja2VyRGlyZWN0aXZlIGltcGxlbWVudHMgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBWYWxpZGF0b3Ige1xuICBASW5wdXQoKSBvcHRpb25zOiBJTXlPcHRpb25zO1xuICBASW5wdXQoKSBsb2NhbGU6IHN0cmluZztcbiAgQElucHV0KCkgZGVmYXVsdE1vbnRoOiBJTXlEZWZhdWx0TW9udGggPSB7ZGVmTW9udGg6IEVNUFRZX1NUUiwgb3ZlcnJpZGVTZWxlY3Rpb246IGZhbHNlfTtcblxuICBAT3V0cHV0KCkgZGF0ZUNoYW5nZWQ6IEV2ZW50RW1pdHRlcjxJTXlEYXRlTW9kZWw+ID0gbmV3IEV2ZW50RW1pdHRlcjxJTXlEYXRlTW9kZWw+KCk7XG4gIEBPdXRwdXQoKSBpbnB1dEZpZWxkQ2hhbmdlZDogRXZlbnRFbWl0dGVyPElNeUlucHV0RmllbGRDaGFuZ2VkPiA9IG5ldyBFdmVudEVtaXR0ZXI8SU15SW5wdXRGaWVsZENoYW5nZWQ+KCk7XG4gIEBPdXRwdXQoKSBjYWxlbmRhclZpZXdDaGFuZ2VkOiBFdmVudEVtaXR0ZXI8SU15Q2FsZW5kYXJWaWV3Q2hhbmdlZD4gPSBuZXcgRXZlbnRFbWl0dGVyPElNeUNhbGVuZGFyVmlld0NoYW5nZWQ+KCk7XG4gIEBPdXRwdXQoKSBjYWxlbmRhclRvZ2dsZTogRXZlbnRFbWl0dGVyPG51bWJlcj4gPSBuZXcgRXZlbnRFbWl0dGVyPG51bWJlcj4oKTtcbiAgQE91dHB1dCgpIHJhbmdlRGF0ZVNlbGVjdGlvbjogRXZlbnRFbWl0dGVyPElNeVJhbmdlRGF0ZVNlbGVjdGlvbj4gPSBuZXcgRXZlbnRFbWl0dGVyPElNeVJhbmdlRGF0ZVNlbGVjdGlvbj4oKTtcbiAgQE91dHB1dCgpIHZpZXdBY3RpdmF0ZWQ6IEV2ZW50RW1pdHRlcjxBY3RpdmVWaWV3PiA9IG5ldyBFdmVudEVtaXR0ZXI8QWN0aXZlVmlldz4oKTtcblxuICBwcml2YXRlIGNSZWY6IENvbXBvbmVudFJlZjxDYWxlbmRhckNvbXBvbmVudD4gPSBudWxsO1xuICBwcml2YXRlIGhvc3RUZXh0OiBzdHJpbmcgPSBFTVBUWV9TVFI7XG4gIHByaXZhdGUgcHJldmVudENsb3NlOiBib29sZWFuID0gZmFsc2U7XG4gIHByaXZhdGUgZGlzYWJsZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBzZWxlY3RlZFZhbHVlOiBhbnkgPSBudWxsO1xuXG4gIHByaXZhdGUgb3B0czogSU15T3B0aW9ucztcblxuICBvbkNoYW5nZUNiOiAoXzogYW55KSA9PiB2b2lkID0gKCkgPT4geyB9O1xuICBvblRvdWNoZWRDYjogKCkgPT4gdm9pZCA9ICgpID0+IHsgfTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGxvY2FsZVNlcnZpY2U6IExvY2FsZVNlcnZpY2UsXG4gICAgICAgICAgICAgIHByaXZhdGUgdXRpbFNlcnZpY2U6IFV0aWxTZXJ2aWNlLFxuICAgICAgICAgICAgICBwcml2YXRlIHZjUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgICAgICAgICAgICBwcml2YXRlIGNmcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICAgICAgICAgICAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgICAgICAgICAgIHByaXZhdGUgY2RyOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBlbGVtOiBFbGVtZW50UmVmLFxuICAgICAgICAgICAgICBwcml2YXRlIGNvbmZpZzogRGVmYXVsdENvbmZpZ1NlcnZpY2UpIHtcbiAgICB0aGlzLm9wdHMgPSB0aGlzLmNvbmZpZy5nZXREZWZhdWx0Q29uZmlnKCk7XG4gICAgdGhpcy5wYXJzZU9wdGlvbnModGhpcy5vcHRzKTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoS0VZVVAsIFtcIiRldmVudFwiXSkgb25LZXlVcChldmVudDogYW55KSB7XG4gICAgY29uc3Qga2V5Q29kZTogbnVtYmVyID0gdGhpcy51dGlsU2VydmljZS5nZXRLZXlDb2RlRnJvbUV2ZW50KGV2ZW50KTtcbiAgICBpZiAodGhpcy5pZ25vcmVLZXlQcmVzcyhrZXlDb2RlKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBcbiAgICBpZiAoa2V5Q29kZSA9PT0gS2V5Q29kZS5lc2MpIHtcbiAgICAgIHRoaXMuY2xvc2VTZWxlY3RvcihDYWxUb2dnbGUuQ2xvc2VCeUVzYyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgY29uc3Qge2RhdGVSYW5nZSwgZGF0ZUZvcm1hdCwgbW9udGhMYWJlbHMsIGRhdGVSYW5nZURhdGVzRGVsaW1pdGVyfSA9IHRoaXMub3B0cztcbiAgICAgIGNvbnN0IHZhbHVlOiBzdHJpbmcgPSB0aGlzLmdldEhvc3RWYWx1ZSgpO1xuXG4gICAgICBsZXQgZGF0ZU1vZGVsOiBJTXlEYXRlTW9kZWwgPSBudWxsO1xuICAgICAgbGV0IHZhbGlkOiBib29sZWFuID0gZmFsc2U7XG4gICAgICBsZXQgdmFsaWRhdGVPcHRzOiBJTXlWYWxpZGF0ZU9wdGlvbnMgPSBudWxsO1xuICAgICAgaWYgKCFkYXRlUmFuZ2UpIHtcbiAgICAgICAgdmFsaWRhdGVPcHRzID0ge3ZhbGlkYXRlRGlzYWJsZWREYXRlczogdHJ1ZSwgc2VsZWN0ZWRWYWx1ZTogdGhpcy51dGlsU2VydmljZS5nZXRTZWxlY3RlZFZhbHVlKHRoaXMuc2VsZWN0ZWRWYWx1ZSwgZmFsc2UpfTtcbiAgICAgICAgY29uc3QgZGF0ZTogSU15RGF0ZSA9IHRoaXMudXRpbFNlcnZpY2UuaXNEYXRlVmFsaWQodmFsdWUsIHRoaXMub3B0cywgdmFsaWRhdGVPcHRzKTtcbiAgICAgICAgdmFsaWQgPSB0aGlzLnV0aWxTZXJ2aWNlLmlzSW5pdGlhbGl6ZWREYXRlKGRhdGUpO1xuICAgICAgICBpZiAodmFsaWQpIHtcbiAgICAgICAgICBkYXRlTW9kZWwgPSB0aGlzLnV0aWxTZXJ2aWNlLmdldERhdGVNb2RlbChkYXRlLCBudWxsLCBkYXRlRm9ybWF0LCBtb250aExhYmVscywgZGF0ZVJhbmdlRGF0ZXNEZWxpbWl0ZXIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdmFsaWRhdGVPcHRzID0ge3ZhbGlkYXRlRGlzYWJsZWREYXRlczogdHJ1ZSwgc2VsZWN0ZWRWYWx1ZTogdGhpcy51dGlsU2VydmljZS5nZXRTZWxlY3RlZFZhbHVlKHRoaXMuc2VsZWN0ZWRWYWx1ZSwgdHJ1ZSl9O1xuICAgICAgICBjb25zdCByYW5nZSA9IHRoaXMudXRpbFNlcnZpY2UuaXNEYXRlVmFsaWREYXRlUmFuZ2UodmFsdWUsIHRoaXMub3B0cywgdmFsaWRhdGVPcHRzKTtcbiAgICAgICAgY29uc3Qge2JlZ2luLCBlbmR9ID0gcmFuZ2U7XG4gICAgICAgIHZhbGlkID0gdGhpcy51dGlsU2VydmljZS5pc0luaXRpYWxpemVkRGF0ZShiZWdpbikgJiYgdGhpcy51dGlsU2VydmljZS5pc0luaXRpYWxpemVkRGF0ZShlbmQpO1xuICAgICAgICBpZiAodmFsaWQpIHtcbiAgICAgICAgICBkYXRlTW9kZWwgPSB0aGlzLnV0aWxTZXJ2aWNlLmdldERhdGVNb2RlbChudWxsLCByYW5nZSwgZGF0ZUZvcm1hdCwgbW9udGhMYWJlbHMsIGRhdGVSYW5nZURhdGVzRGVsaW1pdGVyKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLm9uQ2hhbmdlQ2IoZGF0ZU1vZGVsKTtcbiAgICAgIHRoaXMuZW1pdElucHV0RmllbGRDaGFuZ2VkKHZhbHVlLCB2YWxpZCk7XG4gICAgfVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcihCTFVSKSBvbkJsdXIoKSB7XG4gICAgY29uc3Qge2lucHV0RmllbGRWYWxpZGF0aW9uLCBkYXRlUmFuZ2UsIGRhdGVGb3JtYXQsIG1vbnRoTGFiZWxzLCBkYXRlUmFuZ2VEYXRlc0RlbGltaXRlciwgY2xvc2VTZWxlY3Rvck9uRGF0ZVNlbGVjdH0gPSB0aGlzLm9wdHM7XG5cbiAgICBpZiAoaW5wdXRGaWVsZFZhbGlkYXRpb24pIHtcbiAgICAgIGNvbnN0IHZhbHVlOiBzdHJpbmcgPSB0aGlzLmdldEhvc3RWYWx1ZSgpO1xuXG4gICAgICBsZXQgdmFsaWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgIGxldCB2YWxpZGF0ZU9wdHM6IElNeVZhbGlkYXRlT3B0aW9ucyA9IG51bGw7XG4gICAgICBpZiAoIWRhdGVSYW5nZSkge1xuICAgICAgICB2YWxpZGF0ZU9wdHMgPSB7dmFsaWRhdGVEaXNhYmxlZERhdGVzOiB0cnVlLCBzZWxlY3RlZFZhbHVlOiB0aGlzLnV0aWxTZXJ2aWNlLmdldFNlbGVjdGVkVmFsdWUodGhpcy5zZWxlY3RlZFZhbHVlLCBmYWxzZSl9O1xuICAgICAgICBjb25zdCBkYXRlOiBJTXlEYXRlID0gdGhpcy51dGlsU2VydmljZS5pc0RhdGVWYWxpZCh2YWx1ZSwgdGhpcy5vcHRzLCB2YWxpZGF0ZU9wdHMpO1xuICAgICAgICB2YWxpZCA9IHRoaXMudXRpbFNlcnZpY2UuaXNJbml0aWFsaXplZERhdGUoZGF0ZSk7XG4gICAgICAgIGlmICh2YWxpZCAmJiB0aGlzLmhvc3RUZXh0ICE9PSB2YWx1ZSkge1xuICAgICAgICAgIC8vIFZhbGlkIGRhdGVcbiAgICAgICAgICBjb25zdCBkYXRlTW9kZWw6IElNeURhdGVNb2RlbCA9IHRoaXMudXRpbFNlcnZpY2UuZ2V0RGF0ZU1vZGVsKGRhdGUsIG51bGwsIGRhdGVGb3JtYXQsIG1vbnRoTGFiZWxzLCBkYXRlUmFuZ2VEYXRlc0RlbGltaXRlcik7XG4gICAgICAgICAgdGhpcy5lbWl0RGF0ZUNoYW5nZWQoZGF0ZU1vZGVsKTtcbiAgICAgICAgICB0aGlzLnVwZGF0ZU1vZGVsKGRhdGVNb2RlbCk7XG4gICAgICAgICAgaWYgKGNsb3NlU2VsZWN0b3JPbkRhdGVTZWxlY3QpIHtcbiAgICAgICAgICAgIHRoaXMuY2xvc2VTZWxlY3RvcihDYWxUb2dnbGUuQ2xvc2VCeURhdGVTZWwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHZhbGlkYXRlT3B0cyA9IHt2YWxpZGF0ZURpc2FibGVkRGF0ZXM6IHRydWUsIHNlbGVjdGVkVmFsdWU6IHRoaXMudXRpbFNlcnZpY2UuZ2V0U2VsZWN0ZWRWYWx1ZSh0aGlzLnNlbGVjdGVkVmFsdWUsIHRydWUpfTtcbiAgICAgICAgY29uc3QgZGF0ZVJhbmdlOiBJTXlEYXRlUmFuZ2UgPSB0aGlzLnV0aWxTZXJ2aWNlLmlzRGF0ZVZhbGlkRGF0ZVJhbmdlKHZhbHVlLCB0aGlzLm9wdHMsIHZhbGlkYXRlT3B0cyk7XG4gICAgICAgIGNvbnN0IHtiZWdpbiwgZW5kfSA9IGRhdGVSYW5nZTtcbiAgICAgICAgdmFsaWQgPSB0aGlzLnV0aWxTZXJ2aWNlLmlzSW5pdGlhbGl6ZWREYXRlKGJlZ2luKSAmJiB0aGlzLnV0aWxTZXJ2aWNlLmlzSW5pdGlhbGl6ZWREYXRlKGVuZCk7XG4gICAgICAgIGlmICh2YWxpZCAmJiB0aGlzLmhvc3RUZXh0ICE9PSB2YWx1ZSkge1xuICAgICAgICAgIC8vIFZhbGlkIGRhdGUgcmFuZ2VcbiAgICAgICAgICBjb25zdCBkYXRlTW9kZWw6IElNeURhdGVNb2RlbCA9IHRoaXMudXRpbFNlcnZpY2UuZ2V0RGF0ZU1vZGVsKG51bGwsIGRhdGVSYW5nZSwgZGF0ZUZvcm1hdCwgbW9udGhMYWJlbHMsIGRhdGVSYW5nZURhdGVzRGVsaW1pdGVyKTtcbiAgICAgICAgICB0aGlzLmVtaXREYXRlQ2hhbmdlZChkYXRlTW9kZWwpO1xuICAgICAgICAgIHRoaXMudXBkYXRlTW9kZWwoZGF0ZU1vZGVsKTtcbiAgICAgICAgICBpZiAoY2xvc2VTZWxlY3Rvck9uRGF0ZVNlbGVjdCkge1xuICAgICAgICAgICAgdGhpcy5jbG9zZVNlbGVjdG9yKENhbFRvZ2dsZS5DbG9zZUJ5RGF0ZVNlbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghdmFsaWQgJiYgdGhpcy5ob3N0VGV4dCAhPT0gdmFsdWUpIHtcbiAgICAgICAgaWYgKHZhbHVlID09PSBFTVBUWV9TVFIpIHtcbiAgICAgICAgICB0aGlzLmNsZWFyRGF0ZSgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHRoaXMub25DaGFuZ2VDYihudWxsKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLmhvc3RUZXh0ID0gdmFsdWU7XG4gICAgfVxuXG4gICAgdGhpcy5vblRvdWNoZWRDYigpO1xuICB9XG5cbiAgcHJpdmF0ZSBvbkNsaWNrV3JhcHBlciA9IChldmVudDogYW55KSA9PiB0aGlzLm9uQ2xpY2soZXZlbnQpO1xuXG4gIHByaXZhdGUgb25DbGljayhldmVudDogYW55KSB7XG4gICAgaWYgKHRoaXMub3B0cy5jbG9zZVNlbGVjdG9yT25Eb2N1bWVudENsaWNrICYmICF0aGlzLnByZXZlbnRDbG9zZSAmJiBldmVudC50YXJnZXQgJiYgdGhpcy5jUmVmIFxuICAgICAgICAmJiB0aGlzLmVsZW0ubmF0aXZlRWxlbWVudCAhPT0gZXZlbnQudGFyZ2V0ICYmICF0aGlzLmNSZWYubG9jYXRpb24ubmF0aXZlRWxlbWVudC5jb250YWlucyhldmVudC50YXJnZXQpIFxuICAgICAgICAmJiAhdGhpcy5kaXNhYmxlZCkge1xuICAgICAgdGhpcy5jbG9zZVNlbGVjdG9yKENhbFRvZ2dsZS5DbG9zZUJ5T3V0Q2xpY2spO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKGNoYW5nZXMuaGFzT3duUHJvcGVydHkoTE9DQUxFKSkge1xuICAgICAgdGhpcy5zZXRMb2NhbGVPcHRpb25zKCk7XG4gICAgfVxuXG4gICAgaWYgKGNoYW5nZXMuaGFzT3duUHJvcGVydHkoREVGQVVMVF9NT05USCkpIHtcbiAgICAgIGxldCBkbTogYW55ID0gY2hhbmdlc1tERUZBVUxUX01PTlRIXS5jdXJyZW50VmFsdWU7XG4gICAgICBpZiAodHlwZW9mIGRtID09PSBPQkpFQ1QpIHtcbiAgICAgICAgaWYgKCFkbS5vdmVycmlkZVNlbGVjdGlvbikge1xuICAgICAgICAgIGRtLm92ZXJyaWRlU2VsZWN0aW9uID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBkbSA9IHtkZWZNb250aDogZG0sIG92ZXJyaWRlU2VsZWN0aW9uOiBmYWxzZX07XG4gICAgICB9XG4gICAgICBcbiAgICAgIHRoaXMuZGVmYXVsdE1vbnRoID0gZG07XG4gICAgfVxuXG4gICAgaWYgKGNoYW5nZXMuaGFzT3duUHJvcGVydHkoT1BUSU9OUykpIHtcbiAgICAgIHRoaXMucGFyc2VPcHRpb25zKGNoYW5nZXNbT1BUSU9OU10uY3VycmVudFZhbHVlKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jUmVmKSB7XG4gICAgICB0aGlzLmNSZWYuaW5zdGFuY2UucmVmcmVzaENvbXBvbmVudCh0aGlzLm9wdHMsIHRoaXMuZGVmYXVsdE1vbnRoLCB0aGlzLnNlbGVjdGVkVmFsdWUsIHRoaXMuZ2V0SG9zdFZhbHVlKCkpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLmNsb3NlQ2FsZW5kYXIoKTtcbiAgfVxuXG4gIHB1YmxpYyBzZXRMb2NhbGVPcHRpb25zKCk6IHZvaWQge1xuICAgIGNvbnN0IG9wdHM6IElNeU9wdGlvbnMgPSB0aGlzLmxvY2FsZVNlcnZpY2UuZ2V0TG9jYWxlT3B0aW9ucyh0aGlzLmxvY2FsZSk7XG4gICAgT2JqZWN0LmtleXMob3B0cykuZm9yRWFjaCgoaykgPT4ge1xuICAgICAgKDxJTXlPcHRpb25zPiB0aGlzLm9wdHMpW2tdID0gb3B0c1trXTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBwYXJzZU9wdGlvbnMob3B0czogSU15T3B0aW9ucyk6IHZvaWQge1xuICAgIGlmIChvcHRzKSB7XG4gICAgICBPYmplY3Qua2V5cyhvcHRzKS5mb3JFYWNoKChrKSA9PiB7XG4gICAgICAgICg8SU15T3B0aW9ucz4gdGhpcy5vcHRzKVtrXSA9IG9wdHNba107XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCB7bWluWWVhciwgbWF4WWVhciwgb3BlblNlbGVjdG9yVG9wT2ZJbnB1dCwgaW5saW5lfSA9IHRoaXMub3B0cztcblxuICAgIGlmIChtaW5ZZWFyIDwgWWVhci5taW4pIHtcbiAgICAgIHRoaXMub3B0cy5taW5ZZWFyID0gWWVhci5taW47XG4gICAgfVxuXG4gICAgaWYgKG1heFllYXIgPiBZZWFyLm1heCkge1xuICAgICAgdGhpcy5vcHRzLm1heFllYXIgPSBZZWFyLm1heDtcbiAgICB9XG5cbiAgICBpZiAob3BlblNlbGVjdG9yVG9wT2ZJbnB1dCB8fCBpbmxpbmUpIHtcbiAgICAgIHRoaXMub3B0cy5zaG93U2VsZWN0b3JBcnJvdyA9IGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChpbmxpbmUpIHtcbiAgICAgIHRoaXMub3BlbkNhbGVuZGFyKCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHdyaXRlVmFsdWUodmFsdWU6IGFueSk6IHZvaWQge1xuICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHZhbGlkYXRlT3B0czogSU15VmFsaWRhdGVPcHRpb25zID0gbnVsbDtcbiAgICBjb25zdCB7ZGF0ZUZvcm1hdCwgbW9udGhMYWJlbHMsIGRhdGVSYW5nZURhdGVzRGVsaW1pdGVyLCBpbmxpbmV9ID0gdGhpcy5vcHRzO1xuXG4gICAgaWYgKCF2YWx1ZSkge1xuICAgICAgdGhpcy5zZXRIb3N0VmFsdWUoRU1QVFlfU1RSKTtcbiAgICAgIHRoaXMuZW1pdElucHV0RmllbGRDaGFuZ2VkKEVNUFRZX1NUUiwgZmFsc2UpO1xuXG4gICAgICBpZiAodGhpcy5jUmVmKSB7XG4gICAgICAgIHRoaXMuY1JlZi5pbnN0YW5jZS5yZXNldERhdGVWYWx1ZSgpO1xuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmICghdmFsdWUuaXNSYW5nZSAmJiB2YWx1ZS5zaW5nbGVEYXRlKSB7XG4gICAgICAvLyBzaW5nbGUgZGF0ZVxuICAgICAgbGV0IHtkYXRlLCBqc0RhdGV9ID0gdmFsdWUuc2luZ2xlRGF0ZTtcbiAgICAgIGlmICghZGF0ZSkge1xuICAgICAgICBkYXRlID0gdGhpcy51dGlsU2VydmljZS5qc0RhdGVUb015RGF0ZShqc0RhdGUpO1xuICAgICAgfVxuICAgICAgXG4gICAgICBjb25zdCBmb3JtYXR0ZWQ6IHN0cmluZyA9IHRoaXMudXRpbFNlcnZpY2UuZm9ybWF0RGF0ZShkYXRlLCBkYXRlRm9ybWF0LCBtb250aExhYmVscyk7XG5cbiAgICAgIHZhbGlkYXRlT3B0cyA9IHt2YWxpZGF0ZURpc2FibGVkRGF0ZXM6IGZhbHNlLCBzZWxlY3RlZFZhbHVlOiB0aGlzLnV0aWxTZXJ2aWNlLmdldFNlbGVjdGVkVmFsdWUodGhpcy5zZWxlY3RlZFZhbHVlLCBmYWxzZSl9O1xuICAgICAgY29uc3QgdmFsaWQ6IGJvb2xlYW4gPSB0aGlzLnV0aWxTZXJ2aWNlLmlzSW5pdGlhbGl6ZWREYXRlKHRoaXMudXRpbFNlcnZpY2UuaXNEYXRlVmFsaWQoZm9ybWF0dGVkLCB0aGlzLm9wdHMsIHZhbGlkYXRlT3B0cykpO1xuICAgICAgaWYgKHZhbGlkKSB7XG4gICAgICAgIHRoaXMuc2V0SG9zdFZhbHVlKGZvcm1hdHRlZCk7XG4gICAgICAgIHRoaXMuZW1pdElucHV0RmllbGRDaGFuZ2VkKGZvcm1hdHRlZCwgdmFsaWQpO1xuICAgICAgICB0aGlzLnNldFNlbGVjdGVkVmFsdWUodGhpcy51dGlsU2VydmljZS5nZXREYXRlTW9kZWwoZGF0ZSwgbnVsbCwgZGF0ZUZvcm1hdCwgbW9udGhMYWJlbHMsIGRhdGVSYW5nZURhdGVzRGVsaW1pdGVyKSk7XG5cbiAgICAgICAgaWYgKHRoaXMuY1JlZikge1xuICAgICAgICAgIHRoaXMuY1JlZi5pbnN0YW5jZS5yZWZyZXNoQ29tcG9uZW50KHRoaXMub3B0cywgdGhpcy5kZWZhdWx0TW9udGgsIHRoaXMuc2VsZWN0ZWRWYWx1ZSwgdGhpcy5nZXRIb3N0VmFsdWUoKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAodmFsdWUuaXNSYW5nZSAmJiB2YWx1ZS5kYXRlUmFuZ2UpIHtcbiAgICAgIC8vIGRhdGUgcmFuZ2VcbiAgICAgIGxldCB7YmVnaW5EYXRlLCBiZWdpbkpzRGF0ZSwgZW5kRGF0ZSwgZW5kSnNEYXRlfSA9IHZhbHVlLmRhdGVSYW5nZTtcbiAgICAgIGlmICghYmVnaW5EYXRlIHx8ICFlbmREYXRlKSB7XG4gICAgICAgIGJlZ2luRGF0ZSA9IHRoaXMudXRpbFNlcnZpY2UuanNEYXRlVG9NeURhdGUoYmVnaW5Kc0RhdGUpO1xuICAgICAgICBlbmREYXRlID0gdGhpcy51dGlsU2VydmljZS5qc0RhdGVUb015RGF0ZShlbmRKc0RhdGUpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBmb3JtYXR0ZWQ6IHN0cmluZyA9IHRoaXMudXRpbFNlcnZpY2UuZm9ybWF0RGF0ZShiZWdpbkRhdGUsIGRhdGVGb3JtYXQsIG1vbnRoTGFiZWxzKSArIGRhdGVSYW5nZURhdGVzRGVsaW1pdGVyICtcbiAgICAgICAgdGhpcy51dGlsU2VydmljZS5mb3JtYXREYXRlKGVuZERhdGUsIGRhdGVGb3JtYXQsIG1vbnRoTGFiZWxzKTtcbiAgICAgIHZhbGlkYXRlT3B0cyA9IHt2YWxpZGF0ZURpc2FibGVkRGF0ZXM6IGZhbHNlLCBzZWxlY3RlZFZhbHVlOiB0aGlzLnV0aWxTZXJ2aWNlLmdldFNlbGVjdGVkVmFsdWUodGhpcy5zZWxlY3RlZFZhbHVlLCB0cnVlKX07XG4gICAgICBjb25zdCB7YmVnaW4sIGVuZH0gPSB0aGlzLnV0aWxTZXJ2aWNlLmlzRGF0ZVZhbGlkRGF0ZVJhbmdlKGZvcm1hdHRlZCwgdGhpcy5vcHRzLCB2YWxpZGF0ZU9wdHMpO1xuICAgICAgY29uc3QgdmFsaWQ6IGJvb2xlYW4gPSB0aGlzLnV0aWxTZXJ2aWNlLmlzSW5pdGlhbGl6ZWREYXRlKGJlZ2luKSAmJiB0aGlzLnV0aWxTZXJ2aWNlLmlzSW5pdGlhbGl6ZWREYXRlKGVuZCk7XG4gICAgICBpZiAodmFsaWQpIHtcbiAgICAgICAgdGhpcy5zZXRIb3N0VmFsdWUoZm9ybWF0dGVkKTtcbiAgICAgICAgdGhpcy5lbWl0SW5wdXRGaWVsZENoYW5nZWQoZm9ybWF0dGVkLCB2YWxpZCk7XG5cbiAgICAgICAgY29uc3QgZGF0ZVJhbmdlOiBJTXlEYXRlUmFuZ2UgPSB7YmVnaW46IGJlZ2luRGF0ZSwgZW5kOiBlbmREYXRlfTtcbiAgICAgICAgdGhpcy5zZXRTZWxlY3RlZFZhbHVlKHRoaXMudXRpbFNlcnZpY2UuZ2V0RGF0ZU1vZGVsKG51bGwsIGRhdGVSYW5nZSwgZGF0ZUZvcm1hdCwgbW9udGhMYWJlbHMsIGRhdGVSYW5nZURhdGVzRGVsaW1pdGVyKSk7XG5cbiAgICAgICAgaWYgKHRoaXMuY1JlZikge1xuICAgICAgICAgIHRoaXMuY1JlZi5pbnN0YW5jZS5yZWZyZXNoQ29tcG9uZW50KHRoaXMub3B0cywgdGhpcy5kZWZhdWx0TW9udGgsIHRoaXMuc2VsZWN0ZWRWYWx1ZSwgdGhpcy5nZXRIb3N0VmFsdWUoKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcmVnaXN0ZXJPbkNoYW5nZShmbjogYW55KTogdm9pZCB7XG4gICAgdGhpcy5vbkNoYW5nZUNiID0gZm47XG4gIH1cblxuICBwdWJsaWMgcmVnaXN0ZXJPblRvdWNoZWQoZm46IGFueSk6IHZvaWQge1xuICAgIHRoaXMub25Ub3VjaGVkQ2IgPSBmbjtcbiAgfVxuXG4gIHB1YmxpYyBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLmRpc2FibGVkID0gaXNEaXNhYmxlZDtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFByb3BlcnR5KHRoaXMuZWxlbS5uYXRpdmVFbGVtZW50LCBESVNBQkxFRCwgaXNEaXNhYmxlZCk7XG5cbiAgICBpZiAoaXNEaXNhYmxlZCkge1xuICAgICAgdGhpcy5jbG9zZUNhbGVuZGFyKCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHZhbGlkYXRlKGM6IEFic3RyYWN0Q29udHJvbCk6IHsgW3A6IHN0cmluZ106IGFueSB9IHtcbiAgICBjb25zdCB2YWx1ZTogc3RyaW5nID0gdGhpcy5nZXRIb3N0VmFsdWUoKTtcblxuICAgIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gRU1QVFlfU1RSKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBsZXQgdmFsaWRhdGVPcHRzOiBJTXlWYWxpZGF0ZU9wdGlvbnMgPSBudWxsO1xuICAgIGlmICghdGhpcy5vcHRzLmRhdGVSYW5nZSkge1xuICAgICAgdmFsaWRhdGVPcHRzID0ge3ZhbGlkYXRlRGlzYWJsZWREYXRlczogdHJ1ZSwgc2VsZWN0ZWRWYWx1ZTogdGhpcy51dGlsU2VydmljZS5nZXRTZWxlY3RlZFZhbHVlKHRoaXMuc2VsZWN0ZWRWYWx1ZSwgZmFsc2UpfTtcbiAgICAgIGNvbnN0IGRhdGU6IElNeURhdGUgPSB0aGlzLnV0aWxTZXJ2aWNlLmlzRGF0ZVZhbGlkKHZhbHVlLCB0aGlzLm9wdHMsIHZhbGlkYXRlT3B0cyk7XG4gICAgICBpZiAoIXRoaXMudXRpbFNlcnZpY2UuaXNJbml0aWFsaXplZERhdGUoZGF0ZSkpIHtcbiAgICAgICAgcmV0dXJuIHtpbnZhbGlkRGF0ZUZvcm1hdDogdHJ1ZX07XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFsaWRhdGVPcHRzID0ge3ZhbGlkYXRlRGlzYWJsZWREYXRlczogdHJ1ZSwgc2VsZWN0ZWRWYWx1ZTogdGhpcy51dGlsU2VydmljZS5nZXRTZWxlY3RlZFZhbHVlKHRoaXMuc2VsZWN0ZWRWYWx1ZSwgdHJ1ZSl9O1xuICAgICAgY29uc3Qge2JlZ2luLCBlbmR9ID0gdGhpcy51dGlsU2VydmljZS5pc0RhdGVWYWxpZERhdGVSYW5nZSh2YWx1ZSwgdGhpcy5vcHRzLCB2YWxpZGF0ZU9wdHMpO1xuICAgICAgaWYgKCF0aGlzLnV0aWxTZXJ2aWNlLmlzSW5pdGlhbGl6ZWREYXRlKGJlZ2luKSB8fCAhdGhpcy51dGlsU2VydmljZS5pc0luaXRpYWxpemVkRGF0ZShlbmQpKSB7XG4gICAgICAgIHJldHVybiB7aW52YWxpZERhdGVGb3JtYXQ6IHRydWV9O1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHB1YmxpYyBvcGVuQ2FsZW5kYXIoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5wcmV2ZW50Q2xvc2UgPSB0cnVlO1xuICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICBpZiAodGhpcy5jUmVmID09PSBudWxsKSB7XG4gICAgICB0aGlzLmNSZWYgPSB0aGlzLnZjUmVmLmNyZWF0ZUNvbXBvbmVudCh0aGlzLmNmci5yZXNvbHZlQ29tcG9uZW50RmFjdG9yeShDYWxlbmRhckNvbXBvbmVudCkpO1xuICAgICAgdGhpcy5hcHBlbmRTZWxlY3Rvcih0aGlzLmNSZWYubG9jYXRpb24ubmF0aXZlRWxlbWVudCk7XG4gICAgICB0aGlzLmNSZWYuaW5zdGFuY2UuaW5pdGlhbGl6ZUNvbXBvbmVudChcbiAgICAgICAgdGhpcy5vcHRzLFxuICAgICAgICB0aGlzLmRlZmF1bHRNb250aCxcbiAgICAgICAgdGhpcy5zZWxlY3RlZFZhbHVlLFxuICAgICAgICB0aGlzLmdldEhvc3RWYWx1ZSgpLFxuICAgICAgICB0aGlzLmdldFNlbGVjdG9yUG9zaXRpb24odGhpcy5lbGVtLm5hdGl2ZUVsZW1lbnQpLFxuICAgICAgICAoZG06IElNeURhdGVNb2RlbCwgY2xvc2U6IGJvb2xlYW4pID0+IHtcbiAgICAgICAgICB0aGlzLmZvY3VzVG9JbnB1dCgpO1xuICAgICAgICAgIHRoaXMuZW1pdERhdGVDaGFuZ2VkKGRtKTtcbiAgICAgICAgICB0aGlzLmVtaXRJbnB1dEZpZWxkQ2hhbmdlZCh0aGlzLnV0aWxTZXJ2aWNlLmdldEZvcm1hdHRlZERhdGUoZG0pLCB0cnVlKTtcbiAgICAgICAgICB0aGlzLnVwZGF0ZU1vZGVsKGRtKTtcbiAgICAgICAgICBpZiAoY2xvc2UpIHtcbiAgICAgICAgICAgIHRoaXMuY2xvc2VTZWxlY3RvcihDYWxUb2dnbGUuQ2xvc2VCeURhdGVTZWwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgKGN2YzogSU15Q2FsZW5kYXJWaWV3Q2hhbmdlZCkgPT4ge1xuICAgICAgICAgIHRoaXMuZW1pdENhbGVuZGFyQ2hhbmdlZChjdmMpO1xuICAgICAgICB9LFxuICAgICAgICAocmRzOiBJTXlSYW5nZURhdGVTZWxlY3Rpb24pID0+IHtcbiAgICAgICAgICB0aGlzLmVtaXRSYW5nZURhdGVTZWxlY3Rpb24ocmRzKTtcbiAgICAgICAgfSxcbiAgICAgICAgKHZhOiBBY3RpdmVWaWV3KSA9PiB7XG4gICAgICAgICAgdGhpcy5lbWl0Vmlld0FjdGl2YXRlZCh2YSk7XG4gICAgICAgIH0sXG4gICAgICAgICgpID0+IHtcbiAgICAgICAgICB0aGlzLmNsb3NlU2VsZWN0b3IoQ2FsVG9nZ2xlLkNsb3NlQnlFc2MpO1xuICAgICAgICB9XG4gICAgICApO1xuICAgICAgdGhpcy5lbWl0Q2FsZW5kYXJUb2dnbGUoQ2FsVG9nZ2xlLk9wZW4pO1xuXG4gICAgICBpZiAoIXRoaXMub3B0cy5pbmxpbmUpIHtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihDTElDSywgdGhpcy5vbkNsaWNrV3JhcHBlcik7XG4gICAgICB9XG4gICAgfVxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5wcmV2ZW50Q2xvc2UgPSBmYWxzZTtcbiAgICB9LCBQUkVWRU5UX0NMT1NFX1RJTUVPVVQpO1xuICB9XG5cbiAgcHVibGljIGNsb3NlQ2FsZW5kYXIoKTogdm9pZCB7XG4gICAgdGhpcy5jbG9zZVNlbGVjdG9yKENhbFRvZ2dsZS5DbG9zZUJ5Q2FsQnRuKTtcbiAgfVxuXG4gIHB1YmxpYyB0b2dnbGVDYWxlbmRhcigpOiBib29sZWFuIHwgbnVsbCB7XG4gICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBpc09wZW46IGJvb2xlYW4gPSB0aGlzLmNSZWYgPT09IG51bGw7XG5cbiAgICBpZiAoaXNPcGVuKSB7XG4gICAgICB0aGlzLm9wZW5DYWxlbmRhcigpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRoaXMuY2xvc2VTZWxlY3RvcihDYWxUb2dnbGUuQ2xvc2VCeUNhbEJ0bik7XG4gICAgfVxuICAgIHJldHVybiBpc09wZW47XG4gIH1cblxuICBwdWJsaWMgY2xlYXJEYXRlKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qge2lubGluZX0gPSB0aGlzLm9wdHM7XG5cbiAgICB0aGlzLnNldEhvc3RWYWx1ZShFTVBUWV9TVFIpO1xuICAgIHRoaXMuZW1pdERhdGVDaGFuZ2VkKHtcbiAgICAgIGlzUmFuZ2U6IHRoaXMub3B0cy5kYXRlUmFuZ2UsXG4gICAgICBzaW5nbGVEYXRlOiB7XG4gICAgICAgIGRhdGU6IHRoaXMudXRpbFNlcnZpY2UucmVzZXREYXRlKCksXG4gICAgICAgIGpzRGF0ZTogbnVsbCxcbiAgICAgICAgZm9ybWF0dGVkOiBFTVBUWV9TVFIsXG4gICAgICAgIGVwb2M6IDBcbiAgICAgIH0sXG4gICAgICBkYXRlUmFuZ2U6IHtcbiAgICAgICAgYmVnaW5EYXRlOiB0aGlzLnV0aWxTZXJ2aWNlLnJlc2V0RGF0ZSgpLFxuICAgICAgICBiZWdpbkpzRGF0ZTogbnVsbCxcbiAgICAgICAgYmVnaW5FcG9jOiAwLFxuICAgICAgICBlbmREYXRlOiB0aGlzLnV0aWxTZXJ2aWNlLnJlc2V0RGF0ZSgpLFxuICAgICAgICBlbmRKc0RhdGU6IG51bGwsXG4gICAgICAgIGVuZEVwb2M6IDAsXG4gICAgICAgIGZvcm1hdHRlZDogRU1QVFlfU1RSXG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLm9uQ2hhbmdlQ2IobnVsbCk7XG4gICAgdGhpcy5vblRvdWNoZWRDYigpO1xuXG4gICAgaWYgKHRoaXMuY1JlZikge1xuICAgICAgdGhpcy5jUmVmLmluc3RhbmNlLmNsZWFyRGF0ZSgpO1xuICAgIH1cblxuICAgIGlmICghaW5saW5lKSB7XG4gICAgICB0aGlzLmNsb3NlU2VsZWN0b3IoQ2FsVG9nZ2xlLkNsb3NlQnlDYWxCdG4pO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBpc0RhdGVWYWxpZCgpOiBib29sZWFuIHtcbiAgICBjb25zdCB2YWx1ZTogc3RyaW5nID0gdGhpcy5nZXRIb3N0VmFsdWUoKTtcblxuICAgIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gRU1QVFlfU1RSKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgbGV0IHZhbGlkYXRlT3B0czogSU15VmFsaWRhdGVPcHRpb25zID0gbnVsbDtcbiAgICBpZiAoIXRoaXMub3B0cy5kYXRlUmFuZ2UpIHtcbiAgICAgIHZhbGlkYXRlT3B0cyA9IHt2YWxpZGF0ZURpc2FibGVkRGF0ZXM6IHRydWUsIHNlbGVjdGVkVmFsdWU6IHRoaXMudXRpbFNlcnZpY2UuZ2V0U2VsZWN0ZWRWYWx1ZSh0aGlzLnNlbGVjdGVkVmFsdWUsIGZhbHNlKX07XG4gICAgICBjb25zdCBkYXRlOiBJTXlEYXRlID0gdGhpcy51dGlsU2VydmljZS5pc0RhdGVWYWxpZCh2YWx1ZSwgdGhpcy5vcHRzLCB2YWxpZGF0ZU9wdHMpO1xuICAgICAgaWYgKHRoaXMudXRpbFNlcnZpY2UuaXNJbml0aWFsaXplZERhdGUoZGF0ZSkpIHtcbiAgICAgICAgdGhpcy5lbWl0SW5wdXRGaWVsZENoYW5nZWQodmFsdWUsIHRydWUpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2YWxpZGF0ZU9wdHMgPSB7dmFsaWRhdGVEaXNhYmxlZERhdGVzOiB0cnVlLCBzZWxlY3RlZFZhbHVlOiB0aGlzLnV0aWxTZXJ2aWNlLmdldFNlbGVjdGVkVmFsdWUodGhpcy5zZWxlY3RlZFZhbHVlLCB0cnVlKX07XG4gICAgICBjb25zdCB7YmVnaW4sIGVuZH0gPSB0aGlzLnV0aWxTZXJ2aWNlLmlzRGF0ZVZhbGlkRGF0ZVJhbmdlKHZhbHVlLCB0aGlzLm9wdHMsIHZhbGlkYXRlT3B0cyk7XG4gICAgICBpZiAodGhpcy51dGlsU2VydmljZS5pc0luaXRpYWxpemVkRGF0ZShiZWdpbikgJiYgdGhpcy51dGlsU2VydmljZS5pc0luaXRpYWxpemVkRGF0ZShlbmQpKSB7XG4gICAgICAgIHRoaXMuZW1pdElucHV0RmllbGRDaGFuZ2VkKHZhbHVlLCB0cnVlKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIHRoaXMuZW1pdElucHV0RmllbGRDaGFuZ2VkKHZhbHVlLCBmYWxzZSk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHVibGljIGhlYWRlckFjdGlvbihoZWFkZXJBY3Rpb246IEhlYWRlckFjdGlvbik6IHZvaWQge1xuICAgIGlmICh0aGlzLmNSZWYpIHtcbiAgICAgIHRoaXMuY1JlZi5pbnN0YW5jZS5oZWFkZXJBY3Rpb24oaGVhZGVyQWN0aW9uKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGlnbm9yZUtleVByZXNzKGtleUNvZGU6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgIHJldHVybiBrZXlDb2RlID09PSBLZXlDb2RlLmxlZnRBcnJvdyB8fCBrZXlDb2RlID09PSBLZXlDb2RlLnJpZ2h0QXJyb3cgfHwga2V5Q29kZSA9PT0gS2V5Q29kZS51cEFycm93IHx8IGtleUNvZGUgPT09IEtleUNvZGUuZG93bkFycm93IHx8IGtleUNvZGUgPT09IEtleUNvZGUudGFiIHx8IGtleUNvZGUgPT09IEtleUNvZGUuc2hpZnQ7XG4gIH1cblxuICBwcml2YXRlIG9uQW5pbWF0ZVdyYXBwZXIgPSAocmVhc29uOiBudW1iZXIpID0+IHRoaXMuYW5pbWF0aW9uRW5kKHJlYXNvbik7XG5cbiAgcHJpdmF0ZSBhbmltYXRpb25FbmQocmVhc29uOiBudW1iZXIpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5jUmVmKSB7XG4gICAgICB0aGlzLmNSZWYuaW5zdGFuY2Uuc2VsZWN0b3JFbC5uYXRpdmVFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoQU5JTUFUSU9OX0VORCwgdGhpcy5vbkFuaW1hdGVXcmFwcGVyKTtcbiAgICAgIHRoaXMucmVtb3ZlQ29tcG9uZW50KCk7XG4gICAgICB0aGlzLmVtaXRDYWxlbmRhclRvZ2dsZShyZWFzb24pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY2xvc2VTZWxlY3RvcihyZWFzb246IG51bWJlcik6IHZvaWQge1xuICAgIGNvbnN0IHtpbmxpbmUsIGNhbGVuZGFyQW5pbWF0aW9ufSA9IHRoaXMub3B0cztcbiAgICBcbiAgICBpZiAodGhpcy5jUmVmICYmICFpbmxpbmUpIHtcbiAgICAgIGlmIChjYWxlbmRhckFuaW1hdGlvbi5vdXQgIT09IENhbEFuaW1hdGlvbi5Ob25lKSB7XG4gICAgICAgIGNvbnN0IHtpbnN0YW5jZX0gPSB0aGlzLmNSZWY7XG4gICAgICAgIGluc3RhbmNlLnNlbGVjdG9yRWwubmF0aXZlRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKEFOSU1BVElPTl9FTkQsIHRoaXMub25BbmltYXRlV3JhcHBlci5iaW5kKHRoaXMsIHJlYXNvbikpO1xuICAgICAgICBpbnN0YW5jZS5zZXRDYWxlbmRhckFuaW1hdGlvbihjYWxlbmRhckFuaW1hdGlvbiwgZmFsc2UpO1xuXG4gICAgICAgIC8vIEluIGNhc2UgdGhlIGFuaW1hdGlvbmVuZCBldmVudCBpcyBub3QgZmlyZWRcbiAgICAgICAgc2V0VGltZW91dCh0aGlzLm9uQW5pbWF0ZVdyYXBwZXIuYmluZCh0aGlzLCByZWFzb24pLCBBTklNQVRJT05fVElNRU9VVCk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdGhpcy5yZW1vdmVDb21wb25lbnQoKTtcbiAgICAgICAgdGhpcy5lbWl0Q2FsZW5kYXJUb2dnbGUocmVhc29uKTtcbiAgICAgIH1cblxuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihDTElDSywgdGhpcy5vbkNsaWNrV3JhcHBlcik7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSByZW1vdmVDb21wb25lbnQoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMudmNSZWYgIT09IG51bGwpIHtcbiAgICAgIHRoaXMudmNSZWYucmVtb3ZlKHRoaXMudmNSZWYuaW5kZXhPZih0aGlzLmNSZWYuaG9zdFZpZXcpKTtcbiAgICAgIHRoaXMuY1JlZiA9IG51bGw7XG4gICAgfVxuICB9XG4gIFxuICBwcml2YXRlIHVwZGF0ZU1vZGVsKG1vZGVsOiBJTXlEYXRlTW9kZWwpOiB2b2lkIHtcbiAgICB0aGlzLnNldEhvc3RWYWx1ZSh0aGlzLnV0aWxTZXJ2aWNlLmdldEZvcm1hdHRlZERhdGUobW9kZWwpKTtcbiAgICB0aGlzLm9uQ2hhbmdlQ2IobW9kZWwpO1xuICAgIHRoaXMub25Ub3VjaGVkQ2IoKTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0SG9zdFZhbHVlKHZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCB7ZGl2SG9zdEVsZW1lbnR9ID0gdGhpcy5vcHRzO1xuICAgIHRoaXMuaG9zdFRleHQgPSB2YWx1ZTtcbiAgICBjb25zdCB2YWx1ZVR5cGU6IHN0cmluZyA9ICFkaXZIb3N0RWxlbWVudC5lbmFibGVkID8gVkFMVUUgOiBJTk5FUl9IVE1MO1xuICAgIHZhbHVlID0gdmFsdWVUeXBlID09PSBJTk5FUl9IVE1MICYmIHZhbHVlID09PSBFTVBUWV9TVFIgPyBkaXZIb3N0RWxlbWVudC5wbGFjZWhvbGRlciA6IHZhbHVlO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy5lbGVtLm5hdGl2ZUVsZW1lbnQsIHZhbHVlVHlwZSwgdmFsdWUpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRIb3N0VmFsdWUoKTogc3RyaW5nIHtcbiAgICBjb25zdCB7dmFsdWUsIGlubmVySFRNTH0gPSB0aGlzLmVsZW0ubmF0aXZlRWxlbWVudDtcbiAgICByZXR1cm4gIXRoaXMub3B0cy5kaXZIb3N0RWxlbWVudC5lbmFibGVkID8gdmFsdWUgOiBpbm5lckhUTUw7XG4gIH1cblxuICBwcml2YXRlIGZvY3VzVG9JbnB1dCgpOiB2b2lkIHtcbiAgICBjb25zdCB7Zm9jdXNJbnB1dE9uRGF0ZVNlbGVjdCwgZGl2SG9zdEVsZW1lbnR9ID0gdGhpcy5vcHRzO1xuICAgIGlmIChmb2N1c0lucHV0T25EYXRlU2VsZWN0ICYmICFkaXZIb3N0RWxlbWVudC5lbmFibGVkKSB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5lbGVtLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZW1pdERhdGVDaGFuZ2VkKGRhdGVNb2RlbDogSU15RGF0ZU1vZGVsKTogdm9pZCB7XG4gICAgdGhpcy5kYXRlQ2hhbmdlZC5lbWl0KGRhdGVNb2RlbCk7XG4gICAgdGhpcy5zZXRTZWxlY3RlZFZhbHVlKGRhdGVNb2RlbCk7XG4gIH1cblxuICBwcml2YXRlIHNldFNlbGVjdGVkVmFsdWUoZGF0ZU1vZGVsOiBJTXlEYXRlTW9kZWwpOiB2b2lkIHtcbiAgICBjb25zdCB7aXNSYW5nZSwgZGF0ZVJhbmdlLCBzaW5nbGVEYXRlfSA9IGRhdGVNb2RlbDtcbiAgICB0aGlzLnNlbGVjdGVkVmFsdWUgPSBpc1JhbmdlID8gZGF0ZVJhbmdlIDogc2luZ2xlRGF0ZTtcbiAgfVxuXG4gIHByaXZhdGUgZW1pdElucHV0RmllbGRDaGFuZ2VkKHZhbHVlOiBzdHJpbmcsIHZhbGlkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5pbnB1dEZpZWxkQ2hhbmdlZC5lbWl0KHt2YWx1ZSwgZGF0ZUZvcm1hdDogdGhpcy5vcHRzLmRhdGVGb3JtYXQsIHZhbGlkfSk7XG4gIH1cblxuICBwcml2YXRlIGVtaXRDYWxlbmRhckNoYW5nZWQoY3ZjOiBJTXlDYWxlbmRhclZpZXdDaGFuZ2VkKTogdm9pZCB7XG4gICAgdGhpcy5jYWxlbmRhclZpZXdDaGFuZ2VkLmVtaXQoY3ZjKTtcbiAgfVxuXG4gIHByaXZhdGUgZW1pdFJhbmdlRGF0ZVNlbGVjdGlvbihyZHM6IElNeVJhbmdlRGF0ZVNlbGVjdGlvbik6IHZvaWQge1xuICAgIHRoaXMucmFuZ2VEYXRlU2VsZWN0aW9uLmVtaXQocmRzKTtcbiAgfVxuXG4gIHByaXZhdGUgZW1pdFZpZXdBY3RpdmF0ZWQodmE6IEFjdGl2ZVZpZXcpOiB2b2lkIHtcbiAgICB0aGlzLnZpZXdBY3RpdmF0ZWQuZW1pdCh2YSk7XG4gIH1cblxuICBwcml2YXRlIGVtaXRDYWxlbmRhclRvZ2dsZShyZWFzb246IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMuY2FsZW5kYXJUb2dnbGUuZW1pdChyZWFzb24pO1xuICB9XG5cbiAgcHJpdmF0ZSBhcHBlbmRTZWxlY3RvcihlbGVtOiBhbnkpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5vcHRzLmFwcGVuZFNlbGVjdG9yVG9Cb2R5KSB7XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKEJPRFkpLmFwcGVuZENoaWxkKGVsZW0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0U2VsZWN0b3JQb3NpdGlvbihlbGVtOiBhbnkpOiBJTXlTZWxlY3RvclBvc2l0aW9uIHtcbiAgICBsZXQgdG9wOiBudW1iZXIgPSAwO1xuICAgIGxldCBsZWZ0OiBudW1iZXIgPSAwO1xuXG4gICAgY29uc3Qge2FwcGVuZFNlbGVjdG9yVG9Cb2R5LCBvcGVuU2VsZWN0b3JUb3BPZklucHV0LCBzZWxlY3RvckhlaWdodCwgc2VsZWN0b3JXaWR0aCwgc2hvd1NlbGVjdG9yQXJyb3csIGFsaWduU2VsZWN0b3JSaWdodH0gPSB0aGlzLm9wdHM7XG5cbiAgICBpZiAoYXBwZW5kU2VsZWN0b3JUb0JvZHkpIHtcbiAgICAgIGNvbnN0IGI6IGFueSA9IGRvY3VtZW50LmJvZHkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICBjb25zdCBlOiBhbnkgPSBlbGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgdG9wID0gZS50b3AgLSBiLnRvcDtcbiAgICAgIGxlZnQgPSBlLmxlZnQgLSBiLmxlZnQ7XG4gICAgfVxuXG4gICAgaWYgKG9wZW5TZWxlY3RvclRvcE9mSW5wdXQpIHtcbiAgICAgIHRvcCA9IHRvcCAtIHRoaXMuZ2V0U2VsZWN0b3JEaW1lbnNpb24oc2VsZWN0b3JIZWlnaHQpIC0gMjtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0b3AgPSB0b3AgKyBlbGVtLm9mZnNldEhlaWdodCArIChzaG93U2VsZWN0b3JBcnJvdyA/IDEyIDogMik7XG4gICAgfVxuXG4gICAgaWYgKGFsaWduU2VsZWN0b3JSaWdodCkge1xuICAgICAgbGVmdCA9IGxlZnQgKyBlbGVtLm9mZnNldFdpZHRoIC0gdGhpcy5nZXRTZWxlY3RvckRpbWVuc2lvbihzZWxlY3RvcldpZHRoKTtcbiAgICB9XG4gICAgcmV0dXJuIHt0b3A6IHRvcCArIFBYLCBsZWZ0OiBsZWZ0ICsgUFh9O1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRTZWxlY3RvckRpbWVuc2lvbih2YWx1ZTogc3RyaW5nKTogbnVtYmVyIHtcbiAgICByZXR1cm4gTnVtYmVyKHZhbHVlLnJlcGxhY2UoUFgsIEVNUFRZX1NUUikpO1xuICB9XG59XG4iXX0=