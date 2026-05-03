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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#e0e2f6,#cbcde8_45%,#d9daee_80%)]">
      {data.navigation ? (
        <Suspense fallback={<Loader />}>
          <TopNav data={data.navigation} />
        </Suspense>
      ) : null}

      <main className="space-y-4 px-6 py-8 sm:px-8 lg:px-12">
        <section className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-[#243267]">Wishlist</h1>
            <p className="mt-0.5 text-xs text-[#6f79a3]">{items.length} saved item(s)</p>
          </div>
          {items.length > 0 ? (
            <button
              className="rounded-md border border-[#dbe1fb] bg-white px-3 py-1.5 text-xs font-semibold text-[#405087] hover:border-[#c4cdef]"
              onClick={onClear}
              type="button"
            >
              Clear all
            </button>
          ) : null}
        </section>

        {items.length === 0 ? (
          <section className="rounded-xl border border-[#e2e8ff] bg-white p-10 text-center">
            <h2 className="text-base font-semibold text-[#223067]">Your wishlist is empty</h2>
            <p className="mt-1 text-xs text-[#6f79a3]">Add products to save them for later.</p>
            <a
              className="mt-5 inline-flex rounded-md bg-[#1f4690] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#1a3a75]"
              href="/shop"
            >
              Continue shopping
            </a>
          </section>
        ) : (
          <section className="grid gap-4 lg:grid-cols-[1fr_280px]">
            <div className="space-y-2">
              {items.map((item) => (
                <article
                  className="grid grid-cols-[56px_1fr_auto] items-center gap-3 rounded-xl border border-[#e2e8ff] bg-white p-3"
                  key={item.id}
                >
                  <img
                    alt={item.name}
                    className="h-14 w-14 rounded-lg object-cover"
                    src={item.imageUrl}
                  />
                  <div>
                    <h3 className="text-sm font-medium text-[#243267]">{item.name}</h3>
                    <div className="mt-0.5 flex items-center gap-2">
                      <p className="text-sm font-semibold text-[#1f4690]">
                        {formatPrice(item.price, item.currency)}
                      </p>
                      <p className="text-xs text-[#8a93ba]">· qty {item.quantity}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="rounded-md bg-[#1f4690] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1a3a75]"
                      onClick={() => onAddToCart(item)}
                      type="button"
                    >
                      Add to cart
                    </button>
                    <button
                      className="text-xs font-medium text-[#c24545] hover:text-[#a63a3a]"
                      onClick={() => onRemove(item.id)}
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <aside className="h-fit rounded-xl border border-[#e2e8ff] bg-white p-4">
              <h2 className="text-sm font-semibold text-[#243267]">Summary</h2>
              <dl className="mt-3 space-y-1.5 text-xs text-[#5b6692]">
                <div className="flex items-center justify-between">
                  <dt>Items</dt>
                  <dd className="font-medium text-[#243267]">{items.length}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt>Total quantity</dt>
                  <dd className="font-medium text-[#243267]">
                    {items.reduce((sum, item) => sum + item.quantity, 0)}
                  </dd>
                </div>
                <div className="flex items-center justify-between border-t border-[#edf1fd] pt-2 text-sm font-semibold text-[#243267]">
                  <dt>Total value</dt>
                  <dd>{formatPrice(totalValue)}</dd>
                </div>
              </dl>
              <a
                className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-[#1f4690] px-3 py-2 text-xs font-semibold text-white hover:bg-[#1a3a75]"
                href="/shop"
              >
                Continue shopping
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
  );
};

export default WishListPage;
