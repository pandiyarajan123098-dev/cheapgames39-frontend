import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Admin = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category_id: '',
    image_url: '',
    rating: '4.5'
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchGames();
    fetchCategories();
  }, [user]);

  const fetchGames = async () => {
    const res = await axios.get(`${API}/games?limit=100`);
    setGames(res.data.games);
  };

  const fetchCategories = async () => {
    const res = await axios.get(`${API}/categories`);
    setCategories(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingGame) {
        await axios.put(`${API}/games/${editingGame.id}`, {
          ...formData,
          price: parseFloat(formData.price),
          category_id: parseInt(formData.category_id),
          rating: parseFloat(formData.rating)
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Game updated successfully!');
      } else {
        await axios.post(`${API}/games`, {
          ...formData,
          price: parseFloat(formData.price),
          category_id: parseInt(formData.category_id),
          rating: parseFloat(formData.rating)
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Game added successfully!');
      }
      setShowModal(false);
      setEditingGame(null);
      setFormData({ title: '', description: '', price: '', category_id: '', image_url: '', rating: '4.5' });
      fetchGames();
    } catch (error) {
      toast.error('Failed to save game');
    }
  };

  const handleEdit = (game) => {
    setEditingGame(game);
    setFormData({
      title: game.title,
      description: game.description,
      price: game.price.toString(),
      category_id: game.category_id.toString(),
      image_url: game.image_url,
      rating: game.rating.toString()
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this game?')) return;
    try {
      await axios.delete(`${API}/games/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Game deleted!');
      fetchGames();
    } catch (error) {
      toast.error('Failed to delete game');
    }
  };

  const handleAddNew = () => {
    setEditingGame(null);
    setFormData({ title: '', description: '', price: '', category_id: '', image_url: '', rating: '4.5' });
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] pt-24 pb-20 px-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase" style={{ fontFamily: 'Rajdhani, sans-serif' }} data-testid="admin-page-title">
            Admin <span className="text-[#B50000]">Panel</span>
          </h1>
          <button
            onClick={handleAddNew}
            className="bg-[#B50000] hover:bg-[#FF0000] text-white rounded-full px-8 py-3 font-bold transition-all flex items-center"
            data-testid="add-game-button"
          >
            <Plus className="w-5 h-5 mr-2" /> Add Game
          </button>
        </div>

        <div className="bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden" data-testid="games-table">
          <table className="w-full">
            <thead className="bg-[#141414] border-b border-white/10">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-gray-400">ID</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-400">Title</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-400">Category</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-400">Price</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-400">Rating</th>
                <th className="text-center p-4 text-sm font-semibold text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {games.map(game => (
                <tr key={game.id} className="border-b border-white/5 hover:bg-white/5" data-testid={`admin-game-row-${game.id}`}>
                  <td className="p-4 text-gray-400">{game.id}</td>
                  <td className="p-4">{game.title}</td>
                  <td className="p-4 text-gray-400">{game.categories?.name}</td>
                  <td className="p-4 font-semibold">₹{game.price}</td>
                  <td className="p-4 text-gray-400">{game.rating}</td>
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
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  required
                  className="w-full bg-[#141414] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#B50000] focus:ring-1 focus:ring-[#B50000] outline-none"
                  data-testid="game-image-input"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Rating (1-5)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  required
                  className="w-full bg-[#141414] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#B50000] focus:ring-1 focus:ring-[#B50000] outline-none"
                  data-testid="game-rating-input"
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