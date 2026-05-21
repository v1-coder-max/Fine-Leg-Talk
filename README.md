# Fine Leg Talk — Cricket Website

A complete, self-contained static cricket website for the Fine Leg Talk YouTube channel. Six HTML pages, zero dependencies, no build tools. Open `index.html` in a browser and it works.

---

## File Structure

```
Fine Leg Talk/
├── index.html        — Homepage (hero, videos, blog preview, match centre, polls, about)
├── blogs.html        — Blog listing with category filters and sidebar
├── blog-post.html    — Single post template (use this to create every new article)
├── matches.html      — Match Centre (results grouped by series, upcoming fixtures)
├── videos.html       — Videos & Shorts with filter tabs
├── stats.html        — Player stats grid (batting + bowling, filterable by format)
└── README.md         — This file
```

---

## Deploy Free on GitHub Pages

### Step 1 — Create a GitHub repository

1. Go to [github.com](https://github.com) and sign in (or create a free account)
2. Click **New repository**
3. Name it `fine-leg-talk` (or anything you like)
4. Set it to **Public**
5. Click **Create repository**

### Step 2 — Upload your files

**Option A — via the GitHub website (easiest):**
1. Open your new repository
2. Click **Add file → Upload files**
3. Drag all 6 HTML files and this README into the upload area
4. Click **Commit changes**

**Option B — via Git (if you have Git installed):**
```bash
cd "path/to/Fine Leg Talk"
git init
git add .
git commit -m "Initial commit — Fine Leg Talk website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/fine-leg-talk.git
git push -u origin main
```

### Step 3 — Enable GitHub Pages

1. In your repository, click **Settings**
2. Scroll down to **Pages** in the left sidebar
3. Under **Source**, select **Deploy from a branch**
4. Set branch to `main`, folder to `/ (root)`
5. Click **Save**

Your site will be live at:
```
https://YOUR_USERNAME.github.io/fine-leg-talk/
```

It takes 1–3 minutes to go live. GitHub Pages is completely free for public repositories.

---

## Connect a Custom Domain (e.g. finelegtalk.com)

### Step 1 — Buy a domain
Purchase from Namecheap, Porkbun, Google Domains, or any registrar. `.com` costs ~$10–12/year.

### Step 2 — Add a CNAME file to your repository
Create a file called `CNAME` (no extension) in your repo root containing only your domain:
```
finelegtalk.com
```

### Step 3 — Configure DNS at your registrar
Add these DNS records (exact steps vary by registrar — look for "DNS Management"):

**A records** — point your apex domain to GitHub's IPs:
```
Type: A    Host: @    Value: 185.199.108.153
Type: A    Host: @    Value: 185.199.109.153
Type: A    Host: @    Value: 185.199.110.153
Type: A    Host: @    Value: 185.199.111.153
```

**CNAME record** — point `www` to your GitHub Pages URL:
```
Type: CNAME    Host: www    Value: YOUR_USERNAME.github.io
```

### Step 4 — Set custom domain in GitHub Pages
1. Go to **Settings → Pages**
2. Under **Custom domain**, enter `finelegtalk.com`
3. Click **Save**
4. Check **Enforce HTTPS** (once it activates, usually within an hour)

DNS propagation takes 15 minutes to 48 hours.

---

## How to Add Content

### Add a new blog post

1. **Copy** `blog-post.html` and rename it descriptively:
   ```
   india-vs-england-5th-test-review-2025.html
   bumrah-analysis-engalnd-series-2025.html
   ipl-2025-final-review.html
   ```
   Good filenames help with Google SEO — include the match name, players, and year.

2. **Update** the `<title>` and `<meta name="description">` tags at the top of the file.

3. **Edit** the article content:
   - Change the `<h1>` post title
   - Update the standfirst (italic intro paragraph)
   - Replace the post body content
   - Update post date, author, read time

4. **Replace image placeholders** when you have real images:
   ```html
   <!-- Replace this gradient div: -->
   <div class="post-hero">...</div>

   <!-- With a real image tag: -->
   <img src="images/your-photo.jpg" alt="Descriptive alt text" 
        style="width:100%;border-radius:16px;margin-bottom:32px;">
   ```

5. **Replace the YouTube embed placeholder:**
   ```html
   <!-- Replace the .yt-embed div with a real embed: -->
   <div style="position:relative;padding-top:56.25%;border-radius:16px;overflow:hidden;margin:36px 0;">
     <iframe style="position:absolute;inset:0;width:100%;height:100%;"
       src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
       frameborder="0"
       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
       allowfullscreen></iframe>
   </div>
   ```

6. **Add a card** on `blogs.html` inside `#postsGrid`:
   ```html
   <a href="india-vs-england-5th-test-review-2025.html" class="post-card fade-up" data-category="review">
     <div class="pc-img bg1">
       <div class="pc-img-icon">🏏</div>
       <div class="pc-bdg"><span class="badge b-rev">Match Review</span></div>
     </div>
     <div class="pc-body">
       <div class="pc-meta">
         <span class="pc-date">May 22, 2025</span>
         <span class="pc-read">7 min</span>
       </div>
       <h3 class="pc-title">India vs England 5th Test Review: Bumrah's Finest Hour</h3>
       <p class="pc-exc">Brief excerpt here — 1–2 sentences about what the article covers.</p>
       <span class="pc-link">Read more</span>
     </div>
   </a>
   ```
   Set `data-category` to one of: `review`, `analysis`, `opinion`, `ipl`, `history`

7. **Update** the featured card on `index.html` to point to your latest post.

---

### Update match results

Open `matches.html` and find the relevant series group. Update the match card:

```html
<div class="match-card">
  <div class="mc-top">
    <div class="mc-series-tag"><span>5th Test • The Oval</span></div>
    <div class="mc-teams">
      <div class="mc-row">
        <div class="mc-info"><span class="mc-flag">🇮🇳</span><span class="mc-name">India</span></div>
        <span class="mc-score win">380 & 195/3d</span>  <!-- add class "win" to winner -->
      </div>
      <div class="mc-div"></div>
      <div class="mc-row">
        <div class="mc-info"><span class="mc-flag">🏴󠁧󠁢󠁥󠁮󠁧󠁿</span><span class="mc-name">England</span></div>
        <span class="mc-score">264 & 218</span>
      </div>
    </div>
  </div>
  <div class="mc-bot">
    <div class="mc-result">India won by 93 runs</div>
    <div class="mc-perf">🏏 Kohli 112 (180) • Bumrah 5/44 • Stokes 78</div>
    <div class="mc-foot">
      <span class="mc-date">May 22–26, 2025</span>
      <a href="india-vs-england-5th-test-review-2025.html" class="mc-review">Read Review →</a>
    </div>
  </div>
</div>
```

To add a new series, copy an entire `.series-group` block and set the correct `data-format` attribute (`test`, `odi`, `t20`, or `ipl`).

---

### Add a video

In `videos.html`, copy a `.vid-card` block inside `#vidGrid` and update it:

```html
<div class="vid-card fade-up" data-type="review">
  <div class="v-thumb">
    <!-- Option A: gradient placeholder -->
    <div class="v-inner">
      <div class="v-bg vg3"></div>
      <div class="v-play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div>
      <div class="v-bdg"><span class="badge b-green">Review</span></div>
      <div class="v-dur">18:30</div>
    </div>

    <!-- Option B: real YouTube embed (replace the above with this) -->
    <!--
    <div style="position:relative;padding-top:56.25%;">
      <iframe style="position:absolute;inset:0;width:100%;height:100%;"
        src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
        frameborder="0" allowfullscreen></iframe>
    </div>
    -->
  </div>
  <div class="v-info">
    <h3 class="v-title">India vs England 5th Test Full Review</h3>
    <div class="v-meta"><span>👁 5.2K views</span><span>May 27, 2025</span></div>
  </div>
</div>
```

Set `data-type` to `shorts`, `analysis`, or `review` so the filter tab works.

---

### Add a player stat card

In `stats.html`, copy a `.stat-card` block and update it:

```html
<div class="stat-card fade-up" data-format="test">
  <div class="sc-hdr">
    <div>
      <div class="sc-name">Player Name</div>
      <div class="sc-role">Batting • Right-hand</div>
    </div>
    <div style="text-align:right;">
      <span class="sc-flag">🇦🇺</span>
      <span class="badge b-test">TEST</span>
    </div>
  </div>
  <div class="sc-div"></div>
  <div class="sc-rows">
    <div class="sc-row"><span class="sc-key">Matches</span><span class="sc-val">50</span></div>
    <div class="sc-row"><span class="sc-key">Runs</span><span class="sc-val hi">4,200</span></div>
    <div class="sc-row"><span class="sc-key">Average</span><span class="sc-val">46.2</span></div>
    <div class="sc-row"><span class="sc-key">Hundreds</span><span class="sc-val">12</span></div>
    <div class="sc-row"><span class="sc-key">High Score</span><span class="sc-val">196</span></div>
  </div>
</div>
```

Set `data-format` to `test`, `odi`, or `t20`. Add class `hi` to `sc-val` for the headline number (turns gold).

---

### Update the news ticker

In `index.html`, find the `.ticker-track` div and edit the `.t-item` spans. The ticker text is duplicated (both halves must be identical) for the seamless CSS loop:

```html
<div class="ticker-track">
  <span class="t-item">🏏 Your latest news item here</span>
  <span class="t-dot">•</span>
  <span class="t-item">Another headline</span>
  <span class="t-dot">•</span>
  <!-- ... -->
  <!-- DUPLICATE all items below for seamless loop -->
  <span class="t-item">🏏 Your latest news item here</span>
  <span class="t-dot">•</span>
  <span class="t-item">Another headline</span>
  <span class="t-dot">•</span>
</div>
```

---

### Update your YouTube channel link

Search all 6 HTML files for `@FineLegTalk` and replace with your real channel handle. Also update the subscriber count displayed in the About section and stats sidebar.

---

## SEO Tips for Cricket Search Traffic

### 1. Name your files like search queries
Google treats the URL as a ranking signal. Use descriptive filenames:
```
india-vs-england-5th-test-2025-review.html     ✅
india-vs-australia-champions-trophy-final.html  ✅
post1.html                                       ❌
```

### 2. Update trending tags on the homepage
The tag strip in `index.html` is pure SEO. Update it to match what people are searching right now:
- Check Google Trends for "cricket" and look at related queries
- Include player names, tournament names, and specific match combinations
- Examples: "Bumrah wickets England", "IPL 2025 playoffs", "WTC Final 2025"

### 3. Write unique title tags for every page
Each page already has a unique `<title>`. When you create new blog post files, make the title match how people would search:
```html
<!-- Good — matches search intent -->
<title>Jasprit Bumrah vs England 2025: Every Wicket Analysed — Fine Leg Talk</title>

<!-- Bad — vague, won't rank -->
<title>Match Review Post — Fine Leg Talk</title>
```

### 4. Use descriptive meta descriptions
Write the `<meta name="description">` as if it's an ad — it appears in Google results. Include the main keyword naturally within the first sentence.

### 5. Target long-tail cricket keywords
Instead of competing for "Bumrah" (millions of results), target:
- "Bumrah bowling action breakdown"
- "why Bumrah is different from other fast bowlers"
- "Kohli technique against spin 2025"
- "India vs England 2025 best moments"

### 6. Update content regularly
Google favours fresh content. After every major match:
1. Add a match result to `matches.html`
2. Publish a blog post review
3. Update the ticker in `index.html`
4. Update trending tags

### 7. Cross-link between pages
Every blog post links back to related posts, the matches page, and the YouTube channel. This internal linking helps Google understand your site structure.

### 8. Share each post
After publishing: post the URL to Twitter/X with relevant cricket hashtags (#CricketTwitter #INDvsENG #IPL2025), share in cricket Reddit communities (r/Cricket, r/IndianCricketTeam), and put the link in your YouTube video description.

---

## Customisation Quick Reference

| What to change | Where to find it |
|---|---|
| Colour scheme | `:root` CSS variables at top of any HTML file |
| Channel YouTube URL | Search `@FineLegTalk` across all files |
| Subscriber count | Search `2.3K` across all files |
| Navbar links | `.nav-links` ul in every file |
| Homepage stats (video count, etc.) | `.hero-stats` section in `index.html` |
| About section text | `.about-strip` in `index.html` |
| Footer links | `footer` in any file |
| Trending tags | `.tags-strip` in `index.html` |
| Match results | `matches.html` — match card blocks |
| Player stats | `stats.html` — stat card blocks |

---

## Tech Stack

- **HTML5** — semantic elements (`<article>`, `<section>`, `<nav>`, `<aside>`, `<header>`, `<footer>`)
- **CSS3** — custom properties, Grid, Flexbox, `clamp()`, `IntersectionObserver` animations
- **Vanilla JavaScript** — no libraries, no frameworks, no CDN dependencies
- **Google Fonts** — Playfair Display, DM Sans, Lora (loaded via `<link>` in `<head>`)

All files work by opening `index.html` directly in any modern browser.

---

*Fine Leg Talk — Cricket. Analysed. Honestly.*
