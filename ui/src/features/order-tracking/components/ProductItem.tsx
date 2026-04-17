import { ProductItemModel } from "../types/orderTrackingTypes";

interface ProductItemProps {
  item: ProductItemModel;
}

const formatPrice = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

const ProductItem = ({ item }: ProductItemProps) => (
  <article className="grid grid-cols-[68px_1fr_auto] items-center gap-3 border-b border-[#edf1fd] py-3 last:border-0">
    {item.imageUrl ? (
      <img alt={item.name} className="h-14 w-14 rounded-lg object-cover" src={item.imageUrl} />
    ) : (
      <div className="h-14 w-14 rounded-lg bg-[#eef2ff]" />
    )}
    <div>
      <p className="text-sm font-semibold text-[#2f3d70]">{item.name}</p>
      <p className="text-xs text-[#7b86ad]">Qty: {item.quantity}</p>
    </div>
    <p className="text-sm font-semibold text-[#2f3d70]">{formatPrice(item.price)}</p>
  </article>
);

export default ProductItem;
