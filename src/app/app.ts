import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Coin } from './Coin';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App implements OnInit {
  coins = signal<Coin[]>([]);
  private httpClient = inject(HttpClient);

  ngOnInit(): void {
    this.httpClient.get<Coin[]>('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&page=1&per_page=100&sparkline=false')
      .subscribe({
        next: (data) => {
          console.log(data);
          this.coins.set(data);
        },
        error: (error) => {
          console.log(error);
        }
      })
  }
}
