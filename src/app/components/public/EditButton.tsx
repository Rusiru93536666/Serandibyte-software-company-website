'use client';

import { useState, useEffect } from 'react';

interface EditButtonProps {
  fieldPath: string;
  currentValue: any;
  onSave: (value: any) => void;
  children: React.ReactNode;
}

export function EditButton({ fieldPath, currentValue, onSave, children }: EditButtonProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await fetch('/api/admin/verify');
        const data = await response.json();
        setIsAdmin(data.authenticated);
      } catch {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, []);

  const handleEdit = () => {
    const newValue = prompt(`Edit ${fieldPath}:`, String(currentValue || ''));
    if (newValue !== null && newValue !== String(currentValue)) {
      onSave(newValue);
    }
  };

  if (!isAdmin) {
    return <>{children}</>;
  }

  return (
    <div 
      className="relative group inline-block w-full"
      onMouseEnter={() => setShowEdit(true)}
      onMouseLeave={() => setShowEdit(false)}
    >
      {children}
      <button
        onClick={handleEdit}
        className={`absolute -top-2 -right-2 bg-[#00E5FF] text-black p-1 rounded-full text-xs border-none cursor-pointer transition-opacity duration-200 hover:scale-110 ${
          showEdit ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        title="Edit content"
      >
        ✏️
      </button>
    </div>
  );
}