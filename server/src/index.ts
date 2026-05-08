/**
 * Heart+ Backend - Cloudflare Worker
 * Handles ECG uploads, AI analysis, patient search, and prescriptions.
 */

export interface Env {
	DB: D1Database;
	BUCKET: R2Bucket;
	AI: any;
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);
		const { pathname } = url;

		// CORS Headers
		const corsHeaders = {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type",
		};

		if (request.method === "OPTIONS") {
			return new Response(null, { headers: corsHeaders });
		}

		try {
			// --- GET: Fetch Recent Reports ---
			if (pathname === "/api/reports" && request.method === "GET") {
				const { results } = await env.DB.prepare(
					"SELECT r.*, p.name as patient_name FROM ecg_reports r JOIN patients p ON r.patient_id = p.id ORDER BY r.upload_time DESC LIMIT 10"
				).all();
				return Response.json(results, { headers: corsHeaders });
			}

			// --- GET: Search Patient by Mobile ---
			if (pathname === "/api/patients/search" && request.method === "GET") {
				const mobile = url.searchParams.get("mobile");
				if (!mobile) return new Response("Mobile number required", { status: 400, headers: corsHeaders });

				const patient = await env.DB.prepare("SELECT * FROM patients WHERE mobile_number = ?").bind(mobile).first();
				if (!patient) return new Response("Patient not found", { status: 404, headers: corsHeaders });

				return Response.json(patient, { headers: corsHeaders });
			}

			// --- POST: Upload ECG & Analyze ---
			if (pathname === "/api/upload" && request.method === "POST") {
				const formData = await request.formData();
				const file = formData.get("file") as File;
				const patientId = formData.get("patientId") as string;
				const userId = formData.get("userId") as string;

				if (!file || !patientId) return new Response("Missing data", { status: 400, headers: corsHeaders });

				const reportId = `report_${crypto.randomUUID().slice(0, 8)}`;
				const fileName = `${reportId}_${file.name}`;

				// 1. Upload to R2
				await env.BUCKET.put(fileName, file.stream());
				const fileUrl = `/storage/${fileName}`;

				// 2. Save Report Entry
				await env.DB.prepare(
					"INSERT INTO ecg_reports (id, patient_id, uploaded_by, file_url, status) VALUES (?, ?, ?, ?, 'processing')"
				).bind(reportId, patientId, userId, fileUrl).run();

				// 3. Trigger Mock AI Analysis (Simulating Power Medical AI)
				// In production, you would call your AI service here
				const mockAnalysis = {
					id: `ai_${crypto.randomUUID().slice(0, 8)}`,
					report_id: reportId,
					confidence_score: 82.4,
					risk_level: "HIGH RISK",
					observations: "ST-segment elevation detected in inferior leads (II, III, aVF). Morphological analysis suggests high-probability acute myocardial infarction.",
					biomarkers: JSON.stringify(["Hyperacute T-waves", "ST-Elevation"]),
				};

				await env.DB.prepare(
					"INSERT INTO ai_analysis (id, report_id, confidence_score, risk_level, observations, biomarkers) VALUES (?, ?, ?, ?, ?, ?)"
				).bind(mockAnalysis.id, reportId, mockAnalysis.confidence_score, mockAnalysis.risk_level, mockAnalysis.observations, mockAnalysis.biomarkers).run();

				// Update report status
				await env.DB.prepare("UPDATE ecg_reports SET status = 'ai-evaluated' WHERE id = ?").bind(reportId).run();

				return Response.json({ success: true, reportId, analysis: mockAnalysis }, { headers: corsHeaders });
			}

			// --- POST: Save Prescription ---
			if (pathname === "/api/prescriptions" && request.method === "POST") {
				const data = await request.json() as any;
				const id = `pres_${crypto.randomUUID().slice(0, 8)}`;

				await env.DB.prepare(
					"INSERT INTO prescriptions (id, report_id, doctor_id, patient_id, diagnosis, notes, medications) VALUES (?, ?, ?, ?, ?, ?, ?)"
				).bind(id, data.reportId, data.doctorId, data.patientId, data.diagnosis, data.notes, JSON.stringify(data.medications)).run();

				return Response.json({ success: true, id }, { headers: corsHeaders });
			}

			// --- GET: Report Detail ---
			if (pathname.startsWith("/api/reports/") && request.method === "GET") {
				const reportId = pathname.split("/").pop();
				const report = await env.DB.prepare(
					"SELECT r.*, p.name as patient_name, p.age, p.gender, a.confidence_score, a.risk_level, a.observations, a.biomarkers " +
					"FROM ecg_reports r " +
					"JOIN patients p ON r.patient_id = p.id " +
					"LEFT JOIN ai_analysis a ON r.id = a.report_id " +
					"WHERE r.id = ?"
				).bind(reportId).first();

				if (!report) return new Response("Report not found", { status: 404, headers: corsHeaders });
				return Response.json(report, { headers: corsHeaders });
			}

			return new Response("Not Found", { status: 404, headers: corsHeaders });
		} catch (err: any) {
			return new Response(err.message, { status: 500, headers: corsHeaders });
		}
	},
};
