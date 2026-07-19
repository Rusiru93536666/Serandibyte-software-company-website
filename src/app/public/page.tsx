'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/public/Navbar';
import Footer from '../components/public/Footer';
import { EditButton } from '../components/public/EditButton';
import { resolveAssetPath } from '../lib/assets';

export default function HomePage() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch('/api/content/home');
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
      const response = await fetch('/api/content/home', {
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
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="flex flex-col md:flex-row items-center justify-center min-h-[80vh] px-4 py-8 gap-8 max-w-7xl mx-auto">
          <div className="flex-1 text-center md:text-left">
            <EditButton
              fieldPath="hero.title"
              currentValue={content.hero?.title}
              onSave={(val) => handleSave('hero.title', val)}
            >
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-[#00E5FF]">
                {content.hero?.title || 'Welcome to SerandiByte'}
              </h1>
            </EditButton>
            
            <EditButton
              fieldPath="hero.description"
              currentValue={content.hero?.description}
              onSave={(val) => handleSave('hero.description', val)}
            >
              <p className="text-base sm:text-lg mt-4 max-w-2xl text-gray-300 mx-auto md:mx-0">
                {content.hero?.description || 'Your Digital Transformation Partner'}
              </p>
            </EditButton>
            
            <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
              <EditButton
                fieldPath="hero.buttonText"
                currentValue={content.hero?.buttonText}
                onSave={(val) => handleSave('hero.buttonText', val)}
              >
                <Link href="/contact">
                  <button className="px-8 py-3 bg-[#00E5FF] text-black font-semibold rounded-lg hover:bg-[#00E5FF]/80 transition-colors">
                    {content.hero?.buttonText || 'Get Started'}
                  </button>
                </Link>
              </EditButton>
            </div>
          </div>

          <div className="flex-1 flex justify-center">
            {content.hero?.image && (
              <img
                src={resolveAssetPath(content.hero.image)}
                alt="Hero"
                className="w-full max-w-md rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/circule.gif';
                }}
              />
            )}
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 px-4 bg-gray-900/20">
          <div className="max-w-7xl mx-auto">
            <EditButton
              fieldPath="about.title"
              currentValue={content.about?.title}
              onSave={(val) => handleSave('about.title', val)}
            >
              <h2 className="text-3xl sm:text-5xl text-center text-[#00E5FF]">
                {content.about?.title || 'Why You Choose Us'}
              </h2>
            </EditButton>
            
            <EditButton
              fieldPath="about.description"
              currentValue={content.about?.description}
              onSave={(val) => handleSave('about.description', val)}
            >
              <p className="text-center max-w-3xl mx-auto mt-6 text-gray-300">
                {content.about?.description || 'We create applications that deliver a modern, professional, and memorable brand experience.'}
              </p>
            </EditButton>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {content.about?.cards?.map((card: any, index: number) => (
                <div key={index} className="bg-gray-900/50 rounded-lg p-6 border border-gray-800 hover:border-[#00E5FF] transition-colors">
                  <EditButton
                    fieldPath={`about.cards[${index}].title`}
                    currentValue={card.title}
                    onSave={(val) => {
                      const newCards = [...(content.about?.cards || [])];
                      newCards[index] = { ...newCards[index], title: val };
                      handleSave('about.cards', newCards);
                    }}
                  >
                    <h3 className="text-xl font-semibold text-[#00E5FF]">{card.title}</h3>
                  </EditButton>
                  
                  <EditButton
                    fieldPath={`about.cards[${index}].description`}
                    currentValue={card.description}
                    onSave={(val) => {
                      const newCards = [...(content.about?.cards || [])];
                      newCards[index] = { ...newCards[index], description: val };
                      handleSave('about.cards', newCards);
                    }}
                  >
                    <p className="mt-2 text-gray-300 text-sm">{card.description}</p>
                  </EditButton>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}