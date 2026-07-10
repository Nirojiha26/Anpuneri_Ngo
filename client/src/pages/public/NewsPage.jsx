import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCalendar, FiEye, FiTag } from 'react-icons/fi';
import { newsService } from '../../services/apiServices';
import { CardGridSkeleton } from '../../components/common/Loading';
import Pagination from '../../components/common/Pagination';
import SearchBox from '../../components/common/SearchBox';
import { formatDate, getImageUrl, truncate } from '../../utils/helpers';
import { useDebounce, useScrollTop } from '../../hooks/useApi';
import { NEWS_CATEGORIES } from '../../constants';

const NewsCard = ({ article, featured = false }) => (
  <motion.div whileHover={{ y: -4 }} className={`card overflow-hidden group ${featured ? 'md:col-span-2' : ''}`}>
    <div className={`relative overflow-hidden ${featured ? 'h-72' : 'h-48'}`}>
      <img
        src={getImageUrl(article.image)}
        alt={article.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      <div className="absolute top-3 left-3">
        <span className="badge-primary capitalize">{article.category}</span>
      </div>
    </div>
    <div className="p-5">
      <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
        <span className="flex items-center gap-1"><FiCalendar className="w-3 h-3" />{formatDate(article.publishedAt)}</span>
        {article.views > 0 && <span className="flex items-center gap-1"><FiEye className="w-3 h-3" />{article.views}</span>}
      </div>
      <h3 className={`font-bold text-gray-900 group-hover:text-primary-600 transition-colors mb-2 ${featured ? 'text-xl' : 'text-base'} line-clamp-2`}>
        {article.title}
      </h3>
      <p className="text-sm text-gray-500 mb-4 line-clamp-3">{article.excerpt || truncate(article.content?.replace(/<[^>]*>/g, ''), 150)}</p>
      <Link to={`/news/${article._id}`} className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
        Read more →
      </Link>
    </div>
  </motion.div>
);

const NewsPage = () => {
  useScrollTop();
  const [news, setNews] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await newsService.getAll({ page, limit: 9, search: debouncedSearch, category });
        setNews(res.data.data || []);
        setPagination(res.data.pagination);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [page, debouncedSearch, category]);

  return (
    <div>
      <div className="page-header">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white font-heading mb-4">News & Updates</h1>
          <p className="text-primary-200 text-lg max-w-2xl mx-auto">
            Stay up to date with our latest programs, community impact stories, and organizational news.
          </p>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <SearchBox value={search} onChange={setSearch} placeholder="Search articles..." className="flex-1 max-w-sm" />
          <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} className="input-field w-auto">
            <option value="">All Categories</option>
            {NEWS_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>

        {loading ? (
          <CardGridSkeleton count={9} />
        ) : news.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <FiTag className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg">No articles found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {news.map((n, i) => <NewsCard key={n._id} article={n} featured={i === 0 && page === 1} />)}
            </div>
            <Pagination pagination={pagination} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
};

export default NewsPage;
