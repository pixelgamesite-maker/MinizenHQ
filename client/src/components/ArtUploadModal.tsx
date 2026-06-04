import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

interface ArtUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export default function ArtUploadModal({ isOpen, onClose, userId }: ArtUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [xUrl, setXUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError('File must be under 5MB');
      return;
    }
    setFile(f);
    setError('');
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select an image');
      return;
    }
    if (!xUrl.trim()) {
      setError('Please enter your X post URL');
      return;
    }
    if (!xUrl.includes('x.com') && !xUrl.includes('twitter.com')) {
      setError('Please enter a valid X post URL');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const ext = file.name.split('.').pop();
      const path = `art-submissions/${userId}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('Planetslog')
        .upload(path, file, { upsert: false });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('Planetslog')
        .getPublicUrl(path);

      const { error: dbError } = await supabase
        .from('art_submissions')
        .insert({
          user_id: userId,
          image_url: publicUrl,
          x_post_url: xUrl.trim(),
          status: 'pending',
        });

      if (dbError) throw dbError;

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setFile(null);
        setPreview(null);
        setXUrl('');
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFile(null);
      setPreview(null);
      setXUrl('');
      setError('');
      setSuccess(false);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl p-5 space-y-4"
            style={{ background: 'white', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black" style={{ color: '#1a1a2e' }}>Submit Your Art</h3>
              <button onClick={handleClose} className="w-8 h-8 rounded-full flex items-center justify-center text-lg" style={{ background: '#f4f4f4', color: '#888' }}>×</button>
            </div>

            {success ? (
              <div className="py-8 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-4xl mb-2">🎉</motion.div>
                <div className="text-sm font-black" style={{ color: '#06D6A0' }}>Art submitted!</div>
                <div className="text-xs text-gray-400 mt-1">We'll review it soon</div>
              </div>
            ) : (
              <>
                <div
                  onClick={() => inputRef.current?.click()}
                  className="relative aspect-video rounded-xl flex flex-col items-center justify-center cursor-pointer overflow-hidden"
                  style={{ background: '#f9f9f9', border: '2px dashed #ddd' }}
                >
                  {preview ? (
                    <img src={preview} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <span className="text-3xl mb-1">🖼️</span>
                      <span className="text-xs font-bold" style={{ color: '#aaa' }}>Tap to upload image</span>
                      <span className="text-[10px] mt-0.5" style={{ color: '#ccc' }}>Max 5MB</span>
                    </>
                  )}
                  <input ref={inputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider mb-1.5 block" style={{ color: '#aaa' }}>X Post URL</label>
                  <input
                    type="text"
                    value={xUrl}
                    onChange={(e) => setXUrl(e.target.value)}
                    placeholder="https://x.com/yourhandle/status/..."
                    className="w-full px-3 py-2.5 rounded-xl text-xs"
                    style={{ background: '#f9f9f9', border: '1.5px solid #ececec', color: '#1a1a2e' }}
                  />
                </div>

                {error && (
                  <div className="text-[10px] font-bold px-3 py-2 rounded-lg" style={{ background: 'rgba(239,71,111,0.08)', color: '#EF476F', border: '1px solid rgba(239,71,111,0.2)' }}>
                    {error}
                  </div>
                )}

                <motion.button
                  whileHover={!loading ? { scale: 1.02 } : {}}
                  whileTap={!loading ? { scale: 0.97 } : {}}
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full py-3 rounded-xl text-sm font-black text-white"
                  style={{
                    background: loading ? '#eee' : 'linear-gradient(135deg, #FF6B35, #FF9500)',
                    boxShadow: loading ? 'none' : '0 3px 0 #c04a1a',
                    color: loading ? '#bbb' : 'white',
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loading ? 'Uploading...' : 'Submit Art →'}
                </motion.button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
