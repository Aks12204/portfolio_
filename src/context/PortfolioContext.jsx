import React, { createContext, useContext, useState, useEffect } from 'react';
import { defaultPortfolioData } from '../data/defaultPortfolioData';

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem('portfolio_data_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          profile: parsed.profile ? { ...defaultPortfolioData.profile, ...parsed.profile } : defaultPortfolioData.profile,
          achievements: Array.isArray(parsed.achievements) ? parsed.achievements : defaultPortfolioData.achievements,
          projects: Array.isArray(parsed.projects) ? parsed.projects : defaultPortfolioData.projects,
          skills: Array.isArray(parsed.skills) ? parsed.skills : defaultPortfolioData.skills,
          experience: Array.isArray(parsed.experience) ? parsed.experience : defaultPortfolioData.experience
        };
      }
    } catch (e) {
      console.error('Failed to load portfolio data from localStorage', e);
    }
    return defaultPortfolioData;
  });

  // Admin Authentication State
  const [adminPin, setAdminPin] = useState(() => {
    return localStorage.getItem('portfolio_admin_pin') || '1234';
  });

  // Recovery Contact Info State
  const [recoveryEmail, setRecoveryEmail] = useState(() => {
    return localStorage.getItem('portfolio_recovery_email') || 'ps5878276@gmail.com';
  });

  const [recoveryPhone, setRecoveryPhone] = useState(() => {
    return localStorage.getItem('portfolio_recovery_phone') || '+91 8400492860';
  });

  // Verification OTP State
  const [activeOtp, setActiveOtp] = useState(null);
  const [otpChannel, setOtpChannel] = useState(null);

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('portfolio_admin_auth') === 'true';
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState('profile');
  const [editingItemData, setEditingItemData] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('portfolio_data_v1', JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [data]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const openAdminTab = (tabName, itemToEdit = null) => {
    setActiveAdminTab(tabName);
    setEditingItemData(itemToEdit);
    setIsAdminOpen(true);
  };

  // Admin Auth Handlers
  const loginAdmin = (inputPin) => {
    if (inputPin === adminPin) {
      setIsAuthenticated(true);
      sessionStorage.setItem('portfolio_admin_auth', 'true');
      showToast('Admin Access Granted!');
      return true;
    } else {
      showToast('Incorrect Passcode!');
      return false;
    }
  };

  const logoutAdmin = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('portfolio_admin_auth');
    setIsAdminOpen(false);
    showToast('Logged out of Admin Studio');
  };

  const updateAdminPin = (newPin) => {
    if (!newPin || newPin.trim().length < 4) {
      showToast('Passcode must be at least 4 characters long.');
      return false;
    }
    setAdminPin(newPin.trim());
    localStorage.setItem('portfolio_admin_pin', newPin.trim());
    showToast('Admin Security Passcode updated!');
    return true;
  };

  // Recovery & Verification Handlers
  const updateRecoveryContacts = (email, phone) => {
    setRecoveryEmail(email);
    setRecoveryPhone(phone);
    localStorage.setItem('portfolio_recovery_email', email);
    localStorage.setItem('portfolio_recovery_phone', phone);
    showToast('Security Recovery contact information updated!');
  };

  const sendVerificationCode = (channel = 'email') => {
    // Generate a 6-digit random verification code
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setActiveOtp(generatedOtp);
    setOtpChannel(channel);

    const targetContact = channel === 'email' ? recoveryEmail : recoveryPhone;
    showToast(`Verification code [ ${generatedOtp} ] sent to ${channel.toUpperCase()} (${targetContact})`);
    return generatedOtp;
  };

  const verifyOtpAndResetPin = (inputOtp, newPin) => {
    if (!activeOtp || inputOtp !== activeOtp) {
      showToast('Invalid verification code!');
      return false;
    }
    if (!newPin || newPin.trim().length < 4) {
      showToast('New Passcode must be at least 4 characters long.');
      return false;
    }

    setAdminPin(newPin.trim());
    localStorage.setItem('portfolio_admin_pin', newPin.trim());
    setIsAuthenticated(true);
    sessionStorage.setItem('portfolio_admin_auth', 'true');
    setActiveOtp(null);
    setOtpChannel(null);
    showToast('Security Passcode reset successfully! Admin unlocked.');
    return true;
  };

  // Profile Management
  const updateProfile = (updatedProfile) => {
    setData(prev => ({
      ...prev,
      profile: { ...prev.profile, ...updatedProfile }
    }));
    showToast('Profile updated successfully!');
  };

  // Achievements / Feed Management
  const addAchievement = (newAchievement) => {
    const post = {
      id: `ach-${Date.now()}`,
      title: newAchievement.title,
      category: newAchievement.category || 'Milestone',
      date: newAchievement.date || new Date().toISOString().split('T')[0],
      description: newAchievement.description,
      image: newAchievement.image || '',
      likesCount: 0,
      isLikedByUser: false,
      comments: []
    };
    setData(prev => ({
      ...prev,
      achievements: [post, ...prev.achievements]
    }));
    showToast('Achievement posted successfully!');
  };

  const updateAchievement = (id, updatedFields) => {
    setData(prev => ({
      ...prev,
      achievements: prev.achievements.map(item => item.id === id ? { ...item, ...updatedFields } : item)
    }));
    showToast('Achievement updated!');
  };

  const deleteAchievement = (id) => {
    if (window.confirm('Are you sure you want to delete this achievement post?')) {
      setData(prev => ({
        ...prev,
        achievements: prev.achievements.filter(item => item.id !== id)
      }));
      showToast('Achievement deleted.');
    }
  };

  const toggleLikeAchievement = (id) => {
    setData(prev => ({
      ...prev,
      achievements: prev.achievements.map(post => {
        if (post.id === id) {
          const isLiked = post.isLikedByUser;
          return {
            ...post,
            isLikedByUser: !isLiked,
            likesCount: isLiked ? post.likesCount - 1 : post.likesCount + 1
          };
        }
        return post;
      })
    }));
  };

  const addCommentToAchievement = (id, commentText, authorName = 'Visitor') => {
    if (!commentText.trim()) return;
    const newComment = {
      id: `c-${Date.now()}`,
      author: authorName,
      text: commentText.trim(),
      date: new Date().toISOString().split('T')[0]
    };
    setData(prev => ({
      ...prev,
      achievements: prev.achievements.map(post => {
        if (post.id === id) {
          return {
            ...post,
            comments: [...post.comments, newComment]
          };
        }
        return post;
      })
    }));
    showToast('Comment added!');
  };

  const deleteCommentFromAchievement = (achId, commentId) => {
    setData(prev => ({
      ...prev,
      achievements: prev.achievements.map(post => {
        if (post.id === achId) {
          return {
            ...post,
            comments: post.comments.filter(c => c.id !== commentId)
          };
        }
        return post;
      })
    }));
    showToast('Comment removed.');
  };

  // Projects Management
  const addProject = (newProj) => {
    const project = {
      id: `proj-${Date.now()}`,
      title: newProj.title,
      description: newProj.description,
      image: newProj.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
      tags: typeof newProj.tags === 'string' ? newProj.tags.split(',').map(t => t.trim()).filter(Boolean) : (newProj.tags || []),
      liveUrl: newProj.liveUrl || '#',
      githubUrl: newProj.githubUrl || '#',
      featured: newProj.featured || false
    };
    setData(prev => ({
      ...prev,
      projects: [project, ...prev.projects]
    }));
    showToast('Project added successfully!');
  };

  const updateProject = (id, updatedFields) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? {
        ...p,
        ...updatedFields,
        tags: typeof updatedFields.tags === 'string'
          ? updatedFields.tags.split(',').map(t => t.trim()).filter(Boolean)
          : (updatedFields.tags || p.tags)
      } : p)
    }));
    showToast('Project updated!');
  };

  const deleteProject = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setData(prev => ({
        ...prev,
        projects: prev.projects.filter(p => p.id !== id)
      }));
      showToast('Project removed.');
    }
  };

  // Skills Management
  const addSkillCategory = (categoryName, initialItems = []) => {
    if (!categoryName.trim()) return;
    setData(prev => ({
      ...prev,
      skills: [...prev.skills, { category: categoryName.trim(), items: initialItems }]
    }));
    showToast('Skill category added!');
  };

  const deleteSkillCategory = (categoryIndex) => {
    if (window.confirm('Delete this entire skill category?')) {
      setData(prev => ({
        ...prev,
        skills: prev.skills.filter((_, idx) => idx !== categoryIndex)
      }));
      showToast('Skill category deleted.');
    }
  };

  const addSkillItemToCategory = (categoryIndex, skillName) => {
    if (!skillName.trim()) return;
    setData(prev => ({
      ...prev,
      skills: prev.skills.map((cat, idx) => {
        if (idx === categoryIndex) {
          return { ...cat, items: [...cat.items, skillName.trim()] };
        }
        return cat;
      })
    }));
    showToast('Skill added!');
  };

  const deleteSkillItemFromCategory = (categoryIndex, itemIndex) => {
    setData(prev => ({
      ...prev,
      skills: prev.skills.map((cat, idx) => {
        if (idx === categoryIndex) {
          return { ...cat, items: cat.items.filter((_, sIdx) => sIdx !== itemIndex) };
        }
        return cat;
      })
    }));
    showToast('Skill item removed.');
  };

  // Experience Management
  const addExperience = (newExp) => {
    const exp = {
      id: `exp-${Date.now()}`,
      role: newExp.role,
      company: newExp.company,
      period: newExp.period,
      description: newExp.description,
      technologies: typeof newExp.technologies === 'string'
        ? newExp.technologies.split(',').map(t => t.trim()).filter(Boolean)
        : (newExp.technologies || [])
    };
    setData(prev => ({
      ...prev,
      experience: [exp, ...prev.experience]
    }));
    showToast('Experience added!');
  };

  const updateExperience = (id, updatedFields) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.map(e => e.id === id ? {
        ...e,
        ...updatedFields,
        technologies: typeof updatedFields.technologies === 'string'
          ? updatedFields.technologies.split(',').map(t => t.trim()).filter(Boolean)
          : (updatedFields.technologies || e.technologies)
      } : e)
    }));
    showToast('Experience updated!');
  };

  const deleteExperience = (id) => {
    if (window.confirm('Delete this work experience entry?')) {
      setData(prev => ({
        ...prev,
        experience: prev.experience.filter(e => e.id !== id)
      }));
      showToast('Experience removed.');
    }
  };

  const exportConfigJSON = () => {
    try {
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
      showToast('Configuration exported!');
    } catch (e) {
      console.error('Export failed', e);
      showToast('Failed to export configuration.');
    }
  };

  const downloadDefaultDataJS = () => {
    try {
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
      showToast('defaultPortfolioData.js exported! Replace src/data/defaultPortfolioData.js in your project and push to GitHub.');
    } catch (e) {
      console.error('Download failed', e);
      showToast('Failed to generate file.');
    }
  };

  const importConfigJSON = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.profile && parsed.projects) {
        setData(parsed);
        showToast('Portfolio configuration imported successfully!');
        return true;
      } else {
        alert('Invalid portfolio configuration format.');
        return false;
      }
    } catch (err) {
      alert('Failed to parse JSON file.');
      return false;
    }
  };

  const resetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all portfolio data to default initial values?')) {
      setData(defaultPortfolioData);
      localStorage.removeItem('portfolio_data_v1');
      showToast('Portfolio reset to default data.');
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        adminPin,
        recoveryEmail,
        recoveryPhone,
        activeOtp,
        otpChannel,
        isAuthenticated,
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
        openAdminTab,
        toastMessage,
        showToast,
        updateProfile,
        addAchievement,
        updateAchievement,
        deleteAchievement,
        toggleLikeAchievement,
        addCommentToAchievement,
        deleteCommentFromAchievement,
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
        downloadDefaultDataJS,
        importConfigJSON,
        resetToDefaults
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => useContext(PortfolioContext);
