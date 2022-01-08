import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { IPortfolioLine } from './../models/portfolioLine';

const path_url = environment.url;

@Injectable({
  providedIn: 'root',
})
export class PortfolioLinesService {
  constructor(private http: HttpClient) {}

  getPortfolioLines() {
    return this.http.get<IPortfolioLine[]>(`${path_url}/lines`);
  }

  createPortfolioLine(coins: IPortfolioLine) {
    return this.http.post<IPortfolioLine[]>(`${path_url}/lines`, coins);
  }

  updatePortfolioLine(id: number, coins: IPortfolioLine) {
    return this.http.patch<IPortfolioLine[]>(`${path_url}/lines/${id}`, coins);
  }

  deletePortfolioLine(id: number) {
    return this.http.delete(`${path_url}/lines/${id}`);
  }

  getValorCoin(coin: string) {
    return this.http.get<{ EUR: number }>(
      `https://min-api.cryptocompare.com/data/price?fsym=${coin}&tsyms=EUR`
    );
  }
}
