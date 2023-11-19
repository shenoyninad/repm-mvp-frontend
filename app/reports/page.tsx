"use client";

import { Image } from "@chakra-ui/react";
import DeviceSupport from "@components/DeviceSupport";
import Navbar from "@components/Navbar";
import NavbarBottom from "@components/NavbarBottom";
import ReportsImage from "@public/images/reports-image.png";
import { useEffect, useState } from "react";

export default function Home() {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const mobileScreen = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!mobileScreen) {
      setIsMobile(false);
    }
  }, [isMobile]);

  return (
    <main className="flex min-h-screen flex-col items-center overflow-hidden">
      {!isMobile && <DeviceSupport />}
      {isMobile && (
        <>
          <Navbar text="Reports" />
          <div className="mt-12 w-full flex flex-col items-center">
            <Image
              className="h-36 mt-10 lg:h-52"
              src={ReportsImage.src}
              alt="help icon"
            />
          </div>
          <NavbarBottom page="reports" />
        </>
      )}
    </main>
  );
}
