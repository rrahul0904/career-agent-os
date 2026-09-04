import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import { seedProfile, seedListings } from '../../../packages/domain/src/fixtures.js';

function json(value) { return JSON.stringify(value ?? null); }
function parse(value, fallback = null) {
  if (value == null) return fallback;
  try { return JSON.parse(value); } catch { return fallback; }
}

export class Store {
  constructor(filename = process.env.DATABASE_PATH || '.data/career-agent.db') {
    if (filename !== ':memory:') fs.mkdirSync(path.dirname(filename), { recursive: true });
    this.db = new DatabaseSync(filename);
    this.db.exec('PRAGMA foreign_keys = ON;');
    if (filename !== ':memory:') this.db.exec('PRAGMA journal_mode = WAL;');
    this.migrate();
    this.seed();
  }

  migrate() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS profile (
        id TEXT PRIMARY KEY,
        data TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS listings (
        id TEXT PRIMARY KEY,
        company TEXT NOT NULL,
        title TEXT NOT NULL,
        location TEXT NOT NULL,
        workplace TEXT NOT NULL,
        salary_min INTEGER,
        salary_max INTEGER,
        currency TEXT,
        description TEXT NOT NULL,
        skills TEXT NOT NULL,
        source TEXT NOT NULL,
        source_url TEXT,
        posted_at TEXT NOT NULL,
        active INTEGER NOT NULL DEFAULT 1,
        raw TEXT
      );
      CREATE TABLE IF NOT EXISTS pipeline (
        id TEXT PRIMARY KEY,
        listing_id TEXT NOT NULL UNIQUE,
        stage TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY(listing_id) REFERENCES listings(id)
      );
      CREATE TABLE IF NOT EXISTS application_packs (
        id TEXT PRIMARY KEY,
        listing_id TEXT NOT NULL,
        data TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY(listing_id) REFERENCES listings(id)
      );
      CREATE TABLE IF NOT EXISTS application_attempts (
        id TEXT PRIMARY KEY,
        listing_id TEXT NOT NULL,
        mode TEXT NOT NULL,
        status TEXT NOT NULL,
        data TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY(listing_id) REFERENCES listings(id)
      );
      CREATE TABLE IF NOT EXISTS ingestion_runs (
        id TEXT PRIMARY KEY,
        source TEXT NOT NULL,
        status TEXT NOT NULL,
        discovered INTEGER NOT NULL DEFAULT 0,
        upserted INTEGER NOT NULL DEFAULT 0,
        started_at TEXT NOT NULL,
        finished_at TEXT,
        error TEXT
      );
    `);
  }

  seed() {
    const count = this.db.prepare('SELECT COUNT(*) AS n FROM profile').get().n;
    if (!count) this.saveProfile(seedProfile);
    const jobs = this.db.prepare('SELECT COUNT(*) AS n FROM listings').get().n;
    if (!jobs) for (const listing of seedListings) this.upsertListing(listing);
  }

  getProfile() {
    const row = this.db.prepare('SELECT data FROM profile LIMIT 1').get();
    return parse(row?.data, {});
  }

  saveProfile(profile) {
    const value = { ...profile, id: profile.id || 'candidate-demo' };
    this.db.prepare(`INSERT INTO profile(id,data,updated_at) VALUES(?,?,?)
      ON CONFLICT(id) DO UPDATE SET data=excluded.data, updated_at=excluded.updated_at`)
      .run(value.id, json(value), new Date().toISOString());
    return value;
  }

  upsertListing(listing) {
    const row = {
      ...listing,
      workplace: listing.workplace || 'unknown',
      skills: listing.skills || [],
      source: listing.source || 'manual',
      postedAt: listing.postedAt || new Date().toISOString(),
      active: listing.active !== false,
    };
    this.db.prepare(`INSERT INTO listings(
      id,company,title,location,workplace,salary_min,salary_max,currency,description,skills,source,source_url,posted_at,active,raw
    ) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    ON CONFLICT(id) DO UPDATE SET
      company=excluded.company,title=excluded.title,location=excluded.location,workplace=excluded.workplace,
      salary_min=excluded.salary_min,salary_max=excluded.salary_max,currency=excluded.currency,
      description=excluded.description,skills=excluded.skills,source=excluded.source,source_url=excluded.source_url,
      posted_at=excluded.posted_at,active=excluded.active,raw=excluded.raw`)
      .run(row.id,row.company,row.title,row.location,row.workplace,row.salaryMin ?? null,row.salaryMax ?? null,row.currency ?? 'USD',row.description,json(row.skills),row.source,row.sourceUrl ?? null,row.postedAt,row.active ? 1 : 0,json(row.raw ?? null));
    return row;
  }

  listListings({ q = '', workplace = '', limit = 50 } = {}) {
    const clauses = ['active = 1'];
    const params = [];
    if (q) {
      clauses.push('(lower(title) LIKE ? OR lower(company) LIKE ? OR lower(description) LIKE ?)');
      const x=`%${q.toLowerCase()}%`; params.push(x,x,x);
    }
    if (workplace) { clauses.push('workplace = ?'); params.push(workplace); }
    params.push(Math.max(1, Math.min(Number(limit) || 50, 100)));
    return this.db.prepare(`SELECT * FROM listings WHERE ${clauses.join(' AND ')} ORDER BY posted_at DESC LIMIT ?`).all(...params).map(this.listingFromRow);
  }

  getListing(id) {
    const row = this.db.prepare('SELECT * FROM listings WHERE id = ?').get(id);
    return row ? this.listingFromRow(row) : null;
  }

  addPipeline(listingId, stage = 'saved') {
    const existing = this.db.prepare('SELECT * FROM pipeline WHERE listing_id = ?').get(listingId);
    const now = new Date().toISOString();
    if (existing) return this.updatePipeline(existing.id, stage);
    const id = `pipe-${crypto.randomUUID()}`;
    this.db.prepare('INSERT INTO pipeline(id,listing_id,stage,created_at,updated_at) VALUES(?,?,?,?,?)').run(id, listingId, stage, now, now);
    return this.getPipelineItem(id);
  }

  updatePipeline(id, stage) {
    this.db.prepare('UPDATE pipeline SET stage=?, updated_at=? WHERE id=?').run(stage, new Date().toISOString(), id);
    return this.getPipelineItem(id);
  }

  getPipelineItem(id) {
    const row = this.db.prepare(`SELECT p.*, l.company,l.title,l.location,l.workplace FROM pipeline p JOIN listings l ON l.id=p.listing_id WHERE p.id=?`).get(id);
    return row ? this.pipelineFromRow(row) : null;
  }

  listPipeline() {
    return this.db.prepare(`SELECT p.*, l.company,l.title,l.location,l.workplace FROM pipeline p JOIN listings l ON l.id=p.listing_id ORDER BY p.updated_at DESC`).all().map(this.pipelineFromRow);
  }

  saveApplicationPack(listingId, pack) {
    const id = `pack-${crypto.randomUUID()}`;
    this.db.prepare('INSERT INTO application_packs(id,listing_id,data,created_at) VALUES(?,?,?,?)').run(id, listingId, json(pack), new Date().toISOString());
    return { id, listingId, ...pack };
  }

  latestApplicationPack(listingId) {
    const row = this.db.prepare('SELECT * FROM application_packs WHERE listing_id=? ORDER BY created_at DESC LIMIT 1').get(listingId);
    return row ? { id: row.id, listingId: row.listing_id, ...parse(row.data, {}) } : null;
  }

  saveAttempt(listingId, attempt) {
    const id = `attempt-${crypto.randomUUID()}`;
    const now = new Date().toISOString();
    this.db.prepare('INSERT INTO application_attempts(id,listing_id,mode,status,data,created_at) VALUES(?,?,?,?,?,?)').run(id, listingId, attempt.mode, attempt.status, json(attempt), now);
    return { id, listingId, createdAt: now, ...attempt };
  }

  startIngestion(source) {
    const id = `ingest-${crypto.randomUUID()}`;
    this.db.prepare('INSERT INTO ingestion_runs(id,source,status,started_at) VALUES(?,?,?,?)').run(id, source, 'running', new Date().toISOString());
    return id;
  }

  finishIngestion(id, { discovered = 0, upserted = 0, error = null } = {}) {
    this.db.prepare('UPDATE ingestion_runs SET status=?,discovered=?,upserted=?,finished_at=?,error=? WHERE id=?')
      .run(error ? 'failed' : 'succeeded', discovered, upserted, new Date().toISOString(), error, id);
  }

  ingestionStats() {
    const jobs = this.db.prepare('SELECT COUNT(*) AS n FROM listings WHERE active=1').get().n;
    const pipeline = this.db.prepare('SELECT COUNT(*) AS n FROM pipeline').get().n;
    const packs = this.db.prepare('SELECT COUNT(*) AS n FROM application_packs').get().n;
    const attempts = this.db.prepare('SELECT COUNT(*) AS n FROM application_attempts').get().n;
    const lastRun = this.db.prepare('SELECT * FROM ingestion_runs ORDER BY started_at DESC LIMIT 1').get();
    return { jobs, pipeline, packs, attempts, lastRun: lastRun || null };
  }

  listingFromRow = (r) => ({
    id:r.id, company:r.company, title:r.title, location:r.location, workplace:r.workplace,
    salaryMin:r.salary_min, salaryMax:r.salary_max, currency:r.currency,
    description:r.description, skills:parse(r.skills, []), source:r.source, sourceUrl:r.source_url,
    postedAt:r.posted_at, active:Boolean(r.active)
  });

  pipelineFromRow = (r) => ({
    id:r.id, listingId:r.listing_id, stage:r.stage, createdAt:r.created_at, updatedAt:r.updated_at,
    listing:{ company:r.company,title:r.title,location:r.location,workplace:r.workplace }
  });
}
