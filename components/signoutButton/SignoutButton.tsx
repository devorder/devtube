import { signOut } from "@/auth";

export function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/auth/signin" });               
      }}
    >
      <button type="submit" className="btn btn-primary border border-white p-2 rounded cursor-pointer">Sign Out</button>
    </form>
  );
}
