import { ReactNode } from "react";
import requireUser from "../utils/hooks";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
    // const session=await requireUser()
  return (
    <>
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr]"></div>
    </>
  );
}
