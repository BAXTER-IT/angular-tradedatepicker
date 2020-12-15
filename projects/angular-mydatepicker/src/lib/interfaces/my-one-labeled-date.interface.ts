import { IMyDate } from "./my-date.interface";

export interface IMyOneLabeledDate {
    date: IMyDate;
    style: string;
    label: string;
    title: string;
}