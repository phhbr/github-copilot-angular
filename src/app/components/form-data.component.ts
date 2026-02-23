import { Component, ChangeDetectionStrategy, input, output, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormData } from '../models/form.model';
import { FormService } from '../services/form.service';

@Component({
  selector: 'app-form-data',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="form-step">
      <h2>{{ stepTitle() }}</h2>
      
      <div class="form-group">
        <h3>Personal Information</h3>
        
        <kol-input-text
          [_label]="'First Name'"
          [_value]="formData().firstName"
          [_readOnly]="readonly()"
          [_disabled]="readonly()"
          [_required]="!readonly()"
          (input)="onFieldChange($event, 'firstName')"
        ></kol-input-text>

        <kol-input-text
          [_label]="'Last Name'"
          [_value]="formData().lastName"
          [_readOnly]="readonly()"
          [_disabled]="readonly()"
          [_required]="!readonly()"
          (input)="onFieldChange($event, 'lastName')"
        ></kol-input-text>
      </div>

      <div class="form-group">
        <h3>Invoice Address</h3>
        
        <kol-input-text
          [_label]="'Street Address'"
          [_value]="formData().invoiceAddress.street"
          [_readOnly]="readonly()"
          [_disabled]="readonly()"
          [_required]="!readonly()"
          (input)="onAddressChange($event, 'invoice', 'street')"
        ></kol-input-text>

        <kol-input-text
          [_label]="'City'"
          [_value]="formData().invoiceAddress.city"
          [_readOnly]="readonly()"
          [_disabled]="readonly()"
          [_required]="!readonly()"
          (input)="onAddressChange($event, 'invoice', 'city')"
        ></kol-input-text>

        <kol-input-text
          [_label]="'ZIP Code'"
          [_value]="formData().invoiceAddress.zipCode"
          [_readOnly]="readonly()"
          [_disabled]="readonly()"
          [_required]="!readonly()"
          (input)="onAddressChange($event, 'invoice', 'zipCode')"
        ></kol-input-text>
      </div>

      <div class="form-group">
        <h3>Shipping Address</h3>
        
        <kol-input-text
          [_label]="'Street Address'"
          [_value]="formData().shippingAddress.street"
          [_readOnly]="readonly()"
          [_disabled]="readonly()"
          [_required]="!readonly()"
          (input)="onAddressChange($event, 'shipping', 'street')"
        ></kol-input-text>

        <kol-input-text
          [_label]="'City'"
          [_value]="formData().shippingAddress.city"
          [_readOnly]="readonly()"
          [_disabled]="readonly()"
          [_required]="!readonly()"
          (input)="onAddressChange($event, 'shipping', 'city')"
        ></kol-input-text>

        <kol-input-text
          [_label]="'ZIP Code'"
          [_value]="formData().shippingAddress.zipCode"
          [_readOnly]="readonly()"
          [_disabled]="readonly()"
          [_required]="!readonly()"
          (input)="onAddressChange($event, 'shipping', 'zipCode')"
        ></kol-input-text>
      </div>

      @if (showTerms()) {
        <div class="form-group">
          <h3>Terms of Service</h3>
          <kol-input-checkbox
            [_label]="'I accept the Terms of Service'"
            [_checked]="formData().acceptTerms"
            (input)="onTermsChange($event)"
          ></kol-input-checkbox>
        </div>
      }

      <div class="form-actions">
        @if (showBackButton()) {
          <kol-button
            [_label]="'Back'"
            [_variant]="'secondary'"
            (click)="back()"
          ></kol-button>
        }
        
        <kol-button
          [_label]="submitLabel()"
          [_variant]="'primary'"
          [_disabled]="showTerms() && !formData().acceptTerms"
          (click)="submit()"
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
export class FormDataComponent {
  private formService = inject(FormService);
  protected formData = this.formService.formData;

  // Inputs
  stepTitle = input('Step 1: Invoice & Shipping Information');
  readonly = input(false);
  showTerms = input(false);
  submitLabel = input('Next Step');
  showBackButton = input(false);

  // Outputs
  nextEvent = output<void>();
  backEvent = output<void>();
  submitEvent = output<FormData>();

  private updateFormData(updates: Partial<FormData>) {
    this.formService.updateFormData(updates);
  }

  protected onFieldChange(event: Event, field: 'firstName' | 'lastName') {
    const value = (event.target as any).value;
    this.updateFormData({ [field]: value });
  }

  protected onAddressChange(event: Event, addressType: 'invoice' | 'shipping', field: string) {
    const value = (event.target as any).value;
    const current = this.formData();
    const addressKey = addressType === 'invoice' ? 'invoiceAddress' : 'shippingAddress';
    
    this.updateFormData({
      [addressKey]: { ...current[addressKey], [field]: value }
    });
  }

  protected onTermsChange(event: Event) {
    const value = (event.target as any).checked;
    this.updateFormData({ acceptTerms: value });
  }

  protected submit = () => {
    if (this.readonly()) {
      const currentData = this.formData();
      if (currentData.acceptTerms) {
        this.submitEvent.emit(currentData);
      }
    } else {
      this.nextEvent.emit();
    }
  };

  protected back = () => {
    this.backEvent.emit();
  };
}
