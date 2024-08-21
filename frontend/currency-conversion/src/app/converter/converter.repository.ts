import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { CurrencyInfo, CurrencyInfoDTO } from './currency-info.model';

@Injectable({
  providedIn: 'root',
})
export class ConverterRepository {
  constructor(private httpClient: HttpClient) {}

  convert(from: string, to: string, amount: string): Observable<any> {
    return this.httpClient.get<CurrencyInfoDTO>('api/conversion/convert', {
      params: {
        from: from,
        to: to,
        amount: amount,
      },
    });
  }
  getSupportedCurrencies(): Observable<Array<CurrencyInfo>> {
    return this.httpClient
      .get<CurrencyInfoDTO>('api/conversion/supported-currencies')
      .pipe(
        map((supportedCurrencies: CurrencyInfoDTO) => {
          const supportedArray = [];
          for (const currencyKey of Object.keys(supportedCurrencies)) {
            supportedArray.push({
              key: currencyKey,
              value: supportedCurrencies[currencyKey],
            });
          }
          return supportedArray;
        })
      );
  }
}
