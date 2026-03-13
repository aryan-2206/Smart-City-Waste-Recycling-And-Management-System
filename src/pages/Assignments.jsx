import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, MapPin, Clock, User, CheckCircle, AlertCircle, Filter, Search, Plus, Edit2, Eye, Phone, MessageSquare } from 'lucide-react';

const assignments = [
  { 
    id: 1, 
    binId: 'B-042', 
    area: 'North Sector', 
    driver: 'Driver 07', 
    driverName: 'Raj Kumar',
    status: 'assigned', 
    priority: 'high',
    reportedTime: '5 mins ago',
    estimatedTime: '30 mins',
    wasteType: 'Mixed',
    location: 'Near Main Market'
  },
  { 
    id: 2, 
    binId: 'B-018', 
    area: 'East Zone', 
    driver: 'Driver 03', 
    driverName: 'Amit Singh',
    status: 'enroute', 
    priority: 'medium',
    reportedTime: '12 mins ago',
    estimatedTime: '15 mins',
    wasteType: 'Dry',
    location: 'Commercial Complex'
  },
  { 
    id: 3, 
    binId: 'B-091', 
    area: 'Central', 
    driver: 'Driver 12', 
    driverName: 'Priya Patel',
    status: 'assigned', 
    priority: 'low',
    reportedTime: '25 mins ago',
    estimatedTime: '45 mins',
    wasteType: 'Recyclable',
    location: 'City Center'
  },
  { 
    id: 4, 
    binId: 'B-055', 
    area: 'South Block', 
    driver: null, 
    driverName: null,
    status: 'pending', 
    priority: 'urgent',
    reportedTime: '1 hour ago',
    estimatedTime: '—',
    wasteType: 'Hazardous',
    location: 'Industrial Area'
  },
  { 
    id: 5, 
    binId: 'B-076', 
    area: 'West District', 
    driver: 'Driver 05', 
    driverName: 'Mohammed Ali',
    status: 'completed', 
    priority: 'medium',
    reportedTime: '2 hours ago',
    estimatedTime: 'Completed',
    wasteType: 'Wet',
    location: 'Residential Area'
  },
];

const availableDrivers = [
  { id: 'Driver 01', name: 'Vikram Sharma', status: 'available', truck: 'TRK-001', capacity: '5 tons' },
  { id: 'Driver 02', name: 'Sunita Reddy', status: 'busy', truck: 'TRK-002', capacity: '3 tons' },
  { id: 'Driver 04', name: 'Karan Mehta', status: 'available', truck: 'TRK-004', capacity: '5 tons' },
  { id: 'Driver 06', name: 'Anjali Gupta', status: 'available', truck: 'TRK-006', capacity: '4 tons' },
  { id: 'Driver 08', name: 'Rohit Verma', status: 'busy', truck: 'TRK-008', capacity: '5 tons' },
];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  assigned: 'bg-blue-100 text-blue-800',
  enroute: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-orange-100 text-orange-800',
  high: 'bg-red-100 text-red-800',
  urgent: 'bg-red-200 text-red-900'
};

export default function Assignments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.binId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (assignment.driverName && assignment.driverName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || assignment.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || assignment.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleAssignDriver = async (assignmentId, driverId) => {
    if (!driverId) {
      alert('Please select a driver');
      return;
    }
    
    setIsAssigning(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update assignment in localStorage
      const storedAssignments = JSON.parse(localStorage.getItem('assignments') || JSON.stringify(assignments));
      const assignmentIndex = storedAssignments.findIndex(a => a.id === assignmentId);
      if (assignmentIndex !== -1) {
        const driver = availableDrivers.find(d => d.id === driverId);
        storedAssignments[assignmentIndex] = {
          ...storedAssignments[assignmentIndex],
          driver: driverId,
          driverName: driver.name,
          status: 'assigned'
        };
        localStorage.setItem('assignments', JSON.stringify(storedAssignments));
      }
      
      addNotification(`Driver ${driverId} assigned successfully!`, 'success');
      setShowAssignModal(false);
      setSelectedDriver('');
    } catch (error) {
      console.error('Error assigning driver:', error);
      addNotification('Failed to assign driver. Please try again.', 'error');
    } finally {
      setIsAssigning(false);
    }
  };

  const addNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  const handleNewAssignment = () => {
    // Navigate to report page to create new assignment
    navigate('/report');
  };

  const handleCallDriver = (driverName) => {
    alert(`Calling driver: ${driverName}`);
  };

  const handleMessageDriver = (driverName) => {
    alert(`Opening message app for driver: ${driverName}`);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'assigned': return <User className="h-4 w-4" />;
      case 'enroute': return <Truck className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Waste Collection Assignments</h1>
          <p className="mt-2 text-gray-600">Manage and monitor waste collection assignments across the city</p>
        </div>
        <button 
          onClick={handleNewAssignment}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Assignment
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{assignments.filter(a => a.status === 'pending').length}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Assigned</p>
              <p className="text-2xl font-bold text-blue-600">{assignments.filter(a => a.status === 'assigned').length}</p>
            </div>
            <User className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">En Route</p>
              <p className="text-2xl font-bold text-purple-600">{assignments.filter(a => a.status === 'enroute').length}</p>
            </div>
            <Truck className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Today</p>
              <p className="text-2xl font-bold text-green-600">{assignments.filter(a => a.status === 'completed').length}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
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
                placeholder="Search by bin ID, area, or driver..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="assigned">Assigned</option>
              <option value="enroute">En Route</option>
              <option value="completed">Completed</option>
            </select>
            
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Assignments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assignment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Driver
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAssignments.map((assignment) => (
                <tr key={assignment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{assignment.binId}</p>
                      <p className="text-xs text-gray-500">{assignment.wasteType}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                      <div>
                        <p className="text-sm text-gray-900">{assignment.area}</p>
                        <p className="text-xs text-gray-500">{assignment.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {assignment.driver ? (
                      <div>
                        <p className="text-sm font-medium text-gray-900">{assignment.driverName}</p>
                        <p className="text-xs text-gray-500">{assignment.driver}</p>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">Unassigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[assignment.status]}`}>
                      {getStatusIcon(assignment.status)}
                      <span className="ml-1">{assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[assignment.priority]}`}>
                      {assignment.priority.charAt(0).toUpperCase() + assignment.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>
                      <p>{assignment.reportedTime}</p>
                      <p className="text-xs">{assignment.estimatedTime}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setSelectedAssignment(assignment)}
                        className="text-green-600 hover:text-green-900"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {assignment.driver && (
                        <>
                          <button 
                            onClick={() => handleCallDriver(assignment.driverName)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Call Driver"
                          >
                            <Phone className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleMessageDriver(assignment.driverName)}
                            className="text-green-600 hover:text-green-900"
                            title="Message Driver"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      {!assignment.driver && (
                        <button 
                          onClick={() => setShowAssignModal(true)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Assign Driver"
                        >
                          <User className="h-4 w-4" />
                        </button>
                      )}
                      <button 
                        className="text-gray-600 hover:text-gray-900"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Available Drivers */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Drivers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableDrivers.filter(driver => driver.status === 'available').map((driver) => (
            <div key={driver.id} className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium text-gray-900">{driver.name}</p>
                  <p className="text-sm text-gray-500">{driver.id}</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Available
                </span>
              </div>
              <div className="text-sm text-gray-600">
                <p>Truck: {driver.truck}</p>
                <p>Capacity: {driver.capacity}</p>
              </div>
              <button 
                onClick={() => handleAssignDriver('selected-assignment', driver.id)}
                className="mt-3 w-full bg-green-600 text-white py-1 px-3 rounded text-sm hover:bg-green-700 transition-colors"
              >
                Assign to Task
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Assignment Detail Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Assignment Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Bin ID</p>
                  <p className="text-sm text-gray-900">{selectedAssignment.binId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="text-sm text-gray-900">{selectedAssignment.area} - {selectedAssignment.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Waste Type</p>
                  <p className="text-sm text-gray-900">{selectedAssignment.wasteType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Priority</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[selectedAssignment.priority]}`}>
                    {selectedAssignment.priority.charAt(0).toUpperCase() + selectedAssignment.priority.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Driver</p>
                  <p className="text-sm text-gray-900">{selectedAssignment.driverName || 'Unassigned'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[selectedAssignment.status]}`}>
                    {selectedAssignment.status.charAt(0).toUpperCase() + selectedAssignment.status.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Reported Time</p>
                  <p className="text-sm text-gray-900">{selectedAssignment.reportedTime}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Estimated Time</p>
                  <p className="text-sm text-gray-900">{selectedAssignment.estimatedTime}</p>
                </div>
              </div>
              <div className="mt-6 flex justify-between">
                <div className="space-x-2">
                  {selectedAssignment.driver && (
                    <>
                      <button 
                        onClick={() => handleCallDriver(selectedAssignment.driverName)}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        Call Driver
                      </button>
                      <button 
                        onClick={() => handleMessageDriver(selectedAssignment.driverName)}
                        className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                      >
                        Message
                      </button>
                    </>
                  )}
                </div>
                <div className="space-x-2">
                  <button 
                    onClick={() => setSelectedAssignment(null)}
                    className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                  >
                    Close
                  </button>
                  {!selectedAssignment.driver && (
                    <button 
                      onClick={() => {
                        setShowAssignModal(true);
                        setSelectedAssignment(null);
                      }}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                    >
                      Assign Driver
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Driver Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Assign Driver</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Driver
                </label>
                <select
                  value={selectedDriver}
                  onChange={(e) => setSelectedDriver(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Choose a driver...</option>
                  {availableDrivers.filter(driver => driver.status === 'available').map(driver => (
                    <option key={driver.id} value={driver.id}>
                      {driver.name} - {driver.truck} ({driver.capacity})
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button 
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedDriver('');
                  }}
                  disabled={isAssigning}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleAssignDriver('selected-assignment', selectedDriver)}
                  disabled={isAssigning || !selectedDriver}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isAssigning ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Assigning...
                    </>
                  ) : (
                    'Assign Driver'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
