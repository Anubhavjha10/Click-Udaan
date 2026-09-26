import { describe, it, expect } from "vitest";

// Replicate sorting logic from useCertificates
function getSortTimestamp(cert: any): number {
  const parseValue = (val: any): number => {
    if (!val) return 0;
    if (typeof val.toMillis === "function") return val.toMillis();
    if (typeof val.toDate === "function") return val.toDate().getTime();
    if (typeof val.seconds === "number") return val.seconds * 1000;
    if (val instanceof Date) return val.getTime();
    const parsed = Date.parse(val);
    return isNaN(parsed) ? 0 : parsed;
  };

  const created = parseValue(cert.createdAt);
  if (created > 0) return created;

  const updated = parseValue(cert.updatedAt);
  if (updated > 0) return updated;

  const issued = parseValue(cert.issueDate);
  if (issued > 0) return issued;

  return 0;
}

describe("Certificate Sorting & Inclusion", () => {
  it("does not drop documents missing createdAt and orders newest first", () => {
    const certs = [
      { id: "cert-legacy", studentName: "Legacy Student", issueDate: "01 January 2026" },
      { id: "cert-new", studentName: "New Student", createdAt: { seconds: 1790400000 } },
      { id: "cert-updated", studentName: "Updated Student", updatedAt: { seconds: 1790390000 } },
      { id: "cert-no-time", studentName: "No Time Student" },
    ];

    const sorted = [...certs].sort((a, b) => getSortTimestamp(b) - getSortTimestamp(a));

    // All 4 documents must be present (none dropped)
    expect(sorted.length).toBe(4);
    expect(sorted.map((c) => c.id)).toContain("cert-legacy");
    expect(sorted.map((c) => c.id)).toContain("cert-new");
    expect(sorted.map((c) => c.id)).toContain("cert-updated");
    expect(sorted.map((c) => c.id)).toContain("cert-no-time");

    // The one with the highest timestamp is first
    expect(sorted[0].id).toBe("cert-new");
  });

  it("handles Firestore Timestamp object formats (.toDate and .toMillis)", () => {
    const cert1 = {
      id: "cert-millis",
      createdAt: { toMillis: () => 1790500000000 },
    };
    const cert2 = {
      id: "cert-date",
      createdAt: { toDate: () => new Date("2026-09-25T10:00:00Z") },
    };

    expect(getSortTimestamp(cert1)).toBe(1790500000000);
    expect(getSortTimestamp(cert2)).toBe(new Date("2026-09-25T10:00:00Z").getTime());
  });
});

describe("Admin Certificate Filtering", () => {
  const sampleCerts = [
    {
      id: "CU-1",
      studentName: "Anubhav Jha",
      email: "anubhav@example.com",
      course: "Full Stack",
      internshipStatus: "Active",
      status: "Active",
      certificateImageUrl: "",
    },
    {
      id: "CU-2",
      studentName: "Rahul Sharma",
      email: "rahul@example.com",
      course: "Web Dev",
      internshipStatus: "Completed",
      status: "Completed",
      certificateImageUrl: "https://res.cloudinary.com/test/image.png",
    },
    {
      id: "CU-3",
      studentName: "Priya Singh",
      email: "priya@example.com",
      course: "Digital Marketing",
      internshipStatus: undefined,
      status: "Active",
      certificateImageUrl: "",
    },
  ];

  it("includes all certificates when statusFilter is 'all'", () => {
    const filter = (statusFilter: string) =>
      sampleCerts.filter((c: any) => {
        if (statusFilter === "all") return true;
        if (statusFilter === "active")
          return c.internshipStatus === "Active" || c.status === "Active" || !c.internshipStatus;
        if (statusFilter === "completed")
          return c.internshipStatus === "Completed" || c.status === "Completed";
        if (statusFilter === "issued") return Boolean(c.certificateImageUrl);
        if (statusFilter === "pending") return !c.certificateImageUrl;
        return true;
      });

    expect(filter("all").length).toBe(3);
    expect(filter("active").length).toBe(2); // CU-1 and CU-3 (undefined internshipStatus defaults to active)
    expect(filter("completed").length).toBe(1); // CU-2
    expect(filter("issued").length).toBe(1); // CU-2
    expect(filter("pending").length).toBe(2); // CU-1 and CU-3
  });
});
