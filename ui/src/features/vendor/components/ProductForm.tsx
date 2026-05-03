import { useState } from "react";
import type { Product, ProductRequest } from "../types/vendor.types";

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: ProductRequest) => void;
  isSubmitting: boolean;
  submitLabel?: string;
}

const EMPTY_FORM: ProductRequest = {
  name: "", slug: "", description: "", brand: "",
  price: 0, discountPercentage: 0, finalPrice: 0,
  stock: 0, sku: "", categorySlug: "", thumbnail: "",
  images: [], tags: [],
};

function toInitial(p?: Product): ProductRequest {
  if (!p) return EMPTY_FORM;
  return {
    name: p.name, slug: p.slug, description: p.description, brand: p.brand,
    price: p.price, discountPercentage: p.discountPercentage, finalPrice: p.finalPrice,
    stock: p.stock, sku: p.sku, categorySlug: p.categorySlug, thumbnail: p.thumbnail,
    images: p.images ?? [], tags: p.tags ?? [],
  };
}

const FIELD_BASE = "block w-full rounded-xl border border-slate-700 bg-slate-800/70 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-300">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  );
}

export function ProductForm({ initialData, onSubmit, isSubmitting, submitLabel = "Save Product" }: ProductFormProps) {
  const [form, setForm] = useState<ProductRequest>(toInitial(initialData));
  const [tagsInput, setTagsInput] = useState((initialData?.tags ?? []).join(", "));
  const [imagesInput, setImagesInput] = useState((initialData?.images ?? []).join("\n"));

  const set = (key: keyof ProductRequest, val: string | number) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...form,
      tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
      images: imagesInput.split("\n").map((i) => i.trim()).filter(Boolean),
    });
  };

  const autoSlug = () => {
    if (!form.slug) {
      set("slug", form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
    }
  };

  const autoFinalPrice = () => {
    if (form.price > 0 && form.discountPercentage >= 0) {
      const final = form.price * (1 - form.discountPercentage / 100);
      set("finalPrice", parseFloat(final.toFixed(2)));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="rounded-2xl bg-slate-800/40 p-6 ring-1 ring-slate-700/50">
        <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-slate-400">Basic Information</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Product Name" required>
            <input className={FIELD_BASE} value={form.name} onChange={(e) => set("name", e.target.value)}
              onBlur={autoSlug} placeholder="e.g. Wireless Headphones" required />
          </Field>
          <Field label="Slug" required>
            <input className={FIELD_BASE} value={form.slug} onChange={(e) => set("slug", e.target.value)}
              placeholder="e.g. wireless-headphones" required />
          </Field>
          <Field label="Brand">
            <input className={FIELD_BASE} value={form.brand} onChange={(e) => set("brand", e.target.value)}
              placeholder="e.g. Sony" />
          </Field>
          <Field label="Category Slug" required>
            <input className={FIELD_BASE} value={form.categorySlug} onChange={(e) => set("categorySlug", e.target.value)}
              placeholder="e.g. electronics" required />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Description" required>
              <textarea className={`${FIELD_BASE} min-h-[100px] resize-y`} value={form.description}
                onChange={(e) => set("description", e.target.value)} placeholder="Describe your product…" required />
            </Field>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="rounded-2xl bg-slate-800/40 p-6 ring-1 ring-slate-700/50">
        <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-slate-400">Pricing & Stock</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Price ($)" required>
            <input className={FIELD_BASE} type="number" step="0.01" min="0.01"
              value={form.price || ""} onChange={(e) => set("price", parseFloat(e.target.value))}
              onBlur={autoFinalPrice} placeholder="0.00" required />
          </Field>
          <Field label="Discount (%)">
            <input className={FIELD_BASE} type="number" step="0.1" min="0" max="100"
              value={form.discountPercentage || ""} onChange={(e) => set("discountPercentage", parseFloat(e.target.value))}
              onBlur={autoFinalPrice} placeholder="0" />
          </Field>
          <Field label="Final Price ($)" required>
            <input className={FIELD_BASE} type="number" step="0.01" min="0.01"
              value={form.finalPrice || ""} onChange={(e) => set("finalPrice", parseFloat(e.target.value))}
              placeholder="0.00" required />
          </Field>
          <Field label="Stock Quantity" required>
            <input className={FIELD_BASE} type="number" min="0"
              value={form.stock || ""} onChange={(e) => set("stock", parseInt(e.target.value))}
              placeholder="0" required />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="SKU" required>
            <input className={`${FIELD_BASE} font-mono`} value={form.sku}
              onChange={(e) => set("sku", e.target.value.toUpperCase())} placeholder="e.g. WH-SONY-XM5-BLK" required />
          </Field>
        </div>
      </div>

      {/* Media */}
      <div className="rounded-2xl bg-slate-800/40 p-6 ring-1 ring-slate-700/50">
        <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-slate-400">Media & Tags</h3>
        <div className="grid grid-cols-1 gap-4">
          <Field label="Thumbnail URL" required>
            <input className={FIELD_BASE} value={form.thumbnail}
              onChange={(e) => set("thumbnail", e.target.value)} placeholder="https://…/image.jpg" required />
          </Field>
          <Field label="Additional Image URLs (one per line)">
            <textarea className={`${FIELD_BASE} min-h-[80px] resize-y font-mono text-xs`}
              value={imagesInput} onChange={(e) => setImagesInput(e.target.value)}
              placeholder={"https://…/image1.jpg\nhttps://…/image2.jpg"} />
          </Field>
          <Field label="Tags (comma-separated)">
            <input className={FIELD_BASE} value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)} placeholder="e.g. wireless, audio, noise-cancelling" />
          </Field>
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-end gap-3">
        <button type="button" onClick={() => window.history.back()}
          className="rounded-xl border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-400 transition hover:border-slate-600 hover:text-slate-300">
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting}
          className="flex items-center gap-2 rounded-xl bg-indigo-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:opacity-60">
          {isSubmitting && (
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          )}
          {isSubmitting ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
