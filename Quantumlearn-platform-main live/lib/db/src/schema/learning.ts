import { integer, jsonb, pgTable, real, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

export const experiments = pgTable('experiments', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(),
  circuit: jsonb('circuit').notNull(),
  algorithm: text('algorithm'),
  qubitCount: integer('qubit_count').notNull(),
  prediction: jsonb('prediction'),
  actualResult: jsonb('actual_result').notNull(),
  accuracy: real('accuracy'),
  shots: integer('shots').notNull().default(1024),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const topicMastery = pgTable('topic_mastery', {
  userId: text('user_id').notNull(),
  topic: text('topic').notNull(),
  mastery: real('mastery').notNull().default(0),
  attempts: integer('attempts').notNull().default(0),
  correct: integer('correct').notNull().default(0),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const quizAttempts = pgTable('quiz_attempts', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(),
  topic: text('topic').notNull(),
  score: integer('score').notNull(),
  total: integer('total').notNull(),
  answers: jsonb('answers').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const insertExperimentSchema = createInsertSchema(experiments);
export const insertQuizAttemptSchema = createInsertSchema(quizAttempts);
