import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'coins',
        loadChildren: () =>
          import('./coins/coins.module').then((m) => m.CoinsModule),
      },
      {
        path: 'portfolio',
        loadChildren: () =>
          import('./portfolio/portfolio.module').then((m) => m.PortfolioModule),
      },
      {
        path: 'portfolio-lines',
        loadChildren: () =>
          import('./portfolio-lines/portfolio-lines.module').then(
            (m) => m.PortfolioLinesModule
          ),
      },

      {
        path: '',
        redirectTo: 'coins',
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: 'coins',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
