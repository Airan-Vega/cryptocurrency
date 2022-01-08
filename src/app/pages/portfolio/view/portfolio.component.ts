import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { IPortfolio } from '../../../models/portfolio';
import { PortfoliosService } from '../../../services/portfolios.service';
import { ModalPortfolioComponent } from '../modal-portfolio/modal-portfolio.component';
import { MessagesService } from '../../../services/messages.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
})
export class PortfolioComponent implements OnInit, OnDestroy {
  private destroy$: Subject<boolean> = new Subject<boolean>();

  public error: any = '';
  public portfolios: IPortfolio[] = [];

  constructor(
    private portfolioService: PortfoliosService,
    private modalService: NgbModal,
    private messagesService: MessagesService
  ) {}

  ngOnInit(): void {
    this.cargarPortfolios();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  cargarPortfolios() {
    this.portfolioService
      .getPortfolios()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.portfolios = res;
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
  crearPortfolio() {
    const modalRef = this.modalService.open(ModalPortfolioComponent);
    modalRef.componentInstance.title = 'Crear nuevo portfolio';
    modalRef.closed.subscribe((data: IPortfolio) => {
      this.portfolioService
        .createPortfolio(data)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          () => {
            this.portfolios.push(data);
            this.messagesService.guardar('Portfolio creado exitosamente');
          },
          (err: HttpErrorResponse) => {
            this.messagesService.errorApi(
              'No podra crear portfolio hasta que se arregle el error',
              err
            );
          }
        );
    });
  }

  editarPortFolio(portfolio: IPortfolio) {
    const modalRef = this.modalService.open(ModalPortfolioComponent);
    modalRef.componentInstance.title = 'Actualizar portfolio';
    modalRef.componentInstance.data = portfolio;
    modalRef.closed.subscribe((data: IPortfolio) => {
      this.portfolioService
        .updatePortfolio(data.id, data)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          () => {
            this.cargarPortfolios();
            this.messagesService.actualizar(
              'Portfolio actualizado correctamente'
            );
          },
          (err: HttpErrorResponse) => {
            this.messagesService.errorApi(
              'No podra actualizar portfolio hasta que se arregle el error',
              err
            );
          }
        );
    });
  }
  eliminarPortfolio(portfolio: IPortfolio) {
    this.messagesService
      .confirmar(
        '¿Borrar Portfolio?',
        `Esta a punto de borrar ${portfolio.name}`
      )
      .then((result) => {
        if (result.isConfirmed) {
          this.portfolioService
            .deletePortfolio(portfolio.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe(
              () => {
                this.messagesService.borrar(
                  'Portfolio borrado',
                  `${portfolio.name} fue eliminado correctamente`
                );
                this.portfolios = this.portfolios.filter(
                  (resp) => resp.id !== portfolio.id
                );
              },
              (err: HttpErrorResponse) => {
                this.messagesService.errorApi(
                  'No podra eliminar portfolio hasta que se arregle el error',
                  err
                );
              }
            );
        }
      });
  }
}
