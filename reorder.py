import re

with open('/Volumes/SANSSD/sree_repo/index.html', 'r') as f:
    content = f.read()

# 1. Update rating
content = content.replace('<span>IMDb</span>', '<span>6.1/10 IMDb</span>', 1) # Only for the first one, wait Kaadhal is the first. 
# Better:
content = content.replace('<h3>Kaadhal Enbadhu Podhu Udamai</h3>\n                        <p class="work-year">2025</p>\n                        <p class="work-role">Cinematographer</p>\n                        <div class="work-rating">\n                            <i class="fas fa-star"></i>\n                            <span>IMDb</span>', 
'<h3>Kaadhal Enbadhu Podhu Udamai</h3>\n                        <p class="work-year">2025</p>\n                        <p class="work-role">Cinematographer</p>\n                        <div class="work-rating">\n                            <i class="fas fa-star"></i>\n                            <span>6.1/10 IMDb</span>')

# 2. Delete Professional Positioning
positioning_regex = re.compile(r'<div style="width: 100%; margin-top: 40px; padding: 20px; background: rgba\(255,255,255,0\.05\); border-radius: 10px; text-align: center;">\s*<h3[^>]*>Professional Positioning</h3>\s*<p[^>]*>Festival Recognized Director of Photography</p>\s*<p[^>]*>Blending Cinematic Storytelling with Advanced HDR & Color Science Workflows</p>\s*</div>', re.DOTALL)
content = positioning_regex.sub('', content)

# 3. Extract and Move About Section
about_regex = re.compile(r'(<!-- About Section -->\s*<section id="about".*?</section>)\s*', re.DOTALL)
about_match = about_regex.search(content)
if about_match:
    about_html = about_match.group(1)
    # Remove from original location
    content = content[:about_match.start()] + content[about_match.end():]
    
    # Insert after Hero Section
    hero_end = content.find('</section>', content.find('<!-- Hero Section -->')) + 10
    content = content[:hero_end] + '\n\n    ' + about_html + content[hero_end:]

# 4. Reorder Nav Links
nav_links_old = """                    <li><a href="#showreel" class="nav-link">Showreel</a></li>
                    <li><a href="#work" class="nav-link">Work</a></li>
                    <li><a href="#about" class="nav-link">About</a></li>"""
nav_links_new = """                    <li><a href="#about" class="nav-link">About</a></li>
                    <li><a href="#showreel" class="nav-link">Showreel</a></li>
                    <li><a href="#work" class="nav-link">Work</a></li>"""
content = content.replace(nav_links_old, nav_links_new)

# 5. Make Contact cards fully clickable
email_old = """                    <div class="info-card">
                        <i class="fas fa-envelope"></i>
                        <h3>Email</h3>
                        <p><a href="mailto:filmaddicts.sara@gmail.com" style="text-decoration: none; color: inherit;">filmaddicts.sara@gmail.com</a></p>
                    </div>"""
email_new = """                    <a href="mailto:filmaddicts.sara@gmail.com" style="text-decoration: none; color: inherit;">
                        <div class="info-card">
                            <i class="fas fa-envelope"></i>
                            <h3>Email</h3>
                            <p>filmaddicts.sara@gmail.com</p>
                        </div>
                    </a>"""
content = content.replace(email_old, email_new)

whatsapp_old = """                    <div class="info-card">
                        <i class="fab fa-whatsapp"></i>
                        <h3>WhatsApp</h3>
                        <p><a href="https://wa.me/dop_shreesaravanan" target="_blank" style="text-decoration: none; color: inherit;">@dop_shreesaravanan</a></p>
                    </div>"""
whatsapp_new = """                    <a href="https://wa.me/dop_shreesaravanan" target="_blank" style="text-decoration: none; color: inherit;">
                        <div class="info-card">
                            <i class="fab fa-whatsapp"></i>
                            <h3>WhatsApp</h3>
                            <p>@dop_shreesaravanan</p>
                        </div>
                    </a>"""
content = content.replace(whatsapp_old, whatsapp_new)


with open('/Volumes/SANSSD/sree_repo/index.html', 'w') as f:
    f.write(content)

