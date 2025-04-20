import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="p-4 shadow-lg flex justify-between items-center px-8 border-b bg-black dark:bg-zinc-950">
      <img
        src="/logo.svg"
        alt="Vite logo"
        className="h-10 w-auto max-w-[120px] object-contain"
      />

      <Button
        variant="outline"
        className="bg-white text-black hover:bg-gray-100"
      >
        Sign in
      </Button>
    </header>
  );
}
