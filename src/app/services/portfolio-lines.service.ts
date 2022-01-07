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
}
