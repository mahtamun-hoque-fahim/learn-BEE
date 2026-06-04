import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  timestamp,
  jsonb,
  pgEnum,
} from 'drizzle-orm/pg-core'

// ─── Enums ───────────────────────────────────────────────────────────────────

export const roleEnum = pgEnum('role', ['student', 'moderator', 'admin'])
export const genderEnum = pgEnum('gender', ['male', 'female', 'other'])

// Certification pipeline states
// pending   → student submitted, awaiting anyone to open
// reviewing → a moderator/admin has opened it
// approved  → admin approved; BOTH certificates unlock simultaneously
// rejected  → sent back with reason; student can resubmit
export const certStatusEnum = pgEnum('cert_status', [
  'pending',
  'reviewing',
  'approved',
  'rejected',
])

// ─── Users (synced from Clerk webhooks) ──────────────────────────────────────

export const users = pgTable('users', {
  id: text('id').primaryKey(),                   // Better Auth user ID
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  name: text('name').notNull(),
  image: text('image'),
  role: roleEnum('role').default('student').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ─── Better Auth core tables (session / account / verification) ───────────────
export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const verifications = pgTable('verifications', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ─── Chapter progress ────────────────────────────────────────────────────────

export const userProgress = pgTable('user_progress', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  chapterId: text('chapter_id').notNull(),
  topicsRead: jsonb('topics_read').default([]),
  simulatorDone: boolean('simulator_done').default(false),
  quizPassed: boolean('quiz_passed').default(false),
  quizScore: integer('quiz_score').default(0),
  completed: boolean('completed').default(false),
  completedAt: timestamp('completed_at'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ─── Quiz attempts ───────────────────────────────────────────────────────────

export const quizAttempts = pgTable('quiz_attempts', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  chapterId: text('chapter_id').notNull(),
  answers: jsonb('answers').notNull(),
  score: integer('score').notNull(),
  total: integer('total').notNull(),
  passed: boolean('passed').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ─── Bonus exam attempts ─────────────────────────────────────────────────────

export const bonusAttempts = pgTable('bonus_attempts', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  answers: jsonb('answers').notNull(),
  score: integer('score').notNull(),
  total: integer('total').notNull(),
  passed: boolean('passed').notNull(),
  mode: text('mode').notNull().default('practice'),
  timeTaken: integer('time_taken').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ─── Certificate registration submissions ────────────────────────────────────
//
// Student fills once after finishing all chapters + bonus exam.
// One row per student. Resubmittable on rejection.
//
// QUOTE LOGIC (priority order):
//   1. adminCustomQuote — personally written by admin during review
//   2. defaultQuotes pool — system picks random active quote by gender
//      if admin leaves the quote blank at approval time
//
// ONE APPROVAL → BOTH certificates (completion + verified) unlock together.
// There is no separate per-certificate approval.

export const certRegistrations = pgTable('cert_registrations', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' })
    .unique(),                                   // one active submission per student

  // Student-filled fields
  studentName: text('student_name').notNull(),
  university: text('university').notNull(),
  department: text('department').notNull(),
  semester: text('semester').notNull(),          // '1st' .. '8th'
  gender: genderEnum('gender').notNull(),
  additionalNote: text('additional_note'),       // optional message to reviewer

  // Pipeline state
  status: certStatusEnum('status').default('pending').notNull(),
  submittedAt: timestamp('submitted_at').defaultNow().notNull(),
  reviewedBy: text('reviewed_by').references(() => users.id),
  reviewedAt: timestamp('reviewed_at'),
  approvedBy: text('approved_by').references(() => users.id),
  approvedAt: timestamp('approved_at'),
  rejectionReason: text('rejection_reason'),

  // Quote fields
  // adminCustomQuote: written by admin during review (personal, unique per student)
  // finalQuote: resolved at approval — adminCustomQuote if set, else auto-picked default
  adminCustomQuote: text('admin_custom_quote'),
  finalQuote: text('final_quote'),

  // Coursework snapshot at submission time (for auditing)
  bonusScore: integer('bonus_score').default(0),
  chaptersCompleted: integer('chapters_completed').default(0),
})

// ─── Default quote pool ───────────────────────────────────────────────────────
//
// Managed by admin in the admin dashboard.
// Used ONLY when admin does not write a personal quote for a student.
// Filtered by gender at pick time; falls back to 'all' if no gender match.

export const defaultQuotes = pgTable('default_quotes', {
  id: uuid('id').defaultRandom().primaryKey(),
  quote: text('quote').notNull(),
  gender: text('gender').notNull().default('all'), // 'male' | 'female' | 'other' | 'all'
  isActive: boolean('is_active').default(true).notNull(),
  addedBy: text('added_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ─── Email notification log ──────────────────────────────────────────────────

export const emailLog = pgTable('email_log', {
  id: uuid('id').defaultRandom().primaryKey(),
  registrationId: uuid('registration_id')
    .notNull()
    .references(() => certRegistrations.id, { onDelete: 'cascade' }),
  recipient: text('recipient').notNull(),
  type: text('type').notNull(), // 'new_submission' | 'approved' | 'rejected'
  sentAt: timestamp('sent_at').defaultNow().notNull(),
})

// ─── Admin settings ───────────────────────────────────────────────────────────

export const adminSettings = pgTable('admin_settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})


// ─── Content collections (admin/staff-managed: lectures, labs, papers, books) ──

export const lectureTypeEnum = pgEnum('lecture_type', ['Lecture', 'Tutorial', 'Review'])
export const lectureExtEnum  = pgEnum('lecture_ext',  ['PDF', 'PPT', 'DOC'])
export const paperTypeEnum   = pgEnum('paper_type',   ['Midterm', 'Final', 'CT', 'Quiz'])
export const bookTagEnum     = pgEnum('book_tag',     ['Primary', 'Reference', 'Optional'])

export const lectures = pgTable('lectures', {
  id: uuid('id').defaultRandom().primaryKey(),
  /** Chapter id (e.g. 'ch1'). Free-form so we don't have to FK the in-memory curriculum. */
  chapterId: text('chapter_id').notNull(),
  title: text('title').notNull(),
  date: text('date'),               // 'Jan 14'
  duration: text('duration'),       // '42 min'
  type: lectureTypeEnum('type').default('Lecture').notNull(),
  pages: integer('pages').default(0),
  ext: lectureExtEnum('ext').default('PDF').notNull(),
  fileUrl: text('file_url'),
  videoUrl: text('video_url'),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdBy: text('created_by'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const labs = pgTable('labs', {
  id: uuid('id').defaultRandom().primaryKey(),
  /** Lab number as a string so '01' renders correctly. */
  number: text('number').notNull(),
  title: text('title').notNull(),
  hasVideo: boolean('has_video').default(false).notNull(),
  hasManual: boolean('has_manual').default(false).notNull(),
  contributor: text('contributor'),
  videoLength: text('video_length'),   // '06:24' or '—'
  videoUrl: text('video_url'),
  manualUrl: text('manual_url'),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdBy: text('created_by'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const papers = pgTable('papers', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  session: text('session'),         // 'Spring 2024'
  type: paperTypeEnum('type').default('Midterm').notNull(),
  pages: integer('pages').default(0),
  qCount: integer('q_count').default(0),
  fileUrl: text('file_url'),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdBy: text('created_by'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const books = pgTable('books', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  author: text('author').notNull(),
  edition: text('edition'),
  tag: bookTagEnum('tag').default('Primary').notNull(),
  note: text('note'),
  swatch: text('swatch').default('#1F3A5F').notNull(),
  externalUrl: text('external_url'),
  coverUrl: text('cover_url'),
  fileUrl: text('file_url'),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdBy: text('created_by'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})



// ─── Backward-compat aliases (pre-existing route imports) ─────────────────
export const certificates = certRegistrations
export const adminQuotes = defaultQuotes
