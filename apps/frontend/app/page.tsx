"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { auth } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface Repo {
  _id: string;
  name: string;
  owner: { displayName: string };
}

export default function Dashboard() {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  // Monitor Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const idToken = await user.getIdToken();
        setToken(idToken);
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Fetch repos
  const {
    data: repos,
    isLoading,
    isError,
  } = useQuery<Repo[]>({
    queryKey: ["repos", token],
    queryFn: async () => {
      const response = await axios.get<Repo[]>("/repos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    enabled: !!token,
  });

  if (!token) return <div>Loading user...</div>;
  if (isLoading) return <div>Loading repositories...</div>;
  if (isError) return <div>Error fetching repositories</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Repositories</h1>
      <ul>
        {(repos ?? []).map((repo) => (
          <li key={repo._id} className="mb-2">
            {repo.name} — Owner: {repo.owner.displayName}
          </li>
        ))}
      </ul>
      {repos?.length === 0 && <p>No repositories found.</p>}
    </div>
  );
}
