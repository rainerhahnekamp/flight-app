import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InterceptorTestService } from './interceptor-test.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="interceptor-demo">
      <h2>HTTP Interceptor Demo</h2>
      <p>
        This component demonstrates the filtering interceptor functionality.
      </p>

      <div class="button-group">
        <button (click)="testWienToParis()" [disabled]="loading">
          Wien → Paris
        </button>
        <button (click)="testWienToLondon()" [disabled]="loading">
          Wien → London
        </button>
        <button (click)="testWienToBerlin()" [disabled]="loading">
          Wien → Berlin
        </button>
        <button (click)="testWienToCopenhagen()" [disabled]="loading">
          Wien → København (5 flights)
        </button>
        <button (click)="testCopenhagenToWien()" [disabled]="loading">
          København → Wien (5 flights)
        </button>
        <button (click)="testNonExistentRoute()" [disabled]="loading">
          Non-existent Route
        </button>
      </div>

      @if (loading) {
        <div class="loading">Loading...</div>
      }

      @if (lastResponse) {
        <div class="response">
          <h3>Last Response:</h3>
          <pre>{{ lastResponse | json }}</pre>
        </div>
      }

      @if (error) {
        <div class="error">
          <h3>Error:</h3>
          <p>{{ error }}</p>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .interceptor-demo {
        padding: 20px;
        max-width: 800px;
        margin: 0 auto;
      }

      .button-group {
        display: flex;
        gap: 10px;
        margin: 20px 0;
      }

      button {
        padding: 10px 20px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }

      button:hover:not(:disabled) {
        background-color: #0056b3;
      }

      button:disabled {
        background-color: #6c757d;
        cursor: not-allowed;
      }

      .loading {
        color: #007bff;
        font-weight: bold;
        margin: 20px 0;
      }

      .response {
        background-color: #f8f9fa;
        border: 1px solid #dee2e6;
        border-radius: 4px;
        padding: 15px;
        margin: 20px 0;
      }

      .response pre {
        background-color: white;
        padding: 10px;
        border-radius: 4px;
        overflow-x: auto;
      }

      .error {
        background-color: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
        border-radius: 4px;
        padding: 15px;
        margin: 20px 0;
      }
    `,
  ],
})
export class InterceptorDemoComponent {
  readonly #testService = inject(InterceptorTestService);

  loading = false;
  lastResponse: any = null;
  error: string | null = null;

  async testWienToParis() {
    await this.#executeRequest(() =>
      this.#testService.testFlightRequest('Wien', 'Paris'),
    );
  }

  async testWienToLondon() {
    await this.#executeRequest(() => this.#testService.testWienToLondon());
  }

  async testWienToBerlin() {
    await this.#executeRequest(() =>
      this.#testService.testWienToMultipleDestinations(),
    );
  }

  async testWienToCopenhagen() {
    await this.#executeRequest(() => this.#testService.testWienToCopenhagen());
  }

  async testCopenhagenToWien() {
    await this.#executeRequest(() => this.#testService.testCopenhagenToWien());
  }

  async testNonExistentRoute() {
    await this.#executeRequest(() => this.#testService.testNonExistentRoute());
  }

  async #executeRequest(requestFn: () => any) {
    this.loading = true;
    this.error = null;
    this.lastResponse = null;

    try {
      const response = await requestFn().toPromise();
      this.lastResponse = response;
    } catch (err: any) {
      this.error = err.message || 'An error occurred';
      // For demo purposes, we'll show the error but also log what the interceptor would have done
      console.log(
        'Interceptor filtered flights from JSON data based on from/to parameters',
      );
    } finally {
      this.loading = false;
    }
  }
}
