import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  MessageCircle, 
  Heart, 
  ThumbsDown, 
  Share2, 
  Repeat2, 
  Image as ImageIcon, 
  Send, 
  Loader2, 
  Trash2, 
  X,
  Globe,
  Plus,
  Home,
  ArrowLeft,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';

export default function BlogsFeed() {
  const { user, token, API_BASE_URL, language, toggleLanguage, t, theme, toggleTheme } = useAuth();
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Drafting states
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [charLimit] = useState(500);

  const fileInputRef = useRef(null);

  // Fetch blogs feed
  const fetchFeed = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs`, {
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
      console.error('Error fetching blogs feed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, [API_BASE_URL, token]);

  // Image Upload handler
  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!token) {
      navigate('/login');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    setUploadingImage(true);
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
      setImageUrl(data.url);
    } catch (err) {
      alert(err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  // Submit new post
  const handleSubmitPost = async (e) => {
    e.preventDefault();
    if (!token) {
      navigate('/login');
      return;
    }

    if (!content.trim() && !imageUrl) {
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/blogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content,
          image_url: imageUrl
        })
      });

      if (response.ok) {
        const newPost = await response.json();
        setBlogs([newPost, ...blogs]);
        setContent('');
        setImageUrl('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // React on post (like, dislike)
  const handleReact = async (blogId, type) => {
    if (!token) {
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

  // Reshare (Retweet)
  const handleReshare = async (blogId) => {
    if (!token) {
      navigate('/login');
      return;
    }

    if (!window.confirm(t('Reshare this post to your feed?', 'ഈ പോസ്റ്റ് റീ-ഷെയർ ചെയ്യണമെന്നുണ്ടോ?'))) return;

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
        const newReshare = await response.json();
        setBlogs([newReshare, ...blogs]);
        alert(t('Reshared successfully!', 'വിജയകരമായി റീ-ഷെയർ ചെയ്തു!'));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Share link
  const handleShareLink = (blogId) => {
    const link = `${window.location.origin}/blog/${blogId}`;
    navigator.clipboard.writeText(link);
    alert(t('Share link copied to clipboard!', 'ലിങ്ക് കോപ്പി ചെയ്തു!'));
  };

  // Delete post
  const handleDeletePost = async (blogId) => {
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

  return (
    <div className="min-h-screen bg-bg-main text-txt-primary font-sans pb-12 overflow-x-hidden relative transition-colors duration-200">
      
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

            {/* Theme switcher */}
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
        
        {/* Title Header */}
        <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4 bg-bg-sec p-5 rounded-2xl border border-border-main shadow-xs">
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-extrabold tracking-tight uppercase">
              {t('JanaVikasam Feed', 'ജനവികസനം ഫീഡ്')}
            </h1>
            <p className="text-xs text-txt-secondary font-mono mt-0.5 uppercase tracking-widest">
              {t('Citizen microblogging & updates', 'പൗരന്മാരുടെ പ്രതികരണങ്ങളും വാർത്തകളും')}
            </p>
          </div>
          
          {user && (
            <Link 
              to="/profile" 
              className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-border-main bg-bg-main hover:bg-bg-sec text-xs text-accent-green font-bold transition-all"
            >
              <img 
                src={user.avatar || DEFAULT_AVATAR} 
                alt={user.name} 
                className="w-5 h-5 rounded-lg object-cover border border-border-main"
              />
              <span>{t('My Profile', 'എന്റെ പ്രൊഫൈൽ')}</span>
            </Link>
          )}
        </div>

        {/* Post compose drafting */}
        {user ? (
          <form 
            onSubmit={handleSubmitPost} 
            className="border border-border-main bg-bg-sec rounded-2xl p-5 mb-6 relative overflow-hidden"
          >
            <div className="flex space-x-3 items-start">
              <div className="w-9 h-9 rounded-xl overflow-hidden bg-bg-main flex-shrink-0 border border-border-main">
                <img 
                  src={user.avatar || DEFAULT_AVATAR} 
                  alt={user.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 space-y-3">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={t("What's happening?", "എന്ത് പുതിയ വാർത്തയുണ്ട്?")}
                  maxLength={charLimit}
                  rows="2.5"
                  className="w-full bg-transparent border-0 text-sm text-txt-primary placeholder-txt-secondary/40 focus:outline-none focus:ring-0 resize-none font-sans"
                  required={!imageUrl}
                />

                {imageUrl && (
                  <div className="relative rounded-xl overflow-hidden border border-border-main bg-bg-main max-h-[250px]">
                    <img 
                      src={imageUrl} 
                      alt="Attachment Preview" 
                      className="w-full h-full object-contain max-h-[250px]"
                    />
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2.5 border-t border-border-main">
                  <div className="flex space-x-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      disabled={uploadingImage}
                      className="p-2 rounded-xl border border-border-main bg-bg-main hover:bg-bg-sec transition-colors text-accent-green cursor-pointer"
                      title={t("Attach image", "ചിത്രം ചേർക്കുക")}
                    >
                      {uploadingImage ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <ImageIcon className="w-4 h-4" />
                      )}
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageSelect}
                      className="hidden"
                      accept="image/*"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    {content.length > 0 && (
                      <span className="text-[10px] font-mono text-txt-secondary">
                        {content.length} / {charLimit}
                      </span>
                    )}

                    <button
                      type="submit"
                      disabled={submitting || (!content.trim() && !imageUrl)}
                      className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-accent-green hover:opacity-90 text-black font-bold text-xs transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {submitting ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <>
                          <span>{t('Post', 'പോസ്റ്റ്')}</span>
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="border border-border-main bg-bg-sec rounded-2xl p-6 mb-6 text-center">
            <h3 className="text-sm font-bold mb-1.5">{t('Join the Feed', 'തീരുമാനങ്ങളിൽ പങ്കാളിയാകൂ')}</h3>
            <p className="text-xs text-txt-secondary mb-4 max-w-sm mx-auto">
              {t('Please sign in to write blogs, reply to citizens, resharing updates, and leave reactions.', 'വിശദാംശങ്ങൾ കാണാനും ലൈക്കുകൾ, പോസ്റ്റുകൾ, മറുപടികൾ എന്നിവ ചെയ്യാനും ലോഗിൻ ചെയ്യുക.')}
            </p>
            <div className="flex justify-center space-x-3">
              <Link to="/login" className="px-4 py-1.5 rounded-xl bg-accent-green text-black font-bold text-xs hover:opacity-95 transition-all">
                {t('Login', 'ലോഗിൻ')}
              </Link>
              <Link to="/register" className="px-4 py-1.5 rounded-xl border border-border-main bg-bg-sec hover:bg-bg-main font-bold text-xs text-txt-primary transition-all">
                {t('Register', 'രജിസ്റ്റർ')}
              </Link>
            </div>
          </div>
        )}

        {/* Feed List */}
        <div className="space-y-4">
          {loading ? (
            <div className="py-20 flex flex-col justify-center items-center text-xs font-mono text-txt-secondary">
              <Loader2 className="w-5 h-5 animate-spin text-accent-green mb-2" />
              <span>{t('Fetching updates...', 'ഫീഡ് ലോഡ് ചെയ്യുന്നു...')}</span>
            </div>
          ) : blogs.length === 0 ? (
            <div className="py-16 text-center border border-border-main bg-bg-sec rounded-2xl p-6">
              <p className="text-sm text-txt-secondary">
                {t('Be the first to share an update on JANA VikaSam!', 'ആദ്യമായി നിങ്ങളുടെ അഭിപ്രായം ഇവിടെ രേഖപ്പെടുത്തൂ!')}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {blogs.map((blog) => {
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
                        <Link to={`/profile/${blog.user.id}`} className="hover:underline font-semibold text-txt-primary">
                          {blog.user.name}
                        </Link>
                        <span>{t('reshared', 'റീ-ഷെയർ ചെയ്തു')}</span>
                      </div>
                    )}

                    {/* Author header */}
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

                      {user && (user.id === blog.user_id || user.is_admin) && (
                        <button
                          onClick={() => handleDeletePost(blog.id)}
                          className="text-txt-secondary hover:text-red-500 p-1.5 rounded-xl hover:bg-red-500/5 transition-colors cursor-pointer"
                          title={t('Delete Post', 'ഡിലീറ്റ്')}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Content body */}
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

                    {/* Quote tweets */}
                    {isReshare && blog.content && (
                      <div className="mt-3 ml-12 border border-border-main rounded-xl p-3 bg-bg-main/50">
                        <p className="text-[10px] text-txt-secondary font-mono mb-1">{t('Quote Comment:', 'അഭിപ്രായം:')}</p>
                        <p className="text-xs text-txt-primary">{blog.content}</p>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex items-center justify-between border-t border-border-main mt-4 pt-3 text-txt-secondary pl-12">
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
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
