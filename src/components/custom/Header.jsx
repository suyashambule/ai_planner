import { motion } from "framer-motion";
import { UserButton, useUser, SignInButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { twMerge } from "tailwind-merge";

export default function AnimatedHeader() {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <div className="relative border-b bg-gradient-to-b from-black to-zinc-900 overflow-hidden">
      {/* Wavy Background */}
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              x: [0, 100, 0],
              transition: {
                duration: 10 + i * 2,
                repeat: Infinity,
                ease: "linear",
              },
            }}
            className="absolute bottom-0 h-[20vh] w-[200%] bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20"
            style={{
              rotate: `${-5 + i * 2}deg`,
              top: `${i * 20}%`,
            }}
          />
        ))}
      </div>

      {/* Sparkles */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
              opacity: 0.5 + Math.random() * 0.5,
              scale: 0.5 + Math.random() * 0.5,
            }}
            animate={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
              opacity: [0.2, 0.8, 0.2],
              transition: {
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                repeatType: "reverse",
              },
            }}
            style={{
              width: `${0.4 + Math.random() * 0.6}px`,
              height: `${0.4 + Math.random() * 0.6}px`,
            }}
          />
        ))}
      </div>

      {/* Header Content */}
      <motion.header
        className="px-8 py-4 flex justify-between items-center relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <img
            src="/logo.svg"
            alt="Logo"
            className="h-12 w-auto max-w-[150px] object-contain drop-shadow-lg"
          />
        </motion.div>

        {isLoaded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {isSignedIn ? (
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    userButtonAvatarBox: "h-10 w-10 border-2 border-white",
                    userButtonPopoverCard: "bg-black/80 backdrop-blur-md",
                  },
                }}
              />
            ) : (
              <SignInButton mode="modal">
                <Button
                  variant="ghost"
                  className="relative overflow-hidden group px-6 py-2 rounded-full bg-gradient-to-br from-white/10 to-white/30 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all"
                >
                  <span className="relative z-10 text-white font-medium">
                    Sign In
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                  <span className="absolute inset-0.5 bg-black rounded-full" />
                </Button>
              </SignInButton>
            )}
          </motion.div>
        )}
      </motion.header>
    </div>
  );
}
