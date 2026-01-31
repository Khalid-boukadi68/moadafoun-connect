
# UNSAID - Complete Rebranding and Modernization Plan

## Overview
Transform the current "موظفون" (Moroccan employee forum) into "UNSAID" - a modern, anonymous social media platform where users can share thoughts freely without revealing their identity.

## Design Analysis (from uploaded logo)
The UNSAID logo reveals:
- **Dark Slate/Navy background** (`#2B3441`)
- **Orange/Coral gradient** for the chat bubbles (`#E8854C` to `#F5A567`)
- **Modern, minimal aesthetic** with floating bubbles suggesting anonymous conversation
- **LTR English-focused** design

---

## Phase 1: Critical Bug Fixes

### 1.1 Fix Corrupted Onboarding.tsx
- The `src/pages/Onboarding.tsx` file has invalid characters causing build errors
- Rewrite with proper formatting as a placeholder or remove if not needed

### 1.2 Fix Login.tsx
- Current Login.tsx uses an external `react-responsive` package that isn't installed
- Rewrite to use proper Supabase authentication matching the Register.tsx pattern

---

## Phase 2: Branding Updates

### 2.1 Copy New Logo
- Copy `user-uploads://file_0000000042a4720aae638af7de0f9ecb.png` to `src/assets/unsaid-logo.png`

### 2.2 Update App Name Everywhere
| Location | From | To |
|----------|------|-----|
| `index.html` | موظفون - منصة الموظفين المغاربة | UNSAID - Speak Freely |
| All Arabic text references | موظفون | UNSAID |

---

## Phase 3: Design System Overhaul

### 3.1 New Color Palette (from logo)
```text
Light Mode:
- Background: #F8F9FA (light gray)
- Primary: #E8854C (orange/coral from logo)
- Secondary: #2B3441 (dark slate from logo)
- Card: #FFFFFF
- Accent: #F5A567 (lighter orange)

Dark Mode:
- Background: #1A1F26 (very dark slate)
- Primary: #F5A567 (lighter orange)
- Secondary: #2B3441
- Card: #242B35
- Foreground: #F8F9FA
```

### 3.2 Typography
- Keep Inter font for clean, modern look
- Remove Arabic-specific Noto Sans Arabic (can keep as fallback)

### 3.3 Layout Direction
- Change from RTL to LTR (English-focused app)
- Remove `dir="rtl"` from all components

---

## Phase 4: Content Localization (Arabic to English)

### 4.1 All UI Text Updates
**Header:**
- الرئيسية → Home
- المنشورات → Feed
- الملف الشخصي → Profile
- تسجيل الخروج → Sign Out
- الوضع الداكن/الفاتح → Dark/Light Mode

**Authentication:**
- تسجيل الدخول → Sign In
- إنشاء حساب جديد → Create Account
- البريد الإلكتروني → Email
- كلمة المرور → Password
- الاسم المستعار → Username/Alias

**Feed/Posts:**
- نشر → Post
- تعليق → Comment
- نشر مجهول → Post Anonymously
- إبلاغ → Report

### 4.2 Constants Update
- Remove MOROCCAN_CITIES
- Update SECTORS to more universal topics:
  - 💭 Thoughts, 💼 Work, 💕 Relationships, 🎭 Confessions, 🔮 Dreams, 📢 Opinions, 🤔 Questions, 📝 Other

---

## Phase 5: Feature Emphasis on Anonymity

### 5.1 Homepage Redesign
- Hero: "Share what's on your mind. Stay anonymous."
- Feature cards emphasizing:
  - 🎭 Complete Anonymity
  - 💬 Free Expression
  - 🔒 Privacy First
  - 👥 Community Support

### 5.2 Default Anonymous Posting
- Make anonymous posting the DEFAULT (toggle on by default)
- Emphasize that usernames are optional aliases

---

## Phase 6: Component Updates

### Files to Modify:
| File | Changes |
|------|---------|
| `index.html` | Title, meta tags, remove RTL |
| `src/index.css` | New UNSAID color palette |
| `tailwind.config.ts` | Updated colors and gradients |
| `src/lib/constants.ts` | New topics instead of Moroccan sectors |
| `src/pages/Index.tsx` | Complete redesign with UNSAID branding |
| `src/pages/Login.tsx` | Rewrite with proper auth + English |
| `src/pages/Register.tsx` | Update to English, modern design |
| `src/pages/Feed.tsx` | English UI, topic filters |
| `src/pages/Profile.tsx` | English UI, simplified fields |
| `src/pages/Admin.tsx` | English UI |
| `src/pages/Onboarding.tsx` | Fix or remove |
| `src/components/layout/Header.tsx` | English nav, new logo |
| `src/components/layout/Layout.tsx` | Remove RTL |
| `src/components/posts/PostCard.tsx` | Rewrite with proper TypeScript + English |
| `src/components/posts/CommentsSection.tsx` | English UI |
| `src/components/posts/CreatePostForm.tsx` | Topics instead of sectors, English |
| `src/components/posts/SectorFilter.tsx` | Rename to TopicFilter, English |
| `src/hooks/useAuth.tsx` | English toast messages |

---

## Technical Details

### Database Considerations
- The existing `job_sector` enum is used throughout
- We can add new topic values or create a migration to rename
- For MVP: keep database structure, just update UI labels

### Gradient Updates
```css
.bg-gradient-unsaid {
  background: linear-gradient(135deg, #E8854C 0%, #F5A567 100%);
}
```

### Animation Additions
- Subtle floating effect for chat bubbles in hero
- Smooth transitions for anonymous toggle

---

## Summary of Deliverables
1. Fix build errors (Onboarding.tsx, Login.tsx)
2. Copy new UNSAID logo
3. Complete color system redesign
4. All text translated to English
5. RTL → LTR conversion
6. Anonymous-first user experience
7. Modern, clean UI matching the logo aesthetic
