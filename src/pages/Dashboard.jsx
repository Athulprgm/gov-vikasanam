import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  LogOut, Globe, ShieldAlert, Plus, Edit2, Trash2, 
  Settings, Folder, MapPin, Calendar, MessageSquare, 
  Check, X, AlertTriangle, Shield, Sun, Moon 
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout, token, API_BASE_URL, language, toggleLanguage, t, theme, toggleTheme } = useAuth();
  const { 
    districts, projects, timeline, testimonials, 
    usingFallback, saveProject, deleteProject, 
    saveDistrict, saveMilestone, deleteMilestone, 
    saveTestimonial, deleteTestimonial 
  } = useData();

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('projects');
  const [toast, setToast] = useState(null); // { type: 'success'|'error', message: '' }

  // Upload states for project images and testimonial avatar
  const [uploadingStates, setUploadingStates] = useState({
    before_img: false,
    after_img: false,
    avatar: false
  });

  const handleImageUpload = async (e, field, setFormCallback) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingStates(prev => ({ ...prev, [field]: true }));
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload image');
      }

      setFormCallback(prev => ({ ...prev, [field]: data.url }));
      triggerToast('success', 'Image uploaded successfully!');
    } catch (err) {
      console.error(err);
      triggerToast('error', err.message || 'Image upload failed');
    } finally {
      setUploadingStates(prev => ({ ...prev, [field]: false }));
      // Reset target value so selecting the same file triggers onChange again
      e.target.value = '';
    }
  };

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('project'); 
  const [editingItem, setEditingItem] = useState(null);

  // Specific Forms
  const [projectForm, setProjectForm] = useState({
    id: '', categoryMl: '', categoryEn: '', titleMl: '', titleEn: '',
    districtMl: '', districtEn: '', descriptionMl: '', descriptionEn: '',
    investment: '', percentage: 100, beforeTextMl: '', beforeTextEn: '',
    afterTextMl: '', afterTextEn: '', beforeImg: '', afterImg: '',
    year: '', governmentEn: '', governmentMl: ''
  });

  const [districtForm, setDistrictForm] = useState({
    id: '', nameEn: '', nameMl: '', investment: '', projectsCount: 0,
    highlightMl: '', highlightEn: '', x: 100, y: 100
  });

  const [timelineForm, setTimelineForm] = useState({
    id: '', year: '', phaseMl: '', phaseEn: '', descMl: '', descEn: '',
    governmentEn: '', governmentMl: '', statsEn: '', statsMl: '', icon: 'calendar'
  });

  const [testimonialForm, setTestimonialForm] = useState({
    id: '', name: '', role: '', quoteMl: '', quoteEn: '', rating: 5, avatar: ''
  });

  const triggerToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const openCreateModal = (type) => {
    setEditingItem(null);
    setModalType(type);
    setIsModalOpen(true);

    if (type === 'project') {
      setProjectForm({
        id: '', categoryMl: '', categoryEn: '', titleMl: '', titleEn: '',
        districtMl: '', districtEn: '', descriptionMl: '', descriptionEn: '',
        investment: '', percentage: 100, beforeTextMl: '', beforeTextEn: '',
        afterTextMl: '', afterTextEn: '', beforeImg: '', afterImg: '',
        year: '', governmentEn: '', governmentMl: ''
      });
    } else if (type === 'timeline') {
      setTimelineForm({
        id: '', year: '', phaseMl: '', phaseEn: '', descMl: '', descEn: '',
        governmentEn: '', governmentMl: '', statsEn: '', statsMl: '', icon: 'calendar'
      });
    } else if (type === 'testimonial') {
      setTestimonialForm({ id: '', name: '', role: '', quoteMl: '', quoteEn: '', rating: 5, avatar: '' });
    }
  };

  const openEditModal = (type, item) => {
    setEditingItem(item);
    setModalType(type);
    setIsModalOpen(true);

    if (type === 'project') {
      setProjectForm({ ...item });
    } else if (type === 'district') {
      setDistrictForm({ ...item });
    } else if (type === 'timeline') {
      setTimelineForm({ ...item });
    } else if (type === 'testimonial') {
      setTestimonialForm({ ...item });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (usingFallback) {
      triggerToast('error', 'Cannot write in fallback mode.');
      return;
    }

    try {
      if (modalType === 'project') {
        await saveProject(projectForm);
        triggerToast('success', `Project successfully ${editingItem ? 'updated' : 'created'}`);
      } else if (modalType === 'district') {
        await saveDistrict(districtForm);
        triggerToast('success', 'District successfully updated');
      } else if (modalType === 'timeline') {
        await saveMilestone(timelineForm);
        triggerToast('success', `Milestone successfully ${editingItem ? 'updated' : 'created'}`);
      } else if (modalType === 'testimonial') {
        await saveTestimonial(testimonialForm);
        triggerToast('success', `Testimonial successfully ${editingItem ? 'updated' : 'created'}`);
      }
      setIsModalOpen(false);
    } catch (err) {
      triggerToast('error', err.message || 'Operation failed.');
    }
  };

  const handleDelete = async (type, id) => {
    if (usingFallback) {
      triggerToast('error', 'Cannot delete in fallback mode.');
      return;
    }

    if (!confirm('Are you sure you want to delete this record?')) return;

    try {
      if (type === 'project') {
        await deleteProject(id);
        triggerToast('success', 'Project successfully deleted');
      } else if (type === 'timeline') {
        await deleteMilestone(id);
        triggerToast('success', 'Milestone successfully deleted');
      } else if (type === 'testimonial') {
        await deleteTestimonial(id);
        triggerToast('success', 'Testimonial successfully deleted');
      }
    } catch (err) {
      triggerToast('error', err.message || 'Deletion failed.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex antialiased">
      
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-lg border flex items-center space-x-3 shadow-lg ${
          toast.type === 'success' 
            ? 'bg-emerald-950 border-emerald-800 text-emerald-400' 
            : 'bg-rose-950 border-rose-800 text-rose-400'
        }`}>
          {toast.type === 'success' ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span className="text-xs font-medium">{toast.message}</span>
        </div>
      )}

      {/* LEFT SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col justify-between shrink-0">
        <div>
          {/* Sidebar Brand Logo */}
          <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-sm">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white">കേരള<span className="text-indigo-400">One</span></h1>
              <p className="text-[10px] text-slate-400 font-mono tracking-wider">Control Panel</p>
            </div>
          </div>

          {/* Sidebar Menu */}
          <nav className="p-4 space-y-1">
            <button 
              onClick={() => setActiveTab('projects')}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer text-left ${
                activeTab === 'projects' 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              <Folder className="w-4 h-4" />
              <span>Projects</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('districts')}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer text-left ${
                activeTab === 'districts' 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Districts Map</span>
            </button>

            <button 
              onClick={() => setActiveTab('timeline')}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer text-left ${
                activeTab === 'timeline' 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Milestones Timeline</span>
            </button>

            <button 
              onClick={() => setActiveTab('testimonials')}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer text-left ${
                activeTab === 'testimonials' 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Citizen Testimonials</span>
            </button>
          </nav>
        </div>

        {/* Sidebar User Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between">
          <div className="truncate pr-2">
            <div className="text-xs font-bold text-white truncate">{user?.name || 'Admin'}</div>
            <div className="text-[10px] text-slate-400 truncate font-mono">{user?.email || 'admin@janavikasam.gov.in'}</div>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header bar */}
        <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Logo on mobile view */}
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-sm md:hidden">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white capitalize md:text-base">
                {activeTab} Management
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Language Switch */}
            <button 
              onClick={toggleLanguage}
              className="px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-800 text-[10px] font-semibold text-slate-300 hover:text-white cursor-pointer"
            >
              {language === 'en' ? 'മലയാളം' : 'English'}
            </button>

            {/* Theme Switcher */}
            <button 
              onClick={toggleTheme}
              className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
              title="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-3.5 h-3.5" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-yellow-400" />
              )}
            </button>

            <Link to="/" className="text-xs text-slate-400 hover:text-slate-100 transition-colors flex items-center space-x-1.5">
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">View Landing Page</span>
            </Link>
            
            {/* Logout on mobile */}
            <button 
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-400 md:hidden rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Dynamic Mobile Tab bar */}
        <div className="bg-slate-900 border-b border-slate-800 grid grid-cols-4 md:hidden">
          <button 
            onClick={() => setActiveTab('projects')}
            className={`py-3 text-[10px] font-bold flex flex-col items-center justify-center space-y-1 ${
              activeTab === 'projects' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-slate-400'
            }`}
          >
            <Folder className="w-4 h-4" />
            <span>Projects</span>
          </button>
          <button 
            onClick={() => setActiveTab('districts')}
            className={`py-3 text-[10px] font-bold flex flex-col items-center justify-center space-y-1 ${
              activeTab === 'districts' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-slate-400'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Districts</span>
          </button>
          <button 
            onClick={() => setActiveTab('timeline')}
            className={`py-3 text-[10px] font-bold flex flex-col items-center justify-center space-y-1 ${
              activeTab === 'timeline' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-slate-400'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Timeline</span>
          </button>
          <button 
            onClick={() => setActiveTab('testimonials')}
            className={`py-3 text-[10px] font-bold flex flex-col items-center justify-center space-y-1 ${
              activeTab === 'testimonials' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-slate-400'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Testimonials</span>
          </button>
        </div>

        {/* Content Body scroll container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Connection fallback warning */}
          {usingFallback && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-start space-x-3">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <div>
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider">LOCAL PREVIEW FALLBACK ACTIVE</h3>
                <p className="text-xs mt-1 text-slate-400 leading-relaxed">
                  The Laravel server is offline. Running in read-only local mode. Run `php artisan serve` to enable writes.
                </p>
              </div>
            </div>
          )}

          {/* Simple Metric Dashboard overview row */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block mb-1">Projects</span>
              <span className="text-2xl font-bold text-white font-mono">{projects.length}</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block mb-1">Districts</span>
              <span className="text-2xl font-bold text-white font-mono">{districts.length}</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block mb-1">Milestones</span>
              <span className="text-2xl font-bold text-white font-mono">{timeline.length}</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block mb-1">Testimonials</span>
              <span className="text-2xl font-bold text-white font-mono">{testimonials.length}</span>
            </div>
          </section>

          {/* Flat Slate Dashboard tables */}
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-5 md:p-6">
            
            {/* PROJECTS PANEL */}
            {activeTab === 'projects' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-white">Project Directory</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Manage before/after slides and portfolio listings</p>
                  </div>
                  <button 
                    onClick={() => openCreateModal('project')}
                    className="bg-indigo-600 text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center space-x-1 hover:bg-indigo-500 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Project</span>
                  </button>
                </div>

                <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900/50 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        <th className="p-3">Title</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">District</th>
                        <th className="p-3">Investment</th>
                        <th className="p-3">Progress</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-xs">
                      {projects.map((project) => (
                        <tr key={project.id} className="hover:bg-slate-900 transition-colors">
                          <td className="p-3">
                            <div className="font-semibold text-white">{project.titleEn}</div>
                            <div className="text-slate-400 font-malayalam mt-0.5">{project.titleMl}</div>
                            {(project.year || project.governmentEn) && (
                              <div className="text-[9px] text-slate-500 font-mono mt-1">
                                {project.year} • <span className="text-accent">{project.governmentEn}</span>
                              </div>
                            )}
                          </td>
                          <td className="p-3 text-slate-400">{project.categoryEn}</td>
                          <td className="p-3 text-slate-400">{project.districtEn}</td>
                          <td className="p-3 font-mono text-indigo-400 font-bold">{project.investment}</td>
                          <td className="p-3">
                            <div className="flex items-center space-x-2">
                              <div className="w-16 bg-slate-800 rounded-full h-1 overflow-hidden">
                                <div className="bg-indigo-500 h-full" style={{ width: `${project.percentage}%` }} />
                              </div>
                              <span className="font-mono text-[10px] text-white">{project.percentage}%</span>
                            </div>
                          </td>
                          <td className="p-3 text-right">
                            <div className="inline-flex space-x-1">
                              <button 
                                onClick={() => openEditModal('project', project)}
                                className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-indigo-400 rounded transition-colors cursor-pointer"
                                title="Edit"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => handleDelete('project', project.id)}
                                className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-red-400 rounded transition-colors cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* DISTRICTS PANEL */}
            {activeTab === 'districts' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white">District Nodes</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Edit regional map markers and highlights</p>
                </div>

                <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900/50 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        <th className="p-3">District</th>
                        <th className="p-3">Investment</th>
                        <th className="p-3">Projects</th>
                        <th className="p-3">Highlight</th>
                        <th className="p-3 text-center">Coordinates</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-xs">
                      {districts.map((district) => (
                        <tr key={district.id} className="hover:bg-slate-900 transition-colors">
                          <td className="p-3">
                            <div className="font-semibold text-white">{district.nameEn}</div>
                            <div className="text-slate-400 font-malayalam mt-0.5">{district.nameMl}</div>
                          </td>
                          <td className="p-3 font-mono text-indigo-400 font-bold">{district.investment}</td>
                          <td className="p-3 text-slate-400">{district.projectsCount} completed</td>
                          <td className="p-3 max-w-xs truncate">
                            <div className="truncate text-white">{district.highlightEn}</div>
                            <div className="truncate text-slate-400 font-malayalam mt-0.5">{district.highlightMl}</div>
                          </td>
                          <td className="p-3 text-center font-mono text-slate-500">({district.x}, {district.y})</td>
                          <td className="p-3 text-right">
                            <button 
                              onClick={() => openEditModal('district', district)}
                              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-indigo-400 rounded transition-colors cursor-pointer"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TIMELINE PANEL */}
            {activeTab === 'timeline' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-white">Timeline Milestones</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Control yearly roadmap phases</p>
                  </div>
                  <button 
                    onClick={() => openCreateModal('timeline')}
                    className="bg-indigo-600 text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center space-x-1 hover:bg-indigo-500 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Milestone</span>
                  </button>
                </div>

                <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900/50 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        <th className="p-3 w-20">Year</th>
                        <th className="p-3">Phase Name</th>
                        <th className="p-3">Description</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-xs">
                      {timeline.map((item) => (
                        <tr key={item.id || item.year} className="hover:bg-slate-900 transition-colors">
                          <td className="p-3">
                            <div className="font-mono font-bold text-base text-indigo-400">{item.year}</div>
                            {item.governmentEn && (
                              <div className="text-[9px] text-accent/80 font-semibold truncate max-w-[120px]">{item.governmentEn}</div>
                            )}
                          </td>
                          <td className="p-3">
                            <div className="font-semibold text-white">{item.phaseEn}</div>
                            <div className="text-slate-400 font-malayalam mt-0.5">{item.phaseMl}</div>
                          </td>
                          <td className="p-3 leading-relaxed">
                            <div className="text-slate-300">{item.descEn}</div>
                            <div className="text-slate-400 font-malayalam mt-0.5 leading-relaxed">{item.descMl}</div>
                          </td>
                          <td className="p-3 text-right">
                            <div className="inline-flex space-x-1">
                              <button 
                                onClick={() => openEditModal('timeline', item)}
                                className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-indigo-400 rounded transition-colors cursor-pointer"
                                title="Edit"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => handleDelete('timeline', item.id)}
                                className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-red-400 rounded transition-colors cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TESTIMONIALS PANEL */}
            {activeTab === 'testimonials' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-white">Citizen Reviews</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Manage testimonial quotes and rating feedback</p>
                  </div>
                  <button 
                    onClick={() => openCreateModal('testimonial')}
                    className="bg-indigo-600 text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center space-x-1 hover:bg-indigo-500 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Review</span>
                  </button>
                </div>

                <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900/50 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        <th className="p-3 w-12 text-center">Avatar</th>
                        <th className="p-3">Citizen Info</th>
                        <th className="p-3">Stars</th>
                        <th className="p-3">Quote</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-xs">
                      {testimonials.map((item) => (
                        <tr key={item.id || item.name} className="hover:bg-slate-900 transition-colors">
                          <td className="p-3 text-center">
                            <img 
                              src={item.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'} 
                              alt={item.name} 
                              className="w-8 h-8 rounded-full object-cover border border-slate-800 mx-auto"
                            />
                          </td>
                          <td className="p-3">
                            <div className="font-semibold text-white">{item.name}</div>
                            <div className="text-slate-400 font-malayalam mt-0.5">{item.role}</div>
                          </td>
                          <td className="p-3">
                            <div className="flex text-amber-500 font-bold">
                              {'★'.repeat(item.rating)}
                            </div>
                          </td>
                          <td className="p-3 leading-relaxed">
                            <div className="text-slate-300">"{item.quoteEn}"</div>
                            <div className="text-slate-400 font-malayalam mt-0.5 leading-relaxed">"{item.quoteMl}"</div>
                          </td>
                          <td className="p-3 text-right">
                            <div className="inline-flex space-x-1">
                              <button 
                                onClick={() => openEditModal('testimonial', item)}
                                className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-indigo-400 rounded transition-colors cursor-pointer"
                                title="Edit"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => handleDelete('testimonial', item.id)}
                                className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-red-400 rounded transition-colors cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </section>
        </div>

        {/* Footer */}
        <footer className="bg-slate-900 border-t border-slate-800 py-4 px-6 text-center text-xs text-slate-500">
          <p>© 2026 Government of Kerala. Standard administrative directory.</p>
        </footer>
      </div>

      {/* EDIT/CREATE DIALOG MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
              <h3 className="text-sm font-bold text-white">
                {editingItem ? 'Edit' : 'Create'} {modalType}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-5">
              
              {/* 1. PROJECT FORM */}
              {modalType === 'project' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Project ID (Unique slug)</label>
                      <input 
                        type="text" 
                        value={projectForm.id} 
                        onChange={(e) => setProjectForm({ ...projectForm, id: e.target.value })} 
                        placeholder="e.g. road-dev" 
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                        disabled={!!editingItem}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Budget/Investment</label>
                      <input 
                        type="text" 
                        value={projectForm.investment} 
                        onChange={(e) => setProjectForm({ ...projectForm, investment: e.target.value })} 
                        placeholder="e.g. ₹25,000 Cr+" 
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category (English)</label>
                      <input 
                        type="text" 
                        value={projectForm.categoryEn} 
                        onChange={(e) => setProjectForm({ ...projectForm, categoryEn: e.target.value })} 
                        placeholder="e.g. Road Development" 
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category (Malayalam)</label>
                      <input 
                        type="text" 
                        value={projectForm.categoryMl} 
                        onChange={(e) => setProjectForm({ ...projectForm, categoryMl: e.target.value })} 
                        placeholder="e.g. റോഡ് വികസനം" 
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Title (English)</label>
                      <input 
                        type="text" 
                        value={projectForm.titleEn} 
                        onChange={(e) => setProjectForm({ ...projectForm, titleEn: e.target.value })} 
                        placeholder="Project English Title" 
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Title (Malayalam)</label>
                      <input 
                        type="text" 
                        value={projectForm.titleMl} 
                        onChange={(e) => setProjectForm({ ...projectForm, titleMl: e.target.value })} 
                        placeholder="പദ്ധതി ശീർഷകം" 
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Location/District (English)</label>
                      <input 
                        type="text" 
                        value={projectForm.districtEn} 
                        onChange={(e) => setProjectForm({ ...projectForm, districtEn: e.target.value })} 
                        placeholder="e.g. Kannur" 
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Location/District (Malayalam)</label>
                      <input 
                        type="text" 
                        value={projectForm.districtMl} 
                        onChange={(e) => setProjectForm({ ...projectForm, districtMl: e.target.value })} 
                        placeholder="e.g. കണ്ണൂർ" 
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Description (English)</label>
                      <textarea 
                        value={projectForm.descriptionEn} 
                        onChange={(e) => setProjectForm({ ...projectForm, descriptionEn: e.target.value })} 
                        placeholder="Brief summary in English" 
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 h-20"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Description (Malayalam)</label>
                      <textarea 
                        value={projectForm.descriptionMl} 
                        onChange={(e) => setProjectForm({ ...projectForm, descriptionMl: e.target.value })} 
                        placeholder="പദ്ധതിയെക്കുറിച്ചുള്ള വിവരണം" 
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 h-20"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Completion Percentage ({projectForm.percentage}%)</label>
                      <input 
                        type="range" 
                        min="0" 
                        max="100"
                        value={projectForm.percentage} 
                        onChange={(e) => setProjectForm({ ...projectForm, percentage: parseInt(e.target.value) || 0 })} 
                        className="w-full accent-indigo-500 cursor-pointer"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Project Year</label>
                      <input 
                        type="text" 
                        value={projectForm.year} 
                        onChange={(e) => setProjectForm({ ...projectForm, year: e.target.value })} 
                        placeholder="e.g. 2026" 
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Government (English)</label>
                      <input 
                        type="text" 
                        value={projectForm.governmentEn} 
                        onChange={(e) => setProjectForm({ ...projectForm, governmentEn: e.target.value })} 
                        placeholder="e.g. LDF Government (Pinarayi Vijayan)" 
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Government (Malayalam)</label>
                      <input 
                        type="text" 
                        value={projectForm.governmentMl} 
                        onChange={(e) => setProjectForm({ ...projectForm, governmentMl: e.target.value })} 
                        placeholder="e.g. എൽ.ഡി.എഫ്. സർക്കാർ (പിണറായി വിജയൻ)" 
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Before Text (English)</label>
                      <input 
                        type="text" 
                        value={projectForm.beforeTextEn} 
                        onChange={(e) => setProjectForm({ ...projectForm, beforeTextEn: e.target.value })} 
                        placeholder="Promise (2021):..." 
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Before Text (Malayalam)</label>
                      <input 
                        type="text" 
                        value={projectForm.beforeTextMl} 
                        onChange={(e) => setProjectForm({ ...projectForm, beforeTextMl: e.target.value })} 
                        placeholder="വാഗ്ദാനം (2021):..." 
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">After Text (English)</label>
                      <input 
                        type="text" 
                        value={projectForm.afterTextEn} 
                        onChange={(e) => setProjectForm({ ...projectForm, afterTextEn: e.target.value })} 
                        placeholder="Reality (2026):..." 
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">After Text (Malayalam)</label>
                      <input 
                        type="text" 
                        value={projectForm.afterTextMl} 
                        onChange={(e) => setProjectForm({ ...projectForm, afterTextMl: e.target.value })} 
                        placeholder="യാഥാർത്ഥ്യം (2026):..." 
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Before Image</label>
                      <div className="space-y-3">
                        {projectForm.beforeImg ? (
                          <div className="relative group rounded-lg overflow-hidden border border-slate-800 bg-slate-950 aspect-video flex items-center justify-center">
                            <img 
                              src={projectForm.beforeImg} 
                              alt="Before Preview" 
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                              <button
                                type="button"
                                onClick={() => setProjectForm({ ...projectForm, beforeImg: '' })}
                                className="p-1.5 bg-red-600 hover:bg-red-500 text-white rounded transition-colors cursor-pointer"
                                title="Remove Image"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center border border-dashed border-slate-800 hover:border-indigo-500 rounded-lg p-4 cursor-pointer hover:bg-slate-950/50 transition-all text-center aspect-video justify-center">
                            {uploadingStates.before_img ? (
                              <div className="space-y-2 flex flex-col items-center justify-center h-full">
                                <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-[10px] font-semibold text-indigo-400">Uploading...</span>
                              </div>
                            ) : (
                              <div className="space-y-1 py-1">
                                <Plus className="w-5 h-5 text-slate-400 mx-auto" />
                                <span className="text-[10px] font-semibold text-slate-300 block">Select Before Image</span>
                                <span className="text-[8px] text-slate-500 block">PNG, JPG, WEBP (Max 5MB)</span>
                              </div>
                            )}
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={(e) => handleImageUpload(e, 'before_img', setProjectForm)}
                              className="hidden" 
                              disabled={uploadingStates.before_img}
                            />
                          </label>
                        )}
                        <input type="hidden" value={projectForm.beforeImg} required />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">After Image</label>
                      <div className="space-y-3">
                        {projectForm.afterImg ? (
                          <div className="relative group rounded-lg overflow-hidden border border-slate-800 bg-slate-950 aspect-video flex items-center justify-center">
                            <img 
                              src={projectForm.afterImg} 
                              alt="After Preview" 
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                              <button
                                type="button"
                                onClick={() => setProjectForm({ ...projectForm, afterImg: '' })}
                                className="p-1.5 bg-red-600 hover:bg-red-500 text-white rounded transition-colors cursor-pointer"
                                title="Remove Image"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center border border-dashed border-slate-800 hover:border-indigo-500 rounded-lg p-4 cursor-pointer hover:bg-slate-950/50 transition-all text-center aspect-video justify-center">
                            {uploadingStates.after_img ? (
                              <div className="space-y-2 flex flex-col items-center justify-center h-full">
                                <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-[10px] font-semibold text-indigo-400">Uploading...</span>
                              </div>
                            ) : (
                              <div className="space-y-1 py-1">
                                <Plus className="w-5 h-5 text-slate-400 mx-auto" />
                                <span className="text-[10px] font-semibold text-slate-300 block">Select After Image</span>
                                <span className="text-[8px] text-slate-500 block">PNG, JPG, WEBP (Max 5MB)</span>
                              </div>
                            )}
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={(e) => handleImageUpload(e, 'after_img', setProjectForm)}
                              className="hidden" 
                              disabled={uploadingStates.after_img}
                            />
                          </label>
                        )}
                        <input type="hidden" value={projectForm.afterImg} required />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. DISTRICT FORM */}
              {modalType === 'district' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">District ID</label>
                      <input 
                        type="text" 
                        value={districtForm.id} 
                        disabled
                        className="w-full bg-slate-800 border border-slate-700 text-slate-500 rounded-lg px-3 py-2 text-xs focus:outline-none cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Investment Amount</label>
                      <input 
                        type="text" 
                        value={districtForm.investment} 
                        onChange={(e) => setDistrictForm({ ...districtForm, investment: e.target.value })} 
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Name (English)</label>
                      <input 
                        type="text" 
                        value={districtForm.nameEn} 
                        onChange={(e) => setDistrictForm({ ...districtForm, nameEn: e.target.value })} 
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Name (Malayalam)</label>
                      <input 
                        type="text" 
                        value={districtForm.nameMl} 
                        onChange={(e) => setDistrictForm({ ...districtForm, nameMl: e.target.value })} 
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Projects Count</label>
                      <input 
                        type="number" 
                        value={districtForm.projectsCount} 
                        onChange={(e) => setDistrictForm({ ...districtForm, projectsCount: parseInt(e.target.value) || 0 })} 
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Key Highlight (English)</label>
                      <input 
                        type="text" 
                        value={districtForm.highlightEn} 
                        onChange={(e) => setDistrictForm({ ...districtForm, highlightEn: e.target.value })} 
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Key Highlight (Malayalam)</label>
                      <input 
                        type="text" 
                        value={districtForm.highlightMl} 
                        onChange={(e) => setDistrictForm({ ...districtForm, highlightMl: e.target.value })} 
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Coordinate X</label>
                      <input 
                        type="number" 
                        value={districtForm.x} 
                        onChange={(e) => setDistrictForm({ ...districtForm, x: parseInt(e.target.value) || 0 })} 
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Coordinate Y</label>
                      <input 
                        type="number" 
                        value={districtForm.y} 
                        onChange={(e) => setDistrictForm({ ...districtForm, y: parseInt(e.target.value) || 0 })} 
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 3. TIMELINE FORM */}
              {modalType === 'timeline' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Year</label>
                      <input 
                        type="text" 
                        value={timelineForm.year} 
                        onChange={(e) => setTimelineForm({ ...timelineForm, year: e.target.value })} 
                        placeholder="e.g. 2026" 
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Icon type</label>
                      <select 
                        value={timelineForm.icon} 
                        onChange={(e) => setTimelineForm({ ...timelineForm, icon: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                        required
                      >
                        <option value="calendar">Calendar</option>
                        <option value="landmark">Landmark (Government)</option>
                        <option value="hardhat">Hard Hat (Construction)</option>
                        <option value="building">Building (Infrastructure)</option>
                        <option value="award">Award (Commissioning)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Phase Title (English)</label>
                      <input 
                        type="text" 
                        value={timelineForm.phaseEn} 
                        onChange={(e) => setTimelineForm({ ...timelineForm, phaseEn: e.target.value })} 
                        placeholder="e.g. Completion" 
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Phase Title (Malayalam)</label>
                      <input 
                        type="text" 
                        value={timelineForm.phaseMl} 
                        onChange={(e) => setTimelineForm({ ...timelineForm, phaseMl: e.target.value })} 
                        placeholder="e.g. പൂർത്തീകരണം" 
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Government (English)</label>
                      <input 
                        type="text" 
                        value={timelineForm.governmentEn} 
                        onChange={(e) => setTimelineForm({ ...timelineForm, governmentEn: e.target.value })} 
                        placeholder="e.g. LDF Government (Pinarayi Vijayan)" 
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Government (Malayalam)</label>
                      <input 
                        type="text" 
                        value={timelineForm.governmentMl} 
                        onChange={(e) => setTimelineForm({ ...timelineForm, governmentMl: e.target.value })} 
                        placeholder="e.g. എൽ.ഡി.എഫ്. സർക്കാർ (പിണറായി വിജയൻ)" 
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Realtime Metric/Stats (English)</label>
                      <input 
                        type="text" 
                        value={timelineForm.statsEn || ''} 
                        onChange={(e) => setTimelineForm({ ...timelineForm, statsEn: e.target.value })} 
                        placeholder="e.g. 95% Highway Widening Completed" 
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Realtime Metric/Stats (Malayalam)</label>
                      <input 
                        type="text" 
                        value={timelineForm.statsMl || ''} 
                        onChange={(e) => setTimelineForm({ ...timelineForm, statsMl: e.target.value })} 
                        placeholder="e.g. ദേശീയപാത വികസനം 95% പൂർത്തിയായി" 
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Description (English)</label>
                      <textarea 
                        value={timelineForm.descEn} 
                        onChange={(e) => setTimelineForm({ ...timelineForm, descEn: e.target.value })} 
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 h-20"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Description (Malayalam)</label>
                      <textarea 
                        value={timelineForm.descMl} 
                        onChange={(e) => setTimelineForm({ ...timelineForm, descMl: e.target.value })} 
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 h-20"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 4. TESTIMONIAL FORM */}
              {modalType === 'testimonial' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Name</label>
                      <input 
                        type="text" 
                        value={testimonialForm.name} 
                        onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })} 
                        placeholder="e.g. Thomas Joseph" 
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Role/Location</label>
                      <input 
                        type="text" 
                        value={testimonialForm.role} 
                        onChange={(e) => setTestimonialForm({ ...testimonialForm, role: e.target.value })} 
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Rating (1 - 5 Stars)</label>
                      <select 
                        value={testimonialForm.rating} 
                        onChange={(e) => setTestimonialForm({ ...testimonialForm, rating: parseInt(e.target.value) || 5 })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                        required
                      >
                        <option value="5">★★★★★ (5 Stars)</option>
                        <option value="4">★★★★ (4 Stars)</option>
                        <option value="3">★★★ (3 Stars)</option>
                        <option value="2">★★ (2 Stars)</option>
                        <option value="1">★ (1 Star)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Avatar Image</label>
                      <div className="space-y-3">
                        {testimonialForm.avatar ? (
                          <div className="flex items-center space-x-3 p-1.5 bg-slate-950 border border-slate-800 rounded-lg">
                            <img 
                              src={testimonialForm.avatar} 
                              alt="Avatar Preview" 
                              className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0"
                            />
                            <span className="text-[10px] text-slate-400 truncate flex-1 font-mono">
                              {testimonialForm.avatar.split('/').pop()}
                            </span>
                            <button
                              type="button"
                              onClick={() => setTestimonialForm({ ...testimonialForm, avatar: '' })}
                              className="p-1.5 bg-red-600 hover:bg-red-500 text-white rounded transition-colors cursor-pointer"
                              title="Remove Image"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex items-center justify-center space-x-2 border border-dashed border-slate-800 hover:border-indigo-500 rounded-lg p-2.5 cursor-pointer hover:bg-slate-950/50 transition-all text-center">
                            {uploadingStates.avatar ? (
                              <div className="flex items-center space-x-2 py-0.5">
                                <div className="w-3.5 h-3.5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-[10px] font-semibold text-indigo-400">Uploading...</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2 py-0.5">
                                <Plus className="w-4 h-4 text-slate-400" />
                                <span className="text-[10px] font-semibold text-slate-300">Upload Citizen Photo</span>
                              </div>
                            )}
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={(e) => handleImageUpload(e, 'avatar', setTestimonialForm)}
                              className="hidden" 
                              disabled={uploadingStates.avatar}
                            />
                          </label>
                        )}
                        <input type="hidden" value={testimonialForm.avatar} required />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Feedback (English)</label>
                      <textarea 
                        value={testimonialForm.quoteEn} 
                        onChange={(e) => setTestimonialForm({ ...testimonialForm, quoteEn: e.target.value })} 
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 h-20"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Feedback (Malayalam)</label>
                      <textarea 
                        value={testimonialForm.quoteMl} 
                        onChange={(e) => setTestimonialForm({ ...testimonialForm, quoteMl: e.target.value })} 
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 h-20"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Form Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-2">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={usingFallback}
                  className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-500 active:bg-indigo-700 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {editingItem ? 'Save Changes' : 'Create Record'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
