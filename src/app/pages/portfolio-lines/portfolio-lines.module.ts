import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { PortfolioLinesRoutingModule } from './portfolio-lines-routing.module';
import { PortfolioLinesComponent } from './view/portfolio-lines.component';
import { ModalPortfolioLinesComponent } from './modal-portfolio-lines/modal-portfolio-lines.component';

@NgModule({
  declarations: [PortfolioLinesComponent, ModalPortfolioLinesComponent],
  imports: [CommonModule, PortfolioLinesRoutingModule, ReactiveFormsModule],
})
export class PortfolioLinesModule {}
