import {
  ShieldCheck,
  FileText,
  Trophy,
} from "lucide-react";
import logo from "@/assets/logo.png";

export default function LoginHero() {
  return (
    <div className="hidden lg:flex flex-col justify-center bg-slate-900 px-20 text-white">

      <div className="max-w-xl">

        <div className="mb-10 flex items-center gap-4">

          <div className="rounded-2xl bg-white p-2 shadow-lg">
  <img
    src={logo}
    alt="CampusVault"
    className="h-16 w-16 object-contain"
  />
</div>

          <div>
            <h1 className="text-5xl font-extrabold tracking-wide">
  CampusVault
</h1>

            <p className="mt-2 text-lg text-slate-300">
  Digital Accreditation Portal
</p>
          </div>

        </div>

        <h2 className="text-4xl font-bold leading-tight">
          Secure.
          <br />
          Organize.
          <br />
          Showcase.
        </h2>

        <p className="mt-6 text-lg leading-8 text-slate-300">
          Store institutional documents,
          manage department records and
          showcase student achievements
          from one centralized platform.
        </p>

        <div className="mt-14 space-y-7">

          <div className="flex items-center gap-4">
            <ShieldCheck className="text-blue-400" />
            Secure Cloud Storage
          </div>

          <div className="flex items-center gap-4">
            <FileText className="text-blue-400" />
            NAAC / NBA Documentation
          </div>

          <div className="flex items-center gap-4">
            <Trophy className="text-blue-400" />
            Achievement Dashboard
          </div>

        </div>

      </div>

    </div>
  );
}