"use client";

import { Box } from "@chakra-ui/react";
import PropertyList from "@components/PropertyList";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RoleType } from "@shared/enums/repm.enum";
import { apiHeader } from "@config/config";
import {
  transformManagerProperties,
  transformOwnerProperties,
} from "@shared/utility/transformer";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import apiClient from "@shared/utility/api-util";
import Navbar from "@components/Navbar";
import { useSession } from "next-auth/react";
import { fetchUserByUsername } from "@shared/utility/fetchUser";
import { User } from "@objectTypes/user.type";
import NavbarBottom from "@components/NavbarBottom";
import DeviceSupport from "@components/DeviceSupport";

export default function Home() {
  var user: User;
  const [properties, setProperties] = useState([]);
  const router = useRouter();
  const { data: session } = useSession();
  const [loader, setLoader] = useState(true);
  const [userProfile, setUserProfile] = useState<typeof user | undefined>();
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    if (session) {
      const mobileScreen = /iPhone|iPad|iPod|Android/i.test(
        navigator.userAgent
      );
      if (!mobileScreen) {
        setIsMobile(false);
      }
      const getProperties = async (email: any) => {
        const userProfileRes = await fetchUserByUsername(email);
        setUserProfile(userProfileRes.data);

        switch (userProfileRes.data.roleType) {
          case RoleType.PROPERTYOWNER: {
            const propertiesOfOwner: any = await apiClient.get(
              `/properties/propertiesByOwner?ownerId=${userProfileRes.data.userId}`,
              apiHeader
            );

            const transformedProperties: any = transformOwnerProperties(
              propertiesOfOwner.data
            );

            setProperties(transformedProperties);
            break;
          }

          case RoleType.PROPERTYMANAGER: {
            const propertiesOfManager: any = await apiClient.get(
              `/properties/propertiesByManager?managerId=${userProfileRes.data.userId}`,
              apiHeader
            );

            const transformedProperties: any = transformManagerProperties(
              propertiesOfManager.data
            );

            setProperties(transformedProperties);
            break;
          }

          default: {
            setProperties([]);
          }
        }

        setLoader(false);
      };

      getProperties(session?.user?.email);
    }
    return () => {};
  }, [session, isMobile]);

  function add() {
    router.push("properties/add");
  }

  return (
    <main className="flex min-h-screen flex-col w-full">
      {!isMobile && <DeviceSupport />}
      {isMobile && (
        <>
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loader}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          <Navbar text="My Properties" />
          {session && (
            <div className="w-full">
              <div className="mt-8 w-full p-12 flex flex-col items-center">
                {properties.length > 0 ? (
                  <Box padding={"0 11px"}>
                    <PropertyList propertyList={properties} />
                  </Box>
                ) : (
                  <Box className="mt-14">
                    <h3>There are no properties to display</h3>
                  </Box>
                )}
              </div>

              {userProfile?.roleType === RoleType.PROPERTYOWNER && (
                <div className="w-full flex flex-col items-center mb-10">
                  <Button
                    type="submit"
                    className="bg-[#3085D2] w-52"
                    sx={{ textTransform: "none" }}
                    variant="contained"
                    disableElevation
                    onClick={() => add()}
                  >
                    Add New Property
                  </Button>
                </div>
              )}
            </div>
          )}
          <NavbarBottom page="properties" />
        </>
      )}
    </main>
  );
}
