import React, { useState } from 'react';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Building2,
  Plus,
  Receipt,
  Download,
  Calendar,
  Users,
  AlertCircle,
  Sparkles,
  Zap,
  ArrowUpRight,
  ChevronRight,
  FileText,
  Clock,
  Trash2
} from 'lucide-react';
import { Organization, User, Invoice, PaymentMethod } from '../types';
import { CheckoutModal } from './CheckoutModal';

interface BillingPaymentViewProps {
  org: Organization;
  members: User[];
  invoices: Invoice[];
  paymentMethods: PaymentMethod[];
  onPlanUpdated: (newPlan: 'Starter' | 'Pro' | 'Enterprise Tier', invoice: Invoice, newSeats: number) => void;
  onAddPaymentMethod: (pm: PaymentMethod) => void;
}

export const BillingPaymentView: React.FC<BillingPaymentViewProps> = ({
  org,
  members,
  invoices,
  paymentMethods,
  onPlanUpdated,
  onAddPaymentMethod
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('annually');
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<{
    name: 'Starter' | 'Pro' | 'Enterprise Tier';
    monthlyPrice: number;
    annualPrice: number;
  } | null>(null);

  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardExp, setNewCardExp] = useState('');
  const [newCardCvc, setNewCardCvc] = useState('');
  const [billingEmail, setBillingEmail] = useState(org.billingEmail || 'billing@acme.inc');
  const [taxId, setTaxId] = useState('US-TAX-89421098');
  const [isSavedFeedback, setIsSavedFeedback] = useState(false);

  const currentSeats = org.seatsCount || 16;
  const activeMembersCount = members.length;

  const plans = [
    {
      id: 'starter',
      name: 'Starter' as const,
      tagline: 'Essential agile tracking for small engineering squads',
      monthlyPrice: 0,
      annualPrice: 0,
      features: [
        'Up to 3 team members',
        'Basic Agile Kanban sprint board',
        'Standard task backlog & tags',
        'Wiki markdown editor (up to 20 docs)',
        'Community support'
      ],
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro' as const,
      tagline: 'Advanced workload telemetry & sprint automation for fast-growing teams',
      monthlyPrice: 29,
      annualPrice: 24,
      features: [
        'Unlimited team members & projects',
        'Workload & risk telemetry engine',
        '1-Click automated capacity rebalancing',
        'Unlimited meeting notes & task extraction',
        'Integrated team chat & channels',
        'Audit logs (30-day retention)',
        'Priority email support'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise Tier' as const,
      tagline: 'Mission-critical enterprise security, dedicated instances & full governance',
      monthlyPrice: 79,
      annualPrice: 64,
      features: [
        'Everything in Pro included',
        'Row-level tenant isolation & sandboxing',
        'Custom RBAC & SAML 2.0 / Okta SSO',
        'Immutable audit trails (unlimited retention)',
        '99.99% SLA uptime guarantee',
        'Dedicated Solutions Architect & 24/7 phone support',
        'Custom Master Service Agreement & Net 30 invoicing'
      ],
      popular: false
    }
  ];

  const handleDownloadInvoice = (inv: Invoice) => {
    const textContent = `NEXUS WORKSPACE INVOICE RECEIPT\n================================================\nInvoice ID:       ${inv.invoiceNumber}\nDate Issued:      ${inv.date}\nOrganization:     ${org.name} (${org.slug})\nPlan Subscribed:  ${inv.planName}\nSeats Allocated:  ${inv.seats}\nTotal Amount:     $${inv.amount.toLocaleString()} ${inv.currency}\nPayment Status:   ${inv.status}\n================================================\nThank you for trusting Nexus OS for your engineering operations.\nNexus OS Technologies Inc. • 100 Montgomery St, San Francisco, CA`;
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${inv.invoiceNumber}-receipt.txt`;
    a.click();
  };

  const handleSaveBillingDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavedFeedback(true);
    setTimeout(() => setIsSavedFeedback(false), 2500);
  };

  const handleAddCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardNumber.trim()) return;

    const newPm: PaymentMethod = {
      id: `pm_${Date.now()}`,
      type: 'CARD',
      brand: newCardNumber.startsWith('5') ? 'Mastercard' : 'Visa',
      last4: newCardNumber.slice(-4) || '1234',
      expMonth: newCardExp.slice(0, 2) || '12',
      expYear: newCardExp.slice(3, 5) || '28',
      isDefault: false
    };

    onAddPaymentMethod(newPm);
    setIsAddCardOpen(false);
    setNewCardNumber('');
    setNewCardExp('');
    setNewCardCvc('');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Enterprise Billing & Subscription Management
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage organization plan tiers, licensed seats, payment gateways, and tax invoices
            </p>
          </div>
        </div>

        {/* Billing Cycle Switcher */}
        <div className="p-1 rounded-xl bg-slate-200/80 dark:bg-slate-900 flex items-center text-xs font-bold border border-slate-300/80 dark:border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              billingCycle === 'monthly'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('annually')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              billingCycle === 'annually'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>Annually</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Active Subscription Overview Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-7 space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-500/30 text-indigo-300 border border-indigo-400/40 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-current" />
                <span>Active Subscription</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                {org.plan}
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-black tracking-tight">{org.name}</h2>
              <p className="text-xs text-slate-300 mt-1">
                Next renewal: <strong className="text-white">{org.renewalDate || 'September 1, 2026'}</strong> via Visa ending in 4242
              </p>
            </div>

            {/* Seat utilization meter */}
            <div className="space-y-1.5 pt-2 max-w-md">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-300">Seat Utilization:</span>
                <span className="text-white">{activeMembersCount} of {currentSeats} Licensed Seats Active</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full"
                  style={{ width: `${Math.min(100, (activeMembersCount / currentSeats) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-5 flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
            <div className="text-left md:text-right">
              <div className="text-xs text-slate-400 font-medium">Estimated Monthly Spend</div>
              <div className="text-3xl font-black text-white">
                ${(org.plan === 'Enterprise Tier' ? 64 : org.plan === 'Pro' ? 24 : 0) * currentSeats}
                <span className="text-xs text-slate-400 font-normal"> /mo</span>
              </div>
              <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                Billed annually (20% enterprise discount active)
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const targetPlan = plans.find((p) => p.name === org.plan) || plans[2];
                  setSelectedPlanForCheckout({
                    name: targetPlan.name,
                    monthlyPrice: targetPlan.monthlyPrice,
                    annualPrice: targetPlan.annualPrice
                  });
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Add Seats / Renew</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing & Plan Tiers Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-600" />
            Available Subscription Tiers
          </h2>
          <span className="text-xs text-slate-500">Switch or upgrade anytime with prorated billing</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isCurrent = org.plan === plan.name;
            const price = billingCycle === 'annually' ? plan.annualPrice : plan.monthlyPrice;

            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-6 flex flex-col justify-between transition-all relative ${
                  plan.popular
                    ? 'bg-white dark:bg-slate-900 border-2 border-indigo-500 shadow-xl'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                    Most Popular for Teams
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">{plan.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{plan.tagline}</p>
                    </div>
                    {isCurrent && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        Current Plan
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-1 pt-2">
                    <span className="text-3xl font-black text-slate-900 dark:text-white">${price}</span>
                    <span className="text-xs text-slate-500">/ seat / month</span>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2.5">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Included Capabilities:
                    </div>
                    <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6">
                  {isCurrent ? (
                    <button
                      disabled
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold cursor-default"
                    >
                      Active on Workspace
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        setSelectedPlanForCheckout({
                          name: plan.name,
                          monthlyPrice: plan.monthlyPrice,
                          annualPrice: plan.annualPrice
                        })
                      }
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        plan.popular
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
                          : 'bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white'
                      }`}
                    >
                      <span>{price === 0 ? 'Downgrade to Starter' : `Select ${plan.name}`}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid: Payment Methods & Billing Information */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Saved Payment Gateways */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-indigo-500" />
              Saved Payment Methods
            </h2>
            <button
              onClick={() => setIsAddCardOpen(true)}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Card</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {paymentMethods.map((pm) => (
              <div
                key={pm.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-7 rounded-lg bg-slate-900 text-white text-[10px] font-black flex items-center justify-center">
                    {pm.brand}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>•••• •••• •••• {pm.last4}</span>
                      {pm.isDefault && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500">Expires {pm.expMonth}/{pm.expYear}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 font-mono">TLS 256-Bit</span>
                </div>
              </div>
            ))}
          </div>

          {/* Add Card Inline Dialog */}
          {isAddCardOpen && (
            <form onSubmit={handleAddCardSubmit} className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 space-y-3">
              <div className="text-xs font-bold text-indigo-950 dark:text-indigo-200">
                Add New Corporate Credit Card
              </div>
              <div className="space-y-2">
                <input
                  type="text"
                  required
                  placeholder="Card Number (4242 4242 4242 4242)"
                  value={newCardNumber}
                  onChange={(e) => setNewCardNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono focus:outline-none focus:border-indigo-500"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="MM/YY"
                    value={newCardExp}
                    onChange={(e) => setNewCardExp(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono focus:outline-none focus:border-indigo-500"
                  />
                  <input
                    type="password"
                    required
                    maxLength={4}
                    placeholder="CVC"
                    value={newCardCvc}
                    onChange={(e) => setNewCardCvc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddCardOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 cursor-pointer"
                >
                  Save Card
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Column: Billing Contact & Tax Preferences */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-500" />
              Tax & Invoicing Details
            </h2>
            <span className="text-xs text-slate-400">Net 30 & PDF invoices</span>
          </div>

          <form onSubmit={handleSaveBillingDetails} className="space-y-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Billing Recipient Email
              </label>
              <input
                type="email"
                required
                value={billingEmail}
                onChange={(e) => setBillingEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  VAT / Tax ID
                </label>
                <input
                  type="text"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Billing Currency
                </label>
                <select className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500">
                  <option value="USD">USD ($ - US Dollar)</option>
                  <option value="EUR">EUR (€ - Euro)</option>
                  <option value="GBP">GBP (£ - British Pound)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-500">Automated PDF delivery on payment</span>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold cursor-pointer transition-all"
              >
                {isSavedFeedback ? 'Saved Successfully!' : 'Save Preferences'}
              </button>
            </div>
          </form>
        </div>

      </div>

      {/* Invoices & Billing History Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Receipt className="w-4 h-4 text-indigo-500" />
            Invoices & Payment History
          </h2>
          <span className="text-xs text-slate-400">{invoices.length} historical invoices</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                <th className="pb-2">Invoice #</th>
                <th className="pb-2">Date</th>
                <th className="pb-2">Plan</th>
                <th className="pb-2">Seats</th>
                <th className="pb-2">Amount</th>
                <th className="pb-2">Status</th>
                <th className="pb-2 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {inv.invoiceNumber}
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-300">{inv.date}</td>
                  <td className="py-3 font-medium text-slate-900 dark:text-white">{inv.planName}</td>
                  <td className="py-3 text-slate-600 dark:text-slate-400">{inv.seats} seats</td>
                  <td className="py-3 font-bold text-slate-900 dark:text-white">
                    ${inv.amount.toLocaleString()} {inv.currency}
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => handleDownloadInvoice(inv)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-300 hover:text-indigo-600 text-[11px] font-bold transition-all inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Checkout Modal */}
      {selectedPlanForCheckout && (
        <CheckoutModal
          isOpen={true}
          onClose={() => setSelectedPlanForCheckout(null)}
          selectedPlan={selectedPlanForCheckout}
          initialSeats={currentSeats}
          initialBillingCycle={billingCycle}
          onPaymentSuccess={(planName, invoice, newSeats) => {
            onPlanUpdated(planName, invoice, newSeats);
            setSelectedPlanForCheckout(null);
          }}
        />
      )}

    </div>
  );
};
