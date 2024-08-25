import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { tap } from 'rxjs';
import { LoaderComponent } from '../global/loader/loader.component';
import { ConverterRepository } from './converter.repository';
import { CurrencyInfo } from './currency-info.model';
import { ConversionResultModel } from './conversion-result.model';
import { Status } from '../global/loader/status.enum';

@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent, RouterModule],
  templateUrl: './converter.component.html',
  styleUrl: './converter.component.scss',
})
export class ConverterComponent implements AfterViewInit {
  @ViewChild('mainLoader') mainLoader?: LoaderComponent;
  @ViewChild('resultLoader') resultLoader?: LoaderComponent;

  public supportedCurrencies?: Array<CurrencyInfo>;
  public result?: ConversionResultModel;
  constructor(private converterRepository: ConverterRepository) {}

  ngAfterViewInit(): void {
    const obs = this.converterRepository.getSupportedCurrencies().pipe(
      tap((res) => {
        this.supportedCurrencies = res;
      })
    );
    console.log(this.converterRepository, obs);
    this.mainLoader?.trigger(obs);
    if (this.resultLoader) {
      this.resultLoader.status = Status.Success;
    }
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
