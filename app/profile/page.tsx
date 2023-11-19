"use client";

import Button from "@mui/material/Button";
import { Image } from "@chakra-ui/react";
import Navbar from "@components/Navbar";
import { useEffect, useState } from "react";
import { apiHeader } from "@config/config";
import apiClient from "@shared/utility/api-util";
import propertyManager from "@public/images/project-manager.png";
import propertyOwner from "@public/images/owner-image.png";
import { RoleType } from "@shared/enums/repm.enum";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Backdrop from "@mui/material/Backdrop";
import VerifiedIcon from "@mui/icons-material/Verified";
import CircularProgress from "@mui/material/CircularProgress";
import { fetchUserByUsername } from "@shared/utility/fetchUser";
import NavbarBottom from "@components/NavbarBottom";
import DeviceSupport from "@components/DeviceSupport";

interface Props {
  params: any;
}

type User = {
  userId: number;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
  roleType: string;
  enabled: boolean;
  loggedIn: boolean;
};

export default function Home({ params }: Props) {
  var user: User;
  const { data: session } = useSession();
  const [data, setData] = useState<typeof user | undefined>();
  const [isMobile, setIsMobile] = useState(true);
  const [loader, setLoader] = useState(true);
  const router = useRouter();

  function handleLogOut() {
    router.push("/login");
  }

  useEffect(() => {
    if (session) {
      const mobileScreen = /iPhone|iPad|iPod|Android/i.test(
        navigator.userAgent
      );
      if (!mobileScreen) {
        setIsMobile(false);
      }
      const getUserProfile = async (email: any) => {
        const userProfile = await fetchUserByUsername(email);
        const apiUrl = `/users/${userProfile?.data?.userId}`;
        apiClient.get(apiUrl, apiHeader).then((response) => {
          const data = response.data;
          setData(data);
        });
        setLoader(false);
      };

      getUserProfile(session?.user?.email);
    }
  }, [session, isMobile]);

  return (
    <main className="flex min-h-screen flex-col items-center overflow-hidden">
      {!isMobile && <DeviceSupport />}
      {isMobile && (
        <>
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loader}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          {data?.roleType === RoleType.PROPERTYOWNER ? (
            <Navbar text="My Profile" />
          ) : (
            <Navbar text="My Profile" />
          )}
          <div className="mt-12 w-full flex flex-col items-center">
            {data?.roleType === RoleType.PROPERTYOWNER ? (
              <Image
                className="h-36 mt-10 lg:h-52"
                src={propertyOwner.src}
                alt="property manager icon"
              />
            ) : (
              <Image
                className="h-36 mt-10 lg:h-52"
                src={propertyManager.src}
                alt="property owner icon"
              />
            )}
            <div className="mt-6 mb-10 flex flex-col w-64 lg:w-72 h-auto items-start pl-8 bg-white py-4 rounded-lg shadow-lg">
              <p className="text-sm font-bold">Your account details: </p>
              <div className="text-sm mt-3 pl-3">
                <p className="font-bold">Name: </p>
                <div className="flex flex-row">
                  <p className="">
                    {data?.firstname} {data?.lastname}
                  </p>
                  <VerifiedIcon className="text-blue-400 text-lg ml-2 items-center" />
                </div>
              </div>
              <div className="flex flex-row justify-between mt-2 pl-3 text-sm w-full">
                <div className="flex flex-col">
                  <p className="font-bold">Phone number: </p>
                  <p className="">{data?.phone}</p>
                </div>
              </div>
              <div className="flex flex-row justify-between mt-2 pl-3 text-sm w-full mb-3">
                <div className="flex flex-col">
                  <p className="font-bold">Email ID: </p>
                  <p className="">{data?.email}</p>
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col items-center">
              <Button
                className="bg-[#3085D2] w-52 hover:bg-white hover:text-[#3085D2]"
                sx={{ textTransform: "none" }}
                variant="contained"
                disableElevation
                onClick={() => {
                  signOut();
                  handleLogOut();
                }}
              >
                Log out
              </Button>
            </div>
          </div>
          <NavbarBottom page="profile" />
        </>
      )}
    </main>
  );
}
