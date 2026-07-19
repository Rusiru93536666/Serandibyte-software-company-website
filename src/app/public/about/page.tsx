'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';
import { EditButton } from '../../components/public/EditButton';

export default function AboutPage() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch('/api/content/about');
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
      const response = await fetch('/api/content/about', {
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
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">About us</p>
        <EditButton
          fieldPath="title"
          currentValue={content.title}
          onSave={(val) => handleSave('title', val)}
        >
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">
            {content.title || 'About SerandiByte'}
          </h1>
        </EditButton>
        
        <EditButton
          fieldPath="description"
          currentValue={content.description}
          onSave={(val) => handleSave('description', val)}
        >
          <p className="mt-6 max-w-3xl text-lg text-slate-300">
            {content.description || 'We build digital products that feel effortless.'}
          </p>
        </EditButton>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-6">
            <EditButton
              fieldPath="mission"
              currentValue={content.mission}
              onSave={(val) => handleSave('mission', val)}
            >
              <h2 className="text-xl font-semibold">Our mission</h2>
              <p className="mt-3 text-sm text-slate-300">
                {content.mission || 'To empower businesses with technology.'}
              </p>
            </EditButton>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/10 p-6">
            <EditButton
              fieldPath="vision"
              currentValue={content.vision}
              onSave={(val) => handleSave('vision', val)}
            >
              <h2 className="text-xl font-semibold">Our vision</h2>
              <p className="mt-3 text-sm text-slate-300">
                {content.vision || 'To be the leading digital transformation partner.'}
              </p>
            </EditButton>
          </div>
        </div>

        {content.stats && (
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400">{content.stats.projects || 0}+</div>
              <div className="text-sm text-slate-400">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400">{content.stats.clients || 0}+</div>
              <div className="text-sm text-slate-400">Clients</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400">{content.stats.experience || 0}+</div>
              <div className="text-sm text-slate-400">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400">{content.stats.awards || 0}+</div>
              <div className="text-sm text-slate-400">Awards</div>
            </div>
          </div>
        )}

        <div className="mt-10">
          <Link href="/contact" className="inline-block rounded-full bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400">
            Start a conversation
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}