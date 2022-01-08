import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { IPortfolio } from '../models/portfolio';

const path_url = environment.url;

@Injectable({
  providedIn: 'root',
})
export class PortfoliosService {
  constructor(private http: HttpClient) {}

  getPortfolios() {
    return this.http.get<IPortfolio[]>(`${path_url}/portfolios`);
  }

  createPortfolio(coins: IPortfolio) {
    return this.http.post<IPortfolio[]>(`${path_url}/portfolios`, coins);
  }

  updatePortfolio(id: number, coins: IPortfolio) {
    return this.http.patch<IPortfolio[]>(`${path_url}/portfolios/${id}`, coins);
  }

  deletePortfolio(id: number) {
    return this.http.delete(`${path_url}/portfolios/${id}`);
  }
}
