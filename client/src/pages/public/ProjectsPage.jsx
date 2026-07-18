import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiFilter } from 'react-icons/fi';
import { projectService } from '../../services/apiServices';
import { CardGridSkeleton } from '../../components/common/Loading';
import Pagination from '../../components/common/Pagination';
import SearchBox from '../../components/common/SearchBox';
import { getImageUrl, getProgress } from '../../utils/helpers';
import { PROJECT_CATEGORIES } from '../../constants';
import { useDebounce, useScrollTop } from '../../hooks/useApi';

const ProjectCard = ({ project }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4 }}
    className="card overflow-hidden group flex flex-col"
  >
    <div className="relative h-56 overflow-hidden shrink-0">
      <img
        src={getImageUrl(project.image)}
        alt={project.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
      <div className="absolute top-3 left-3 flex gap-2">
        <span className="badge-primary capitalize bg-primary-600 border-none">{project.category}</span>
        {project.status === 'completed' && <span className="badge bg-green-500 text-white border-none">Completed</span>}
      </div>
      {project.isFeatured && (
        <div className="absolute top-3 right-3">
          <span className="badge bg-accent-500 text-white text-xs px-2 py-0.5 border-none">Featured</span>
        </div>
      )}
    </div>

    <div className="p-5 flex flex-col flex-1">
      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors text-lg">
        {project.title}
      </h3>
      <p className="text-sm text-gray-600 mb-5 line-clamp-3 leading-relaxed">
        {project.shortDescription || project.description?.slice(0, 150) + '...'}
      </p>

      {/* Stats row */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 mb-5 text-xs font-medium text-gray-500">
        {project.beneficiaries > 0 && (
          <span className="flex items-center gap-1.5">
            <span className="text-primary-600">👥</span> {project.beneficiaries.toLocaleString()} beneficiaries
          </span>
        )}
        {project.location && (
          <span className="flex items-center gap-1.5">
            <span className="text-red-500">📍</span> {project.location}
          </span>
        )}
      </div>

      <div className="mt-auto">
        {/* Progress */}
        {project.targetAmount > 0 && (
          <div className="mb-5">
            <div className="flex justify-between text-xs text-gray-600 mb-2 font-medium">
              <span>${(project.raisedAmount || 0).toLocaleString()} raised</span>
              <span className="text-primary-700">{getProgress(project.raisedAmount, project.targetAmount)}% of ${project.targetAmount.toLocaleString()}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: `${getProgress(project.raisedAmount, project.targetAmount)}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <Link
            to={`/projects/${project.slug || project._id}`}
            className="text-sm font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1.5 group/link"
          >
            Read full story <FiArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
          </Link>
          {project.facebookUrl && (
            <a 
              href={project.facebookUrl} 
              target="_blank" 
              rel="noreferrer"
              className="text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
              FB Post
            </a>
          )}
        </div>
      </div>
    </div>
  </motion.div>
);

const ProjectsPage = () => {
  useScrollTop();
  const [projects, setProjects] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await projectService.getAll({ page, limit: 9, search: debouncedSearch, category, status });
        setProjects(res.data.data || []);
        setPagination(res.data.pagination);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [page, debouncedSearch, category, status]);

  return (
    <div>
      <div className="page-header">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white font-heading mb-4">Our Projects</h1>
          <p className="text-primary-200 text-lg max-w-2xl mx-auto">
            From scholarships to emergency relief, every project we run is designed to create lasting, measurable change.
          </p>
        </div>
      </div>

      <div className="container-custom py-12">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <SearchBox
            value={search}
            onChange={setSearch}
            placeholder="Search projects..."
            className="flex-1 max-w-sm"
          />
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            className="input-field w-auto"
          >
            <option value="">All Categories</option>
            {PROJECT_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="input-field w-auto"
          >
            <option value="">All Statuses</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="planning">Planning</option>
          </select>
        </div>

        {loading ? (
          <CardGridSkeleton count={9} />
        ) : projects.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <FiFilter className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg">No projects found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((p) => <ProjectCard key={p._id} project={p} />)}
            </div>
            <Pagination pagination={pagination} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
