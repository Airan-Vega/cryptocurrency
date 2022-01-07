import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CoinsService } from '../../../services/coins.service';
import { ICoin } from '../../../models/coin';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalCoinsComponent } from '../modal-coins/modal-coins.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './coins.component.html',
  styleUrls: ['./coins.component.scss'],
})
export class CoinsComponent implements OnInit, OnDestroy {
  private destroy$: Subject<boolean> = new Subject<boolean>();

  public error: any = '';

  public coins: ICoin[] = [];
  constructor(
    private coinsService: CoinsService,
    private modalService: NgbModal
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
          console.warn(err);
          Swal.fire({
            icon: 'error',
            title: 'Error en la petición de la API',
            text: 'Esta sección estara desabilitada hasta que se arregle el error ',
          });
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
        .subscribe((r) => {
          if (!r) {
            this.errorCoinNoExiste('Error al crear el Coin');
          } else {
            this.coinsService
              .createCoins(data)
              .pipe(takeUntil(this.destroy$))
              .subscribe(
                () => {
                  this.coins.push(data);
                  Swal.fire('Guardado', 'Coin creado exitosamente', 'success');
                },
                (err: HttpErrorResponse) => {
                  this.errorApi(
                    'La creación de coins estara desabilitada hasta que se arregle el error',
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
        .subscribe((r) => {
          if (!r) {
            this.errorCoinNoExiste('Error al actualizar el Coin');
          } else {
            this.coinsService
              .updateCoin(data.id, data)
              .pipe(takeUntil(this.destroy$))
              .subscribe(
                () => {
                  this.cargarCoins();
                  Swal.fire(
                    'Actualizado',
                    'Coin actualizado correctamente',
                    'success'
                  );
                },
                (err: HttpErrorResponse) => {
                  this.errorApi(
                    'La creación de coins estara desabilitada hasta que se arregle el error',
                    err
                  );
                }
              );
          }
        });
    });
  }

  eliminarCoin(coin: ICoin) {
    Swal.fire({
      title: '¿Borrar Coin?',
      text: `Esta a punto de borrar ${coin.name}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar coin',
    }).then((result) => {
      if (result.isConfirmed) {
        this.coinsService
          .deleteCoin(coin.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            () => {
              Swal.fire(
                'Coin borrado',
                `${coin.name} fue eliminado correctamente`,
                'success'
              );
              this.coins = this.coins.filter((resp) => resp.id !== coin.id);
            },
            (err: HttpErrorResponse) => {
              this.errorApi(
                'No podra eliminar coins hasta que se arregle el error',
                err
              );
            }
          );
      }
    });
  }

  private errorApi(message: string, err: HttpErrorResponse) {
    this.error = err;
    console.warn(err);
    Swal.fire({
      icon: 'error',
      title: 'Error en la petición de la API',
      text: message,
    });
  }

  private errorCoinNoExiste(title: string) {
    Swal.fire({
      icon: 'error',
      title,
      text: 'No existe un coin con este acronimo',
    });
  }
}
