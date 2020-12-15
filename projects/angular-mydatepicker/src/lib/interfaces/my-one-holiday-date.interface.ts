import { IMyDate } from "./my-date.interface";

export interface IMyOneHolidayDate {
    date: IMyDate;
    style: string;
    title: string;
    disabled: boolean;
}