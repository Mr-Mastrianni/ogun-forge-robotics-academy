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
  { path: '/kamitron', title: 'Kamitron Living Technology', key: 'factory', summary: 'Biomimicry, earth restoration, energy, Academy and Inner Kingdom' },
  { path: '/vault', title: 'Specimen Vault', key: 'vault', summary: '35 builds across seven labs, five tiers and interactive 3D specimens' },
  { path: '/services', title: 'Services', key: 'services', summary: 'AI consulting, training, automation and 3D/AR/VR development' },
  { path: '/about', title: 'About Kamitron', key: 'about', summary: 'Vision, values, history and expertise' },
  { path: '/community', title: 'The Hive', key: 'community', summary: 'Community features, events, workshops and membership' },
  { path: '/contact', title: 'Contact', key: 'contact', summary: 'Start a project, service inquiries and contact information' },
] as const;
