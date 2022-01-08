import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CoinsService } from '../../../services/coins.service';
import { ICoin } from '../../../models/coin';
import { ModalCoinsComponent } from '../modal-coins/modal-coins.component';
import { MessagesService } from '../../../services/messages.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './coins.component.html',
})
export class CoinsComponent implements OnInit, OnDestroy {
  private destroy$: Subject<boolean> = new Subject<boolean>();

  public error: any = '';
  public coins: ICoin[] = [];
  constructor(
    private coinsService: CoinsService,
    private modalService: NgbModal,
    private messageService: MessagesService
  ) {}

  ngOnInit(): void {
    this.cargarCoins();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  cargarCoins() {
    this.coinsService
      .getCoins()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.coins = res;
        },
        (err: HttpErrorResponse) => {
          this.error = err;
          this.messageService.errorApi(
            'Esta sección estara desabilitada hasta que se arregle el error',
            err
          );
        }
      );
  }

  crearCoin() {
    const modalRef = this.modalService.open(ModalCoinsComponent);
    modalRef.componentInstance.title = 'Crear nuevo coin';
    modalRef.closed.subscribe((data: ICoin) => {
      this.coinsService
        .coinNoExiste(data.acronym)
        .pipe(takeUntil(this.destroy$))
        .subscribe((r: any) => {
          if (!r || r.CoinName !== data.name) {
            this.messageService.errorNoExiste(
              'Error al crear el Coin',
              'No existe un coin con este nombre o acronimo'
            );
          } else {
            this.coinsService
              .createCoins(data)
              .pipe(takeUntil(this.destroy$))
              .subscribe(
                () => {
                  this.coins.push(data);
                  this.messageService.guardar('Coin creado exitosamente');
                },
                (err: HttpErrorResponse) => {
                  this.messageService.errorApi(
                    'No podra crear coins hasta que se arregle el error',
                    err
                  );
                }
              );
          }
        });
    });
  }

  editarCoin(coin: ICoin) {
    const modalRef = this.modalService.open(ModalCoinsComponent);
    modalRef.componentInstance.title = 'Actualizar coin';
    modalRef.componentInstance.data = coin;
    modalRef.closed.subscribe((data: ICoin) => {
      this.coinsService
        .coinNoExiste(data.acronym)
        .pipe(takeUntil(this.destroy$))
        .subscribe((r: any) => {
          if (!r || r.CoinName !== data.name) {
            this.messageService.errorNoExiste(
              'Error al actualizar el Coin',
              'No existe un coin con este nombre o acronimo'
            );
          } else {
            this.coinsService
              .updateCoin(data.id, data)
              .pipe(takeUntil(this.destroy$))
              .subscribe(
                () => {
                  this.cargarCoins();
                  this.messageService.actualizar(
                    'Coin actualizado correctamente'
                  );
                },
                (err: HttpErrorResponse) => {
                  this.messageService.errorApi(
                    'No podra actualizar coins hasta que se arregle el error',
                    err
                  );
                }
              );
          }
        });
    });
  }

  eliminarCoin(coin: ICoin) {
    this.messageService
      .confirmar('¿Borrar Coin?', `Esta a punto de borrar ${coin.name}`)
      .then((result) => {
        if (result.isConfirmed) {
          this.coinsService
            .deleteCoin(coin.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe(
              () => {
                this.messageService.borrar(
                  'Coin borrado',
                  `${coin.name} fue eliminado correctamente`
                );
                this.coins = this.coins.filter((resp) => resp.id !== coin.id);
              },
              (err: HttpErrorResponse) => {
                this.messageService.errorApi(
                  'No podra eliminar coins hasta que se arregle el error',
                  err
                );
              }
            );
        }
      });
  }
}
