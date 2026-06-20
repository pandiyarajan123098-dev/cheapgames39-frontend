import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Admin = () => {
 const { user, accessToken } = useAuth();
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
const [formData, setFormData] = useState({
  title: '',
  description: '',
  steam_price: '',
  price: '',
  category_id: '',
  image_url: '',
  is_new: false,
  is_bundle: false,
  in_stock: true,
  display_order: "",
});

useEffect(() => {
  if (!user) {
    navigate("/");
    return;
  }

  fetchGames();
  fetchCategories();
}, [user, navigate]);

const fetchGames = async () => {
  const res = await axios.get(`${API}/games`);
  console.log("Fetched Games:", res.data);
  setGames(res.data);
};

  const fetchCategories = async () => {
    const res = await axios.get(`${API}/categories`);
    setCategories(res.data);
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("Sending Full Data:", {
  ...formData,
  is_new: formData.is_new,
  is_bundle: formData.is_bundle
});

  try {

      if (editingGame) {
 await axios.put(`${API}/games/${editingGame.id}`, {
  title: formData.title,
  description: formData.description,
  steam_price: parseFloat(formData.steam_price),
  price: parseFloat(formData.price),
  category_id: formData.category_id,
  image_url: formData.image_url,
  is_new: formData.is_new,
  is_bundle: formData.is_bundle,
  in_stock: formData.in_stock,
  display_order: parseInt(formData.display_order),
}, {
  headers: { Authorization: `Bearer ${accessToken}` }
});
        toast.success('Game updated successfully!');
      } else {
 await axios.post(`${API}/games`, {
  title: formData.title,
  description: formData.description,
  steam_price: parseFloat(formData.steam_price),
  price: parseFloat(formData.price),
  category_id: formData.category_id,
  image_url: formData.image_url,
  is_new: formData.is_new,
  is_bundle: formData.is_bundle,
  in_stock: formData.in_stock,
   display_order: parseInt(formData.display_order),
}, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        toast.success('Game added successfully!');
      }
      setShowModal(false);
      setEditingGame(null);
 setFormData({
  title: '',
  description: '',
  steam_price: '',
  price: '',
  category_id: '',
  image_url: '',
  is_new: false,
  is_bundle: false,
  in_stock: true
});

     await fetchGames();
    } catch (error) {
  console.log("Save error:", error.response?.data || error.message);
  toast.error("Failed to save game");
}
  };

  const handleEdit = (game) => {
    setEditingGame(game);
setFormData({
  title: game.title,
  description: game.description,
  steam_price: game.steam_price?.toString() || "",
  price: game.price.toString(),
  category_id: game.category_id.toString(),
  image_url: game.image_url,
  is_new: game.is_new ?? false,
  is_bundle: game.is_bundle ?? false,
  in_stock: game.in_stock ?? true
});
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this game?')) return;
    try {
      await axios.delete(`${API}/games/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      toast.success('Game deleted!');
      fetchGames();
    } catch (error) {
      toast.error('Failed to delete game');
    }
  };

  const handleAddNew = () => {
    setEditingGame(null);
 setFormData({
  title: '',
  description: '',
  steam_price: '',
  price: '',
  category_id: '',
  image_url: '',
  is_new: false,
  is_bundle: false,
  in_stock: true
});

    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] pt-24 pb-20 px-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tighter uppercase" style={{ fontFamily: 'Rajdhani, sans-serif' }} data-testid="admin-page-title">
            Admin <span className="text-[#B50000]">Panel</span>
          </h1>
          <button
            onClick={handleAddNew}
            className="bg-[#B50000] hover:bg-[#FF0000] text-white rounded-full px-4 md:px-8 py-3 font-bold transition-all flex items-center"
            data-testid="add-game-button"
          >
            <Plus className="w-5 h-5 mr-2" /> Add Game
          </button>
        </div>

       <div className="bg-[#1a1a1a] border border-white/10 rounded-xl overflow-x-auto" data-testid="games-table">
          <table className="w-full">
            <thead className="bg-[#141414] border-b border-white/10">
              <tr>
                <th className="hidden md:table-cell text-left p-4 text-sm font-semibold text-gray-400">ID
</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-400">Title</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-400">Category</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-400">Price</th>
                
                <th className="text-center p-4 text-sm font-semibold text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {games.map(game => (
                <tr key={game.id} className="border-b border-white/5 hover:bg-white/5" data-testid={`admin-game-row-${game.id}`}>
                 <td className="hidden md:table-cell p-4 text-gray-400">
  {game.id}
</td>
                 <td className="p-4 text-sm md:text-base">
  {game.title}
</td>
                  <td className="p-4 text-gray-400">{game.categories?.name}</td>
                  <td className="p-4 font-semibold">₹{game.price}</td>
             
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(game)}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                        data-testid={`edit-game-${game.id}`}
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(game.id)}
                        className="text-[#B50000] hover:text-[#FF0000] transition-colors"
                        data-testid={`delete-game-${game.id}`}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6" data-testid="game-modal">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">{editingGame ? 'Edit Game' : 'Add New Game'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full bg-[#141414] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#B50000] focus:ring-1 focus:ring-[#B50000] outline-none"
                  data-testid="game-title-input"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={4}
                  className="w-full bg-[#141414] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#B50000] focus:ring-1 focus:ring-[#B50000] outline-none"
                  data-testid="game-description-input"
                />
              </div>

              <div>
  <label className="block text-sm text-gray-400 mb-2">
    Steam Price (₹)
  </label>

  <input
    type="number"
    value={formData.steam_price}
    onChange={(e) =>
      setFormData({
        ...formData,
        steam_price: e.target.value,
      })
    }
    required
    className="w-full bg-[#141414] border border-white/10 rounded-lg px-4 py-3 text-white"
  />
</div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    className="w-full bg-[#141414] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#B50000] focus:ring-1 focus:ring-[#B50000] outline-none"
                    data-testid="game-price-input"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Category</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    required
                    className="w-full bg-[#141414] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#B50000] focus:ring-1 focus:ring-[#B50000] outline-none"
                    data-testid="game-category-select"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Image URL</label>
                <div className="flex gap-6 mt-4">

  <label className="flex items-center gap-2 text-white">
    <input
  type="checkbox"
  name="is_new"
  checked={formData.is_new}
      onChange={(e) =>
        setFormData({
          ...formData,
          is_new: e.target.checked
        })
      }
    />
    New Arrival
  </label>

  <label className="flex items-center gap-2 text-white">
   <input
  type="checkbox"
  name="is_bundle"
  checked={formData.is_bundle}
      onChange={(e) =>
        setFormData({
          ...formData,
          is_bundle: e.target.checked
        })
      }
    />
    Bundle Pack
  </label>

<label className="flex items-center gap-2 text-white">
  <input
    type="checkbox"
    checked={formData.in_stock}
    onChange={(e) =>
      setFormData({
        ...formData,
        in_stock: e.target.checked
      })
    }
  />
  In Stock
</label>

</div>

<div>
  <label className="block text-sm text-gray-400 mb-2">
    Display Order
  </label>

  <input
    type="number"
    value={formData.display_order}
    onChange={(e) =>
      setFormData({
        ...formData,
        display_order: e.target.value,
      })
    }
    className="w-full bg-[#141414] border border-white/10 rounded-lg px-4 py-3 text-white"
  />
</div>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  required
                  className="w-full bg-[#141414] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#B50000] focus:ring-1 focus:ring-[#B50000] outline-none"
                  data-testid="game-image-input"
                />
              </div>
           
              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-[#B50000] hover:bg-[#FF0000] text-white rounded-full py-3 font-bold transition-all"
                  data-testid="save-game-button"
                >
                  {editingGame ? 'Update Game' : 'Add Game'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-transparent border border-white/20 hover:border-white/40 text-white rounded-full py-3 font-medium transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;