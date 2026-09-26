import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { TeamMember } from "../types/database";

export function usePublicTeam() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Query active team members. We deliberately avoid a Firestore-level compound orderBy
      // to eliminate the requirement for a composite index. In-memory sorting is applied below.
      const q = query(
        collection(db, "team"),
        where("active", "==", true)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const rawDocs = snapshot.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Omit<TeamMember, "id">),
          }));

          // Strict boolean verification for active === true
          const activeList = rawDocs.filter((m) => m.active === true);

          // In-memory sort by displayOrder
          activeList.sort((a, b) => (Number(a.displayOrder) || 999) - (Number(b.displayOrder) || 999));

          // Safe development logging
          console.log(`[TEAM_DEBUG]\nDocuments fetched: ${snapshot.size}\nActive members: ${activeList.length}`);

          setMembers(activeList);
          setError(null);
          setLoading(false);
        },
        (err: any) => {
          console.error(
            `[TEAM_DEBUG]\nFirestore error code: ${err.code || "unknown"}\nFirestore error message: ${err.message || err}`
          );
          setError(err.message || "Failed to load team members");
          setMembers([]);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err: any) {
      console.error(
        `[TEAM_DEBUG]\nFirestore error code: ${err.code || "exception"}\nFirestore error message: ${err.message || err}`
      );
      setError(err.message || "Exception while fetching team members");
      setMembers([]);
      setLoading(false);
    }
  }, []);

  return { members, loading, error };
}

export function useAdminTeam() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const snapshot = await getDocs(collection(db, "team"));
      const list: TeamMember[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<TeamMember, "id">),
      }));
      list.sort((a, b) => (Number(a.displayOrder) || 999) - (Number(b.displayOrder) || 999));
      setMembers(list);
    } catch (err: any) {
      console.error("Error fetching admin team:", err);
      setError(err.message || "Failed to fetch team members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const saveMember = async (member: Partial<TeamMember> & { id?: string }) => {
    try {
      const id = member.id || `member_${Date.now()}`;
      const docRef = doc(db, "team", id);
      const payload: any = {
        name: member.name || "",
        designation: member.designation || "",
        description: member.description || "",
        displayOrder: member.displayOrder ?? members.length + 1,
        active: member.active ?? true,
        updatedAt: serverTimestamp(),
      };
      if (member.imageUrl) payload.imageUrl = member.imageUrl;
      if (member.imagePublicId) payload.imagePublicId = member.imagePublicId;
      if (member.linkedin) payload.linkedin = member.linkedin;
      if (member.instagram) payload.instagram = member.instagram;
      if (member.facebook) payload.facebook = member.facebook;

      if (!member.id) {
        payload.createdAt = serverTimestamp();
      }

      await setDoc(docRef, payload, { merge: true });
      await fetchMembers();
      return { success: true };
    } catch (err: any) {
      console.error("Failed to save team member:", err);
      return { success: false, error: err.message };
    }
  };

  const deleteMember = async (id: string) => {
    try {
      await deleteDoc(doc(db, "team", id));
      await fetchMembers();
      return { success: true };
    } catch (err: any) {
      console.error("Failed to delete team member:", err);
      return { success: false, error: err.message };
    }
  };

  return {
    members,
    loading,
    error,
    refresh: fetchMembers,
    saveMember,
    deleteMember,
  };
}
