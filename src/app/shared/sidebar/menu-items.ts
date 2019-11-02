import { RouteInfo } from './sidebar.metadata';

export const ROUTES: RouteInfo[] = [
  {
    path: '',
    title: 'Personal',
    icon: '',
    class: 'nav-small-cap',
    label: '',
    labelClass: '',
    extralink: true,
    submenu: []
  },
  {
    path: '',
    title: 'Apps',
    icon: 'mdi mdi-apps',
    class: 'has-arrow',
    label: '',
    labelClass: '',
    extralink: false,
    submenu: [
      { path: '/apps/fullcalendar', title: 'Calendar', icon: '', class: '', label: '', labelClass: '', extralink: false, submenu: [] }
    ]
  }
];
