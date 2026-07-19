'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';
import { EditButton } from '../../components/public/EditButton';
import { resolveAssetPath } from '../../lib/assets';

export default function ServicesPage() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch('/api/content/services');
        const data = await response.json();
        if (data.success) {
          setContent(data.data || {});
        } else {
          setContent({});
        }
      } catch (error) {
        console.error('Failed to load content:', error);
        setContent({});
      } finally {
        setLoading(false);
      }
    };
    loadContent();
  }, []);

  const handleSave = async (path: string, value: any) => {
    if (!content) return;
    
    const updatedContent = JSON.parse(JSON.stringify(content));
    const pathParts = path.split('.');
    let current = updatedContent;
    for (let i = 0; i < pathParts.length - 1; i++) {
      if (!current[pathParts[i]]) {
        current[pathParts[i]] = {};
      }
      current = current[pathParts[i]];
    }
    current[pathParts[pathParts.length - 1]] = value;

    try {
      const response = await fetch('/api/content/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedContent),
      });

      if (response.ok) {
        setContent(updatedContent);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to save content:', error);
      return false;
    }
  };

  const handleAddService = async () => {
    const newService = {
      title: 'New Service',
      description: 'Service description goes here',
      details: 'Technologies • Tools • Skills',
      image: '/software.png'
    };
    
    const updatedContent = JSON.parse(JSON.stringify(content));
    if (!updatedContent.services) {
      updatedContent.services = [];
    }
    updatedContent.services.push(newService);
    
    const success = await handleSave('services', updatedContent.services);
    if (success) {
      setContent(updatedContent);
    }
  };

  const handleDeleteService = async (index: number) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    
    const updatedContent = JSON.parse(JSON.stringify(content));
    updatedContent.services.splice(index, 1);
    
    const success = await handleSave('services', updatedContent.services);
    if (success) {
      setContent(updatedContent);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-[#00E5FF]">Loading...</div>
      </div>
    );
  }

  if (!content) return null;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <section className="mx-auto max-w-6xl px-6 py-24">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">Services</p>
        
        {/* Page Title */}
        <div className="relative group inline-block">
          <EditButton
            fieldPath="title"
            currentValue={content.title}
            onSave={(val) => handleSave('title', val)}
          >
            <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">
              {content.title || 'Our Services'}
            </h1>
          </EditButton>
        </div>
        
        {/* Page Subtitle */}
        <div className="relative group inline-block mt-2">
          <EditButton
            fieldPath="subtitle"
            currentValue={content.subtitle}
            onSave={(val) => handleSave('subtitle', val)}
          >
            <h2 className="text-xl text-cyan-400 mt-2">
              {content.subtitle || 'Complete Digital Solutions'}
            </h2>
          </EditButton>
        </div>

        {/* Page Description */}
        <div className="relative group mt-4">
          <EditButton
            fieldPath="description"
            currentValue={content.description}
            onSave={(val) => handleSave('description', val)}
          >
            <p className="text-lg text-slate-300 max-w-3xl">
              {content.description || 'Services built around growth and clarity.'}
            </p>
          </EditButton>
        </div>

        {/* Services Grid */}
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {content.services?.map((service: any, index: number) => (
            <div key={index} className="rounded-3xl border border-white/10 bg-white/10 p-6 hover:border-cyan-400 transition-colors relative group">
              {/* Delete Button */}
              <button
                onClick={() => handleDeleteService(index)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-opacity"
                title="Delete this service"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Service Image */}
              {service.image && (
                <div className="relative group/image">
                  <img
                    src={resolveAssetPath(service.image, '/software.png')}
                    alt={service.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/software.png';
                    }}
                  />
                  <EditButton
                    fieldPath={`services[${index}].image`}
                    currentValue={service.image}
                    onSave={(val) => {
                      const newServices = [...(content.services || [])];
                      newServices[index] = { ...newServices[index], image: val };
                      handleSave('services', newServices);
                    }}
                  >
                    <div className="absolute top-2 left-2 opacity-0 group-hover/image:opacity-100 bg-black/50 p-1 rounded">
                      <span className="text-xs text-white">Change Image</span>
                    </div>
                  </EditButton>
                </div>
              )}

              {/* Service Title */}
              <div className="relative group/title">
                <EditButton
                  fieldPath={`services[${index}].title`}
                  currentValue={service.title}
                  onSave={(val) => {
                    const newServices = [...(content.services || [])];
                    newServices[index] = { ...newServices[index], title: val };
                    handleSave('services', newServices);
                  }}
                >
                  <h2 className="text-xl font-semibold">{service.title || 'Untitled Service'}</h2>
                </EditButton>
              </div>

              {/* Service Description */}
              <div className="relative group/desc mt-3">
                <EditButton
                  fieldPath={`services[${index}].description`}
                  currentValue={service.description}
                  onSave={(val) => {
                    const newServices = [...(content.services || [])];
                    newServices[index] = { ...newServices[index], description: val };
                    handleSave('services', newServices);
                  }}
                >
                  <p className="text-sm text-slate-300">{service.description || 'No description provided'}</p>
                </EditButton>
              </div>

              {/* Service Details */}
              <div className="relative group/details mt-2">
                <EditButton
                  fieldPath={`services[${index}].details`}
                  currentValue={service.details}
                  onSave={(val) => {
                    const newServices = [...(content.services || [])];
                    newServices[index] = { ...newServices[index], details: val };
                    handleSave('services', newServices);
                  }}
                >
                  <p className="text-xs text-cyan-400">{service.details || 'No details provided'}</p>
                </EditButton>
              </div>
            </div>
          ))}
        </div>

        {/* Add Service Button */}
        <div className="mt-8">
          <button
            onClick={handleAddService}
            className="w-full p-4 border-2 border-dashed border-white/10 rounded-xl hover:border-cyan-500/50 text-slate-400 hover:text-cyan-400 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Service
          </button>
        </div>
      </section>
      <Footer />
    </main>
  );
}