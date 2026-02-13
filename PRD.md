# Anonymous Valentine's Day Message App

A heartfelt anonymous messaging platform where users can send Valentine's Day messages to their special someone without revealing their identity, creating a sense of mystery and romance.

**Experience Qualities**:
1. **Romantic** - Evokes feelings of love and warmth through visual design and intimate interactions
2. **Mysterious** - Emphasizes the anonymous nature with subtle cues and reassuring messaging
3. **Delightful** - Features playful animations and smooth transitions that feel like unwrapping a gift

**Complexity Level**: Light Application (multiple features with basic state)
This app has two distinct views (public submission form and admin panel) with basic state management for form inputs and message storage. The interaction patterns are straightforward but require thoughtful UX to build trust around anonymity.

## Essential Features

### Anonymous Message Submission
- **Functionality**: Allows users to submit a Valentine's message with recipient name and contact method (email or phone)
- **Purpose**: Core feature that enables the romantic gesture while maintaining complete anonymity
- **Trigger**: User lands on the homepage
- **Progression**: View animated hearts → Read anonymity promise → Enter recipient name → Enter message → Select contact method (email/phone) → Enter contact details → Submit → See confirmation
- **Success criteria**: Message is stored securely, user receives confirmation, no identifying sender information is captured

### Admin Panel Access
- **Functionality**: Secure view for app owner to see all submitted messages and fulfill them
- **Purpose**: Enables message delivery while maintaining sender anonymity from recipients
- **Trigger**: User navigates to /admin route or clicks hidden admin link
- **Progression**: Check ownership via spark.user() → Display message list with filters → View individual messages → Mark as fulfilled
- **Success criteria**: Only app owner can access, all messages are visible with recipient details, status tracking works

### Anonymity Assurance
- **Functionality**: Clear visual indicators and messaging throughout the flow that sender identity is never collected or stored
- **Purpose**: Build user trust and encourage authentic romantic expression
- **Trigger**: Visible throughout entire user journey
- **Progression**: Prominent badge/notice → Tooltip explanations → Confirmation screen reinforcement
- **Success criteria**: Users understand their identity is protected before and after submission

## Edge Case Handling

- **Empty form submission** - Validate all required fields before allowing submission
- **Invalid email format** - Real-time validation with helpful error messages
- **Invalid phone format** - Accept various phone number formats with clear formatting hints
- **Non-owner admin access** - Gracefully redirect to home or show "access denied" message
- **No messages in admin** - Show encouraging empty state with instructions
- **Network errors** - Display friendly error messages with retry options

## Design Direction

The design should feel like a luxurious Valentine's card come to life - romantic yet modern, with deep rich colors that evoke passion and warmth. The interface should feel intimate and trustworthy, with smooth animations that mimic the gentle flutter of receiving a love note. Every interaction should feel special and considered, balancing playfulness with sincerity.

## Color Selection

A rich, romantic palette inspired by Valentine's Day with deep passionate tones and soft, warm accents.

- **Primary Color**: Deep passionate rose (oklch(0.45 0.18 15)) - Represents romance and love, used for primary actions and key UI elements
- **Secondary Colors**: 
  - Soft blush pink (oklch(0.88 0.08 15)) - Creates gentle, romantic backgrounds
  - Rich burgundy (oklch(0.35 0.15 20)) - Adds depth and sophistication to cards and accents
- **Accent Color**: Warm coral (oklch(0.72 0.16 35)) - Eye-catching highlight for CTAs and important interactive elements
- **Foreground/Background Pairings**:
  - Primary (Deep Rose oklch(0.45 0.18 15)): White text (oklch(1 0 0)) - Ratio 7.2:1 ✓
  - Accent (Warm Coral oklch(0.72 0.16 35)): White text (oklch(1 0 0)) - Ratio 4.9:1 ✓
  - Background (Soft Blush oklch(0.95 0.02 15)): Dark text (oklch(0.25 0.02 15)) - Ratio 12.8:1 ✓
  - Secondary (Rich Burgundy oklch(0.35 0.15 20)): White text (oklch(1 0 0)) - Ratio 9.1:1 ✓

## Font Selection

Typography should feel elegant and romantic while maintaining excellent readability - a sophisticated serif for headlines that evokes handwritten love letters, paired with a clean geometric sans-serif for body text that ensures clarity.

- **Typographic Hierarchy**:
  - H1 (Main Title): Playfair Display Bold/48px/tight leading (-0.02em letter spacing) - Elegant and romantic
  - H2 (Section Headers): Playfair Display SemiBold/32px/tight leading
  - H3 (Card Titles): Playfair Display SemiBold/24px/normal leading
  - Body (Forms/Content): Inter Regular/16px/relaxed leading (1.6) - Clean and readable
  - Labels: Inter Medium/14px/normal leading
  - Small (Helper Text): Inter Regular/13px/relaxed leading
  - Button Text: Inter SemiBold/15px/normal leading

## Animations

Animations should feel soft and organic, like the gentle movement of flower petals or floating hearts - enhancing the romantic atmosphere without overwhelming. Key moments: floating heart particles in the background (continuous subtle animation), form fields that gently expand on focus with a soft glow, submit button that pulses subtly to invite interaction, success confirmation that blooms onto screen with a spring animation, and smooth page transitions that fade and scale elements gracefully.

## Component Selection

- **Components**:
  - Card (for message form and admin message items) - Custom gradient backgrounds with soft shadows
  - Input & Textarea (for form fields) - Enhanced with focus glow effects and romantic styling
  - Button (primary actions) - Custom styling with pulse animation on hover
  - Badge (anonymity indicator) - Prominent display with lock icon
  - Tabs (admin panel filtering) - Styled to match romantic theme
  - Dialog (confirmation modals) - Smooth spring animations
  - Scroll Area (admin message list) - Subtle custom scrollbar
  - Label (form labels) - Paired with helper text
  - Radio Group (email vs phone selection) - Custom styled with heart icons
  
- **Customizations**:
  - Floating hearts animation (custom SVG particles using framer-motion)
  - Gradient card backgrounds (custom CSS with romantic color blends)
  - Glowing input focus states (custom box-shadow animations)
  - Custom badge design with shield/lock iconography
  
- **States**:
  - Buttons: Default (subtle shadow), Hover (glow + scale 1.02), Active (scale 0.98), Disabled (50% opacity with grayscale)
  - Inputs: Default (soft border), Focus (glowing border + shadow + slight scale), Error (red border pulse), Success (green border)
  - Form: Empty, Filling, Validating, Submitting, Success, Error
  
- **Icon Selection**:
  - Heart (main theme icon)
  - Lock/ShieldCheck (anonymity assurance)
  - PaperPlane (send message)
  - EnvelopeSimple (email option)
  - Phone (phone option)
  - Eye (view in admin)
  - CheckCircle (fulfilled messages)
  - X (close dialogs)
  
- **Spacing**: 
  - Tight: 2px/4px for inline elements
  - Normal: 8px/12px for related form fields
  - Comfortable: 16px/24px for section spacing
  - Generous: 32px/48px for major section breaks
  - Extra: 64px for page-level spacing
  
- **Mobile**:
  - Stack form fields vertically with increased touch targets (min 44px)
  - Reduce heading sizes (H1 to 36px)
  - Simplify floating hearts animation (fewer particles)
  - Full-width cards with reduced padding (16px vs 32px)
  - Bottom-sheet style confirmation dialogs
  - Admin panel uses vertical tabs instead of horizontal
  - Increased spacing between admin message cards for easier tapping
