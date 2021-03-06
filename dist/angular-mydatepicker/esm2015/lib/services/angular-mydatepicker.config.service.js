/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from "@angular/core";
import { Year } from "../enums/year.enum";
import { DefaultView } from "../enums/default-view.enum";
import { CalAnimation } from "../enums/cal-animation.enum";
export class DefaultConfigService {
    constructor() {
        this.defaultConfig = {
            dateRange: false,
            inline: false,
            dayLabels: { su: "Sun", mo: "Mon", tu: "Tue", we: "Wed", th: "Thu", fr: "Fri", sa: "Sat" },
            monthLabels: { 1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "May", 6: "Jun", 7: "Jul", 8: "Aug", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec" },
            dateFormat: "yyyy-mm-dd",
            defaultView: DefaultView.Date,
            firstDayOfWeek: "mo",
            satHighlight: false,
            sunHighlight: true,
            highlightDates: [],
            markCurrentDay: true,
            markCurrentMonth: true,
            markCurrentYear: true,
            monthSelector: true,
            yearSelector: true,
            disableHeaderButtons: true,
            showWeekNumbers: false,
            selectorHeight: "266px",
            selectorWidth: "266px",
            disableUntil: { year: 0, month: 0, day: 0 },
            disableSince: { year: 0, month: 0, day: 0 },
            disableDates: [],
            disableDateRanges: [],
            disableWeekends: false,
            disableWeekdays: [],
            enableDates: [],
            markDates: [],
            markWeekends: { marked: false, color: "" },
            alignSelectorRight: false,
            openSelectorTopOfInput: false,
            closeSelectorOnDateSelect: true,
            closeSelectorOnDocumentClick: true,
            minYear: Year.min,
            maxYear: Year.max,
            showSelectorArrow: true,
            appendSelectorToBody: false,
            focusInputOnDateSelect: true,
            moveFocusByArrowKeys: true,
            dateRangeDatesDelimiter: " - ",
            inputFieldValidation: true,
            showMonthNumber: true,
            todayTxt: "",
            showFooterToday: false,
            calendarAnimation: { in: CalAnimation.None, out: CalAnimation.None },
            viewChangeAnimation: true,
            rtl: false,
            stylesData: { selector: "", styles: "" },
            divHostElement: { enabled: false, placeholder: "" },
            ariaLabelPrevMonth: "Previous Month",
            ariaLabelNextMonth: "Next Month"
        };
    }
    /**
     * @return {?}
     */
    getDefaultConfig() {
        return this.defaultConfig;
    }
}
DefaultConfigService.decorators = [
    { type: Injectable }
];
if (false) {
    /**
     * @type {?}
     * @private
     */
    DefaultConfigService.prototype.defaultConfig;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1teWRhdGVwaWNrZXIuY29uZmlnLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLXRyYWRlZGF0ZXBpY2tlci8iLCJzb3VyY2VzIjpbImxpYi9zZXJ2aWNlcy9hbmd1bGFyLW15ZGF0ZXBpY2tlci5jb25maWcuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUV6QyxPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDeEMsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLDRCQUE0QixDQUFDO0FBQ3ZELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSw2QkFBNkIsQ0FBQztBQUd6RCxNQUFNLE9BQU8sb0JBQW9CO0lBRGpDO1FBRVUsa0JBQWEsR0FBZTtZQUNsQyxTQUFTLEVBQUUsS0FBSztZQUNoQixNQUFNLEVBQUUsS0FBSztZQUNiLFNBQVMsRUFBRSxFQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUM7WUFDeEYsV0FBVyxFQUFFLEVBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUM7WUFDeEksVUFBVSxFQUFFLFlBQVk7WUFDeEIsV0FBVyxFQUFFLFdBQVcsQ0FBQyxJQUFJO1lBQzdCLGNBQWMsRUFBRSxJQUFJO1lBQ3BCLFlBQVksRUFBRSxLQUFLO1lBQ25CLFlBQVksRUFBRyxJQUFJO1lBQ25CLGNBQWMsRUFBRSxFQUFFO1lBQ2xCLGNBQWMsRUFBRSxJQUFJO1lBQ3BCLGdCQUFnQixFQUFFLElBQUk7WUFDdEIsZUFBZSxFQUFFLElBQUk7WUFDckIsYUFBYSxFQUFFLElBQUk7WUFDbkIsWUFBWSxFQUFFLElBQUk7WUFDbEIsb0JBQW9CLEVBQUUsSUFBSTtZQUMxQixlQUFlLEVBQUUsS0FBSztZQUN0QixjQUFjLEVBQUUsT0FBTztZQUN2QixhQUFhLEVBQUUsT0FBTztZQUN0QixZQUFZLEVBQUUsRUFBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBQztZQUN6QyxZQUFZLEVBQUUsRUFBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBQztZQUN6QyxZQUFZLEVBQUUsRUFBRTtZQUNoQixpQkFBaUIsRUFBRSxFQUFFO1lBQ3JCLGVBQWUsRUFBRSxLQUFLO1lBQ3RCLGVBQWUsRUFBRSxFQUFFO1lBQ25CLFdBQVcsRUFBRSxFQUFFO1lBQ2YsU0FBUyxFQUFFLEVBQUU7WUFDYixZQUFZLEVBQUUsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUM7WUFDeEMsa0JBQWtCLEVBQUUsS0FBSztZQUN6QixzQkFBc0IsRUFBRSxLQUFLO1lBQzdCLHlCQUF5QixFQUFFLElBQUk7WUFDL0IsNEJBQTRCLEVBQUUsSUFBSTtZQUNsQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEdBQUc7WUFDakIsT0FBTyxFQUFFLElBQUksQ0FBQyxHQUFHO1lBQ2pCLGlCQUFpQixFQUFFLElBQUk7WUFDdkIsb0JBQW9CLEVBQUUsS0FBSztZQUMzQixzQkFBc0IsRUFBRSxJQUFJO1lBQzVCLG9CQUFvQixFQUFFLElBQUk7WUFDMUIsdUJBQXVCLEVBQUUsS0FBSztZQUM5QixvQkFBb0IsRUFBRSxJQUFJO1lBQzFCLGVBQWUsRUFBRSxJQUFJO1lBQ3JCLFFBQVEsRUFBRSxFQUFFO1lBQ1osZUFBZSxFQUFFLEtBQUs7WUFDdEIsaUJBQWlCLEVBQUUsRUFBQyxFQUFFLEVBQUUsWUFBWSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsWUFBWSxDQUFDLElBQUksRUFBQztZQUNsRSxtQkFBbUIsRUFBRSxJQUFJO1lBQ3pCLEdBQUcsRUFBRSxLQUFLO1lBQ1YsVUFBVSxFQUFFLEVBQUMsUUFBUSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFDO1lBQ3RDLGNBQWMsRUFBRSxFQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLEVBQUUsRUFBQztZQUNqRCxrQkFBa0IsRUFBRSxnQkFBZ0I7WUFDcEMsa0JBQWtCLEVBQUUsWUFBWTtTQUNqQyxDQUFDO0lBS0osQ0FBQzs7OztJQUhRLGdCQUFnQjtRQUNyQixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUM7SUFDNUIsQ0FBQzs7O1lBekRGLFVBQVU7Ozs7Ozs7SUFFVCw2Q0FtREUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGV9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQge0lNeU9wdGlvbnN9IGZyb20gXCIuLi9pbnRlcmZhY2VzL215LW9wdGlvbnMuaW50ZXJmYWNlXCI7XG5pbXBvcnQge1llYXJ9IGZyb20gXCIuLi9lbnVtcy95ZWFyLmVudW1cIjtcbmltcG9ydCB7RGVmYXVsdFZpZXd9IGZyb20gXCIuLi9lbnVtcy9kZWZhdWx0LXZpZXcuZW51bVwiO1xuaW1wb3J0IHtDYWxBbmltYXRpb259IGZyb20gXCIuLi9lbnVtcy9jYWwtYW5pbWF0aW9uLmVudW1cIjtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIERlZmF1bHRDb25maWdTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBkZWZhdWx0Q29uZmlnOiBJTXlPcHRpb25zID0ge1xuICAgIGRhdGVSYW5nZTogZmFsc2UsXG4gICAgaW5saW5lOiBmYWxzZSxcbiAgICBkYXlMYWJlbHM6IHtzdTogXCJTdW5cIiwgbW86IFwiTW9uXCIsIHR1OiBcIlR1ZVwiLCB3ZTogXCJXZWRcIiwgdGg6IFwiVGh1XCIsIGZyOiBcIkZyaVwiLCBzYTogXCJTYXRcIn0sXG4gICAgbW9udGhMYWJlbHM6IHsxOiBcIkphblwiLCAyOiBcIkZlYlwiLCAzOiBcIk1hclwiLCA0OiBcIkFwclwiLCA1OiBcIk1heVwiLCA2OiBcIkp1blwiLCA3OiBcIkp1bFwiLCA4OiBcIkF1Z1wiLCA5OiBcIlNlcFwiLCAxMDogXCJPY3RcIiwgMTE6IFwiTm92XCIsIDEyOiBcIkRlY1wifSxcbiAgICBkYXRlRm9ybWF0OiBcInl5eXktbW0tZGRcIixcbiAgICBkZWZhdWx0VmlldzogRGVmYXVsdFZpZXcuRGF0ZSxcbiAgICBmaXJzdERheU9mV2VlazogXCJtb1wiLFxuICAgIHNhdEhpZ2hsaWdodDogZmFsc2UsXG4gICAgc3VuSGlnaGxpZ2h0OiAgdHJ1ZSxcbiAgICBoaWdobGlnaHREYXRlczogW10sXG4gICAgbWFya0N1cnJlbnREYXk6IHRydWUsXG4gICAgbWFya0N1cnJlbnRNb250aDogdHJ1ZSxcbiAgICBtYXJrQ3VycmVudFllYXI6IHRydWUsXG4gICAgbW9udGhTZWxlY3RvcjogdHJ1ZSxcbiAgICB5ZWFyU2VsZWN0b3I6IHRydWUsXG4gICAgZGlzYWJsZUhlYWRlckJ1dHRvbnM6IHRydWUsXG4gICAgc2hvd1dlZWtOdW1iZXJzOiBmYWxzZSxcbiAgICBzZWxlY3RvckhlaWdodDogXCIyNjZweFwiLFxuICAgIHNlbGVjdG9yV2lkdGg6IFwiMjY2cHhcIixcbiAgICBkaXNhYmxlVW50aWw6IHt5ZWFyOiAwLCBtb250aDogMCwgZGF5OiAwfSxcbiAgICBkaXNhYmxlU2luY2U6IHt5ZWFyOiAwLCBtb250aDogMCwgZGF5OiAwfSxcbiAgICBkaXNhYmxlRGF0ZXM6IFtdLFxuICAgIGRpc2FibGVEYXRlUmFuZ2VzOiBbXSxcbiAgICBkaXNhYmxlV2Vla2VuZHM6IGZhbHNlLFxuICAgIGRpc2FibGVXZWVrZGF5czogW10sXG4gICAgZW5hYmxlRGF0ZXM6IFtdLFxuICAgIG1hcmtEYXRlczogW10sXG4gICAgbWFya1dlZWtlbmRzOiB7bWFya2VkOiBmYWxzZSwgY29sb3I6IFwiXCJ9LFxuICAgIGFsaWduU2VsZWN0b3JSaWdodDogZmFsc2UsXG4gICAgb3BlblNlbGVjdG9yVG9wT2ZJbnB1dDogZmFsc2UsXG4gICAgY2xvc2VTZWxlY3Rvck9uRGF0ZVNlbGVjdDogdHJ1ZSxcbiAgICBjbG9zZVNlbGVjdG9yT25Eb2N1bWVudENsaWNrOiB0cnVlLFxuICAgIG1pblllYXI6IFllYXIubWluLFxuICAgIG1heFllYXI6IFllYXIubWF4LFxuICAgIHNob3dTZWxlY3RvckFycm93OiB0cnVlLFxuICAgIGFwcGVuZFNlbGVjdG9yVG9Cb2R5OiBmYWxzZSxcbiAgICBmb2N1c0lucHV0T25EYXRlU2VsZWN0OiB0cnVlLFxuICAgIG1vdmVGb2N1c0J5QXJyb3dLZXlzOiB0cnVlLFxuICAgIGRhdGVSYW5nZURhdGVzRGVsaW1pdGVyOiBcIiAtIFwiLFxuICAgIGlucHV0RmllbGRWYWxpZGF0aW9uOiB0cnVlLFxuICAgIHNob3dNb250aE51bWJlcjogdHJ1ZSxcbiAgICB0b2RheVR4dDogXCJcIixcbiAgICBzaG93Rm9vdGVyVG9kYXk6IGZhbHNlLFxuICAgIGNhbGVuZGFyQW5pbWF0aW9uOiB7aW46IENhbEFuaW1hdGlvbi5Ob25lLCBvdXQ6IENhbEFuaW1hdGlvbi5Ob25lfSxcbiAgICB2aWV3Q2hhbmdlQW5pbWF0aW9uOiB0cnVlLFxuICAgIHJ0bDogZmFsc2UsXG4gICAgc3R5bGVzRGF0YToge3NlbGVjdG9yOiBcIlwiLCBzdHlsZXM6IFwiXCJ9LFxuICAgIGRpdkhvc3RFbGVtZW50OiB7ZW5hYmxlZDogZmFsc2UsIHBsYWNlaG9sZGVyOiBcIlwifSxcbiAgICBhcmlhTGFiZWxQcmV2TW9udGg6IFwiUHJldmlvdXMgTW9udGhcIixcbiAgICBhcmlhTGFiZWxOZXh0TW9udGg6IFwiTmV4dCBNb250aFwiXG4gIH07XG5cbiAgcHVibGljIGdldERlZmF1bHRDb25maWcoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGVmYXVsdENvbmZpZztcbiAgfVxufVxuIl19