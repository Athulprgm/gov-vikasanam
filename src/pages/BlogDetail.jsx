import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, 
  Home,
  MessageCircle, 
  Heart, 
  ThumbsDown, 
  Share2, 
  Repeat2, 
  Send, 
  Loader2, 
  Trash2,
  AlertCircle,
  Sun,
  Moon
} from 'lucide-react';
import { motion } from 'framer-motion';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';

export default function BlogDetail() {
  const { id } = useParams();
  const { user, token, API_BASE_URL, language, toggleLanguage, t, theme, toggleTheme } = useAuth();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Reply state
  const [replyContent, setReplyContent] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  // Fetch thread details
  const fetchThread = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
        headers: {
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });

      if (!response.ok) {
        throw new Error('Thread not found.');
      }

      const data = await response.json();
      setBlog(data.blog);
      setReplies(data.replies);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThread();
  }, [id, API_BASE_URL, token]);

  // Submit reply
  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!token) {
      navigate('/login');
      return;
    }

    if (!replyContent.trim()) return;

    setSubmittingReply(true);
    try {
      const response = await fetch(`${API_BASE_URL}/blogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: replyContent,
          parent_id: id
        })
      });

      if (response.ok) {
        const newReply = await response.json();
        setReplies([...replies, newReply]);
        setReplyContent('');
        setBlog(prev => ({
          ...prev,
          replies_count: (prev.replies_count || 0) + 1
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReply(false);
    }
  };

  // React
  const handleReact = async (blogId, type, isMain = false) => {
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
        const updated = await response.json();
        
        if (isMain) {
          setBlog(prev => ({
            ...prev,
            likes_count: updated.likes_count,
            dislikes_count: updated.dislikes_count,
            is_liked: updated.is_liked,
            is_disliked: updated.is_disliked
          }));
        } else {
          setReplies(replies.map(r => r.id === blogId ? {
            ...r,
            likes_count: updated.likes_count,
            dislikes_count: updated.dislikes_count,
            is_liked: updated.is_liked,
            is_disliked: updated.is_disliked
          } : r));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Copy share links
  const handleShareLink = (blogId) => {
    const link = `${window.location.origin}/blog/${blogId}`;
    navigator.clipboard.writeText(link);
    alert(t('Link copied to clipboard!', 'ലിങ്ക് കോപ്പി ചെയ്തു!'));
  };

  // Reshare (Retweet)
  const handleReshare = async (blogId, isMain = false) => {
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
        alert(t('Reshared successfully!', 'വിജയകരമായി റീ-ഷെയർ ചെയ്തു!'));
        if (isMain) {
          setBlog(prev => ({
            ...prev,
            reshares_count: (prev.reshares_count || 0) + 1
          }));
        } else {
          setReplies(replies.map(r => r.id === blogId ? {
            ...r,
            reshares_count: (r.reshares_count || 0) + 1
          } : r));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete post
  const handleDeletePost = async (blogId, isMain = false) => {
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
        if (isMain) {
          alert(t('Post deleted successfully.', 'പോസ്റ്റ് ഡിലീറ്റ് ചെയ്തു.'));
          navigate('/feed');
        } else {
          setReplies(replies.filter(r => r.id !== blogId));
          setBlog(prev => ({
            ...prev,
            replies_count: Math.max(0, (prev.replies_count || 0) - 1)
          }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center text-xs font-mono text-accent-green">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        <span>{t('Loading thread...', 'ചർച്ച ലോഡ് ചെയ്യുന്നു...')}</span>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-bg-main flex flex-col items-center justify-center p-6 text-center text-txt-primary font-sans">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">{t('Thread Unavailable', 'ചർച്ച ലഭ്യമായില്ല')}</h2>
        <p className="text-sm text-txt-secondary mb-6 max-w-sm">{error || t('The thread you are looking for does not exist or has been deleted.', 'ഈ വിഷയം കണ്ടെത്താൻ കഴിഞ്ഞില്ല.')}</p>
        <Link to="/feed" className="inline-flex items-center px-5 py-2.5 rounded-full border border-border-main bg-bg-sec text-xs font-bold transition-all uppercase tracking-wider">
          <ArrowLeft className="w-3.5 h-3.5 mr-2" /> {t('Return to Feed', 'ഫീഡിലേക്ക് മടങ്ങുക')}
        </Link>
      </div>
    );
  }

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
        
        {/* Navigation Bar */}
        <div className="mb-4 flex space-x-2 justify-start items-center">
          <button 
            onClick={() => navigate('/feed')} 
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full border border-border-main bg-bg-sec hover:bg-bg-main text-xs font-mono text-txt-primary cursor-pointer transition-all"
            title={t('Back to Feed', 'ഫീഡിലേക്ക് മടങ്ങുക')}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t('Back to Feed', 'ഫീഡിലേക്ക്')}</span>
          </button>
        </div>

        {/* Parent tweet if this is a reply */}
        {blog.parent && (
          <div className="relative mb-2">
            <div className="border border-border-main bg-bg-sec rounded-2xl p-4 relative z-10">
              <div className="flex items-center space-x-3 mb-2">
                <Link to={`/profile/${blog.parent.user.id}`} className="w-7 h-7 rounded-lg overflow-hidden bg-bg-main flex-shrink-0 block border border-border-main">
                  <img src={blog.parent.user?.avatar || DEFAULT_AVATAR} alt={blog.parent.user?.name} className="w-full h-full object-cover" />
                </Link>
                <div>
                  <Link to={`/profile/${blog.parent.user.id}`} className="text-xs font-bold text-txt-primary hover:underline">
                    {blog.parent.user?.name}
                  </Link>
                  <p className="text-[9px] text-txt-secondary font-mono">{new Date(blog.parent.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <p className="text-xs text-txt-primary pl-10">{blog.parent.content}</p>
              <div className="mt-2.5 pl-10">
                <Link to={`/blog/${blog.parent.id}`} className="text-[10px] text-accent-green hover:underline font-mono">
                  {t('View entire parent thread →', 'മുഴുവൻ ചർച്ചയും കാണുക →')}
                </Link>
              </div>
            </div>
            <div className="absolute left-[24px] top-[40px] bottom-[-20px] w-[2px] bg-border-main z-0 pointer-events-none" />
          </div>
        )}

        {/* The Main Focus Post */}
        <div className="border border-border-main bg-bg-sec rounded-2xl p-6 shadow-sm relative overflow-hidden mb-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <Link to={`/profile/${blog.user.id}`} className="w-11 h-11 rounded-xl overflow-hidden bg-bg-main flex-shrink-0 block border border-border-main">
                <img 
                  src={blog.user.avatar || DEFAULT_AVATAR} 
                  alt={blog.user.name} 
                  className="w-full h-full object-cover"
                />
              </Link>
              <div>
                <div className="flex items-center space-x-2">
                  <Link to={`/profile/${blog.user.id}`} className="text-sm font-extrabold hover:underline text-txt-primary">
                    {blog.user.name}
                  </Link>
                  {blog.user.is_admin && (
                    <span className="bg-accent-green/10 text-accent-green text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                      {t('Official', 'ഔദ്യോഗികം')}
                    </span>
                  )}
                </div>
                <p className="text-xs text-txt-secondary font-mono">{blog.user.email}</p>
              </div>
            </div>

            {user && (user.id === blog.user_id || user.is_admin) && (
              <button
                onClick={() => handleDeletePost(blog.id, true)}
                className="text-txt-secondary hover:text-red-500 p-1.5 rounded-xl hover:bg-red-500/5 transition-colors cursor-pointer"
                title={t('Delete Post', 'ഡിലീറ്റ്')}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="mt-5">
            {blog.content && (
              <p className="text-base leading-relaxed text-txt-primary whitespace-pre-wrap">
                {blog.content}
              </p>
            )}
            {blog.image_url && (
              <div className="mt-3.5 rounded-xl overflow-hidden border border-border-main bg-bg-main">
                <img 
                  src={blog.image_url} 
                  alt="Post Attachment" 
                  className="w-full object-contain max-h-[450px]"
                />
              </div>
            )}
            <p className="text-[10px] text-txt-secondary font-mono mt-5 pt-3.5 border-t border-border-main">
              {t('Posted on', 'പോസ്റ്റ് ചെയ്തത്')} {new Date(blog.created_at).toLocaleDateString()} {t('at', 'സമയം')} {new Date(blog.created_at).toLocaleTimeString()}
            </p>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between border-t border-border-main mt-5 pt-3.5 text-txt-secondary">
            <span className="flex items-center space-x-1.5 text-xs font-mono">
              <MessageCircle className="w-4 h-4" />
              <span>{blog.replies_count || 0} {t('replies', 'മറുപടികൾ')}</span>
            </span>

            <button
              onClick={() => handleReact(blog.id, 'like', true)}
              className={`flex items-center space-x-1.5 transition-colors text-xs font-mono cursor-pointer ${
                blog.is_liked ? 'text-red-500' : 'hover:text-red-500'
              }`}
            >
              <Heart className={`w-4 h-4 ${blog.is_liked ? 'fill-red-500' : ''}`} />
              <span>{blog.likes_count || 0}</span>
            </button>

            <button
              onClick={() => handleReact(blog.id, 'dislike', true)}
              className={`flex items-center space-x-1.5 transition-colors text-xs font-mono cursor-pointer ${
                blog.is_disliked ? 'text-orange-500' : 'hover:text-orange-500'
              }`}
            >
              <ThumbsDown className={`w-4 h-4 ${blog.is_disliked ? 'fill-orange-500' : ''}`} />
              <span>{blog.dislikes_count || 0}</span>
            </button>

            <button
              onClick={() => handleReshare(blog.id, true)}
              className="flex items-center space-x-1.5 hover:text-accent-green transition-colors text-xs font-mono cursor-pointer"
              title={t('Reshare', 'റീ-ഷെയർ')}
            >
              <Repeat2 className="w-4 h-4" />
              <span>{blog.reshares_count || 0}</span>
            </button>

            <button
              onClick={() => handleShareLink(blog.id)}
              className="flex items-center space-x-1.5 hover:text-blue-500 transition-colors text-xs font-mono cursor-pointer"
              title={t('Copy share link', 'ലിങ്ക് കോപ്പി ചെയ്യുക')}
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Reply form */}
        {user ? (
          <form 
            onSubmit={handleSubmitReply} 
            className="border border-border-main bg-bg-sec rounded-2xl p-4 mb-6 flex space-x-3 items-end"
          >
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-bg-main flex-shrink-0 mb-1 border border-border-main">
              <img src={user.avatar || DEFAULT_AVATAR} alt={user.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 relative">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={t("Post your reply...", "ഈ ചർച്ചയിൽ മറുപടി നൽകുക...")}
                rows="2"
                className="w-full bg-transparent border-0 text-sm text-txt-primary placeholder-txt-secondary/40 focus:outline-none focus:ring-0 resize-none pr-10 pb-1"
                required
              />
              <button
                type="submit"
                disabled={submittingReply || !replyContent.trim()}
                className="absolute right-0 bottom-1 p-2 rounded-xl bg-accent-green text-black hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer"
              >
                {submittingReply ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                ) : (
                  <Send className="w-3.5 h-3.5 text-black" />
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-bg-sec border border-border-main rounded-2xl p-5 text-center mb-6">
            <p className="text-xs text-txt-secondary">
              {t('Please Login to reply to this update.', 'മറുപടി നൽകാൻ ലോഗിൻ ചെയ്യുക.')}{' '}
              <Link to="/login" className="text-accent-green hover:underline font-bold">{t('Login', 'ലോഗിൻ')}</Link>
            </p>
          </div>
        )}

        {/* Replies list */}
        <h3 className="text-xs font-mono uppercase tracking-widest text-txt-secondary mb-3.5 px-1.5">
          {t('Replies', 'മറുപടികൾ')} ({replies.length})
        </h3>

        <div className="space-y-4">
          {replies.length === 0 ? (
            <div className="py-10 text-center border border-border-main rounded-2xl p-6 bg-bg-sec">
              <p className="text-xs text-txt-secondary italic">{t('Be the first to reply!', 'ആദ്യമായി നിങ്ങളുടെ മറുപടി രേഖപ്പെടുത്തൂ!')}</p>
            </div>
          ) : (
            replies.map((reply) => (
              <div 
                key={reply.id} 
                className="border border-border-main bg-bg-sec rounded-2xl p-4 hover:bg-bg-sec/90 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <Link to={`/profile/${reply.user.id}`} className="w-7 h-7 rounded-lg overflow-hidden bg-bg-main flex-shrink-0 block border border-border-main">
                      <img src={reply.user.avatar || DEFAULT_AVATAR} alt={reply.user.name} className="w-full h-full object-cover" />
                    </Link>
                    <div>
                      <div className="flex items-center space-x-2 flex-wrap">
                        <Link to={`/profile/${reply.user.id}`} className="text-xs font-bold hover:underline text-txt-primary">
                          {reply.user.name}
                        </Link>
                        {reply.user.is_admin && (
                          <span className="bg-accent-green/10 text-accent-green text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                            {t('Official', 'ഔദ്യോഗികം')}
                          </span>
                        )}
                      </div>
                      <p className="text-[9px] text-txt-secondary font-mono">
                        {new Date(reply.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {user && (user.id === reply.user_id || user.is_admin) && (
                    <button
                      onClick={() => handleDeletePost(reply.id)}
                      className="text-txt-secondary hover:text-red-500 p-1.5 rounded-xl hover:bg-red-500/5 transition-colors cursor-pointer"
                      title={t('Delete Reply', 'ഡിലീറ്റ്')}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="mt-2.5 pl-10">
                  <p className="text-sm text-txt-primary whitespace-pre-wrap">{reply.content}</p>

                  {/* Actions */}
                  <div className="flex items-center justify-between border-t border-border-main mt-3.5 pt-3.5 text-txt-secondary">
                    <Link to={`/blog/${reply.id}`} className="flex items-center space-x-1.5 hover:text-txt-primary transition-colors text-[10px] font-mono">
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{reply.replies_count || 0}</span>
                    </Link>

                    <button
                      onClick={() => handleReact(reply.id, 'like')}
                      className={`flex items-center space-x-1.5 transition-colors text-[10px] font-mono cursor-pointer ${
                        reply.is_liked ? 'text-red-500' : 'hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${reply.is_liked ? 'fill-red-500' : ''}`} />
                      <span>{reply.likes_count || 0}</span>
                    </button>

                    <button
                      onClick={() => handleReact(reply.id, 'dislike')}
                      className={`flex items-center space-x-1.5 transition-colors text-[10px] font-mono cursor-pointer ${
                        reply.is_disliked ? 'text-orange-500' : 'hover:text-orange-500'
                      }`}
                    >
                      <ThumbsDown className={`w-3.5 h-3.5 ${reply.is_disliked ? 'fill-orange-500' : ''}`} />
                      <span>{reply.dislikes_count || 0}</span>
                    </button>

                    <button
                      onClick={() => handleReshare(reply.id)}
                      className="flex items-center space-x-1.5 hover:text-accent-green transition-colors text-[10px] font-mono cursor-pointer"
                      title={t('Reshare', 'റീ-ഷെയർ')}
                    >
                      <Repeat2 className="w-3.5 h-3.5" />
                      <span>{reply.reshares_count || 0}</span>
                    </button>

                    <button
                      onClick={() => handleShareLink(reply.id)}
                      className="flex items-center space-x-1.5 hover:text-blue-500 transition-colors text-[10px] font-mono cursor-pointer"
                      title={t('Copy share link', 'ലിങ്ക് കോപ്പി ചെയ്യുക')}
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
