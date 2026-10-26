# MentorWise AI Platform

![FlawPilot Score: 91/100, Hardened](https://badge.flawpilot.com/scan?id=22dcc418-4d28-487f-b821-88b1b0ff3826)


META-PROMPT: MENTOR WISE AI - OFFICIAL STARTUP PLATFORM & AGENT ECOSYSTEM
Role: Act as a Principal Full-Stack Engineer, Lead UI/UX Architect, and AI Product Strategist.
Objective: Architect, design, and code the final, official, production-ready landing page for an elite, globally unique AI EdTech startup named "Mentor Wise AI". 
Environment: Replit (React.js + Tailwind CSS + Framer Motion for high-end web animations). 

---

🎨 1. DESIGN SYSTEM & UI/UX THEME
*   Aesthetic: "Premium Dark Corporate" mixed with "Neon Glassmorphism". It must feel authoritative, empowering, highly futuristic, and built by a top-tier MNC.
*   Color Palette: Deep Space Black background (`#050510`), punctuated by glowing accents of Cyber Cyan (`#00f0ff`), Deep Magenta (`#7000ff`), and Electric Purple.
*   Typography: 'Space Grotesk' for bold, commanding headers. 'Inter' for highly readable body text.
*   Components: Use glass-frosted cards (`backdrop-blur-lg`, `bg-white/5`), subtle glowing borders on hover, floating badge tags for "Upcoming" features, and smooth scroll animations.
*   Responsiveness: The layout must be flawlessly mobile-first, adapting gracefully to tablets and ultra-wide desktop monitors.

---

🏗️ 2. ARCHITECTURE & SECTION BLUEPRINT
Generate a single-page application (SPA) with the following deeply structured sections:

A. Dynamic Navigation (Sticky Header)
*   Glassmorphic navbar that blurs the background as you scroll.
*   Links: Home, The Ecosystem, Knowledge Vault, Founders, Contact.
*   CTA Button: "Access AI Agents" (glowing cyan button).

B. The Hero Section
*   Headline: "The Ultimate AI-Powered Career Arsenal."
*   Sub-headline: "Mentor Wise AI is the world’s most advanced ecosystem for students and freshers. Featuring a suite of Google and Microsoft-level AI agents designed to bypass ATS filters, crack elite interviews, and secure premium internships at zero cost."
*   Primary CTA: "Deploy Your Agent" (scrolls to ecosystem).
*   Secondary CTA: "Meet the Founders" (scrolls to founders).

C. The Agent Ecosystem (Core Features Grid)
Create a massive, visually stunning CSS grid (3 or 4 columns) featuring hovering glass cards with glowing icons. Each card represents a unique AI agent in our arsenal. Incorporate these exact features:

1.  The Core AI Agent: The centralized intelligence hub for all general queries and platform interactions.
2.  Resume Agent (Pro-Level): Google + Microsoft standard ATS resume expert. A globally unique engine that reverse-engineers recruiter algorithms.
3.  Interview Agent (Premium): Top MNC-level expert for cracking technical and behavioral rounds with real-time STAR method feedback.
4.  LinkedIn Agent: The all-in-one profile optimizer. Generates pro-level cheats for job cracking, networking, and daily recruiter-targeted post ideas.
5.  Internship & Training Agent: Specialized scout for 100% free internships, LORs, and certifications from Gov, Private, and MNC sectors. Features personalized tracking and message-based data curation (outperforming Internshala/Unstop).
6.  Courses & Training Agent: Free-forever deep research curator that scans all platforms to deliver step-by-step, premium certification paths at zero cost.
7.  Projects & Assignment Agent: Multi-field portfolio booster curating free, recruiter-ready projects and assignments with AI assistance.
8.  Exam Agent (Rank 1): Top MNC-powered assistant for schools, colleges, and govt exams. Provides last-minute "centum scoring" cheats, guided logic, and diagrammatic explanations.
9.  Email & Message Specialist: MVP-level drafter for universal, human-sounding corporate communication and cold outreach.
10. Humaniser Agent: Advanced NLP specialist dedicated to removing robotic tones and humanizing texts, posts, and professional drafts.
11. Instagram & Social Media Agent (Upcoming): Million-follower tier expert for profile optimization, algorithmic growth, and daily content curation. (Style with a glowing "Coming Soon" badge).
12. 1-on-1 Mentor Agent (Upcoming): Video-to-text live mentoring interface. (Style with a glowing "Coming Soon" badge).

D. The Founders Section (CRITICAL DATA INJECTION)
Build a premium, high-trust "Meet the Leadership" section. Use a side-by-side flex/grid layout. Each founder card must feature their image, bio, and a dedicated row of interactive, clickable contact badges.

Founder 1:
*   Name: Mohammed Faizal. M
*   Title: Founder & CEO
*   Bio: B.Com student at The New College, Chennai. Leading the vision to democratize career guidance, engineer elite AI tools, and build the ultimate ecosystem for modern freshers.
*   Image Source: `<img src="image_2.png" alt="Mohammed Faizal. M" />` (Ensure the image is styled with a sleek border-radius, object-cover, and subtle drop shadow).
*   Interactive Contact Buttons (Must use active href links):
    *   Email: `href="mailto:mentorwiseaiedtech@gmail.com"`
    *   WhatsApp: `href="https://wa.me/916383969289"`
    *   LinkedIn: `href="https://www.linkedin.com/in/mohammed-faizal-m-b3242b311?utm_source=share_via&utm_content=profile&utm_medium=member_ios"` (Target="_blank")

Founder 2:
*   Name: Saif Ahmed. Z
*   Title: Co-founder
*   Bio: B.Com student at The New College, Chennai. Architecting the operational frameworks, product strategies, and open-access networks to scale Mentor Wise AI globally.
*   Image Source: `<img src="image_3.png" alt="Saif Ahmed. Z" />` (Match styling to Founder 1).
*   Interactive Contact Buttons (Must use active href links):
    *   Email: `href="mailto:saifahmedmentorwise@gmail.com"`
    *   WhatsApp: `href="https://wa.me/918668032758"`
    *   LinkedIn: `href="https://www.linkedin.com/in/saif-ahmed-a9a610353?utm_source=share_via&utm_content=profile&utm_medium=member_ios"` (Target="_blank")

E. Interactive Contact & Footer
*   A sleek call-to-action banner: "Ready to scale from student to autonomous professional?"
*   Interactive Action Board: Create three large, highly visible, clickable buttons mapping to general inquiries:
    *   [Email Us] (mailto:mentorwiseaiedtech@gmail.com)
    *   [Chat on WhatsApp] (https://wa.me/916383969289)
    *   [Connect on LinkedIn] (Link to Faizal's LinkedIn)
*   Footer: Copyright 2026 Mentor Wise AI. Based in Chennai, Tamil Nadu, India. "Built for the students, by the students."

---

⚡ 3. STRICT TECHNICAL INSTRUCTIONS
1.  Framework: Provide all code formatted for a standard React application that can be run instantly in Replit. Use Framer Motion for entrance animations (`initial={{ opacity: 0, y: 20 }}`).
2.  Button Interactivity: All contact buttons (Email, WhatsApp, LinkedIn) MUST be wrapped in standard `<a>` tags with `target="_blank" rel="noopener noreferrer"`. Apply hover states (scale up 1.05, increase brightness) using Tailwind classes.
3.  Image Paths: You must use the exact local filenames `image_2.png` and `image_3.png` in the `src` attributes for the founder photos. Do not use placeholder URLs.
4.  Icons: Integrate `lucide-react` for the Email, WhatsApp, LinkedIn, and AI Agent feature icons.
5.  Output: Output the complete, structured code. Do not provide partial snippets. I need the main component (e.g., `App.jsx`), complete with the Tailwind configurations and mapped data arrays for the 12 AI agents to keep the code clean.


Make the AI response like a real AI chat LLM assistant without any markdowns like '###' or '*'. To be applicable for all the agents. Even disabled ones.

Also add the profile images of founder and co-founder.

founder image and co-founder image will be attached next to next. First image must be founder's one, second image must be co-founder's one.

Also, I need sidebar or top menu for agent selection, about us section, founder's section, and contact page section. The design must be more unique, prifessional, corporate level and top MNC level website design. Also, restrict the agents to comply within the free-tier limit of AI API usage, but 100% better responses and professional tone. Add image generating capabilities m.

I asked like separate pages. Not everything in a single page, with menus for direction. I asked for separate and multiple pages.

Add contact us form field in contact page. With the fields like full name, email address, occupation, and query box to write anything as a paragraph without character limit. As soon as the user sends query, the AI assistant must send a acknowledgement email either with query solution if possible or to wait for the founders to respond. With the name 'MentorWise AI'

founder and co founder images. First image - founder, second image - co founder.

I want the agent to send email to the written email address. Acknowledging the receipt of their query, if possible, responding to the query by sharing the founder and co founder contact details with the email body. If not possible, just sharing the contact details of us to contact.

Enable Gmail for sending emails. Don’t use lovable email sending. I have added connector of Gmail. Use the mail address (sender) - mentorwiseaiedtech@gmail.com to send any mails, replies, and other info. 

Add the first image (MW image without MentorWise text) as official logo of MentorWise AI, in top of the menu and bottom copyright footer section. Also, add the banner image, second image (MW with MentorWise AI text) attached, as the screen opener or welcoming motion like a top MNC, Google, Microsoft, and other corporate level screen entry system. 

Also, add section cards along with agent cards - Free online workshops (coming soon), free online certified webinars (coming soon), virtual hackathons & challenges (coming soon), virtual internship vault (coming soon). All the new feature cards must reflect coming soon and the buttons should be locked/frozen.
EXECUTE THE CODE GENERATION NOW.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://mentorwiseaiedtechservice.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/22b58f50-3142-4c43-ab64-6eb31f15381a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
