"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { auth } from "../../../../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

interface IssueInput {
  title: string;
  description: string;
  labels: string[];
  assignedTo?: string;
}

export default function NewIssuePage() {
  const { repoId } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [token, setToken] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [labels, setLabels] = useState<string>("");
  const [assignedTo, setAssignedTo] = useState<string>("");

  // Firebase token
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) setToken(await user.getIdToken());
    });
    return () => unsubscribe();
  }, []);

  // Mutation to create new issue
  const { mutate, status } = useMutation<any, unknown, IssueInput>({
    mutationFn: async (data: IssueInput) => {
      if (!token) throw new Error("No token");
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/repos/${repoId}/issues`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues", repoId] });
      router.push(`/repos/${repoId}/issues`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: IssueInput = {
      title,
      description,
      labels: labels.split(",").map((l) => l.trim()),
      assignedTo: assignedTo || undefined,
    };
    mutate(data);
  };

  if (!token) return <div>Loading user...</div>;

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create New Issue</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Labels (comma separated)
          </label>
          <input
            type="text"
            value={labels}
            onChange={(e) => setLabels(e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Assign To (User ID)</label>
          <input
            type="text"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>

        <button
          type="submit"
          disabled={status === "pending"}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {status === "pending" ? "Creating..." : "Create Issue"}
        </button>

        {status === "error" && (
          <p className="text-red-600 mt-2">Failed to create issue.</p>
        )}
      </form>
    </div>
  );
}
