import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const RESEARCH_THREADS = ['MPT', 'Hall thruster', 'Diagnostics course'] as const;
const researchThread = z.enum(RESEARCH_THREADS);
const researchThreadField = z.union([researchThread, z.array(researchThread)]);

const yyyyMm = z.string().regex(/^\d{4}-\d{2}$/, 'Use YYYY-MM');

const members = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/members' }),
  schema: ({ image }) => z.object({
    name: z.string(),
    role: z.enum(['PI', 'postdoc', 'PhD student', 'MS student', 'undergrad', 'staff']),
    status: z.enum(['active', 'former', 'alumni']),
    joined: yyyyMm.optional(),
    left: yyyyMm.optional(),
    research_thread: researchThreadField.optional(),
    photo: image().optional(),
    email: z.string().email().optional(),
    website: z.string().url().optional(),
    orcid: z.string().optional(),
  }),
});

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    kind: z.enum(['news', 'presentation', 'award', 'media']),
    authors: z.array(z.string()).optional(),
    links: z.array(z.object({ label: z.string(), url: z.string().url() })).optional(),
    research_thread: researchThreadField.optional(),
  }),
});

const publications = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/publications' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    kind: z.enum(['journal', 'conference', 'preprint', 'thesis']),
    authors: z.array(z.string()),
    venue: z.string(),
    doi: z.string().optional(),
    arxiv: z.string().optional(),
    links: z.array(z.object({ label: z.string(), url: z.string().url() })).optional(),
    research_thread: researchThreadField.optional(),
  }),
});

export const collections = { members, news, publications };
