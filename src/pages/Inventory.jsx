import { useState } from 'react';
import { Package, AlertTriangle, TrendingUp, TrendingDown, Plus, Edit2, Trash2, Search, Filter, Download, Upload, BarChart3, PackageOpen, Truck, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Sample inventory data
  const [inventory, setInventory] = useState([
    {
      id: 1,
      name: 'Heavy Duty Trash Bags',
      category: 'supplies',
      sku: 'HDTB-001',
      quantity: 500,
      unit: 'pieces',
      minStock: 100,
      maxStock: 1000,
      status: 'in-stock',
      location: 'Warehouse A',
      supplier: 'Clean Supplies Co.',
      lastRestocked: '2024-03-01',
      unitCost: 2.50,
      totalValue: 1250
    },
    {
      id: 2,
      name: 'Recycling Bins',
      category: 'equipment',
      sku: 'RB-002',
      quantity: 25,
      unit: 'units',
      minStock: 10,
      maxStock: 50,
      status: 'low-stock',
      location: 'Warehouse B',
      supplier: 'Eco Equipment Ltd.',
      lastRestocked: '2024-02-15',
      unitCost: 150.00,
      totalValue: 3750
    },
    {
      id: 3,
      name: 'Safety Gloves',
      category: 'safety',
      sku: 'SG-003',
      quantity: 200,
      unit: 'pairs',
      minStock: 50,
      maxStock: 500,
      status: 'in-stock',
      location: 'Warehouse A',
      supplier: 'Safety First Inc.',
      lastRestocked: '2024-02-28',
      unitCost: 5.75,
      totalValue: 1150
    },
    {
      id: 4,
      name: 'Chemical Disinfectant',
      category: 'chemicals',
      sku: 'CD-004',
      quantity: 15,
      unit: 'liters',
      minStock: 20,
      maxStock: 100,
      status: 'out-of-stock',
      location: 'Chemical Storage',
      supplier: 'ChemCo Solutions',
      lastRestocked: '2024-01-20',
      unitCost: 25.00,
      totalValue: 0
    },
    {
      id: 5,
      name: 'Collection Trolley',
      category: 'equipment',
      sku: 'CT-005',
      quantity: 8,
      unit: 'units',
      minStock: 5,
      maxStock: 20,
      status: 'in-stock',
      location: 'Warehouse B',
      supplier: 'Industrial Equipment Co.',
      lastRestocked: '2024-03-05',
      unitCost: 450.00,
      totalValue: 3600
    }
  ]);

  // New item form state
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'supplies',
    sku: '',
    quantity: 0,
    unit: 'pieces',
    minStock: 0,
    maxStock: 100,
    location: '',
    supplier: '',
    unitCost: 0
  });

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'supplies', label: 'Supplies' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'safety', label: 'Safety Equipment' },
    { value: 'chemicals', label: 'Chemicals' },
    { value: 'tools', label: 'Tools' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'in-stock', label: 'In Stock' },
    { value: 'low-stock', label: 'Low Stock' },
    { value: 'out-of-stock', label: 'Out of Stock' }
  ];

  const addNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'in-stock': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'low-stock': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'out-of-stock': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'in-stock': return 'bg-green-100 text-green-800';
      case 'low-stock': return 'bg-yellow-100 text-yellow-800';
      case 'out-of-stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockLevel = (item) => {
    const percentage = (item.quantity / item.maxStock) * 100;
    if (percentage >= 50) return { level: 'good', color: 'bg-green-500' };
    if (percentage >= 25) return { level: 'warning', color: 'bg-yellow-500' };
    return { level: 'danger', color: 'bg-red-500' };
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.sku || newItem.quantity <= 0) {
      addNotification('Please fill all required fields', 'error');
      return;
    }

    const item = {
      ...newItem,
      id: Date.now(),
      status: newItem.quantity > 0 ? 'in-stock' : 'out-of-stock',
      totalValue: newItem.quantity * newItem.unitCost,
      lastRestocked: new Date().toISOString().split('T')[0]
    };

    setInventory([...inventory, item]);
    setNewItem({
      name: '',
      category: 'supplies',
      sku: '',
      quantity: 0,
      unit: 'pieces',
      minStock: 0,
      maxStock: 100,
      location: '',
      supplier: '',
      unitCost: 0
    });
    setShowAddModal(false);
    addNotification('Item added successfully!', 'success');
  };

  const handleEditItem = () => {
    if (!selectedItem) return;

    const updatedInventory = inventory.map(item =>
      item.id === selectedItem.id
        ? {
            ...selectedItem,
            status: selectedItem.quantity > 0 ? 'in-stock' : 'out-of-stock',
            totalValue: selectedItem.quantity * selectedItem.unitCost
          }
        : item
    );

    setInventory(updatedInventory);
    setShowEditModal(false);
    setSelectedItem(null);
    addNotification('Item updated successfully!', 'success');
  };

  const handleDeleteItem = (id) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setInventory(inventory.filter(item => item.id !== id));
      addNotification('Item deleted successfully!', 'success');
    }
  };

  const handleRestock = (id) => {
    const item = inventory.find(item => item.id === id);
    if (item) {
      setSelectedItem({ ...item, quantity: item.maxStock });
      setShowEditModal(true);
    }
  };

  const totalValue = inventory.reduce((sum, item) => sum + item.totalValue, 0);
  const lowStockItems = inventory.filter(item => item.status === 'low-stock').length;
  const outOfStockItems = inventory.filter(item => item.status === 'out-of-stock').length;

  return (
    <div className="space-y-6">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg shadow-lg text-white ${
              notification.type === 'success' ? 'bg-green-600' : 
              notification.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
            }`}
          >
            {notification.message}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="mt-2 text-gray-600">Track and manage waste management supplies and equipment</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{inventory.length}</p>
            </div>
            <Package className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">${totalValue.toFixed(2)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-yellow-600">{lowStockItems}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">{outOfStockItems}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInventory.map((item) => {
                const stockLevel = getStockLevel(item);
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 capitalize">{item.category}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${stockLevel.color}`}
                            style={{ width: `${Math.min((item.quantity / item.maxStock) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">
                          {item.quantity} {item.unit}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Min: {item.minStock} | Max: {item.maxStock}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.supplier}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${item.totalValue.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(item.status)}
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(item.status)}`}>
                          {item.status.replace('-', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setShowEditModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        {item.status !== 'in-stock' && (
                          <button
                            onClick={() => handleRestock(item.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Restock"
                          >
                            <PackageOpen className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Item</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
                  <input
                    type="text"
                    value={newItem.sku}
                    onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={newItem.category}
                      onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      {categories.filter(cat => cat.value !== 'all').map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                    <input
                      type="text"
                      value={newItem.unit}
                      onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                    <input
                      type="number"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Stock</label>
                    <input
                      type="number"
                      value={newItem.minStock}
                      onChange={(e) => setNewItem({ ...newItem, minStock: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Stock</label>
                    <input
                      type="number"
                      value={newItem.maxStock}
                      onChange={(e) => setNewItem({ ...newItem, maxStock: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={newItem.location}
                      onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                    <input
                      type="text"
                      value={newItem.supplier}
                      onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit Cost ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newItem.unitCost}
                    onChange={(e) => setNewItem({ ...newItem, unitCost: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddItem}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Add Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {showEditModal && selectedItem && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Item</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                  <input
                    type="text"
                    value={selectedItem.name}
                    onChange={(e) => setSelectedItem({ ...selectedItem, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      value={selectedItem.quantity}
                      onChange={(e) => setSelectedItem({ ...selectedItem, quantity: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit Cost ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={selectedItem.unitCost}
                      onChange={(e) => setSelectedItem({ ...selectedItem, unitCost: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Stock</label>
                    <input
                      type="number"
                      value={selectedItem.minStock}
                      onChange={(e) => setSelectedItem({ ...selectedItem, minStock: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Stock</label>
                    <input
                      type="number"
                      value={selectedItem.maxStock}
                      onChange={(e) => setSelectedItem({ ...selectedItem, maxStock: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedItem(null);
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditItem}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Update Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
