import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  CurrencyService,
  CurrencyResponse,
} from '../services/currency.service';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface HistoricalRates {
  yearAgo: number;
  monthAgo: number;
  yesterday: number;
  today: number;
}

interface PopularConversions {
  [key: string]: number;
}

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  from: string = '';
  to: string = '';
  historicalRates: HistoricalRates = {
    yearAgo: 0,
    monthAgo: 0,
    yesterday: 0,
    today: 0,
  };
  popularCurrencies: string[] = ['USD', 'EUR', 'GBP', 'JPY', 'AUD'];
  popularConversions: PopularConversions = {};

  constructor(
    private route: ActivatedRoute,
    private currencyService: CurrencyService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.from = params['from'] || this.route.snapshot.data['from'] || 'USD';
      this.to = params['to'] || this.route.snapshot.data['to'] || 'EUR';
      this.loadData();
    });
  }

  loadData(): void {
    const today = new Date();
    const oneYearAgo = new Date(
      today.getFullYear() - 1,
      today.getMonth(),
      today.getDate()
    );
    const oneMonthAgo = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      today.getDate()
    );
    const yesterday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 1
    );

    forkJoin({
      yearAgo: this.currencyService.getHistoricalRates(
        this.formatDate(oneYearAgo)
      ),
      monthAgo: this.currencyService.getHistoricalRates(
        this.formatDate(oneMonthAgo)
      ),
      yesterday: this.currencyService.getHistoricalRates(
        this.formatDate(yesterday)
      ),
      latest: this.currencyService.getLatestRates(),
    }).subscribe(
      (results: { [key: string]: CurrencyResponse }) => {
        this.historicalRates = {
          yearAgo: results['yearAgo'].rates[this.to] || 0,
          monthAgo: results['monthAgo'].rates[this.to] || 0,
          yesterday: results['yesterday'].rates[this.to] || 0,
          today: results['latest'].rates[this.to] || 0,
        };

        this.popularConversions = this.popularCurrencies.reduce(
          (acc, currency) => {
            acc[currency] = results['latest'].rates[currency] || 0;
            return acc;
          },
          {} as PopularConversions
        );
      },
      (error) => console.error('Error loading details data:', error)
    );
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
