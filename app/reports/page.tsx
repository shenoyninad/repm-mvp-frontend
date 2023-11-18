"use client";

import { Image } from "@chakra-ui/react";
import Navbar from "@components/Navbar";
import { useRouter } from "next/navigation";
import NavbarBottom from "@components/NavbarBottom";
import ReportsImage from "@public/images/reports-image.png";
import { useEffect } from "react";

interface Props {
  params: any;
}

export default function Home({ params }: Props) {
  const router = useRouter();

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) {
      router.push("/device");
    }
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center overflow-hidden">
      <Navbar text="Reports" />
      <div className="mt-12 w-full flex flex-col items-center">
        <Image
          className="h-36 mt-10 lg:h-52"
          src={ReportsImage.src}
          alt="help icon"
        />
      </div>
      <NavbarBottom page="reports" />
    </main>
  );
}
