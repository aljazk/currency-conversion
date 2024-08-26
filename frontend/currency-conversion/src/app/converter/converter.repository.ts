import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { CurrencyInfo, CurrencyInfoDTO } from './currency-info.model';
import { ConversionResultModel } from './conversion-result.model';

@Injectable({
  providedIn: 'root',
})
export class ConverterRepository {
  constructor(private httpClient: HttpClient) {}

  convert(
    from: string,
    to: string,
    amount: string
  ): Observable<ConversionResultModel> {
    return this.httpClient.post<ConversionResultModel>(
      'api/conversion/convert',
      {
        from: from,
        to: to,
        amount: amount,
      }
    );
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

  getConversionsHistory(): Observable<Array<ConversionResultModel>> {
    return this.httpClient.get<Array<ConversionResultModel>>(
      'api/conversion/conversions-history'
    );
  }
}
