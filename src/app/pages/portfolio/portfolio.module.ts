import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { PortfolioRoutingModule } from './portfolio-routing.module';
import { PortfolioComponent } from './view/portfolio.component';
import { ModalPortfolioComponent } from './modal-portfolio/modal-portfolio.component';

@NgModule({
  declarations: [PortfolioComponent, ModalPortfolioComponent],
  imports: [CommonModule, PortfolioRoutingModule, ReactiveFormsModule],
})
export class PortfolioModule {}
