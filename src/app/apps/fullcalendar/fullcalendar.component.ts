import { Component, ChangeDetectionStrategy, Inject, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { isSameDay, isSameMonth, addMinutes, format } from 'date-fns';

import { Subject } from 'rxjs';

import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { DayViewHour } from 'calendar-utils';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import {
  AGREGAR,
  CLICKED,
  EDITAR,
  ELIMINAR,
  MAS,
  MENOS,
  MES,
  DIA
} from './calendario.constants';
import { AssignedHall } from '../../apps/models/assignedhall';
import { Evento } from '../models/evento';

import { AssignedhallService } from '../../services/assignedhall.service';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-fullcalendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fullcalendar.component.html',
  styleUrls: ['./fullcalendar.component.scss']
})

export class FullcalendarComponent implements OnInit {
  @ViewChild('modalContent') modalContent: TemplateRef<any>;
  view = MES;
  locale = { 'locale': 'es-CL' };
  viewDate: Date = new Date();
  selectedDayViewDate: Date;
  dayView: DayViewHour[];
  dayExcl: number[];
  inicioHora: number;
  finHora: number;
  incre: number;
  sala: number;

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil text-white"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Editar', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times  text-white"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Eliminar', event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[];

  activeDayIsOpen = true;
  evento: Evento;
  fechaInicio: string = format(new Date(), 'YYYY-MM-DD HH:00:00');
  fechaFin: string;

  constructor(private modal: NgbModal, private reservaService: AssignedhallService) {
    this.events = new Array();
    this.dayExcl = new Array();
    this.sala = 1;
    this.inicioHora = 9;
    this.finHora = 20;
    this.dayExcl.push(0);
    this.dayExcl.push(6);
  }

  ngOnInit() {
    this.cargarReservas();
  }

  cargarReservas() {
    let ev: Evento;
    this.events = [];
    this.reservaService.getReservas().subscribe(
      lista => {
        lista.forEach(element => {
          ev = new Evento();
          ev.id = element.id;
          ev.title = element.title;
          ev.start = moment(element.beginDate).toDate();
          ev.end = moment(element.endDate).toDate();
          ev.color = colors.yellow;
          ev.actions = this.actions;
          ev.resizable = {
            beforeStart: true,
            afterEnd: true
          };
          ev.draggable = true;

          this.events.push(ev);
          this.refresh.next();
        });
      });
  }

  agregarReserva() {
    let reserva = new AssignedHall();
    reserva.beginDate = this.fechaInicio;
    reserva.endDate = this.fechaFin;
    reserva.idSala = this.sala;
    reserva.title = this.evento.title;

    this.reservaService.createReserva(reserva).subscribe(
      () => {
        Swal.fire('Tu evento fue ingresado.');
        this.cargarReservas();
        this.refresh.next();
      }, err => {
        if (err.status === 0) {
          Swal.fire('Hubo un error en la base de datos.');
        }
      }
    );
  }

  actualizarReserva() {
    let reserva = new AssignedHall();
    reserva.beginDate = this.fechaInicio;
    reserva.endDate = this.fechaFin;
    reserva.id = this.evento.id;
    reserva.idSala = this.sala;
    reserva.title = this.evento.title;

    this.reservaService.updateReserva(reserva).subscribe(
      () => {
      }, err => {
        if (err.status === 200) {
          Swal.fire('Tu evento fue actualizado.');
          this.cargarReservas();
          this.refresh.next();
        }
        if (err.status === 0) {
          Swal.fire('Hubo un error en la base de datos.');
        }
      }
    );
  }

  borrarReserva(id) {
    Swal.fire({
      title: 'Eliminar',
      text: 'Esta Seguro que desea Elimiarlo?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.value) {

        this.reservaService.deleteReserva(id).subscribe(
          () => {
          }, err => {
            if (err.status === 200) {
              Swal.fire(
                'Eliminado!',
                'El Evento ha sido Eliminado.',
                'success'
              );
              this.cargarReservas();
              this.refresh.next();
            }
            if (err.status === 0) {
              Swal.fire('Hubo un error en la base de datos.');
            }
          }
        );
      }
    });

  }

  validarReserva() {
    let promise = new Promise((resolve, reject) => {
      let reserva = new AssignedHall();
      reserva.beginDate = this.fechaInicio;
      reserva.endDate = this.fechaFin;
      reserva.idSala = this.sala;
      reserva.id = 0;

      if (this.evento.id) {
        reserva.id = this.evento.id;
      }

      this.reservaService.validateReserva(reserva).subscribe(
        elementos => {
          resolve(elementos.length);
        }, err => {
          reject(err);
        }
      );
    });
    return promise;
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
    this.viewDate = date;
    this.view = DIA;
  }

  hourSegmentClicked(event) {
    this.evento = new Evento();
    this.evento.start = event.date;
    this.evento.end = addMinutes(event.date, 30);

    this.fechaInicio = format(this.evento.start, 'YYYY-MM-DD HH:mm:00');
    this.fechaFin = format(this.evento.end, 'YYYY-MM-DD HH:mm:00');
    this.handleEvent('Clicked', this.evento);
  }

  eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {

    if (newStart < moment(format(newStart, 'YYYY-MM-DD 21:00:00', this.locale)).toDate() &&
      newEnd <= moment(format(newEnd, 'YYYY-MM-DD 21:00:00', this.locale)).toDate()) {
      this.evento = new Evento();
      this.evento.id = event.id;
      this.evento.start = newStart;
      this.evento.end = newEnd;

      this.fechaInicio = format(this.evento.start, 'YYYY-MM-DD HH:mm:00');
      this.fechaFin = format(this.evento.end, 'YYYY-MM-DD HH:mm:00');

      this.handleEvent('Agregar', event);
    }
  }

  handleEvent(action: string, { ...eventSeleccionado }: CalendarEvent): void {
    if (action === EDITAR) {
      this.incre = 1;
      this.evento = eventSeleccionado;
      this.fechaInicio = format(this.evento.start, 'YYYY-MM-DD HH:mm:00');
      this.fechaFin = format(this.evento.end, 'YYYY-MM-DD HH:mm:00');
      this.modalData = { event: eventSeleccionado, action };
      this.modal.open(this.modalContent, { size: 'lg' });

    } else if (action === ELIMINAR) {
      this.borrarReserva(eventSeleccionado.id);

    } else if (action === CLICKED) {
      this.incre = 1;
      this.modalData = { event: eventSeleccionado, action };
      this.modal.open(this.modalContent, { size: 'lg' });

    } else if (action === MAS) {
      if (addMinutes(this.evento.end, 30) <= moment(format(this.evento.end, 'YYYY-MM-DD 21:00:00')).toDate()) {
        this.evento.end = addMinutes(this.evento.end, 30);
        this.fechaFin = format(this.evento.end, 'YYYY-MM-DD HH:mm:00');
      }

    } else if (action === MENOS) {
      if (addMinutes(this.evento.end, -30) > this.evento.start) {
        this.evento.end = addMinutes(this.evento.end, -30);
        this.fechaFin = format(this.evento.end, 'YYYY-MM-DD HH:mm:00');
      }

    } else if (action === AGREGAR) {
      this.validarReserva()
        .then(respuesta => {
          if (respuesta > 0) {
            Swal.fire({
              type: 'error',
              title: 'Oops...',
              text: 'La Hora se Encuentra Reservada!'
            });
          } else {
            if (this.evento.id) {
              this.actualizarReserva();
            } else {
              this.agregarReserva();
            }
          }
        })
        .catch(error => {
          Swal.fire('Hubo un error en la base de datos.');
        });
    }
  }

}
