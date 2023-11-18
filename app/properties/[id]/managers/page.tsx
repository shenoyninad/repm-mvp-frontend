"use client";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import ManagerCard from "@components/ManagerCard";
import { manager } from "@objectTypes/manager.type";
import { SearchIcon } from "@chakra-ui/icons";
import Navbar from "@components/Navbar";
import apiClient from "@shared/utility/api-util";
import { apiHeader } from "@config/config";
import Link from "next/link";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import debounce from "lodash/debounce";
import NavbarBottom from "@components/NavbarBottom";
import { useRouter } from "next/navigation";

const ManagersList = () => {
  const [input, setInput] = useState("");

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (inputValue.length >= 3) {
      handleDebouncedInput(inputValue);
    } else {
      // Reset the input when it's less than 3 characters
      setInput("");
    }
  };
  const handleDebouncedInput = debounce((input) => {
    setInput(input);
  }, 850);

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const sortByRating = (input: string) => {
    if (datas !== null && input == "high") {
      const sortedData = [...datas];
      sortedData.sort((a, b) => b.averageRating - a.averageRating);

      setData(sortedData);
    } else {
      const sortedData = [...datas];
      sortedData.sort((a, b) => a.averageRating - b.averageRating);

      setData(sortedData);
    }
  };

  const [datas, setData] = useState<
    | {
        firstname: string;
        lastname: string;
        phone: string;
        email: string;
        userId: number;
        averageRating: number;
        totalServiceRequests: number;
      }[]
  >([]);

  const router = useRouter();

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) {
      router.push("/device");
    }
  }, []);

  useEffect(() => {
    apiClient
      .get(`/properties/avg?username=${input}`, apiHeader)
      .then((response) => {
        const extractedData = response.data.map((user: any) => {
          const {
            firstname,
            lastname,
            phone,
            email,
            userId,
            averageRating,
            totalServiceRequests,
          } = user;
          return {
            firstname,
            lastname,
            phone,
            email,
            userId,
            averageRating,
            totalServiceRequests,
          };
        });
        setData(extractedData);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [input]);

  return (
    <main>
      <Navbar text="Managers" />
      <div className=" mx-auto w-screen ">
        <div className="mt-16 w-full mx-auto  flex flex-col items-center p-5 min-w-280">
          <div className="relative flex items-center w-80 h-9 rounded-lg focus-within:shadow-lg bg-white overflow-hidden">
            <div className="grid place-items-center h-full w-12 text-gray-300">
              <SearchIcon />
            </div>

            <input
              className="peer h-full w-full outline-none text-sm text-gray-700 pr-2"
              type="text"
              id="search"
              placeholder="Search something.."
              onChange={handleInput}
            />
          </div>

          <div className="flex-col justify-start mt-2 w-80 text-sm min-w-280">
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <div className="flex justify-start">
                <p>Sort based on Rating</p>
              </div>
              <Tabs
                sx={{ height: "20px" }}
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab
                  label="Highest rating"
                  className=" px-1 py-0"
                  sx={{ p: "0", height: "20px", textTransform: "none" }}
                  onClick={() => {
                    sortByRating("high");
                  }}
                />
                <Tab
                  label="Lowest rating"
                  className=" px-1 py-0"
                  sx={{ p: "0", height: "20px", textTransform: "none" }}
                  onClick={() => {
                    sortByRating("low");
                  }}
                />
              </Tabs>
            </Box>
          </div>

          <div className=" w-full p-3 mt-1 flex flex-col items-center">
            <Box padding={"0 11px"}>
              {datas ? (
                datas.map((user: manager, item) => (
                  <Link key={item} href={`user-details/${user.userId}`}>
                    <ManagerCard managers={user} />
                  </Link>
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
          </div>
        </div>
      </div>
      <NavbarBottom page="" />
    </main>
  );
};

export default ManagersList;
