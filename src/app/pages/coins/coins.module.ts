import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoinsRoutingModule } from './coins-routing.module';

import { CoinsComponent } from './view/coins.component';
import { ModalCoinsComponent } from './modal-coins/modal-coins.component';

@NgModule({
  declarations: [CoinsComponent, ModalCoinsComponent],
  imports: [CommonModule, CoinsRoutingModule, ReactiveFormsModule, FormsModule],
})
export class CoinsModule {}
