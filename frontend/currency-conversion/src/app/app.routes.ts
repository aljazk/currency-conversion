import { Routes } from '@angular/router';
import { HistoryComponent } from './history/history.component';
import { ConverterComponent } from './converter/converter.component';

export const routes: Routes = [
  {
    path: '',
    component: ConverterComponent,
  },
  {
    path: 'history',
    component: HistoryComponent,
  },
];
