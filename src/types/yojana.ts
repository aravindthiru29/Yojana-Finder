import { z } from 'zod';

export type Language = 'en' | 'ta' | 'hi';

export const SCHEME_CATEGORIES = [
  'Agriculture',
  'Education',
  'Health',
  'Housing',
  'Employment',
  'Women & Child',
  'Pension',
  'Business',
  'Skill',
  'Social Security',
] as const;

export type SchemeCategory = (typeof SCHEME_CATEGORIES)[number];

export type SchemeLevel = 'Central' | 'State';
export type ApplyMode = 'Online' | 'Offline' | 'Both';

export const SpecialStatusSchema = z.object({
  disability: z.boolean(),
  widow: z.boolean(),
  bpl: z.boolean(),
  pregnantOrLactating: z.boolean(),
  exServiceman: z.boolean(),
});

export type SpecialStatus = z.infer<typeof SpecialStatusSchema>;

export const UserProfileSchema = z.object({
  age: z.number().int().min(0).max(120),
  gender: z.enum(['Female', 'Male', 'Other']),
  state: z.string().min(1),
  areaType: z.enum(['Rural', 'Urban']),
  occupation: z.string().min(1),
  annualIncome: z.string().min(1),
  category: z.enum(['General', 'OBC', 'SC', 'ST', 'EWS', 'Minority']),
  education: z.string().min(1),
  specialStatus: SpecialStatusSchema,
  situationDescription: z.string().max(1200).optional().default(''),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

const CategoryEnum = z.enum(SCHEME_CATEGORIES);

function normalizeCategory(val: unknown): SchemeCategory {
  if (typeof val !== 'string') return 'Social Security';
  const trimmed = val.trim();
  const exact = SCHEME_CATEGORIES.find(
    (c) => c.toLowerCase() === trimmed.toLowerCase()
  );
  if (exact) return exact;
  if (/agri|farm|kisan|crop/i.test(trimmed)) return 'Agriculture';
  if (/edu|scholar|student|school|college/i.test(trimmed)) return 'Education';
  if (/health|med|ayush|hospital/i.test(trimmed)) return 'Health';
  if (/hous|awas|home/i.test(trimmed)) return 'Housing';
  if (/employ|job|nrega|wage|labour|labor/i.test(trimmed)) return 'Employment';
  if (/women|child|girl|matern|widow|beti/i.test(trimmed)) return 'Women & Child';
  if (/pension|old|senior|retire/i.test(trimmed)) return 'Pension';
  if (/busi|mudra|msme|loan|entre/i.test(trimmed)) return 'Business';
  if (/skill|train|kaushal|vocation/i.test(trimmed)) return 'Skill';
  return 'Social Security';
}

function normalizeLevel(val: unknown): SchemeLevel {
  if (typeof val === 'string' && /state/i.test(val)) return 'State';
  return 'Central';
}

function normalizeApplyMode(val: unknown): ApplyMode {
  if (typeof val !== 'string') return 'Both';
  if (/both/i.test(val)) return 'Both';
  if (/offline/i.test(val)) return 'Offline';
  if (/online/i.test(val)) return 'Online';
  return 'Both';
}

export const SchemeSchema = z.object({
  name: z.string().min(1),
  category: z.preprocess(normalizeCategory, CategoryEnum),
  level: z.preprocess(normalizeLevel, z.enum(['Central', 'State'])),
  ministry_or_department: z.string().min(1),
  benefit_summary: z.string().min(1),
  benefit_amount: z.string().min(1),
  why_eligible: z.string().min(1),
  eligibility_match_percent: z.coerce.number().min(0).max(100),
  eligibility_criteria: z.array(z.string().min(1)).min(1),
  documents_required: z.array(z.string().min(1)).min(1),
  how_to_apply_steps: z.array(z.string().min(1)).min(1),
  apply_mode: z.preprocess(normalizeApplyMode, z.enum(['Online', 'Offline', 'Both'])),
  official_link: z.string().min(1),
  helpline: z.string().optional().default(''),
  last_date_or_deadline: z.string().optional().default(''),
  tip: z.string().optional().default(''),
});

export type Scheme = z.infer<typeof SchemeSchema>;

export const GroundingSourceSchema = z.object({
  title: z.string(),
  uri: z.string(),
});

export type GroundingSource = z.infer<typeof GroundingSourceSchema>;

export const SchemesPayloadSchema = z.object({
  overall_summary: z.string().min(1),
  total_schemes_found: z.coerce.number().int().min(0),
  estimated_total_annual_benefit_if_known: z.string().optional().default(''),
  schemes: z.array(SchemeSchema),
  sources: z.array(GroundingSourceSchema).optional().default([]),
});

export type SchemesPayload = z.infer<typeof SchemesPayloadSchema>;

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  sources?: GroundingSource[];
  timestamp: number;
}
