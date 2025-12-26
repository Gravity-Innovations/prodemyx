interface RazorpayOptions {
  key: string;
  amount: string | number;
  currency: string;
  name: string;
  description?: string;
  image?: string;
  order_id: string;
  handler: (response: any) => void;
  prefill?: any;
  notes?: any;
  theme?: any;
}

interface Razorpay {
  open(): void;
}

interface Window {
  Razorpay: new (options: RazorpayOptions) => Razorpay;
}
