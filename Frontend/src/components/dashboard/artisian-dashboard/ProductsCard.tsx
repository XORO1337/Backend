import React, { useState } from 'react';
import { Eye, Plus, Edit3, Trash2 } from 'lucide-react';
import { Product } from './types';

interface ProductsCardProps {
  products: Product[];
  onAddNew?: (newProduct: Omit<Product, 'id'>) => void;
  onEdit?: (productId: number) => void;
  onDelete?: (productId: number) => void;
}


const ProductsCard: React.FC<ProductsCardProps> = ({ 
  products, 
  onAddNew, 
  onEdit, 
  onDelete 
}) => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', price: '', stock: '', image: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.price && form.stock && imageFile) {
      // TODO: Replace this with your actual upload logic
      // Example: upload imageFile to server or cloud storage, get URL
      // For now, we'll use the preview URL as a placeholder
      const uploadedImageUrl = imagePreview;
      onAddNew?.({
        name: form.name,
        price: Number(form.price),
        stock: Number(form.stock),
        image: uploadedImageUrl
      });
      setForm({ name: '', price: '', stock: '', image: '' });
      setImageFile(null);
      setImagePreview('');
      setShowModal(false);
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-purple-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
          <Eye className="w-5 h-5 mr-2 text-purple-600" />
          My Products
        </h3>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New</span>
        </button>
      </div>

      <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
        {products.map((product) => (
          <div key={product.id} className="flex items-center space-x-4 p-4 bg-white/50 rounded-xl border border-purple-50">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-12 h-12 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h4 className="font-medium text-gray-800">{product.name}</h4>
              <p className="text-sm text-gray-600">${product.price} • {product.stock} in stock</p>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => onEdit?.(product.id)}
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => onDelete?.(product.id)}
                className="p-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Add New Product */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-xl p-8 shadow-lg w-full max-w-md">
            <h4 className="text-lg font-semibold mb-4">Add New Product</h4>
            <form onSubmit={handleAdd} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={form.name}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                required
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={form.price}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                required
                min="0"
              />
              <input
                type="number"
                name="stock"
                placeholder="Stock"
                value={form.stock}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                required
                min="0"
              />
              <div>
                <label className="block mb-1 font-medium">Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mt-2 w-24 h-24 object-cover rounded-lg border"
                  />
                )}
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductsCard;