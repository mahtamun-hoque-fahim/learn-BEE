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
  id: text('id').primaryKey(),                   // Clerk user ID
  email: text('email').notNull().unique(),
  name: text('name'),
  role: roleEnum('role').default('student').notNull(),
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
