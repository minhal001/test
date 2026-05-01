// ============================================================
//  InfluenceCA — Canada Influencer Finder
// ============================================================

// ---- Utility helpers ----

function fmtFollowers(n) {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1) + 'M';
    if (n >= 1_000)     return (n / 1_000).toFixed(n >= 100_000 ? 0 : 1) + 'K';
    return n.toString();
}

function engagementLabel(rate) {
    if (rate >= 5) return 'high';
    if (rate >= 2) return 'medium';
    return 'low';
}

function engagementText(rate) {
    return rate.toFixed(1) + '% Engagement';
}

function sizeCategory(followers) {
    if (followers < 10_000)    return 'nano';
    if (followers < 100_000)   return 'micro';
    if (followers < 500_000)   return 'mid';
    if (followers < 1_000_000) return 'macro';
    return 'mega';
}

function initials(name) {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

const AVATAR_COLORS = [
    '#d52b1e','#2979ff','#00897b','#7b1fa2','#f57c00',
    '#0277bd','#558b2f','#ad1457','#00695c','#283593',
];

function avatarColor(id) {
    return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

const PLATFORM_ICONS = {
    Instagram: '📸',
    TikTok:    '🎵',
    YouTube:   '▶️',
    X:         '🐦',
    Twitch:    '🎮',
    Podcast:   '🎙️',
};

// ---- Dataset ----

const INFLUENCERS = [
    {
        id: 1,
        name: 'Sophie Tremblay',
        handle: '@sophietremblay',
        province: 'QC',
        city: 'Montréal',
        niche: 'Fashion',
        platforms: ['Instagram', 'TikTok'],
        followers: 820000,
        engagement: 4.8,
        bio: 'Fashion & lifestyle créatrice based in Montréal. Bilingual content celebrating Canadian style, sustainable brands, and city culture. Partenariats / partnerships welcome.',
        tags: ['Sustainable Fashion', 'Bilingual', 'Street Style', 'Quebec'],
        collab: true,
    },
    {
        id: 2,
        name: 'Liam Mackenzie',
        handle: '@liamoutdoors',
        province: 'BC',
        city: 'Vancouver',
        niche: 'Outdoors',
        platforms: ['YouTube', 'Instagram'],
        followers: 510000,
        engagement: 6.1,
        bio: 'Hiking, kayaking, and backcountry adventures across British Columbia and the Canadian Rockies. Gear reviews, trail guides, and conservation advocacy.',
        tags: ['Hiking', 'Gear Review', 'Conservation', 'BC Parks'],
        collab: true,
    },
    {
        id: 3,
        name: 'Priya Sharma',
        handle: '@priya.eats',
        province: 'ON',
        city: 'Toronto',
        niche: 'Food',
        platforms: ['Instagram', 'TikTok', 'YouTube'],
        followers: 290000,
        engagement: 7.2,
        bio: 'Toronto-based food creator exploring the city\'s wildly diverse restaurant scene. From Scarborough roti to Yorkville tasting menus — every cuisine, every budget.',
        tags: ['Toronto Food', 'Restaurant Reviews', 'Diverse Cuisine', 'Foodie'],
        collab: true,
    },
    {
        id: 4,
        name: 'Jordan Rivers',
        handle: '@jordanrivers',
        province: 'ON',
        city: 'Toronto',
        niche: 'Tech',
        platforms: ['YouTube', 'X', 'Podcast'],
        followers: 1_450_000,
        engagement: 3.5,
        bio: 'Canadian tech journalist and creator. Weekly deep dives on AI, startups, and consumer gadgets. Host of "North of Silicon" podcast, covering Canada\'s growing tech ecosystem.',
        tags: ['AI', 'Startups', 'Gadgets', 'Podcast Host'],
        collab: false,
    },
    {
        id: 5,
        name: 'Camille Bouchard',
        handle: '@camille.fitness',
        province: 'QC',
        city: 'Québec City',
        niche: 'Fitness',
        platforms: ['Instagram', 'TikTok'],
        followers: 180000,
        engagement: 8.4,
        bio: 'Certified personal trainer and nutritionist from Québec City. Strength training, HIIT, and mindful eating — approachable wellness for everyday Canadians.',
        tags: ['Personal Training', 'Nutrition', 'Strength', 'Wellness'],
        collab: true,
    },
    {
        id: 6,
        name: 'Marcus Osei',
        handle: '@marcusosei',
        province: 'ON',
        city: 'Toronto',
        niche: 'Music',
        platforms: ['Instagram', 'TikTok', 'YouTube'],
        followers: 670000,
        engagement: 5.9,
        bio: 'Toronto-based R&B & Afrobeats musician and producer. Behind-the-scenes studio content, live performances, and collabs with the best in Canada\'s music scene.',
        tags: ['R&B', 'Afrobeats', 'Music Production', 'Live Performance'],
        collab: true,
    },
    {
        id: 7,
        name: 'Annika Johansson',
        handle: '@annikatravel',
        province: 'AB',
        city: 'Calgary',
        niche: 'Travel',
        platforms: ['Instagram', 'YouTube'],
        followers: 420000,
        engagement: 4.2,
        bio: 'Calgary-based travel creator focusing on unique Canadian destinations and off-the-beaten-path international adventures. Banff to Bali, always with a budget-friendly twist.',
        tags: ['Canadian Travel', 'Budget Travel', 'Adventure', 'Alberta'],
        collab: true,
    },
    {
        id: 8,
        name: 'Étienne Gagnon',
        handle: '@etienne.lifestyle',
        province: 'QC',
        city: 'Montréal',
        niche: 'Lifestyle',
        platforms: ['Instagram', 'TikTok'],
        followers: 95000,
        engagement: 9.1,
        bio: 'Montréal lifestyle creator documenting city living, coffee shop culture, interior design, and the art of slow mornings. Aesthetic content with a Québécois soul.',
        tags: ['Montreal', 'Interior Design', 'Coffee', 'Slow Living'],
        collab: true,
    },
    {
        id: 9,
        name: 'Riley Chen',
        handle: '@rileyplays',
        province: 'BC',
        city: 'Vancouver',
        niche: 'Gaming',
        platforms: ['Twitch', 'YouTube', 'TikTok'],
        followers: 2_100_000,
        engagement: 2.8,
        bio: 'Full-time streamer and content creator. Competitive FPS, RPG deep dives, and a lot of chaotic Just Chatting. Based in Vancouver, streaming since 2018.',
        tags: ['FPS', 'RPG', 'Streaming', 'Esports'],
        collab: true,
    },
    {
        id: 10,
        name: 'Isabelle Côté',
        handle: '@isabellebeauty',
        province: 'QC',
        city: 'Montréal',
        niche: 'Beauty',
        platforms: ['Instagram', 'YouTube', 'TikTok'],
        followers: 760000,
        engagement: 6.5,
        bio: 'Bilingual beauty creator specializing in skincare, makeup tutorials, and honest reviews. Advocating for inclusive beauty and cruelty-free products from Montréal.',
        tags: ['Skincare', 'Makeup', 'Cruelty-Free', 'Bilingual'],
        collab: true,
    },
    {
        id: 11,
        name: 'Noah Belanger',
        handle: '@noahfinance',
        province: 'ON',
        city: 'Ottawa',
        niche: 'Finance',
        platforms: ['YouTube', 'X', 'Podcast'],
        followers: 320000,
        engagement: 4.4,
        bio: 'Canadian personal finance educator helping millennials and Gen Z build wealth. TFSA, RRSP, real estate, and investing — explained simply from Ottawa.',
        tags: ['TFSA', 'RRSP', 'Investing', 'Real Estate'],
        collab: false,
    },
    {
        id: 12,
        name: 'Mei-Ling Park',
        handle: '@meilingparenting',
        province: 'BC',
        city: 'Burnaby',
        niche: 'Parenting',
        platforms: ['Instagram', 'YouTube'],
        followers: 88000,
        engagement: 7.8,
        bio: 'Mom of three sharing authentic parenting moments, multicultural family life, and gentle parenting tips from the Lower Mainland. Real talk, real kids, real chaos.',
        tags: ['Gentle Parenting', 'Multicultural', 'Family Life', 'BC Family'],
        collab: true,
    },
    {
        id: 13,
        name: 'Derek Fontaine',
        handle: '@derekcomedyca',
        province: 'ON',
        city: 'Toronto',
        niche: 'Comedy',
        platforms: ['TikTok', 'Instagram', 'YouTube'],
        followers: 1_800_000,
        engagement: 5.2,
        bio: 'Stand-up comedian and sketch writer from Toronto. Viral short-form comedy skits poking fun at Canadian culture, Toronto life, and relatable millennial struggles.',
        tags: ['Stand-Up', 'Sketch Comedy', 'Canadian Humour', 'Viral'],
        collab: true,
    },
    {
        id: 14,
        name: 'Fatima Al-Hassan',
        handle: '@fatimastyle',
        province: 'ON',
        city: 'Mississauga',
        niche: 'Fashion',
        platforms: ['Instagram', 'TikTok'],
        followers: 240000,
        engagement: 7.0,
        bio: 'Modest fashion influencer and stylist based in Mississauga. Helping women dress confidently and stylishly for any occasion. Representation matters.',
        tags: ['Modest Fashion', 'Styling', 'Inclusivity', 'GTA'],
        collab: true,
    },
    {
        id: 15,
        name: 'Tyler Kowalski',
        handle: '@tylerkowalski',
        province: 'AB',
        city: 'Edmonton',
        niche: 'Sports',
        platforms: ['Instagram', 'YouTube', 'X'],
        followers: 190000,
        engagement: 5.7,
        bio: 'Edmonton Oilers super fan, hockey analyst, and sports content creator. Game breakdowns, fantasy hockey tips, and live reactions to every Oilers game.',
        tags: ['Hockey', 'Oilers', 'Sports Analysis', 'Fantasy Sports'],
        collab: true,
    },
    {
        id: 16,
        name: 'Vanessa Nguyen',
        handle: '@vanessalifestyle',
        province: 'BC',
        city: 'Victoria',
        niche: 'Lifestyle',
        platforms: ['Instagram', 'TikTok'],
        followers: 52000,
        engagement: 9.8,
        bio: 'Victoria-based lifestyle creator celebrating the beauty of slow living on Vancouver Island. Cozy aesthetics, wellness routines, and the best spots in the Capital Region.',
        tags: ['Vancouver Island', 'Slow Living', 'Wellness', 'Victoria'],
        collab: true,
    },
    {
        id: 17,
        name: 'Samuel Dubois',
        handle: '@samduboistech',
        province: 'QC',
        city: 'Montréal',
        niche: 'Tech',
        platforms: ['YouTube', 'X'],
        followers: 78000,
        engagement: 5.3,
        bio: 'Montréal-based developer and tech creator. Tutorials on web development, open source projects, and a weekly deep dive into what\'s happening in Canadian tech startups.',
        tags: ['Web Dev', 'Open Source', 'Startups', 'Montréal Tech'],
        collab: true,
    },
    {
        id: 18,
        name: 'Grace Okonkwo',
        handle: '@graceokonkwo',
        province: 'ON',
        city: 'Brampton',
        niche: 'Beauty',
        platforms: ['TikTok', 'Instagram', 'YouTube'],
        followers: 450000,
        engagement: 6.9,
        bio: 'Beauty educator and brand consultant from Brampton. Expert in melanin-rich skin tones with tutorials that celebrate and serve the diversity of Canadian beauty.',
        tags: ['Melanin Beauty', 'Skincare', 'Brand Consulting', 'Diversity'],
        collab: true,
    },
    {
        id: 19,
        name: 'Alex Cormier',
        handle: '@alexoutdoors',
        province: 'NS',
        city: 'Halifax',
        niche: 'Outdoors',
        platforms: ['Instagram', 'YouTube'],
        followers: 36000,
        engagement: 10.2,
        bio: 'Halifax-based outdoor enthusiast documenting Nova Scotia\'s hidden trails, sea kayaking routes, and wild Atlantic coastline. Come explore Atlantic Canada.',
        tags: ['Nova Scotia', 'Sea Kayaking', 'Atlantic Canada', 'Trails'],
        collab: true,
    },
    {
        id: 20,
        name: 'Jessica Lavoie',
        handle: '@jessfoodie',
        province: 'AB',
        city: 'Calgary',
        niche: 'Food',
        platforms: ['Instagram', 'TikTok'],
        followers: 130000,
        engagement: 8.0,
        bio: 'Calgary food blogger and recipe developer specializing in elevated comfort food with Canadian ingredients. From Alberta beef to Prairie grain bowls.',
        tags: ['Recipe Development', 'Alberta Beef', 'Comfort Food', 'Calgary Eats'],
        collab: true,
    },
    {
        id: 21,
        name: 'Ben Tripp',
        handle: '@bentrippbiz',
        province: 'ON',
        city: 'Toronto',
        niche: 'Business',
        platforms: ['X', 'Podcast', 'YouTube'],
        followers: 205000,
        engagement: 3.9,
        bio: 'Serial entrepreneur and angel investor based in Toronto. Sharing startup lessons, Canadian business news, and unfiltered takes on building companies from scratch.',
        tags: ['Entrepreneurship', 'Angel Investing', 'Startups', 'Business'],
        collab: false,
    },
    {
        id: 22,
        name: 'Hana Kimura',
        handle: '@hanafitness',
        province: 'BC',
        city: 'Vancouver',
        niche: 'Fitness',
        platforms: ['Instagram', 'TikTok', 'YouTube'],
        followers: 390000,
        engagement: 7.4,
        bio: 'Vancouver fitness coach and movement specialist. Pilates, yoga flow, and mobility work for active Canadians. Evidence-based approach to feeling strong and moving well.',
        tags: ['Pilates', 'Yoga', 'Mobility', 'Evidence-Based'],
        collab: true,
    },
    {
        id: 23,
        name: 'Chloe Landry',
        handle: '@chloetravels',
        province: 'NB',
        city: 'Moncton',
        niche: 'Travel',
        platforms: ['Instagram', 'TikTok'],
        followers: 67000,
        engagement: 8.6,
        bio: 'Bilingual travel creator from Moncton exploring the Maritime provinces and beyond. Hidden gems of New Brunswick, PEI, and Nova Scotia — featuring local businesses.',
        tags: ['Maritimes', 'Bilingual', 'Hidden Gems', 'Local Business'],
        collab: true,
    },
    {
        id: 24,
        name: 'Omar Habib',
        handle: '@omarhabibcomedy',
        province: 'ON',
        city: 'Toronto',
        niche: 'Comedy',
        platforms: ['TikTok', 'Instagram'],
        followers: 920000,
        engagement: 6.3,
        bio: 'Comedian and writer from Toronto. Hilarious skits about Canadian immigrant life, multicultural Toronto, and the universal chaos of adulthood.',
        tags: ['Immigrant Life', 'Multicultural', 'Toronto', 'Sketch'],
        collab: true,
    },
    {
        id: 25,
        name: 'Brianna Wolf',
        handle: '@briannawolf',
        province: 'MB',
        city: 'Winnipeg',
        niche: 'Lifestyle',
        platforms: ['Instagram', 'TikTok'],
        followers: 44000,
        engagement: 9.5,
        bio: 'Winnipeg-based lifestyle creator bringing Prairie vibes to your feed. Home décor, seasonal recipes, small business spotlights, and honest takes on life in the Peg.',
        tags: ['Winnipeg', 'Prairie Life', 'Home Décor', 'Small Business'],
        collab: true,
    },
];

// ---- State ----

let filtered = [...INFLUENCERS];

// ---- Filter & Sort ----

function getFilters() {
    return {
        search:   document.getElementById('searchInput').value.toLowerCase().trim(),
        province: document.getElementById('filterProvince').value,
        niche:    document.getElementById('filterNiche').value,
        platform: document.getElementById('filterPlatform').value,
        size:     document.getElementById('filterSize').value,
        sort:     document.getElementById('sortBy').value,
    };
}

function applyFilters() {
    const f = getFilters();

    // Show/hide clear button
    const clearBtn = document.getElementById('clearSearch');
    clearBtn.classList.toggle('visible', f.search.length > 0);

    // Highlight active selects
    ['filterProvince','filterNiche','filterPlatform','filterSize'].forEach(id => {
        document.getElementById(id).classList.toggle('active', !!document.getElementById(id).value);
    });

    filtered = INFLUENCERS.filter(inf => {
        if (f.province && inf.province !== f.province) return false;
        if (f.niche    && inf.niche    !== f.niche)    return false;
        if (f.platform && !inf.platforms.includes(f.platform)) return false;
        if (f.size     && sizeCategory(inf.followers)  !== f.size) return false;
        if (f.search) {
            const haystack = `${inf.name} ${inf.handle} ${inf.bio} ${inf.tags.join(' ')} ${inf.city}`.toLowerCase();
            if (!haystack.includes(f.search)) return false;
        }
        return true;
    });

    // Sort
    filtered.sort((a, b) => {
        switch (f.sort) {
            case 'followers_asc':    return a.followers - b.followers;
            case 'engagement_desc':  return b.engagement - a.engagement;
            case 'name_asc':         return a.name.localeCompare(b.name);
            default:                 return b.followers - a.followers;
        }
    });

    renderChips(f);
    renderResults();
}

function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('filterProvince').value = '';
    document.getElementById('filterNiche').value = '';
    document.getElementById('filterPlatform').value = '';
    document.getElementById('filterSize').value = '';
    document.getElementById('sortBy').value = 'followers_desc';
    applyFilters();
}

function clearSearch() {
    document.getElementById('searchInput').value = '';
    applyFilters();
    document.getElementById('searchInput').focus();
}

// ---- Chips ----

const PROVINCE_NAMES = {
    AB:'Alberta', BC:'British Columbia', MB:'Manitoba', NB:'New Brunswick',
    NL:'Newfoundland & Labrador', NS:'Nova Scotia', ON:'Ontario',
    PE:'Prince Edward Island', QC:'Québec', SK:'Saskatchewan',
};

const SIZE_NAMES = {
    nano:'Nano (<10K)', micro:'Micro (10K–100K)', mid:'Mid-tier (100K–500K)',
    macro:'Macro (500K–1M)', mega:'Mega (1M+)',
};

function renderChips(f) {
    const bar = document.getElementById('chipsBar');
    const chips = [];

    if (f.province) chips.push({ label: PROVINCE_NAMES[f.province], clear: () => { document.getElementById('filterProvince').value = ''; applyFilters(); } });
    if (f.niche)    chips.push({ label: f.niche,                       clear: () => { document.getElementById('filterNiche').value = '';    applyFilters(); } });
    if (f.platform) chips.push({ label: f.platform,                    clear: () => { document.getElementById('filterPlatform').value = ''; applyFilters(); } });
    if (f.size)     chips.push({ label: SIZE_NAMES[f.size],            clear: () => { document.getElementById('filterSize').value = '';     applyFilters(); } });
    if (f.search)   chips.push({ label: `"${f.search}"`,               clear: () => { clearSearch(); } });

    bar.innerHTML = chips.map((c, i) => `
        <span class="chip" onclick="chipClear(${i})">${c.label} <span class="chip-x">✕</span></span>
    `).join('');

    bar.style.paddingBottom = chips.length ? '8px' : '0';
    window._chipClearFns = chips.map(c => c.clear);
}

function chipClear(i) {
    window._chipClearFns[i]();
}

// ---- Render Cards ----

function platformClass(p) {
    return p.toLowerCase().replace(/[^a-z]/g, '');
}

function renderCard(inf) {
    const engLevel = engagementLabel(inf.engagement);
    const color    = avatarColor(inf.id);
    const platforms = inf.platforms.map(p =>
        `<span class="platform-tag ${platformClass(p)}">${PLATFORM_ICONS[p] || ''} ${p}</span>`
    ).join('');

    return `
        <div class="card" onclick="openModal(${inf.id})">
            <div class="card-header">
                <div class="card-avatar" style="background:${color}">${initials(inf.name)}</div>
                <div class="card-info">
                    <div class="card-name">${inf.name}</div>
                    <div class="card-handle">${inf.handle}</div>
                    <div class="card-location">📍 ${inf.city}, ${inf.province}</div>
                </div>
            </div>
            <span class="card-niche">${inf.niche}</span>
            <div class="card-platforms">${platforms}</div>
            <div class="card-stats">
                <div class="stat-box">
                    <div class="stat-value">${fmtFollowers(inf.followers)}</div>
                    <div class="stat-label">Followers</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value">${inf.engagement}%</div>
                    <div class="stat-label">Engagement</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value">${inf.platforms.length}</div>
                    <div class="stat-label">Platform${inf.platforms.length !== 1 ? 's' : ''}</div>
                </div>
            </div>
            <div class="card-bio">${inf.bio}</div>
            <div class="engagement-pill ${engLevel}">${engagementText(inf.engagement)}</div>
        </div>
    `;
}

function renderResults() {
    const grid    = document.getElementById('cardsGrid');
    const header  = document.getElementById('resultsHeader');
    const noRes   = document.getElementById('noResults');
    const total   = document.getElementById('totalCount');

    total.textContent = `${INFLUENCERS.length} influencers`;

    if (filtered.length === 0) {
        grid.innerHTML = '';
        noRes.style.display = 'block';
        header.textContent  = '';
        return;
    }

    noRes.style.display = 'none';
    grid.innerHTML = filtered.map(renderCard).join('');

    const showing = filtered.length;
    const all     = INFLUENCERS.length;
    header.innerHTML = showing === all
        ? `Showing <strong>all ${all} influencers</strong>`
        : `Showing <strong>${showing}</strong> of ${all} influencers`;
}

// ---- Modal ----

function openModal(id) {
    const inf = INFLUENCERS.find(i => i.id === id);
    if (!inf) return;

    const color    = avatarColor(inf.id);
    const engLevel = engagementLabel(inf.engagement);
    const platforms = inf.platforms.map(p =>
        `<span class="modal-platform-btn ${platformClass(p)}">${PLATFORM_ICONS[p] || ''} ${p}</span>`
    ).join('');
    const tags = inf.tags.map(t => `<span class="modal-tag">${t}</span>`).join('');

    document.getElementById('modalBody').innerHTML = `
        <div class="modal-hero">
            <div class="modal-avatar" style="background:${color}">${initials(inf.name)}</div>
            <div>
                <div class="modal-name">${inf.name}</div>
                <div class="modal-handle">${inf.handle}</div>
                <div class="modal-location">📍 ${inf.city}, ${PROVINCE_NAMES[inf.province]}</div>
            </div>
        </div>

        <div class="modal-section-title">About</div>
        <div class="modal-bio">${inf.bio}</div>

        <div class="modal-section-title">Stats</div>
        <div class="modal-stats-grid">
            <div class="modal-stat">
                <div class="modal-stat-value">${fmtFollowers(inf.followers)}</div>
                <div class="modal-stat-label">Total Followers</div>
            </div>
            <div class="modal-stat">
                <div class="modal-stat-value">${inf.engagement}%</div>
                <div class="modal-stat-label">Avg. Engagement</div>
            </div>
            <div class="modal-stat">
                <div class="modal-stat-value">${inf.platforms.length}</div>
                <div class="modal-stat-label">Active Platforms</div>
            </div>
        </div>

        <div class="modal-section-title">Platforms</div>
        <div class="modal-platforms">${platforms}</div>

        <div class="modal-section-title">Tags</div>
        <div class="modal-tags">${tags}</div>

        <div class="modal-section-title">Collaboration</div>
        <div style="font-size:13px;color:var(--text-sub)">
            ${inf.collab
                ? '✅ Open to brand collaborations and partnerships.'
                : '⏸️ Not currently seeking new collaborations.'}
        </div>

        <button class="contact-btn" onclick="contactInfluencer('${inf.name}')">
            Contact ${inf.name.split(' ')[0]} →
        </button>
    `;

    document.getElementById('modalOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal(e) {
    if (e.target === document.getElementById('modalOverlay')) closeModalDirect();
}

function closeModalDirect() {
    document.getElementById('modalOverlay').classList.remove('open');
    document.body.style.overflow = '';
}

function contactInfluencer(name) {
    alert(`This would open a contact form or email template for ${name}.\n\nIn a production app, this links to a CRM, contact form, or the influencer's media kit.`);
}

// Close modal on Escape
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModalDirect();
});

// ---- Init ----
applyFilters();
