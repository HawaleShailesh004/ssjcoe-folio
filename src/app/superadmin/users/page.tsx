import { createSupabaseServerClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import UsersClient from "@/components/admin/UsersClient";

export default async function SuperAdminUsersPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*, departments(name, code)")
    .eq("role", "hod")
    .order("created_at", { ascending: false });

  const { data: departments } = await supabase
    .from("departments")
    .select("id, name, code")
    .order("name");

  return (
    <UsersClient
      hods={profiles ?? []}
      departments={departments ?? []}
      currentUserId={user.id}
    />
  );
}
