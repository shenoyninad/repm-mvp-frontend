"use client";

import { Image } from "@chakra-ui/react";
import Navbar from "@components/Navbar";
import { useEffect, useState } from "react";
import helpImage from "@public/images/help-image.png";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import NavbarBottom from "@components/NavbarBottom";
import { EmailIcon } from "@chakra-ui/icons";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import WhatsAppButton from "@public/images/WhatsAppButtonGreenLarge.svg";

interface Props {
  params: any;
}

export default function Home({ params }: Props) {
  const { data: session } = useSession();
  const phoneNumber = "9686085774";
  const emailId = "shenoyninad@gmail.com";
  const router = useRouter();
  const wLink = `https://wa.me/${phoneNumber}?`;

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) {
      router.push("/device");
    }
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center overflow-hidden">
      <Navbar text="Help" />
      <div className="mt-12 w-full flex flex-col items-center">
        <Image
          className="h-36 mt-10 lg:h-52"
          src={helpImage.src}
          alt="help icon"
        />
        <div className="mt-10 mb-8 flex flex-col w-72 items-start bg-white p-4 rounded-lg shadow-lg">
          <div className="text-sm">
            <p className="font-bold">Our helplines are open 24/7 </p>
          </div>
          <div className="flex flex-row justify-between mt-8 text-sm w-full">
            <div className="flex flex-col">
              <p className="font-bold">Phone number: </p>
              <p className="">{phoneNumber}</p>
            </div>
            <a href={`tel:${phoneNumber}`} className="m-2 items-end">
              <PhoneInTalkIcon className="align-middle" />
            </a>
          </div>
          <div className="flex flex-row justify-between mt-2 text-sm w-full">
            <div className="flex flex-col">
              <p className="font-bold">Email ID: </p>
              <p className="">{emailId}</p>
            </div>
            <a
              href={`mailto:${emailId}?Subject=Hello%20Helpline`}
              className="m-2 items-end"
            >
              <EmailIcon className="align-middle text-xl justify-center" />
            </a>
          </div>
          <a
            className="w-full flex flex-col items-center mb-2 mt-10"
            href={wLink}
            rel="noreferrer"
            target="_blank"
          >
            <Image
              src={WhatsAppButton.src}
              className="object-scale-down rounded-xl w-72"
            />
          </a>
        </div>
      </div>
      <NavbarBottom page="help" />
    </main>
  );
}
