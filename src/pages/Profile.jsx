import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  MapPin, 
  Link as LinkIcon, 
  Calendar, 
  ArrowLeft, 
  Edit3, 
  Camera, 
  Loader2, 
  MessageCircle, 
  Heart, 
  ThumbsDown, 
  Share2, 
  Repeat2, 
  Trash2,
  AlertCircle,
  Home,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Default images
const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
const DEFAULT_BANNER = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';

// Colors config
const ACCENTS = {
  green: {
    primary: '#2ECC71',
    text: 'text-[#2ECC71]',
    bg: 'bg-[#2ECC71]/10',
    btnBg: 'bg-[#2ECC71] text-black hover:bg-[#27AE60] hover:text-white',
  },
  blue: {
    primary: '#3498db',
    text: 'text-[#3498db]',
    bg: 'bg-[#3498db]/10',
    btnBg: 'bg-[#3498db] text-white hover:bg-[#2980b9]',
  },
  gold: {
    primary: '#f1c40f',
    text: 'text-[#f1c40f]',
    bg: 'bg-[#f1c40f]/10',
    btnBg: 'bg-[#f1c40f] text-black hover:bg-[#d9b30d] hover:text-white',
  },
  purple: {
    primary: '#9b59b6',
    text: 'text-[#9b59b6]',
    bg: 'bg-[#9b59b6]/10',
    btnBg: 'bg-[#9b59b6] text-white hover:bg-[#8e44ad]',
  }
};

export default function Profile() {
  const { id } = useParams();
  const { user: currentUser, token, API_BASE_URL, language, toggleLanguage, t, theme, toggleTheme } = useAuth();
  const navigate = useNavigate();

  const isOwnProfile = !id || parseInt(id) === currentUser?.id;
  const targetUserId = isOwnProfile ? currentUser?.id : id;

  const [profileUser, setProfileUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [activeTab, setActiveTab] = useState('posts'); // posts, replies, likes
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editWebsite, setEditWebsite] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [editCover, setEditCover] = useState('');
  const [selectedAccent, setSelectedAccent] = useState(localStorage.getItem(`accent_${currentUser?.id}`) || 'green');
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingField, setUploadingField] = useState(null);

  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const accentStyle = ACCENTS[selectedAccent] || ACCENTS.green;

  // Sync login status
  useEffect(() => {
    if (!currentUser && isOwnProfile) {
      navigate('/login');
    }
  }, [currentUser, isOwnProfile, navigate]);

  // Load Profile User Details
  useEffect(() => {
    const fetchProfile = async () => {
      if (!targetUserId) return;
      setLoadingProfile(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/user/profile/${targetUserId}`, {
          headers: {
            'Accept': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          }
        });

        if (!response.ok) {
          throw new Error('Profile not found.');
        }

        const data = await response.json();
        setProfileUser(data.user);
        
        setEditName(data.user.name || '');
        setEditBio(data.user.bio || '');
        setEditLocation(data.user.location || '');
        setEditWebsite(data.user.website || '');
        setEditAvatar(data.user.avatar || '');
        setEditCover(data.user.cover_photo || '');
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [targetUserId, API_BASE_URL, token]);

  // Load User Activity Feed
  useEffect(() => {
    const fetchBlogs = async () => {
      if (!targetUserId) return;
      setLoadingBlogs(true);
      try {
        const response = await fetch(`${API_BASE_URL}/blogs?user_id=${targetUserId}&type=${activeTab}`, {
          headers: {
            'Accept': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          }
        });

        if (response.ok) {
          const data = await response.json();
          setBlogs(data);
        }
      } catch (err) {
        console.error('Failed to fetch user blogs:', err);
      } finally {
        setLoadingBlogs(false);
      }
    };

    fetchBlogs();
  }, [targetUserId, activeTab, API_BASE_URL, token]);

  // Update profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editName,
          bio: editBio,
          location: editLocation,
          website: editWebsite,
          avatar: editAvatar,
          cover_photo: editCover
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update profile.');
      }

      const data = await response.json();
      setProfileUser(data.user);
      
      localStorage.setItem(`accent_${currentUser.id}`, selectedAccent);
      setIsEditOpen(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  // Upload pictures
  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploadingField(field);
    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Image upload failed.');
      }

      const data = await response.json();
      if (field === 'avatar') {
        setEditAvatar(data.url);
      } else {
        setEditCover(data.url);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setUploadingField(null);
    }
  };

  // Like / Dislike
  const handleReact = async (blogId, type) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/blogs/${blogId}/react`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ type })
      });

      if (response.ok) {
        const updatedBlog = await response.json();
        setBlogs(blogs.map(b => b.id === blogId ? {
          ...b,
          likes_count: updatedBlog.likes_count,
          dislikes_count: updatedBlog.dislikes_count,
          is_liked: updatedBlog.is_liked,
          is_disliked: updatedBlog.is_disliked
        } : b));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete blog
  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm(t('Are you sure you want to delete this post?', 'ഈ പോസ്റ്റ് ഡിലീറ്റ് ചെയ്യണമെന്ന് ഉറപ്പാണോ?'))) return;

    try {
      const response = await fetch(`${API_BASE_URL}/blogs/${blogId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setBlogs(blogs.filter(b => b.id !== blogId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Copy share link
  const handleShareLink = (blogId) => {
    const link = `${window.location.origin}/blog/${blogId}`;
    navigator.clipboard.writeText(link);
    alert(t('Share link copied to clipboard!', 'പങ്കിടാനുള്ള ലിങ്ക് കോപ്പി ചെയ്തു!'));
  };

  // Reshare (Retweet)
  const handleReshare = async (blogId) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (!window.confirm(t('Reshare this blog post?', 'ഈ പോസ്റ്റ് റീ-ഷെയർ ചെയ്യണമെന്നുണ്ടോ?'))) return;

    try {
      const response = await fetch(`${API_BASE_URL}/blogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reshare_id: blogId })
      });

      if (response.ok) {
        alert(t('Reshared successfully!', 'വിജയകരമായി റീ-ഷെയർ ചെയ്തു!'));
        if (activeTab === 'posts') {
          const freshBlogs = await fetch(`${API_BASE_URL}/blogs?user_id=${targetUserId}&type=posts`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }).then(res => res.json());
          setBlogs(freshBlogs);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center text-xs font-mono text-accent-green">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        <span>{t('Loading profile...', 'പ്രൊഫൈൽ ലോഡ് ചെയ്യുന്നു...')}</span>
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div className="min-h-screen bg-bg-main flex flex-col items-center justify-center p-6 text-center text-txt-primary font-sans">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">{t('Profile Unavailable', 'പ്രൊഫൈൽ ലഭ്യമല്ല')}</h2>
        <p className="text-sm text-txt-secondary mb-6 max-w-sm">{error || t('The profile you are looking for does not exist.', 'പ്രൊഫൈൽ കണ്ടെത്താൻ കഴിഞ്ഞില്ല.')}</p>
        <Link to="/" className="inline-flex items-center px-5 py-2.5 rounded-full border border-border-main bg-bg-sec text-xs font-bold transition-all uppercase tracking-wider">
          <ArrowLeft className="w-3.5 h-3.5 mr-2" /> {t('Return Home', 'മടങ്ങുക')}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-main text-txt-primary font-sans relative pb-12 overflow-x-hidden transition-colors duration-200">
      
      {/* Sticky Header with Toggles */}
      <div className="sticky top-0 z-30 bg-bg-main/90 border-b border-border-main py-3.5 px-6 backdrop-blur-md">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <button 
              onClick={() => navigate(-1)} 
              className="p-2 rounded-xl border border-border-main bg-bg-sec hover:bg-bg-main transition-colors text-txt-primary cursor-pointer"
              title={t('Go Back', 'പിന്നിലേക്ക്')}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={() => navigate('/')} 
              className="p-2 rounded-xl border border-border-main bg-bg-sec hover:bg-bg-main transition-colors text-accent-green cursor-pointer"
              title={t('Return Home', 'ഹോം')}
            >
              <Home className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center space-x-3">
            {/* Lang switcher */}
            <button 
              onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-xl border border-border-main bg-bg-sec hover:bg-bg-main text-xs font-semibold cursor-pointer transition-all"
            >
              {language === 'en' ? 'മലയാളം' : 'English'}
            </button>

            {/* Theme Switcher */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-border-main bg-bg-sec hover:bg-bg-main cursor-pointer transition-all"
              title={t('Toggle theme', 'തീം മാറ്റുക')}
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-slate-700" />
              ) : (
                <Sun className="w-4 h-4 text-yellow-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-6">
        {/* Banner Cover Image */}
        <div className="relative h-44 md:h-56 rounded-2xl overflow-hidden border border-border-main bg-bg-sec shadow-sm">
          <img 
            src={profileUser.cover_photo || DEFAULT_BANNER} 
            alt="Banner" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Profile Avatar and CTA */}
        <div className="flex justify-between items-end px-4 -mt-12 relative mb-6">
          <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden border-[4px] border-bg-main bg-bg-sec shadow-md">
            <img 
              src={profileUser.avatar || DEFAULT_AVATAR} 
              alt={profileUser.name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          {isOwnProfile ? (
            <button
              onClick={() => setIsEditOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-border-main bg-bg-sec text-xs font-bold hover:bg-bg-main transition-all cursor-pointer shadow-sm text-txt-primary"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{t('Edit Profile', 'പ്രൊഫൈൽ മാറ്റുക')}</span>
            </button>
          ) : (
            <div className="h-10" />
          )}
        </div>

        {/* User Info Details */}
        <div className="px-4 space-y-3">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">{profileUser.name}</h2>
            <p className="text-xs text-txt-secondary font-mono">{profileUser.email}</p>
          </div>

          <p className="text-sm leading-relaxed text-txt-primary">
            {profileUser.bio || t('KeralaOne citizen post creator.', 'കേരളOne പൗരൻ.')}
          </p>

          {/* Location / Website / Joined metadata */}
          <div className="flex flex-wrap gap-y-2 gap-x-5 text-xs text-txt-secondary pt-1 font-medium">
            {profileUser.location && (
              <div className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                <span>{profileUser.location}</span>
              </div>
            )}
            {profileUser.website && (
              <div className="flex items-center space-x-1">
                <LinkIcon className="w-3.5 h-3.5 text-blue-500" />
                <a 
                  href={profileUser.website.startsWith('http') ? profileUser.website : `https://${profileUser.website}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:underline text-blue-500"
                >
                  {profileUser.website.replace(/(^\w+:|^)\/\//, '')}
                </a>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-green-500" />
              <span>{t('Joined', 'ചേർന്നത്')} {new Date(profileUser.created_at).toLocaleDateString(undefined, {month: 'long', year: 'numeric'})}</span>
            </div>
          </div>
        </div>

        {/* Feed tabs switcher */}
        <div className="flex border-b border-border-main mt-8">
          {['posts', 'replies', 'likes'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-xs font-mono uppercase tracking-wider font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === tab 
                  ? 'border-accent-green text-txt-primary' 
                  : 'border-transparent text-txt-secondary hover:text-txt-primary'
              }`}
            >
              {tab === 'posts' && t('Posts', 'ഫീഡുകൾ')}
              {tab === 'replies' && t('Replies', 'മറുപടികൾ')}
              {tab === 'likes' && t('Likes', 'ലൈക്കുകൾ')}
            </button>
          ))}
        </div>

        {/* Feed timeline list */}
        <div className="mt-6 space-y-4">
          {loadingBlogs ? (
            <div className="py-12 flex justify-center items-center text-xs text-txt-secondary font-mono">
              <Loader2 className="w-4 h-4 animate-spin mr-2" /> {t('Loading...', 'ലോഡ് ചെയ്യുന്നു...')}
            </div>
          ) : blogs.length === 0 ? (
            <div className="py-16 text-center border border-border-main bg-bg-sec rounded-2xl p-6">
              <p className="text-sm text-txt-secondary">{t('No posts found here.', 'ഇതുവരെ പോസ്റ്റുകൾ ഒന്നും ഇല്ല.')}</p>
            </div>
          ) : (
            blogs.map((blog) => {
              const isReshare = !!blog.reshare_id;
              const originalPost = blog.reshare;
              const displayPost = isReshare ? originalPost : blog;

              if (isReshare && !originalPost) return null;

              return (
                <div
                  key={blog.id}
                  className="border border-border-main bg-bg-sec rounded-2xl p-5 hover:bg-bg-sec/80 transition-all duration-200 relative"
                >
                  {isReshare && (
                    <div className="flex items-center space-x-1.5 text-xs text-txt-secondary mb-3 font-mono">
                      <Repeat2 className="w-3.5 h-3.5 text-accent-green" />
                      <span>{blog.user.name} {t('reshared', 'റീ-ഷെയർ ചെയ്തു')}</span>
                    </div>
                  )}

                  {/* Top Author Details */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <Link to={`/profile/${displayPost.user.id}`} className="w-9 h-9 rounded-xl overflow-hidden bg-bg-main flex-shrink-0 block border border-border-main">
                        <img 
                          src={displayPost.user.avatar || DEFAULT_AVATAR} 
                          alt={displayPost.user.name} 
                          className="w-full h-full object-cover"
                        />
                      </Link>
                      <div>
                        <div className="flex items-center space-x-2 flex-wrap">
                          <Link to={`/profile/${displayPost.user.id}`} className="text-xs font-bold hover:underline text-txt-primary">
                            {displayPost.user.name}
                          </Link>
                          {displayPost.user.is_admin && (
                            <span className="bg-accent-green/10 text-accent-green text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                              {t('Official', 'ഔദ്യോഗികം')}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-txt-secondary font-mono">
                          {new Date(displayPost.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {currentUser && (currentUser.id === blog.user_id || currentUser.is_admin) && (
                      <button
                        onClick={() => handleDeleteBlog(blog.id)}
                        className="text-txt-secondary hover:text-red-500 p-1.5 rounded-xl hover:bg-red-500/5 transition-colors cursor-pointer"
                        title={t('Delete Post', 'ഡിലീറ്റ്')}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="mt-3 pl-12">
                    {displayPost.content && (
                      <p className="text-sm leading-relaxed text-txt-primary whitespace-pre-wrap">
                        {displayPost.content}
                      </p>
                    )}
                    {displayPost.image_url && (
                      <div className="mt-3 rounded-xl overflow-hidden border border-border-main bg-bg-main max-h-[300px]">
                        <img 
                          src={displayPost.image_url} 
                          alt="Post attachment" 
                          className="w-full h-full object-contain max-h-[300px]"
                        />
                      </div>
                    )}
                  </div>

                  {/* Action items */}
                  <div className="flex items-center justify-between border-t border-border-main mt-4 pt-3.5 text-txt-secondary pl-12">
                    <Link 
                      to={`/blog/${displayPost.id}`} 
                      className="flex items-center space-x-1.5 hover:text-txt-primary transition-colors text-xs font-mono"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{displayPost.replies_count || 0}</span>
                    </Link>

                    <button
                      onClick={() => handleReact(displayPost.id, 'like')}
                      className={`flex items-center space-x-1.5 transition-colors text-xs font-mono cursor-pointer ${
                        displayPost.is_liked ? 'text-red-500' : 'hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${displayPost.is_liked ? 'fill-red-500' : ''}`} />
                      <span>{displayPost.likes_count || 0}</span>
                    </button>

                    <button
                      onClick={() => handleReact(displayPost.id, 'dislike')}
                      className={`flex items-center space-x-1.5 transition-colors text-xs font-mono cursor-pointer ${
                        displayPost.is_disliked ? 'text-orange-500' : 'hover:text-orange-500'
                      }`}
                    >
                      <ThumbsDown className={`w-4 h-4 ${displayPost.is_disliked ? 'fill-orange-500' : ''}`} />
                      <span>{displayPost.dislikes_count || 0}</span>
                    </button>

                    <button
                      onClick={() => handleReshare(displayPost.id)}
                      className="flex items-center space-x-1.5 hover:text-accent-green transition-colors text-xs font-mono cursor-pointer"
                      title={t('Reshare', 'റീ-ഷെയർ')}
                    >
                      <Repeat2 className="w-4 h-4" />
                      <span>{displayPost.reshares_count || 0}</span>
                    </button>

                    <button
                      onClick={() => handleShareLink(displayPost.id)}
                      className="flex items-center space-x-1.5 hover:text-blue-500 transition-colors text-xs font-mono cursor-pointer"
                      title={t('Copy share link', 'ലിങ്ക് കോപ്പി ചെയ്യുക')}
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 10 }}
              className="relative z-10 w-full max-w-lg bg-bg-sec border border-border-main rounded-2xl p-6 shadow-xl overflow-y-auto max-h-[85vh] no-scrollbar text-txt-primary"
            >
              <h2 className="text-lg font-bold mb-5">
                <span>{t('Customise Profile', 'പ്രൊഫൈൽ ക്രമീകരിക്കുക')}</span>
              </h2>

              <form onSubmit={handleSaveProfile} className="space-y-5">
                {/* Images */}
                <div className="space-y-4">
                  <div className="relative h-24 rounded-xl overflow-hidden bg-bg-main border border-border-main group">
                    <img 
                      src={editCover || DEFAULT_BANNER} 
                      alt="Edit cover" 
                      className="w-full h-full object-cover opacity-70"
                    />
                    <button
                      type="button"
                      onClick={() => coverInputRef.current.click()}
                      className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      {uploadingField === 'cover' ? (
                        <Loader2 className="w-5 h-5 animate-spin text-white" />
                      ) : (
                        <Camera className="w-5 h-5 text-white" />
                      )}
                    </button>
                    <input 
                      type="file" 
                      ref={coverInputRef} 
                      onChange={(e) => handleImageUpload(e, 'cover')} 
                      className="hidden" 
                      accept="image/*"
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-bg-main border border-border-main group flex-shrink-0">
                      <img 
                        src={editAvatar || DEFAULT_AVATAR} 
                        alt="Edit avatar" 
                        className="w-full h-full object-cover opacity-75"
                      />
                      <button
                        type="button"
                        onClick={() => avatarInputRef.current.click()}
                        className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        {uploadingField === 'avatar' ? (
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                        ) : (
                          <Camera className="w-4 h-4 text-white" />
                        )}
                      </button>
                      <input 
                        type="file" 
                        ref={avatarInputRef} 
                        onChange={(e) => handleImageUpload(e, 'avatar')} 
                        className="hidden" 
                        accept="image/*"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-bold">{t('Profile Picture', 'പ്രൊഫൈൽ ചിത്രം')}</p>
                      <p className="text-[10px] text-txt-secondary">{t('Click icon on photo to upload', 'ചിത്രം മാറ്റാൻ ക്ലിക്ക് ചെയ്യുക')}</p>
                    </div>
                  </div>
                </div>

                {/* Accent selection */}
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-txt-secondary mb-2">
                    {t('Profile Theme Accent', 'പ്രൊഫൈൽ തീം നിറം')}
                  </label>
                  <div className="flex space-x-3">
                    {Object.keys(ACCENTS).map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedAccent(color)}
                        className={`w-7 h-7 rounded-full border transition-all flex items-center justify-center cursor-pointer ${
                          selectedAccent === color 
                            ? 'border-txt-primary scale-105' 
                            : 'border-transparent hover:scale-102'
                        }`}
                        style={{ backgroundColor: ACCENTS[color].primary }}
                      >
                        {selectedAccent === color && (
                          <div className="w-2 h-2 rounded-full bg-black/45" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Inputs */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-txt-secondary mb-1">
                      {t('Full Name', 'മുഴുവൻ പേര്')}
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-bg-main border border-border-main rounded-xl py-2.5 px-3 text-xs text-txt-primary focus:outline-none focus:border-accent-green transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-txt-secondary mb-1">
                      {t('Bio', 'വിവരണം')}
                    </label>
                    <textarea
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      placeholder={t('Tell us about yourself...', 'നിങ്ങളെപ്പറ്റി പറയുക...')}
                      rows="2.5"
                      className="w-full bg-bg-main border border-border-main rounded-xl py-2.5 px-3 text-xs text-txt-primary focus:outline-none focus:border-accent-green transition-all resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-txt-secondary mb-1">
                        {t('Location', 'സ്ഥലം')}
                      </label>
                      <input
                        type="text"
                        value={editLocation}
                        onChange={(e) => setEditLocation(e.target.value)}
                        placeholder="e.g. Kerala"
                        className="w-full bg-bg-main border border-border-main rounded-xl py-2.5 px-3 text-xs text-txt-primary focus:outline-none focus:border-accent-green transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-txt-secondary mb-1">
                        {t('Website URL', 'വെബ്സൈറ്റ് ലിങ്ക്')}
                      </label>
                      <input
                        type="text"
                        value={editWebsite}
                        onChange={(e) => setEditWebsite(e.target.value)}
                        placeholder="e.g. domain.com"
                        className="w-full bg-bg-main border border-border-main rounded-xl py-2.5 px-3 text-xs text-txt-primary focus:outline-none focus:border-accent-green transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-3 border-t border-border-main">
                  <button
                    type="button"
                    onClick={() => setIsEditOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-border-main text-xs font-bold hover:bg-bg-main transition-all text-center cursor-pointer"
                  >
                    {t('Cancel', 'റദ്ദാക്കുക')}
                  </button>
                  <button
                    type="submit"
                    disabled={savingProfile || uploadingField !== null}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${accentStyle.btnBg}`}
                  >
                    {savingProfile ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <span>{t('Save Profile', 'സേവ് ചെയ്യുക')}</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
