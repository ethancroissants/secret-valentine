# Anonymous Message App

A clean, minimal platform for sending anonymous messages to recipients via email or phone, with a secure admin panel for message fulfillment.

**Experience Qualities**:
1. **Simple** - Clean interface with no unnecessary decoration or flourish
2. **Direct** - Straightforward messaging and clear purpose without embellishment
3. **Trustworthy** - Professional design that clearly communicates anonymity through security indicators

**Complexity Level**: Light Application (multiple features with basic state)
This app has two distinct views (public submission form and admin panel) with basic state management for form inputs and message storage. The interaction patterns are straightforward and functional.

## Essential Features

### Anonymous Message Submission
- **Functionality**: Allows users to submit an anonymous message with recipient name and contact method (email or phone)
- **Purpose**: Core feature that enables anonymous messaging while maintaining complete privacy
- **Trigger**: User lands on the homepage
- **Progression**: Read form → Enter recipient name → Enter message → Select contact method (email/phone) → Enter contact details → Submit → See confirmation
- **Success criteria**: Message is stored securely, user receives confirmation, no identifying sender information is captured

### Admin Panel Access
- **Functionality**: Secure view for app owner to see all submitted messages and fulfill them
- **Purpose**: Enables message delivery while maintaining sender anonymity from recipients
- **Trigger**: User clicks admin link
- **Progression**: Check ownership via spark.user() → Display message list with filters → View individual messages → Mark as fulfilled
- **Success criteria**: Only app owner can access, all messages are visible with recipient details, status tracking works

### Anonymity Assurance
- **Functionality**: Clear messaging that sender identity is never collected or stored
- **Purpose**: Build user trust and encourage honest communication
- **Trigger**: Visible in form
- **Progression**: Simple notice with icon → Brief explanation
- **Success criteria**: Users understand their identity is protected

## Edge Case Handling

- **Empty form submission** - Validate all required fields before allowing submission
- **Invalid email format** - Validation with error messages
- **Invalid phone format** - Accept various phone number formats with formatting hints
- **Non-owner admin access** - Show "access denied" message
- **No messages in admin** - Show empty state
- **Network errors** - Display error messages

## Design Direction

The design should feel clean, professional, and minimal. No decorative elements or excessive flourish. A neutral, utilitarian interface that focuses on functionality and clarity. Every interaction should be direct and efficient.

## Color Selection

A minimal, neutral grayscale palette with subtle contrast for hierarchy.

- **Primary Color**: Dark gray (oklch(0.25 0 0)) - Professional and neutral, used for primary actions and key UI elements
- **Secondary Colors**: 
  - Light gray (oklch(0.96 0 0)) - Subtle backgrounds
  - Mid gray (oklch(0.45 0 0)) - Secondary text
- **Accent Color**: Same as primary - maintaining simplicity
- **Foreground/Background Pairings**:
  - Primary (Dark Gray oklch(0.25 0 0)): White text (oklch(0.98 0 0)) - Ratio 11.5:1 ✓
  - Background (Light Gray oklch(0.98 0 0)): Dark text (oklch(0.15 0 0)) - Ratio 14.2:1 ✓
  - Muted (Mid Gray oklch(0.45 0 0)): Light background (oklch(0.98 0 0)) - Ratio 6.8:1 ✓

## Font Selection

Typography should be clean and highly readable - a single sans-serif typeface for all text.

- **Typographic Hierarchy**:
  - H1 (Main Title): Inter SemiBold/36px/tight leading
  - H2 (Section Headers): Inter SemiBold/24px/tight leading
  - H3 (Card Titles): Inter SemiBold/18px/normal leading
  - Body (Forms/Content): Inter Regular/15px/relaxed leading (1.5)
  - Labels: Inter Medium/14px/normal leading
  - Small (Helper Text): Inter Regular/13px/relaxed leading
  - Button Text: Inter Medium/15px/normal leading

## Animations

Minimal, functional animations only - no decorative motion. Simple transitions on interactive elements (hover states, form submission). Everything should feel instant and responsive.

## Component Selection

- **Components**:
  - Card (for message form and admin message items) - Clean white backgrounds with subtle borders
  - Input & Textarea (for form fields) - Standard styling with clear focus states
  - Button (primary actions) - Simple solid backgrounds
  - Tabs (admin panel filtering) - Standard tab design
  - Scroll Area (admin message list) - Standard scrolling
  - Label (form labels) - Clear and simple
  - Radio Group (email vs phone selection) - Standard radio buttons
  
- **Customizations**:
  - Minimal - using shadcn defaults
  
- **States**:
  - Buttons: Default, Hover (slight background change), Active, Disabled (reduced opacity)
  - Inputs: Default, Focus (ring), Error (red border), Success (subtle indicator)
  - Form: Empty, Filling, Submitting, Success, Error
  
- **Icon Selection**:
  - ShieldCheck (anonymity indicator)
  - PaperPlaneRight (send message)
  - EnvelopeSimple (email option)
  - Phone (phone option)
  - CheckCircle (fulfilled status)
  - Clock (pending status)
  - List (general icon)
  - ArrowLeft (navigation)
  
- **Spacing**: 
  - Consistent 4px/8px/16px/24px/32px scale
  - Standard form field spacing
  - Clear section separation
  
- **Mobile**:
  - Stack form fields vertically
  - Standard responsive breakpoints
  - Full-width cards on mobile
  - Touch-friendly targets (min 44px)
