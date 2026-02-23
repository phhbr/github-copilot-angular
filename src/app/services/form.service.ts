import { Injectable, signal, computed, Signal } from '@angular/core';
import { FormData, emptyFormData } from '../models/form.model';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private formDataSignal = signal<FormData>(structuredClone(emptyFormData));

  formData: Signal<FormData> = this.formDataSignal.asReadonly();

  updateFormData(data: Partial<FormData>) {
    this.formDataSignal.update(current => ({
      ...current,
      ...data
    }));
  }

  resetForm() {
    this.formDataSignal.set(structuredClone(emptyFormData));
  }
}
