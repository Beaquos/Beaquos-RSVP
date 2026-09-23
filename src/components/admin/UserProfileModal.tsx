import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  User,
  Camera,
  Trash2,
  Upload,
  Check,
  Mail,
  Phone,
  MoreVertical,
} from 'lucide-react';
import { AdminUser } from '../../types/user';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AdminUser;
  onSaveProfile: (updatedUser: AdminUser) => void;
  onShowToast: (message: string) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveProfile,
  onShowToast,
}) => {
  const [formData, setFormData] = useState({
    name: currentUser.name,
    lastName: currentUser.lastName,
    email: currentUser.email,
    phone: currentUser.phone,
    photoUrl: currentUser.photoUrl,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPhotoMenuOpen, setIsPhotoMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoMenuRef = useRef<HTMLDivElement>(null);

  // Sync state if currentUser changes
  useEffect(() => {
    setFormData({
      name: currentUser.name,
      lastName: currentUser.lastName,
      email: currentUser.email,
      phone: currentUser.phone,
      photoUrl: currentUser.photoUrl,
    });
  }, [currentUser]);

  // Close photo popover on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (photoMenuRef.current && !photoMenuRef.current.contains(event.target as Node)) {
        setIsPhotoMenuOpen(false);
      }
    };
    if (isPhotoMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isPhotoMenuOpen]);

  if (!isOpen) return null;

  // Phone mask helper for Brazilian phone numbers: (99) 99999-9999
  const formatPhoneBR = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    }
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      onShowToast('A imagem deve ter no máximo 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setFormData((prev) => ({ ...prev, photoUrl: result }));
      setIsPhotoMenuOpen(false);
      onShowToast('Foto atualizada! Lembre-se de salvar as alterações.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, photoUrl: null }));
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsPhotoMenuOpen(false);
    onShowToast('Foto removida. Salve para confirmar.');
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.lastName.trim()) newErrors.lastName = 'Sobrenome é obrigatório';
    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Insira um e-mail válido';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (formData.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Insira um telefone válido com DDD';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const updated: AdminUser = {
      ...currentUser,
      name: formData.name.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      photoUrl: formData.photoUrl,
    };

    onSaveProfile(updated);
    onShowToast('Dados cadastrais atualizados com sucesso!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#24152F]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-[#24152F]/15 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#24152F] text-[#F7F1E5] flex items-center justify-between border-b border-[#3F2553] flex-shrink-0">
          <div className="flex items-center gap-2.5 min-w-0 pr-2">
            <div className="w-8 h-8 rounded-xl bg-[#DFFF5F] text-[#180D20] flex items-center justify-center font-bold flex-shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold truncate">Dados Cadastrais</h3>
              <p className="text-[10px] sm:text-xs text-[#D2C4DC] truncate">Gerencie seu perfil de acesso no Rafluo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#D2C4DC] hover:text-[#F7F1E5] p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer flex-shrink-0"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-6 overflow-y-auto flex-1">
          {/* Centered Circular Avatar with Interactive Menu Popover */}
          <div className="flex flex-col items-center text-center">
            <div className="relative" ref={photoMenuRef}>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                accept="image/*"
                className="hidden"
              />

              {/* Clickable Circular Avatar */}
              <button
                type="button"
                onClick={() => setIsPhotoMenuOpen(!isPhotoMenuOpen)}
                className="group relative w-24 h-24 rounded-full bg-[#24152F] text-[#DFFF5F] font-bold text-2xl flex items-center justify-center overflow-hidden shadow-lg border-4 border-white ring-2 ring-[#24152F]/15 hover:ring-[#24152F]/40 transition-all cursor-pointer"
                title="Clique para opções da foto de perfil"
                aria-label="Opções da foto de perfil"
              >
                {formData.photoUrl ? (
                  <img
                    src={formData.photoUrl}
                    alt="Foto de perfil"
                    className="w-full h-full object-cover rounded-full group-hover:opacity-85 transition-opacity"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="select-none">
                    {formData.name.charAt(0) || 'U'}
                    {formData.lastName.charAt(0) || ''}
                  </span>
                )}

                {/* Subtle camera overlay badge on hover */}
                <div className="absolute inset-0 bg-[#24152F]/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                  <Camera className="w-6 h-6 text-[#DFFF5F]" />
                </div>
              </button>

              {/* Camera Badge Trigger */}
              <button
                type="button"
                onClick={() => setIsPhotoMenuOpen(!isPhotoMenuOpen)}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#24152F] text-[#DFFF5F] border-2 border-white flex items-center justify-center shadow-md hover:bg-[#180D20] transition-colors cursor-pointer"
                title="Editar foto de perfil"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>

              {/* Contextual Popover Options: 'Substituir foto' and 'Remover foto' */}
              {isPhotoMenuOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-48 rounded-2xl bg-white border border-[#24152F]/15 shadow-xl py-1.5 z-20 animate-in fade-in zoom-in-95 duration-100">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full text-left px-3.5 py-2 text-xs font-semibold text-[#24152F] hover:bg-[#FAF6EE] flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#24152F]/70" />
                    <span>{formData.photoUrl ? 'Substituir foto' : 'Adicionar foto'}</span>
                  </button>

                  {formData.photoUrl && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="w-full text-left px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors cursor-pointer border-t border-[#24152F]/5 mt-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remover foto</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            <p className="text-[11px] text-[#24152F]/60 mt-2 font-medium">
              Clique na foto para alterar ou remover
            </p>
          </div>

          {/* Form Fields: Desktop 2 columns for Nome/Sobrenome, 1 column on mobile */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#24152F] mb-1.5">
                  Nome *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Seu nome"
                  className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border bg-white text-[#24152F] focus:outline-none focus:ring-2 focus:ring-[#24152F] transition-all ${
                    errors.name ? 'border-rose-500 ring-1 ring-rose-500' : 'border-[#24152F]/20'
                  }`}
                />
                {errors.name && <p className="text-[10px] text-rose-600 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#24152F] mb-1.5">
                  Sobrenome *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Seu sobrenome"
                  className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border bg-white text-[#24152F] focus:outline-none focus:ring-2 focus:ring-[#24152F] transition-all ${
                    errors.lastName ? 'border-rose-500 ring-1 ring-rose-500' : 'border-[#24152F]/20'
                  }`}
                />
                {errors.lastName && <p className="text-[10px] text-rose-600 mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#24152F] mb-1.5">
                E-mail *
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="seu.email@beaquos.com"
                  className={`w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border bg-white text-[#24152F] focus:outline-none focus:ring-2 focus:ring-[#24152F] transition-all ${
                    errors.email ? 'border-rose-500 ring-1 ring-rose-500' : 'border-[#24152F]/20'
                  }`}
                />
                <Mail className="w-4 h-4 text-[#24152F]/40 absolute left-3 top-3.5" />
              </div>
              {errors.email && <p className="text-[10px] text-rose-600 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#24152F] mb-1.5">
                Telefone (WhatsApp) *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: formatPhoneBR(e.target.value) })}
                  placeholder="(61) 98765-4321"
                  className={`w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border bg-white text-[#24152F] focus:outline-none focus:ring-2 focus:ring-[#24152F] transition-all ${
                    errors.phone ? 'border-rose-500 ring-1 ring-rose-500' : 'border-[#24152F]/20'
                  }`}
                />
                <Phone className="w-4 h-4 text-[#24152F]/40 absolute left-3 top-3.5" />
              </div>
              {errors.phone && <p className="text-[10px] text-rose-600 mt-1">{errors.phone}</p>}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[#24152F]/10 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold rounded-xl text-[#24152F]/70 hover:text-[#24152F] hover:bg-[#FAF6EE] transition-colors cursor-pointer text-center"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl bg-[#24152F] hover:bg-[#180D20] text-[#F7F1E5] transition-all cursor-pointer shadow-xs border border-[#3F2553] active:scale-98"
            >
              <Check className="w-3.5 h-3.5 text-[#DFFF5F]" />
              <span>Salvar Alterações</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
