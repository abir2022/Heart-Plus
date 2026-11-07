# Heart+ — ECG triage and prescription workflow

A clinic workflow prototype: a lab assistant uploads an ECG, an AI model drafts a reading, a doctor corrects and approves it, and the patient sees only what the doctor signed off on.

> ## ⚠️ Educational prototype — not a medical device
> **Heart+ is a software engineering demonstration. It is not a diagnostic tool, it has not been clinically validated, and it must never be used to make decisions about a real patient.** All patient records in this build are fictional seed data. Do not enter real patient information into the hosted demo.

`React 19` · `Vite` · `Cloudflare Workers` · `D1` · `R2` · `Workers AI` · `TypeScript`

🌐 Live demo: https://heart-plus-nine.vercel.app

---

## Why it exists

I wanted to answer a concrete engineering question: *can a complete clinical workflow — upload, AI draft, clinician override, patient-facing result — run with no server to operate?* The whole backend is one Cloudflare Worker with D1 for records, R2 for scan files, and a draft reading for a clinician to review. No container, no managed database bill, no ops.

The human-in-the-loop shape is deliberate. The AI never publishes a result; it produces a draft with a confidence value that a clinician must review and correct. Anything else would be a medical device, and this is a portfolio project.

## The workflow

1. **Lab assistant** signs in, looks up or registers a patient by mobile number, uploads an ECG trace.
2. **The Worker** stores the file in R2, the row in D1, and attaches a draft reading — risk level, observations, biomarkers, confidence — for the doctor to review.
3. **Doctor** opens the report, edits the AI's observations (the editable fields are the point), writes a diagnosis, notes and medications, signs, and approves.
4. **Patient** looks up the report with a report ID or mobile number and sees the approved reading and prescription — or nothing, until it is approved.
5. **Prescription** renders as a printable sheet for the clinic printer.

## Data model

| Table | Holds |
|---|---|
| `users` | staff accounts — roles `doctor` and `lab-assistant` |
| `patients` | name, age, gender, mobile (unique key used for lookup), history |
| `ecg_reports` | the uploaded file reference, status, approval flag |
| `ai_analysis` | draft `risk_level`, `observations`, `biomarkers`, `confidence_score` |
| `prescriptions` | diagnosis, notes, medications, doctor signature — one per report |

Schema lives in [`server/migrations/0000_initial_schema.sql`](server/migrations/0000_initial_schema.sql).

## Architecture

```
React (Vite) ──fetch──> Cloudflare Worker ──┬──> D1   (patients, reports, prescriptions)
                                            ├──> R2   (ECG files)
                                            └──> ai_analysis (draft reading for the clinician)
```

## The AI part, precisely

`ai_analysis` holds what a clinician reviews: a risk level, observations, biomarker notes and a confidence score. The schema and the review screens are built around that record, and the `AI` binding in `wrangler.jsonc` marks where inference attaches.

What this repository does **not** contain is a validated model or a measured result: no training set of my own, no labelled ECG corpus, no sensitivity or specificity. So the record is always a draft that a clinician edits and signs, and no accuracy claim of any kind should be read into this repo.

## Privacy and ethics (what a real deployment would require)

This is a health application, so the gaps deserve to be named rather than hidden:

- **No real data.** Seed records are invented. The demo exists so the workflow can be evaluated, not so data can be collected.
- A production version needs encryption at rest and in transit, a full audit trail per record access, retention and deletion policy, patient consent and a DPIA before a single line of this schema is reused.
- It would also need a clinical evaluation and, in most jurisdictions, regulatory classification as a medical device (FDA/MDR). None of that has been done.
- Uploads are not virus-scanned and there is no rate limiting.

## Security status — read before deploying

This build is a **prototype**, and its security is prototype-grade. Known and intentional limitations:

| Limitation | Detail |
|---|---|
| Passwords are seeded in plain text | `users.password` stores and compares raw strings (`schema.sql` seeds demo staff logins). A real build needs Argon2id or bcrypt. |
| No session tokens | The login endpoint returns the user row; later requests are not authenticated or authorised. |
| Permissive CORS | `Access-Control-Allow-Origin: *` on every route. |
| Public lookup | A report can be fetched with a mobile number or report ID and no other proof of identity. |

These are published as known limitations, not as unseen bugs. Treat the hosted demo as a UI/architecture demonstration.

## Run it locally

**Frontend**

```bash
npm install
npm run dev
```

**Backend (Worker)**

```bash
cd server
npm install
npx wrangler d1 create heart-plus-db        # then paste the id into wrangler.jsonc
npx wrangler d1 migrations apply heart-plus-db
npx wrangler dev                            # http://localhost:8787
```

An `R2` bucket (`ecg-scans`) and the `AI` binding are declared in [`server/wrangler.jsonc`](server/wrangler.jsonc).

## If I continued

1. Real auth: hashed passwords, short-lived signed sessions, per-role authorisation on every route.
2. A clinical audit trail — who viewed, who edited, what changed, immutable.
3. Validate the model against a labelled dataset before any clinical claim, and publish the metrics even if they are discouraging.
4. Make the demo safe to share: seeded accounts behind a flag, no public lookup.

## Stack

React 19 · Vite · React Router · Recharts · Cloudflare Workers · D1 · R2  · TypeScript · Vitest

---

**Md. Abir Ul Islam** · [GitHub](https://github.com/abir2022) · [LinkedIn](https://www.linkedin.com/in/md-abir-ul-islam/)
