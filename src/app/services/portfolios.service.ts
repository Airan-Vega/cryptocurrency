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
}
