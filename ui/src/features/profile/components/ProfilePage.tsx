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
    <section className="space-y-4">
      <div className="rounded-2xl border border-[#e0e5fa] bg-white p-6">
        <h1 className="text-4xl font-semibold text-[#2a396c]">My Orders</h1>
        <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[#dbe1f9] px-4 py-2 text-[#626d9b]">
          <label className="text-sm" htmlFor="order-filter">Filter</label>
          <select
            className="rounded-md border border-[#d5dcf8] px-2 py-1 text-sm"
            id="order-filter"
            onChange={(event) => setOrderFilter(event.target.value as OrderFilter)}
            value={orderFilter}
          >
            <option value="all">All Orders</option>
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
          className="overflow-hidden rounded-2xl border border-[#dce3fb] bg-white shadow-sm"
          key={order.id}
        >
          <header className="flex items-center justify-between bg-gradient-to-r from-[#edf0ff] to-[#f7f8ff] px-5 py-3">
            <h3 className="text-2xl font-semibold text-[#2c3b70]">Order #{order.orderNumber}</h3>
            <span
              className={`rounded-full px-4 py-1 text-sm font-semibold ${
                statusClasses[order.status] ?? "bg-[#c9d0ea] text-white"
              }`}
            >
              {order.status[0].toUpperCase()}
              {order.status.slice(1)}
            </span>
          </header>

          <div className="space-y-3 px-5 py-4">
            {order.items.map((item, index) => (
              <div
                className="grid grid-cols-[56px_1fr_auto] items-center gap-3 border-b border-[#eef1fd] pb-3 last:border-0 last:pb-0"
                key={`${order.id}-${item.productId}-${index}`}
              >
                <img
                  alt={item.name}
                  className="h-14 w-14 rounded-lg object-cover"
                  src={item.thumbnail}
                />
                <div>
                  <p className="text-xl font-medium text-[#2f3f74]">{item.name}</p>
                  {item.quantity > 1 ? <p className="text-sm text-[#7a84ae]">x {item.quantity}</p> : null}
                </div>
                <p className="text-xl text-[#46527f]">{formatPrice(item.price)}</p>
              </div>
            ))}
          </div>

          <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#edf1fd] px-5 py-4">
            <p className="text-base text-[#616c99]">
              Total <span className="text-3xl font-semibold text-[#29376b]">{formatPrice(order.total)}</span>
            </p>
            <div className="flex items-center gap-2">
              <button
                className="rounded-lg bg-gradient-to-r from-[#4f69cd] to-[#3557c1] px-5 py-2 text-sm font-semibold text-white"
                onClick={() => handleTrackOrder(order)}
                type="button"
              >
                {order.status === "cancelled" ? "View Details" : "Track Order"}
              </button>
              <button
                className="rounded-lg bg-gradient-to-r from-[#4f69cd] to-[#3557c1] px-4 py-2 text-sm font-semibold text-white"
                onClick={() => handleBuyAgain(order)}
                type="button"
              >
                Buy Again
              </button>
            </div>
          </footer>
        </article>
      ))}

      {filteredOrders.length === 0 ? (
        <section className="rounded-2xl border border-[#dce3fb] bg-white p-6 text-center text-[#65709c]">
          No orders found for this filter.
        </section>
      ) : null}
    </section>
  );

  const renderWishlist = () => (
    <section className="rounded-2xl border border-[#e0e5fa] bg-white p-6">
      <h1 className="text-4xl font-semibold text-[#2a396c]">Wishlist</h1>
      <p className="mt-2 text-sm text-[#6f79a3]">{wishlistItems.length} saved item(s).</p>
      <div className="mt-4 space-y-3">
        {wishlistItems.slice(0, 5).map((item) => (
          <div className="flex items-center justify-between rounded-xl border border-[#e7ebfb] p-3" key={item.id}>
            <div className="flex items-center gap-3">
              <img alt={item.name} className="h-10 w-10 rounded-lg object-cover" src={item.imageUrl} />
              <div>
                <p className="text-sm font-semibold text-[#2f3f74]">{item.name}</p>
                <p className="text-xs text-[#7a84ae]">{formatPrice(item.price, item.currency)}</p>
              </div>
            </div>
            <button
              className="rounded-lg bg-[#1f4690] px-3 py-1 text-xs font-semibold text-white"
              onClick={() => navigateTo("/wishlist")}
              type="button"
            >
              Open
            </button>
          </div>
        ))}
      </div>
      <button
        className="mt-5 rounded-lg bg-gradient-to-r from-[#4f69cd] to-[#3557c1] px-4 py-2 text-sm font-semibold text-white"
        onClick={() => navigateTo("/wishlist")}
        type="button"
      >
        Manage Wishlist
      </button>
    </section>
  );

  const renderAddresses = () => (
    <section className="rounded-2xl border border-[#e0e5fa] bg-white p-6">
      <h1 className="text-4xl font-semibold text-[#2a396c]">Addresses</h1>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <input className="rounded-xl border border-[#dce3fb] p-3" onChange={(event) => setAddress((prev) => ({ ...prev, line1: event.target.value }))} placeholder="Address line" value={address.line1} />
        <input className="rounded-xl border border-[#dce3fb] p-3" onChange={(event) => setAddress((prev) => ({ ...prev, city: event.target.value }))} placeholder="City" value={address.city} />
        <input className="rounded-xl border border-[#dce3fb] p-3" onChange={(event) => setAddress((prev) => ({ ...prev, state: event.target.value }))} placeholder="State" value={address.state} />
        <input className="rounded-xl border border-[#dce3fb] p-3" onChange={(event) => setAddress((prev) => ({ ...prev, postalCode: event.target.value }))} placeholder="Postal Code" value={address.postalCode} />
        <input className="rounded-xl border border-[#dce3fb] p-3 sm:col-span-2" onChange={(event) => setAddress((prev) => ({ ...prev, country: event.target.value }))} placeholder="Country" value={address.country} />
      </div>
      <button
        className="mt-5 rounded-lg bg-gradient-to-r from-[#4f69cd] to-[#3557c1] px-4 py-2 text-sm font-semibold text-white"
        onClick={saveAddress}
        type="button"
      >
        Save Address
      </button>
    </section>
  );

  const renderSettings = () => (
    <section className="rounded-2xl border border-[#e0e5fa] bg-white p-6">
      <h1 className="text-4xl font-semibold text-[#2a396c]">Account Settings</h1>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <input className="rounded-xl border border-[#dce3fb] p-3" onChange={(event) => setAccountSettings((prev) => ({ ...prev, displayName: event.target.value }))} placeholder="Display Name" value={accountSettings.displayName} />
        <input className="rounded-xl border border-[#dce3fb] p-3" onChange={(event) => setAccountSettings((prev) => ({ ...prev, email: event.target.value }))} placeholder="Email" type="email" value={accountSettings.email} />
      </div>
      <div className="mt-5 flex gap-2">
        <button
          className="rounded-lg bg-gradient-to-r from-[#4f69cd] to-[#3557c1] px-4 py-2 text-sm font-semibold text-white"
          onClick={saveAccountSettings}
          type="button"
        >
          Save Settings
        </button>
        <button
          className="rounded-lg border border-[#dce3fb] px-4 py-2 text-sm font-semibold text-[#445184]"
          onClick={() => navigateTo("/profile")}
          type="button"
        >
          Refresh Orders
        </button>
      </div>
    </section>
  );

  return (
    <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_25px_80px_rgba(48,61,118,0.25)]">
        {homeData.navigation ? (
          <Suspense fallback={<Loader />}>
            <TopNav data={homeData.navigation} />
          </Suspense>
        ) : null}

        <main className="bg-gradient-to-b from-[#f4f5ff] via-[#eef0fc] to-[#edf0ff] p-4 sm:p-6 md:p-8">
          <section className="grid gap-5 lg:grid-cols-[240px_1fr]">
            <aside className="rounded-2xl border border-[#e0e5fa] bg-white p-5 shadow-sm">
              <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border border-[#d8dff8]">
                <img
                  alt={profileData.user.name}
                  className="h-full w-full object-cover"
                  src={profileData.user.avatarUrl}
                />
              </div>
              <h2 className="mt-4 text-center text-2xl font-semibold text-[#2a396c]">{profileData.user.name}</h2>
              <p className="mt-1 text-center text-sm text-[#7a84ae]">{profileData.user.email}</p>
              <div className="mt-5 border-t border-[#e9edfb] pt-4">
                <button
                  className={`mb-2 block w-full rounded-xl px-4 py-3 text-left text-sm font-semibold ${activeView === "orders" ? "bg-[#dfe4ff] text-[#2e3d72]" : "text-[#5f6a97]"}`}
                  onClick={() => setActiveView("orders")}
                  type="button"
                >
                  My Orders
                </button>
                <button
                  className={`mb-2 block w-full rounded-xl px-4 py-3 text-left text-sm font-semibold ${activeView === "wishlist" ? "bg-[#dfe4ff] text-[#2e3d72]" : "text-[#5f6a97]"}`}
                  onClick={() => setActiveView("wishlist")}
                  type="button"
                >
                  Wishlist
                </button>
                <button
                  className={`mb-2 block w-full rounded-xl px-4 py-3 text-left text-sm font-semibold ${activeView === "addresses" ? "bg-[#dfe4ff] text-[#2e3d72]" : "text-[#5f6a97]"}`}
                  onClick={() => setActiveView("addresses")}
                  type="button"
                >
                  Addresses
                </button>
                <button
                  className={`mb-2 block w-full rounded-xl px-4 py-3 text-left text-sm font-semibold ${activeView === "settings" ? "bg-[#dfe4ff] text-[#2e3d72]" : "text-[#5f6a97]"}`}
                  onClick={() => setActiveView("settings")}
                  type="button"
                >
                  Account Settings
                </button>
                <button
                  className="block w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-[#d85c58]"
                  onClick={handleLogout}
                  type="button"
                >
                  Logout
                </button>
              </div>
            </aside>

            <section className="space-y-4">
              {feedback ? (
                <div className="rounded-xl border border-[#dce3fb] bg-white px-4 py-3 text-sm text-[#546090]">
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
    </div>
  );
};

export default ProfilePage;
