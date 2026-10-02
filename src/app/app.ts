import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Coin } from './Coin';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App implements OnInit {
  coins = signal<Coin[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  search = signal('');

  filteredCoins = computed(() => {
    const query = this.search().trim().toLowerCase();
    if (!query) {
      return this.coins();
    }
    return this.coins()
      .filter((coin) => coin.name.toLowerCase().includes(query) || coin.symbol.toLowerCase().includes(query));
  });

  private httpClient = inject(HttpClient);

  ngOnInit(): void {
    this.httpClient.get<Coin[]>('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&page=1&per_page=10&sparkline=false')
      .subscribe({
        next: (data) => {
          this.coins.set(data);
          this.loading.set(false);
        },
        error: (error) => {
          this.error.set(error?.message ?? 'Failed to load market data.');
          this.loading.set(false);
        }
      })
  }
}
