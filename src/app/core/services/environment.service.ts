import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  
  constructor() { }

  /**
   * Detecta si estamos en modo desarrollo
   */
  isDevelopment(): boolean {
    return !this.isProduction();
  }

  /**
   * Detecta si estamos en modo producción
   */
  isProduction(): boolean {
    return window.location.hostname !== 'localhost' && 
           window.location.hostname !== '127.0.0.1' &&
           !window.location.hostname.includes('localhost');
  }

  /**
   * Obtiene la URL base para los assets
   */
  getAssetsUrl(): string {
    return this.isProduction() ? '' : '';
  }

  /**
   * Log condicional solo en desarrollo
   */
  devLog(message: string, ...args: any[]): void {
    if (this.isDevelopment()) {
      console.log(`[DEV] ${message}`, ...args);
    }
  }

  /**
    Log de errores que siempre se muestran
   */
  errorLog(message: string, ...args: any[]): void {
    console.error(`[ERROR] ${message}`, ...args);
  }
}