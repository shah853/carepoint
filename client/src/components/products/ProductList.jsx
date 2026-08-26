import ProductCard from './ProductCard';

function ProductList({ products }) {
  if (!Array.isArray(products)) {
    return <p className="text-center text-gray-500 py-8">Products are unavailable right now.</p>;
  }

  if (products.length === 0) {
    return <p className="text-center text-gray-500 py-8">No products found</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}

export default ProductList;
