/**
 * Utility functions for RSVP links and clipboard copying with reliable fallbacks
 */

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for iframe sandboxes or non-secure contexts
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      textArea.remove();
      return successful;
    }
  } catch (err) {
    console.warn('Erro ao copiar para clipboard:', err);
    return false;
  }
};

export const getEventRsvpUrl = (eventId: string, slug?: string): string => {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://beaquos.com';
  return `${origin}/rsvp/evento/${slug || eventId}`;
};

export const getGuestRsvpUrl = (rsvpCode: string): string => {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://beaquos.com';
  return `${origin}/rsvp/${rsvpCode}`;
};

export const getClientPanelUrl = (eventId: string, slug?: string): string => {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://beaquos.com';
  return `${origin}/responsavel/${slug || eventId}`;
};
