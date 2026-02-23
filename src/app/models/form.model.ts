export interface InvoiceAddress {
  street: string;
  city: string;
  zipCode: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  zipCode: string;
}

export interface FormData {
  firstName: string;
  lastName: string;
  invoiceAddress: InvoiceAddress;
  shippingAddress: ShippingAddress;
  acceptTerms: boolean;
}

export const emptyFormData: FormData = {
  firstName: '',
  lastName: '',
  invoiceAddress: {
    street: '',
    city: '',
    zipCode: ''
  },
  shippingAddress: {
    street: '',
    city: '',
    zipCode: ''
  },
  acceptTerms: false
};
