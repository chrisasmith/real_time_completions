import {MenuItem} from './menu-item';

export const MENU: MenuItem[] = [
  {
    title: 'Home',
    icon: {
      class: 'home',
      bg: '#fff',
      color: '#0067AF'
    },
    routing: '',
    isWorkflow: false
  },
  {
    title: 'Dashboard',
    icon: {
      class: 'dashboard',
      bg: '#fff',
      color: '#0067AF'
    },
    routing: ':asset/dashboard',
    isWorkflow: false
  },
  {
    title: 'Treatment Plot',
    icon: {
      class: 'multiline_chart',
      bg: '#fff',
      color: '#0067AF'
    },
    routing: ':asset/treatment-plot',
    isWorkflow: true
  },
  {
    title: 'Admin',
    icon: {
      class: 'build',
      bg: '#fff',
      color: '#0067AF'
    },
    routing: ':asset/admin',
    isWorkflow: true
  },
  /*{
    title: 'Support',
    icon: {
      class: 'help',
      bg: '#fff',
      color: '#0067AF'
    },
    routing: '/support',
    isWorkflow: false,
    externalLink: 'http://sp/corpaffair/apphelp/rtc/Pages/default.aspx'
  }*/
];

