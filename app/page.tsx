"use client";

import { Box, Image } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { RoleType } from "@shared/enums/repm.enum";
import { useEffect, useState } from "react";
import { fetchUserByUsername } from "@shared/utility/fetchUser";
import { User } from "@objectTypes/user.type";
import NavbarBottom from "@components/NavbarBottom";
import apiClient from "@shared/utility/api-util";
import { apiHeader } from "@config/config";
import { styled } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import OwnerDashboard from "@components/OwnerDashboard";
import ManagerDashboard from "@components/ManagerDashboard";
import ReminderDetails from "@components/ReminderDetails";
import { Reminders } from "@objectTypes/reminder.type";
import { useRouter } from "next/navigation";

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "light" ? "#fff" : grey[800],
}));

export default function Home() {
  var user: User;
  const router = useRouter();
  const { data: session } = useSession();
  const [userProfile, setUserProfile] = useState<typeof user | undefined>();
  const [data, setData] = useState<Reminders[]>([
    {
      reminderId: 0,
      sender: 0,
      receiver: 0,
      startDate: "string",
      message: "string",
      status: "string",
      createdAt: "string",
      updatedAt: "string",
    },
  ]);
  const [size, setSize] = useState(0);

  useEffect(() => {
    if (session) {
      const getUserProfile = async (email: any) => {
        const userProfileRes = await fetchUserByUsername(email);
        setUserProfile(userProfileRes.data);
        const param = userProfileRes?.data?.userId;
        apiClient.get(`/reminders/${param}`, apiHeader).then((response) => {
          const data = response.data;
          setData(data);
          setSize(response.data.length);
        });
      };

      getUserProfile(session?.user?.email);
    }
    return () => {};
  }, [session]);

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) {
      router.push("/device");
    }
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center">
      <header className="md:fixed left-0 right-0 mb-4 top-0 md:bg-palette-fill shadow-md app_header_b fixed z-[99] bg-[#fff]">
        <div className="flex flex-col md:px-4">
          <div className="relative flex items-center justify-between py-4 md:order-2 md:mt-2">
            <div className="flex items-center gap-4"></div>
            <p className="text-md">Real Estate Portfolio Management</p>
            <div className="flex gap-4"></div>
          </div>
        </div>
      </header>

      <div className="w-full p-12 flex flex-col items-center">
        <Box padding={"0 11px"}>
          <div className="relative w-full flex flex-col items-center">
            <div className="flex flex-col w-full items-center">
              {userProfile?.roleType === RoleType.PROPERTYMANAGER && (
                <>
                  <ManagerDashboard userId={userProfile.userId} />
                  <ReminderDetails />
                </>
              )}
              {userProfile?.roleType === RoleType.PROPERTYOWNER && (
                <OwnerDashboard />
              )}
            </div>
          </div>
        </Box>
      </div>
      <NavbarBottom page="home" />
    </main>
  );
}
