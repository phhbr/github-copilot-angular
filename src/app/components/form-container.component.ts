import { Component, ChangeDetectionStrategy, inject, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormDataComponent } from './form-data.component';
import { FormService } from '../services/form.service';
import { FormData } from '../models/form.model';

@Component({
  selector: 'app-form-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FormDataComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="form-container">
      @if (!submitted()) {
        <app-form-data
          [stepTitle]="currentStep() === 1 ? 'Step 1: Invoice & Shipping Information' : 'Step 2: Review & Confirmation'"
          [readonly]="currentStep() === 2"
          [showTerms]="currentStep() === 2"
          [submitLabel]="currentStep() === 1 ? 'Next Step' : 'Submit'"
          [showBackButton]="currentStep() === 2"
          (nextEvent)="goToStep2()"
          (backEvent)="goToStep1()"
          (submitEvent)="onSubmit($event)"
        ></app-form-data>
      } @else {
        <div class="success-message">
          <h2>✓ Form Submitted Successfully!</h2>
          <p>Thank you for your submission. We have received your information:</p>
          
          <div class="submitted-data">
            <div class="data-section">
              <h3>Personal Information</h3>
              <div><strong>Name:</strong> {{ submittedData().firstName }} {{ submittedData().lastName }}</div>
            </div>

            <div class="data-section">
              <h3>Invoice Address</h3>
              <div>{{ submittedData().invoiceAddress.street }}</div>
              <div>{{ submittedData().invoiceAddress.city }}, {{ submittedData().invoiceAddress.zipCode }}</div>
            </div>

            <div class="data-section">
              <h3>Shipping Address</h3>
              <div>{{ submittedData().shippingAddress.street }}</div>
              <div>{{ submittedData().shippingAddress.city }}, {{ submittedData().shippingAddress.zipCode }}</div>
            </div>
          </div>
          
          <kol-button
            [_label]="'Start New Form'"
            [_variant]="'primary'"
            (click)="resetForm()"
          ></kol-button>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    }

    .form-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem 0;
    }

    .success-message {
      max-width: 600px;
      margin: 0 auto;
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    .success-message h2 {
      color: #4caf50;
      margin-bottom: 1rem;
      font-size: 1.8rem;
    }

    .success-message p {
      color: #666;
      margin-bottom: 2rem;
    }

    .submitted-data {
      text-align: left;
      padding: 1.5rem;
      background: #f5f5f5;
      border-radius: 4px;
      margin-bottom: 2rem;
    }

    .data-section {
      margin-bottom: 1.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #ddd;
    }

    .data-section:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }

    .data-section h3 {
      color: #333;
      margin-bottom: 0.5rem;
      font-size: 1rem;
    }

    .data-section p {
      margin: 0.25rem 0;
      color: #666;
    }

    kol-button {
      display: inline-block;
    }
  `]
})
export class FormContainerComponent {
  private formService = inject(FormService);

  protected currentStep = signal(1);
  protected submitted = signal(false);
  protected submittedData = signal<FormData>({
    firstName: '',
    lastName: '',
    invoiceAddress: { street: '', city: '', zipCode: '' },
    shippingAddress: { street: '', city: '', zipCode: '' },
    acceptTerms: false
  });

  protected goToStep2() {
    this.currentStep.set(2);
  }

  protected goToStep1() {
    this.currentStep.set(1);
  }

  protected onSubmit(data: FormData) {
    this.submittedData.set(data);
    this.submitted.set(true);
    console.log('Form submitted:', data);
  }

  protected resetForm = () => {
    this.formService.resetForm();
    this.currentStep.set(1);
    this.submitted.set(false);
  };
}
