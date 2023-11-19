import { Box } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import apiClient from "@shared/utility/api-util";
import { apiHeader } from "@config/config";
import { fetchUserByUsername } from "@shared/utility/fetchUser";
import { User } from "@objectTypes/user.type";
import { PropertyCard } from "@objectTypes/property.type.js";
import { transformManagerProperties } from "@shared/utility/transformer";
import { PropertyType } from "@shared/enums/repm.enum";
import { useSession } from "next-auth/react";

interface Props {
  userId: number;
}

const ManagerDashboard: React.FC<Props> = (props) => {
  var user: User;
  const [userProfile, setUserProfile] = useState<typeof user | undefined>();
  const [properties, setProperties] = useState<PropertyCard[]>([]);
  const { data: session } = useSession();
  const [propertyCount, setPropertyCount] = useState<number>();
  const [propertyTypeCount, setPropertyTypeCount] =
    useState<Record<PropertyType, number>>();
  const [serviceCount, setServiceCount] = useState<number>();
  const [servicedata, setserviceData] = useState<
    | {
        TotalSR: number;
        SRStatus: string;
      }[]
  >([]);
  const [datas, setData] = useState<
    | {
        averageRating: number;
        totalServiceRequests: number;
      }[]
  >([]);

  const getCountOfPropertiesByType = (
    properties: PropertyCard[]
  ): { totalCount: number; counts: Record<PropertyType, number> } => {
    const counts: Record<PropertyType, number> = {
      [PropertyType.FLAT]: 0,
      [PropertyType.HOUSE]: 0,
      [PropertyType.VILLA]: 0,
    };

    // Count properties based on propertyType
    properties.forEach((property) => {
      counts[property.type as PropertyType]++;
    });

    const totalCount = properties.length;

    return { totalCount, counts };
  };
  useEffect(() => {
    if (session) {
      const populateDashboard = async (email: any) => {
        const userProfileRes = await fetchUserByUsername(email);
        setUserProfile(userProfileRes.data);
        const propertiesOfManager: any = await apiClient.get(
          `/properties/propertiesByManager?managerId=${userProfileRes.data.userId}`,
          apiHeader
        );

        const transformedProperties: any = transformManagerProperties(
          propertiesOfManager.data
        );
        setProperties(transformedProperties);
        apiClient
          .get(`/users/total/${userProfileRes.data.userId}`, apiHeader)
          .then((response) => {
            let sr = 0;

            const extractedData = response.data.map((user: any) => {
              const { TotalSR, SRStatus } = user;
              return {
                TotalSR,
                SRStatus,
              };
            });
            setserviceData(extractedData);
            response.data.map((totalService: { TotalSR: number }) => {
              sr += totalService.TotalSR;
            });
            setServiceCount(sr);
          });

        const propertyCounts = getCountOfPropertiesByType(
          transformedProperties
        );
        setPropertyTypeCount(propertyCounts.counts);
        setPropertyCount(propertyCounts.totalCount);

        apiClient
          .get(
            `/properties/avg?userId=${props.userId}&flag=${false}`,
            apiHeader
          )
          .then((response) => {
            const { averageRating, totalServiceRequests } = response.data[0];
            setData([
              {
                averageRating: averageRating,
                totalServiceRequests: totalServiceRequests,
              },
            ]);
          });
      };
      populateDashboard(session?.user?.email);
    }
  }, [session, props.userId]);

  return (
    <div className="flex flex-col items-center">
      <Box className="flex flex-row items-center h-32 w-80 mt-10 rounded-lg shadow-lg">
        <div className="w-[30%] bg-amber-500 h-full rounded-tl-lg rounded-bl-lg flex flex-row items-center justify-center">
          <p className="font-extrabold text-lg">{propertyCount}</p>
        </div>
        <div className="w-[70%] bg-white h-full rounded-tr-lg rounded-br-lg flex flex-col items-start pt-2 pl-2 justify-start">
          <p className="text-sm font-bold">Properties</p>
          <ul className="text-gray-600 text-sm mt-4">
            <li>Flats: {propertyTypeCount?.Flat}</li>
            <li>Houses: {propertyTypeCount?.House}</li>
            <li>Villas: {propertyTypeCount?.Villa}</li>
          </ul>
        </div>
      </Box>
      <Box className="flex flex-row items-center h-32 w-80 mt-6 rounded-lg shadow-lg">
        <div className="w-[30%] bg-cyan-400 h-full rounded-tl-lg rounded-bl-lg flex flex-row items-center justify-center">
          <p className="font-extrabold text-lg">{serviceCount}</p>
        </div>
        <div className="w-[70%] bg-white h-full rounded-tr-lg rounded-br-lg flex flex-col items-start pt-2 pl-2 justify-start">
          <p className="text-sm font-bold">Service Requests</p>
          <ul className="text-gray-600 text-sm overflow-clip">
            {servicedata && servicedata.length > 0 ? (
              Object.entries(
                servicedata.reduce((statusCount, property) => {
                  if (property.SRStatus !== null) {
                    statusCount[property.SRStatus] =
                      (statusCount[property.SRStatus] || 0) + property.TotalSR;
                  }
                  return statusCount;
                }, {} as Record<string, number>)
              ).map(([status, count]) => (
                <li key={status}>
                  {status} ({count})
                </li>
              ))
            ) : (
              <li>No service requests data available</li>
            )}
          </ul>
        </div>
      </Box>
      <Box className="flex flex-row items-center h-32 w-80 mt-6 rounded-lg shadow-lg">
        <div
          className={`w-[30%] ${
            datas[0]?.averageRating > 2
              ? datas[0]?.averageRating >= 4
                ? "bg-green-600"
                : "bg-yellow-400 text-black"
              : "bg-red-400"
          } h-full rounded-tl-lg rounded-bl-lg flex flex-row items-center justify-center`}
        >
          <p className="font-extrabold text-lg text-black">
            {Number(datas[0]?.averageRating).toFixed(1)}
          </p>
          <StarIcon className="text-black" />
        </div>
        <div className="w-[70%] bg-white h-full rounded-tr-lg rounded-br-lg flex flex-col  items-start pt-3 pl-2 justify-start">
          <p className="text-sm font-bold">Rating</p>
          <p className="text-sm text-gray-600 mt-4">
            Based on {datas[0]?.totalServiceRequests} service requests
          </p>
        </div>
      </Box>
    </div>
  );
};

export default ManagerDashboard;
