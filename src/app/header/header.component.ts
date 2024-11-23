import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header>
      <div class="logo-container">
        <img
          src="https://banquemisr.com/Assets/Images/bmp-logo.png?v=14"
          alt="Banque Misr Logo"
          class="logo-image"
        />
      </div>
      <div class="logo">Currency Exchanger</div>
      <nav>
        <a routerLink="/" aria-label="Go to Home">Home</a>
        <a routerLink="/details/USD" aria-label="View USD Details"
          >USD Details</a
        >
        <a routerLink="/details/EUR" aria-label="View EUR Details"
          >EUR Details</a
        >
      </nav>
    </header>
  `,
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {}
