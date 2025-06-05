import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      {/* Visual Element Placeholder */}
      <div className="mb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-green-400 flex items-center justify-center shadow-lg">
          <span className="text-4xl text-white font-bold">💀</span>
        </div>
      </div>
      <h1 className="text-5xl font-extrabold text-gray-900 mb-4 text-center">
        Dead Man&apos;s NFT
      </h1>
      <p className="text-lg text-gray-600 mb-8 max-w-xl text-center">
        Protect your data with{" "}
        <span>
          <Link
            href="https://docs.iex.ec/docs/dataprotector"
            className="text-primary underline"
            target="_blank"
          >
            iExec Data Protector
          </Link>
          .
        </span>{" "}
        Check in periodically to keep your information safe and secure. If you
        don&apos;t, your chosen actions will be triggered automatically.
      </p>

      <div className="mt-6">
        <Button asChild>
          <Link href="https://github.com/fac3m4n/dead-man" target="_blank">
            <FaGithub className="w-4 h-4" />
            <span>code</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
