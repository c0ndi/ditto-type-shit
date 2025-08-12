/**
 * Updated on: Created auth test component - 12/08/2025 10:45
 * Purpose: Test Twitter authentication flow and debug login issues
 */
"use client";

import { useGetUser } from "@/server/auth/utils/get-user/client";
import { signIn, signOut } from "next-auth/react";

export function ProfileTESTView() {
  const user = useGetUser();

  if (user.isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (user.data) {
    return (
      <div className="p-4 border rounded-lg">
        <h2 className="text-xl font-bold mb-4">✅ Authentication Success!</h2>
        <div className="space-y-2">
          <p><strong>User ID:</strong> {user.data.twitterId ?? "Not available"}</p>
          <p><strong>Name:</strong> {user.data.twitterDisplayName ?? "Not available"}</p>
          <p><strong>Username:</strong> {user.data.twitterUsername ?? "Not available"}</p>
          <p><strong>Image:</strong> {user.data.twitterImage ?? "Not available"}</p>
          <img src={user.data.twitterImage?.replace("_normal", "_400x400") ?? ""} alt="Profile Image" />
        </div>
        <pre className="mt-4 p-2 bg-gray-100 rounded text-xs overflow-auto">
          {JSON.stringify(user.data, null, 2)}
        </pre>
        <button
          onClick={() => signOut()}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">🔐 Twitter Authentication Test</h2>
      <p className="mb-4">Click the button below to test Twitter login:</p>
      <button
        onClick={() => signIn("twitter")}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
      >
        🐦 Sign in with Twitter
      </button>
    </div>
  );
}
