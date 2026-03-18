"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import {
  Plus,
  UserCheck,
  UserX,
  AlertCircle,
  X,
  Eye,
  EyeOff,
} from "lucide-react";

interface HOD {
  id: string;
  email: string;
  full_name: string | null;
  dept_id: string | null;
  is_active: boolean;
  created_at: string;
  departments?: { name: string; code: string } | null;
}

interface Dept {
  id: string;
  name: string;
  code: string;
}
interface Props {
  hods: HOD[];
  departments: Dept[];
  currentUserId: string;
}

const EMPTY = { email: "", full_name: "", dept_id: "", password: "" };

export default function UsersClient({
  hods,
  departments,
  currentUserId,
}: Props) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function createHOD() {
    setSaving(true);
    setError(null);
    setSuccess(null);
    if (!form.email || !form.full_name || !form.dept_id || !form.password) {
      setError("All fields are required.");
      setSaving(false);
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      setSaving(false);
      return;
    }

    const res = await fetch("/api/admin/create-hod", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email,
        password: form.password,
        full_name: form.full_name,
        dept_id: form.dept_id,
      }),
    });

    const result = await res.json();
    if (!res.ok) {
      setError(result.error ?? "Failed to create account.");
      setSaving(false);
      return;
    }

    setSuccess(`HOD account created for ${form.email}`);
    setForm(EMPTY);
    setShowForm(false);
    setSaving(false);
    router.refresh();
  }

  async function toggleActive(hod: HOD) {
    setToggling(hod.id);
    await supabase
      .from("profiles")
      .update({ is_active: !hod.is_active })
      .eq("id", hod.id);
    await supabase.from("audit_log").insert({
      user_id: currentUserId,
      action: hod.is_active ? "deactivated" : "reactivated",
      table_name: "profiles",
      record_id: hod.id,
    });
    setToggling(null);
    router.refresh();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-semibold text-stone-800"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            HOD Accounts
          </h1>
          <p className="text-stone-500 text-sm">Manage department HOD access</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setShowForm(true);
            setError(null);
            setSuccess(null);
          }}
          className="flex items-center gap-2 bg-[#E8820C] hover:bg-[#d4750b] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" /> Create HOD
        </button>
      </div>

      {success && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg">
          <UserCheck className="w-4 h-4 shrink-0" /> {success}
          <button
            type="button"
            onClick={() => setSuccess(null)}
            className="ml-auto"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50 text-stone-400 text-xs uppercase tracking-wide border-b border-stone-100">
              <th className="text-left px-5 py-3 font-medium">Name</th>
              <th className="text-left px-4 py-3 font-medium">Email</th>
              <th className="text-left px-4 py-3 font-medium">Department</th>
              <th className="text-left px-4 py-3 font-medium">Created</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-right px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {hods.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-12 text-stone-400">
                  No HOD accounts yet.
                </td>
              </tr>
            )}
            {hods.map((hod) => (
              <tr key={hod.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#E8820C]/10 border border-[#E8820C]/20 flex items-center justify-center text-[#E8820C] text-xs font-semibold shrink-0">
                      {hod.full_name?.charAt(0) ?? "?"}
                    </div>
                    <span className="text-stone-700 font-medium">
                      {hod.full_name ?? "—"}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-stone-500 text-xs">
                  {hod.email}
                </td>
                <td className="px-4 py-3.5">
                  {hod.departments ? (
                    <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">
                      {hod.departments.code} — {hod.departments.name}
                    </span>
                  ) : (
                    <span className="text-stone-300 text-xs">
                      No dept assigned
                    </span>
                  )}
                </td>
                <td className="px-4 py-3.5 text-stone-500 text-xs tabular-nums">
                  {hod.created_at
                    ? new Date(hod.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "—"}
                </td>
                <td className="px-4 py-3.5">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${hod.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
                  >
                    {hod.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <button
                    type="button"
                    onClick={() => toggleActive(hod)}
                    disabled={toggling === hod.id}
                    className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-50 ${
                      hod.is_active
                        ? "border-red-200 text-red-600 hover:bg-red-50"
                        : "border-green-200 text-green-600 hover:bg-green-50"
                    }`}
                  >
                    {hod.is_active ? (
                      <>
                        <UserX className="w-3.5 h-3.5" /> Deactivate
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-3.5 h-3.5" /> Reactivate
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-stone-800 font-semibold">
                Create HOD Account
              </h2>
              <button type="button" onClick={() => setShowForm(false)}>
                <X className="w-5 h-5 text-stone-400" />
              </button>
            </div>
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-lg">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">
                  Full Name
                </label>
                <input
                  value={form.full_name}
                  onChange={(e) => set("full_name", e.target.value)}
                  placeholder="Dr. Full Name"
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]"
                />
              </div>
              <div>
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="hod.dept@ssjcoe.in"
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]"
                />
              </div>
              <div>
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">
                  Department
                </label>
                <select
                  value={form.dept_id}
                  onChange={(e) => set("dept_id", e.target.value)}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]"
                >
                  <option value="">Select department</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.code} — {d.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => set("password", e.target.value)}
                    placeholder="Min. 8 characters"
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 pr-10 text-sm text-stone-700 focus:outline-none focus:border-[#E8820C]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm text-stone-600 hover:bg-stone-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={createHOD}
                disabled={saving}
                className="px-4 py-2 text-sm bg-[#E8820C] hover:bg-[#d4750b] text-white rounded-lg disabled:opacity-50"
              >
                {saving ? "Creating…" : "Create Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
