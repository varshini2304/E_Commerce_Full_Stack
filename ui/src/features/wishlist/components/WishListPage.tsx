import { lazy, Suspense, useState } from "react";
import { useHomeData } from "../../home/hooks/useHomeData";
import {
  WishListItem,
  getWishListItems,
  removeWishListItem,
  clearCart,
} from "../WishListStorage";
import { addProductToCart } from "../../cart/cartStorage";
import { Loader, SectionSkeleton } from "../../../shared/components";
import { UI_MESSAGES } from "../../../shared/constants/config";

const TopNav = lazy(() => import("../../home/components/TopNav"));
const SiteFooter = lazy(() => import("../../home/components/SiteFooter"));

const formatPrice = (amount: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);

const WishListPage = () => {
  const { data, isLoading, isError } = useHomeData();
  const [items, setItems] = useState<WishListItem[]>(() => getWishListItems());

  if (isLoading) {
    return <Loader />;
  }

  if (isError || !data) {
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

  const onRemove = (id: string) => {
    setItems(removeWishListItem(id));
  };

  const onClear = () => {
    clearCart();
    setItems([]);
  };

  const onAddToCart = (item: WishListItem) => {
    const product = {
      id: item.id,
      name: item.name,
      description: "",
      imageUrl: item.imageUrl,
      price: item.price,
      currency: item.currency,
    };
    addProductToCart(product, item.quantity);
    // Optionally remove from wishlist after adding to cart
    setItems(removeWishListItem(item.id));
  };

  const totalValue = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_25px_80px_rgba(48,61,118,0.25)]">
        {data.navigation ? (
          <Suspense fallback={<Loader />}>
            <TopNav data={data.navigation} />
          </Suspense>
        ) : null}

        <main className="space-y-6 bg-[#fbfbff] p-6 md:p-8">
          <section className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-[#243267]">My Wishlist</h1>
            {items.length > 0 ? (
              <button
                className="rounded-full border border-[#dbe1fb] px-4 py-2 text-sm font-semibold text-[#405087]"
                onClick={onClear}
                type="button"
              >
                Clear wishlist
              </button>
            ) : null}
          </section>

          {items.length === 0 ? (
            <section className="rounded-2xl border border-[#e2e8ff] bg-white p-10 text-center">
              <h2 className="text-xl font-semibold text-[#223067]">Your wishlist is empty</h2>
              <p className="mt-2 text-sm text-[#6f79a3]">Add products to save them for later.</p>
              <a
                className="mt-6 inline-flex rounded-full bg-[#1f4690] px-5 py-2 text-sm font-semibold text-white"
                href="/"
              >
                Continue shopping
              </a>
            </section>
          ) : (
            <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
              <div className="space-y-4">
                {items.map((item) => (
                  <article
                    className="grid grid-cols-[88px_1fr_auto] items-center gap-4 rounded-2xl border border-[#e2e8ff] bg-white p-4"
                    key={item.id}
                  >
                    <img
                      alt={item.name}
                      className="h-20 w-20 rounded-xl object-cover"
                      src={item.imageUrl}
                    />
                    <div>
                      <h3 className="text-base font-semibold text-[#243267]">{item.name}</h3>
                      <p className="mt-1 text-sm font-bold text-[#1f4690]">
                        {formatPrice(item.price, item.currency)}
                      </p>
                      <p className="mt-0.5 text-xs text-[#8a93ba]">Qty: {item.quantity}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button
                        className="rounded-full bg-[#1f4690] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#1a3a75]"
                        onClick={() => onAddToCart(item)}
                        type="button"
                      >
                        Add to Cart
                      </button>
                      <button
                        className="text-sm font-semibold text-[#c24545] hover:text-[#a63a3a]"
                        onClick={() => onRemove(item.id)}
                        type="button"
                      >
                        Remove
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              <aside className="h-fit rounded-2xl border border-[#e2e8ff] bg-white p-5">
                <h2 className="text-lg font-semibold text-[#243267]">Wishlist Summary</h2>
                <div className="mt-4 space-y-2 text-sm text-[#5b6692]">
                  <p className="flex items-center justify-between">
                    <span>Items</span>
                    <span>{items.length}</span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span>Total Quantity</span>
                    <span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                  </p>
                  <p className="flex items-center justify-between border-t border-[#edf1fd] pt-3 text-base font-semibold text-[#243267]">
                    <span>Total Value</span>
                    <span>{formatPrice(totalValue)}</span>
                  </p>
                </div>
                <a
                  className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-[#1f4690] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1a3a75]"
                  href="/"
                >
                  Continue Shopping
                </a>
              </aside>
            </section>
          )}
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

export default WishListPage;
