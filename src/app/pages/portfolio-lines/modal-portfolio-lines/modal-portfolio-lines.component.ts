import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { uid } from 'uid';
import { PortfoliosService } from '../../../services/portfolios.service';
import { IPortfolio } from '../../../models/portfolio';
import { ICoin } from '../../../models/coin';
import { CoinsService } from '../../../services/coins.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MessagesService } from '../../../services/messages.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-modal-portfolio-lines',
  templateUrl: './modal-portfolio-lines.component.html',
})
export class ModalPortfolioLinesComponent implements OnInit, OnDestroy {
  @Input() title: any;
  @Input() data: any;

  private destroy$: Subject<boolean> = new Subject<boolean>();
  public portfolios: IPortfolio[] = [];
  public coins: ICoin[] = [];

  public form: FormGroup = new FormGroup({
    id: new FormControl(uid(), Validators.required),
    portfolioId: new FormControl(null, Validators.required),
    coinId: new FormControl(null, Validators.required),
    amount: new FormControl(null, Validators.required),
  });

  constructor(
    public modal: NgbActiveModal,
    private portfolioService: PortfoliosService,
    private coinService: CoinsService,
    private messageService: MessagesService
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.form = new FormGroup({
        id: new FormControl(this.data.id, Validators.required),
        portfolioId: new FormControl(
          this.data.portfolioId,
          Validators.required
        ),
        coinId: new FormControl(this.data.coinId, Validators.required),
        amount: new FormControl(this.data.amount, Validators.required),
      });
    }
    this.getPortfolios();
    this.getCoins();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  getPortfolios() {
    this.portfolioService
      .getPortfolios()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (resp) => (this.portfolios = resp),
        (err: HttpErrorResponse) => {
          this.messageService.errorApi(
            'No se mostrara el listado de portfolios hasta que se arregle el error',
            err
          );
        }
      );
  }

  getCoins() {
    this.coinService.getCoins().subscribe(
      (resp) => (this.coins = resp),
      (err: HttpErrorResponse) => {
        this.messageService.errorApi(
          'No se mostrara el listado de coins hasta que se arregle el error',
          err
        );
      }
    );
  }

  save() {
    this.modal.close(this.form.value);
  }
}
