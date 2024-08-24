import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConverterRepository } from './converter/converter.repository';
import { ConverterComponent } from './converter/converter.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ConverterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  public msg?: Array<any>;
  title = 'Currency conversion';
}
