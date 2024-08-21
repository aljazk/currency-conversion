import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ConverterRepository } from './converter.repository';
import { CurrencyInfo } from './currency-info.model';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './converter.component.html',
  styleUrl: './converter.component.scss',
})
export class ConverterComponent {
  public supportedCurrencies?: Array<CurrencyInfo>;
  public result: any;
  constructor(private converterRepository: ConverterRepository) {
    converterRepository.getSupportedCurrencies().subscribe((res) => {
      this.supportedCurrencies = res;
    });
  }

  convert(
    form: HTMLFormElement,
    from: HTMLSelectElement,
    to: HTMLSelectElement,
    amount: HTMLInputElement
  ) {
    if (!form.reportValidity() || !from || !to) {
      return;
    }
    this.converterRepository
      .convert(from.value, to.value, amount.value)
      .subscribe((result) => {
        this.result = result;
      });
  }

  getResult(result: number, round: any): string {
    return round ? result.toFixed(2) : result.toString();
  }
}
