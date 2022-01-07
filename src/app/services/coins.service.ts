import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { iif, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { ICoin } from '../models/coin';

const path_url = environment.url;

@Injectable({
  providedIn: 'root',
})
export class CoinsService {
  constructor(private http: HttpClient) {}

  getCoins() {
    return this.http.get<ICoin[]>(`${path_url}/coins`);
  }

  createCoins(coins: ICoin) {
    return this.http.post<ICoin[]>(`${path_url}/coins`, coins);
  }

  updateCoin(id: number, coins: ICoin) {
    return this.http.patch<ICoin[]>(`${path_url}/coins/${id}`, coins);
  }

  deleteCoin(id: number) {
    return this.http.delete(`${path_url}/coins/${id}`);
  }

  coinNoExiste(acronym: string) {
    return this.http
      .get<boolean>('https://min-api.cryptocompare.com/data/all/coinlist')
      .pipe(
        map((resp: any) => {
          return Object.keys(resp.Data).includes(acronym);
        })
      );
  }
}
