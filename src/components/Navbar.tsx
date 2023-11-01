import React from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import Link from "next/link";
import Image from "next/image";
import { Button, buttonVariants } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { SignInButton, SignOutButton, SignUpButton } from "@clerk/nextjs";

const Navbar = () => {
  return (
    <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-300 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link
            href={"/"}
            className="flex z-40 font-semibold"
            passHref
            prefetch={false}
          >
            <Image
              src={"/icons/logo.png"}
              alt="logo"
              width={512}
              height={512}
              quality={100}
              className="h-10 w-10"
            />
          </Link>

          <div className="hidden items-center sapce-x-4 sm:flex">
            <>
              <Link
                href={"/pricing"}
                passHref
                prefetch={false}
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                })}
              >
                Pricing
              </Link>

              <SignInButton afterSignInUrl="/dashboard">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </SignInButton>

              <SignUpButton afterSignUpUrl="/dashboard">
                <Button className="ml-4" size="sm">
                  Get Started
                  <ArrowRight className="ml-1.5 h-5 w-5" />
                </Button>
              </SignUpButton>

              <SignOutButton />
            </>
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
