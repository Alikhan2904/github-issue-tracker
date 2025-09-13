"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect } from "react";
import { auth } from "../../../../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

// Types
interface User {
  uid: string;
  displayName: string;
}

interface Comment {
  _id: string;
  text: string;
  createdBy: User;
}

interface Issue {
  _id: string;
  title: string;
  description: string;
  status: string;
  labels: string[];
  assignedTo?: User;
  comments?: Comment[];
}

export default function IssueDetailsPage() {
  const { repoId, issueId } = useParams();
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");

  // Firebase token
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const idToken = await user.getIdToken();
        setToken(idToken);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch issue details
  const {
    data: issue,
    isLoading,
    isError,
  } = useQuery<Issue>({
    queryKey: ["issue", repoId, issueId],
    queryFn: async () => {
      if (!token) throw new Error("No token");
      const res = await axios.get<Issue>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/repos/${repoId}/issues/${issueId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return res.data;
    },
    enabled: !!token && !!repoId && !!issueId,
  });

  // Set status when issue loads
  useEffect(() => {
    if (issue) setStatus(issue.status);
  }, [issue]);

  // Status mutation
  const mutation = useMutation<Issue, unknown, string>({
    mutationFn: async (newStatus: string) => {
      if (!token) throw new Error("No token");
      const res = await axios.patch<Issue>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/repos/${repoId}/issues/${issueId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    },
    onSuccess: () => {
      // ✅ React Query v5: use object syntax for invalidateQueries
      queryClient.invalidateQueries({ queryKey: ["issue", repoId, issueId] });
      queryClient.invalidateQueries({ queryKey: ["issues", repoId] });
    },
  });

  if (!token) return <div>Loading user...</div>;
  if (isLoading) return <div>Loading issue...</div>;
  if (isError) return <div>Error loading issue</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">{issue?.title}</h1>
      <p className="mb-2">{issue?.description}</p>
      <p className="mb-2">
        Assigned To: {issue?.assignedTo?.displayName || "Unassigned"}
      </p>

      {/* Status Update */}
      <div className="mb-4 flex items-center gap-2">
        <label>Status:</label>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            mutation.mutate(e.target.value);
          }}
          className="border p-1 rounded"
        >
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Comments */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Comments</h2>
        {issue?.comments?.length ? (
          <ul>
            {issue.comments.map((c) => (
              <li key={c._id} className="mb-1">
                <strong>{c.createdBy.displayName}:</strong> {c.text}
              </li>
            ))}
          </ul>
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
    </div>
  );
}
