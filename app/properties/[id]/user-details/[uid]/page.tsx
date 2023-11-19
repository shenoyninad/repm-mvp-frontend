"use client";

import { Image } from "@chakra-ui/react";
import Navbar from "@components/Navbar";
import { useEffect, useState } from "react";
import { apiHeader } from "@config/config";
import apiClient from "@shared/utility/api-util";
import EmailIcon from "@mui/icons-material/Email";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import propertyManager from "@public/images/project-manager.png";
import propertyOwner from "@public/images/owner-image.png";
import WhatsAppButton from "@public/images/WhatsAppButtonGreenLarge.svg";
import { RoleType } from "@shared/enums/repm.enum";
import AssignProperty from "@components/AssignProperty";
import AddReminder from "@components/AddReminder";
import { User } from "@objectTypes/user.type";
import { useSession } from "next-auth/react";
import { fetchUserByUsername } from "@shared/utility/fetchUser";
import NavbarBottom from "@components/NavbarBottom";
import DeviceSupport from "@components/DeviceSupport";

interface Props {
  params: any;
}

export default function Home({ params }: Props) {
  const propertyId: number = parseInt(params.id);
  const managerId: number = parseInt(params.uid);
  var user: User;
  const { data: session } = useSession();
  const [userProfile, setUserProfile] = useState<typeof user | undefined>();
  const [isMobile, setIsMobile] = useState(true);
  const [data, setData] = useState<typeof user | undefined>();
  const [addReminder, setAddReminder] = useState(true);
  const [propertyData, setPropertyData] = useState<{
    name: string;
    description: string;
    userId: any;
  } | null>(null);
  const wLink = `https://wa.me/${data?.phone}?`;

  useEffect(() => {
    if (session) {
      const mobileScreen = /iPhone|iPad|iPod|Android/i.test(
        navigator.userAgent
      );
      if (!mobileScreen) {
        setIsMobile(false);
      }
      const populateUserInformation = async (email: any) => {
        const userProfileRes = await fetchUserByUsername(email);
        setUserProfile(userProfileRes.data);

        const param = params.uid;
        const apiUrl = `/users/${param}`;
        apiClient.get(apiUrl, apiHeader).then((response) => {
          const data = response.data;
          setData(data);
        });

        apiClient
          .get(`/properties?propertyId=${propertyId}`, apiHeader)
          .then((response) => {
            const data = response.data;
            if (data.PropertyManager) {
              const { name, description } = data;
              const { userId } = data.PropertyManager.Manager;
              setPropertyData({ name, description, userId });
              if (managerId === userId) {
                setAddReminder(false);
              }
            } else {
              const { name, description } = data;
              const userId = 0;
              setPropertyData({ name, description, userId });
            }
          });
      };

      populateUserInformation(session?.user?.email);
    }
  }, [session, isMobile]);

  return (
    <main className="flex min-h-screen flex-col items-center overflow-hidden">
      {!isMobile && <DeviceSupport />}
      {isMobile && (
        <>
          {data?.roleType === RoleType.PROPERTYOWNER ? (
            <Navbar text="Owner Details" />
          ) : (
            <Navbar text="Manager Details" />
          )}
          <div className="mt-10 w-full flex flex-col items-center">
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
            <div className="mt-10 mb-8 flex flex-col w-72 items-start bg-white p-4 rounded-lg shadow-lg">
              <div className="text-sm">
                <p className="font-bold">Name: </p>
                <p className="">
                  {data?.firstname} {data?.lastname}
                </p>
              </div>
              <div className="flex flex-row justify-between mt-2 text-sm w-full">
                <div className="flex flex-col">
                  <p className="font-bold">Phone number: </p>
                  <p className="">{data?.phone}</p>
                </div>
                <a href={`tel:${data?.phone}`} className="m-2 items-end">
                  <PhoneInTalkIcon className="align-middle" />
                </a>
              </div>
              <div className="flex flex-row justify-between mt-2 text-sm w-full">
                <div className="flex flex-col">
                  <p className="font-bold">Email ID: </p>
                  <p className="">{data?.email}</p>
                </div>
                <a
                  href={`mailto:${data?.email}?Subject=Hello%20${data?.firstname} ${data?.lastname}`}
                  className="m-2 items-end"
                >
                  <EmailIcon />
                </a>
              </div>
            </div>

            <div className="w-full flex flex-col items-center mb-24">
              <a
                className="w-full flex flex-col items-center mb-2"
                href={wLink}
                rel="noreferrer"
                target="_blank"
              >
                <Image
                  src={WhatsAppButton.src}
                  alt="whatsapp chat image"
                  className="object-scale-down rounded-xl w-72"
                />
              </a>
              {data?.roleType === RoleType.PROPERTYMANAGER &&
                (addReminder ? (
                  <div>
                    <AssignProperty
                      propertyDescription={propertyData?.description}
                      propertyTitle={propertyData?.name}
                      managerId={managerId}
                      propertyId={propertyId}
                    />
                  </div>
                ) : (
                  <AddReminder
                    ownerId={userProfile?.userId}
                    propertyDescription={propertyData?.description}
                    propertyTitle={propertyData?.name}
                    managerId={managerId}
                    propertyId={propertyId}
                  />
                ))}
            </div>
          </div>
          <NavbarBottom page="" />
        </>
      )}
    </main>
  );
}
