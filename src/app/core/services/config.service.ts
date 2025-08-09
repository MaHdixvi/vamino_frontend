// core/services/config.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private config = {
    apiUrl: '/api',
    defaultPageSize: 10,
    enableFeatureX: true,
  };

  getConfig() {
    return this.config;
  }

  updateConfig(newConfig: Partial<typeof this.config>) {
    this.config = { ...this.config, ...newConfig };
  }
}
