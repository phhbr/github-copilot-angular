import { Component, ChangeDetectionStrategy, output, inject } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormData } from '../models/form.model';
import { FormService } from '../services/form.service';

@Component({
  selector: 'app-form-step-1',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="form-step">
      <h2>Step 1: Invoice & Shipping Information</h2>
      
      <div class="form-group">
        <h3>Personal Information</h3>
        
        <kol-input-text
          [_label]="'First Name'"
          [_value]="formData().firstName"
          [_required]="true"
          (input)="onFirstNameChange($event)"
        ></kol-input-text>

        <kol-input-text
          [_label]="'Last Name'"
          [_value]="formData().lastName"
          [_required]="true"
          (input)="onLastNameChange($event)"
        ></kol-input-text>
      </div>

      <div class="form-group">
        <h3>Invoice Address</h3>
        
        <kol-input-text
          [_label]="'Street Address'"
          [_value]="formData().invoiceAddress.street"
          [_required]="true"
          (input)="onInvoiceStreetChange($event)"
        ></kol-input-text>

        <kol-input-text
          [_label]="'City'"
          [_value]="formData().invoiceAddress.city"
          [_required]="true"
          (input)="onInvoiceCityChange($event)"
        ></kol-input-text>

        <kol-input-text
          [_label]="'ZIP Code'"
          [_value]="formData().invoiceAddress.zipCode"
          [_required]="true"
          (input)="onInvoiceZipChange($event)"
        ></kol-input-text>
      </div>

      <div class="form-group">
        <h3>Shipping Address</h3>
        
        <kol-input-text
          [_label]="'Street Address'"
          [_value]="formData().shippingAddress.street"
          [_required]="true"
          (input)="onShippingStreetChange($event)"
        ></kol-input-text>

        <kol-input-text
          [_label]="'City'"
          [_value]="formData().shippingAddress.city"
          [_required]="true"
          (input)="onShippingCityChange($event)"
        ></kol-input-text>

        <kol-input-text
          [_label]="'ZIP Code'"
          [_value]="formData().shippingAddress.zipCode"
          [_required]="true"
          (input)="onShippingZipChange($event)"
        ></kol-input-text>
      </div>

      <div class="form-actions">
        <kol-button
          [_label]="'Next Step'"
          [_variant]="'primary'"
          (click)="nextStep()"
        ></kol-button>
      </div>
    </div>
  `,
  styles: [`
    .form-step {
      max-width: 600px;
      margin: 0 auto;
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    }

    h2 {
      margin-bottom: 2rem;
      color: #333;
    }

    h3 {
      margin-top: 1.5rem;
      margin-bottom: 1rem;
      color: #555;
      font-size: 1.1rem;
    }

    .form-group {
      margin-bottom: 2rem;
    }

    kol-input-text {
      display: block;
      margin-bottom: 1rem;
    }

    .form-actions {
      margin-top: 2rem;
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
    }
  `]
})
export class FormStep1Component {
  private formService = inject(FormService);
  protected formData = this.formService.formData;

  protected nextStepEvent = output<void>();

  private updateFormData(updates: Partial<FormData>) {
    this.formService.updateFormData(updates);
  }

  protected onFirstNameChange(event: Event) {
    const value = (event.target as any).value;
    this.updateFormData({ firstName: value });
  }

  protected onLastNameChange(event: Event) {
    const value = (event.target as any).value;
    this.updateFormData({ lastName: value });
  }

  protected onInvoiceStreetChange(event: Event) {
    const value = (event.target as any).value;
    const current = this.formData();
    this.updateFormData({
      invoiceAddress: { ...current.invoiceAddress, street: value }
    });
  }

  protected onInvoiceCityChange(event: Event) {
    const value = (event.target as any).value;
    const current = this.formData();
    this.updateFormData({
      invoiceAddress: { ...current.invoiceAddress, city: value }
    });
  }

  protected onInvoiceZipChange(event: Event) {
    const value = (event.target as any).value;
    const current = this.formData();
    this.updateFormData({
      invoiceAddress: { ...current.invoiceAddress, zipCode: value }
    });
  }

  protected onShippingStreetChange(event: Event) {
    const value = (event.target as any).value;
    const current = this.formData();
    this.updateFormData({
      shippingAddress: { ...current.shippingAddress, street: value }
    });
  }

  protected onShippingCityChange(event: Event) {
    const value = (event.target as any).value;
    const current = this.formData();
    this.updateFormData({
      shippingAddress: { ...current.shippingAddress, city: value }
    });
  }

  protected onShippingZipChange(event: Event) {
    const value = (event.target as any).value;
    const current = this.formData();
    this.updateFormData({
      shippingAddress: { ...current.shippingAddress, zipCode: value }
    });
  }

  protected nextStep = () => {
    this.nextStepEvent.emit();
  };
}
