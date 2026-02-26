import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { tap } from 'rxjs';
import z from 'zod';

const configJsonSchema = z.object({
  baseUrl: z.string(),
});

type ConfigJson = z.infer<typeof configJsonSchema>;

interface IPerson {
  id: number;
  name: string;
}

type TPerson1 = {
  id: number;
  name: string;
};

type TPerson2 = {
  name: number;
};

type TPerson = TPerson1 & TPerson2;

interface TP extends TPerson {
  isValid: boolean;
}

declare function updatePerson<P extends TPerson>(person: P): P;

@Injectable({ providedIn: 'root' })
export class ConfigClient {
  private readonly httpClient = inject(HttpClient);
  baseUrl = '';

  load() {
    return this.httpClient.get('assets/config.json').pipe(
      tap((response) => {
        this.baseUrl = configJsonSchema.parse(response).baseUrl;
      })
    );
  }
}
