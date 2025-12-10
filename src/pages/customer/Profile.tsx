import { useState, useEffect } from "react";
import { User, Mail, Shield, Calendar, Edit2, Save, X } from "lucide-react";
import { axiosInstance } from "@/api/axios.config";

interface UserProfile {
  username: string;
  email?: string;
  role?: string;
  createdAt?: string;
}

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ email: "", password: "" });
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState("");

  // Fetch profile
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      // Try to get profile from /user/profile or /auth/profile
      let response;
      try {
        response = await axiosInstance.get("api/user/profile");
      } catch (err: any) {
        // If /user/profile fails, try /auth/profile
        response = await axiosInstance.get("/auth/profile");
      }

      console.log("Profile response:", response.data);
      setProfile(response.data);
      setEditData({ email: response.data.email || "", password: "" });
    } catch (err: any) {
      console.error("Profile error:", err);
      setError(err.response?.data?.message || "Failed to load profile");

      // Fallback: Get username from localStorage token
      const token = localStorage.getItem("auth_token");
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          setProfile({ username: payload.sub || "User" });
        } catch (e) {
          console.error("Token parse error:", e);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editData.email && !editData.password) {
      setError("Please enter email or password to update");
      return;
    }

    try {
      setUpdating(true);
      setError("");
      setSuccess("");

      const updatePayload: any = {};
      updatePayload.phone = "123123123";
      if (editData.email) updatePayload.email = editData.email;
      if (editData.password) updatePayload.password = editData.password;

      // Try different endpoints
      let response;
      try {
        response = await axiosInstance.put("api/user/profile", updatePayload);
      } catch (err: any) {
        console.error("Update error:", err);
      }

      setSuccess("Profile updated successfully");
      setEditing(false);
      setEditData({ ...editData, password: "" });

      // Refresh profile
      setTimeout(() => {
        fetchProfile();
        setSuccess("");
      }, 2000);
    } catch (err: any) {
      console.error("Update error:", err);
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
          {success}
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {profile?.username || "User"}
              </h2>
              <p className="text-gray-500">Customer Account</p>
            </div>
          </div>

          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleUpdate}
                disabled={updating}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {updating ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setEditData({ email: profile?.email || "", password: "" });
                  setError("");
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="space-y-4">
          {/* Username */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded">
            <User className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm text-gray-500">Username</p>
              <p className="font-medium">{profile?.username || "N/A"}</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded">
            <Mail className="w-5 h-5 text-gray-600" />
            <div className="flex-1">
              <p className="text-sm text-gray-500">Email</p>
              {editing ? (
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) =>
                    setEditData({ ...editData, email: e.target.value })
                  }
                  placeholder="Enter email"
                  className="mt-1 px-3 py-2 border rounded w-full"
                />
              ) : (
                <p className="font-medium">{profile?.email || "Not set"}</p>
              )}
            </div>
          </div>

          {/* Password (only in edit mode) */}
          {editing && (
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded">
              <Shield className="w-5 h-5 text-gray-600" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">New Password</p>
                <input
                  type="password"
                  value={editData.password}
                  onChange={(e) =>
                    setEditData({ ...editData, password: e.target.value })
                  }
                  placeholder="Enter new password (leave empty to keep current)"
                  className="mt-1 px-3 py-2 border rounded w-full"
                />
              </div>
            </div>
          )}

          {/* Role */}
          {profile?.role && (
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded">
              <Shield className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-medium capitalize">{profile.role}</p>
              </div>
            </div>
          )}

          {/* Created At */}
          {profile?.createdAt && (
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded">
              <Calendar className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="font-medium">
                  {new Date(profile.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">Account Actions</h3>
        <div className="space-y-3">
          <button
            onClick={fetchProfile}
            className="w-full text-left px-4 py-3 bg-gray-50 rounded hover:bg-gray-100"
          >
            Refresh Profile Data
          </button>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="w-full text-left px-4 py-3 bg-red-50 text-red-600 rounded hover:bg-red-100"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
