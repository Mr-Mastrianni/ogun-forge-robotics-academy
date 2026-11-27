import labs from './labs.json';
export const KAMITRON_LABS = labs;
export const TIERS = ['Spore', 'Sprout', 'Root', 'Canopy', 'Elder'];
export const BUILD_XP = [100, 250, 500, 1000, 2500];
export const RANK_XP = [0, 500, 1500, 4000, 10000];
// Add hosted or /models/*.glb exports by exact specimen name. Source had no final models.
export const MODELS: Record<string, string> = {};
export const SPECIMENS = labs.flatMap(lab => lab.items.map((item, tier) => ({
  id: `${lab.id}-${tier}`, lab, tier, name: item[0], project: item[1], learn: item[2], arch: item[3], glb: MODELS[item[0]],
})));
export type Specimen = (typeof SPECIMENS)[number];
export const KAMITRON_PAGES = [
  {
    path: '/kamitron', title: 'Living labs', key: 'factory', summary: 'Biomimicry, earth restoration, energy, the Academy and Inner Kingdom',
    glyph: 'mycelium', kicker: 'Living labs', heading: 'Technology the Earth would grow.',
    lead: 'Biomimicry, mycoremediation and ambient energy, inspired by the living intelligence of the planet and the human body.',
    actions: [['/vault', 'Enter the Specimen Vault'], ['#series', 'Meet Inner Kingdom']],
  },
  {
    path: '/vault', title: 'Specimen Vault', key: 'vault', summary: '35 builds across seven labs, five tiers and interactive 3D specimens',
    glyph: 'seed', kicker: 'Specimen Vault', heading: '35 builds across seven living labs.',
    lead: 'Turn each concept model, take it apart, and see what you would build and learn at every tier from Spore to Elder.',
    actions: [],
  },
  {
    path: '/services', title: 'Services', key: 'services', summary: 'Research collaborations, immersive builds, workshops and Academy partnerships',
    glyph: 'forge', kicker: 'Work with Kamitron', heading: 'Research, immersive builds and workshops.',
    lead: 'Kamitron partners with schools, labs, museums and makers on emerging-technology projects. For AI consulting and automation, our sister company CAAKE leads the work.',
    actions: [['/contact#message-form', 'Start a conversation'], ['#ai-consulting', 'Looking for AI consulting?']],
  },
  {
    path: '/about', title: 'About Kamitron', key: 'about', summary: 'Vision, values, history and expertise',
    glyph: 'memory', kicker: 'Our story', heading: 'A research studio with ancestral roots.',
    lead: 'Kamitron studies how nature, ancestral knowledge and new technology fit together, then builds and teaches what it learns.',
    actions: [],
  },
  {
    path: '/community', title: 'The Hive', key: 'community', summary: 'Community features, events, workshops and membership',
    glyph: 'lattice', kicker: 'The Hive', heading: 'Learn and build together.',
    lead: 'A growing community of learners, makers and researchers. Join the waitlist to hear about workshops, build days and the platform launch first.',
    actions: [['/kamitron#join', 'Join the waitlist'], ['/vault', 'Explore the Vault']],
  },
  {
    path: '/contact', title: 'Contact', key: 'contact', summary: 'Start a collaboration, service inquiries and contact information',
    glyph: 'signal', kicker: 'Contact', heading: 'Tell us what you are building.',
    lead: 'Research partners, schools, studios and curious builders are all welcome. We read every message.',
    actions: [],
  },
] as const;
