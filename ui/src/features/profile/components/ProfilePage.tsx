import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { useHomeData } from "../../home/hooks/useHomeData";
import { useProfileData } from "../hooks/useProfileData";
import { Loader, SectionSkeleton } from "../../../shared/components";
import { UI_MESSAGES } from "../../../shared/constants/config";
import { navigateTo } from "../../../shared/utils/navigation";
import { getWishListItems } from "../../wishlist/WishListStorage";
import { addProductToCart } from "../../cart/cartStorage";
import { ProfilePageOrder } from "../../../types/profile";

const TopNav = lazy(() => import("../../home/components/TopNav"));
const SiteFooter = lazy(() => import("../../home/components/SiteFooter"));

type ProfileView = "orders" | "wishlist" | "addresses" | "settings";
type OrderFilter = "all" | ProfilePageOrder["status"];

const statusClasses: Record<string, string> = {
  delivered: "bg-[#9ac8a1] text-white",
  processing: "bg-[#efbe67] text-white",
  shipped: "bg-[#efbe67] text-white",
  cancelled: "bg-[#b7bfdc] text-white",
  pending: "bg-[#c9d0ea] text-white",
};

const AUTH_TOKEN_KEYS = ["token", "authToken", "accessToken", "jwt"] as const;

const formatPrice = (amount: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);

const ProfilePage = () => {
  const { data: homeData, isLoading: isHomeLoading, isError: isHomeError } = useHomeData();
  const {
    data: profileData,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useProfileData();

  const [activeView, setActiveView] = useState<ProfileView>("orders");
  const [orderFilter, setOrderFilter] = useState<OrderFilter>("all");
  const [feedback, setFeedback] = useState<string | null>(null);

  const [address, setAddress] = useState({
    line1: "221B Baker Street",
    city: "London",
    state: "Greater London",
    postalCode: "NW1 6XE",
    country: "United Kingdom",
  });

  const [accountSettings, setAccountSettings] = useState({
    displayName: "",
    email: "",
  });

  const wishlistItems = useMemo(() => getWishListItems(), []);

  useEffect(() => {
    if (!profileData) {
      return;
    }

    setAccountSettings({
      displayName: profileData.user.name,
      email: profileData.user.email,
    });
  }, [profileData]);

  if (isHomeLoading || isProfileLoading) {
    return <Loader />;
  }

  if (isHomeError || isProfileError || !homeData || !profileData) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <h1 className="text-lg font-semibold text-red-900">{UI_MESSAGES.genericErrorTitle}</h1>
        <p className="mt-2 text-sm text-red-700">{UI_MESSAGES.genericErrorDescription}</p>
      </section>
    );
  }

  const filteredOrders =
    orderFilter === "all"
      ? profileData.orders
      : profileData.orders.filter((order) => order.status === orderFilter);

  const handleLogout = () => {
    for (const key of AUTH_TOKEN_KEYS) {
      window.localStorage.removeItem(key);
    }
    setFeedback("You have been logged out.");
    navigateTo("/");
  };

  const handleTrackOrder = (order: ProfilePageOrder) => {
    window.sessionStorage.setItem("app_selected_order_id", order.id);
    navigateTo(`/orders/${encodeURIComponent(String(order.id))}`);
  };

  const handleBuyAgain = (order: ProfilePageOrder) => {
    order.items.forEach((item) => {
      addProductToCart(
        {
          id: item.productId,
          name: item.name,
          description: item.name,
          imageUrl: item.thumbnail,
          price: item.price,
          currency: "USD",
        },
        item.quantity,
      );
    });

    setFeedback(`Added ${order.items.length} item(s) from Order #${order.orderNumber} to cart.`);
    navigateTo("/cart");
  };

  const saveAddress = () => {
    window.localStorage.setItem("app_profile_address", JSON.stringify(address));
    setFeedback("Address saved successfully.");
  };

  const saveAccountSettings = () => {
    window.localStorage.setItem("app_profile_settings", JSON.stringify(accountSettings));
    setFeedback("Account settings saved successfully.");
  };

  const renderOrders = () => (
    <section className="space-y-3">
      <div className="flex items-center justify-between rounded-xl border border-[#e0e5fa] bg-white px-5 py-3">
        <h1 className="text-lg font-semibold text-[#2a396c]">My orders</h1>
        <div className="inline-flex items-center gap-2 text-xs text-[#626d9b]">
          <label htmlFor="order-filter">Filter</label>
          <select
            className="rounded-md border border-[#d5dcf8] px-2 py-1 text-xs"
            id="order-filter"
            onChange={(event) => setOrderFilter(event.target.value as OrderFilter)}
            value={orderFilter}
          >
            <option value="all">All orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {filteredOrders.map((order) => (
        <article
          className="overflow-hidden rounded-xl border border-[#dce3fb] bg-white"
          key={order.id}
        >
          <header className="flex items-center justify-between border-b border-[#edf0fb] px-5 py-2.5">
            <h3 className="font-mono text-xs text-[#5f6b95]">#{order.orderNumber}</h3>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                statusClasses[order.status] ?? "bg-[#c9d0ea] text-white"
              }`}
            >
              {order.status[0].toUpperCase()}
              {order.status.slice(1)}
            </span>
          </header>

          <div className="space-y-0 px-5 py-2">
            {order.items.map((item, index) => (
              <div
                className="grid grid-cols-[40px_1fr_auto] items-center gap-3 border-b border-[#eef1fd] py-2.5 last:border-0"
                key={`${order.id}-${item.productId}-${index}`}
              >
                <img
                  alt={item.name}
                  className="h-10 w-10 rounded-md object-cover"
                  src={item.thumbnail}
                />
                <div>
                  <p className="text-sm font-medium text-[#2f3f74]">{item.name}</p>
                  {item.quantity > 1 ? <p className="text-xs text-[#7a84ae]">× {item.quantity}</p> : null}
                </div>
                <p className="text-sm text-[#46527f]">{formatPrice(item.price)}</p>
              </div>
            ))}
          </div>

          <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#edf1fd] px-5 py-3">
            <p className="text-xs text-[#616c99]">
              Total <span className="text-base font-semibold text-[#29376b]">{formatPrice(order.total)}</span>
            </p>
            <div className="flex items-center gap-2">
              <button
                className="rounded-md bg-[#4562c8] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#3a55b3]"
                onClick={() => handleTrackOrder(order)}
                type="button"
              >
                {order.status === "cancelled" ? "View details" : "Track order"}
              </button>
              <button
                className="rounded-md border border-[#dce3fb] px-3 py-1.5 text-xs font-semibold text-[#445184] hover:bg-[#f4f6ff]"
                onClick={() => handleBuyAgain(order)}
                type="button"
              >
                Buy again
              </button>
            </div>
          </footer>
        </article>
      ))}

      {filteredOrders.length === 0 ? (
        <section className="rounded-xl border border-[#dce3fb] bg-white p-6 text-center text-xs text-[#65709c]">
          No orders found for this filter.
        </section>
      ) : null}
    </section>
  );

  const renderWishlist = () => (
    <section className="rounded-xl border border-[#e0e5fa] bg-white p-5">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-[#2a396c]">Wishlist</h1>
        <span className="text-xs text-[#6f79a3]">{wishlistItems.length} saved</span>
      </div>
      <div className="mt-4 space-y-2">
        {wishlistItems.slice(0, 5).map((item) => (
          <div className="flex items-center justify-between rounded-lg border border-[#e7ebfb] px-3 py-2" key={item.id}>
            <div className="flex items-center gap-3">
              <img alt={item.name} className="h-9 w-9 rounded-md object-cover" src={item.imageUrl} />
              <div>
                <p className="text-sm font-medium text-[#2f3f74]">{item.name}</p>
                <p className="text-xs text-[#7a84ae]">{formatPrice(item.price, item.currency)}</p>
              </div>
            </div>
            <button
              className="rounded-md border border-[#c9d2f4] px-2.5 py-1 text-xs font-semibold text-[#2b3869] hover:border-indigo-400"
              onClick={() => navigateTo("/wishlist")}
              type="button"
            >
              Open
            </button>
          </div>
        ))}
      </div>
      <button
        className="mt-4 rounded-md bg-[#4562c8] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#3a55b3]"
        onClick={() => navigateTo("/wishlist")}
        type="button"
      >
        Manage wishlist
      </button>
    </section>
  );

  const renderAddresses = () => (
    <section className="rounded-xl border border-[#e0e5fa] bg-white p-5">
      <h1 className="text-lg font-semibold text-[#2a396c]">Addresses</h1>
      <p className="mt-0.5 text-xs text-[#6f79a3]">Default shipping address.</p>
      <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
        <input className="rounded-md border border-[#dce3fb] px-3 py-2 text-sm" onChange={(event) => setAddress((prev) => ({ ...prev, line1: event.target.value }))} placeholder="Address line" value={address.line1} />
        <input className="rounded-md border border-[#dce3fb] px-3 py-2 text-sm" onChange={(event) => setAddress((prev) => ({ ...prev, city: event.target.value }))} placeholder="City" value={address.city} />
        <input className="rounded-md border border-[#dce3fb] px-3 py-2 text-sm" onChange={(event) => setAddress((prev) => ({ ...prev, state: event.target.value }))} placeholder="State" value={address.state} />
        <input className="rounded-md border border-[#dce3fb] px-3 py-2 text-sm" onChange={(event) => setAddress((prev) => ({ ...prev, postalCode: event.target.value }))} placeholder="Postal code" value={address.postalCode} />
        <input className="rounded-md border border-[#dce3fb] px-3 py-2 text-sm sm:col-span-2" onChange={(event) => setAddress((prev) => ({ ...prev, country: event.target.value }))} placeholder="Country" value={address.country} />
      </div>
      <button
        className="mt-4 rounded-md bg-[#4562c8] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#3a55b3]"
        onClick={saveAddress}
        type="button"
      >
        Save address
      </button>
    </section>
  );

  const renderSettings = () => (
    <section className="rounded-xl border border-[#e0e5fa] bg-white p-5">
      <h1 className="text-lg font-semibold text-[#2a396c]">Account settings</h1>
      <p className="mt-0.5 text-xs text-[#6f79a3]">Display name and contact email.</p>
      <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
        <input className="rounded-md border border-[#dce3fb] px-3 py-2 text-sm" onChange={(event) => setAccountSettings((prev) => ({ ...prev, displayName: event.target.value }))} placeholder="Display name" value={accountSettings.displayName} />
        <input className="rounded-md border border-[#dce3fb] px-3 py-2 text-sm" onChange={(event) => setAccountSettings((prev) => ({ ...prev, email: event.target.value }))} placeholder="Email" type="email" value={accountSettings.email} />
      </div>
      <div className="mt-4 flex gap-2">
        <button
          className="rounded-md bg-[#4562c8] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#3a55b3]"
          onClick={saveAccountSettings}
          type="button"
        >
          Save settings
        </button>
        <button
          className="rounded-md border border-[#dce3fb] px-3 py-1.5 text-xs font-semibold text-[#445184] hover:bg-[#f4f6ff]"
          onClick={() => navigateTo("/profile")}
          type="button"
        >
          Refresh
        </button>
      </div>
    </section>
  );

  const navItems: { id: ProfileView | "logout"; label: string; danger?: boolean }[] = [
    { id: "orders", label: "My orders" },
    { id: "wishlist", label: "Wishlist" },
    { id: "addresses", label: "Addresses" },
    { id: "settings", label: "Account settings" },
    { id: "logout", label: "Logout", danger: true },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#e0e2f6,#cbcde8_45%,#d9daee_80%)]">
      {homeData.navigation ? (
        <Suspense fallback={<Loader />}>
          <TopNav data={homeData.navigation} />
        </Suspense>
      ) : null}

      <main className="px-6 py-8 sm:px-8 lg:px-12">
        <section className="grid gap-5 lg:grid-cols-[220px_1fr]">
          <aside className="h-fit rounded-xl border border-[#e0e5fa] bg-white p-4 shadow-sm">
            <div className="mx-auto h-16 w-16 overflow-hidden rounded-full border border-[#d8dff8]">
              <img
                alt={profileData.user.name}
                className="h-full w-full object-cover"
                src={profileData.user.avatarUrl}
              />
            </div>
            <h2 className="mt-3 text-center text-sm font-semibold text-[#2a396c]">{profileData.user.name}</h2>
            <p className="mt-0.5 text-center text-xs text-[#7a84ae]">{profileData.user.email}</p>
            <div className="mt-4 space-y-0.5 border-t border-[#e9edfb] pt-3">
              {navItems.map((item) => {
                const isActive = item.id !== "logout" && activeView === item.id;
                const onClick =
                  item.id === "logout" ? handleLogout : () => setActiveView(item.id as ProfileView);
                return (
                  <button
                    key={item.id}
                    onClick={onClick}
                    type="button"
                    className={`block w-full rounded-md px-3 py-2 text-left text-sm ${
                      isActive
                        ? "bg-[#dfe4ff] font-medium text-[#2e3d72]"
                        : item.danger
                          ? "text-[#d85c58] hover:bg-[#fdf3f2]"
                          : "text-[#5f6a97] hover:bg-[#f4f6ff]"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="space-y-3">
            {feedback ? (
              <div className="rounded-lg border border-[#dce3fb] bg-white px-3 py-2 text-xs text-[#546090]">
                {feedback}
              </div>
            ) : null}

            {activeView === "orders" ? renderOrders() : null}
            {activeView === "wishlist" ? renderWishlist() : null}
            {activeView === "addresses" ? renderAddresses() : null}
            {activeView === "settings" ? renderSettings() : null}
          </section>
        </section>
      </main>

      {homeData.footer ? (
        <Suspense fallback={<SectionSkeleton cards={1} />}>
          <SiteFooter data={homeData.footer} />
        </Suspense>
      ) : null}
    </div>
  );
};

export default ProfilePage;
