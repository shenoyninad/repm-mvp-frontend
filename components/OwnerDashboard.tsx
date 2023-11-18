import { Box } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import apiClient from "@shared/utility/api-util";
import { apiHeader } from "@config/config";
import { fetchUserByUsername } from "@shared/utility/fetchUser";
import { User } from "@objectTypes/user.type";
import { PropertyCard } from "@objectTypes/property.type.js";
import { transformOwnerProperties } from "@shared/utility/transformer";
import { PropertyType } from "@shared/enums/repm.enum";

interface Props {}

interface ServiceRequest {
  type: string;
  status: string;
  SRLPrice: number | null;
}

interface Property {
  propertyId: number;
  name: string;
  TotalSR: number;
  ServiceRequests: { [key: string]: ServiceRequest };
}

const OwnerDashboard = () => {
  var user: User;

  const { data: session } = useSession();
  const [properties, setProperties] = useState<PropertyCard[]>([]);
  const [userProfile, setUserProfile] = useState<typeof user | undefined>();
  const [propertyTypeCount, setPropertyTypeCount] =
    useState<Record<PropertyType, number>>();
  const [propertyCount, setPropertyCount] = useState<number>();
  const [srData, setsrData] = useState<Property[]>([]);
  const [totalServiceRequestsPrice, setTotalServiceRequestsPrice] =
    useState<number>();
  const [respectiveServiceRequestSum, setRespectiveServiceRequestSum] =
    useState<Record<string, number>>({});
  const [totalServiceRequests, setTotalServiceRequests] = useState<number>(0);
  const [serviceRequestsByStatus, setServiceRequestsByStatus] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    if (session) {
      const populateDashboard = async (email: any) => {
        const userProfileRes = await fetchUserByUsername(email);
        setUserProfile(userProfileRes.data);

        const propertiesOfOwner: any = await apiClient.get(
          `/properties/propertiesByOwner?ownerId=${userProfileRes.data.userId}`,
          apiHeader
        );

        const transformedProperties: any = transformOwnerProperties(
          propertiesOfOwner.data
        );
        setProperties(transformedProperties);

        const serviceRequestsByOwner: any = await apiClient.get(
          `/properties/dash?userId=${userProfileRes.data.userId}`,
          apiHeader
        );
        const apiResponse: { [key: string]: Property } =
          serviceRequestsByOwner.data;

        getDetailsOfServiceRequests(apiResponse);
      };

      populateDashboard(session?.user?.email);

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
          counts[property.propertyType as PropertyType]++;
        });

        const totalCount = properties.length;

        return { totalCount, counts };
      };

      const getDetailsOfServiceRequests = (apiResponse: any): any => {
        let totalSRLPrice = 0;
        let updatedTotalServiceRequests = 0;
        const updatedServiceRequestsByStatus: Record<string, number> = {};

        const srlPriceByProperty: { [key: string]: number } = {};
        for (const propertyKey in apiResponse) {
          if (Object.prototype.hasOwnProperty.call(apiResponse, propertyKey)) {
            const property = apiResponse[propertyKey];

            if (property.ServiceRequests) {
              updatedTotalServiceRequests += Object.keys(
                property.ServiceRequests
              ).length;

              // Iterate over each service request in the 'ServiceRequests'
              for (const requestKey in property.ServiceRequests) {
                if (
                  Object.prototype.hasOwnProperty.call(
                    property.ServiceRequests,
                    requestKey
                  )
                ) {
                  const request = property.ServiceRequests[requestKey];
                  totalSRLPrice += request.SRLPrice || 0;

                  const srPriceByProperty =
                    property.ServiceRequests[requestKey];

                  srlPriceByProperty[property.name] =
                    (srlPriceByProperty[property.name] || 0) +
                    (srPriceByProperty.SRLPrice || 0);

                  const status = request.status || "Unknown";
                  updatedServiceRequestsByStatus[status] =
                    (updatedServiceRequestsByStatus[status] || 0) + 1;
                }
              }
            }
          }
        }

        setRespectiveServiceRequestSum(srlPriceByProperty);
        setTotalServiceRequestsPrice(totalSRLPrice);
        setTotalServiceRequests(updatedTotalServiceRequests);
        setServiceRequestsByStatus(updatedServiceRequestsByStatus);
      };
      // Get the count of properties grouped by propertyType
      const propertyCounts = getCountOfPropertiesByType(properties);
      setPropertyTypeCount(propertyCounts.counts);
      setPropertyCount(propertyCounts.totalCount);
    }
  }, [session]);

  return (
    <div className="flex flex-col items-center">
      <Box className="flex flex-row items-center h-32 w-80 mt-10 rounded-lg shadow-lg">
        <div className="w-[30%] bg-red-300 h-full rounded-tl-lg rounded-bl-lg flex flex-row items-center justify-center">
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
        <div className="w-[30%] bg-yellow-400 h-full rounded-tl-lg rounded-bl-lg flex flex-row items-center justify-center">
          <p className="font-extrabold text-lg">{totalServiceRequests}</p>
        </div>
        <div className="w-[70%] bg-white h-full rounded-tr-lg rounded-br-lg flex flex-col items-start pt-2 pl-2 justify-start">
          <p className="text-sm font-bold">Open Service Requests</p>
          <ul className="text-gray-600 text-sm mt-4">
            {Object.entries(serviceRequestsByStatus).map(([status, count]) => (
              <li key={status}>
                {status}: {count}
              </li>
            ))}
          </ul>
        </div>
      </Box>
      <Box className="flex flex-row items-center h-32 w-80 mt-6 rounded-lg shadow-lg">
        <div className="w-[30%] bg-blue-300 h-full rounded-tl-lg rounded-bl-lg flex flex-row items-center justify-center">
          <p className="font-extrabold text-lg">
            &#8377; {totalServiceRequestsPrice}
          </p>
        </div>
        <div className="w-[70%] bg-white h-full rounded-tr-lg rounded-br-lg flex flex-col  items-start pt-2 pl-2 justify-start">
          <p className="text-sm font-bold">Amount spent on SRs</p>
          <ul className="text-gray-600 text-sm mt-4">
            {Object.entries(respectiveServiceRequestSum)
              .slice(0, 3)
              .map(([property, sum]) => (
                <li key={property}>
                  {property}: {sum}
                </li>
              ))}
          </ul>
        </div>
      </Box>
    </div>
  );
};

export default OwnerDashboard;
