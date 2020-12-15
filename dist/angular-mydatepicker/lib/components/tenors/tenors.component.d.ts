import { EventEmitter } from '@angular/core';
import { IAngularMyDpOptions } from '../../interfaces/my-options.interface';
import { IMyDate } from '../../interfaces/my-date.interface';
export declare class TenorsComponent {
    opts: IAngularMyDpOptions;
    onSelectDate: EventEmitter<IMyDate>;
    constructor();
    onBtnClicked(date: IMyDate): void;
}
