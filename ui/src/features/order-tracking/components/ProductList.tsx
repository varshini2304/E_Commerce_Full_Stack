import { memo } from "react";
import ProductItem from "./ProductItem";
import { ProductItemModel } from "../types/orderTrackingTypes";

interface ProductListProps {
  items: ProductItemModel[];
}

const ProductList = memo(({ items }: ProductListProps) => (
  <section className="rounded-2xl border border-[#dfe5fb] bg-white p-5 shadow-sm">
    <h2 className="text-xl font-semibold text-[#2b3869]">Products</h2>
    <div className="mt-3">
      {items.map((item) => (
        <ProductItem item={item} key={item.id} />
      ))}
    </div>
  </section>
));

ProductList.displayName = "ProductList";

export default ProductList;
