import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Edit2, Trash2, Search, X, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  imageUrl: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
}

export default function AdminProducts() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product> | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        console.error('Expected array, got:', data);
        setProducts([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenModal = (product: Product | null = null) => {
    setCurrentProduct(product || {
      name: '',
      category: 'Shoes',
      price: 0,
      description: '',
      isAvailable: true,
      isFeatured: false
    });
    setFile(null);
    setPreview(product?.imageUrl || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentProduct(null);
    setFile(null);
    setPreview(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selected);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct) return;

    const formData = new FormData();
    formData.append('name', currentProduct.name || '');
    formData.append('category', currentProduct.category || '');
    formData.append('price', (currentProduct.price || 0).toString());
    formData.append('description', currentProduct.description || '');
    formData.append('isAvailable', String(currentProduct.isAvailable));
    formData.append('isFeatured', String(currentProduct.isFeatured));
    if (file) {
      formData.append('image', file);
    }

    const url = currentProduct.id ? `/api/products/${currentProduct.id}` : '/api/products';
    const method = currentProduct.id ? 'PUT' : 'POST';

    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percentComplete);
      } else {
        setUploadProgress(prev => Math.min((prev || 0) + 10, 90));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        setUploadProgress(100);
        setTimeout(() => {
          fetchProducts();
          handleCloseModal();
          setUploadProgress(null);
        }, 500);
      } else {
        setUploadProgress(null);
        alert('Failed to save product');
      }
    };

    xhr.onerror = () => {
      setUploadProgress(null);
      console.error('An error occurred during the transaction');
      alert('An error occurred');
    };

    setUploadProgress(0);
    xhr.send(formData);
  };

  const handleDelete = async (id: number) => {
    setProductToDelete(id);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      const res = await fetch(`/api/products/${productToDelete}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchProducts();
      } else {
        alert('Failed to delete product');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProductToDelete(null);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || p.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl font-serif text-brand-charcoal font-bold">Product Management</h1>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-brand-green hover:bg-brand-charcoal text-white px-5 py-2.5 rounded-lg flex items-center transition-colors"
        >
          <Plus size={18} className="mr-2" /> Add Product
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-celadon"
          />
        </div>
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-celadon"
        >
          <option value="All">All Categories</option>
          <option value="Shoes">Shoes</option>
          <option value="Bags">Bags</option>
          <option value="Clothing">Clothing</option>
        </select>
      </div>

      {loading ? (
        <div>Loading products...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
              <div className="h-48 bg-gray-100 relative">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <ImageIcon size={32} className="mb-2" />
                    <span className="text-sm">No image</span>
                  </div>
                )}
                {!product.isAvailable && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">Sold Out</div>
                )}
                {product.isFeatured && (
                  <div className="absolute top-3 right-3 bg-brand-rosy text-white text-xs font-bold px-2 py-1 rounded-md">Featured</div>
                )}
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-brand-charcoal truncate pr-4">{product.name}</h3>
                    <p className="text-xs text-brand-green font-medium uppercase tracking-wider">{product.category}</p>
                  </div>
                  <span className="font-bold text-lg text-brand-charcoal">₦{product.price.toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">{product.description}</p>
                <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
                  <button onClick={() => handleOpenModal(product)} className="p-2 text-gray-400 hover:text-brand-green transition-colors rounded-lg hover:bg-brand-celadon/20">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500">
              No products found matching your search.
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
              onClick={handleCloseModal}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h2 className="text-2xl font-serif font-bold text-brand-charcoal">
                  {currentProduct?.id ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                {uploadProgress !== null && (
                  <div className="mb-6 bg-brand-celadon/20 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-brand-charcoal">Uploading...</span>
                      <span className="text-sm font-bold text-brand-green">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-brand-green h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                <form id="productForm" onSubmit={handleSave} className="space-y-6">
                  
                  {/* Image Upload Area */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-brand-charcoal">Product Image</label>
                    <div 
                      className={cn(
                        "border-2 border-dashed rounded-2xl flex flex-col items-center justify-center relative overflow-hidden transition-colors cursor-pointer",
                        preview ? "border-gray-200 h-64" : "border-brand-celadon bg-brand-celadon/5 h-40 hover:bg-brand-celadon/10"
                      )}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {preview ? (
                        <>
                          <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity text-white font-medium">
                            Click to change image
                          </div>
                        </>
                      ) : (
                        <>
                          <ImageIcon size={32} className="text-brand-green mb-3" />
                          <button 
                            type="button" 
                            className="bg-brand-green hover:bg-brand-charcoal text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors mb-2 pointer-events-none"
                          >
                            Upload Image
                          </button>
                          <span className="text-xs text-gray-500">PNG, JPG up to 5MB</span>
                        </>
                      )}
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="image/*" 
                        className="hidden" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-brand-charcoal mb-2">Product Name</label>
                      <input 
                        type="text" required
                        value={currentProduct?.name}
                        onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-celadon"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-brand-charcoal mb-2">Price (₦)</label>
                      <input 
                        type="number" required min="0" step="0.01"
                        value={currentProduct?.price}
                        onChange={(e) => setCurrentProduct({...currentProduct, price: parseFloat(e.target.value)})}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-celadon"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-charcoal mb-2">Category</label>
                    <select 
                      value={currentProduct?.category}
                      onChange={(e) => setCurrentProduct({...currentProduct, category: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-celadon"
                    >
                      <option value="Shoes">Shoes</option>
                      <option value="Bags">Bags</option>
                      <option value="Clothing">Clothing</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-charcoal mb-2">Description</label>
                    <textarea 
                      required rows={3}
                      value={currentProduct?.description}
                      onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-celadon resize-none"
                    ></textarea>
                  </div>

                  <div className="flex gap-6">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={currentProduct?.isAvailable}
                        onChange={(e) => setCurrentProduct({...currentProduct, isAvailable: e.target.checked})}
                        className="rounded text-brand-green focus:ring-brand-green w-5 h-5 accent-brand-green"
                      />
                      <span className="text-sm font-medium text-gray-700">In Stock</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={currentProduct?.isFeatured}
                        onChange={(e) => setCurrentProduct({...currentProduct, isFeatured: e.target.checked})}
                        className="rounded text-brand-green focus:ring-brand-green w-5 h-5 accent-brand-green"
                      />
                      <span className="text-sm font-medium text-gray-700">Featured</span>
                    </label>
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-3xl">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  disabled={uploadProgress !== null}
                  className="px-6 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  form="productForm"
                  disabled={uploadProgress !== null}
                  className="px-6 py-2.5 rounded-xl font-medium bg-brand-green text-white hover:bg-brand-charcoal transition-colors disabled:opacity-50 flex items-center"
                >
                  {uploadProgress !== null ? 'Saving...' : (currentProduct?.id ? 'Save Changes' : 'Add Product')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {productToDelete && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
              onClick={() => setProductToDelete(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 text-center"
            >
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={32} />
              </div>
              <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Delete Product</h3>
              <p className="text-gray-500 mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
              <div className="flex gap-3 justify-center">
                <button 
                  onClick={() => setProductToDelete(null)}
                  className="px-6 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors w-full"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="px-6 py-2.5 rounded-xl font-medium bg-red-600 text-white hover:bg-red-700 transition-colors w-full"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
