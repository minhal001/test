// ============================================================
//  InfluenceCA — Canada Influencer Finder
// ============================================================

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
function engagementText(rate) { return rate.toFixed(1) + '% Engagement'; }
function sizeCategory(followers) {
    if (followers < 10_000)    return 'nano';
    if (followers < 100_000)   return 'micro';
    if (followers < 500_000)   return 'mid';
    if (followers < 1_000_000) return 'macro';
    return 'mega';
}
function initials(name) { return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(); }

const AVATAR_COLORS = [
    '#d52b1e','#2979ff','#00897b','#7b1fa2','#f57c00',
    '#0277bd','#558b2f','#ad1457','#00695c','#283593',
    '#6d4c41','#37474f','#c0392b','#16a085','#8e44ad',
];
function avatarColor(id) { return AVATAR_COLORS[id % AVATAR_COLORS.length]; }

const PLATFORM_ICONS = {
    Instagram: '📸', TikTok: '🎵', YouTube: '▶️',
    X: '🐦', Twitch: '🎮', Podcast: '🎙️',
};

// ---- Dataset ----

const INFLUENCERS = [

    // ── KELOWNA & OKANAGAN ─────────────────────────────────────
    {
        id: 101,
        name: 'Megan Hollis',
        handle: '@meganhollis_kelowna',
        province: 'BC', city: 'Kelowna',
        niche: 'Lifestyle',
        platforms: ['Instagram', 'TikTok'],
        followers: 62000, engagement: 9.4,
        bio: 'Kelowna lifestyle creator celebrating Okanagan living — wine country, lake days, farmers markets, and the best local spots. Proudly rooted in the heart of BC.',
        tags: ['Okanagan', 'Wine Country', 'Lake Life', 'Local Kelowna'],
        collab: true,
    },
    {
        id: 102,
        name: 'Travis Boyle',
        handle: '@travisboyle_ok',
        province: 'BC', city: 'Kelowna',
        niche: 'Outdoors',
        platforms: ['YouTube', 'Instagram'],
        followers: 48000, engagement: 8.7,
        bio: 'Okanagan outdoor guide and content creator. Hiking Knox Mountain, mountain biking Myra Canyon, and paddleboarding Okanagan Lake. Your local adventure resource.',
        tags: ['Knox Mountain', 'Myra Canyon', 'Okanagan Lake', 'Mountain Biking'],
        collab: true,
    },
    {
        id: 103,
        name: 'Sophia Winery',
        handle: '@sophiaokanagan',
        province: 'BC', city: 'Kelowna',
        niche: 'Food',
        platforms: ['Instagram', 'TikTok', 'YouTube'],
        followers: 55000, engagement: 10.1,
        bio: 'Wine & food creator based in Kelowna. Touring every winery on the Naramata Bench, West Kelowna wine trail, and beyond. Tasting notes, pairings, and vineyard tours.',
        tags: ['Okanagan Wine', 'Naramata Bench', 'Wine Tasting', 'Vineyard Tours'],
        collab: true,
    },
    {
        id: 104,
        name: 'Dylan Park',
        handle: '@dylanpark_kelowna',
        province: 'BC', city: 'Kelowna',
        niche: 'Fitness',
        platforms: ['Instagram', 'TikTok'],
        followers: 29000, engagement: 11.2,
        bio: 'Personal trainer and competitive cyclist in Kelowna. Outdoor training, cycling routes through the Okanagan Valley, and nutrition tips built for an active BC lifestyle.',
        tags: ['Cycling', 'Personal Training', 'Okanagan Fitness', 'Outdoor Workouts'],
        collab: true,
    },
    {
        id: 105,
        name: 'Amber Tse',
        handle: '@ambertse_ok',
        province: 'BC', city: 'Kelowna',
        niche: 'Travel',
        platforms: ['Instagram', 'YouTube'],
        followers: 41000, engagement: 8.3,
        bio: 'Travel & local tourism creator from Kelowna. Showcasing the Okanagan\'s best-kept secrets — from Osoyoos beaches to Vernon\'s Silver Star ski resort and everything between.',
        tags: ['Okanagan Tourism', 'Silver Star', 'Osoyoos', 'BC Travel'],
        collab: true,
    },
    {
        id: 106,
        name: 'Cody Reimer',
        handle: '@codyreimer',
        province: 'BC', city: 'Kelowna',
        niche: 'Tech',
        platforms: ['YouTube', 'X', 'Podcast'],
        followers: 22000, engagement: 7.6,
        bio: 'Tech entrepreneur and startup founder in Kelowna. Covering BC\'s emerging tech scene outside Vancouver, remote work culture, and building software companies in smaller cities.',
        tags: ['BC Tech', 'Startups', 'Remote Work', 'Kelowna Business'],
        collab: true,
    },
    {
        id: 107,
        name: 'Paige Ellison',
        handle: '@paigeellison_ok',
        province: 'BC', city: 'Kelowna',
        niche: 'Fashion',
        platforms: ['Instagram', 'TikTok'],
        followers: 35000, engagement: 9.8,
        bio: 'Kelowna-based fashion and style creator. Laid-back West Coast aesthetics, local boutique finds, and seasonal looks inspired by Okanagan lake and mountain vibes.',
        tags: ['West Coast Style', 'Boutique Fashion', 'Okanagan Aesthetic', 'Local Shopping'],
        collab: true,
    },
    {
        id: 108,
        name: 'Marcus Vien',
        handle: '@marcusvien',
        province: 'BC', city: 'Kelowna',
        niche: 'Food',
        platforms: ['Instagram', 'TikTok'],
        followers: 38000, engagement: 10.5,
        bio: 'Kelowna food blogger and restaurant reviewer. From downtown Kelowna\'s top dining spots to hidden Okanagan farm-to-table gems. Supporting local chefs and producers.',
        tags: ['Kelowna Restaurants', 'Farm-to-Table', 'Local Food', 'Okanagan Dining'],
        collab: true,
    },
    {
        id: 109,
        name: 'Rachel Forde',
        handle: '@rachelforde_kelowna',
        province: 'BC', city: 'Kelowna',
        niche: 'Beauty',
        platforms: ['Instagram', 'TikTok', 'YouTube'],
        followers: 27000, engagement: 9.1,
        bio: 'Beauty creator and esthetician from Kelowna. Skincare routines for the dry Okanagan climate, makeup tutorials, and honest reviews of beauty brands available in BC.',
        tags: ['Skincare', 'Okanagan Beauty', 'Esthetician', 'Dry Climate Skincare'],
        collab: true,
    },
    {
        id: 110,
        name: 'Nate Burrows',
        handle: '@nateburrows_ski',
        province: 'BC', city: 'Kelowna',
        niche: 'Sports',
        platforms: ['Instagram', 'YouTube', 'TikTok'],
        followers: 53000, engagement: 8.9,
        bio: 'Ski and snowboard content creator based in Kelowna. Big White, Sun Peaks, Apex Mountain — covering every ski resort within the Okanagan and interior BC with expert reviews.',
        tags: ['Big White', 'Skiing', 'Snowboarding', 'Interior BC'],
        collab: true,
    },
    {
        id: 111,
        name: 'Leila Ahmadi',
        handle: '@leila_oklifestyle',
        province: 'BC', city: 'Kelowna',
        niche: 'Parenting',
        platforms: ['Instagram', 'YouTube'],
        followers: 19000, engagement: 11.8,
        bio: 'Kelowna mom of two sharing family life in the Okanagan — the best kid-friendly beaches, orchards, activities, and raising a family in one of Canada\'s most beautiful regions.',
        tags: ['Okanagan Family', 'Kid-Friendly', 'Orchards', 'BC Family Life'],
        collab: true,
    },
    {
        id: 112,
        name: 'Josh Faber',
        handle: '@joshfaber_realestate',
        province: 'BC', city: 'Kelowna',
        niche: 'Business',
        platforms: ['Instagram', 'YouTube', 'X'],
        followers: 31000, engagement: 7.2,
        bio: 'Kelowna real estate investor and market analyst. Covering Okanagan property trends, investment opportunities, and what\'s driving one of Canada\'s fastest-growing real estate markets.',
        tags: ['Kelowna Real Estate', 'Property Investment', 'Okanagan Market', 'BC Housing'],
        collab: true,
    },
    {
        id: 113,
        name: 'Haley Sunberg',
        handle: '@haleysunberg',
        province: 'BC', city: 'Kelowna',
        niche: 'Lifestyle',
        platforms: ['Instagram', 'TikTok'],
        followers: 44000, engagement: 9.7,
        bio: 'Sun-soaked lifestyle content from Kelowna. Okanagan beach season, local events, orchard picks, and the authentic small-city big-life experience that makes Kelowna special.',
        tags: ['Beach Life', 'Okanagan Summer', 'Local Events', 'Kelowna Community'],
        collab: true,
    },
    {
        id: 114,
        name: 'Owen Chartrand',
        handle: '@owenchartrand_photo',
        province: 'BC', city: 'Kelowna',
        niche: 'Outdoors',
        platforms: ['Instagram', 'YouTube'],
        followers: 66000, engagement: 8.1,
        bio: 'Landscape photographer and outdoor creator from Kelowna. Capturing the raw beauty of the Okanagan Valley — vineyards, desert landscapes, mountain trails, and Okanagan Lake at golden hour.',
        tags: ['Landscape Photography', 'Okanagan Valley', 'Nature Photography', 'Golden Hour'],
        collab: true,
    },
    {
        id: 115,
        name: 'Tara Minhas',
        handle: '@taraminhas_wellness',
        province: 'BC', city: 'Kelowna',
        niche: 'Fitness',
        platforms: ['Instagram', 'TikTok'],
        followers: 24000, engagement: 10.9,
        bio: 'Yoga instructor and wellness coach in Kelowna. Outdoor yoga sessions with vineyard views, mindfulness practices, and holistic health tips designed for the Okanagan lifestyle.',
        tags: ['Yoga', 'Wellness', 'Outdoor Yoga', 'Okanagan Wellness'],
        collab: true,
    },
    {
        id: 116,
        name: 'Brett Calloway',
        handle: '@brettcalloway_ok',
        province: 'BC', city: 'West Kelowna',
        niche: 'Food',
        platforms: ['Instagram', 'TikTok', 'YouTube'],
        followers: 33000, engagement: 9.3,
        bio: 'West Kelowna food and wine creator. Covering the West Kelowna wine trail, Boucherie Road wineries, and the growing culinary scene on the west side of Okanagan Lake.',
        tags: ['West Kelowna', 'Boucherie Road', 'Okanagan Wine', 'Culinary'],
        collab: true,
    },
    {
        id: 117,
        name: 'Nina Kostadinova',
        handle: '@nina_penticton',
        province: 'BC', city: 'Penticton',
        niche: 'Travel',
        platforms: ['Instagram', 'TikTok'],
        followers: 28000, engagement: 10.2,
        bio: 'Penticton-based travel and lifestyle creator. Two lakes, endless beaches, Ironman events, and the best cycling routes in the South Okanagan. Living the Penticton dream.',
        tags: ['Penticton', 'South Okanagan', 'Two Lakes', 'Ironman'],
        collab: true,
    },
    {
        id: 118,
        name: 'Cole Radford',
        handle: '@coleradford_vernon',
        province: 'BC', city: 'Vernon',
        niche: 'Sports',
        platforms: ['Instagram', 'YouTube'],
        followers: 21000, engagement: 9.6,
        bio: 'Vernon-based athlete and content creator. Hockey, skiing at Silver Star, hiking Ellison Provincial Park, and celebrating everything North Okanagan has to offer year-round.',
        tags: ['Vernon', 'Silver Star', 'North Okanagan', 'Hockey'],
        collab: true,
    },

    // ── VANCOUVER & LOWER MAINLAND ─────────────────────────────
    {
        id: 2,
        name: 'Liam Mackenzie',
        handle: '@liamoutdoors',
        province: 'BC', city: 'Vancouver',
        niche: 'Outdoors',
        platforms: ['YouTube', 'Instagram'],
        followers: 510000, engagement: 6.1,
        bio: 'Hiking, kayaking, and backcountry adventures across British Columbia and the Canadian Rockies. Gear reviews, trail guides, and conservation advocacy.',
        tags: ['Hiking', 'Gear Review', 'Conservation', 'BC Parks'],
        collab: true,
    },
    {
        id: 9,
        name: 'Riley Chen',
        handle: '@rileyplays',
        province: 'BC', city: 'Vancouver',
        niche: 'Gaming',
        platforms: ['Twitch', 'YouTube', 'TikTok'],
        followers: 2_100_000, engagement: 2.8,
        bio: 'Full-time streamer and content creator. Competitive FPS, RPG deep dives, and a lot of chaotic Just Chatting. Based in Vancouver, streaming since 2018.',
        tags: ['FPS', 'RPG', 'Streaming', 'Esports'],
        collab: true,
    },
    {
        id: 22,
        name: 'Hana Kimura',
        handle: '@hanafitness',
        province: 'BC', city: 'Vancouver',
        niche: 'Fitness',
        platforms: ['Instagram', 'TikTok', 'YouTube'],
        followers: 390000, engagement: 7.4,
        bio: 'Vancouver fitness coach and movement specialist. Pilates, yoga flow, and mobility work for active Canadians. Evidence-based approach to feeling strong and moving well.',
        tags: ['Pilates', 'Yoga', 'Mobility', 'Evidence-Based'],
        collab: true,
    },
    {
        id: 201,
        name: 'Jasmine Wu',
        handle: '@jasminewu_van',
        province: 'BC', city: 'Vancouver',
        niche: 'Food',
        platforms: ['Instagram', 'TikTok', 'YouTube'],
        followers: 185000, engagement: 8.2,
        bio: 'Vancouver food creator specializing in Asian cuisine, dim sum crawls, and the city\'s incredible multicultural dining scene. From Richmond night markets to Gastown fine dining.',
        tags: ['Dim Sum', 'Asian Cuisine', 'Richmond', 'Vancouver Eats'],
        collab: true,
    },
    {
        id: 202,
        name: 'Tyler Moss',
        handle: '@tylermoss_van',
        province: 'BC', city: 'Vancouver',
        niche: 'Lifestyle',
        platforms: ['Instagram', 'TikTok'],
        followers: 97000, engagement: 7.9,
        bio: 'Vancouver lifestyle creator documenting the city\'s outdoor-meets-urban culture. Sea-to-sky road trips, Seawall runs, rooftop patios, and the best of West Coast living.',
        tags: ['Sea-to-Sky', 'Seawall', 'West Coast', 'Urban Outdoor'],
        collab: true,
    },
    {
        id: 12,
        name: 'Mei-Ling Park',
        handle: '@meilingparenting',
        province: 'BC', city: 'Burnaby',
        niche: 'Parenting',
        platforms: ['Instagram', 'YouTube'],
        followers: 88000, engagement: 7.8,
        bio: 'Mom of three sharing authentic parenting moments, multicultural family life, and gentle parenting tips from the Lower Mainland. Real talk, real kids, real chaos.',
        tags: ['Gentle Parenting', 'Multicultural', 'Family Life', 'BC Family'],
        collab: true,
    },
    {
        id: 16,
        name: 'Vanessa Nguyen',
        handle: '@vanessalifestyle',
        province: 'BC', city: 'Victoria',
        niche: 'Lifestyle',
        platforms: ['Instagram', 'TikTok'],
        followers: 52000, engagement: 9.8,
        bio: 'Victoria-based lifestyle creator celebrating the beauty of slow living on Vancouver Island. Cozy aesthetics, wellness routines, and the best spots in the Capital Region.',
        tags: ['Vancouver Island', 'Slow Living', 'Wellness', 'Victoria'],
        collab: true,
    },
    {
        id: 203,
        name: 'Aaron Delacroix',
        handle: '@aarondelacroix',
        province: 'BC', city: 'Victoria',
        niche: 'Travel',
        platforms: ['Instagram', 'YouTube'],
        followers: 74000, engagement: 7.5,
        bio: 'Victoria-based travel creator exploring Vancouver Island\'s hidden gems — from Tofino surf breaks to the Gulf Islands and Port Renfrew old-growth forests.',
        tags: ['Vancouver Island', 'Tofino', 'Gulf Islands', 'Island Travel'],
        collab: true,
    },
    {
        id: 204,
        name: 'Simone Adeyemi',
        handle: '@simoneadeyemi',
        province: 'BC', city: 'Surrey',
        niche: 'Beauty',
        platforms: ['TikTok', 'Instagram', 'YouTube'],
        followers: 143000, engagement: 8.6,
        bio: 'Surrey-based beauty educator and content creator. Inclusive makeup tutorials, skincare for melanin-rich skin, and celebrating the diverse beauty of Metro Vancouver.',
        tags: ['Inclusive Beauty', 'Surrey', 'Metro Vancouver', 'Melanin Skincare'],
        collab: true,
    },
    {
        id: 205,
        name: 'Felix Huang',
        handle: '@felixhuang_tech',
        province: 'BC', city: 'Vancouver',
        niche: 'Tech',
        platforms: ['YouTube', 'X', 'Podcast'],
        followers: 118000, engagement: 5.4,
        bio: 'Vancouver tech journalist covering Canada\'s West Coast startup scene, AI companies, and the growing tech corridor between Vancouver and Seattle.',
        tags: ['Vancouver Tech', 'Startups', 'AI', 'Pacific Northwest'],
        collab: false,
    },

    // ── ALBERTA ────────────────────────────────────────────────
    {
        id: 7,
        name: 'Annika Johansson',
        handle: '@annikatravel',
        province: 'AB', city: 'Calgary',
        niche: 'Travel',
        platforms: ['Instagram', 'YouTube'],
        followers: 420000, engagement: 4.2,
        bio: 'Calgary-based travel creator focusing on unique Canadian destinations and off-the-beaten-path international adventures. Banff to Bali, always with a budget-friendly twist.',
        tags: ['Canadian Travel', 'Budget Travel', 'Adventure', 'Alberta'],
        collab: true,
    },
    {
        id: 15,
        name: 'Tyler Kowalski',
        handle: '@tylerkowalski',
        province: 'AB', city: 'Edmonton',
        niche: 'Sports',
        platforms: ['Instagram', 'YouTube', 'X'],
        followers: 190000, engagement: 5.7,
        bio: 'Edmonton Oilers super fan, hockey analyst, and sports content creator. Game breakdowns, fantasy hockey tips, and live reactions to every Oilers game.',
        tags: ['Hockey', 'Oilers', 'Sports Analysis', 'Fantasy Sports'],
        collab: true,
    },
    {
        id: 20,
        name: 'Jessica Lavoie',
        handle: '@jessfoodie',
        province: 'AB', city: 'Calgary',
        niche: 'Food',
        platforms: ['Instagram', 'TikTok'],
        followers: 130000, engagement: 8.0,
        bio: 'Calgary food blogger and recipe developer specializing in elevated comfort food with Canadian ingredients. From Alberta beef to Prairie grain bowls.',
        tags: ['Recipe Development', 'Alberta Beef', 'Comfort Food', 'Calgary Eats'],
        collab: true,
    },
    {
        id: 301,
        name: 'Dante Ferreira',
        handle: '@dantebanff',
        province: 'AB', city: 'Canmore',
        niche: 'Outdoors',
        platforms: ['Instagram', 'YouTube'],
        followers: 210000, engagement: 7.3,
        bio: 'Canmore-based outdoor adventurer living in the shadow of the Rockies. Backcountry skiing, mountaineering, and trail running in Banff and Kananaskis. Gear obsessed.',
        tags: ['Banff', 'Kananaskis', 'Backcountry', 'Rocky Mountains'],
        collab: true,
    },
    {
        id: 302,
        name: 'Maya Ostrowski',
        handle: '@mayaostrowski',
        province: 'AB', city: 'Calgary',
        niche: 'Fitness',
        platforms: ['Instagram', 'TikTok', 'YouTube'],
        followers: 88000, engagement: 9.2,
        bio: 'Calgary fitness coach and body positivity advocate. Strength training, functional fitness, and building a healthy relationship with movement for every body type.',
        tags: ['Body Positivity', 'Strength Training', 'Functional Fitness', 'Calgary Fit'],
        collab: true,
    },
    {
        id: 303,
        name: 'Leo Sandhu',
        handle: '@leosandhu_yyc',
        province: 'AB', city: 'Calgary',
        niche: 'Lifestyle',
        platforms: ['Instagram', 'TikTok'],
        followers: 57000, engagement: 8.8,
        bio: 'South Asian lifestyle creator from Calgary. Documenting multicultural Calgary, Indo-Canadian culture, Stampede season, and the best fusion food spots in YYC.',
        tags: ['South Asian', 'Calgary Stampede', 'Multicultural YYC', 'Fusion Food'],
        collab: true,
    },
    {
        id: 304,
        name: 'Brooke Finley',
        handle: '@brookefinley_ab',
        province: 'AB', city: 'Edmonton',
        niche: 'Fashion',
        platforms: ['Instagram', 'TikTok'],
        followers: 72000, engagement: 8.1,
        bio: 'Edmonton fashion creator bringing Prairie chic to the feed. Seasonal layering, local boutique spotlights, and affordable style finds for Albertan winters and summers alike.',
        tags: ['Prairie Fashion', 'Edmonton Style', 'Boutique Finds', 'Seasonal Layers'],
        collab: true,
    },

    // ── ONTARIO ────────────────────────────────────────────────
    {
        id: 3,
        name: 'Priya Sharma',
        handle: '@priya.eats',
        province: 'ON', city: 'Toronto',
        niche: 'Food',
        platforms: ['Instagram', 'TikTok', 'YouTube'],
        followers: 290000, engagement: 7.2,
        bio: 'Toronto-based food creator exploring the city\'s wildly diverse restaurant scene. From Scarborough roti to Yorkville tasting menus — every cuisine, every budget.',
        tags: ['Toronto Food', 'Restaurant Reviews', 'Diverse Cuisine', 'Foodie'],
        collab: true,
    },
    {
        id: 4,
        name: 'Jordan Rivers',
        handle: '@jordanrivers',
        province: 'ON', city: 'Toronto',
        niche: 'Tech',
        platforms: ['YouTube', 'X', 'Podcast'],
        followers: 1_450_000, engagement: 3.5,
        bio: 'Canadian tech journalist and creator. Weekly deep dives on AI, startups, and consumer gadgets. Host of "North of Silicon" podcast, covering Canada\'s growing tech ecosystem.',
        tags: ['AI', 'Startups', 'Gadgets', 'Podcast Host'],
        collab: false,
    },
    {
        id: 6,
        name: 'Marcus Osei',
        handle: '@marcusosei',
        province: 'ON', city: 'Toronto',
        niche: 'Music',
        platforms: ['Instagram', 'TikTok', 'YouTube'],
        followers: 670000, engagement: 5.9,
        bio: 'Toronto-based R&B & Afrobeats musician and producer. Behind-the-scenes studio content, live performances, and collabs with the best in Canada\'s music scene.',
        tags: ['R&B', 'Afrobeats', 'Music Production', 'Live Performance'],
        collab: true,
    },
    {
        id: 11,
        name: 'Noah Belanger',
        handle: '@noahfinance',
        province: 'ON', city: 'Ottawa',
        niche: 'Finance',
        platforms: ['YouTube', 'X', 'Podcast'],
        followers: 320000, engagement: 4.4,
        bio: 'Canadian personal finance educator helping millennials and Gen Z build wealth. TFSA, RRSP, real estate, and investing — explained simply from Ottawa.',
        tags: ['TFSA', 'RRSP', 'Investing', 'Real Estate'],
        collab: false,
    },
    {
        id: 13,
        name: 'Derek Fontaine',
        handle: '@derekcomedyca',
        province: 'ON', city: 'Toronto',
        niche: 'Comedy',
        platforms: ['TikTok', 'Instagram', 'YouTube'],
        followers: 1_800_000, engagement: 5.2,
        bio: 'Stand-up comedian and sketch writer from Toronto. Viral short-form comedy skits poking fun at Canadian culture, Toronto life, and relatable millennial struggles.',
        tags: ['Stand-Up', 'Sketch Comedy', 'Canadian Humour', 'Viral'],
        collab: true,
    },
    {
        id: 14,
        name: 'Fatima Al-Hassan',
        handle: '@fatimastyle',
        province: 'ON', city: 'Mississauga',
        niche: 'Fashion',
        platforms: ['Instagram', 'TikTok'],
        followers: 240000, engagement: 7.0,
        bio: 'Modest fashion influencer and stylist based in Mississauga. Helping women dress confidently and stylishly for any occasion. Representation matters.',
        tags: ['Modest Fashion', 'Styling', 'Inclusivity', 'GTA'],
        collab: true,
    },
    {
        id: 18,
        name: 'Grace Okonkwo',
        handle: '@graceokonkwo',
        province: 'ON', city: 'Brampton',
        niche: 'Beauty',
        platforms: ['TikTok', 'Instagram', 'YouTube'],
        followers: 450000, engagement: 6.9,
        bio: 'Beauty educator and brand consultant from Brampton. Expert in melanin-rich skin tones with tutorials that celebrate and serve the diversity of Canadian beauty.',
        tags: ['Melanin Beauty', 'Skincare', 'Brand Consulting', 'Diversity'],
        collab: true,
    },
    {
        id: 21,
        name: 'Ben Tripp',
        handle: '@bentrippbiz',
        province: 'ON', city: 'Toronto',
        niche: 'Business',
        platforms: ['X', 'Podcast', 'YouTube'],
        followers: 205000, engagement: 3.9,
        bio: 'Serial entrepreneur and angel investor based in Toronto. Sharing startup lessons, Canadian business news, and unfiltered takes on building companies from scratch.',
        tags: ['Entrepreneurship', 'Angel Investing', 'Startups', 'Business'],
        collab: false,
    },
    {
        id: 24,
        name: 'Omar Habib',
        handle: '@omarhabibcomedy',
        province: 'ON', city: 'Toronto',
        niche: 'Comedy',
        platforms: ['TikTok', 'Instagram'],
        followers: 920000, engagement: 6.3,
        bio: 'Comedian and writer from Toronto. Hilarious skits about Canadian immigrant life, multicultural Toronto, and the universal chaos of adulthood.',
        tags: ['Immigrant Life', 'Multicultural', 'Toronto', 'Sketch'],
        collab: true,
    },
    {
        id: 401,
        name: 'Cassandra Nkosi',
        handle: '@cassandrankosi',
        province: 'ON', city: 'Toronto',
        niche: 'Lifestyle',
        platforms: ['Instagram', 'TikTok', 'YouTube'],
        followers: 162000, engagement: 7.6,
        bio: 'Toronto Black lifestyle creator celebrating Afro-Canadian culture, community events, natural hair, travel, and the vibrant life of the Greater Toronto Area.',
        tags: ['Black Canadian', 'Natural Hair', 'Afro-Canadian Culture', 'GTA Lifestyle'],
        collab: true,
    },
    {
        id: 402,
        name: 'Patrick Lalonde',
        handle: '@patricklalonde',
        province: 'ON', city: 'Ottawa',
        niche: 'Travel',
        platforms: ['Instagram', 'YouTube'],
        followers: 89000, engagement: 6.8,
        bio: 'Ottawa-based travel creator with a focus on family-friendly Canadian destinations. National Capital Region adventures, Quebec day trips, and road trips across Eastern Canada.',
        tags: ['Family Travel', 'Ottawa', 'National Capital', 'Eastern Canada'],
        collab: true,
    },
    {
        id: 403,
        name: 'Amara Diallo',
        handle: '@amaradiallo_fit',
        province: 'ON', city: 'Toronto',
        niche: 'Fitness',
        platforms: ['Instagram', 'TikTok'],
        followers: 115000, engagement: 9.4,
        bio: 'Toronto fitness trainer and runner. Marathon training, sprints, and strength programming for busy city professionals. West African fitness traditions meet modern sport science.',
        tags: ['Marathon', 'Running', 'Strength', 'Toronto Fitness'],
        collab: true,
    },
    {
        id: 404,
        name: 'Sean Whitfield',
        handle: '@seanwhitfield_on',
        province: 'ON', city: 'Hamilton',
        niche: 'Food',
        platforms: ['Instagram', 'TikTok'],
        followers: 68000, engagement: 9.0,
        bio: 'Hamilton food creator documenting the Steel City\'s surprisingly great food scene. Local breweries, James Street North dining, and supporting Hamilton\'s independent restaurants.',
        tags: ['Hamilton Food', 'Local Brewery', 'Steel City', 'Independent Restaurants'],
        collab: true,
    },

    // ── QUÉBEC ─────────────────────────────────────────────────
    {
        id: 1,
        name: 'Sophie Tremblay',
        handle: '@sophietremblay',
        province: 'QC', city: 'Montréal',
        niche: 'Fashion',
        platforms: ['Instagram', 'TikTok'],
        followers: 820000, engagement: 4.8,
        bio: 'Fashion & lifestyle créatrice based in Montréal. Bilingual content celebrating Canadian style, sustainable brands, and city culture. Partenariats / partnerships welcome.',
        tags: ['Sustainable Fashion', 'Bilingual', 'Street Style', 'Quebec'],
        collab: true,
    },
    {
        id: 5,
        name: 'Camille Bouchard',
        handle: '@camille.fitness',
        province: 'QC', city: 'Québec City',
        niche: 'Fitness',
        platforms: ['Instagram', 'TikTok'],
        followers: 180000, engagement: 8.4,
        bio: 'Certified personal trainer and nutritionist from Québec City. Strength training, HIIT, and mindful eating — approachable wellness for everyday Canadians.',
        tags: ['Personal Training', 'Nutrition', 'Strength', 'Wellness'],
        collab: true,
    },
    {
        id: 8,
        name: 'Étienne Gagnon',
        handle: '@etienne.lifestyle',
        province: 'QC', city: 'Montréal',
        niche: 'Lifestyle',
        platforms: ['Instagram', 'TikTok'],
        followers: 95000, engagement: 9.1,
        bio: 'Montréal lifestyle creator documenting city living, coffee shop culture, interior design, and the art of slow mornings. Aesthetic content with a Québécois soul.',
        tags: ['Montreal', 'Interior Design', 'Coffee', 'Slow Living'],
        collab: true,
    },
    {
        id: 10,
        name: 'Isabelle Côté',
        handle: '@isabellebeauty',
        province: 'QC', city: 'Montréal',
        niche: 'Beauty',
        platforms: ['Instagram', 'YouTube', 'TikTok'],
        followers: 760000, engagement: 6.5,
        bio: 'Bilingual beauty creator specializing in skincare, makeup tutorials, and honest reviews. Advocating for inclusive beauty and cruelty-free products from Montréal.',
        tags: ['Skincare', 'Makeup', 'Cruelty-Free', 'Bilingual'],
        collab: true,
    },
    {
        id: 17,
        name: 'Samuel Dubois',
        handle: '@samduboistech',
        province: 'QC', city: 'Montréal',
        niche: 'Tech',
        platforms: ['YouTube', 'X'],
        followers: 78000, engagement: 5.3,
        bio: 'Montréal-based developer and tech creator. Tutorials on web development, open source projects, and a weekly deep dive into what\'s happening in Canadian tech startups.',
        tags: ['Web Dev', 'Open Source', 'Startups', 'Montréal Tech'],
        collab: true,
    },
    {
        id: 501,
        name: 'Léa Villeneuve',
        handle: '@leavilleneuve',
        province: 'QC', city: 'Montréal',
        niche: 'Food',
        platforms: ['Instagram', 'TikTok', 'YouTube'],
        followers: 134000, engagement: 8.7,
        bio: 'Montréal food creator obsessed with Québécois cuisine and the city\'s world-class restaurant scene. Poutine to fine dining, bagels to smoked meat — tout Montréal dans une assiette.',
        tags: ['Québécois Cuisine', 'Montreal Restaurants', 'Poutine', 'French Canadian Food'],
        collab: true,
    },
    {
        id: 502,
        name: 'Remy Ouellet',
        handle: '@remyouellet_outdoors',
        province: 'QC', city: 'Québec City',
        niche: 'Outdoors',
        platforms: ['Instagram', 'YouTube'],
        followers: 47000, engagement: 8.9,
        bio: 'Québec City outdoor enthusiast covering the Laurentians, Charlevoix, and Gaspésie. Snowshoeing, backcountry skiing, and summer hiking in la belle province.',
        tags: ['Laurentians', 'Charlevoix', 'Gaspésie', 'Quebec Outdoors'],
        collab: true,
    },

    // ── MARITIMES ──────────────────────────────────────────────
    {
        id: 19,
        name: 'Alex Cormier',
        handle: '@alexoutdoors',
        province: 'NS', city: 'Halifax',
        niche: 'Outdoors',
        platforms: ['Instagram', 'YouTube'],
        followers: 36000, engagement: 10.2,
        bio: 'Halifax-based outdoor enthusiast documenting Nova Scotia\'s hidden trails, sea kayaking routes, and wild Atlantic coastline. Come explore Atlantic Canada.',
        tags: ['Nova Scotia', 'Sea Kayaking', 'Atlantic Canada', 'Trails'],
        collab: true,
    },
    {
        id: 23,
        name: 'Chloe Landry',
        handle: '@chloetravels',
        province: 'NB', city: 'Moncton',
        niche: 'Travel',
        platforms: ['Instagram', 'TikTok'],
        followers: 67000, engagement: 8.6,
        bio: 'Bilingual travel creator from Moncton exploring the Maritime provinces and beyond. Hidden gems of New Brunswick, PEI, and Nova Scotia — featuring local businesses.',
        tags: ['Maritimes', 'Bilingual', 'Hidden Gems', 'Local Business'],
        collab: true,
    },
    {
        id: 601,
        name: 'Dana MacPherson',
        handle: '@danamacpherson_ns',
        province: 'NS', city: 'Halifax',
        niche: 'Food',
        platforms: ['Instagram', 'TikTok'],
        followers: 43000, engagement: 9.8,
        bio: 'Halifax food creator celebrating Nova Scotia seafood, farmers markets, and the East Coast dining scene. Lobster rolls, donairs, and everything in between.',
        tags: ['Nova Scotia Seafood', 'Halifax Food', 'Lobster', 'East Coast Eats'],
        collab: true,
    },
    {
        id: 602,
        name: 'Evan Chisholm',
        handle: '@evanchisholm_pei',
        province: 'PE', city: 'Charlottetown',
        niche: 'Lifestyle',
        platforms: ['Instagram', 'TikTok', 'YouTube'],
        followers: 31000, engagement: 11.4,
        bio: 'PEI lifestyle creator showing the world why the Island is Canada\'s best-kept secret. Red sand beaches, Anne of Green Gables country, lobster season, and slow Island life.',
        tags: ['PEI', 'Island Life', 'Red Sand Beaches', 'Charlottetown'],
        collab: true,
    },

    // ── PRAIRIES ───────────────────────────────────────────────
    {
        id: 25,
        name: 'Brianna Wolf',
        handle: '@briannawolf',
        province: 'MB', city: 'Winnipeg',
        niche: 'Lifestyle',
        platforms: ['Instagram', 'TikTok'],
        followers: 44000, engagement: 9.5,
        bio: 'Winnipeg-based lifestyle creator bringing Prairie vibes to your feed. Home décor, seasonal recipes, small business spotlights, and honest takes on life in the Peg.',
        tags: ['Winnipeg', 'Prairie Life', 'Home Décor', 'Small Business'],
        collab: true,
    },
    {
        id: 701,
        name: 'Jade Rempel',
        handle: '@jaderempel_mb',
        province: 'MB', city: 'Winnipeg',
        niche: 'Food',
        platforms: ['Instagram', 'TikTok'],
        followers: 26000, engagement: 10.6,
        bio: 'Winnipeg food blogger celebrating Manitoba cuisine — perogies, Ukrainian food culture, the Forks Market, and the growing restaurant scene in Canada\'s most underrated food city.',
        tags: ['Winnipeg Food', 'Ukrainian Cuisine', 'Perogies', 'Forks Market'],
        collab: true,
    },
    {
        id: 702,
        name: 'Carson Holt',
        handle: '@carsonholt_sk',
        province: 'SK', city: 'Saskatoon',
        niche: 'Outdoors',
        platforms: ['Instagram', 'YouTube'],
        followers: 19000, engagement: 10.8,
        bio: 'Saskatoon outdoor creator covering Saskatchewan\'s hidden landscapes — Waskesiu, Waskana, and the vast Prairie wilderness most Canadians never see. Big skies, real adventures.',
        tags: ['Saskatchewan', 'Waskesiu', 'Prairie Wilderness', 'Big Skies'],
        collab: true,
    },
];

// ---- State ----
let filtered = [...INFLUENCERS];

// ---- Build city list dynamically ----
function buildCityOptions() {
    const cityMap = {};
    INFLUENCERS.forEach(inf => {
        if (!cityMap[inf.province]) cityMap[inf.province] = new Set();
        cityMap[inf.province].add(inf.city);
    });
    const sel = document.getElementById('filterCity');
    // Group by province
    const provinces = Object.keys(cityMap).sort();
    provinces.forEach(prov => {
        const group = document.createElement('optgroup');
        group.label = PROVINCE_NAMES[prov] || prov;
        [...cityMap[prov]].sort().forEach(city => {
            const opt = document.createElement('option');
            opt.value = city;
            opt.textContent = city;
            group.appendChild(opt);
        });
        sel.appendChild(group);
    });
}

// ---- Filter & Sort ----
function getFilters() {
    return {
        search:   document.getElementById('searchInput').value.toLowerCase().trim(),
        province: document.getElementById('filterProvince').value,
        city:     document.getElementById('filterCity').value,
        niche:    document.getElementById('filterNiche').value,
        platform: document.getElementById('filterPlatform').value,
        size:     document.getElementById('filterSize').value,
        sort:     document.getElementById('sortBy').value,
    };
}

function applyFilters() {
    const f = getFilters();

    document.getElementById('clearSearch').classList.toggle('visible', f.search.length > 0);
    ['filterProvince','filterCity','filterNiche','filterPlatform','filterSize'].forEach(id => {
        document.getElementById(id).classList.toggle('active', !!document.getElementById(id).value);
    });

    // When province changes, update city dropdown
    syncCityToProvince(f.province);

    filtered = INFLUENCERS.filter(inf => {
        if (f.province && inf.province !== f.province) return false;
        if (f.city     && inf.city     !== f.city)     return false;
        if (f.niche    && inf.niche    !== f.niche)    return false;
        if (f.platform && !inf.platforms.includes(f.platform)) return false;
        if (f.size     && sizeCategory(inf.followers) !== f.size) return false;
        if (f.search) {
            const h = `${inf.name} ${inf.handle} ${inf.bio} ${inf.tags.join(' ')} ${inf.city}`.toLowerCase();
            if (!h.includes(f.search)) return false;
        }
        return true;
    });

    filtered.sort((a, b) => {
        switch (f.sort) {
            case 'followers_asc':   return a.followers - b.followers;
            case 'engagement_desc': return b.engagement - a.engagement;
            case 'name_asc':        return a.name.localeCompare(b.name);
            default:                return b.followers - a.followers;
        }
    });

    renderChips(f);
    renderResults();
}

function syncCityToProvince(province) {
    const sel = document.getElementById('filterCity');
    const currentCity = sel.value;
    // Show/hide optgroups based on selected province
    [...sel.querySelectorAll('optgroup')].forEach(grp => {
        const match = !province || grp.label === (PROVINCE_NAMES[province] || province);
        grp.style.display = match ? '' : 'none';
        if (!match) {
            [...grp.querySelectorAll('option')].forEach(o => { if (o.selected) sel.value = ''; });
        }
    });
}

function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('filterProvince').value = '';
    document.getElementById('filterCity').value = '';
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
    const chips = [];
    if (f.province) chips.push({ label: PROVINCE_NAMES[f.province], clear: () => { document.getElementById('filterProvince').value=''; applyFilters(); } });
    if (f.city)     chips.push({ label: f.city,                      clear: () => { document.getElementById('filterCity').value='';     applyFilters(); } });
    if (f.niche)    chips.push({ label: f.niche,                     clear: () => { document.getElementById('filterNiche').value='';    applyFilters(); } });
    if (f.platform) chips.push({ label: f.platform,                  clear: () => { document.getElementById('filterPlatform').value=''; applyFilters(); } });
    if (f.size)     chips.push({ label: SIZE_NAMES[f.size],          clear: () => { document.getElementById('filterSize').value='';     applyFilters(); } });
    if (f.search)   chips.push({ label: `"${f.search}"`,             clear: () => { clearSearch(); } });

    const bar = document.getElementById('chipsBar');
    bar.innerHTML = chips.map((c,i) => `<span class="chip" onclick="chipClear(${i})">${c.label} <span class="chip-x">✕</span></span>`).join('');
    bar.style.paddingBottom = chips.length ? '8px' : '0';
    window._chipClearFns = chips.map(c => c.clear);
}

function chipClear(i) { window._chipClearFns[i](); }

// ---- Render Cards ----
function platformClass(p) { return p.toLowerCase().replace(/[^a-z]/g, ''); }

function renderCard(inf) {
    const engLevel = engagementLabel(inf.engagement);
    const color = avatarColor(inf.id);
    const platforms = inf.platforms.map(p =>
        `<span class="platform-tag ${platformClass(p)}">${PLATFORM_ICONS[p]||''} ${p}</span>`
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
                <div class="stat-box"><div class="stat-value">${fmtFollowers(inf.followers)}</div><div class="stat-label">Followers</div></div>
                <div class="stat-box"><div class="stat-value">${inf.engagement}%</div><div class="stat-label">Engagement</div></div>
                <div class="stat-box"><div class="stat-value">${inf.platforms.length}</div><div class="stat-label">Platform${inf.platforms.length!==1?'s':''}</div></div>
            </div>
            <div class="card-bio">${inf.bio}</div>
            <div class="engagement-pill ${engLevel}">${engagementText(inf.engagement)}</div>
        </div>
    `;
}

function renderResults() {
    const grid   = document.getElementById('cardsGrid');
    const header = document.getElementById('resultsHeader');
    const noRes  = document.getElementById('noResults');
    document.getElementById('totalCount').textContent = `${INFLUENCERS.length} influencers`;

    if (filtered.length === 0) {
        grid.innerHTML = ''; noRes.style.display = 'block'; header.textContent = ''; return;
    }
    noRes.style.display = 'none';
    grid.innerHTML = filtered.map(renderCard).join('');
    header.innerHTML = filtered.length === INFLUENCERS.length
        ? `Showing <strong>all ${INFLUENCERS.length} influencers</strong>`
        : `Showing <strong>${filtered.length}</strong> of ${INFLUENCERS.length} influencers`;
}

// ---- Modal ----
function openModal(id) {
    const inf = INFLUENCERS.find(i => i.id === id);
    if (!inf) return;
    const color = avatarColor(inf.id);
    const platforms = inf.platforms.map(p =>
        `<span class="modal-platform-btn ${platformClass(p)}">${PLATFORM_ICONS[p]||''} ${p}</span>`
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
            <div class="modal-stat"><div class="modal-stat-value">${fmtFollowers(inf.followers)}</div><div class="modal-stat-label">Total Followers</div></div>
            <div class="modal-stat"><div class="modal-stat-value">${inf.engagement}%</div><div class="modal-stat-label">Avg. Engagement</div></div>
            <div class="modal-stat"><div class="modal-stat-value">${inf.platforms.length}</div><div class="modal-stat-label">Active Platforms</div></div>
        </div>
        <div class="modal-section-title">Platforms</div>
        <div class="modal-platforms">${platforms}</div>
        <div class="modal-section-title">Tags</div>
        <div class="modal-tags">${tags}</div>
        <div class="modal-section-title">Collaboration</div>
        <div style="font-size:13px;color:var(--text-sub)">${inf.collab
            ? '✅ Open to brand collaborations and partnerships.'
            : '⏸️ Not currently seeking new collaborations.'}</div>
        <button class="contact-btn" onclick="contactInfluencer('${inf.name.split(' ')[0]}')">
            Contact ${inf.name.split(' ')[0]} →
        </button>
    `;
    document.getElementById('modalOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeModal(e) { if (e.target === document.getElementById('modalOverlay')) closeModalDirect(); }
function closeModalDirect() { document.getElementById('modalOverlay').classList.remove('open'); document.body.style.overflow = ''; }
function contactInfluencer(name) {
    alert(`This would open a contact form or email template for ${name}.\n\nIn a production app, this links to a CRM, contact form, or the influencer's media kit.`);
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModalDirect(); });

// ---- Init ----
buildCityOptions();
applyFilters();
