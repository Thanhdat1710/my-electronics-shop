// app/products/page.jsx
import ProductCard from '@/components/ProductCard';

export default function ProductsPage({ searchParams }) {
  const category = searchParams?.cat || 'all';
  const filtered = category === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === category);

  return (
    <main className="max-w-6xl mx-auto px-4 py-6">
      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6">
        {CATEGORIES.map(cat => (
          
            key={cat.value}
            href={`/products?cat=${cat.value}`}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm border
              ${category === cat.value
                ? 'bg-blue-500 text-white border-blue-500'
                : 'border-gray-200 text-gray-600 hover:border-blue-300'
              }`}
          >
            {cat.label}
          </a>
        ))}
      </div>

      {/* Product grid — tự động responsive */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}