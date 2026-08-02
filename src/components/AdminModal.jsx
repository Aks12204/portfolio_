import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { X, User, Award, FolderPlus, Download, Upload, RotateCcw, Plus, Trash2, Check, Sparkles, Lock, LogOut, KeyRound, Edit3, Smartphone, Mail, ShieldCheck, ArrowLeft } from 'lucide-react';
import '../styles/admin.css';

class ModalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Modal Error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h3 style={{ color: '#ef4444', marginBottom: '1rem' }}>Something went wrong loading this tab.</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            {this.state.error?.toString()}
          </p>
          <button className="btn btn-primary" onClick={() => this.setState({ hasError: false })}>
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export const AdminModal = () => {
  const {
    data,
    isAuthenticated,
    recoveryEmail,
    recoveryPhone,
    activeOtp,
    loginAdmin,
    logoutAdmin,
    updateAdminPin,
    updateRecoveryContacts,
    sendVerificationCode,
    verifyOtpAndResetPin,
    isAdminOpen,
    setIsAdminOpen,
    activeAdminTab,
    setActiveAdminTab,
    editingItemData,
    setEditingItemData,
    updateProfile,
    addAchievement,
    updateAchievement,
    deleteAchievement,
    addProject,
    updateProject,
    deleteProject,
    addSkillCategory,
    deleteSkillCategory,
    addSkillItemToCategory,
    deleteSkillItemFromCategory,
    addExperience,
    updateExperience,
    deleteExperience,
    exportConfigJSON,
    importConfigJSON,
    resetToDefaults
  } = usePortfolio();

  const [passcodeInput, setPasscodeInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');

  // Recovery Mode State
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState('email');
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [resetNewPin, setResetNewPin] = useState('');

  // Recovery Contact Settings Form State
  const [contactEmailInput, setContactEmailInput] = useState(recoveryEmail || '');
  const [contactPhoneInput, setContactPhoneInput] = useState(recoveryPhone || '');

  const handleDownloadData = () => {
    try {
      if (typeof downloadDefaultDataJS === 'function') {
        downloadDefaultDataJS();
      } else {
        const fileContent = `export const defaultPortfolioData = ${JSON.stringify(data, null, 2)};\n`;
        const blob = new Blob([fileContent], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const downloadAnchor = document.createElement('a');
        downloadAnchor.href = url;
        downloadAnchor.download = "defaultPortfolioData.js";
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    } catch (e) {
      console.error(e);
      alert('Could not download configuration.');
    }
  };

  const handleExportJSON = () => {
    try {
      if (typeof exportConfigJSON === 'function') {
        exportConfigJSON();
      } else {
        const fileContent = JSON.stringify(data, null, 2);
        const blob = new Blob([fileContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const downloadAnchor = document.createElement('a');
        downloadAnchor.href = url;
        downloadAnchor.download = "portfolio-config.json";
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    } catch (e) {
      console.error(e);
      alert('Could not export JSON.');
    }
  };

  // Editing state IDs
  const [editingAchId, setEditingAchId] = useState(null);
  const [editingProjId, setEditingProjId] = useState(null);
  const [editingExpId, setEditingExpId] = useState(null);

  // Local state for profile form
  const [profileForm, setProfileForm] = useState(data.profile);

  // Local state for achievement form
  const [achForm, setAchForm] = useState({
    title: '',
    category: 'Certification',
    date: new Date().toISOString().split('T')[0],
    description: '',
    image: ''
  });

  // Local state for project form
  const [projForm, setProjForm] = useState({
    title: '',
    description: '',
    image: '',
    tags: '',
    liveUrl: '',
    githubUrl: '',
    featured: false
  });

  // Local state for skill category & skill item
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSkillInputs, setNewSkillInputs] = useState({});

  // Local state for experience form
  const [expForm, setExpForm] = useState({
    role: '',
    company: '',
    period: '',
    description: '',
    technologies: ''
  });

  useEffect(() => {
    setProfileForm(data.profile);
  }, [data.profile]);

  useEffect(() => {
    setContactEmailInput(recoveryEmail);
    setContactPhoneInput(recoveryPhone);
  }, [recoveryEmail, recoveryPhone]);

  useEffect(() => {
    if (editingItemData) {
      if (activeAdminTab === 'achievements') {
        startEditAch(editingItemData);
      } else if (activeAdminTab === 'projects') {
        startEditProj(editingItemData);
      } else if (activeAdminTab === 'experience') {
        startEditExp(editingItemData);
      }
      setEditingItemData(null);
    }
  }, [editingItemData, activeAdminTab]);

  const closeModal = () => {
    document.body.style.overflow = '';
    setIsAdminOpen(false);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    if (isAdminOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAdminOpen]);

  if (!isAdminOpen) return null;

  // Handle Admin Security Login
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (loginAdmin(passcodeInput)) {
      setPasscodeInput('');
    }
  };

  // Handle Request Verification Code
  const handleRequestOtp = (e) => {
    e.preventDefault();
    sendVerificationCode(selectedChannel);
    setOtpSent(true);
  };

  // Handle Verify OTP and Reset Passcode
  const handleVerifyOtpReset = (e) => {
    e.preventDefault();
    if (verifyOtpAndResetPin(otpInput, resetNewPin)) {
      setIsRecoveryMode(false);
      setOtpSent(false);
      setOtpInput('');
      setResetNewPin('');
    }
  };

  const handleUpdateContacts = (e) => {
    e.preventDefault();
    updateRecoveryContacts(contactEmailInput, contactPhoneInput);
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateProfile(profileForm);
  };

  const handleAchSubmit = (e) => {
    e.preventDefault();
    if (!achForm.title.trim()) return;

    if (editingAchId) {
      updateAchievement(editingAchId, achForm);
      setEditingAchId(null);
    } else {
      addAchievement(achForm);
    }

    setAchForm({
      title: '',
      category: 'Certification',
      date: new Date().toISOString().split('T')[0],
      description: '',
      image: ''
    });
  };

  const startEditAch = (item) => {
    setEditingAchId(item.id);
    setAchForm({
      title: item.title || '',
      category: item.category || 'Certification',
      date: item.date || new Date().toISOString().split('T')[0],
      description: item.description || '',
      image: item.image || ''
    });
  };

  const handleProjSubmit = (e) => {
    e.preventDefault();
    if (!projForm.title.trim()) return;

    if (editingProjId) {
      updateProject(editingProjId, projForm);
      setEditingProjId(null);
    } else {
      addProject(projForm);
    }

    setProjForm({
      title: '',
      description: '',
      image: '',
      tags: '',
      liveUrl: '',
      githubUrl: '',
      featured: false
    });
  };

  const startEditProj = (proj) => {
    setEditingProjId(proj.id);
    setProjForm({
      title: proj.title || '',
      description: proj.description || '',
      image: proj.image || '',
      tags: proj.tags ? proj.tags.join(', ') : '',
      liveUrl: proj.liveUrl || '',
      githubUrl: proj.githubUrl || '',
      featured: proj.featured || false
    });
  };

  const handleAddCategorySubmit = (e) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      addSkillCategory(newCategoryName.trim());
      setNewCategoryName('');
    }
  };

  const handleAddSkillItemSubmit = (e, categoryIndex) => {
    e.preventDefault();
    const itemVal = newSkillInputs[categoryIndex];
    if (itemVal && itemVal.trim()) {
      addSkillItemToCategory(categoryIndex, itemVal.trim());
      setNewSkillInputs({ ...newSkillInputs, [categoryIndex]: '' });
    }
  };

  const handleExpSubmit = (e) => {
    e.preventDefault();
    if (!expForm.role.trim()) return;

    if (editingExpId) {
      updateExperience(editingExpId, expForm);
      setEditingExpId(null);
    } else {
      addExperience(expForm);
    }

    setExpForm({
      role: '',
      company: '',
      period: '',
      description: '',
      technologies: ''
    });
  };

  const startEditExp = (exp) => {
    setEditingExpId(exp.id);
    setExpForm({
      role: exp.role || '',
      company: exp.company || '',
      period: exp.period || '',
      description: exp.description || '',
      technologies: exp.technologies ? exp.technologies.join(', ') : ''
    });
  };

  const handleFileUpload = (e, callback) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 500;
          const MAX_HEIGHT = 500;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const dataUrl = canvas.toDataURL('image/jpeg', 0.825);
          callback(dataUrl);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImportFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        importConfigJSON(reader.result);
      };
      reader.readAsText(file);
    }
  };

  const handleChangePinSubmit = (e) => {
    e.preventDefault();
    if (updateAdminPin(newPinInput)) {
      setNewPinInput('');
    }
  };

  return (
    <div className="admin-backdrop" onClick={closeModal}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-header">
          <div className="admin-title">
            <Sparkles size={20} color="var(--accent)" />
            <span>Portfolio Admin Studio</span>
          </div>
          <button className="btn-icon" onClick={closeModal}>
            <X size={20} />
          </button>
        </div>

        {/* SECURITY LOCK SCREEN IF NOT AUTHENTICATED */}
        {!isAuthenticated ? (
          <div style={{ padding: '2.5rem 2rem', textAlign: 'center', maxWidth: '440px', margin: '0 auto' }}>
            {!isRecoveryMode ? (
              /* Standard Passcode Screen */
              <>
                <div style={{ background: 'var(--accent-light)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
                  <Lock size={30} color="var(--accent)" />
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Admin Security Access</h3>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>
                  Only the portfolio owner can edit or delete content. Enter your passcode to unlock.
                </p>

                <form onSubmit={handleAuthSubmit}>
                  <div className="form-group">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Enter Security Passcode"
                      value={passcodeInput}
                      onChange={(e) => setPasscodeInput(e.target.value)}
                      style={{ textAlign: 'center', letterSpacing: '0.3em', fontSize: '1.2rem', fontWeight: '700' }}
                      required
                      autoFocus
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '1.25rem' }}>
                    Unlock Admin Studio
                  </button>
                </form>

                <button
                  type="button"
                  onClick={() => setIsRecoveryMode(true)}
                  style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '0.88rem', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Forgot Passcode? Reset via Verification
                </button>
              </>
            ) : (
              /* Reset Passcode via Phone or Email Verification Screen */
              <>
                <div style={{ background: 'var(--accent-light)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
                  <ShieldCheck size={32} color="var(--accent)" />
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Passcode Recovery Verification</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  Choose your verification method to reset your security passcode.
                </p>

                {!otpSent ? (
                  <form onSubmit={handleRequestOtp}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                      <button
                        type="button"
                        className={`btn ${selectedChannel === 'email' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ flexDirection: 'column', padding: '0.75rem', fontSize: '0.85rem' }}
                        onClick={() => setSelectedChannel('email')}
                      >
                        <Mail size={20} />
                        <span>Email Code</span>
                        <small style={{ fontSize: '0.72rem', opacity: 0.8 }}>{recoveryEmail}</small>
                      </button>

                      <button
                        type="button"
                        className={`btn ${selectedChannel === 'phone' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ flexDirection: 'column', padding: '0.75rem', fontSize: '0.85rem' }}
                        onClick={() => setSelectedChannel('phone')}
                      >
                        <Smartphone size={20} />
                        <span>SMS Phone Code</span>
                        <small style={{ fontSize: '0.72rem', opacity: 0.8 }}>{recoveryPhone}</small>
                      </button>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }}>
                      Send 6-Digit Verification Code
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtpReset}>
                    <div style={{ background: 'var(--accent-light)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.85rem', color: 'var(--accent)' }}>
                      6-Digit Code sent to <strong>{selectedChannel === 'email' ? recoveryEmail : recoveryPhone}</strong>
                    </div>

                    <div className="form-group">
                      <label style={{ fontSize: '0.82rem' }}>Enter 6-Digit Verification Code</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="• • • • • •"
                        maxLength={6}
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                        style={{ textAlign: 'center', letterSpacing: '0.4em', fontSize: '1.2rem', fontWeight: '700' }}
                        required
                        autoFocus
                      />
                    </div>

                    <div className="form-group">
                      <label style={{ fontSize: '0.82rem' }}>New Security Passcode</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Enter new passcode (min 4 chars)"
                        value={resetNewPin}
                        onChange={(e) => setResetNewPin(e.target.value)}
                        required
                      />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }}>
                      Verify & Reset Passcode
                    </button>
                  </form>
                )}

                <button
                  type="button"
                  onClick={() => { setIsRecoveryMode(false); setOtpSent(false); }}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.85rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <ArrowLeft size={15} /> Back to Passcode Login
                </button>
              </>
            )}
          </div>
        ) : (
          /* AUTHENTICATED ADMIN STUDIO */
          <>
            <div className="admin-tabs">
              <button
                className={`admin-tab ${activeAdminTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveAdminTab('profile')}
              >
                <User size={16} style={{ display: 'inline', marginRight: '6px' }} /> Profile
              </button>
              <button
                className={`admin-tab ${activeAdminTab === 'achievements' ? 'active' : ''}`}
                onClick={() => setActiveAdminTab('achievements')}
              >
                <Award size={16} style={{ display: 'inline', marginRight: '6px' }} /> Achievements Feed
              </button>
              <button
                className={`admin-tab ${activeAdminTab === 'projects' ? 'active' : ''}`}
                onClick={() => setActiveAdminTab('projects')}
              >
                <FolderPlus size={16} style={{ display: 'inline', marginRight: '6px' }} /> Projects
              </button>
              <button
                className={`admin-tab ${activeAdminTab === 'skills' ? 'active' : ''}`}
                onClick={() => setActiveAdminTab('skills')}
              >
                Skills
              </button>
              <button
                className={`admin-tab ${activeAdminTab === 'experience' ? 'active' : ''}`}
                onClick={() => setActiveAdminTab('experience')}
              >
                Experience
              </button>
              <button
                className={`admin-tab ${activeAdminTab === 'security' ? 'active' : ''}`}
                onClick={() => setActiveAdminTab('security')}
              >
                Security & Backup
              </button>
            </div>

            <ModalErrorBoundary>
              <div className="admin-content">
              {/* TAB 1: PROFILE SETTINGS */}
              {activeAdminTab === 'profile' && (
                <form onSubmit={handleProfileSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={profileForm.name || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Role / Title</label>
                      <input
                        type="text"
                        className="form-control"
                        value={profileForm.role || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Tagline</label>
                    <input
                      type="text"
                      className="form-control"
                      value={profileForm.tagline || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Bio / Overview</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={profileForm.bio || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Avatar Image URL (or Upload)</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="https://..."
                        value={profileForm.avatar || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, (url) => setProfileForm({ ...profileForm, avatar: url }))}
                        style={{ marginTop: '0.4rem', fontSize: '0.8rem' }}
                      />
                    </div>

                    <div className="form-group">
                      <label>Location</label>
                      <input
                        type="text"
                        className="form-control"
                        value={profileForm.location || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        value={profileForm.email || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>GitHub Profile Link</label>
                      <input
                        type="url"
                        className="form-control"
                        value={profileForm.socials?.github || ''}
                        onChange={(e) => setProfileForm({
                          ...profileForm,
                          socials: { ...profileForm.socials, github: e.target.value }
                        })}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>LinkedIn Profile Link</label>
                      <input
                        type="url"
                        className="form-control"
                        value={profileForm.socials?.linkedin || ''}
                        onChange={(e) => setProfileForm({
                          ...profileForm,
                          socials: { ...profileForm.socials, linkedin: e.target.value }
                        })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Twitter / X Profile Link</label>
                      <input
                        type="url"
                        className="form-control"
                        value={profileForm.socials?.twitter || ''}
                        onChange={(e) => setProfileForm({
                          ...profileForm,
                          socials: { ...profileForm.socials, twitter: e.target.value }
                        })}
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary">
                    <Check size={16} /> Save Profile Changes
                  </button>
                </form>
              )}

              {/* TAB 2: ACHIEVEMENTS FEED */}
              {activeAdminTab === 'achievements' && (
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '1rem' }}>
                    {editingAchId ? 'Edit Achievement Post' : 'Upload New Achievement / Post'}
                  </h3>
                  <form onSubmit={handleAchSubmit} style={{ marginBottom: '2rem', background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Post Title</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. Passed AWS Certification"
                          value={achForm.title}
                          onChange={(e) => setAchForm({ ...achForm, title: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Category Tag</label>
                        <select
                          className="form-control"
                          value={achForm.category}
                          onChange={(e) => setAchForm({ ...achForm, category: e.target.value })}
                        >
                          <option value="Certification">Certification</option>
                          <option value="Award">Award</option>
                          <option value="Milestone">Milestone</option>
                          <option value="Project Launch">Project Launch</option>
                          <option value="Update">General Update</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Description / Details</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Share what you achieved..."
                        value={achForm.description}
                        onChange={(e) => setAchForm({ ...achForm, description: e.target.value })}
                        required
                      ></textarea>
                    </div>

                    <div className="form-group">
                      <label>Attachment Image URL (or upload image)</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="https://..."
                        value={achForm.image}
                        onChange={(e) => setAchForm({ ...achForm, image: e.target.value })}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, (url) => setAchForm({ ...achForm, image: url }))}
                        style={{ marginTop: '0.4rem', fontSize: '0.8rem' }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button type="submit" className="btn btn-primary">
                        {editingAchId ? <Check size={16} /> : <Plus size={16} />}
                        {editingAchId ? 'Update Post' : 'Publish Post'}
                      </button>
                      {editingAchId && (
                        <button type="button" className="btn btn-secondary" onClick={() => { setEditingAchId(null); setAchForm({ title: '', category: 'Certification', date: new Date().toISOString().split('T')[0], description: '', image: '' }); }}>
                          Cancel Edit
                        </button>
                      )}
                    </div>
                  </form>

                  <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.75rem' }}>Existing Posts ({data.achievements.length})</h4>
                  <div className="admin-card-list">
                    {data.achievements.map((item) => (
                      <div key={item.id} className="admin-card-item">
                        <div className="admin-card-info">
                          <h4>{item.title}</h4>
                          <p>{item.category} • {item.date}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button className="btn-icon" onClick={() => startEditAch(item)} title="Edit post">
                            <Edit3 size={16} />
                          </button>
                          <button className="btn-icon" onClick={() => deleteAchievement(item.id)} title="Delete post">
                            <Trash2 size={16} color="#ef4444" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: MANAGE PROJECTS */}
              {activeAdminTab === 'projects' && (
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '1rem' }}>
                    {editingProjId ? 'Edit Project' : 'Add New Project'}
                  </h3>
                  <form onSubmit={handleProjSubmit} style={{ marginBottom: '2rem', background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Project Title</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="My Cool App"
                          value={projForm.title}
                          onChange={(e) => setProjForm({ ...projForm, title: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Tags (Comma separated)</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="React, Node.js, AWS"
                          value={projForm.tags}
                          onChange={(e) => setProjForm({ ...projForm, tags: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        value={projForm.description}
                        onChange={(e) => setProjForm({ ...projForm, description: e.target.value })}
                        required
                      ></textarea>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Image URL (or upload)</label>
                        <input
                          type="text"
                          className="form-control"
                          value={projForm.image}
                          onChange={(e) => setProjForm({ ...projForm, image: e.target.value })}
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, (url) => setProjForm({ ...projForm, image: url }))}
                          style={{ marginTop: '0.4rem', fontSize: '0.8rem' }}
                        />
                      </div>

                      <div className="form-group">
                        <label>Live Demo URL</label>
                        <input
                          type="url"
                          className="form-control"
                          placeholder="https://..."
                          value={projForm.liveUrl}
                          onChange={(e) => setProjForm({ ...projForm, liveUrl: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>GitHub Repository URL</label>
                        <input
                          type="url"
                          className="form-control"
                          placeholder="https://github.com/..."
                          value={projForm.githubUrl}
                          onChange={(e) => setProjForm({ ...projForm, githubUrl: e.target.value })}
                        />
                      </div>

                      <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.75rem' }}>
                        <input
                          type="checkbox"
                          id="featured-check"
                          checked={projForm.featured}
                          onChange={(e) => setProjForm({ ...projForm, featured: e.target.checked })}
                        />
                        <label htmlFor="featured-check" style={{ marginBottom: 0, cursor: 'pointer' }}>Mark as Featured Project</label>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button type="submit" className="btn btn-primary">
                        {editingProjId ? <Check size={16} /> : <Plus size={16} />}
                        {editingProjId ? 'Update Project' : 'Add Project'}
                      </button>
                      {editingProjId && (
                        <button type="button" className="btn btn-secondary" onClick={() => { setEditingProjId(null); setProjForm({ title: '', description: '', image: '', tags: '', liveUrl: '', githubUrl: '', featured: false }); }}>
                          Cancel Edit
                        </button>
                      )}
                    </div>
                  </form>

                  <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.75rem' }}>Existing Projects ({data.projects.length})</h4>
                  <div className="admin-card-list">
                    {data.projects.map((proj) => (
                      <div key={proj.id} className="admin-card-item">
                        <div className="admin-card-info">
                          <h4>{proj.title}</h4>
                          <p>{proj.tags?.join(', ')}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button className="btn-icon" onClick={() => startEditProj(proj)} title="Edit project">
                            <Edit3 size={16} />
                          </button>
                          <button className="btn-icon" onClick={() => deleteProject(proj.id)} title="Delete project">
                            <Trash2 size={16} color="#ef4444" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: MANAGE SKILLS */}
              {activeAdminTab === 'skills' && (
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '1rem' }}>Manage Technical Skills</h3>

                  <form onSubmit={handleAddCategorySubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="New Category Name (e.g. Cloud & DevOps)"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      required
                    />
                    <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
                      <Plus size={16} /> Add Category
                    </button>
                  </form>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {data.skills.map((skillCat, cIdx) => (
                      <div key={cIdx} style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                          <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>{skillCat.category}</h4>
                          <button className="btn-icon" onClick={() => deleteSkillCategory(cIdx)} title="Delete entire category">
                            <Trash2 size={16} color="#ef4444" />
                          </button>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
                          {skillCat.items.map((item, sIdx) => (
                            <span key={sIdx} className="badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.6rem' }}>
                              {item}
                              <X
                                size={13}
                                style={{ cursor: 'pointer' }}
                                onClick={() => deleteSkillItemFromCategory(cIdx, sIdx)}
                                title="Remove skill"
                              />
                            </span>
                          ))}
                        </div>

                        <form onSubmit={(e) => handleAddSkillItemSubmit(e, cIdx)} style={{ display: 'flex', gap: '0.5rem' }}>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Add skill to category..."
                            value={newSkillInputs[cIdx] || ''}
                            onChange={(e) => setNewSkillInputs({ ...newSkillInputs, [cIdx]: e.target.value })}
                            style={{ fontSize: '0.85rem', padding: '0.4rem 0.75rem' }}
                          />
                          <button type="submit" className="btn btn-secondary btn-sm">
                            <Plus size={14} /> Add
                          </button>
                        </form>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: EXPERIENCE */}
              {activeAdminTab === 'experience' && (
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '1rem' }}>
                    {editingExpId ? 'Edit Work Experience' : 'Add Work Experience'}
                  </h3>
                  <form onSubmit={handleExpSubmit} style={{ marginBottom: '2rem', background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Role / Position</label>
                        <input
                          type="text"
                          className="form-control"
                          value={expForm.role}
                          onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Company Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={expForm.company}
                          onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Time Period</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="2024 - Present"
                          value={expForm.period}
                          onChange={(e) => setExpForm({ ...expForm, period: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Technologies Used (Comma separated)</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="React, AWS, Node.js"
                          value={expForm.technologies}
                          onChange={(e) => setExpForm({ ...expForm, technologies: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        value={expForm.description}
                        onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                      ></textarea>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button type="submit" className="btn btn-primary">
                        {editingExpId ? <Check size={16} /> : <Plus size={16} />}
                        {editingExpId ? 'Update Experience' : 'Add Experience'}
                      </button>
                      {editingExpId && (
                        <button type="button" className="btn btn-secondary" onClick={() => { setEditingExpId(null); setExpForm({ role: '', company: '', period: '', description: '', technologies: '' }); }}>
                          Cancel Edit
                        </button>
                      )}
                    </div>
                  </form>

                  <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.75rem' }}>Existing Experience ({data.experience.length})</h4>
                  <div className="admin-card-list">
                    {data.experience.map((exp) => (
                      <div key={exp.id} className="admin-card-item">
                        <div className="admin-card-info">
                          <h4>{exp.role} @ {exp.company}</h4>
                          <p>{exp.period}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button className="btn-icon" onClick={() => startEditExp(exp)} title="Edit experience">
                            <Edit3 size={16} />
                          </button>
                          <button className="btn-icon" onClick={() => deleteExperience(exp.id)} title="Delete experience">
                            <Trash2 size={16} color="#ef4444" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: SECURITY & BACKUP */}
              {activeAdminTab === 'security' && (
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '1rem' }}>Admin Security & Passcode Settings</h3>

                  {/* Change Security Passcode */}
                  <form onSubmit={handleChangePinSubmit} style={{ background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
                    <div className="form-group">
                      <label>Change Security Passcode</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Enter new 4+ digit passcode"
                        value={newPinInput}
                        onChange={(e) => setNewPinInput(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary btn-sm">
                      <KeyRound size={15} /> Update Passcode
                    </button>
                  </form>

                  {/* Manage Email & Phone Verification Recovery Info */}
                  <form onSubmit={handleUpdateContacts} style={{ background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: '700', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <ShieldCheck size={18} color="var(--accent)" /> Email & Phone Recovery Verification Contacts
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                      Used to send 6-digit OTP verification codes if you forget your admin passcode.
                    </p>

                    <div className="form-row">
                      <div className="form-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Mail size={14} /> Recovery Email Address
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          value={contactEmailInput || ''}
                          onChange={(e) => setContactEmailInput(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Smartphone size={14} /> Recovery Phone Number (SMS)
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="+1 (555) 019-2834"
                          value={contactPhoneInput || ''}
                          onChange={(e) => setContactPhoneInput(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-sm">
                      <Check size={15} /> Save Recovery Contacts
                    </button>
                  </form>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '0.5rem' }}>Save & Deploy Permanent Vercel Data</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    To make your DP, bio, and portfolio info <strong>permanent for ALL visitors on Vercel</strong> across all tabs and devices:
                  </p>
                  <ol style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginLeft: '1.2rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <li>Click <strong>Download defaultPortfolioData.js</strong> below.</li>
                    <li>Replace <code>src/data/defaultPortfolioData.js</code> in your project repository with this file.</li>
                    <li>Push your changes to GitHub (<code>git push</code>). Vercel will deploy your actual details for everyone!</li>
                  </ol>

                  <div className="backup-actions">
                    <button className="btn btn-primary" onClick={handleDownloadData} style={{ background: 'var(--accent)', color: '#fff' }}>
                      <Download size={16} /> Download defaultPortfolioData.js for Vercel
                    </button>

                    <button className="btn btn-secondary" onClick={handleExportJSON}>
                      <Download size={16} /> Export JSON Config
                    </button>

                    <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
                      <Upload size={16} /> Import JSON Config
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportFile}
                        style={{ display: 'none' }}
                      />
                    </label>

                    <button className="btn btn-secondary" onClick={resetToDefaults} style={{ color: '#ef4444' }}>
                      <RotateCcw size={16} /> Reset to Defaults
                    </button>
                  </div>
                </div>
              )}
              </div>
            </ModalErrorBoundary>

            <div className="admin-footer">
              <button className="btn btn-secondary btn-sm" onClick={logoutAdmin} style={{ color: '#ef4444' }}>
                <LogOut size={15} /> Lock Admin Studio
              </button>
              <button className="btn btn-secondary btn-sm" onClick={closeModal}>
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
