'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';
import { EditButton } from '../../components/public/EditButton';

export default function ContactPage() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch('/api/content/contact');
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
      const response = await fetch('/api/content/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedContent),
      });

      if (response.ok) {
        setContent(updatedContent);
      }
    } catch (error) {
      console.error('Failed to save content:', error);
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
      <section className="mx-auto max-w-5xl px-6 py-24">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">Contact</p>
        <EditButton
          fieldPath="title"
          currentValue={content.title}
          onSave={(val) => handleSave('title', val)}
        >
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">
            {content.title || 'Let\'s start your project'}
          </h1>
        </EditButton>
        
        <EditButton
          fieldPath="description"
          currentValue={content.description}
          onSave={(val) => handleSave('description', val)}
        >
          <p className="mt-4 text-lg text-slate-300">
            {content.description || 'Ready to transform your business? Get in touch.'}
          </p>
        </EditButton>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-cyan-400">Contact Information</h3>
              <div className="mt-4 space-y-3">
                <EditButton
                  fieldPath="info.email"
                  currentValue={content.info?.email}
                  onSave={(val) => {
                    const newInfo = { ...(content.info || {}) };
                    newInfo.email = val;
                    handleSave('info', newInfo);
                  }}
                >
                  <p className="text-slate-300">
                    <span className="font-medium">Email:</span> {content.info?.email || 'hello@serandibyte.com'}
                  </p>
                </EditButton>
                <EditButton
                  fieldPath="info.phone"
                  currentValue={content.info?.phone}
                  onSave={(val) => {
                    const newInfo = { ...(content.info || {}) };
                    newInfo.phone = val;
                    handleSave('info', newInfo);
                  }}
                >
                  <p className="text-slate-300">
                    <span className="font-medium">Phone:</span> {content.info?.phone || '+94 (77) 584-1916'}
                  </p>
                </EditButton>
                <EditButton
                  fieldPath="info.address"
                  currentValue={content.info?.address}
                  onSave={(val) => {
                    const newInfo = { ...(content.info || {}) };
                    newInfo.address = val;
                    handleSave('info', newInfo);
                  }}
                >
                  <p className="text-slate-300">
                    <span className="font-medium">Address:</span> {content.info?.address || 'Colombo, Sri Lanka'}
                  </p>
                </EditButton>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-cyan-400">Follow Us</h3>
              <div className="mt-4 space-y-2">
                {content.social?.instagram && (
                  <a href={content.social.instagram} target="_blank" rel="noopener noreferrer" className="block text-slate-300 hover:text-cyan-400 transition-colors">
                    Instagram
                  </a>
                )}
                {content.social?.facebook && (
                  <a href={content.social.facebook} target="_blank" rel="noopener noreferrer" className="block text-slate-300 hover:text-cyan-400 transition-colors">
                    Facebook
                  </a>
                )}
                {content.social?.linkedin && (
                  <a href={content.social.linkedin} target="_blank" rel="noopener noreferrer" className="block text-slate-300 hover:text-cyan-400 transition-colors">
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}