// Curated professional stock photography (Unsplash) for MentorWise AI.
// Replaces AI-generated illustrations with corporate, startup-friendly imagery.
// Query params force reliable delivery + reasonable weight.

const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const STOCK_AGENT_IMAGES: Record<string, string> = {
  core: u("1677442136019-21780ecad995"),        // abstract AI network
  resume: u("1586281380349-632531db7ed4"),      // resume on desk
  interview: u("1521737604893-d14cc237f11d"),   // interview handshake / meeting
  linkedin: u("1611944212129-29977ae1398c"),    // professional headshot
  internship: u("1521737711867-e3b97375f902"),  // office teamwork
  courses: u("1481627834876-b7833e8f5570"),     // books & study
  projects: u("1461749280684-dccba630e2f6"),    // laptop coding
  exam: u("1434030216411-0b793f4b4173"),        // student studying
  email: u("1596526131083-e8c633c948d2"),       // laptop inbox
  humaniser: u("1455390582262-044cdead277a"),   // writing / journal
  instagram: u("1611262588024-d12430b98920"),   // phone social media
  mentor: u("1552664730-d307ca884978"),         // one-on-one mentorship
};

export const STOCK_PAGE_HEROES = {
  home: u("1497366216548-37526070297c", 1600),
  agents: u("1531973576160-7125cd663d86", 1600),
  about: u("1552581234-26160f608093", 1600),
  founders: u("1522071820081-009f0129c71c", 1600),
  blog: u("1499750310107-5fef28a66643", 1600),
  contact: u("1516321497487-e288fb19713f", 1600),
  events: u("1540575467063-178a50c2df87", 1600),
  feed: u("1522252234503-e356532cafd5", 1600),
  resources: u("1450101499163-c8848c66ca85", 1600),
  resume: u("1586281380349-632531db7ed4", 1600),
  interview: u("1521737604893-d14cc237f11d", 1600),
  internship: u("1521737711867-e3b97375f902", 1600),
  mentor: u("1552664730-d307ca884978", 1600),
};
