// ============================================
// Shree Saravanan Blog - JavaScript
// Fetches posts from Blogger JSON API
// ============================================

const BLOGGER_FEED_URL = `https://shree-saravanan.blogspot.com/feeds/posts/default?alt=json&max-results=50`;

// Helper: Extract image URL from HTML content
function extractImageFromContent(htmlContent) {
    if (!htmlContent) return null;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const img = tempDiv.querySelector('img');
    return img ? img.src : null;
}

// Helper: Extract text excerpt from HTML content
function extractExcerpt(htmlContent, maxLength = 120) {
    if (!htmlContent) return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    // Get text content and clean up whitespace
    let text = tempDiv.textContent || tempDiv.innerText || '';
    text = text.replace(/\s+/g, ' ').trim();
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
}

// Helper: Parse the raw feed entry into a clean object
function parseEntry(entry) {
    const title = entry.title ? entry.title.$t : 'Untitled';
    const content = entry.content ? entry.content.$t : (entry.summary ? entry.summary.$t : '');
    const url = entry.link.find(l => l.rel === 'alternate') ? entry.link.find(l => l.rel === 'alternate').href : '#';
    
    // Format Date
    let dateStr = '';
    if (entry.published && entry.published.$t) {
        const d = new Date(entry.published.$t);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        dateStr = d.toLocaleDateString(undefined, options);
    }
    
    // Try to get a thumbnail from media$thumbnail or extract from content
    let thumbnail = null;
    if (entry.media$thumbnail && entry.media$thumbnail.url) {
        // Replace small thumbnail with a larger version if it's a blogger image
        thumbnail = entry.media$thumbnail.url.replace('/s72-c/', '/s600/');
    }
    if (!thumbnail) {
        thumbnail = extractImageFromContent(content);
    }
    
    // Fallback placeholder if no image found
    if (!thumbnail) {
        thumbnail = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23222%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22sans-serif%22%20font-size%3D%2224%22%20fill%3D%22%23555%22%20text-anchor%3D%22middle%22%20dy%3D%22.3em%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E';
    }

    return {
        title,
        url,
        date: dateStr,
        excerpt: extractExcerpt(content),
        thumbnail
    };
}

// Render the parsed posts into the DOM
function renderPosts(posts) {
    const grid = document.getElementById('blog-grid');
    const loading = document.getElementById('loading-indicator');
    
    if (loading) loading.style.display = 'none';
    
    if (!posts || posts.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: var(--text-color);">No blog posts found.</p>';
        return;
    }

    let html = '';
    posts.forEach(post => {
        html += `
            <a href="${post.url}" target="_blank" style="text-decoration: none;">
                <div class="blog-card">
                    <img class="blog-image" src="${post.thumbnail}" alt="${post.title}">
                    <div class="blog-content">
                        <div class="blog-date">${post.date}</div>
                        <h3 class="blog-title">${post.title}</h3>
                        <p class="blog-excerpt">${post.excerpt}</p>
                        <span class="blog-readmore">Read More <i class="fas fa-arrow-right"></i></span>
                    </div>
                </div>
            </a>
        `;
    });
    
    grid.innerHTML = html;
}

// Define the global JSONP callback
window.handleBloggerResponse = function(data) {
    try {
        const entries = data.feed.entry || [];
        const posts = entries.map(parseEntry);
        renderPosts(posts);
    } catch (err) {
        console.error("Error processing Blogger feed:", err);
        const loading = document.getElementById('loading-indicator');
        if (loading) loading.innerHTML = 'Error loading posts. Please try again later.';
    }
};

// Start the fetch when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // We use JSONP because Blogger RSS API sometimes blocks CORS for fetch()
    const script = document.createElement('script');
    script.src = `${BLOGGER_FEED_URL}&callback=handleBloggerResponse`;
    script.onerror = function() {
        const loading = document.getElementById('loading-indicator');
        if (loading) loading.innerHTML = 'Error connecting to the blog server.';
    };
    document.body.appendChild(script);
});
