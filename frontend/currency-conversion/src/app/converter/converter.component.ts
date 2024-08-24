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
import { LoaderComponent } from '../global/loader/loader.component';
import { tap } from 'rxjs';

@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent],
  templateUrl: './converter.component.html',
  styleUrl: './converter.component.scss',
})
export class ConverterComponent implements AfterViewInit {
  @ViewChild('mainLoader') mainLoader?: LoaderComponent;
  @ViewChild('resultLoader') resultLoader?: LoaderComponent;

  public supportedCurrencies?: Array<CurrencyInfo>;
  public result: any;
  constructor(private converterRepository: ConverterRepository) {}

  ngAfterViewInit(): void {
    this.mainLoader?.trigger(
      this.converterRepository.getSupportedCurrencies().pipe(
        tap((res) => {
          this.supportedCurrencies = res;
        })
      )
    );
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
    this.resultLoader?.trigger(
      this.converterRepository.convert(from.value, to.value, amount.value).pipe(
        tap((result) => {
          this.result = result;
        })
      )
    );
  }

  getResult(result: number, round: any): string {
    return round ? result.toFixed(2) : result.toString();
  }
}
