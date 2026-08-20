import { heatFromRisk, INCIDENT_TYPES } from './sim.js';

export const HEAT = heatFromRisk();

export const CATEGORY_META = {
  armed:      { label: 'Armed attack',     color: 'var(--c-red)',    hex: '#ff8a3d', cat: 'Violent' },
  abduction:  { label: 'Kidnapping',       color: 'var(--c-orange)', hex: '#ff4d5e', cat: 'Violent' },
  banditry:   { label: 'Bandit attack',    color: 'var(--c-gold)',   hex: '#f5b942', cat: 'Criminal' },
  civil:      { label: 'Suspicious movement', color: 'var(--c-cyan)', hex: '#8b7dff', cat: 'Lead' },
  explosive:  { label: 'Explosive',        color: 'var(--c-purple)', hex: '#8b7dff', cat: 'Violent' },
  infra:      { label: 'Emergency call',   color: 'var(--c-blue)',   hex: '#2dd8c3', cat: 'Emergency' },
  other:      { label: 'Other',            color: 'var(--c-grey)',   hex: '#9aa7b0', cat: 'Unclassified' },
};

export const RESOURCE_META = CATEGORY_META;

export { INCIDENT_TYPES };
