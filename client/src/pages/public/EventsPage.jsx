import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin, FiUsers, FiTag } from 'react-icons/fi';
import { eventService } from '../../services/apiServices';
import { CardGridSkeleton } from '../../components/common/Loading';
import Pagination from '../../components/common/Pagination';
import { StatusBadge } from '../../components/common/Badge';
import { formatDate, getImageUrl } from '../../utils/helpers';
import { useScrollTop } from '../../hooks/useApi';

const EventCard = ({ event }) => (
  <motion.div whileHover={{ y: -4 }} className="card overflow-hidden group">
    <div className="relative h-48 overflow-hidden">
      <img
        src={getImageUrl(event.image)}
        alt={event.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      <div className="absolute top-3 left-3 flex gap-2">
        <StatusBadge status={event.status} />
        {event.isFree && <span className="badge bg-green-100 text-green-700 border border-green-200">Free</span>}
      </div>
    </div>
    <div className="p-5">
      <div className="flex items-center gap-2 text-xs text-primary-600 font-semibold mb-2 uppercase tracking-wider">
        <FiCalendar className="w-3.5 h-3.5" /> {formatDate(event.startDate)} {event.startTime && `• ${event.startTime}`}
      </div>
      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
        {event.title}
      </h3>
      <p className="text-sm text-gray-500 mb-4 line-clamp-2">{event.shortDescription || event.description?.slice(0, 120)}</p>
      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
        {event.venue && <span className="flex items-center gap-1"><FiMapPin className="w-3 h-3" />{event.venue}</span>}
        {event.maxAttendees && <span className="flex items-center gap-1"><FiUsers className="w-3 h-3" />{event.registeredAttendees || 0}/{event.maxAttendees}</span>}
      </div>
      <div className="flex items-center justify-between">
        {!event.isFree && event.ticketPrice && (
          <span className="font-bold text-gray-900">${event.ticketPrice}</span>
        )}
        <Link to={`/events/${event._id}`} className="btn-primary text-sm px-4 py-2 ml-auto">
          {event.isRegistrationOpen ? 'Register' : 'View Details'}
        </Link>
      </div>
    </div>
  </motion.div>
);

const EventsPage = () => {
  useScrollTop();
  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('upcoming');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 9 };
        if (filter === 'upcoming') params.upcoming = true;
        else if (filter === 'past') params.status = 'completed';
        const res = await eventService.getAll(params);
        setEvents(res.data.data || []);
        setPagination(res.data.pagination);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [page, filter]);

  return (
    <div>
      <div className="page-header">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white font-heading mb-4">Events</h1>
          <p className="text-primary-200 text-lg max-w-2xl mx-auto">
            Join us at fundraisers, community days, workshops, and celebrations. Every event is an opportunity to connect and contribute.
          </p>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="flex gap-2 mb-8">
          {[['upcoming', 'Upcoming'], ['past', 'Past Events'], ['', 'All Events']].map(([val, label]) => (
            <button
              key={val}
              onClick={() => { setFilter(val); setPage(1); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === val ? 'bg-primary-600 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <CardGridSkeleton count={9} />
        ) : events.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <FiCalendar className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg">No events found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((e) => <EventCard key={e._id} event={e} />)}
            </div>
            <Pagination pagination={pagination} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
