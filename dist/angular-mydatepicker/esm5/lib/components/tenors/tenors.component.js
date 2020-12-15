/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
// import { IMyBTNRow, IMyHolidayDates, IMyLabeledDates } from '../../interfaces/tenors.interface';
var TenorsComponent = /** @class */ (function () {
    function TenorsComponent() {
        this.onSelectDate = new EventEmitter();
    }
    /**
     * @param {?} date
     * @return {?}
     */
    TenorsComponent.prototype.onBtnClicked = /**
     * @param {?} date
     * @return {?}
     */
    function (date) {
        this.onSelectDate.emit(date);
    };
    TenorsComponent.decorators = [
        { type: Component, args: [{
                    selector: 'lib-tenors',
                    template: "<table class=\"tbuttons\" *ngIf=\"opts.rightButtons && opts.rightButtons.length > 0\">\n  <tr>\n    <td class=\"buttons-inner d-flex align-items-start flex-column\">\n      <div *ngFor=\"let rows of opts.rightButtons\" class=\"{{rows.style}}\">\n            <span *ngFor=\"let btn of rows.btns\">\n            <button title=\"{{btn.title}}\" class=\"{{btn.style}}\" (click)=\"onBtnClicked(btn.date);$event.stopPropagation()\" [disabled]=\"!btn.date\">{{btn.label}}</button>\n            </span>\n      </div>\n    </td>\n  </tr>\n</table>\n",
                    encapsulation: ViewEncapsulation.None
                }] }
    ];
    /** @nocollapse */
    TenorsComponent.ctorParameters = function () { return []; };
    TenorsComponent.propDecorators = {
        opts: [{ type: Input }],
        onSelectDate: [{ type: Output }]
    };
    return TenorsComponent;
}());
export { TenorsComponent };
if (false) {
    /** @type {?} */
    TenorsComponent.prototype.opts;
    /** @type {?} */
    TenorsComponent.prototype.onSelectDate;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVub3JzLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItdHJhZGVkYXRlcGlja2VyLyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvdGVub3JzL3Rlbm9ycy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxlQUFlLENBQUM7O0FBSzFGO0lBYUU7UUFGQSxpQkFBWSxHQUEwQixJQUFJLFlBQVksRUFBVyxDQUFDO0lBR2xFLENBQUM7Ozs7O0lBRUQsc0NBQVk7Ozs7SUFBWixVQUFhLElBQWE7UUFDeEIsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDL0IsQ0FBQzs7Z0JBbEJGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsWUFBWTtvQkFDdEIsd2lCQUFzQztvQkFDdEMsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7aUJBQ3RDOzs7Ozt1QkFHRSxLQUFLOytCQUdMLE1BQU07O0lBVVQsc0JBQUM7Q0FBQSxBQXBCRCxJQW9CQztTQWZZLGVBQWU7OztJQUUxQiwrQkFDMEI7O0lBRTFCLHVDQUNrRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT3V0cHV0LCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSUFuZ3VsYXJNeURwT3B0aW9ucyB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvbXktb3B0aW9ucy5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgSU15RGF0ZSB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvbXktZGF0ZS5pbnRlcmZhY2UnO1xuLy8gaW1wb3J0IHsgSU15QlROUm93LCBJTXlIb2xpZGF5RGF0ZXMsIElNeUxhYmVsZWREYXRlcyB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvdGVub3JzLmludGVyZmFjZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2xpYi10ZW5vcnMnLFxuICB0ZW1wbGF0ZVVybDogJy4vdGVub3JzLmNvbXBvbmVudC5odG1sJyxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxufSlcbmV4cG9ydCBjbGFzcyBUZW5vcnNDb21wb25lbnQge1xuXG4gIEBJbnB1dCgpXG4gIG9wdHM6IElBbmd1bGFyTXlEcE9wdGlvbnM7XG5cbiAgQE91dHB1dCgpXG4gIG9uU2VsZWN0RGF0ZTogRXZlbnRFbWl0dGVyPElNeURhdGU+ID0gbmV3IEV2ZW50RW1pdHRlcjxJTXlEYXRlPigpO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICB9XG5cbiAgb25CdG5DbGlja2VkKGRhdGU6IElNeURhdGUpOnZvaWQge1xuICAgIHRoaXMub25TZWxlY3REYXRlLmVtaXQoZGF0ZSk7XG4gIH1cblxufVxuXG5cbiJdfQ==