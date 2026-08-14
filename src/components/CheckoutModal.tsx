import React, { useState } from 'react';
import {
  X,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  Zap,
  Building2,
  Tag,
  ArrowRight,
  Receipt,
  FileText,
  AlertCircle
} from 'lucide-react';
import { Invoice } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: {
    name: 'Starter' | 'Pro' | 'Enterprise Tier';
    monthlyPrice: number;
    annualPrice: number;
  };
  initialSeats?: number;
  initialBillingCycle?: 'monthly' | 'annually';
  onPaymentSuccess: (planName: 'Starter' | 'Pro' | 'Enterprise Tier', invoice: Invoice, seats: number) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  selectedPlan,
  initialSeats = 16,
  initialBillingCycle = 'annually',
  onPaymentSuccess
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>(initialBillingCycle);
  const [seats, setSeats] = useState<number>(initialSeats);
  const [paymentType, setPaymentType] = useState<'card' | 'wallet' | 'invoice'>('card');

  // Card form state
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExp, setCardExp] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [cardName, setCardName] = useState('Aniket Vadhiya');
  const [zipCode, setZipCode] = useState('94105');
  const [country, setCountry] = useState('United States');

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponMsg, setCouponMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Submission state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [completedInvoice, setCompletedInvoice] = useState<Invoice | null>(null);

  if (!isOpen) return null;

  const unitPrice = billingCycle === 'annually' ? selectedPlan.annualPrice : selectedPlan.monthlyPrice;
  const subtotal = unitPrice * seats * (billingCycle === 'annually' ? 12 : 1);
  const discountAmount = Math.round(subtotal * appliedDiscount);
  const taxableAmount = subtotal - discountAmount;
  const estimatedTax = Math.round(taxableAmount * 0.05); // 5% simulated enterprise tax
  const totalAmount = taxableAmount + estimatedTax;

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === 'NEXUS20' || code === 'LAUNCH20') {
      setAppliedDiscount(0.20);
      setCouponMsg({ type: 'success', text: 'Coupon applied! 20% enterprise discount added.' });
    } else if (code === 'PROMO10' || code === 'SAVE10') {
      setAppliedDiscount(0.10);
      setCouponMsg({ type: 'success', text: 'Coupon applied! 10% discount added.' });
    } else {
      setAppliedDiscount(0);
      setCouponMsg({ type: 'error', text: 'Invalid promotional code. Try NEXUS20' });
    }
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setProcessingStep('Validating secure credential gateway...');

    setTimeout(() => {
      setProcessingStep('Authorizing 256-bit TLS encrypted transaction...');
    }, 600);

    setTimeout(() => {
      setProcessingStep('Provisioning multi-tenant capacity & generating invoice...');
    }, 1200);

    setTimeout(() => {
      const newInvoice: Invoice = {
        id: `inv_${Date.now()}`,
        invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString().split('T')[0],
        amount: totalAmount,
        currency: 'USD',
        status: 'PAID',
        planName: selectedPlan.name,
        seats: seats,
        pdfDownloadUrl: '#'
      };

      setIsProcessing(false);
      setCompletedInvoice(newInvoice);
      onPaymentSuccess(selectedPlan.name, newInvoice, seats);
    }, 1800);
  };

  const formatCardNumber = (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 16);
    const parts = clean.match(/.{1,4}/g);
    return parts ? parts.join(' ') : clean;
  };

  const formatCardExp = (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 4);
    if (clean.length >= 3) {
      return `${clean.slice(0, 2)}/${clean.slice(2, 4)}`;
    }
    return clean;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>Enterprise Subscription Checkout</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold border border-emerald-200 dark:border-emerald-800">
                  {selectedPlan.name}
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Secure PCI-DSS compliant payment processing & automated tenant licensing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1">
          {completedInvoice ? (
            /* Success State */
            <div className="py-8 text-center space-y-5 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-50 dark:ring-emerald-950/30">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Payment Authorized & Confirmed!</h3>
                <p className="text-xs text-slate-500">
                  Your workspace has been upgraded to <strong className="text-slate-900 dark:text-white">{selectedPlan.name}</strong> for {seats} team seats.
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-left space-y-2.5 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 font-bold text-slate-900 dark:text-white">
                  <span>Invoice Number:</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">{completedInvoice.invoiceNumber}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>Billing Period:</span>
                  <span className="font-semibold capitalize">{billingCycle}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>Seats Licensed:</span>
                  <span className="font-semibold">{seats} Active Seats</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>Payment Method:</span>
                  <span className="font-semibold">Visa ending in •••• 4242</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-sm font-black text-slate-900 dark:text-white">
                  <span>Total Paid:</span>
                  <span className="text-emerald-600 dark:text-emerald-400">${totalAmount.toLocaleString()} USD</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const textContent = `NEXUS WORKSPACE INVOICE\n--------------------------------\nInvoice: ${completedInvoice.invoiceNumber}\nDate: ${completedInvoice.date}\nPlan: ${completedInvoice.planName}\nSeats: ${completedInvoice.seats}\nTotal: $${completedInvoice.amount} USD\nStatus: PAID (Approved)\n\nThank you for choosing Nexus OS!`;
                    const blob = new Blob([textContent], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${completedInvoice.invoiceNumber}.txt`;
                    a.click();
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Receipt className="w-4 h-4" />
                  <span>Download Receipt</span>
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Return to Workspace
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Left Column: Payment Credentials Form */}
              <div className="md:col-span-7 space-y-4">
                
                {/* Billing Frequency Selector */}
                <div className="p-1 rounded-xl bg-slate-100 dark:bg-slate-950 flex items-center text-xs font-bold border border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setBillingCycle('monthly')}
                    className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                      billingCycle === 'monthly'
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Monthly Billing (${selectedPlan.monthlyPrice}/seat)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle('annually')}
                    className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      billingCycle === 'annually'
                        ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>Annual Billing (${selectedPlan.annualPrice}/seat)</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-black">
                      Save 20%
                    </span>
                  </button>
                </div>

                {/* Seat Counter Control */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Workspace Team Seats</div>
                    <div className="text-[11px] text-slate-500">Scale your seat licenses as your engineering team grows</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSeats(Math.max(1, seats - 1))}
                      className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center hover:bg-slate-100 cursor-pointer text-sm"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-black text-slate-900 dark:text-white">{seats}</span>
                    <button
                      type="button"
                      onClick={() => setSeats(seats + 1)}
                      className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center hover:bg-slate-100 cursor-pointer text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Payment Method Selector Tabs */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Payment Option</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentType('card')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                        paymentType === 'card'
                          ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Credit Card</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentType('wallet')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                        paymentType === 'wallet'
                          ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <span>⚡ Digital Wallet</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentType('invoice')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                        paymentType === 'invoice'
                          ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Wire / Net 30</span>
                    </button>
                  </div>
                </div>

                {/* Card Fields */}
                {paymentType === 'card' && (
                  <form onSubmit={handleProcessPayment} className="space-y-3 pt-1">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">Card Number</label>
                      <div className="relative">
                        <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          id="input-card-number"
                          type="text"
                          required
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          placeholder="4242 4242 4242 4242"
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">Expiration</label>
                        <input
                          id="input-card-exp"
                          type="text"
                          required
                          value={cardExp}
                          onChange={(e) => setCardExp(formatCardExp(e.target.value))}
                          placeholder="MM/YY"
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">Security CVC</label>
                        <div className="relative">
                          <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                          <input
                            id="input-card-cvc"
                            type="password"
                            required
                            maxLength={4}
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            placeholder="CVC"
                            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">Cardholder Name</label>
                        <input
                          id="input-card-name"
                          type="text"
                          required
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="Aniket Vadhiya"
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">ZIP / Postal Code</label>
                        <input
                          id="input-card-zip"
                          type="text"
                          required
                          value={zipCode}
                          onChange={(e) => setZipCode(e.target.value)}
                          placeholder="94105"
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </form>
                )}

                {paymentType === 'wallet' && (
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center space-y-3">
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      Use your Apple Pay, Google Pay, or browser digital credential wallet for 1-click authorization.
                    </div>
                    <button
                      type="button"
                      onClick={handleProcessPayment}
                      className="w-full py-3 px-4 rounded-xl bg-black text-white text-xs font-bold hover:bg-slate-900 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <span>Pay with Apple Pay / GPay</span>
                    </button>
                  </div>
                )}

                {paymentType === 'invoice' && (
                  <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs space-y-2">
                    <div className="font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span>Corporate Invoice & Net 30 Terms</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                      We will issue an official electronic corporate invoice payable within 30 days via ACH or international wire transfer.
                    </p>
                  </div>
                )}

              </div>

              {/* Right Column: Order Summary & Coupon */}
              <div className="md:col-span-5 space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Order Summary
                  </div>

                  <div className="space-y-2 text-xs divide-y divide-slate-200/80 dark:divide-slate-800">
                    <div className="space-y-1.5 pb-2">
                      <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                        <span>{selectedPlan.name} Plan</span>
                        <span>${subtotal.toLocaleString()}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {seats} seats × ${unitPrice}/mo {billingCycle === 'annually' ? '× 12 mos' : ''}
                      </div>
                    </div>

                    {appliedDiscount > 0 && (
                      <div className="flex items-center justify-between pt-2 text-emerald-600 dark:text-emerald-400 font-bold">
                        <span>Discount ({appliedDiscount * 100}%)</span>
                        <span>-${discountAmount.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 text-slate-600 dark:text-slate-400">
                      <span>Estimated Taxes (5%)</span>
                      <span>${estimatedTax.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 text-sm font-black text-slate-900 dark:text-white">
                      <span>Total Due Today</span>
                      <span className="text-indigo-600 dark:text-indigo-400">${totalAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Promo Code Input */}
                  <div className="pt-2">
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Promotional Coupon
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        id="input-coupon"
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="e.g. NEXUS20"
                        className="flex-1 px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono uppercase focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                    {couponMsg && (
                      <div
                        className={`text-[11px] mt-1 font-semibold ${
                          couponMsg.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {couponMsg.text}
                      </div>
                    )}
                  </div>
                </div>

                {/* Guarantee Note */}
                <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-[11px]">30-Day Money Back Guarantee & 99.99% SLA Uptime</span>
                </div>

                {/* Primary Authorization Button */}
                <button
                  id="btn-confirm-payment"
                  type="button"
                  onClick={handleProcessPayment}
                  disabled={isProcessing}
                  className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white text-xs font-black shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{processingStep}</span>
                    </div>
                  ) : (
                    <>
                      <span>Pay ${totalAmount.toLocaleString()} & Activate Plan</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
