import db from "../lib/db";
import { v4 as uuidv4 } from "uuid";

// ─── Idempotent Seed Script ─────────────────────────────────────
const clientCount = db.prepare("SELECT COUNT(*) as count FROM clients").get() as { count: number };

if (clientCount.count > 0) {
  console.log("Database already seeded. Skipping.");
  process.exit(0);
}

console.log("Seeding database...");

// ─── Sample Clients ─────────────────────────────────────────────
const clients = [
  { id: uuidv4(), company_name: "Acme Corp", entity_type: "Private Limited", country: "India" },
  { id: uuidv4(), company_name: "Bright Industries", entity_type: "LLP", country: "India" },
  { id: uuidv4(), company_name: "CloudNine Technologies", entity_type: "Private Limited", country: "India" },
  { id: uuidv4(), company_name: "Delta Exports", entity_type: "Partnership", country: "India" },
  { id: uuidv4(), company_name: "Evergreen Solutions", entity_type: "Sole Proprietorship", country: "India" },
];

const insertClient = db.prepare(
  "INSERT INTO clients (id, company_name, entity_type, country) VALUES (?, ?, ?, ?)"
);

for (const c of clients) {
  insertClient.run(c.id, c.company_name, c.entity_type, c.country);
}
console.log(`Inserted ${clients.length} clients.`);

// ─── Sample Tasks ───────────────────────────────────────────────
const insertTask = db.prepare(
  `INSERT INTO tasks (id, client_id, title, category, due_date, status, priority, description) 
   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
);

const taskTemplates = [
  // Acme Corp tasks
  { clientIdx: 0, title: "GSTR-1 Filing — March 2026", category: "GST", due_date: "2026-04-11", status: "Pending", priority: "High", description: "Monthly GSTR-1 return for outward supplies" },
  { clientIdx: 0, title: "GSTR-3B Filing — February 2026", category: "GST", due_date: "2026-03-20", status: "Completed", priority: "High", description: "Monthly summary return" },
  { clientIdx: 0, title: "TDS Q4 Return", category: "TDS", due_date: "2026-03-15", status: "Pending", priority: "High", description: "Quarterly TDS return for Jan-Mar 2026" },
  { clientIdx: 0, title: "Advance Tax — Q4 Installment", category: "Income Tax", due_date: "2026-03-15", status: "In Progress", priority: "Medium", description: "Fourth installment of advance tax" },
  { clientIdx: 0, title: "ROC Annual Return", category: "ROC Compliance", due_date: "2026-05-30", status: "Pending", priority: "Medium", description: "Annual filing with Registrar of Companies" },
  { clientIdx: 0, title: "Professional Tax Renewal", category: "Other", due_date: "2026-03-01", status: "Pending", priority: "Low", description: "Annual professional tax registration renewal" },

  // Bright Industries tasks
  { clientIdx: 1, title: "GSTR-1 Filing — March 2026", category: "GST", due_date: "2026-04-11", status: "Pending", priority: "High", description: "Monthly GSTR-1 return" },
  { clientIdx: 1, title: "TDS Q4 Return", category: "TDS", due_date: "2026-03-15", status: "Pending", priority: "High", description: "Quarterly TDS return" },
  { clientIdx: 1, title: "LLP Form 11 — Annual Return", category: "ROC Compliance", due_date: "2026-05-30", status: "Pending", priority: "Medium", description: "LLP annual return filing" },
  { clientIdx: 1, title: "Income Tax Audit Report", category: "Income Tax", due_date: "2026-03-10", status: "Completed", priority: "High", description: "Tax audit under Section 44AB" },
  { clientIdx: 1, title: "GST Annual Return — FY 2025-26", category: "GST", due_date: "2026-12-31", status: "Pending", priority: "Low", description: "GSTR-9 annual return" },
  { clientIdx: 1, title: "Shop & Establishment Renewal", category: "Other", due_date: "2026-02-28", status: "Pending", priority: "Low", description: "State-level shop license renewal" },

  // CloudNine Technologies tasks
  { clientIdx: 2, title: "GSTR-3B Filing — March 2026", category: "GST", due_date: "2026-04-20", status: "Pending", priority: "High", description: "Monthly GSTR-3B summary return" },
  { clientIdx: 2, title: "TDS on Salary — March 2026", category: "TDS", due_date: "2026-04-07", status: "Pending", priority: "Medium", description: "Monthly TDS deposit for employee salaries" },
  { clientIdx: 2, title: "ITR Filing — FY 2024-25", category: "Income Tax", due_date: "2026-03-31", status: "In Progress", priority: "High", description: "Belated/revised ITR filing deadline" },
  { clientIdx: 2, title: "Director KYC Update", category: "ROC Compliance", due_date: "2026-04-30", status: "Pending", priority: "Medium", description: "Annual DIR-3 KYC for all directors" },
  { clientIdx: 2, title: "GSTR-2B Reconciliation — Feb", category: "GST", due_date: "2026-03-14", status: "Completed", priority: "Medium", description: "Monthly ITC reconciliation" },
  { clientIdx: 2, title: "Statutory Audit Coordination", category: "Other", due_date: "2026-04-15", status: "Pending", priority: "High", description: "Coordinate with auditor for FY closing" },

  // Delta Exports tasks
  { clientIdx: 3, title: "GSTR-1 Filing — March 2026", category: "GST", due_date: "2026-04-11", status: "Pending", priority: "High", description: "Monthly outward supply return" },
  { clientIdx: 3, title: "Export Incentive Claim — MEIS", category: "Other", due_date: "2026-03-05", status: "Pending", priority: "Medium", description: "Claim duty credit scrips under MEIS scheme" },
  { clientIdx: 3, title: "Advance Tax — Final Installment", category: "Income Tax", due_date: "2026-03-15", status: "Completed", priority: "High", description: "Final advance tax for FY 2025-26" },
  { clientIdx: 3, title: "TDS Payment — February 2026", category: "TDS", due_date: "2026-03-07", status: "Pending", priority: "High", description: "Monthly TDS challan deposit" },
  { clientIdx: 3, title: "Partnership Deed Amendment", category: "ROC Compliance", due_date: "2026-06-15", status: "Pending", priority: "Low", description: "Update partnership deed for new partner" },
  { clientIdx: 3, title: "LUT Filing for Exports", category: "GST", due_date: "2026-03-31", status: "In Progress", priority: "Medium", description: "Letter of Undertaking for export without IGST" },

  // Evergreen Solutions tasks
  { clientIdx: 4, title: "GSTR-3B Filing — March 2026", category: "GST", due_date: "2026-04-20", status: "Pending", priority: "High", description: "Monthly summary return" },
  { clientIdx: 4, title: "TDS Q4 Return", category: "TDS", due_date: "2026-03-15", status: "In Progress", priority: "High", description: "Quarterly TDS return Jan-Mar 2026" },
  { clientIdx: 4, title: "Proprietor ITR Preparation", category: "Income Tax", due_date: "2026-07-31", status: "Pending", priority: "Medium", description: "Income tax return for sole proprietor" },
  { clientIdx: 4, title: "MSME Registration Renewal", category: "Other", due_date: "2026-03-10", status: "Pending", priority: "Low", description: "Udyam registration update" },
  { clientIdx: 4, title: "GST Registration Amendment", category: "GST", due_date: "2026-03-08", status: "Completed", priority: "Medium", description: "Update principal place of business" },
  { clientIdx: 4, title: "Compliance Calendar Review", category: "Other", due_date: "2026-04-01", status: "Pending", priority: "Low", description: "Quarterly compliance calendar planning" },
];

for (const t of taskTemplates) {
  insertTask.run(
    uuidv4(),
    clients[t.clientIdx].id,
    t.title,
    t.category,
    t.due_date,
    t.status,
    t.priority,
    t.description
  );
}

console.log(`Inserted ${taskTemplates.length} tasks.`);
console.log("Database seeded successfully!");
