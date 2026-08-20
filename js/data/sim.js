/**
 * ZAMFARA SIC — simulation dataset
 * ================================
 * Entirely fictional. Replaces with an authorized API later via js/data/api.js.
 * Phone numbers, towers, calls, locations and incidents are DEMO DATA.
 * Location points are estimated cell-area centroids, never exact GPS.
 */

export const META = {
  jurisdiction: 'Zamfara State',
  organisation: 'Zamfara Joint Security Operations Centre',
  orgShort: 'ZJSOC',
  classification: 'DEMO / SIMULATION DATA',
  feedMode: 'SIMULATION',
  feedLabel: 'SIMULATION MODE — LIVE TELECOM FEED NOT CONNECTED',
  generated: '2026-08-21T08:40:00+01:00',
  lastSync: '08:42:11 WAT',
};

export const OFFICER = {
  id: 'OFF-4412',
  name: 'Maj. Aisha Bello',
  initials: 'AB',
  role: 'Intelligence Analyst',
  organisation: 'ZJSOC · Gusau',
  clearance: 'SECRET-SIM',
  twoFactor: true,
};

export const LGAS = [
  { name: 'Anka',               lat: 11.9402, lng: 6.0114, risk: 86, conf: 78, incidents: 7 },
  { name: 'Bakura',             lat: 12.6165, lng: 5.8459, risk: 41, conf: 71, incidents: 2 },
  { name: 'Birnin Magaji-Kiyaw',lat: 12.4941, lng: 6.8749, risk: 54, conf: 69, incidents: 3 },
  { name: 'Bukkuyum',           lat: 11.9556, lng: 5.5839, risk: 72, conf: 74, incidents: 5 },
  { name: 'Bungudu',            lat: 12.0879, lng: 6.5718, risk: 48, conf: 70, incidents: 2 },
  { name: 'Gummi',              lat: 12.0490, lng: 5.1173, risk: 38, conf: 66, incidents: 1 },
  { name: 'Gusau',              lat: 11.9081, lng: 6.6570, risk: 33, conf: 82, incidents: 2 },
  { name: 'Kaura Namoda',       lat: 12.5110, lng: 6.6013, risk: 45, conf: 73, incidents: 2 },
  { name: 'Maradun',            lat: 12.7361, lng: 6.2685, risk: 61, conf: 68, incidents: 3 },
  { name: 'Maru',               lat: 11.5310, lng: 6.3627, risk: 91, conf: 81, incidents: 9 },
  { name: 'Shinkafi',           lat: 13.0332, lng: 6.4517, risk: 77, conf: 75, incidents: 6 },
  { name: 'Talata Mafara',      lat: 12.3622, lng: 6.0572, risk: 58, conf: 72, incidents: 4 },
  { name: 'Tsafe',              lat: 11.8769, lng: 6.9122, risk: 52, conf: 70, incidents: 3 },
  { name: 'Zurmi',              lat: 12.8455, lng: 6.7668, risk: 84, conf: 79, incidents: 8 },
];

export const PLACES = [
  { id: 'p-gusau',     name: 'Gusau',            kind: 'city',     lat: 12.1642, lng: 6.6614, lga: 'Gusau' },
  { id: 'p-kaura',     name: 'Kaura Namoda',     kind: 'city',     lat: 12.5950, lng: 6.5790, lga: 'Kaura Namoda' },
  { id: 'p-talata',    name: 'Talata Mafara',    kind: 'city',     lat: 12.5694, lng: 6.0622, lga: 'Talata Mafara' },
  { id: 'p-anka',      name: 'Anka',             kind: 'town',     lat: 12.1080, lng: 5.9350, lga: 'Anka' },
  { id: 'p-shinkafi',  name: 'Shinkafi',         kind: 'town',     lat: 13.0890, lng: 6.4880, lga: 'Shinkafi' },
  { id: 'p-zurmi',     name: 'Zurmi',            kind: 'town',     lat: 12.7760, lng: 6.7840, lga: 'Zurmi' },
  { id: 'p-maru',      name: 'Maru',             kind: 'town',     lat: 11.6040, lng: 6.4040, lga: 'Maru' },
  { id: 'p-dansadau',  name: 'Dansadau',         kind: 'village',  lat: 11.4100, lng: 6.1500, lga: 'Maru' },
  { id: 'p-mutumji',   name: 'Mutumji',          kind: 'village',  lat: 11.7200, lng: 6.2100, lga: 'Maru' },
  { id: 'p-kizara',    name: 'Kizara',           kind: 'village',  lat: 12.9200, lng: 6.8200, lga: 'Zurmi' },
  { id: 'p-moriki',    name: 'Moriki',           kind: 'village',  lat: 12.8800, lng: 6.4900, lga: 'Zurmi' },
  { id: 'p-jangebe',   name: 'Jangebe',          kind: 'village',  lat: 12.4300, lng: 5.9100, lga: 'Talata Mafara' },
  { id: 'p-yandoto',   name: 'Yandoto',          kind: 'village',  lat: 12.0200, lng: 6.8200, lga: 'Bungudu' },
  { id: 'p-kwatar',    name: 'Kwatarkwashi',     kind: 'village',  lat: 12.1800, lng: 6.4500, lga: 'Bungudu' },
  { id: 'p-bungudu',   name: 'Bungudu',          kind: 'town',     lat: 12.2680, lng: 6.5560, lga: 'Bungudu' },
  { id: 'p-gummi',     name: 'Gummi',            kind: 'town',     lat: 12.1440, lng: 5.2350, lga: 'Gummi' },
  { id: 'p-tsafe',     name: 'Tsafe',            kind: 'town',     lat: 11.9320, lng: 6.9200, lga: 'Tsafe' },
  { id: 'p-bakura',    name: 'Bakura',           kind: 'town',     lat: 12.7600, lng: 5.8900, lga: 'Bakura' },
];

export const TOWERS = [
  { id: 'ZM-101', lat: 12.170, lng: 6.664, lga: 'Gusau',            area: 'Gusau urban',           type: 'macro' },
  { id: 'ZM-102', lat: 12.090, lng: 6.520, lga: 'Bungudu',          area: 'Kwatarkwashi corridor', type: 'macro' },
  { id: 'ZM-103', lat: 12.250, lng: 6.410, lga: 'Bungudu',          area: 'Rural Bungudu',         type: 'macro' },
  { id: 'ZM-104', lat: 11.620, lng: 6.280, lga: 'Maru',             area: 'Remote corridor',       type: 'macro' },
  { id: 'ZM-105', lat: 11.430, lng: 6.160, lga: 'Maru',             area: 'Dansadau bush belt',    type: 'rural' },
  { id: 'ZM-106', lat: 11.940, lng: 5.940, lga: 'Anka',             area: 'Anka town',             type: 'macro' },
  { id: 'ZM-107', lat: 11.780, lng: 5.820, lga: 'Anka',             area: 'Anka south forest',     type: 'rural' },
  { id: 'ZM-108', lat: 12.560, lng: 6.070, lga: 'Talata Mafara',    area: 'Talata Mafara',         type: 'macro' },
  { id: 'ZM-109', lat: 12.430, lng: 5.920, lga: 'Talata Mafara',    area: 'Jangebe rural',         type: 'rural' },
  { id: 'ZM-110', lat: 12.780, lng: 6.790, lga: 'Zurmi',            area: 'Zurmi town',            type: 'macro' },
  { id: 'ZM-111', lat: 12.900, lng: 6.500, lga: 'Zurmi',            area: 'Moriki corridor',       type: 'rural' },
  { id: 'ZM-112', lat: 13.080, lng: 6.490, lga: 'Shinkafi',         area: 'Shinkafi town',         type: 'macro' },
  { id: 'ZM-113', lat: 13.150, lng: 6.320, lga: 'Shinkafi',         area: 'Northern fringe',       type: 'rural' },
  { id: 'ZM-114', lat: 12.590, lng: 6.580, lga: 'Kaura Namoda',     area: 'Kaura Namoda',          type: 'macro' },
  { id: 'ZM-115', lat: 11.960, lng: 5.560, lga: 'Bukkuyum',         area: 'Bukkuyum',              type: 'macro' },
  { id: 'ZM-116', lat: 11.880, lng: 6.910, lga: 'Tsafe',            area: 'Tsafe',                 type: 'macro' },
  { id: 'ZM-117', lat: 12.140, lng: 5.240, lga: 'Gummi',            area: 'Gummi',                 type: 'macro' },
  { id: 'ZM-118', lat: 12.760, lng: 5.890, lga: 'Bakura',           area: 'Bakura',                type: 'macro' },
];

const T = Object.fromEntries(TOWERS.map((t) => [t.id, t]));

export const INCIDENT_TYPES = {
  kidnapping:    { label: 'Kidnapping',          hex: '#ff4d5e', resource: 'abduction' },
  bandit:        { label: 'Bandit attack',       hex: '#f5b942', resource: 'banditry' },
  armed:         { label: 'Armed attack',        hex: '#ff8a3d', resource: 'armed' },
  missing:       { label: 'Missing person',      hex: '#4d9dff', resource: 'other' },
  movement:      { label: 'Suspicious movement', hex: '#8b7dff', resource: 'civil' },
  emergency:     { label: 'Emergency call',      hex: '#2dd8c3', resource: 'infra' },
  other:         { label: 'Other',               hex: '#9aa7b0', resource: 'other' },
};

export const INCIDENTS = [
  { id: 'INC-2026-0142', type: 'kidnapping', when: '2026-08-21T06:18:00+01:00', lat: 11.448, lng: 6.172, lga: 'Maru', place: 'Dansadau bush belt', sev: 'critical', status: 'ACTIVE', units: ['UNT-04', 'UNT-07'], numbers: ['INV-001'], towers: ['ZM-105', 'ZM-104'], desc: 'Reported abduction of travellers on the Dansadau corridor. Estimated cell-area only — not a GPS fix.', notes: 'Awaiting ground confirmation from UNT-04.' },
  { id: 'INC-2026-0141', type: 'bandit',     when: '2026-08-20T22:41:00+01:00', lat: 12.910, lng: 6.505, lga: 'Zurmi', place: 'Moriki corridor', sev: 'high', status: 'RESPONDING', units: ['UNT-02'], numbers: ['INV-003'], towers: ['ZM-111'], desc: 'Armed group reported near Moriki. Multiple metadata events on ZM-111 within 40 minutes.', notes: 'Analyst flagged as intelligence lead — not a confirmed attribution.' },
  { id: 'INC-2026-0140', type: 'armed',      when: '2026-08-20T18:05:00+01:00', lat: 11.790, lng: 5.830, lga: 'Anka', place: 'Anka south forest', sev: 'high', status: 'ACTIVE', units: ['UNT-05'], numbers: ['INV-002'], towers: ['ZM-107'], desc: 'Shooting reported on the southern approach to Anka. No conversation content available.', notes: '' },
  { id: 'INC-2026-0138', type: 'kidnapping', when: '2026-08-20T04:12:00+01:00', lat: 13.142, lng: 6.328, lga: 'Shinkafi', place: 'Northern fringe', sev: 'critical', status: 'INVESTIGATING', units: ['UNT-09'], numbers: ['INV-003'], towers: ['ZM-113'], desc: 'Missing family reported; last associated cell ZM-113 with 3.1 km uncertainty.', notes: 'Do not treat cell centroid as a precise location.' },
  { id: 'INC-2026-0136', type: 'movement',   when: '2026-08-19T23:50:00+01:00', lat: 11.640, lng: 6.270, lga: 'Maru', place: 'Remote corridor', sev: 'medium', status: 'MONITORING', units: [], numbers: ['INV-001', 'INV-002'], towers: ['ZM-104'], desc: 'Two investigated devices associated with the same corridor within 25 minutes. Requires analyst verification.', notes: 'AI-generated lead.' },
  { id: 'INC-2026-0134', type: 'emergency',  when: '2026-08-21T07:02:00+01:00', lat: 12.168, lng: 6.670, lga: 'Gusau', place: 'Gusau urban', sev: 'medium', status: 'ON SCENE', units: ['UNT-01'], numbers: [], towers: ['ZM-101'], desc: 'Emergency call — caller identifier withheld. Estimated urban cell.', notes: '' },
  { id: 'INC-2026-0133', type: 'bandit',     when: '2026-08-19T16:22:00+01:00', lat: 11.960, lng: 5.540, lga: 'Bukkuyum', place: 'Bukkuyum west', sev: 'high', status: 'RESOLVED', units: ['UNT-06'], numbers: [], towers: ['ZM-115'], desc: 'Raid on a mining hamlet. Incident closed after units cleared the area.', notes: 'After-action report filed.' },
  { id: 'INC-2026-0131', type: 'missing',    when: '2026-08-19T09:40:00+01:00', lat: 12.430, lng: 5.925, lga: 'Talata Mafara', place: 'Jangebe rural', sev: 'medium', status: 'INVESTIGATING', units: ['UNT-03'], numbers: ['INV-005'], towers: ['ZM-109'], desc: 'Herder reported missing. Last cell ZM-109, radius ~2.8 km.', notes: '' },
  { id: 'INC-2026-0128', type: 'armed',      when: '2026-08-18T21:15:00+01:00', lat: 12.020, lng: 6.830, lga: 'Bungudu', place: 'Yandoto', sev: 'medium', status: 'RESOLVED', units: ['UNT-08'], numbers: [], towers: ['ZM-116'], desc: 'Highway shooting, two injured. Scene cleared.', notes: '' },
  { id: 'INC-2026-0124', type: 'kidnapping', when: '2026-08-17T02:08:00+01:00', lat: 11.530, lng: 6.400, lga: 'Maru', place: 'Maru south', sev: 'critical', status: 'MONITORING', units: ['UNT-04', 'UNT-10'], numbers: ['INV-001'], towers: ['ZM-104', 'ZM-105'], desc: 'Ongoing case linked to CASE-2026-00128. Movement trail is estimated tower-to-tower only.', notes: 'Analyst verified linkage to INV-001 metadata.' },
  { id: 'INC-2026-0121', type: 'bandit',     when: '2026-08-16T14:55:00+01:00', lat: 12.845, lng: 6.770, lga: 'Zurmi', place: 'Zurmi east', sev: 'high', status: 'RESOLVED', units: ['UNT-02'], numbers: [], towers: ['ZM-110'], desc: 'Market disruption. Resolved same day.', notes: '' },
  { id: 'INC-2026-0118', type: 'other',      when: '2026-08-15T11:20:00+01:00', lat: 12.590, lng: 6.575, lga: 'Kaura Namoda', place: 'Kaura Namoda', sev: 'low', status: 'CLOSED', units: ['UNT-01'], numbers: [], towers: ['ZM-114'], desc: 'Suspicious gathering — later assessed as a community meeting.', notes: 'False lead. Retained for audit.' },
  { id: 'INC-2026-0115', type: 'emergency',  when: '2026-08-21T05:44:00+01:00', lat: 12.568, lng: 6.055, lga: 'Talata Mafara', place: 'Talata Mafara', sev: 'high', status: 'DISPATCHED', units: ['UNT-03'], numbers: [], towers: ['ZM-108'], desc: 'Distress call. Priority 1. Estimated town cell, 1.6 km radius.', notes: '' },
  { id: 'INC-2026-0112', type: 'movement',   when: '2026-08-14T03:10:00+01:00', lat: 11.880, lng: 5.900, lga: 'Anka', place: 'Anka west', sev: 'medium', status: 'CLOSED', units: [], numbers: ['INV-002'], towers: ['ZM-106'], desc: 'Unusual-hours presence in a remote cell. Not independently verified.', notes: 'AI-generated lead. Analyst dismissed.' },
  { id: 'INC-2026-0108', type: 'bandit',     when: '2026-08-13T19:30:00+01:00', lat: 13.040, lng: 6.460, lga: 'Shinkafi', place: 'Shinkafi south', sev: 'high', status: 'RESOLVED', units: ['UNT-09'], numbers: [], towers: ['ZM-112'], desc: 'Convoy ambush attempt. Repelled.', notes: '' },
];

export const DEVICES = [
  {
    id: 'INV-001',
    msisdn: '0803 441 2291',
    caseId: 'CASE-2026-00128',
    risk: 'HIGH',
    status: 'MONITORING',
    firstSeen: '2026-07-02T11:14:00+01:00',
    lastSeen: '2026-08-21T08:36:12+01:00',
    currentTower: 'ZM-104',
    currentArea: 'Remote corridor · Maru LGA',
    radiusKm: 2.4,
    confidence: 74,
    heading: 'SSW',
    source: 'Authorized telecom location metadata (simulation)',
    notes: 'Primary subject of CASE-2026-00128. Metadata only.',
  },
  {
    id: 'INV-002',
    msisdn: '0814 772 0188',
    caseId: 'CASE-2026-00119',
    risk: 'MEDIUM',
    status: 'ACTIVE',
    firstSeen: '2026-07-18T09:02:00+01:00',
    lastSeen: '2026-08-21T07:51:40+01:00',
    currentTower: 'ZM-107',
    currentArea: 'Anka south forest',
    radiusKm: 3.1,
    confidence: 68,
    heading: 'W',
    source: 'Authorized telecom location metadata (simulation)',
    notes: 'Co-travelling lead with INV-001 on 19 Aug — unverified.',
  },
  {
    id: 'INV-003',
    msisdn: '0706 331 9044',
    caseId: 'CASE-2026-00107',
    risk: 'HIGH',
    status: 'ACTIVE',
    firstSeen: '2026-06-11T16:40:00+01:00',
    lastSeen: '2026-08-21T06:22:08+01:00',
    currentTower: 'ZM-111',
    currentArea: 'Moriki corridor · Zurmi LGA',
    radiusKm: 2.8,
    confidence: 81,
    heading: 'N',
    source: 'Authorized telecom location metadata (simulation)',
    notes: 'Linked to Shinkafi and Zurmi incidents by cell proximity only.',
  },
  {
    id: 'INV-004',
    msisdn: '0901 228 4470',
    caseId: 'CASE-2026-00094',
    risk: 'LOW',
    status: 'CLOSED',
    firstSeen: '2026-05-03T08:10:00+01:00',
    lastSeen: '2026-08-12T14:05:00+01:00',
    currentTower: 'ZM-101',
    currentArea: 'Gusau urban',
    radiusKm: 1.2,
    confidence: 88,
    heading: '—',
    source: 'Authorized telecom location metadata (simulation)',
    notes: 'Cleared by analyst. Retained for audit.',
  },
  {
    id: 'INV-005',
    msisdn: '0806 915 3302',
    caseId: 'CASE-2026-00131',
    risk: 'MEDIUM',
    status: 'MONITORING',
    firstSeen: '2026-08-01T19:22:00+01:00',
    lastSeen: '2026-08-21T05:11:00+01:00',
    currentTower: 'ZM-109',
    currentArea: 'Jangebe rural · Talata Mafara',
    radiusKm: 2.8,
    confidence: 71,
    heading: 'E',
    source: 'Authorized telecom location metadata (simulation)',
    notes: 'Associated with missing-person inquiry INC-2026-0131.',
  },
];

export const CALLS = [
  { id: 'CDR-88421', device: 'INV-001', time: '2026-08-21T08:36:12+01:00', dir: 'OUTBOUND', other: '0814 772 0188', otherId: 'INV-002', dur: '00:42', cell: 'ZM-104', status: 'ACTIVE', live: true },
  { id: 'CDR-88418', device: 'INV-001', time: '2026-08-21T07:12:04+01:00', dir: 'OUTBOUND', other: '0706 331 9044', otherId: 'INV-003', dur: '03:12', cell: 'ZM-104', status: 'COMPLETED' },
  { id: 'CDR-88411', device: 'INV-001', time: '2026-08-21T06:27:51+01:00', dir: 'INBOUND',  other: '0814 772 0188', otherId: 'INV-002', dur: '00:48', cell: 'ZM-103', status: 'COMPLETED' },
  { id: 'CDR-88390', device: 'INV-001', time: '2026-08-21T04:11:20+01:00', dir: 'OUTBOUND', other: '0708 441 0021', otherId: null,     dur: '02:31', cell: 'ZM-103', status: 'COMPLETED' },
  { id: 'CDR-88344', device: 'INV-001', time: '2026-08-20T22:18:09+01:00', dir: 'INBOUND',  other: '0806 915 3302', otherId: 'INV-005', dur: '01:04', cell: 'ZM-102', status: 'COMPLETED' },
  { id: 'CDR-88201', device: 'INV-001', time: '2026-08-20T15:42:33+01:00', dir: 'OUTBOUND', other: '0901 228 4470', otherId: 'INV-004', dur: '00:22', cell: 'ZM-101', status: 'COMPLETED' },
  { id: 'CDR-88112', device: 'INV-002', time: '2026-08-21T07:51:40+01:00', dir: 'OUTBOUND', other: '0803 441 2291', otherId: 'INV-001', dur: '01:16', cell: 'ZM-107', status: 'COMPLETED' },
  { id: 'CDR-88090', device: 'INV-002', time: '2026-08-20T18:01:12+01:00', dir: 'INBOUND',  other: '0708 441 0021', otherId: null,     dur: '04:05', cell: 'ZM-107', status: 'COMPLETED' },
  { id: 'CDR-87940', device: 'INV-003', time: '2026-08-21T06:22:08+01:00', dir: 'OUTBOUND', other: '0803 441 2291', otherId: 'INV-001', dur: '02:44', cell: 'ZM-111', status: 'COMPLETED' },
  { id: 'CDR-87812', device: 'INV-003', time: '2026-08-20T22:38:00+01:00', dir: 'OUTBOUND', other: '0812 660 1180', otherId: null,     dur: '00:55', cell: 'ZM-111', status: 'COMPLETED' },
  { id: 'CDR-87600', device: 'INV-005', time: '2026-08-21T05:11:00+01:00', dir: 'INBOUND',  other: '0803 441 2291', otherId: 'INV-001', dur: '00:19', cell: 'ZM-109', status: 'COMPLETED' },
];

export const LOCATIONS = {
  'INV-001': [
    { time: '2026-08-20T14:05:00+01:00', cell: 'ZM-101', lat: 12.170, lng: 6.664, radiusKm: 1.4, conf: 86, area: 'Gusau urban' },
    { time: '2026-08-20T16:40:00+01:00', cell: 'ZM-102', lat: 12.090, lng: 6.520, radiusKm: 2.1, conf: 79, area: 'Kwatarkwashi corridor' },
    { time: '2026-08-20T21:10:00+01:00', cell: 'ZM-103', lat: 12.250, lng: 6.410, radiusKm: 2.6, conf: 72, area: 'Rural Bungudu' },
    { time: '2026-08-21T03:55:00+01:00', cell: 'ZM-103', lat: 12.250, lng: 6.410, radiusKm: 2.6, conf: 70, area: 'Rural Bungudu' },
    { time: '2026-08-21T06:40:00+01:00', cell: 'ZM-104', lat: 11.620, lng: 6.280, radiusKm: 2.4, conf: 76, area: 'Remote corridor' },
    { time: '2026-08-21T08:36:00+01:00', cell: 'ZM-104', lat: 11.620, lng: 6.280, radiusKm: 2.4, conf: 74, area: 'Remote corridor' },
  ],
  'INV-002': [
    { time: '2026-08-20T12:00:00+01:00', cell: 'ZM-106', lat: 11.940, lng: 5.940, radiusKm: 1.8, conf: 80, area: 'Anka town' },
    { time: '2026-08-20T17:50:00+01:00', cell: 'ZM-107', lat: 11.780, lng: 5.820, radiusKm: 3.1, conf: 69, area: 'Anka south forest' },
    { time: '2026-08-21T07:51:00+01:00', cell: 'ZM-107', lat: 11.780, lng: 5.820, radiusKm: 3.1, conf: 68, area: 'Anka south forest' },
  ],
  'INV-003': [
    { time: '2026-08-20T09:10:00+01:00', cell: 'ZM-112', lat: 13.080, lng: 6.490, radiusKm: 1.7, conf: 83, area: 'Shinkafi town' },
    { time: '2026-08-20T18:40:00+01:00', cell: 'ZM-113', lat: 13.150, lng: 6.320, radiusKm: 3.4, conf: 64, area: 'Northern fringe' },
    { time: '2026-08-21T01:15:00+01:00', cell: 'ZM-111', lat: 12.900, lng: 6.500, radiusKm: 2.8, conf: 77, area: 'Moriki corridor' },
    { time: '2026-08-21T06:22:00+01:00', cell: 'ZM-111', lat: 12.900, lng: 6.500, radiusKm: 2.8, conf: 81, area: 'Moriki corridor' },
  ],
  'INV-004': [
    { time: '2026-08-12T14:05:00+01:00', cell: 'ZM-101', lat: 12.170, lng: 6.664, radiusKm: 1.2, conf: 88, area: 'Gusau urban' },
  ],
  'INV-005': [
    { time: '2026-08-20T20:00:00+01:00', cell: 'ZM-108', lat: 12.560, lng: 6.070, radiusKm: 1.6, conf: 84, area: 'Talata Mafara' },
    { time: '2026-08-21T05:11:00+01:00', cell: 'ZM-109', lat: 12.430, lng: 5.920, radiusKm: 2.8, conf: 71, area: 'Jangebe rural' },
  ],
};

export const UNITS = [
  { id: 'UNT-01', name: 'Gusau QRF-A',     kind: 'Police',   status: 'ON SCENE',   lat: 12.168, lng: 6.670, incident: 'INC-2026-0134', updated: '08:31', lga: 'Gusau' },
  { id: 'UNT-02', name: 'Zurmi Patrol-3',  kind: 'Police',   status: 'RESPONDING', lat: 12.860, lng: 6.620, incident: 'INC-2026-0141', updated: '08:28', lga: 'Zurmi' },
  { id: 'UNT-03', name: 'T/Mafara ERU',    kind: 'NSCDC',    status: 'RESPONDING', lat: 12.500, lng: 6.040, incident: 'INC-2026-0115', updated: '08:26', lga: 'Talata Mafara' },
  { id: 'UNT-04', name: 'Maru Strike-1',   kind: 'Military', status: 'RESPONDING', lat: 11.540, lng: 6.240, incident: 'INC-2026-0142', updated: '08:33', lga: 'Maru' },
  { id: 'UNT-05', name: 'Anka Detachment', kind: 'Military', status: 'ON SCENE',   lat: 11.800, lng: 5.850, incident: 'INC-2026-0140', updated: '08:19', lga: 'Anka' },
  { id: 'UNT-06', name: 'Bukkuyum CP-2',   kind: 'Police',   status: 'AVAILABLE',  lat: 11.970, lng: 5.570, incident: null,            updated: '08:10', lga: 'Bukkuyum' },
  { id: 'UNT-07', name: 'Air Recce-Z',     kind: 'Air',      status: 'RESPONDING', lat: 11.700, lng: 6.200, incident: 'INC-2026-0142', updated: '08:35', lga: 'Maru' },
  { id: 'UNT-08', name: 'Tsafe Checkpoint',kind: 'Police',   status: 'AVAILABLE',  lat: 11.900, lng: 6.900, incident: null,            updated: '07:55', lga: 'Tsafe' },
  { id: 'UNT-09', name: 'Shinkafi QRF',    kind: 'Military', status: 'ON SCENE',   lat: 13.090, lng: 6.400, incident: 'INC-2026-0138', updated: '08:12', lga: 'Shinkafi' },
  { id: 'UNT-10', name: 'JTF South',       kind: 'Joint',    status: 'OFFLINE',    lat: 11.500, lng: 6.400, incident: 'INC-2026-0124', updated: '03:40', lga: 'Maru' },
];

export const FACILITIES = [
  { id: 'FAC-01', name: 'ZJSOC HQ',            kind: 'command',     lat: 12.162, lng: 6.659, lga: 'Gusau' },
  { id: 'FAC-02', name: 'Gusau Central Police', kind: 'police',      lat: 12.155, lng: 6.670, lga: 'Gusau' },
  { id: 'FAC-03', name: 'Anka Division',        kind: 'police',      lat: 12.100, lng: 5.938, lga: 'Anka' },
  { id: 'FAC-04', name: 'Maru Division',        kind: 'police',      lat: 11.610, lng: 6.400, lga: 'Maru' },
  { id: 'FAC-05', name: 'Shinkafi Barracks',    kind: 'military',    lat: 13.070, lng: 6.500, lga: 'Shinkafi' },
  { id: 'FAC-06', name: 'Kaura Namoda CP',      kind: 'checkpoint',  lat: 12.600, lng: 6.560, lga: 'Kaura Namoda' },
  { id: 'FAC-07', name: 'Tsafe Checkpoint',     kind: 'checkpoint',  lat: 11.910, lng: 6.880, lga: 'Tsafe' },
  { id: 'FAC-08', name: 'Dansadau Forward OP',  kind: 'checkpoint',  lat: 11.430, lng: 6.170, lga: 'Maru' },
  { id: 'FAC-09', name: 'Zurmi Division',       kind: 'police',      lat: 12.775, lng: 6.786, lga: 'Zurmi' },
  { id: 'FAC-10', name: 'Talata Mafara ERU',    kind: 'emergency',   lat: 12.565, lng: 6.060, lga: 'Talata Mafara' },
];

export const EMERGENCY = [
  { id: 'EMG-441', time: '2026-08-21T07:02:00+01:00', caller: 'Withheld', lat: 12.168, lng: 6.670, radiusKm: 1.5, conf: 71, lga: 'Gusau', type: 'Distress', pri: 'P2', status: 'ON SCENE', unit: 'UNT-01', incident: 'INC-2026-0134' },
  { id: 'EMG-442', time: '2026-08-21T05:44:00+01:00', caller: '0802 ••• 4419', lat: 12.568, lng: 6.055, radiusKm: 1.6, conf: 77, lga: 'Talata Mafara', type: 'Armed attack', pri: 'P1', status: 'DISPATCHED', unit: 'UNT-03', incident: 'INC-2026-0115' },
  { id: 'EMG-443', time: '2026-08-21T06:21:00+01:00', caller: '0813 ••• 2201', lat: 11.450, lng: 6.175, radiusKm: 3.2, conf: 62, lga: 'Maru', type: 'Kidnapping', pri: 'P1', status: 'RESPONDING', unit: 'UNT-04', incident: 'INC-2026-0142' },
  { id: 'EMG-438', time: '2026-08-20T22:48:00+01:00', caller: '0706 ••• 1188', lat: 12.905, lng: 6.510, radiusKm: 2.4, conf: 69, lga: 'Zurmi', type: 'Bandit attack', pri: 'P1', status: 'ACKNOWLEDGED', unit: 'UNT-02', incident: 'INC-2026-0141' },
  { id: 'EMG-430', time: '2026-08-20T18:08:00+01:00', caller: 'Withheld', lat: 11.792, lng: 5.834, radiusKm: 2.9, conf: 64, lga: 'Anka', type: 'Shooting', pri: 'P1', status: 'ON SCENE', unit: 'UNT-05', incident: 'INC-2026-0140' },
  { id: 'EMG-419', time: '2026-08-19T09:44:00+01:00', caller: '0902 ••• 7730', lat: 12.428, lng: 5.922, radiusKm: 2.8, conf: 70, lga: 'Talata Mafara', type: 'Missing person', pri: 'P3', status: 'RESOLVED', unit: 'UNT-03', incident: 'INC-2026-0131' },
];

export const AI_ALERTS = [
  {
    id: 'AI-2091', sev: 'HIGH', title: 'Investigated device entered a known high-risk area',
    reason: 'INV-001 associated with cell ZM-104, which overlaps a high-risk corridor in Maru LGA.',
    support: ['Location metadata ZM-104', 'Risk layer Maru 91/100', 'INC-2026-0142 active nearby'],
    conf: 76, time: '2026-08-21T06:41:00+01:00', sources: ['telecom-sim', 'gis', 'incidents'],
    verify: 'PENDING ANALYST', device: 'INV-001',
  },
  {
    id: 'AI-2088', sev: 'MEDIUM', title: 'Multiple investigated devices on the same corridor',
    reason: 'INV-001 and INV-002 produced location events along the Bungudu–Maru axis within 25 minutes on 19 Aug.',
    support: ['INV-001 ZM-104', 'INV-002 ZM-107 (earlier hop)', 'No ground confirmation'],
    conf: 61, time: '2026-08-19T23:52:00+01:00', sources: ['telecom-sim'],
    verify: 'UNVERIFIED LEAD', device: 'INV-001',
  },
  {
    id: 'AI-2084', sev: 'HIGH', title: 'Communication events shortly before a reported incident',
    reason: 'INV-003 outbound metadata on ZM-111 at 22:38, incident INC-2026-0141 filed at 22:41. Correlation is temporal, not causal.',
    support: ['CDR-87812', 'INC-2026-0141'],
    conf: 58, time: '2026-08-20T22:44:00+01:00', sources: ['telecom-sim', 'incidents'],
    verify: 'REQUIRES ANALYST VERIFICATION', device: 'INV-003',
  },
  {
    id: 'AI-2071', sev: 'MEDIUM', title: 'Repeated remote-area presence during unusual hours',
    reason: 'INV-002 associated with ZM-107 (Anka south forest) after 18:00 on two consecutive nights.',
    support: ['Location history INV-002'],
    conf: 54, time: '2026-08-20T18:12:00+01:00', sources: ['telecom-sim'],
    verify: 'DISMISSED', device: 'INV-002',
  },
];

export const EVENTS = [
  { id: 'EV-01', time: '2026-08-21T08:36:12+01:00', kind: 'call',     title: 'CALL EVENT',     body: 'Investigated device initiated outgoing communication', status: 'ACTIVE', device: 'INV-001', extra: { direction: 'OUTBOUND', other: '0814 772 0188', cell: 'ZM-104' } },
  { id: 'EV-02', time: '2026-08-21T08:31:52+01:00', kind: 'location', title: 'LOCATION EVENT', body: 'Device associated with Cell Tower ZM-104', status: 'ESTIMATED', device: 'INV-001', extra: { area: 'Remote corridor', conf: 76 } },
  { id: 'EV-03', time: '2026-08-21T08:30:18+01:00', kind: 'movement', title: 'MOVEMENT ALERT', body: 'Device moved from Cell ZM-102 → ZM-104', status: 'LEAD', device: 'INV-001', extra: { distance: '8.7 km', conf: 81 } },
  { id: 'EV-04', time: '2026-08-21T08:28:44+01:00', kind: 'risk',     title: 'RISK ALERT',     body: 'Investigated device entered high-risk zone', status: 'HIGH', device: 'INV-001', extra: { threat: 'HIGH' } },
  { id: 'EV-05', time: '2026-08-21T08:21:00+01:00', kind: 'emergency',title: 'EMERGENCY',      body: 'Distress call — Maru LGA · P1', status: 'RESPONDING', extra: { id: 'EMG-443' } },
  { id: 'EV-06', time: '2026-08-21T07:51:40+01:00', kind: 'call',     title: 'CALL EVENT',     body: 'Metadata: INV-002 outbound to INV-001', status: 'COMPLETED', device: 'INV-002', extra: { cell: 'ZM-107' } },
  { id: 'EV-07', time: '2026-08-21T07:02:00+01:00', kind: 'emergency',title: 'EMERGENCY',      body: 'Incoming emergency · Gusau urban', status: 'ON SCENE', extra: { id: 'EMG-441' } },
  { id: 'EV-08', time: '2026-08-21T06:41:00+01:00', kind: 'risk',     title: 'AI LEAD',        body: 'Potentially suspicious activity · INV-001 in Maru corridor', status: 'UNVERIFIED', device: 'INV-001', extra: { id: 'AI-2091' } },
  { id: 'EV-09', time: '2026-08-21T06:22:08+01:00', kind: 'call',     title: 'CALL EVENT',     body: 'INV-003 outbound metadata on ZM-111', status: 'COMPLETED', device: 'INV-003' },
  { id: 'EV-10', time: '2026-08-21T05:44:00+01:00', kind: 'emergency',title: 'EMERGENCY',      body: 'P1 distress · Talata Mafara', status: 'DISPATCHED', extra: { id: 'EMG-442' } },
  { id: 'EV-11', time: '2026-08-21T05:11:00+01:00', kind: 'location', title: 'LOCATION EVENT', body: 'INV-005 associated with ZM-109', status: 'ESTIMATED', device: 'INV-005', extra: { conf: 71 } },
  { id: 'EV-12', time: '2026-08-20T22:44:00+01:00', kind: 'risk',     title: 'AI LEAD',        body: 'Temporal correlation: call metadata then incident report', status: 'UNVERIFIED', extra: { id: 'AI-2084' } },
  { id: 'EV-13', time: '2026-08-21T08:12:00+01:00', kind: 'system',   title: 'SYSTEM',         body: 'Simulation feed heartbeat · all adapters green', status: 'OK' },
  { id: 'EV-14', time: '2026-08-21T08:00:00+01:00', kind: 'system',   title: 'SYNC',           body: 'Incident register refreshed from operations desk', status: 'OK' },
];

export const ALERTS = [
  { id: 'AL-1', sev: 'HIGH',     title: 'Investigated device entered high-risk zone', body: 'INV-001 · ZM-104 · Maru corridor', time: '08:28', ack: false },
  { id: 'AL-2', sev: 'MEDIUM',   title: 'Unusual movement detected', body: 'Tower hop ZM-102 → ZM-104 · 8.7 km estimated', time: '08:30', ack: false },
  { id: 'AL-3', sev: 'INFO',     title: 'New authorized telecom event received', body: 'CDR-88421 · metadata only', time: '08:36', ack: false },
  { id: 'AL-4', sev: 'HIGH',     title: 'P1 emergency in Maru LGA', body: 'EMG-443 assigned to UNT-04', time: '06:21', ack: true },
  { id: 'AL-5', sev: 'RESOLVED', title: 'Incident closed', body: 'INC-2026-0133 Bukkuyum · after-action filed', time: '19 Aug', ack: true },
];

export const SOURCES = [
  { id: 'telecom-sim', name: 'Authorized telecom intelligence', status: 'SIMULATION', updated: '08:42:11', usedBy: ['Call Intelligence', 'Device Intelligence', 'Location'] },
  { id: 'emergency',   name: 'Emergency calls',                 status: 'SIMULATION', updated: '08:26:04', usedBy: ['Emergency Calls', 'Command Center'] },
  { id: 'incidents',   name: 'Incident reports',                status: 'CONNECTED',  updated: '08:40:02', usedBy: ['Incidents', 'Risk Map'] },
  { id: 'gis',         name: 'GIS data (states, LGAs, places)', status: 'CONNECTED',  updated: 'static',   usedBy: ['All map modules'] },
  { id: 'sat',         name: 'Satellite imagery',               status: 'CONNECTED',  updated: 'tile',     usedBy: ['Map basemap'] },
  { id: 'units',       name: 'Security units',                  status: 'SIMULATION', updated: '08:35:12', usedBy: ['Security Units', 'Command Center'] },
  { id: 'analyst',     name: 'Analyst reports',                 status: 'CONNECTED',  updated: '07:55:00', usedBy: ['Intelligence Reports'] },
];

export const AUDIT = [
  { time: '2026-08-21T08:36:40+01:00', actor: 'Maj. Aisha Bello', action: 'VIEW',   object: 'Officer viewed investigation CASE-2026-00128', ip: '10.12.4.18' },
  { time: '2026-08-21T08:22:11+01:00', actor: 'Maj. Aisha Bello', action: 'EXPORT', object: 'Export blocked — simulation mode (no live feed)', ip: '10.12.4.18' },
  { time: '2026-08-21T08:14:02+01:00', actor: 'Capt. Musa Lawal', action: 'ASSIGN', object: 'Assigned UNT-04 to INC-2026-0142', ip: '10.12.4.22' },
  { time: '2026-08-21T07:48:19+01:00', actor: 'Maj. Aisha Bello', action: 'VIEW',   object: 'Opened location history INV-001', ip: '10.12.4.18' },
  { time: '2026-08-21T07:12:55+01:00', actor: 'Dsp. R. Ibrahim',  action: 'ACK',    object: 'Acknowledged EMG-438', ip: '10.12.5.09' },
  { time: '2026-08-21T06:44:01+01:00', actor: 'Maj. Aisha Bello', action: 'VERIFY', object: 'Marked AI-2091 as pending analyst verification', ip: '10.12.4.18' },
  { time: '2026-08-20T22:51:00+01:00', actor: 'Night duty desk',  action: 'CREATE', object: 'Filed INC-2026-0141 from field report', ip: '10.12.4.02' },
  { time: '2026-08-20T18:10:33+01:00', actor: 'Capt. Musa Lawal', action: 'VIEW',   object: 'Viewed call metadata CDR-88090 (no content)', ip: '10.12.4.22' },
  { time: '2026-08-20T09:02:14+01:00', actor: 'System',           action: 'AUTH',   object: '2FA challenge passed · OFF-4412', ip: '10.12.4.18' },
  { time: '2026-08-19T16:40:00+01:00', actor: 'Maj. Aisha Bello', action: 'CLOSE',  object: 'Closed INC-2026-0133', ip: '10.12.4.18' },
];

export const REPORTS = [
  { id: 'RPT-2026-044', title: 'Morning sitrep — Maru / Dansadau corridor', author: 'Maj. A. Bello', when: '2026-08-21T07:30:00+01:00', class: 'ANALYST VERIFIED', status: 'DRAFT' },
  { id: 'RPT-2026-043', title: 'INV-001 movement estimate (tower sequence)', author: 'Maj. A. Bello', when: '2026-08-21T06:55:00+01:00', class: 'SIMULATION DATA', status: 'ISSUED' },
  { id: 'RPT-2026-041', title: 'Zurmi–Shinkafi overnight incidents', author: 'Capt. M. Lawal', when: '2026-08-21T05:10:00+01:00', class: 'ANALYST VERIFIED', status: 'ISSUED' },
  { id: 'RPT-2026-038', title: 'AI lead review log (week 33)', author: 'Analyst cell', when: '2026-08-20T16:00:00+01:00', class: 'AI-GENERATED LEADS', status: 'ISSUED' },
];

export const ROADS = [
  { id: 'rd-1', name: 'A126 Gusau–Kaura Namoda', kind: 'highway', path: [[12.164, 6.661], [12.268, 6.556], [12.400, 6.560], [12.595, 6.579]] },
  { id: 'rd-2', name: 'Gusau–Anka road',         kind: 'highway', path: [[12.164, 6.661], [12.080, 6.400], [12.100, 5.935]] },
  { id: 'rd-3', name: 'Anka–Bukkuyum',           kind: 'road',    path: [[12.100, 5.935], [11.960, 5.560]] },
  { id: 'rd-4', name: 'Talata Mafara–Bakura',    kind: 'road',    path: [[12.569, 6.062], [12.760, 5.890]] },
  { id: 'rd-5', name: 'Maru–Dansadau track',     kind: 'track',   path: [[11.604, 6.404], [11.530, 6.280], [11.410, 6.150]] },
  { id: 'rd-6', name: 'Zurmi–Shinkafi',          kind: 'road',    path: [[12.776, 6.784], [12.900, 6.620], [13.089, 6.488]] },
  { id: 'rd-7', name: 'Gusau–Tsafe',             kind: 'road',    path: [[12.164, 6.661], [11.932, 6.920]] },
];

export const FOREST = [
  { id: 'ft-1', name: 'Dansadau bush belt', lat: 11.42, lng: 6.16, r: 14000 },
  { id: 'ft-2', name: 'Anka south forest',  lat: 11.72, lng: 5.80, r: 11000 },
  { id: 'ft-3', name: 'Maru west woodland', lat: 11.55, lng: 6.15, r: 9000 },
  { id: 'ft-4', name: 'Shinkafi north scrub', lat: 13.16, lng: 6.30, r: 10000 },
];

export const SEARCH_AREAS = [
  { id: 'SA-14', name: 'Dansadau search box', lat: 11.45, lng: 6.17, r: 4500, incident: 'INC-2026-0142' },
  { id: 'SA-11', name: 'Moriki sweep',        lat: 12.90, lng: 6.50, r: 3800, incident: 'INC-2026-0141' },
];

export function towerById(id) { return T[id] || null; }

export function deviceById(id) { return DEVICES.find((d) => d.id === id) || null; }

export function networkFor(deviceId) {
  const rows = CALLS.filter((c) => c.device === deviceId || c.otherId === deviceId);
  const map = new Map();
  rows.forEach((c) => {
    const other = c.device === deviceId ? (c.otherId || c.other) : c.device;
    const label = c.device === deviceId ? c.other : (deviceById(c.device)?.msisdn || c.device);
    const rec = map.get(other) || { id: other, label, n: 0, last: c.time, risk: 'UNKNOWN' };
    rec.n += 1;
    if (c.time > rec.last) rec.last = c.time;
    const d = DEVICES.find((x) => x.id === other);
    if (d) rec.risk = d.risk;
    map.set(other, rec);
  });
  return [...map.values()].sort((a, b) => b.n - a.n);
}

export const KPI_TRENDS = {
  incidents:  [4, 5, 6, 5, 7, 8, 9],
  highRisk:   [3, 3, 4, 4, 5, 5, 6],
  intel:      [8, 9, 7, 10, 11, 12, 14],
  emergency:  [2, 1, 3, 2, 4, 3, 5],
  numbers:    [3, 3, 4, 4, 5, 5, 5],
  locations:  [6, 7, 8, 9, 8, 10, 11],
  units:      [7, 7, 8, 8, 8, 9, 8],
};

export function incidentsAsDeposits() {
  return INCIDENTS.map((i) => ({
    id: i.id,
    name: INCIDENT_TYPES[i.type]?.label || i.type,
    lat: i.lat,
    lng: i.lng,
    resource: INCIDENT_TYPES[i.type]?.resource || 'other',
    status: i.status,
    state: 'Zamfara',
    lga: i.lga,
    tier: i.sev === 'critical' || i.sev === 'high' ? 'major' : 'minor',
  }));
}

export function heatFromRisk() {
  return LGAS.filter((l) => l.risk >= 50).map((l) => ({
    lat: l.lat,
    lng: l.lng,
    w: 0.45 + (l.risk / 100) * 0.7,
    i: 0.35 + (l.risk / 100) * 0.5,
    resource: l.risk >= 80 ? 'abduction' : l.risk >= 65 ? 'banditry' : 'armed',
    category: l.risk >= 80 ? 'abduction' : 'banditry',
  }));
}
