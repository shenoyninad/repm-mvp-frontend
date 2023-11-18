// import { Box } from "@chakra-ui/react";
// import React from "react";
// import StarIcon from "@mui/icons-material/Star";

// const ManagerDashboard = () => {
//   const rating = 3.5;
//   return (
//     <div className="flex flex-col items-center">
//       <Box className="flex flex-row items-center h-32 w-80 mt-10 rounded-lg shadow-lg">
//         <div className="w-[30%] bg-amber-500 h-full rounded-tl-lg rounded-bl-lg flex flex-row items-center justify-center">
//           <p className="font-extrabold text-lg">3</p>
//         </div>
//         <div className="w-[70%] bg-white h-full rounded-tr-lg rounded-br-lg flex flex-col items-start pt-2 pl-2 justify-start">
//           <p className="text-sm font-bold">Properties</p>
//           <ul className="text-gray-600 text-sm mt-4">
//             <li>Bangalore (1)</li>
//             <li>Hyderabad (1)</li>
//             <li>Goa (1)</li>
//           </ul>
//         </div>
//       </Box>
//       <Box className="flex flex-row items-center h-32 w-80 mt-6 rounded-lg shadow-lg">
//         <div className="w-[30%] bg-cyan-400 h-full rounded-tl-lg rounded-bl-lg flex flex-row items-center justify-center">
//           <p className="font-extrabold text-lg">4</p>
//         </div>
//         <div className="w-[70%] bg-white h-full rounded-tr-lg rounded-br-lg flex flex-col items-start pt-2 pl-2 justify-start">
//           <p className="text-sm font-bold">Service Requests</p>
//           <ul className="text-gray-600 text-sm mt-4">
//             <li>New (2)</li>
//             <li>In Progress (1)</li>
//             <li>Closed (1)</li>
//           </ul>
//         </div>
//       </Box>
//       <Box className="flex flex-row items-center h-32 w-80 mt-6 rounded-lg shadow-lg">
//         <div
//           className={`w-[30%] ${
//             rating > 2
//               ? rating >= 4
//                 ? "bg-green-600"
//                 : "bg-yellow-400 text-black"
//               : "bg-red-400"
//           } h-full rounded-tl-lg rounded-bl-lg flex flex-row items-center justify-center`}
//         >
//           <p className="font-extrabold text-lg text-black">{rating}</p>
//           <StarIcon className="text-black" />
//         </div>
//         <div className="w-[70%] bg-white h-full rounded-tr-lg rounded-br-lg flex flex-col  items-start pt-3 pl-2 justify-start">
//           <p className="text-sm font-bold">Rating</p>
//           <p className="text-sm text-gray-600 mt-4">
//             Based on 12 service requests
//           </p>
//         </div>
//       </Box>
//     </div>
//   );
// };

// export default ManagerDashboard;




import { Box } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import apiClient from "@shared/utility/api-util";
import { apiHeader } from "@config/config";


interface Props {
  userId: number;
}

const ManagerDashboard : React.FC<Props> = (props) => {


  useEffect(() => {
    apiClient
      .get(`/properties/avg?userId=${props.userId}&flag=${false}`, apiHeader)
      .then((response) => {
        console.log(response)
      })
     
  }, []);
  const rating = 3.5;
  return (
    <div className="flex flex-col items-center">
      <Box className="flex flex-row items-center h-32 w-80 mt-10 rounded-lg shadow-lg">
        <div className="w-[30%] bg-amber-500 h-full rounded-tl-lg rounded-bl-lg flex flex-row items-center justify-center">
          <p className="font-extrabold text-lg">3</p>
        </div>
        <div className="w-[70%] bg-white h-full rounded-tr-lg rounded-br-lg flex flex-col items-start pt-2 pl-2 justify-start">
          <p className="text-sm font-bold">Properties</p>
          <ul className="text-gray-600 text-sm mt-4">
            <li>Bangalore (1)</li>
            <li>Hyderabad (1)</li>
            <li>Goa (1)</li>
          </ul>
        </div>
      </Box>
      <Box className="flex flex-row items-center h-32 w-80 mt-6 rounded-lg shadow-lg">
        <div className="w-[30%] bg-cyan-400 h-full rounded-tl-lg rounded-bl-lg flex flex-row items-center justify-center">
          <p className="font-extrabold text-lg">4</p>
        </div>
        <div className="w-[70%] bg-white h-full rounded-tr-lg rounded-br-lg flex flex-col items-start pt-2 pl-2 justify-start">
          <p className="text-sm font-bold">Service Requests</p>
          <ul className="text-gray-600 text-sm mt-4">
            <li>New (2)</li>
            <li>In Progress (1)</li>
            <li>Closed (1)</li>
          </ul>
        </div>
      </Box>
      <Box className="flex flex-row items-center h-32 w-80 mt-6 rounded-lg shadow-lg">
        <div
          className={`w-[30%] ${
            rating > 2
              ? rating >= 4
                ? "bg-green-600"
                : "bg-yellow-400 text-black"
              : "bg-red-400"
          } h-full rounded-tl-lg rounded-bl-lg flex flex-row items-center justify-center`}
        >
          <p className="font-extrabold text-lg text-black">{rating}</p>
          <StarIcon className="text-black" />
        </div>
        <div className="w-[70%] bg-white h-full rounded-tr-lg rounded-br-lg flex flex-col  items-start pt-3 pl-2 justify-start">
          <p className="text-sm font-bold">Rating</p>
          <p className="text-sm text-gray-600 mt-4">
            Based on 12 service requests
          </p>
        </div>
      </Box>
    </div>
  );
};

export default ManagerDashboard;