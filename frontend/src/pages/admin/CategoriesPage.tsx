import { useState } from 'react';
import {
  FolderTree,
  Search,
  Plus,
  Edit2,
  Trash2,
  ChevronRight,
  ChevronDown,
  MoreVertical,
  Package,
  Image,
  Save,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  parentId: string | null;
  productCount: number;
  isActive: boolean;
  image?: string;
  children?: Category[];
}

const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Construction Equipment',
    slug: 'construction-equipment',
    description: 'Heavy machinery and tools for construction projects',
    parentId: null,
    productCount: 245,
    isActive: true,
    children: [
      {
        id: '1-1',
        name: 'Excavators',
        slug: 'excavators',
        description: 'Digging and earth-moving equipment',
        parentId: '1',
        productCount: 45,
        isActive: true,
      },
      {
        id: '1-2',
        name: 'Cranes',
        slug: 'cranes',
        description: 'Lifting and hoisting equipment',
        parentId: '1',
        productCount: 32,
        isActive: true,
      },
      {
        id: '1-3',
        name: 'Concrete Equipment',
        slug: 'concrete-equipment',
        description: 'Mixers, pumps, and concrete tools',
        parentId: '1',
        productCount: 58,
        isActive: true,
      },
    ],
  },
  {
    id: '2',
    name: 'Event & Party',
    slug: 'event-party',
    description: 'Equipment for events, weddings, and parties',
    parentId: null,
    productCount: 189,
    isActive: true,
    children: [
      {
        id: '2-1',
        name: 'Tents & Canopies',
        slug: 'tents-canopies',
        description: 'Outdoor shelter and shade solutions',
        parentId: '2',
        productCount: 28,
        isActive: true,
      },
      {
        id: '2-2',
        name: 'Tables & Chairs',
        slug: 'tables-chairs',
        description: 'Seating and dining furniture',
        parentId: '2',
        productCount: 67,
        isActive: true,
      },
      {
        id: '2-3',
        name: 'Audio & Visual',
        slug: 'audio-visual',
        description: 'Sound systems, projectors, and displays',
        parentId: '2',
        productCount: 41,
        isActive: true,
      },
    ],
  },
  {
    id: '3',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Electronic devices and gadgets for rent',
    parentId: null,
    productCount: 156,
    isActive: true,
    children: [
      {
        id: '3-1',
        name: 'Cameras & Photography',
        slug: 'cameras-photography',
        description: 'Professional cameras and equipment',
        parentId: '3',
        productCount: 52,
        isActive: true,
      },
      {
        id: '3-2',
        name: 'Computers & Laptops',
        slug: 'computers-laptops',
        description: 'Desktop and laptop computers',
        parentId: '3',
        productCount: 38,
        isActive: true,
      },
    ],
  },
  {
    id: '4',
    name: 'Vehicles',
    slug: 'vehicles',
    description: 'Cars, trucks, and other vehicles',
    parentId: null,
    productCount: 98,
    isActive: true,
  },
  {
    id: '5',
    name: 'Medical Equipment',
    slug: 'medical-equipment',
    description: 'Healthcare and medical devices',
    parentId: null,
    productCount: 45,
    isActive: false,
  },
];

interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  parentId: string;
  isActive: boolean;
}

export default function CategoriesPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['1', '2', '3']));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    slug: '',
    description: '',
    parentId: '',
    isActive: true,
  });

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description,
        parentId: category.parentId || '',
        isActive: category.isActive,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        slug: '',
        description: '',
        parentId: '',
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      parentId: '',
      isActive: true,
    });
  };

  const handleSave = () => {
    // TODO: API call to save category
    console.log('Saving category:', formData);
    handleCloseModal();
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const renderCategory = (category: Category, level: number = 0) => {
    const isExpanded = expandedCategories.has(category.id);
    const hasChildren = category.children && category.children.length > 0;

    return (
      <div key={category.id}>
        <div
          className={`flex items-center gap-3 p-4 hover:bg-primary-50 transition-colors border-b border-primary-100 ${
            level > 0 ? 'pl-' + (level * 8 + 4) : ''
          }`}
          style={{ paddingLeft: `${level * 32 + 16}px` }}
        >
          {/* Expand/Collapse Button */}
          <button
            onClick={() => toggleCategory(category.id)}
            className={`w-6 h-6 flex items-center justify-center rounded hover:bg-primary-200 transition-colors ${
              !hasChildren ? 'invisible' : ''
            }`}
          >
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>

          {/* Category Icon */}
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <FolderTree className="text-primary-600" size={20} />
          </div>

          {/* Category Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-primary-900 truncate">{category.name}</h3>
              <span
                className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                  category.isActive
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {category.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="text-xs text-primary-500 truncate">{category.description}</p>
          </div>

          {/* Product Count */}
          <div className="flex items-center gap-1 text-sm text-primary-500">
            <Package size={14} />
            <span>{category.productCount}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOpenModal(category)}
              className="p-2 text-primary-500 hover:text-primary-900 hover:bg-primary-100 rounded-lg transition-colors"
            >
              <Edit2 size={16} />
            </button>
            <button className="p-2 text-primary-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div>
            {category.children!.map((child) => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // Filter categories based on search
  const filterCategories = (categories: Category[], query: string): Category[] => {
    if (!query) return categories;
    
    return categories.reduce<Category[]>((acc, cat) => {
      const matchesQuery = cat.name.toLowerCase().includes(query.toLowerCase()) ||
        cat.description.toLowerCase().includes(query.toLowerCase());
      
      const filteredChildren = cat.children ? filterCategories(cat.children, query) : [];
      
      if (matchesQuery || filteredChildren.length > 0) {
        acc.push({
          ...cat,
          children: filteredChildren.length > 0 ? filteredChildren : cat.children,
        });
      }
      
      return acc;
    }, []);
  };

  const filteredCategories = filterCategories(mockCategories, searchQuery);

  // Get flat list of parent categories for dropdown
  const getParentOptions = (categories: Category[], exclude?: string): Array<{ id: string; name: string; level: number }> => {
    const options: Array<{ id: string; name: string; level: number }> = [];
    
    const traverse = (cats: Category[], level: number) => {
      cats.forEach((cat) => {
        if (cat.id !== exclude) {
          options.push({ id: cat.id, name: cat.name, level });
          if (cat.children) {
            traverse(cat.children, level + 1);
          }
        }
      });
    };
    
    traverse(categories, 0);
    return options;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary-900">Categories</h1>
          <p className="text-primary-500 mt-1">Manage product categories and hierarchy</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-primary-900 text-white rounded-lg hover:bg-primary-800 transition-colors"
        >
          <Plus size={20} />
          <span>Add Category</span>
        </button>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" size={20} />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-primary-200 p-4">
          <p className="text-sm text-primary-500">Total Categories</p>
          <p className="text-2xl font-bold text-primary-900">12</p>
        </div>
        <div className="bg-white rounded-lg border border-primary-200 p-4">
          <p className="text-sm text-primary-500">Active Categories</p>
          <p className="text-2xl font-bold text-green-600">11</p>
        </div>
      </div>

      {/* Categories Tree */}
      <div className="bg-white rounded-xl border border-primary-200 overflow-hidden">
        <div className="p-4 border-b border-primary-200 bg-primary-50">
          <div className="flex items-center gap-4 text-sm font-medium text-primary-600">
            <span className="w-6"></span>
            <span className="w-10"></span>
            <span className="flex-1">Category</span>
            <span className="w-20 text-center">Products</span>
            <span className="w-24 text-center">Actions</span>
          </div>
        </div>
        <div className="divide-y divide-primary-100">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => renderCategory(category))
          ) : (
            <div className="p-8 text-center">
              <FolderTree className="w-12 h-12 text-primary-300 mx-auto mb-3" />
              <p className="text-primary-500">No categories found</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-primary-200">
              <h2 className="text-lg font-semibold text-primary-900">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-primary-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-primary-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      name: e.target.value,
                      slug: generateSlug(e.target.value),
                    });
                  }}
                  className="w-full px-3 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter category name"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-primary-700 mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-primary-50"
                  placeholder="category-slug"
                />
              </div>

              {/* Parent Category */}
              <div>
                <label className="block text-sm font-medium text-primary-700 mb-1">
                  Parent Category
                </label>
                <select
                  value={formData.parentId}
                  onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                  className="w-full px-3 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">None (Top Level)</option>
                  {getParentOptions(mockCategories, editingCategory?.id).map((option) => (
                    <option key={option.id} value={option.id}>
                      {'—'.repeat(option.level)} {option.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-primary-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  placeholder="Enter category description"
                />
              </div>

              {/* Status */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-primary-600 border-primary-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="isActive" className="text-sm text-primary-700">
                  Active (visible to users)
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-primary-200">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-primary-700 hover:bg-primary-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-primary-900 text-white rounded-lg hover:bg-primary-800 transition-colors"
              >
                <Save size={18} />
                <span>{editingCategory ? 'Update' : 'Create'} Category</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
