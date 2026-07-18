import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiCalendar, FiMapPin, FiClock, FiUsers, FiTag, FiCheckCircle } from 'react-icons/fi';
import { eventService } from '../../services/apiServices';
import { PageLoader } from '../../components/common/Loading';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { formatDate, getImageUrl } from '../../utils/helpers';
import { useScrollTop } from '../../hooks/useApi';

const EventDetailsPage = () => {
  useScrollTop();
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await eventService.getOne(id);
        setEvent(res.data.data.event);
      } catch (err) {
        toast.error('Event not found');
        navigate('/events');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, navigate]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await eventService.register(id, data);
      setIsRegistered(true);
      toast.success('Successfully registered for the event!');
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLoader />;
  if (!event) return null;

  const spotsLeft = event.maxAttendees > 0 ? Math.max(0, event.maxAttendees - event.registeredAttendees) : null;
  const isSoldOut = spotsLeft !== null && spotsLeft === 0;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[50vh] w-full bg-gray-900">
        {event.image && (
          <img
            src={getImageUrl(event.image)}
            alt={event.title}
            className="w-full h-full object-cover opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full">
          <div className="container-custom pb-10">
            <div className="flex gap-2 mb-4">
              <span className="badge bg-primary-500 text-white border-primary-500 capitalize">
                {event.category}
              </span>
              {event.isFree && (
                <span className="badge bg-green-500 text-white border-green-500">Free Event</span>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white font-heading mb-4 max-w-4xl">
              {event.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="container-custom mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About This Event</h2>
              <div
                className="prose prose-primary max-w-none text-gray-600"
                dangerouslySetInnerHTML={{ __html: event.description }}
              />
            </div>
          </div>

          {/* Sidebar / Registration */}
          <div className="lg:col-span-1 space-y-6">
            <div className="card p-6 border-t-4 border-primary-500">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Event Details</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                    <FiCalendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Date</p>
                    <p className="text-sm text-gray-600">{formatDate(event.startDate)}</p>
                  </div>
                </div>
                {(event.startTime || event.endTime) && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                      <FiClock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Time</p>
                      <p className="text-sm text-gray-600">
                        {event.startTime} {event.endTime && `- ${event.endTime}`}
                      </p>
                    </div>
                  </div>
                )}
                {event.venue && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                      <FiMapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Venue</p>
                      <p className="text-sm text-gray-600">{event.venue}</p>
                      {event.location && <p className="text-xs text-gray-500 mt-0.5">{event.location}</p>}
                    </div>
                  </div>
                )}
                {event.maxAttendees > 0 && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                      <FiUsers className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Availability</p>
                      <p className="text-sm text-gray-600">
                        {spotsLeft} spots remaining
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="card p-6 bg-white shadow-xl shadow-primary-500/5 ring-1 ring-primary-100">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Registration</h3>
              {!event.isFree && event.ticketPrice && (
                <p className="text-3xl font-bold text-primary-600 mb-6">${event.ticketPrice}</p>
              )}
              
              {!event.isRegistrationOpen ? (
                <div className="p-4 bg-gray-50 rounded-xl text-center border border-gray-200 text-gray-600 font-medium">
                  Registration is currently closed
                </div>
              ) : isSoldOut ? (
                <div className="p-4 bg-red-50 rounded-xl text-center border border-red-200 text-red-600 font-medium">
                  Sorry, this event is sold out!
                </div>
              ) : isRegistered ? (
                <div className="p-6 bg-green-50 rounded-xl text-center border border-green-200">
                  <FiCheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <h4 className="text-lg font-bold text-green-800 mb-1">You're In!</h4>
                  <p className="text-sm text-green-700">Thank you for registering. We look forward to seeing you there.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
                  <Input 
                    label="Full Name" 
                    required 
                    error={errors.name?.message}
                    {...register('name', { required: 'Name is required' })} 
                  />
                  <Input 
                    label="Email Address" 
                    type="email"
                    required 
                    error={errors.email?.message}
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                    })} 
                  />
                  <Input 
                    label="Phone Number" 
                    {...register('phone')} 
                  />
                  <Input 
                    label="Number of Tickets" 
                    type="number" 
                    min={1} 
                    max={spotsLeft || 10}
                    defaultValue={1}
                    {...register('tickets', { 
                      valueAsNumber: true,
                      min: { value: 1, message: 'At least 1 ticket' },
                      max: spotsLeft ? { value: spotsLeft, message: `Only ${spotsLeft} spots left` } : undefined
                    })}
                    error={errors.tickets?.message}
                  />
                  <Button type="submit" className="w-full h-12 text-lg mt-2" loading={submitting}>
                    Complete Registration
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
