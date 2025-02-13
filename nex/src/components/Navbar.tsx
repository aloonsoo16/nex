import Link from "next/link";
import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";
import { currentUser } from "@clerk/nextjs/server";
import { syncUser } from "@/actions/user.action";
import { getUserByClerkId } from "@/actions/user.action";

async function Navbar() {
  const authUser = await currentUser();

  let user = null;
  if (authUser) {
    await syncUser();
    user = await getUserByClerkId(authUser.id); 
  }

  return (
    <nav className="sticky top-0 w-full border-b backdrop-blur bg-background/95 supports-[backdrop-filter]:bg-background/60 z-50 py-2 ">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          <div className="flex items-center p-2">
            <h1 className="lg:text-lg">
              <Link
                href="/"
                className="font-bold text-primary tracking-wider"
              >
                Bienvenido a Nex
              </Link>
            </h1>
          </div>

          <DesktopNavbar />
          <MobileNavbar user={user} />
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
