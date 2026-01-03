import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

// Extract YouTube Video ID and return thumbnail
export function getYouTubeThumbnail(url) {
    if (!url) return null;

    // Check if it's already an image URL
    if (url.match(/\.(jpeg|jpg|gif|png)$/) != null) {
        return url;
    }

    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
        return `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`;
    }

    // Return original if not a YouTube link (fallback)
    return url;
}

// Convert any YouTube URL to Embed format
export function getEmbedUrl(url) {
    if (!url) return '';
    try {
        if (url.includes('youtube.com/embed/')) return url;

        const cleanUrl = url.trim();
        const urlObj = new URL(cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`);

        let videoId = '';
        if (urlObj.hostname.includes('youtu.be')) {
            videoId = urlObj.pathname.slice(1);
        } else if (urlObj.searchParams.get('v')) {
            videoId = urlObj.searchParams.get('v');
        }

        return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    } catch (e) {
        return url;
    }
}
