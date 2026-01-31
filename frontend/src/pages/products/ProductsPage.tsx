import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Grid, List, Plus, ChevronDown, Clock, Calendar, CalendarDays } from 'lucide-react';
import { mockProducts, productCategories } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

type ViewMode = 'grid' | 'list';

export default function ProductsPage() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesPublished = user?.role === 'customer' ? product.isPublished : true;
    return matchesSearch && matchesCategory && matchesPublished;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getPriceDisplay = (product: typeof mockProducts[0]) => {
    if (product.rentalPricing.hourly) {
      return { price: formatPrice(product.rentalPricing.hourly), unit: '/hour' };
    }
    if (product.rentalPricing.daily) {
      return { price: formatPrice(product.rentalPricing.daily), unit: '/day' };
    }
    if (product.rentalPricing.weekly) {
      return { price: formatPrice(product.rentalPricing.weekly), unit: '/week' };
    }
    return { price: '-', unit: '' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary-900">Products</h1>
          <p className="text-primary-500">Browse and rent equipment</p>
        </div>
        
        {(user?.role === 'vendor' || user?.role === 'admin') && (
          <Link to="/products/new" className="btn btn-primary">
            <Plus size={18} />
            Add Product
          </Link>
        )}
      </div>

      {/* Search and Filters */}
      <div className="card p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="input pl-10"
            />
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-secondary w-full lg:w-auto"
            >
              <Filter size={18} />
              {selectedCategory}
              <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            
            {showFilters && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-primary-200 rounded-xl shadow-lg py-2 z-10">
                {productCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setShowFilters(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-primary-50 ${
                      selectedCategory === category ? 'bg-primary-100 font-medium' : ''
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* View Toggle */}
          <div className="flex border border-primary-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 ${viewMode === 'grid' ? 'bg-primary-900 text-white' : 'bg-white text-primary-600 hover:bg-primary-50'}`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 ${viewMode === 'list' ? 'bg-primary-900 text-white' : 'bg-white text-primary-600 hover:bg-primary-50'}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-primary-500">
        Showing {filteredProducts.length} of {mockProducts.length} products
      </p>

      {/* Products Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const priceInfo = getPriceDisplay(product);
            return (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="card card-hover overflow-hidden group"
              >
                {/* Image */}
                <div className="aspect-[4/3] bg-primary-100 overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                {/* Content */}
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="badge badge-neutral text-xs">{product.category}</span>
                    {product.availableQuantity > 0 ? (
                      <span className="badge badge-success text-xs">Available</span>
                    ) : (
                      <span className="badge badge-danger text-xs">Out of Stock</span>
                    )}
                  </div>
                  
                  <h3 className="font-semibold text-primary-900 line-clamp-1">{product.name}</h3>
                  <p className="text-sm text-primary-500 line-clamp-2">{product.description}</p>
                  
                  {/* Pricing */}
                  <div className="pt-2 border-t border-primary-100">
                    <div className="flex items-center gap-3">
                      {product.rentalPricing.hourly && (
                        <div className="flex items-center gap-1 text-xs text-primary-500">
                          <Clock size={14} />
                          {formatPrice(product.rentalPricing.hourly)}
                        </div>
                      )}
                      {product.rentalPricing.daily && (
                        <div className="flex items-center gap-1 text-xs text-primary-500">
                          <Calendar size={14} />
                          {formatPrice(product.rentalPricing.daily)}
                        </div>
                      )}
                      {product.rentalPricing.weekly && (
                        <div className="flex items-center gap-1 text-xs text-primary-500">
                          <CalendarDays size={14} />
                          {formatPrice(product.rentalPricing.weekly)}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary-900">
                      {priceInfo.price}
                      <span className="text-sm font-normal text-primary-500">{priceInfo.unit}</span>
                    </span>
                    <span className="text-xs text-primary-500">
                      {product.availableQuantity} available
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProducts.map((product) => {
            const priceInfo = getPriceDisplay(product);
            return (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="card card-hover p-4 flex gap-6"
              >
                {/* Image */}
                <div className="w-32 h-24 rounded-lg bg-primary-100 overflow-hidden flex-shrink-0">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="badge badge-neutral text-xs">{product.category}</span>
                        {product.availableQuantity > 0 ? (
                          <span className="badge badge-success text-xs">Available</span>
                        ) : (
                          <span className="badge badge-danger text-xs">Out of Stock</span>
                        )}
                      </div>
                      <h3 className="font-semibold text-primary-900">{product.name}</h3>
                      <p className="text-sm text-primary-500 line-clamp-1 mt-1">{product.description}</p>
                    </div>
                    
                    <div className="text-right flex-shrink-0">
                      <span className="text-lg font-bold text-primary-900">{priceInfo.price}</span>
                      <span className="text-sm text-primary-500">{priceInfo.unit}</span>
                      <p className="text-xs text-primary-500 mt-1">{product.availableQuantity} available</p>
                    </div>
                  </div>
                  
                  {/* Pricing Options */}
                  <div className="flex items-center gap-4 mt-3">
                    {product.rentalPricing.hourly && (
                      <div className="flex items-center gap-1 text-sm text-primary-600">
                        <Clock size={14} />
                        {formatPrice(product.rentalPricing.hourly)}/hr
                      </div>
                    )}
                    {product.rentalPricing.daily && (
                      <div className="flex items-center gap-1 text-sm text-primary-600">
                        <Calendar size={14} />
                        {formatPrice(product.rentalPricing.daily)}/day
                      </div>
                    )}
                    {product.rentalPricing.weekly && (
                      <div className="flex items-center gap-1 text-sm text-primary-600">
                        <CalendarDays size={14} />
                        {formatPrice(product.rentalPricing.weekly)}/week
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={24} className="text-primary-400" />
          </div>
          <h3 className="text-lg font-semibold text-primary-900">No products found</h3>
          <p className="text-primary-500 mt-1">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}
