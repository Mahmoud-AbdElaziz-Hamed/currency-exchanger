import { Routes } from '@angular/router';
import { ConverterComponent } from './converter/converter.component';
import { DetailsComponent } from './details/details.component';

export const routes: Routes = [
  { path: '', component: ConverterComponent },
  { path: 'details/:from/:to', component: DetailsComponent },
  { path: 'details/USD', component: DetailsComponent, data: { from: 'USD', to: 'EUR' } },
  { path: 'details/EUR', component: DetailsComponent, data: { from: 'EUR', to: 'USD' } },
];