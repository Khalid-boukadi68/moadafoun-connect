

# Complete UI Redesign - Modern Social Media App Style

## Problem Analysis
The current UI looks like a basic website, not a mobile-first social media app like Facebook or Instagram. Based on the reference image provided, we need to implement:

1. **Bottom Navigation Bar** - Fixed at bottom with icons (Stories, Sectors, Pulse, About)
2. **Modern App-like Header** - Slim header with hamburger menu, logo, and action icons
3. **Card-based Scrolling Feed** - Posts with images, reactions (Agree/Neutral/Disagree)
4. **Sectors/Categories Page** - List view with icons and descriptions
5. **Pulse Feature** - Polling/voting system for collective anonymous opinions
6. **Dark Navy Color Scheme** - Matching the UNSAID branding

---

## New App Structure

```text
┌─────────────────────────────┐
│  ☰   UNSAID          🔔 🔍 │  ← Slim Header
├─────────────────────────────┤
│                             │
│    [Scrollable Content]     │
│                             │
│    • Stories/Feed           │
│    • Post Cards             │
│    • Sector List            │
│    • Polls                  │
│                             │
├─────────────────────────────┤
│ 🏠    📊    📈    ℹ️       │  ← Bottom Nav
│Stories Sectors Pulse About  │
└─────────────────────────────┘
```

---

## Phase 1: Core Layout Components

### 1.1 Create Mobile App Shell (`src/components/layout/AppShell.tsx`)
- Mobile-first container with proper safe areas
- Handles the overall app structure
- Different from current Layout.tsx

### 1.2 Create Bottom Navigation (`src/components/layout/BottomNav.tsx`)
- Fixed bottom navigation bar
- 4 tabs: Stories, Sectors, Pulse, About
- Active state indicators with orange accent
- Icons matching reference design

### 1.3 Create App Header (`src/components/layout/AppHeader.tsx`)
- Slim header with dark navy background
- Hamburger menu (left)
- UNSAID logo (center)
- Notification and search icons (right)
- Slide-out drawer menu

---

## Phase 2: New Page Structure

### 2.1 Stories Page (Main Feed) - `/stories` or `/feed`
- Vertical scrolling feed
- Post cards with images
- "Add Story" button at top
- Infinite scroll

### 2.2 Sectors Page - `/sectors`
- List of category cards
- Each with icon, title, description
- Navigate to filtered posts
- Categories: Tech, Healthcare, Education, Finance, Legal, etc.

### 2.3 Pulse Page - `/pulse`
- Anonymous polls/voting
- "Sector Pulse" cards with voting options
- Progress bars showing percentages
- Collective sentiment display

### 2.4 About Page - `/about`
- App information
- Privacy policy
- Community guidelines

---

## Phase 3: Redesigned Post Card

### New Post Card Features (matching reference):
- Image at top (if present)
- Sector badge
- Post content
- 3-option reactions: Agree ✓ | Neutral ○ | Disagree ✗
- Percentage display for each reaction
- More options menu (...)
- Clean, rounded corners

### New Reaction System:
Change from Like/Dislike to:
- **Agree** (green checkmark)
- **Neutral** (gray circle)
- **Disagree** (red X)

---

## Phase 4: Color System Update

### Updated CSS Variables:
```css
/* Dark Navy Theme */
--background: 222 47% 16%;        /* #1A2234 */
--card: 222 40% 22%;              /* #252F43 */
--primary: 25 85% 60%;            /* #E8854C - Orange */
--secondary: 222 30% 30%;         /* Dark slate */
--foreground: 0 0% 98%;           /* White text */

/* Reactions */
--agree: 145 60% 45%;             /* Green */
--neutral: 220 15% 60%;           /* Gray */
--disagree: 0 70% 55%;            /* Red */
```

---

## Phase 5: File Changes Summary

### New Files to Create:
| File | Purpose |
|------|---------|
| `src/components/layout/AppShell.tsx` | Mobile app container |
| `src/components/layout/BottomNav.tsx` | Bottom navigation |
| `src/components/layout/AppHeader.tsx` | Slim app header |
| `src/components/layout/SideDrawer.tsx` | Slide-out menu |
| `src/pages/Stories.tsx` | Main feed (rename from Feed) |
| `src/pages/Sectors.tsx` | Category list page |
| `src/pages/Pulse.tsx` | Polls/voting page |
| `src/pages/About.tsx` | About/info page |
| `src/components/posts/StoryCard.tsx` | New post card design |
| `src/components/posts/PollCard.tsx` | Voting/poll component |
| `src/components/sectors/SectorCard.tsx` | Sector list item |

### Files to Modify:
| File | Changes |
|------|---------|
| `src/index.css` | New dark navy color system |
| `src/App.tsx` | New routes structure |
| `src/lib/constants.ts` | Add sector icons/colors |
| `tailwind.config.ts` | New color tokens |

### Files to Remove/Replace:
- `src/components/layout/Header.tsx` → Replace with AppHeader
- `src/components/layout/Layout.tsx` → Replace with AppShell
- `src/pages/Index.tsx` → Simplify or redirect to /stories
- `src/pages/Feed.tsx` → Rename to Stories.tsx

---

## Phase 6: Routing Updates

```typescript
// New route structure
<Routes>
  <Route path="/" element={<AppShell />}>
    <Route index element={<Navigate to="/stories" />} />
    <Route path="stories" element={<Stories />} />
    <Route path="sectors" element={<Sectors />} />
    <Route path="sectors/:sector" element={<SectorFeed />} />
    <Route path="pulse" element={<Pulse />} />
    <Route path="about" element={<About />} />
    <Route path="profile" element={<Profile />} />
  </Route>
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
</Routes>
```

---

## Phase 7: Database Considerations

### New reaction_type values:
Current: `like`, `dislike`
New: `agree`, `neutral`, `disagree`

A migration may be needed to add the `neutral` option, or we can handle it at the application level.

---

## Visual Reference Implementation

### Bottom Navigation Example:
```tsx
<nav className="fixed bottom-0 inset-x-0 bg-card border-t">
  <div className="flex justify-around py-2">
    <NavItem icon={Home} label="Stories" to="/stories" />
    <NavItem icon={Grid} label="Sectors" to="/sectors" />
    <NavItem icon={TrendingUp} label="Pulse" to="/pulse" />
    <NavItem icon={Info} label="About" to="/about" />
  </div>
</nav>
```

### Story Card Example:
```tsx
<Card className="rounded-2xl overflow-hidden">
  {post.image && <img src={post.image} className="w-full h-48 object-cover" />}
  <CardContent className="p-4">
    <Badge>{sector}</Badge>
    <p className="mt-2">{post.content}</p>
    <div className="flex justify-between mt-4">
      <ReactionButton type="agree" count={52} label="Agree" />
      <ReactionButton type="neutral" count={18} label="Neutral" />
      <ReactionButton type="disagree" count={30} label="Disagree" />
    </div>
  </CardContent>
</Card>
```

---

## Implementation Priority

1. **Core Layout** - AppShell, BottomNav, AppHeader (essential structure)
2. **Color System** - Update to dark navy theme
3. **Stories Page** - Redesigned feed with new post cards
4. **Sectors Page** - Category list with navigation
5. **Pulse Page** - Polling/voting feature
6. **About Page** - Static information
7. **Polish** - Animations, transitions, refinements

---

## Technical Notes

- Uses existing Supabase backend (no database changes needed initially)
- Reaction types can be handled with existing `like`/`dislike` + new frontend logic
- Mobile-first approach with responsive breakpoints for tablet/desktop
- Uses existing shadcn/ui components where possible
- Maintains authentication flow but with updated UI

