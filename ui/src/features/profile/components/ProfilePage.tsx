import { lazy, Suspense } from "react";
import { useHomeData } from "../../home/hooks/useHomeData";
import { useProfileData } from "../hooks/useProfileData";
import { Loader, SectionSkeleton } from "../../../shared/components";
import { UI_MESSAGES } from "../../../shared/constants/config";

const TopNav = lazy(() => import("../../home/components/TopNav"));
const SiteFooter = lazy(() => import("../../home/components/SiteFooter"));

const statusClasses: Record<string, string> = {
  delivered: "bg-[#9ac8a1] text-white",
  processing: "bg-[#efbe67] text-white",
  shipped: "bg-[#efbe67] text-white",
  cancelled: "bg-[#b7bfdc] text-white",
  pending: "bg-[#c9d0ea] text-white",
};

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

  if (isHomeLoading || isProfileLoading) {
    return <Loader />;
  }

  if (isHomeError || isProfileError || !homeData || !profileData) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <h1 className="text-lg font-semibold text-red-900">
          {UI_MESSAGES.genericErrorTitle}
        </h1>
        <p className="mt-2 text-sm text-red-700">
          {UI_MESSAGES.genericErrorDescription}
        </p>
      </section>
    );
  }

  return (
    <div className={`mx-auto w-full px-4 sm:px-6 lg:px-8`}>
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
              <h2 className="mt-4 text-center text-2xl font-semibold text-[#2a396c]">
                {profileData.user.name}
              </h2>
              <p className="mt-1 text-center text-sm text-[#7a84ae]">{profileData.user.email}</p>
              <div className="mt-5 border-t border-[#e9edfb] pt-4">
                <a
                  className="mb-2 block rounded-xl bg-[#dfe4ff] px-4 py-3 text-sm font-semibold text-[#2e3d72]"
                  href="/profile"
                >
                  My Orders
                </a>
                <p className="rounded-xl px-4 py-3 text-sm text-[#5f6a97]">Wishlist</p>
                <p className="rounded-xl px-4 py-3 text-sm text-[#5f6a97]">Addresses</p>
                <p className="rounded-xl px-4 py-3 text-sm text-[#5f6a97]">Account Settings</p>
                <p className="rounded-xl px-4 py-3 text-sm font-medium text-[#d85c58]">Logout</p>
              </div>
            </aside>

            <section className="space-y-4">
              <div className="rounded-2xl border border-[#e0e5fa] bg-white p-6">
                <h1 className="text-4xl font-semibold text-[#2a396c]">My Orders</h1>
                <div className="mt-4 inline-flex items-center gap-4 rounded-xl border border-[#dbe1f9] px-4 py-2 text-[#626d9b]">
                  <span>All Orders</span>
                  <span className="text-xs">v</span>
                </div>
              </div>

              {profileData.orders.map((order) => (
                <article
                  className="overflow-hidden rounded-2xl border border-[#dce3fb] bg-white shadow-sm"
                  key={order.id}
                >
                  <header className="flex items-center justify-between bg-gradient-to-r from-[#edf0ff] to-[#f7f8ff] px-5 py-3">
                    <h3 className="text-2xl font-semibold text-[#2c3b70]">
                      Order #{order.orderNumber}
                    </h3>
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
                          {item.quantity > 1 ? (
                            <p className="text-sm text-[#7a84ae]">x {item.quantity}</p>
                          ) : null}
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
                        type="button"
                      >
                        {order.status === "cancelled" ? "View Details" : "Track Order"}
                      </button>
                      <button
                        className="rounded-lg bg-gradient-to-r from-[#4f69cd] to-[#3557c1] px-3 py-2 text-sm font-semibold text-white"
                        type="button"
                      >
                        -
                      </button>
                    </div>
                  </footer>
                </article>
              ))}
              {profileData.orders.length === 0 ? (
                <section className="rounded-2xl border border-[#dce3fb] bg-white p-6 text-center text-[#65709c]">
                  No orders found for this user.
                </section>
              ) : null}
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
