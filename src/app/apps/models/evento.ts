import { EventAction } from 'calendar-utils';
import { EventColor } from './eventColor';

export class Evento {
    id?: string | number;
    start: Date;
    end?: Date;
    title: string;
    color?: EventColor;
    actions?: EventAction[];
    allDay?: boolean;
    cssClass?: string;
    resizable?: {
        beforeStart?: boolean;
        afterEnd?: boolean;
    };
    draggable?: boolean;
    meta?: any = {
        colorTexto: '#ffffff'
    }
}