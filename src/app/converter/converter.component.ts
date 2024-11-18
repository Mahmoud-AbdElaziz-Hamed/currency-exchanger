import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CurrencyService } from '../services/currency.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface QuickConversion {
  amount: number;
  from: number;
  to: number;
}

@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss'],
})
export class ConverterComponent implements OnInit {
  converterForm: FormGroup;
  currencies: string[] = ['USD', 'EUR', 'GBP', 'JPY', 'AUD'];
  convertedAmount: number | null = null;
  quickConversions: QuickConversion[] = [];
  isLoading: boolean = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private currencyService: CurrencyService
  ) {
    this.converterForm = this.fb.group({
      amount: [
        { value: '', disabled: false },
        [Validators.required, Validators.min(0)],
      ],
      from: [{ value: 'USD', disabled: false }, Validators.required],
      to: [{ value: 'EUR', disabled: false }, Validators.required],
    });
  }

  ngOnInit(): void {
    this.updateQuickConversions();
  }

  onSubmit(): void {
    if (this.converterForm.valid) {
      this.isLoading = true;
      this.error = null;
      const { amount, from, to } = this.converterForm.getRawValue();
      this.currencyService.convertCurrency(from, to, amount).subscribe(
        (result) => {
          this.convertedAmount = result;
          this.updateQuickConversions();
          this.isLoading = false;
        },
        (error) => {
          console.error('Error converting currency:', error);
          this.error =
            'An error occurred while converting the currency. Please try again.';
          this.isLoading = false;
        }
      );
    }
  }

  swapCurrencies(): void {
    const from = this.converterForm.get('from')?.value;
    const to = this.converterForm.get('to')?.value;
    this.converterForm.patchValue({ from: to, to: from });
    this.onSubmit();
  }

  updateQuickConversions(): void {
    const amounts = [1, 10, 100, 1000];
    const { from, to } = this.converterForm.getRawValue();
    this.quickConversions = [];

    amounts.forEach((amount) => {
      this.currencyService.convertCurrency(from, to, amount).subscribe(
        (result) => {
          this.quickConversions.push({ amount, from: amount, to: result });
        },
        (error) => console.error('Error updating quick conversions:', error)
      );
    });
  }

  setLoading(isLoading: boolean): void {
    this.isLoading = isLoading;
    if (isLoading) {
      this.converterForm.disable();
    } else {
      this.converterForm.enable();
    }
  }
}
