import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiUser } from 'react-icons/fi';
import { newsService } from '../../services/apiServices';
import { PageLoader } from '../../components/common/Loading';
import { getImageUrl, formatDate } from '../../utils/helpers';

const NewsDetailsPage = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await newsService.getOne(id);
        setNews(res.data.data.news);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <PageLoader />;
  if (!news) return <div className="text-center py-20 text-xl font-bold">News article not found</div>;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[60vh] bg-gray-900">
        <img 
          src={getImageUrl(news.image)} 
          alt={news.title} 
          className="w-full h-full object-cover opacity-60" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container-custom">
            <Link to="/news" className="text-primary-300 hover:text-white flex items-center gap-2 mb-6 transition-colors w-fit font-medium">
              <FiArrowLeft /> Back to all news
            </Link>
            <div className="flex gap-3 mb-4">
              <span className="badge bg-primary-600 text-white border-none px-3 py-1 text-sm">{news.category}</span>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 max-w-4xl font-heading">
              {news.title}
            </h1>
            <div className="flex items-center gap-6 text-gray-300 text-sm mt-4">
              <span className="flex items-center gap-2"><FiCalendar /> {formatDate(news.publishedAt)}</span>
              {news.author && (
                <span className="flex items-center gap-2">
                  <FiUser /> {news.author.name}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom mt-12">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
          <div className="prose prose-lg prose-primary max-w-none text-gray-700 whitespace-pre-wrap leading-loose">
            {news.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailsPage;
