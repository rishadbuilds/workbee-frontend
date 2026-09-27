/**
 * Formats a timestamp the way WhatsApp's chat list does:
 */

export function formatChatListTime(dateInput?: string | Date | null): string {
    if (!dateInput) return '';

    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return '';

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const diffDays = Math.round(
        (startOfToday.getTime() - startOfDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays <= 0) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    if (diffDays === 1) {
        return 'Yesterday';
    }
    if (diffDays < 7) {
        return date.toLocaleDateString([], { weekday: 'short' });
    }
    return date.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: '2-digit' });
}