import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PortfolioLinesRoutingModule } from './portfolio-lines-routing.module';
import { PortfolioLinesComponent } from './view/portfolio-lines.component';

@NgModule({
  declarations: [PortfolioLinesComponent],
  imports: [CommonModule, PortfolioLinesRoutingModule],
})
export class PortfolioLinesModule {}
