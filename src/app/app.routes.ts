import { Routes } from '@angular/router';
import { CrudComponent } from './page/crud/crud';

export const routes: Routes = [
  { path: '', component: CrudComponent, pathMatch: 'full' },
  { path: '**', redirectTo: '' },
];
