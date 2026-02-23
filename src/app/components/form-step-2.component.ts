import { Component, ChangeDetectionStrategy, output, inject } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormData } from '../models/form.model';
import { FormService } from '../services/form.service';

@Component({
  selector: 'app-form-step-2',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="form-step">
      <h2>Step 2: Review & Confirmation</h2>
      
      <div class="form-group">
        <h3>Personal Information</h3>
        
        <kol-input-text
          [_label]="'First Name'"
          [_value]="formData().firstName"
          [_readOnly]="true"
          [_disabled]="true"
        ></kol-input-text>

        <kol-input-text
          [_label]="'Last Name'"
          [_value]="formData().lastName"
          [_readOnly]="true"
          [_disabled]="true"
        ></kol-input-text>
      </div>

      <div class="form-group">
        <h3>Invoice Address</h3>
        
        <kol-input-text
          [_label]="'Street Address'"
          [_value]="formData().invoiceAddress.street"
          [_readOnly]="true"
          [_disabled]="true"
        ></kol-input-text>

        <kol-input-text
          [_label]="'City'"
          [_value]="formData().invoiceAddress.city"
          [_readOnly]="true"
          [_disabled]="true"
        ></kol-input-text>

        <kol-input-text
          [_label]="'ZIP Code'"
          [_value]="formData().invoiceAddress.zipCode"
          [_readOnly]="true"
          [_disabled]="true"
        ></kol-input-text>
      </div>

      <div class="form-group">
        <h3>Shipping Address</h3>
        
        <kol-input-text
          [_label]="'Street Address'"
          [_value]="formData().shippingAddress.street"
          [_readOnly]="true"
          [_disabled]="true"
        ></kol-input-text>

        <kol-input-text
          [_label]="'City'"
          [_value]="formData().shippingAddress.city"
          [_readOnly]="true"
          [_disabled]="true"
        ></kol-input-text>

        <kol-input-text
          [_label]="'ZIP Code'"
          [_value]="formData().shippingAddress.zipCode"
          [_readOnly]="true"
          [_disabled]="true"
        ></kol-input-text>
      </div>

      <div class="form-group">
        <h3>Terms of Service</h3>
        
        <kol-input-checkbox
          [_label]="'I accept the Terms of Service'"
          [_checked]="formData().acceptTerms"
          (input)="onAcceptTermsChange($event)"
        ></kol-input-checkbox>
      </div>

      <div class="form-actions">
        <kol-button
          [_label]="'Back'"
          [_variant]="'secondary'"
          (click)="goBack()"
        ></kol-button>
        
        <kol-button
          [_label]="'Submit'"
          [_variant]="'primary'"
          [_disabled]="!formData().acceptTerms"
          (click)="submitForm()"
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

    kol-input-text,
    kol-input-checkbox {
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
export class FormStep2Component {
  private formService = inject(FormService);
  protected formData = this.formService.formData;

  protected backEvent = output<void>();
  protected submitEvent = output<FormData>();

  protected onAcceptTermsChange(event: Event) {
    const value = (event.target as any).checked;
    this.formService.updateFormData({ acceptTerms: value });
  }

  protected goBack = () => {
    this.backEvent.emit();
  };

  protected submitForm = () => {
    const currentData = this.formData();
    if (currentData.acceptTerms) {
      this.submitEvent.emit(currentData);
    }
  };
}
