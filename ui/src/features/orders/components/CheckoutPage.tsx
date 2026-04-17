import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Loader, SectionSkeleton } from "../../../shared/components";
import { APP_CONFIG, UI_MESSAGES } from "../../../shared/constants/config";
import { navigateTo } from "../../../shared/utils/navigation";
import {
  CART_UPDATED_EVENT,
  CartItem,
  clearCart,
  getCartItems,
} from "../../cart/cartStorage";
import {
  buildCheckoutSessionItems,
  processCheckout,
  saveCheckoutSession,
} from "../services/checkoutService";
import { useHomeData } from "../../home/hooks/useHomeData";

const TopNav = lazy(() => import("../../home/components/TopNav"));
const SiteFooter = lazy(() => import("../../home/components/SiteFooter"));

type PaymentMethod = "card" | "upi" | "paypal";

interface CheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  postalCode: string;
  paymentMethod: PaymentMethod;
  cardholder: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
}

const initialForm: CheckoutForm = {
  firstName: "Alex",
  lastName: "J",
  email: "youremail.com",
  phone: "United States",
  city: "",
  postalCode: "",
  paymentMethod: "card",
  cardholder: "Alex J",
  cardNumber: "1234 5678 9123 0000",
  expiry: "12/30",
  cvc: "123",
};

const paymentMethodLabels: Record<PaymentMethod, string> = {
  card: "Credit Card",
  upi: "UPI",
  paypal: "PayPal",
};

const formatPrice = (amount: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);

const CheckoutPage = () => {
  const { data, isLoading, isError } = useHomeData();
  const [items, setItems] = useState<CartItem[]>(() => getCartItems());
  const [form, setForm] = useState<CheckoutForm>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    const syncItems = () => {
      setItems(getCartItems());
    };

    window.addEventListener(CART_UPDATED_EVENT, syncItems);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, syncItems);
    };
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );
  const shipping = items.length > 0 ? 5 : 0;
  const discount = subtotal > 150 ? subtotal * 0.1 : 0;
  const total = subtotal + shipping - discount;
  const currency = items[0]?.currency ?? APP_CONFIG.defaultCurrency;

  const handleInputChange = (field: keyof CheckoutForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleConfirmOrder = async () => {
    if (items.length === 0) {
      setCheckoutError("Cart is empty. Add items before confirming order.");
      return;
    }

    setIsSubmitting(true);
    setCheckoutError(null);
    setCheckoutMessage(null);

    try {
      const result = await processCheckout();

      saveCheckoutSession({
        orderId: result.orderId,
        transactionId: result.transactionId,
        usedApi: result.usedApi,
        fallbackReason: result.fallbackReason,
        paymentMethod: paymentMethodLabels[form.paymentMethod],
        total,
        shipping,
        discount,
        subtotal,
        currency,
        customerName: `${form.firstName} ${form.lastName}`.trim(),
        items: buildCheckoutSessionItems(items),
      });

      clearCart();
      if (result.fallbackReason) {
        setCheckoutMessage(result.fallbackReason);
      }

      navigateTo("/order-success");
    } catch {
      setCheckoutError("Unable to process checkout right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError || !data) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <h1 className="text-lg font-semibold text-red-900">{UI_MESSAGES.genericErrorTitle}</h1>
        <p className="mt-2 text-sm text-red-700">{UI_MESSAGES.genericErrorDescription}</p>
      </section>
    );
  }

  return (
    <div className={`mx-auto w-full ${APP_CONFIG.maxContainerWidthClass} px-4 sm:px-6 lg:px-8`}>
      <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_25px_80px_rgba(48,61,118,0.25)]">
        {data.navigation ? (
          <Suspense fallback={<Loader />}>
            <TopNav data={data.navigation} />
          </Suspense>
        ) : null}

        <div className="border-y border-[#eceffd] bg-[#f5f6fe] px-6 py-4 text-sm text-[#6a75a1]">
          <p>
            Home <span className="mx-2">&gt;</span>
            <span className="font-medium text-[#253267]">Checkout</span>
          </p>
        </div>

        <main className="bg-[radial-gradient(circle_at_top,#eceefe,#dde1fa_55%,#e8eafd)] p-6 md:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
            <section className="space-y-5 rounded-3xl border border-[#dfe5fa] bg-white/90 p-5 md:p-6">
              <header className="border-b border-[#e8ecfc] pb-4">
                <h1 className="text-3xl font-semibold text-[#263366]">Shipping Address</h1>
              </header>

              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm text-[#4f5a85]">
                    First Name
                    <input
                      className="mt-1 h-12 w-full rounded-xl border border-[#dce2fa] bg-[#f9faff] px-4 text-[#2a3768] outline-none"
                      onChange={(event) => handleInputChange("firstName", event.target.value)}
                      value={form.firstName}
                    />
                  </label>
                  <label className="text-sm text-[#4f5a85]">
                    Last Name
                    <input
                      className="mt-1 h-12 w-full rounded-xl border border-[#dce2fa] bg-[#f9faff] px-4 text-[#2a3768] outline-none"
                      onChange={(event) => handleInputChange("lastName", event.target.value)}
                      value={form.lastName}
                    />
                  </label>
                </div>

                <label className="text-sm text-[#4f5a85]">
                  Email Address
                  <input
                    className="mt-1 h-12 w-full rounded-xl border border-[#dce2fa] bg-[#f9faff] px-4 text-[#2a3768] outline-none"
                    onChange={(event) => handleInputChange("email", event.target.value)}
                    type="email"
                    value={form.email}
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm text-[#4f5a85]">
                    Phone Number
                    <input
                      className="mt-1 h-12 w-full rounded-xl border border-[#dce2fa] bg-[#f9faff] px-4 text-[#2a3768] outline-none"
                      onChange={(event) => handleInputChange("phone", event.target.value)}
                      value={form.phone}
                    />
                  </label>
                  <label className="text-sm text-[#4f5a85]">
                    City / Postal
                    <input
                      className="mt-1 h-12 w-full rounded-xl border border-[#dce2fa] bg-[#f9faff] px-4 text-[#2a3768] outline-none"
                      onChange={(event) => handleInputChange("city", event.target.value)}
                      placeholder="City"
                      value={form.city}
                    />
                  </label>
                </div>

                <label className="text-sm text-[#4f5a85]">
                  Postal Code
                  <input
                    className="mt-1 h-12 w-full rounded-xl border border-[#dce2fa] bg-[#f9faff] px-4 text-[#2a3768] outline-none"
                    onChange={(event) => handleInputChange("postalCode", event.target.value)}
                    value={form.postalCode}
                  />
                </label>
              </div>

              <section className="rounded-2xl border border-[#dce2fa] bg-[linear-gradient(135deg,#edf1ff,#e5e9fd)] p-4">
                <h2 className="text-2xl font-semibold text-[#273466]">Payment Method</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(Object.keys(paymentMethodLabels) as PaymentMethod[]).map((method) => (
                    <button
                      className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                        form.paymentMethod === method
                          ? "border-[#3f59bc] bg-[#405dbf] text-white"
                          : "border-[#cfd8f6] bg-white text-[#4f5b88]"
                      }`}
                      key={method}
                      onClick={() => handleInputChange("paymentMethod", method)}
                      type="button"
                    >
                      {paymentMethodLabels[method]}
                    </button>
                  ))}
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <input
                    className="h-12 rounded-xl border border-[#dce2fa] bg-white px-4 text-[#2a3768] outline-none sm:col-span-2"
                    onChange={(event) => handleInputChange("cardholder", event.target.value)}
                    placeholder="Cardholder Name"
                    value={form.cardholder}
                  />
                  <input
                    className="h-12 rounded-xl border border-[#dce2fa] bg-white px-4 text-[#2a3768] outline-none"
                    onChange={(event) => handleInputChange("cardNumber", event.target.value)}
                    placeholder="1234 5678 9123 0000"
                    value={form.cardNumber}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      className="h-12 rounded-xl border border-[#dce2fa] bg-white px-4 text-[#2a3768] outline-none"
                      onChange={(event) => handleInputChange("expiry", event.target.value)}
                      placeholder="MM/YY"
                      value={form.expiry}
                    />
                    <input
                      className="h-12 rounded-xl border border-[#dce2fa] bg-white px-4 text-[#2a3768] outline-none"
                      onChange={(event) => handleInputChange("cvc", event.target.value)}
                      placeholder="CVC"
                      value={form.cvc}
                    />
                  </div>
                </div>
              </section>

              {checkoutMessage ? (
                <p className="rounded-xl border border-[#f5d79d] bg-[#fff4dc] px-4 py-3 text-sm text-[#7e5f1e]">
                  {checkoutMessage}
                </p>
              ) : null}

              {checkoutError ? (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {checkoutError}
                </p>
              ) : null}
            </section>

            <aside className="h-fit rounded-3xl border border-[#dfe5fa] bg-white/95 p-5">
              <h2 className="text-3xl font-semibold text-[#263366]">Order Summary</h2>
              <div className="mt-4 space-y-3">
                {items.map((item) => (
                  <article
                    className="grid grid-cols-[56px_1fr_auto] items-center gap-3 border-b border-[#edf1fd] pb-3"
                    key={item.id}
                  >
                    <img
                      alt={item.name}
                      className="h-14 w-14 rounded-lg object-cover"
                      src={item.imageUrl}
                    />
                    <div>
                      <p className="text-base font-medium text-[#2d3a6b]">{item.name}</p>
                      <p className="text-sm text-[#7a85ad]">x {item.quantity}</p>
                    </div>
                    <p className="text-lg font-semibold text-[#2f3d70]">
                      {formatPrice(item.price * item.quantity, item.currency)}
                    </p>
                  </article>
                ))}
              </div>

              <div className="mt-5 space-y-2 text-[#56618d]">
                <p className="flex items-center justify-between text-lg">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal, currency)}</span>
                </p>
                <p className="flex items-center justify-between text-lg">
                  <span>Shipping</span>
                  <span>{formatPrice(shipping, currency)}</span>
                </p>
                <p className="flex items-center justify-between text-lg text-[#ee6b5b]">
                  <span>Discount</span>
                  <span>- {formatPrice(discount, currency)}</span>
                </p>
                <p className="flex items-center justify-between border-t border-[#e9edfc] pt-3 text-3xl font-semibold text-[#263366]">
                  <span>Total</span>
                  <span>{formatPrice(total, currency)}</span>
                </p>
              </div>

              <button
                className="mt-5 h-14 w-full rounded-xl bg-gradient-to-r from-[#f5796f] to-[#ef6657] text-2xl font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isSubmitting || items.length === 0}
                onClick={handleConfirmOrder}
                type="button"
              >
                {isSubmitting ? "Processing..." : "Confirm Order"}
              </button>
            </aside>
          </div>
        </main>

        {data.footer ? (
          <Suspense fallback={<SectionSkeleton cards={1} />}>
            <SiteFooter data={data.footer} />
          </Suspense>
        ) : null}
      </div>
    </div>
  );
};

export default CheckoutPage;
