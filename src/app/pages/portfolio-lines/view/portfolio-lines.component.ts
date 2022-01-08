import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPortfolioLine } from '../../../models/portfolioLine';
import { PortfolioLinesService } from '../../../services/portfolio-lines.service';
import { MessagesService } from '../../../services/messages.service';
import { CoinsService } from '../../../services/coins.service';
import { PortfoliosService } from '../../../services/portfolios.service';
import { ModalPortfolioLinesComponent } from '../modal-portfolio-lines/modal-portfolio-lines.component';

@Component({
  selector: 'app-portfolio-lines',
  templateUrl: './portfolio-lines.component.html',
})
export class PortfolioLinesComponent implements OnInit, OnDestroy {
  private destroy$: Subject<boolean> = new Subject<boolean>();

  public error: any = '';
  public portfolioLines: IPortfolioLine[] = [];

  constructor(
    private portfolioLineService: PortfolioLinesService,
    private coinsService: CoinsService,
    private portfolioService: PortfoliosService,
    private messagesService: MessagesService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.cargarPortfolioLines();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  cargarPortfolioLines() {
    this.portfolioLineService
      .getPortfolioLines()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          const newResp = res.map((r) => {
            this.coinsService
              .getCoins()
              .pipe(takeUntil(this.destroy$))
              .subscribe((coins) => {
                const coin = coins.filter((c) => c.id === r.coinId);
                r.acronym = coin[0].acronym;
                r.coin = coin[0].name;
                this.portfolioLineService
                  .getValorCoin(r.acronym)
                  .pipe(takeUntil(this.destroy$))
                  .subscribe((v) => {
                    r.euro = v.EUR ? v.EUR : 0;
                    r.valorTotalEuro = v.EUR ? v.EUR * r.amount : 0;
                  });
              });

            this.portfolioService
              .getPortfolios()
              .pipe(takeUntil(this.destroy$))
              .subscribe((portfolios) => {
                const portfolio = portfolios.filter(
                  (p) => p.id === r.portfolioId
                );
                r.portfolio = portfolio[0].name;
              });

            return r;
          });

          this.portfolioLines = newResp;
        },
        (err: HttpErrorResponse) => {
          this.error = err;
          this.messagesService.errorApi(
            'Esta sección estara desabilitada hasta que se arregle el error',
            err
          );
        }
      );
  }

  crearPortfolioLine() {
    const modalRef = this.modalService.open(ModalPortfolioLinesComponent);
    modalRef.componentInstance.title = 'Crear nuevo portfolio line';
    modalRef.closed.subscribe((data: IPortfolioLine) => {
      this.portfolioLineService
        .createPortfolioLine(data)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          () => {
            this.cargarPortfolioLines();
            this.messagesService.guardar('Portfolio Line creado exitosamente');
          },
          (err: HttpErrorResponse) => {
            this.messagesService.errorApi(
              'No podra crear portfolio line hasta que se arregle el error',
              err
            );
          }
        );
    });
  }

  editarPortFolioLine(line: IPortfolioLine) {
    const modalRef = this.modalService.open(ModalPortfolioLinesComponent);
    modalRef.componentInstance.title = 'Actualizar portfolio line';
    modalRef.componentInstance.data = line;
    modalRef.closed.subscribe((data: IPortfolioLine) => {
      this.portfolioLineService
        .updatePortfolioLine(data.id, data)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          () => {
            this.cargarPortfolioLines();
            this.messagesService.actualizar(
              'Portfolio line actualizado correctamente'
            );
          },
          (err: HttpErrorResponse) => {
            this.messagesService.errorApi(
              'No podra actualizar portfolio line hasta que se arregle el error',
              err
            );
          }
        );
    });
  }
  eliminarPortfolioLine(line: IPortfolioLine) {
    this.messagesService
      .confirmar(
        '¿Borrar Portfolio?',
        `Esta a punto de borrar el portfolio line con id: ${line.id}`
      )
      .then((result) => {
        if (result.isConfirmed) {
          this.portfolioLineService
            .deletePortfolioLine(line.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe(
              () => {
                this.messagesService.borrar(
                  'Portfolio line borrado',
                  `El portfolio line con id ${line.id}, fue eliminado correctamente`
                );
                this.portfolioLines = this.portfolioLines.filter(
                  (resp) => resp.id !== line.id
                );
              },
              (err: HttpErrorResponse) => {
                this.messagesService.errorApi(
                  'No podra eliminar portfolio line hasta que se arregle el error',
                  err
                );
              }
            );
        }
      });
  }
}
