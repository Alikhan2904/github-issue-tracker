"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect } from "react";
import { auth } from "../../../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

interface Issue {
  _id: string;
  title: string;
  status: string;
}

export default function IssueList() {
  const { repoId } = useParams();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const idToken = await user.getIdToken();
        setToken(idToken);
      }
    });
    return () => unsubscribe();
  }, []);

  const {
    data: issues,
    isLoading,
    isError,
  } = useQuery<Issue[]>({
    queryKey: ["issues", repoId, token],
    queryFn: async () => {
      const res = await axios.get<Issue[]>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/repos/${repoId}/issues`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "http://localhost:5000",
          },
        }
      );
      return res.data;
    },
    enabled: !!token,
  });

  if (!token) return <div>Loading user...</div>;
  if (isLoading) return <div>Loading issues...</div>;
  if (isError) return <div>Error fetching issues</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Issues</h1>
      <ul>
        {(issues ?? []).map((issue) => (
          <li key={issue._id} className="mb-2">
            {issue.title} — Status: {issue.status}
          </li>
        ))}
      </ul>
      {issues?.length === 0 && <p>No issues found.</p>}
    </div>
  );
}
