import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PortfolioLinesComponent } from './view/portfolio-lines.component';

const routes: Routes = [
  {
    path: '',
    component: PortfolioLinesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PortfolioLinesRoutingModule {}
