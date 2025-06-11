import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CheckCircle, XCircle, MessageSquare, ThumbsUp, Trash2 } from 'lucide-react';

function TestimonialsManager({ userId }) {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // pending, approved, all

  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true);
      try {
        const testimonialsQuery = query(
          collection(db, "testimonials"),
          where("receiverId", "==", userId),
          orderBy("createdAt", "desc")
        );
        
        const testimonialsSnapshot = await getDocs(testimonialsQuery);
        const testimonialsData = testimonialsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setTestimonials(testimonialsData);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchTestimonials();
    }
  }, [userId]);

  const handleApprove = async (testimonialId) => {
    try {
      await updateDoc(doc(db, "testimonials", testimonialId), {
        isApproved: true
      });
      
      // Update local state
      setTestimonials(prev => 
        prev.map(t => t.id === testimonialId ? { ...t, isApproved: true } : t)
      );
    } catch (error) {
      console.error('Error approving testimonial:', error);
    }
  };

  const handleDelete = async (testimonialId) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
    
    try {
      await deleteDoc(doc(db, "testimonials", testimonialId));
      
      // Update local state
      setTestimonials(prev => prev.filter(t => t.id !== testimonialId));
    } catch (error) {
      console.error('Error deleting testimonial:', error);
    }
  };

  const filteredTestimonials = testimonials.filter(t => {
    if (activeTab === 'pending') return !t.isApproved;
    if (activeTab === 'approved') return t.isApproved;
    return true; // 'all' tab
  });

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Manage Testimonials</h3>
        <div className="flex rounded-md shadow-sm">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'pending'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:text-gray-900'
            } border border-gray-300 rounded-l-md`}
          >
            Pending
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'approved'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:text-gray-900'
            } border-t border-b border-gray-300`}
          >
            Approved
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:text-gray-900'
            } border border-gray-300 rounded-r-md`}
          >
            All
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent"></div>
        </div>
      ) : filteredTestimonials.length === 0 ? (
        <div className="text-center py-8 border rounded-lg bg-gray-50">
          <MessageSquare className="mx-auto h-10 w-10 text-gray-400" />
          <p className="mt-2 text-gray-500">
            {activeTab === 'pending' ? 'No pending testimonials' : 
              activeTab === 'approved' ? 'No approved testimonials yet' :
              'No testimonials yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTestimonials.map(testimonial => (
            <div
              key={testimonial.id}
              className={`border rounded-lg p-4 ${
                testimonial.isApproved ? 'bg-white' : 'bg-amber-50'
              }`}
            >
              <div className="flex justify-between">
                <div className="flex items-start space-x-3">
                  {testimonial.senderPhoto ? (
                    <img
                      src={testimonial.senderPhoto}
                      alt={testimonial.senderName}
                      className="h-10 w-10 rounded-full"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-medium">
                      {testimonial.senderName ? testimonial.senderName.charAt(0).toUpperCase() : '?'}
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium">{testimonial.senderName}</h4>
                    <p className="text-gray-600 mt-1">{testimonial.text}</p>
                    <div className="text-xs text-gray-500 mt-2">
                      {testimonial.createdAt?.toDate().toLocaleDateString() || 'Recent'}
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  {!testimonial.isApproved && (
                    <button
                      onClick={() => handleApprove(testimonial.id)}
                      className="text-green-600 hover:text-green-900"
                      aria-label="Approve testimonial"
                    >
                      <CheckCircle size={20} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(testimonial.id)}
                    className="text-red-600 hover:text-red-900"
                    aria-label="Delete testimonial"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
              
              {testimonial.isApproved && (
                <div className="mt-2 flex items-center text-xs text-green-600">
                  <ThumbsUp size={14} className="mr-1" />
                  <span>Approved</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TestimonialsManager; 