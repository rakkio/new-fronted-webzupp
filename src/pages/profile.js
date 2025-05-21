import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useUser } from '../../context/UserContext';
import { FaUser, FaEnvelope, FaUserTag, FaCheckCircle, FaEdit, FaTwitter, FaLinkedin, FaGithub, FaGlobe, FaSun, FaMoon, FaCrown } from 'react-icons/fa';

export default function Profile() {
  const { user } = useUser() || {};
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    lastname: user?.lastname || '',
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
    socialMedia: user?.socialMedia || {},
    preferences: user?.preferences || {},
  });

  if (!user) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto py-20 text-center">
          <h1 className="text-3xl font-bold mb-4 text-red-600">Accesso Negato</h1>
          <p className="text-lg text-gray-600">Devi essere autenticato per vedere il profilo.</p>
        </div>
      </Layout>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };
  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, socialMedia: { ...prev.socialMedia, [name]: value } }));
  };
  const handlePreferencesChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, preferences: { ...prev.preferences, [name]: value } }));
  };
  const handleSave = (e) => {
    e.preventDefault();
    setEditMode(false);
  };

  return (
    <Layout>
      {/* Sfondo chiaro sfumato */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-indigo-100 via-pink-100 to-white" />
      <section className="flex justify-center items-center min-h-[80vh] py-8 px-2">
        <div className="relative w-full max-w-2xl">
          {/* Bottone modifica fisso in alto a destra */}
          <button
            onClick={() => setEditMode(!editMode)}
            className="absolute top-4 right-4 z-10 px-4 py-2 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-pink-500 transition flex items-center gap-2 text-sm font-semibold"
            style={{boxShadow:'0 2px 12px 0 rgba(99,102,241,0.12)'}}
          >
            <FaEdit /> {editMode ? 'Annulla' : 'Modifica profilo'}
          </button>
          <div className="profile-glass-card rounded-3xl shadow-2xl px-6 py-10 md:py-12 md:px-12 flex flex-col gap-8 items-center relative overflow-hidden">
            {/* Avatar e badge */}
            <div className="relative flex flex-col items-center">
              <div className="w-32 h-32 rounded-full border-4 border-pink-400 shadow-xl flex items-center justify-center bg-white overflow-hidden">
                {user.avatar?.url ? (
                  <img src={user.avatar.url} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <span className="text-5xl font-bold text-indigo-500">{user.name?.charAt(0) || <FaUser />}</span>
                )}
              </div>
              <span className={`absolute top-0 right-0 -mt-2 -mr-2 px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 ${user.role === 'admin' ? 'bg-yellow-400 text-white' : 'bg-indigo-500 text-white'}`}
                style={{boxShadow:'0 2px 8px 0 rgba(0,0,0,0.10)'}}
              >
                {user.role === 'admin' && <FaCrown className="mr-1" />} {user.role === 'admin' ? 'Admin' : 'Utente'}
              </span>
            </div>
            {/* Titolo e stato */}
            <div className="flex flex-col items-center text-center">
              <h1 className="text-3xl md:text-4xl font-extrabold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-500 drop-shadow-lg">
                {user.name} {user.lastname}
              </h1>
              <div className="flex items-center gap-2 text-gray-500 text-base mb-1">
                <FaUserTag /> @{user.username}
                {user.status === 'active' && <FaCheckCircle className="text-green-400 ml-1" title="Attivo" />}
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-base mb-1"><FaEnvelope /> {user.email}</div>
              <div className="text-xs text-gray-400">Stato: <span className="font-medium text-gray-700">{user.status}</span></div>
            </div>
            {/* Info e preferenze */}
            <div className="w-full flex flex-col md:flex-row gap-6">
              {/* Info utente e bio */}
              <div className="flex-1 flex flex-col gap-4">
                <div className="rounded-2xl bg-white/80 shadow p-5 flex flex-col gap-2 border border-white/40">
                  <div className="flex items-center gap-2 text-indigo-600 font-semibold text-lg mb-1"><FaUser /> Info</div>
                  <div className="text-gray-700 text-sm"><span className="font-semibold">Nome:</span> {user.name}</div>
                  <div className="text-gray-700 text-sm"><span className="font-semibold">Cognome:</span> {user.lastname}</div>
                  <div className="text-gray-700 text-sm"><span className="font-semibold">Username:</span> @{user.username}</div>
                  <div className="text-gray-700 text-sm"><span className="font-semibold">Email:</span> {user.email}</div>
                </div>
                <div className="rounded-2xl bg-white/80 shadow p-5 border border-white/40 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-pink-500 font-semibold text-lg mb-1"><FaUserTag /> Bio</div>
                  <div className="text-gray-700 text-sm min-h-[40px]">{user.bio || 'Nessuna bio inserita.'}</div>
                </div>
                <div className="rounded-2xl bg-white/80 shadow p-5 border border-white/40 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-indigo-600 font-semibold text-lg mb-1"><FaGlobe /> Social</div>
                  <div className="flex gap-3 flex-wrap">
                    {user.socialMedia?.twitter && <a href={user.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="profile-social-btn bg-blue-400 hover:bg-blue-500"><FaTwitter /></a>}
                    {user.socialMedia?.linkedin && <a href={user.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="profile-social-btn bg-blue-700 hover:bg-blue-800"><FaLinkedin /></a>}
                    {user.socialMedia?.github && <a href={user.socialMedia.github} target="_blank" rel="noopener noreferrer" className="profile-social-btn bg-gray-800 hover:bg-black"><FaGithub /></a>}
                    {user.socialMedia?.website && <a href={user.socialMedia.website} target="_blank" rel="noopener noreferrer" className="profile-social-btn bg-indigo-400 hover:bg-indigo-600"><FaGlobe /></a>}
                    {!user.socialMedia?.twitter && !user.socialMedia?.linkedin && !user.socialMedia?.github && !user.socialMedia?.website && (
                      <span className="text-gray-400 text-sm">Nessun social collegato.</span>
                    )}
                  </div>
                </div>
              </div>
              {/* Preferenze */}
              <div className="w-full md:w-64 flex flex-col gap-4">
                <div className="rounded-2xl bg-white/80 shadow p-5 border border-white/40 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-indigo-600 font-semibold text-lg mb-1"><FaSun /> Preferenze</div>
                  <div className="flex items-center gap-2 text-gray-700 text-sm">
                    Tema:
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 font-semibold">
                      {user.preferences?.theme === 'dark' ? <FaMoon className="mr-1" /> : <FaSun className="mr-1" />} {user.preferences?.theme === 'dark' ? 'Scuro' : 'Chiaro'}
                    </span>
                  </div>
                  
                </div>
              </div>
            </div>
            {/* Modalità modifica */}
            {editMode && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="profile-glass-card w-full max-w-lg rounded-3xl shadow-2xl px-8 py-10 relative animate-fadeIn">
                  <button onClick={() => setEditMode(false)} className="absolute top-4 right-4 text-gray-400 hover:text-pink-500 text-xl"><FaEdit /></button>
                  <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Nome</label>
                        <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-400" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Cognome</label>
                        <input type="text" name="lastname" value={form.lastname} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-400" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
                        <input type="text" name="username" value={form.username} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-400" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                        <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-400" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Bio</label>
                      <textarea name="bio" value={form.bio} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-400" rows={3} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Twitter</label>
                        <input type="text" name="twitter" value={form.socialMedia.twitter || ''} onChange={handleSocialChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-400" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">LinkedIn</label>
                        <input type="text" name="linkedin" value={form.socialMedia.linkedin || ''} onChange={handleSocialChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-400" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">GitHub</label>
                        <input type="text" name="github" value={form.socialMedia.github || ''} onChange={handleSocialChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-400" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Website</label>
                        <input type="text" name="website" value={form.socialMedia.website || ''} onChange={handleSocialChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-400" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Tema</label>
                        <select name="theme" value={form.preferences.theme || 'light'} onChange={handlePreferencesChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-400">
                          <option value="light">Chiaro</option>
                          <option value="dark">Scuro</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Lingua</label>
                        <input type="text" name="language" value={form.preferences.language || ''} onChange={handlePreferencesChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-400" />
                      </div>
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                      <button type="button" onClick={() => setEditMode(false)} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300">Annulla</button>
                      <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Salva</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      <style jsx global>{`
        .profile-glass-card {
          background: rgba(255,255,255,0.85);
          box-shadow: 0 8px 32px 0 rgba(31,38,135,0.10);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-radius: 2rem;
          border: 1.5px solid rgba(255,255,255,0.18);
        }
        .profile-social-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 9999px;
          color: #fff;
          font-size: 1.25rem;
          transition: background 0.2s, box-shadow 0.2s;
          box-shadow: 0 2px 8px 0 rgba(0,0,0,0.10);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: none; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s cubic-bezier(.4,0,.2,1) both;
        }
      `}</style>
    </Layout>
  );
} 