/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from "@angular/core";
import { UtilService } from "../../services/angular-mydatepicker.util.service";
import { KeyCode } from "../../enums/key-code.enum";
import { MonthId } from "../../enums/month-id.enum";
import { ActiveView } from "../../enums/active-view.enum";
import { OPTS, DATES, WEEK_DAYS, SELECTED_DATE, SELECTED_DATE_RANGE } from "../../constants/constants";
export class DayViewComponent {
    /**
     * @param {?} utilService
     */
    constructor(utilService) {
        this.utilService = utilService;
        this.dayCellClicked = new EventEmitter();
        this.dayCellKeyDown = new EventEmitter();
        this.viewActivated = new EventEmitter();
        this.prevMonthId = MonthId.prev;
        this.currMonthId = MonthId.curr;
        this.nextMonthId = MonthId.next;
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes.hasOwnProperty(OPTS)) {
            this.opts = changes[OPTS].currentValue;
        }
        if (changes.hasOwnProperty(DATES)) {
            this.dates = changes[DATES].currentValue;
        }
        if (changes.hasOwnProperty(WEEK_DAYS)) {
            this.weekDays = changes[WEEK_DAYS].currentValue;
        }
        if (changes.hasOwnProperty(SELECTED_DATE)) {
            this.selectedDate = changes[SELECTED_DATE].currentValue;
        }
        if (changes.hasOwnProperty(SELECTED_DATE_RANGE)) {
            this.selectedDateRange = changes[SELECTED_DATE_RANGE].currentValue;
        }
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        this.viewActivated.emit(ActiveView.Date);
    }
    /**
     * @param {?} event
     * @param {?} cell
     * @return {?}
     */
    onDayCellClicked(event, cell) {
        event.stopPropagation();
        if (cell.disabledDate.disabled) {
            return;
        }
        this.dayCellClicked.emit(cell);
    }
    /**
     * @param {?} event
     * @param {?} cell
     * @return {?}
     */
    onDayCellKeyDown(event, cell) {
        /** @type {?} */
        const keyCode = this.utilService.getKeyCodeFromEvent(event);
        if (keyCode !== KeyCode.tab) {
            event.preventDefault();
            if (keyCode === KeyCode.enter || keyCode === KeyCode.space) {
                this.onDayCellClicked(event, cell);
            }
            else if (this.opts.moveFocusByArrowKeys) {
                this.dayCellKeyDown.emit(event);
            }
        }
    }
    /**
     * @param {?} cell
     * @return {?}
     */
    onDayCellMouseEnter(cell) {
        if (this.utilService.isInitializedDate(this.selectedDateRange.begin) && !this.utilService.isInitializedDate(this.selectedDateRange.end)) {
            for (const w of this.dates) {
                for (const day of w.week) {
                    day.range = this.utilService.isDateSameOrEarlier(this.selectedDateRange.begin, day.dateObj) && this.utilService.isDateSameOrEarlier(day.dateObj, cell.dateObj);
                }
            }
        }
    }
    /**
     * @return {?}
     */
    onDayCellMouseLeave() {
        for (const w of this.dates) {
            for (const day of w.week) {
                day.range = false;
            }
        }
    }
    /**
     * @param {?} date
     * @return {?}
     */
    isDateInRange(date) {
        return this.utilService.isDateInRange(date, this.selectedDateRange);
    }
    /**
     * @param {?} date
     * @return {?}
     */
    isDateSame(date) {
        return this.utilService.isDateSame(this.selectedDate, date);
    }
    /**
     * @param {?} date
     * @return {?}
     */
    isDateRangeBeginOrEndSame(date) {
        return this.utilService.isDateRangeBeginOrEndSame(this.selectedDateRange, date);
    }
}
DayViewComponent.decorators = [
    { type: Component, args: [{
                selector: "lib-day-view",
                template: "<table class=\"myDpCalTable\" [ngClass]=\"{'ng-myrtl': opts.rtl, 'myDpFooter': opts.showFooterToday, 'myDpNoFooter': !opts.showFooterToday, 'myDpViewChangeAnimation': opts.viewChangeAnimation && viewChanged}\">\n  <thead>\n    <tr>\n      <th class=\"myDpWeekDayTitle myDpWeekDayTitleWeekNbr\" *ngIf=\"opts.showWeekNumbers && opts.firstDayOfWeek==='mo'\">#</th>\n      <th class=\"myDpWeekDayTitle\" scope=\"col\" *ngFor=\"let d of weekDays\">{{d}}</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr *ngFor=\"let w of dates\">\n      <td class=\"myDpDaycellWeekNbr\" *ngIf=\"opts.showWeekNumbers && opts.firstDayOfWeek==='mo'\">{{w.weekNbr}}</td>\n      <td id=\"d_{{d.row}}_{{d.col}}\" class=\"d_{{d.row}}_{{d.col}} myDpDaycell {{d.markedDate.styleClass}} {{d.disabledDate.styleClass}}\" *ngFor=\"let d of w.week\"\n          [ngClass]=\"{'myDpRangeColor': isDateInRange(d.dateObj) || d.range,\n                'myDpPrevMonth': d.cmo === prevMonthId,\n                'myDpCurrMonth':d.cmo === currMonthId && !d.disabledDate.disabled,\n                'myDpNextMonth': d.cmo === nextMonthId,\n                'myDpSelectedDay':!this.opts.dateRange && isDateSame(d.dateObj) || this.opts.dateRange && isDateRangeBeginOrEndSame(d.dateObj),\n                'myDpDisabled': d.disabledDate.disabled && !d.disabledDate.styleClass.length,\n                'myDpTableSingleDay': !d.disabledDate.disabled}\"\n          (click)=\"onDayCellClicked($event, d)\" (keydown)=\"onDayCellKeyDown($event, d)\"\n          (mouseenter)=\"onDayCellMouseEnter(d)\" (mouseleave)=\"onDayCellMouseLeave()\" [attr.tabindex]=\"!d.disabledDate.disabled ? 0 : -1\">\n        <span *ngIf=\"d.markedDate.marked && d.markedDate.color.length\" class=\"myDpMarkDate\" [ngStyle]=\"{'border-top': '8px solid ' + d.markedDate.color}\"></span>\n        <span *ngIf=\"d.labeledDate.marked\" class=\"{{d.labeledDate.style}}\" title=\"{{d.labeledDate.title}}\">{{d.labeledDate.label}}</span>\n        <span *ngIf=\"!d.labeledDate.marked\" class=\"myDpDayValue\" [ngClass]=\"{'myDpMarkCurrDay': d.currDay && opts.markCurrentDay, 'myDpDimDay': d.highlight && (d.cmo===prevMonthId || d.cmo===nextMonthId || d.disabledDate.disabled), 'myDpHighlight': d.highlight}\">\n          {{d.dateObj.day}}\n        </span>\n      </td>\n    </tr>\n  </tbody>\n</table>\n",
                providers: [UtilService],
                encapsulation: ViewEncapsulation.None
            }] }
];
/** @nocollapse */
DayViewComponent.ctorParameters = () => [
    { type: UtilService }
];
DayViewComponent.propDecorators = {
    opts: [{ type: Input }],
    dates: [{ type: Input }],
    weekDays: [{ type: Input }],
    selectedDate: [{ type: Input }],
    selectedDateRange: [{ type: Input }],
    viewChanged: [{ type: Input }],
    dayCellClicked: [{ type: Output }],
    dayCellKeyDown: [{ type: Output }],
    viewActivated: [{ type: Output }]
};
if (false) {
    /** @type {?} */
    DayViewComponent.prototype.opts;
    /** @type {?} */
    DayViewComponent.prototype.dates;
    /** @type {?} */
    DayViewComponent.prototype.weekDays;
    /** @type {?} */
    DayViewComponent.prototype.selectedDate;
    /** @type {?} */
    DayViewComponent.prototype.selectedDateRange;
    /** @type {?} */
    DayViewComponent.prototype.viewChanged;
    /** @type {?} */
    DayViewComponent.prototype.dayCellClicked;
    /** @type {?} */
    DayViewComponent.prototype.dayCellKeyDown;
    /** @type {?} */
    DayViewComponent.prototype.viewActivated;
    /** @type {?} */
    DayViewComponent.prototype.prevMonthId;
    /** @type {?} */
    DayViewComponent.prototype.currMonthId;
    /** @type {?} */
    DayViewComponent.prototype.nextMonthId;
    /**
     * @type {?}
     * @private
     */
    DayViewComponent.prototype.utilService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF5LXZpZXcuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci10cmFkZWRhdGVwaWNrZXIvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9kYXktdmlldy9kYXktdmlldy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBNEIsTUFBTSxFQUFFLGlCQUFpQixFQUFnQixNQUFNLGVBQWUsQ0FBQztBQU1qSSxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sa0RBQWtELENBQUM7QUFDN0UsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLDJCQUEyQixDQUFDO0FBQ2xELE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQUNsRCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sOEJBQThCLENBQUM7QUFDeEQsT0FBTyxFQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLGFBQWEsRUFBRSxtQkFBbUIsRUFBQyxNQUFNLDJCQUEyQixDQUFDO0FBUXJHLE1BQU0sT0FBTyxnQkFBZ0I7Ozs7SUFnQjNCLFlBQW9CLFdBQXdCO1FBQXhCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBUmxDLG1CQUFjLEdBQWlDLElBQUksWUFBWSxFQUFrQixDQUFDO1FBQ2xGLG1CQUFjLEdBQXNCLElBQUksWUFBWSxFQUFPLENBQUM7UUFDNUQsa0JBQWEsR0FBNkIsSUFBSSxZQUFZLEVBQWMsQ0FBQztRQUVuRixnQkFBVyxHQUFXLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFDbkMsZ0JBQVcsR0FBVyxPQUFPLENBQUMsSUFBSSxDQUFDO1FBQ25DLGdCQUFXLEdBQVcsT0FBTyxDQUFDLElBQUksQ0FBQztJQUVhLENBQUM7Ozs7O0lBRWpELFdBQVcsQ0FBQyxPQUFzQjtRQUNoQyxJQUFJLE9BQU8sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFD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IE9uQ2hhbmdlcywgQWZ0ZXJWaWV3SW5pdCwgT3V0cHV0LCBWaWV3RW5jYXBzdWxhdGlvbiwgU2ltcGxlQ2hhbmdlc30gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7SU15Q2FsZW5kYXJEYXl9IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL215LWNhbGVuZGFyLWRheS5pbnRlcmZhY2VcIjtcbmltcG9ydCB7SU15RGF0ZX0gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvbXktZGF0ZS5pbnRlcmZhY2VcIjtcbmltcG9ydCB7SU15RGF0ZVJhbmdlfSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9teS1kYXRlLXJhbmdlLmludGVyZmFjZVwiO1xuaW1wb3J0IHtJTXlPcHRpb25zfSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9teS1vcHRpb25zLmludGVyZmFjZVwiO1xuaW1wb3J0IHtJTXlXZWVrfSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9teS13ZWVrLmludGVyZmFjZVwiO1xuaW1wb3J0IHtVdGlsU2VydmljZX0gZnJvbSBcIi4uLy4uL3NlcnZpY2VzL2FuZ3VsYXItbXlkYXRlcGlja2VyLnV0aWwuc2VydmljZVwiO1xuaW1wb3J0IHtLZXlDb2RlfSBmcm9tIFwiLi4vLi4vZW51bXMva2V5LWNvZGUuZW51bVwiO1xuaW1wb3J0IHtNb250aElkfSBmcm9tIFwiLi4vLi4vZW51bXMvbW9udGgtaWQuZW51bVwiO1xuaW1wb3J0IHtBY3RpdmVWaWV3fSBmcm9tIFwiLi4vLi4vZW51bXMvYWN0aXZlLXZpZXcuZW51bVwiO1xuaW1wb3J0IHtPUFRTLCBEQVRFUywgV0VFS19EQVlTLCBTRUxFQ1RFRF9EQVRFLCBTRUxFQ1RFRF9EQVRFX1JBTkdFfSBmcm9tIFwiLi4vLi4vY29uc3RhbnRzL2NvbnN0YW50c1wiO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6IFwibGliLWRheS12aWV3XCIsXG4gIHRlbXBsYXRlVXJsOiBcIi4vZGF5LXZpZXcuY29tcG9uZW50Lmh0bWxcIixcbiAgcHJvdmlkZXJzOiBbVXRpbFNlcnZpY2VdLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lXG59KVxuZXhwb3J0IGNsYXNzIERheVZpZXdDb21wb25lbnQgaW1wbGVtZW50cyBPbkNoYW5nZXMsIEFmdGVyVmlld0luaXQge1xuICBASW5wdXQoKSBvcHRzOiBJTXlPcHRpb25zO1xuICBASW5wdXQoKSBkYXRlczogQXJyYXk8SU15V2Vlaz47XG4gIEBJbnB1dCgpIHdlZWtEYXlzOiBBcnJheTxzdHJpbmc+O1xuICBASW5wdXQoKSBzZWxlY3RlZERhdGU6IElNeURhdGU7XG4gIEBJbnB1dCgpIHNlbGVjdGVkRGF0ZVJhbmdlOiBJTXlEYXRlUmFuZ2U7XG4gIEBJbnB1dCgpIHZpZXdDaGFuZ2VkOiBib29sZWFuO1xuXG4gIEBPdXRwdXQoKSBkYXlDZWxsQ2xpY2tlZDogRXZlbnRFbWl0dGVyPElNeUNhbGVuZGFyRGF5PiA9IG5ldyBFdmVudEVtaXR0ZXI8SU15Q2FsZW5kYXJEYXk+KCk7XG4gIEBPdXRwdXQoKSBkYXlDZWxsS2V5RG93bjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgpIHZpZXdBY3RpdmF0ZWQ6IEV2ZW50RW1pdHRlcjxBY3RpdmVWaWV3PiA9IG5ldyBFdmVudEVtaXR0ZXI8QWN0aXZlVmlldz4oKTtcblxuICBwcmV2TW9udGhJZDogbnVtYmVyID0gTW9udGhJZC5wcmV2O1xuICBjdXJyTW9udGhJZDogbnVtYmVyID0gTW9udGhJZC5jdXJyO1xuICBuZXh0TW9udGhJZDogbnVtYmVyID0gTW9udGhJZC5uZXh0O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgdXRpbFNlcnZpY2U6IFV0aWxTZXJ2aWNlKSB7IH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKGNoYW5nZXMuaGFzT3duUHJvcGVydHkoT1BUUykpIHtcbiAgICAgIHRoaXMub3B0cyA9IGNoYW5nZXNbT1BUU10uY3VycmVudFZhbHVlO1xuICAgIH1cbiAgICBpZiAoY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eShEQVRFUykpIHtcbiAgICAgIHRoaXMuZGF0ZXMgPSBjaGFuZ2VzW0RBVEVTXS5jdXJyZW50VmFsdWU7XG4gICAgfVxuICAgIGlmIChjaGFuZ2VzLmhhc093blByb3BlcnR5KFdFRUtfREFZUykpIHtcbiAgICAgIHRoaXMud2Vla0RheXMgPSBjaGFuZ2VzW1dFRUtfREFZU10uY3VycmVudFZhbHVlO1xuICAgIH1cbiAgICBpZiAoY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eShTRUxFQ1RFRF9EQVRFKSkge1xuICAgICAgdGhpcy5zZWxlY3RlZERhdGUgPSBjaGFuZ2VzW1NFTEVDVEVEX0RBVEVdLmN1cnJlbnRWYWx1ZTtcbiAgICB9XG4gICAgaWYgKGNoYW5nZXMuaGFzT3duUHJvcGVydHkoU0VMRUNURURfREFURV9SQU5HRSkpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWREYXRlUmFuZ2UgPSBjaGFuZ2VzW1NFTEVDVEVEX0RBVEVfUkFOR0VdLmN1cnJlbnRWYWx1ZTtcbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgdGhpcy52aWV3QWN0aXZhdGVkLmVtaXQoQWN0aXZlVmlldy5EYXRlKTtcbiAgfVxuXG4gIG9uRGF5Q2VsbENsaWNrZWQoZXZlbnQ6IGFueSwgY2VsbDogSU15Q2FsZW5kYXJEYXkpOiB2b2lkIHtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgIGlmIChjZWxsLmRpc2FibGVkRGF0ZS5kaXNhYmxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuZGF5Q2VsbENsaWNrZWQuZW1pdChjZWxsKTtcbiAgfVxuXG4gIG9uRGF5Q2VsbEtleURvd24oZXZlbnQ6IGFueSwgY2VsbDogSU15Q2FsZW5kYXJEYXkpIHtcbiAgICBjb25zdCBrZXlDb2RlOiBudW1iZXIgPSB0aGlzLnV0aWxTZXJ2aWNlLmdldEtleUNvZGVGcm9tRXZlbnQoZXZlbnQpO1xuICAgIGlmIChrZXlDb2RlICE9PSBLZXlDb2RlLnRhYikge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgaWYgKGtleUNvZGUgPT09IEtleUNvZGUuZW50ZXIgfHwga2V5Q29kZSA9PT0gS2V5Q29kZS5zcGFjZSkge1xuICAgICAgICB0aGlzLm9uRGF5Q2VsbENsaWNrZWQoZXZlbnQsIGNlbGwpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAodGhpcy5vcHRzLm1vdmVGb2N1c0J5QXJyb3dLZXlzKSB7XG4gICAgICAgIHRoaXMuZGF5Q2VsbEtleURvd24uZW1pdChldmVudClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBvbkRheUNlbGxNb3VzZUVudGVyKGNlbGw6IGFueSk6IHZvaWQge1xuICAgIGlmICh0aGlzLnV0aWxTZXJ2aWNlLmlzSW5pdGlhbGl6ZWREYXRlKHRoaXMuc2VsZWN0ZWREYXRlUmFuZ2UuYmVnaW4pICYmICF0aGlzLnV0aWxTZXJ2aWNlLmlzSW5pdGlhbGl6ZWREYXRlKHRoaXMuc2VsZWN0ZWREYXRlUmFuZ2UuZW5kKSkge1xuICAgICAgZm9yIChjb25zdCB3IG9mIHRoaXMuZGF0ZXMpIHtcbiAgICAgICAgZm9yIChjb25zdCBkYXkgb2Ygdy53ZWVrKSB7XG4gICAgICAgICAgZGF5LnJhbmdlID0gdGhpcy51dGlsU2VydmljZS5pc0RhdGVTYW1lT3JFYXJsaWVyKHRoaXMuc2VsZWN0ZWREYXRlUmFuZ2UuYmVnaW4sIGRheS5kYXRlT2JqKSAmJiB0aGlzLnV0aWxTZXJ2aWNlLmlzRGF0ZVNhbWVPckVhcmxpZXIoZGF5LmRhdGVPYmosIGNlbGwuZGF0ZU9iaik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBvbkRheUNlbGxNb3VzZUxlYXZlKCk6IHZvaWQge1xuICAgIGZvciAoY29uc3QgdyBvZiB0aGlzLmRhdGVzKSB7XG4gICAgICBmb3IgKGNvbnN0IGRheSBvZiB3LndlZWspIHtcbiAgICAgICAgZGF5LnJhbmdlID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaXNEYXRlSW5SYW5nZShkYXRlOiBJTXlEYXRlKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMudXRpbFNlcnZpY2UuaXNEYXRlSW5SYW5nZShkYXRlLCB0aGlzLnNlbGVjdGVkRGF0ZVJhbmdlKTtcbiAgfVxuXG4gIGlzRGF0ZVNhbWUoZGF0ZTogSU15RGF0ZSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnV0aWxTZXJ2aWNlLmlzRGF0ZVNhbWUodGhpcy5zZWxlY3RlZERhdGUsIGRhdGUpO1xuICB9XG5cbiAgaXNEYXRlUmFuZ2VCZWdpbk9yRW5kU2FtZShkYXRlOiBJTXlEYXRlKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMudXRpbFNlcnZpY2UuaXNEYXRlUmFuZ2VCZWdpbk9yRW5kU2FtZSh0aGlzLnNlbGVjdGVkRGF0ZVJhbmdlLCBkYXRlKTtcbiAgfVxufVxuIl19