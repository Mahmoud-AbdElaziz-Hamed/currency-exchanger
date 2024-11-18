import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface CurrencyResponse {
  success: boolean;
  rates: {
    [key: string]: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private apiKey = '9ce295cbb29ab65897e39331f255e387';
  private baseUrl = 'http://data.fixer.io/api';

  constructor(private http: HttpClient) {}

  getLatestRates(): Observable<CurrencyResponse> {
    return this.http
      .get<CurrencyResponse>(`${this.baseUrl}/latest?access_key=${this.apiKey}`)
      .pipe(
        catchError((error) => {
          console.error('Error fetching rates:', error);
          return of({ success: false, rates: {} });
        })
      );
  }

  convertCurrency(
    from: string,
    to: string,
    amount: number
  ): Observable<number> {
    return this.getLatestRates().pipe(
      map((response) => {
        if (!response.success || !response.rates) {
          throw new Error('Failed to fetch exchange rates');
        }
        const fromRate = response.rates[from];
        const toRate = response.rates[to];
        if (fromRate === undefined || toRate === undefined) {
          throw new Error(`Exchange rate not available for ${from} or ${to}`);
        }
        return (amount / fromRate) * toRate;
      }),
      catchError((error) => {
        console.error('Error converting currency:', error);
        return of(0);
      })
    );
  }

  getHistoricalRates(date: string): Observable<CurrencyResponse> {
    return this.http
      .get<CurrencyResponse>(
        `${this.baseUrl}/${date}?access_key=${this.apiKey}`
      )
      .pipe(
        catchError((error) => {
          console.error('Error fetching historical rates:', error);
          return of({ success: false, rates: {} });
        })
      );
  }
}
