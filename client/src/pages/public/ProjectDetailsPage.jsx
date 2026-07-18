import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiMapPin, FiUsers, FiFacebook, FiTarget } from 'react-icons/fi';
import { projectService } from '../../services/apiServices';
import { PageLoader } from '../../components/common/Loading';
import { getImageUrl, getProgress } from '../../utils/helpers';
import Button from '../../components/common/Button';

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await projectService.getOne(id);
        setProject(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <PageLoader />;
  if (!project) return <div className="text-center py-20 text-xl font-bold">Project not found</div>;

  const progress = getProgress(project.raisedAmount, project.targetAmount);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[60vh] bg-gray-900">
        <img 
          src={getImageUrl(project.image)} 
          alt={project.title} 
          className="w-full h-full object-cover opacity-60" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container-custom">
            <Link to="/projects" className="text-primary-300 hover:text-white flex items-center gap-2 mb-6 transition-colors w-fit font-medium">
              <FiArrowLeft /> Back to all projects
            </Link>
            <div className="flex gap-3 mb-4">
              <span className="badge bg-primary-600 text-white border-none px-3 py-1 text-sm">{project.category}</span>
              {project.status === 'completed' && <span className="badge bg-green-500 text-white border-none px-3 py-1 text-sm">Completed</span>}
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 max-w-4xl font-heading">
              {project.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="container-custom mt-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content Area (Story) */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-heading border-b pb-4">Our Story</h2>
              
              {/* Rich Story rendering using pre-wrap to support line breaks from textarea */}
              <div className="prose prose-lg prose-primary max-w-none text-gray-700 whitespace-pre-wrap leading-loose">
                {project.description}
              </div>

              {project.facebookUrl && (
                <div className="mt-10 p-6 bg-blue-50 rounded-2xl border border-blue-100 flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h4 className="font-bold text-blue-900 flex items-center gap-2 text-lg">
                      <FiFacebook className="w-5 h-5"/> Follow on Facebook
                    </h4>
                    <p className="text-sm text-blue-800 mt-1">See live updates, photos, and videos for this project on our Facebook page.</p>
                  </div>
                  <a href={project.facebookUrl} target="_blank" rel="noreferrer" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-md">
                    View Post
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Area (Stats & CTA) */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 sticky top-24">
              {/* Funding Progress */}
              {project.targetAmount > 0 && (
                <div className="mb-8">
                  <div className="flex justify-between items-end mb-3">
                    <div>
                      <p className="text-3xl font-black text-primary-600">${(project.raisedAmount || 0).toLocaleString()}</p>
                      <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mt-1">Raised</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">{progress}%</p>
                      <p className="text-xs text-gray-500 font-medium">of ${(project.targetAmount || 0).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 mb-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-primary-500 to-primary-700 h-3 rounded-full" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
              )}

              {/* Call to Action */}
              <Link to="/donate" className="block w-full mb-8">
                <Button size="lg" className="w-full justify-center shadow-lg shadow-primary-500/30 text-lg">
                  Donate to this Project
                </Button>
              </Link>

              {/* Key Details List */}
              <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-wider text-sm border-b pb-2">Project Details</h3>
              <ul className="space-y-4">
                {project.location && (
                  <li className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                      <FiMapPin className="w-5 h-5"/>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Location</p>
                      <p className="font-semibold text-gray-900">{project.location}</p>
                    </div>
                  </li>
                )}
                {project.beneficiaries > 0 && (
                  <li className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                      <FiUsers className="w-5 h-5"/>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Beneficiaries</p>
                      <p className="font-semibold text-gray-900">{project.beneficiaries.toLocaleString()} People</p>
                    </div>
                  </li>
                )}
                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <FiTarget className="w-5 h-5"/>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status</p>
                    <p className="font-semibold text-gray-900 capitalize">{project.status}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
