# TabooTalks - Adult Dating & Chat Platform

<img width="157" height="27" alt="shot" src="https://github.com/user-attachments/assets/125cd475-c6a1-438f-b6ab-4ff2b9d0cbb0" />


## 🎯 Project Overview

**TabooTalks** is a modern, credit-based adult dating and chatting platform. The platform connects users through meaningful conversations with AI-powered female profiles in a secure, engaging environment. Built with cutting-edge technologies, TabooTalks offers a seamless experience across all devices with an emphasis on smooth animations, responsive design, and intuitive interactions.

### 🌟 Platform Concept

TabooTalks is a premium chat platform where users can:
- Discover and connect with 250 diverse female profiles (AI-powered bots)
- Engage in meaningful conversations through a credit-based messaging system
- Swipe through profiles Tinder-style to find interesting connections
- Browse nearby profiles within a 50km radius
- Exchange messages and optionally share pictures
- Experience a premium, adult-oriented conversational environment

**Note:** All female profiles are AI-powered chat bots designed to provide engaging, flirty, and meaningful conversations. This is transparently an entertainment platform, not a traditional dating service.

---

## 🎨 Brand Identity

### Color Palette
- **Primary Color:** `#ff2e2e` (Vibrant Red)
- **Secondary Color:** `#5e17eb` (Electric Purple)
- **Supporting Colors:**
  - Dark backgrounds: `#0a0a0a`, `#1a1a1a`
  - Text: `#ffffff`, `#e5e5e5`, `#9ca3af`
  - Success: `#10b981`
  - Warning: `#f59e0b`

### Design Philosophy
- Modern, sleek, and seductive aesthetic
- Smooth animations and micro-interactions
- Mobile-first responsive design
- Bottom tab navigation for easy mobile access
- Clean typography with excellent readability
- Strategic use of gradients and shadows for depth

---

## 💰 Credit System & Monetization

### Initial Credits
- Every new user receives **10 FREE credits** upon sign-up
- Welcome popup highlights this offer immediately after registration

### Pricing Packages

| Package | Price | Credits | Messages | Badge |
|---------|-------|---------|----------|-------|
| Starter | €9.99 | 30 | 30 messages | - |
| Popular | €19.99 | 100 | 100 messages | 🥇 **Best Value** |
| Premium | €39.99 | 350 | 350 messages | - |

### Credit Costs
- **Standard Message:** 1 credit per message
- **Sending Photos:** 15 credits per photo
- **Receiving Explicit Photos:** 25 credits (optional, on request)

### Payment
- **Payment Gateway:** Credit card only (Stripe integration planned)
- Simple, secure checkout flow
- Instant credit delivery

---

## 🚀 Tech Stack

### Frontend (Week 1 Focus)
- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript (TSX)
- **Styling:** 
  - Tailwind CSS (utility-first styling)
  - SASS/SCSS (complex animations & custom styles)
- **Icons:** Lucide React
- **State Management:** Zustand (lightweight, simple)
- **Animations:**
  - Framer Motion (page transitions, swipe animations)
  - SASS for keyframe animations
  - CSS transitions for micro-interactions

### Backend (Week 2+)
- **API Framework:** Next.js API Routes / tRPC
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js / Clerk
- **Payment Processing:** Stripe
- **AI Chat Integration:** OpenAI API / Custom GPT models
- **Image Storage:** AWS S3 / Cloudinary
- **Language Support:** i18next (English, German initially)

### Development Tools
- **Package Manager:** pnpm
- **Linting:** ESLint + Prettier
- **Git Hooks:** Husky + lint-staged
- **Type Checking:** TypeScript strict mode

---

## 📁 Project Structure

```
tabootalks/
├── public/
│   ├── assets/
│   │   ├── logo.png
│   │   ├── profiles/          # Female profile pictures
│   │   └── icons/
│   └── locales/               # Translation files
│       ├── en/
│       └── de/
│
├── app/                       # Next.js App Router (NO src folder)
│   ├── (auth)/               # Auth group
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   │
│   ├── main/               # Main app group
│   │   ├── page.tsx          # Home/Newsfeed page
│   │   ├── swipe/
│   │   │   └── page.tsx
│   │   ├── nearby/
│   │   │   └── page.tsx
│   │   ├── chats/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── profile/[id]/
│   │   │   └── page.tsx
│   │   ├── credits/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   │
│   ├── layout.tsx            # Root layout
│   ├── globals.css
│   ├── providers.tsx
│   └── page.tsx              # Landing page
│
├── components/
│   ├── ui/                   # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   └── Avatar.tsx
│   │
│   ├── layout/
│   │   ├── Navigation.tsx        # Smart navigation component
│   │   ├── DesktopNav.tsx       # Top navigation for desktop
│   │   ├── MobileBottomNav.tsx  # Bottom navigation for mobile
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── LayoutController.tsx # Detects screen size & renders appropriate nav
│   │
│   ├── features/
│   │   ├── newsfeed/
│   │   │   ├── PostCard.tsx
│   │   │   ├── PostActions.tsx
│   │   │   └── FeedList.tsx
│   │   ├── swipe/
│   │   │   ├── SwipeCard.tsx
│   │   │   ├── SwipeContainer.tsx
│   │   │   └── LikeAnimation.tsx
│   │   ├── chat/
│   │   │   ├── ChatBubble.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   ├── ChatList.tsx
│   │   │   └── TypingIndicator.tsx
│   │   ├── profile/
│   │   │   ├── ProfileCard.tsx
│   │   │   ├── ProfileGallery.tsx
│   │   │   └── ProfileStats.tsx
│   │   └── credits/
│   │       ├── CreditPackage.tsx
│   │       ├── CreditBalance.tsx
│   │       └── PurchaseModal.tsx
│   │
│   └── common/
│       ├── LoadingSpinner.tsx
│       ├── ErrorBoundary.tsx
│       └── ProtectedRoute.tsx
│
├── lib/
│   ├── utils/
│   │   ├── cn.ts             # Tailwind merge utility
│   │   ├── date.ts
│   │   └── format.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useCredits.ts
│   │   ├── useChat.ts
│   │   ├── useSwipe.ts
│   │   └── useMediaQuery.ts  # For responsive navigation
│   ├── api/                  # API client functions
│   │   ├── auth.ts
│   │   ├── profiles.ts
│   │   ├── messages.ts
│   │   └── credits.ts
│   └── constants/
│       ├── routes.ts
│       └── config.ts
│
├── store/                    # Zustand stores
│   ├── authStore.ts
│   ├── chatStore.ts
│   ├── creditStore.ts
│   └── profileStore.ts
│
├── types/
│   ├── user.ts
│   ├── profile.ts
│   ├── message.ts
│   ├── post.ts
│   └── credit.ts
│
├── data/
│   ├── profiles.json         # Mock profile data (250 profiles)
│   └── posts.json            # Mock newsfeed posts
│
├── styles/
│   ├── animations.scss       # SASS animations
│   └── variables.scss
│
├── .env.local
├── .env.example
├── .eslintrc.json
├── .prettierrc
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 📱 Core Features & Pages

### 0. **Responsive Navigation System**
The app uses a **smart navigation component** that adapts based on screen size:

**Desktop (≥1024px):**
- **Top horizontal navigation bar**
- Navigation items: Newsfeed | Chats | Mail | Search | People | Credits
- Account dropdown in top-right
- Fixed header that stays at top
- Clean, spacious layout with icons + labels

**Mobile (<1024px):**
- **Bottom tab navigation**
- 5 main tabs with icons:
  - **Newsfeed** 📰 (Home icon)
  - **Chats** 💬 (Message bubble icon with unread badge)
  - **Mail** ✉️ (Envelope icon)
  - **Search** 🔍 (Magnifying glass icon)
  - **People** 👥 (People icon)
- Credits accessible via top-right badge or menu
- Thumb-friendly navigation at bottom
- Smooth transitions between tabs

**Implementation:**
- `LayoutController.tsx` - Detects screen size using `useMediaQuery` hook
- Renders `DesktopNav.tsx` or `MobileBottomNav.tsx` accordingly
- Single source of truth for navigation items
- Smooth transitions when resizing
- Persistent across all pages within (main) layout

### 1. **Landing Page** (`/`)
- Hero section with compelling CTA
- Feature highlights (secure, fun, diverse profiles)
- Pricing packages preview
- Testimonials section
- Sign-up prompt with "10 Free Credits" highlight
- Responsive design with smooth scroll animations

### 2. **Authentication**
- **Sign Up** (`/signup`)
  - Email/password registration
  - Google OAuth option
  - Age verification (18+)
  - Terms & Privacy acceptance
  - Welcome popup with credit bonus notification
- **Login** (`/login`)
  - Email/password
  - Social login options
  - "Forgot password" flow

### 3. **Newsfeed Page** (`/` or `/newsfeed` after login)
- **Instagram/Facebook-style feed**
  - Posts from followed profiles
  - Large profile photos in posts
  - Post captions/descriptions
  - Like counts and interactions
  - "Follow" button on each post
  - Filter tabs: "All posts" | "Following"
- **Post interactions:**
  - Like button (👍 with count)
  - "View profile" button (purple CTA)
  - Follow/Unfollow star icon
  - Three-dot menu (options)
- Infinite scroll with lazy loading
- Pull-to-refresh on mobile

### 4. **Swipe Page** (`/swipe`)
- **Tinder-style card interface**
  - Large profile photo
  - Name, age, location
  - Brief bio/interests
  - Swipe gestures:
    - Swipe right / Tap ❤️ = Like (triggers animation)
    - Swipe left / Tap ✖️ = Pass
- **Like animation:**
  - Burst effect with hearts
  - Haptic feedback (mobile)
  - Smooth card exit transition
- Stack of 5-10 profiles loaded at once
- Infinite scroll with lazy loading

### 5. **Nearby Page** (`/nearby`)
- List view of profiles within 50km radius
- Each item shows:
  - Profile picture
  - Name, age
  - Distance from user
  - "Online" indicator (simulated)
- Pagination (20 profiles per page)
- Randomized order on each visit
- Click to view full profile
- "Like" button on each card

### 6. **Chat Page** (`/chats`)
- **Chat List View:**
  - All active conversations
  - Last message preview
  - Timestamp
  - Unread message badge (red notification bubble)
  - Profile picture thumbnail
- **Individual Chat View:**
  - Full-screen chat interface
  - Message bubbles (user vs. bot)
  - Timestamp on messages
  - Typing indicator animation
  - Photo sharing option (15 credits)
  - Request explicit photo option (25 credits)
  - Credit balance display at top
  - "Low credits" warning when < 5 credits

### 7. **Mail Page** (`/mail`)
- Inbox for special messages
- Notifications from profiles
- System messages
- Similar to email interface

### 8. **Search Page** (`/search`)
- Search for profiles by:
  - Name
  - Age range
  - Interests
  - Location
- Filter and sort options
- Grid or list view toggle

### 9. **People Page** (`/people`)
- Discover new profiles
- Browse all available profiles
- Quick filter options
- Random suggestions

### 10. **Profile Page** (`/profile/[id]`)
- **Full profile view:**
  - Image gallery (swipeable)
  - Name, age, location
  - Bio / About section
  - Interests tags
  - "Like" button
  - "Start Chat" button (if liked)
  - "Follow" button
- **Two contexts:**
  - From swipe: Simplified view
  - From nearby/chat: Full detailed view

### 11. **Credits Page** (`/credits`)
- Current credit balance (prominent display)
- Three pricing packages with:
  - Price in €
  - Number of credits
  - "Best Value" badge on €19.99 package
  - "Buy Now" CTA
- Payment modal:
  - Credit card form (Stripe)
  - Secure checkout
  - Order summary
- Transaction history (future)

### 12. **User Settings** (`/settings`)
- Profile editing
- Password change
- Language toggle (EN/DE)
- Notification preferences
- Delete account option

---

## 🎨 Design Requirements

### Responsive Breakpoints
- **Mobile:** 320px - 1023px (Bottom navigation)
- **Desktop:** 1024px+ (Top navigation)

### Navigation Behavior
**Desktop Navigation (Top Bar):**
- Fixed horizontal bar at top
- Items: Newsfeed | Chats (with badge) | Mail | Search | People | Credits
- Account menu in top-right corner
- Icons with labels side-by-side
- Always visible, never hides

**Mobile Navigation (Bottom Tabs):**
- Fixed bottom tab bar (iOS/Android style)
- 5 core tabs:
  - **Newsfeed** - Home/Feed icon
  - **Chats** - Message icon (shows unread count badge)
  - **Mail** - Envelope icon  
  - **Search** - Magnifying glass icon
  - **People** - Multiple people icon
- Safe area padding for iPhone notch
- Active state highlighting (purple glow)
- Smooth transitions between tabs
- Credits accessible via top-right corner badge

### Animations
- **Page transitions:** Slide in/out, fade
- **Swipe cards:** 
  - Drag physics
  - Rotation based on drag direction
  - Like/Pass overlay on drag
  - Exit animation (fly off screen)
- **Like animation:**
  - Heart burst effect
  - Confetti particles (optional)
  - Scale & fade
- **Typing indicator:** Bouncing dots
- **Loading states:** Skeleton screens
- **Button interactions:** Scale, glow on hover
- **Modal enter/exit:** Scale + fade
- **Toast notifications:** Slide in from top

### Micro-interactions
- Button press effects
- Input focus states
- Hover states on cards
- Pull-to-refresh on mobile
- Smooth scrolling
- Haptic feedback (mobile)

---

## 🌐 Internationalization (i18n)

### Supported Languages
- **English (EN)** - Default
- **German (DE)** - Secondary

### Implementation
- i18next for translations
- Locale detection based on browser/user preference
- Language switcher in settings
- All UI text translatable
- Date/time formatting per locale
- Currency formatting (EUR)

---

## 🔐 Security & Privacy

- HTTPS everywhere
- Password hashing (bcrypt)
- JWT tokens for session management
- CSRF protection
- Rate limiting on API endpoints
- Input sanitization
- XSS protection
- Secure payment processing (PCI compliant)
- GDPR compliant
- Clear privacy policy
- Age verification (18+)

---

## 📊 Week 1 Deliverables (Frontend Only)

### ✅ Setup & Configuration
- [x] Initialize Next.js project with TypeScript
- [x] Configure Tailwind CSS + SASS
- [x] Set up project structure
- [x] Install dependencies (Lucide, Zustand, Framer Motion)
- [x] Set up ESLint + Prettier
- [x] Create base layout components

### ✅ Pages to Build
1. **Landing Page**
   - Hero with CTA
   - Features section
   - Pricing preview
   - Footer
2. **Auth Pages**
   - Sign up form
   - Login form
   - Welcome popup (10 credits)
3. **Swipe Page**
   - Card stack component
   - Swipe gestures
   - Like animation
4. **Nearby Page**
   - List view with pagination
   - Profile cards
5. **Chat Page**
   - Chat list
   - Chat interface with bubbles
   - Message input
6. **Profile Page**
   - Full profile view
   - Image gallery
7. **Credits Page**
   - Balance display
   - Pricing packages
   - Mock payment modal

### ✅ Components to Build
- Button (primary, secondary, outline variants)
- Input (text, email, password)
- Card
- Modal
- Header
- Footer
- Bottom Navigation
- Profile Card
- Swipe Card
- Chat Bubble
- Loading Spinner
- Toast Notifications

### ✅ Styling & Animations
- Global styles
- Color variables
- Typography system
- Responsive utilities
- Swipe animations
- Like burst animation
- Page transitions
- Hover effects

### ✅ Mock Data
- 250 female profiles (JSON)
  - Name, age, location
  - Profile pictures (from assets)
  - Bio, interests
- Sample chat conversations
- User data structure

---

## 🚧 Future Phases (Post Week 1)

### Week 2: Backend Integration
- Set up PostgreSQL + Prisma
- Implement authentication API
- Create profile API endpoints
- Build messaging system
- Integrate payment gateway (Stripe)

### Week 3: AI Chat Integration
- Connect OpenAI API / Custom GPT
- Train models on conversational data
- Implement chat response logic
- Add personality profiles for each bot
- Handle photo requests

### Week 4: Testing & Deployment
- Unit tests (Jest)
- E2E tests (Playwright)
- Performance optimization
- SEO optimization
- Deploy to Vercel
- Set up monitoring (Sentry)

---

## 🎯 Success Metrics

### User Engagement
- Average session duration
- Messages sent per user
- Swipe-to-like ratio
- Return visitor rate

### Monetization
- Credit purchase conversion rate
- Average revenue per user (ARPU)
- Most popular pricing package
- Photo purchase rate

### Technical
- Page load time < 2s
- Lighthouse score > 90
- Mobile responsiveness 100%
- Zero critical bugs

---

## 📝 Development Guidelines

### Code Style
- Use TypeScript strict mode
- Follow Airbnb style guide
- Meaningful component/variable names
- Add JSDoc comments for complex functions
- Keep components under 300 lines
- Use composition over prop drilling

### Git Workflow
- Feature branches from `develop`
- Commit messages: `feat:`, `fix:`, `style:`, `refactor:`
- PR required before merge
- Code review mandatory

### Performance
- Use Next.js Image component for all images
- Implement lazy loading
- Minimize bundle size
- Use dynamic imports for large components
- Optimize animations (use transform, opacity)

### Accessibility
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Screen reader friendly
- Color contrast ratios WCAG AA

---

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Zustand Guide](https://docs.pmnd.rs/zustand)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 📞 Contact & Support

**Developer:** [Your Name]  
**Client:** [Client Name]  
**Project Timeline:** Week 1 - Frontend Completion  
**Budget:** [Budget Amount]

---

## ⚠️ Important Notes

1. **Content Disclaimer:** All female profiles are AI-powered. The platform is designed for entertainment and engaging conversations, not real dating.

2. **Legal Compliance:**
   - Age verification mandatory (18+)
   - Clear terms of service
   - Privacy policy compliant with GDPR
   - Transparent about AI bot usage

3. **Ethical Considerations:**
   - No deceptive practices about bot nature
   - Clear credit pricing
   - Secure payment processing
   - User data protection

4. **Brand Inspiration:**
   - Inspired by WingTalks functionality
   - Unique branding and identity
   - Original design language
   - Custom features

---

## 🚀 Getting Started (Development)

```bash
# Clone repository
git clone [repo-url]
cd tabootalks

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Run development server
pnpm dev

# Open browser
http://localhost:3000
```

---

## 📄 License

Proprietary - All rights reserved © 2024 TabooTalks

---

**Built with ❤️ and 🔥 by [Your Name]**

*Making meaningful connections, one chat at a time.*
