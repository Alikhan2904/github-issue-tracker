"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { auth } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

interface Repository {
  _id: string;
  name: string;
  description: string;
  owner: { displayName: string };
  collaborators: { displayName: string }[];
  issuesCount: number;
}

export default function RepoDashboard() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Get Firebase token and UID
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const idToken = await user.getIdToken();
        setToken(idToken);
        setUserId(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch repositories
  const { data: repos, status } = useQuery<Repository[]>({
    queryKey: ["repos", userId, token],
    queryFn: async () => {
      if (!token || !userId) return [];
      const res = await axios.get<Repository[]>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/repos?userId=${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    },
    enabled: !!token && !!userId,
  });

  if (!token) return <div>Loading user...</div>;
  if (status === "pending") return <div>Loading repositories...</div>;
  if (status === "error")
    return <div className="text-red-600">Failed to load repositories</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Repositories</h1>
      {repos?.length === 0 && <p>No repositories available.</p>}
      <ul className="space-y-4">
        {repos?.map((repo) => (
          <li
            key={repo._id}
            className="border p-4 rounded hover:shadow cursor-pointer transition"
            onClick={() => router.push(`/repos/${repo._id}/issues`)}
          >
            <h2 className="text-xl font-semibold">{repo.name}</h2>
            <p className="text-gray-700">{repo.description}</p>
            <p className="text-sm text-gray-500">
              Owner: {repo.owner.displayName} | Issues: {repo.issuesCount} |
              Collaborators: {repo.collaborators.length}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
