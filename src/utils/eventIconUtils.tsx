import React from 'react';
import {
  Heart,
  Cake,
  Sparkles,
  GraduationCap,
  Building2,
  Baby,
  Coffee,
  Calendar,
  PartyPopper,
  Crown,
} from 'lucide-react';

export const getEventIcon = (eventType: string, className = 'w-4 h-4'): React.ReactNode => {
  const normalized = (eventType || '').toLowerCase().trim();

  if (normalized.includes('casamento') || normalized.includes('noivado') || normalized.includes('bodas')) {
    return <Heart className={className} />;
  }

  if (normalized.includes('15') || normalized.includes('debutante')) {
    return <Crown className={className} />;
  }

  if (normalized.includes('aniversário') || normalized.includes('aniversario') || normalized.includes('festa')) {
    return <Cake className={className} />;
  }

  if (normalized.includes('formatura') || normalized.includes('colação') || normalized.includes('graduação')) {
    return <GraduationCap className={className} />;
  }

  if (
    normalized.includes('corporativo') ||
    normalized.includes('empresa') ||
    normalized.includes('conferência') ||
    normalized.includes('gala') ||
    normalized.includes('business')
  ) {
    return <Building2 className={className} />;
  }

  if (normalized.includes('infantil') || normalized.includes('criança') || normalized.includes('kids')) {
    return <Baby className={className} />;
  }

  if (normalized.includes('chá') || normalized.includes('cha') || normalized.includes('bebê') || normalized.includes('panelas')) {
    return <Coffee className={className} />;
  }

  if (normalized.includes('celebração') || normalized.includes('celebracao') || normalized.includes('show')) {
    return <PartyPopper className={className} />;
  }

  return <Calendar className={className} />;
};
