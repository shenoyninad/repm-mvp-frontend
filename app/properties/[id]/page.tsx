"use client";
import { Backdrop, Box, CircularProgress } from "@mui/material";
import Typography from "@mui/material/Typography";
import Propertiesdetails from "@components/Propertiesdetails";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useEffect, useState } from "react";
import ServiceComp from "@components/ServiceComp";
import { RoleType } from "@shared/enums/repm.enum";
import { useRouter } from "next/navigation";
import apiClient from "@shared/utility/api-util";
import { apiHeader } from "@config/config";
import { useSession } from "next-auth/react";
import { User } from "@objectTypes/user.type";
import { fetchUserByUsername } from "@shared/utility/fetchUser";
import NavbarBottom from "@components/NavbarBottom";

interface Props {
  params: any;
}

const PropertyDetails: React.FC<Props> = ({ params }) => {
  const [imageURL, setImageURL] = useState("");
  const [datas, setData] = useState<{
    ownerName: string;
    name: string;
    description: string;
    address: string;
    username: string;
    userId: any;
    managerUserId: any;
    managerAssigned: boolean;
  } | null>(null);
  const [serviceData, setserviceData] = useState<
    | {
        serviceRequestId: number;
        logdecs: string;
        description: string;
        type: string;
        createdAt: string;
        price: number;
        status: string;
      }[]
    | null
  >(null);

  var user: User;
  const router = useRouter();
  const { data: session } = useSession();
  const [userProfile, setUserProfile] = useState<typeof user | undefined>();

  function add() {
    router.push(`${params.id}/create-service-request`);
  }

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) {
      router.push("/device");
    }
  }, []);

  useEffect(() => {
    if (session) {
      const populatePropertyData = async (email: any) => {
        const userProfileRes = await fetchUserByUsername(email);
        setUserProfile(userProfileRes.data);

        apiClient
          .get(`/properties?propertyId=${params.id}`, apiHeader)
          .then((response) => {
            const { name, description, address } = response.data;
            const { firstname, lastname, userId } = response.data.Owner;
            const ownerName = firstname + " " + lastname;
            if (response.data.PropertyManager) {
              const { username } = response.data.PropertyManager.Manager;
              const managerUserId =
                response.data.PropertyManager.Manager.userId;
              setData({
                name,
                description,
                username,
                ownerName,
                address,
                userId,
                managerUserId,
                managerAssigned: true,
              });
            } else {
              const username = "NA";
              const managerUserId = 0;
              setData({
                name,
                description,
                username,
                ownerName,
                address,
                userId,
                managerUserId,
                managerAssigned: false,
              });
            }

            const imageBuffer = Buffer.from(
              response.data.image.data,
              "binary"
            ).toString("base64");

            const imageDataURL = `data:image/jpeg;base64,${imageBuffer}`;

            setImageURL(imageDataURL);
          })
          .catch((error) => {
            console.error("Error:", error);
          });

        apiClient
          .get(`/properties/${params.id}/serviceRequests`, apiHeader)
          .then((response) => {
            const extractedData = response.data.map((user: any) => {
              const { type, createdAt, description, serviceRequestId, status } =
                user;
              user.ServiceRequestLogs.sort(
                (
                  a: { createdAt: string | number | Date },
                  b: { createdAt: string | number | Date }
                ) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              );
              if (user.ServiceRequestLogs[0]) {
                let price: number = 0;
                for (const item of user.ServiceRequestLogs) {
                  price += Math.round(item.price);
                }
                const logdecs = user.ServiceRequestLogs[0].description;
                return {
                  logdecs,
                  description,
                  type,
                  createdAt,
                  price,
                  serviceRequestId,
                  status,
                };
              } else {
                const price = 0;
                const logdecs = " ";
                return {
                  logdecs,
                  description,
                  type,
                  createdAt,
                  price,
                  serviceRequestId,
                  status,
                };
              }
            });
            setserviceData(extractedData);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      };

      populatePropertyData(session?.user?.email);
    }

    return () => {
      if (imageURL) {
        URL.revokeObjectURL(imageURL);
      }
    };
  }, [session]);

  return (
    <div>
      {datas ? (
        userProfile?.roleType === RoleType.PROPERTYOWNER ? (
          <Propertiesdetails
            text={"Currently Managed By:"}
            name={datas.name}
            pm={datas.username}
            image={imageURL}
            location={datas.address}
            propertyid={params.id}
            ownerid={datas.managerUserId}
          ></Propertiesdetails>
        ) : (
          <Propertiesdetails
            text={"Currently Owned By:"}
            name={datas.name}
            pm={datas.ownerName}
            image={imageURL}
            location={datas.address}
            propertyid={params.id}
            ownerid={datas.userId}
          ></Propertiesdetails>
        )
      ) : (
        <></>
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* <img src={imageURL} alt="hey" /> */}
        <Card
          sx={{ display: "flex" }}
          className="w-80 rounded-lg font-mono h-60 mb-16"
        >
          <CardContent
            sx={{ p: 0 }}
            style={{ maxHeight: "300px", overflowY: "auto" }}
          >
            <Typography
              className="text-sm sticky top-0 bg-white p-4"
              component="div"
              variant="h6"
              sx={{ mb: 1 }}
            >
              <b>Service Requests</b>
            </Typography>

            <Box sx={{ pl: 1, pr: 1 }} className="flex flex-col items-center">
              {serviceData ? (
                serviceData.map((user, index) => (
                  <ServiceComp
                    key={index}
                    serviceId={user.serviceRequestId}
                    price={user.price}
                    logdecs={user.logdecs}
                    description={user.description}
                    date={user.createdAt}
                    PropertyId={params.id}
                    status={user.status}
                  ></ServiceComp>
                ))
              ) : (
                <Backdrop
                  sx={{
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                  }}
                  open={true}
                >
                  <CircularProgress color="inherit" />
                </Backdrop>
              )}
            </Box>
          </CardContent>
        </Card>

        {userProfile?.roleType === RoleType.PROPERTYOWNER &&
          datas?.managerAssigned && (
            <div className="container w-full flex flex-col items-center mt-2">
              <Button
                className="bg-[#3085D2] w-52 mb-20"
                sx={{ textTransform: "none" }}
                variant="contained"
                disableElevation
                onClick={add}
              >
                Create Service Request
              </Button>
            </div>
          )}
      </Box>
      <NavbarBottom page="" />
    </div>
  );
};

export default PropertyDetails;
