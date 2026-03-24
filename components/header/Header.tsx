import { SignOutButton } from "../signoutButton/SignoutButton";
import { auth } from "@/auth";
const Header = async () => {
  const session = await auth();
  return (
    <header className="w-full flex flex-row justify-between bg-gray-800 text-white p-4">
      <h1 className="text-xl font-bold">My App</h1>
      {session && <SignOutButton />}
    </header>
  );
};
export default Header;
