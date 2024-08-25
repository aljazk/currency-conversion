import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConverterRepository } from '../converter/converter.repository';
import { CurrencyInfoDTO } from '../converter/currency-info.model';
import { LoaderComponent } from '../global/loader/loader.component';
import { tap } from 'rxjs';
import { ConversionResultModel } from '../converter/conversion-result.model';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, RouterModule, LoaderComponent],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
})
export class HistoryComponent implements AfterViewInit {
  @ViewChild(LoaderComponent) loader?: LoaderComponent;
  public result?: Array<ConversionResultModel>;
  constructor(private repo: ConverterRepository) {}
  ngAfterViewInit(): void {
    this.reload();
  }

  round(num: number) {
    return num.toFixed(2);
  }

  formattedDate(date: string): string {
    return new Date(date).toLocaleString();
  }

  reload() {
    if (this.loader) {
      this.loader.trigger(
        this.repo.getConversionsHistory().pipe(
          tap((result) => {
            this.result = result;
          })
        )
      );
    }
  }
}
