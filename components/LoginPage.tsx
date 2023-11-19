"use client";

import { Box, Image } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import buildingsOutline from "@public/images/buildings-outline.png";
import style from "@styles/input.module.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { apiHeader } from "@config/config";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import apiClient from "@shared/utility/api-util";
import { signIn } from "next-auth/react";
import DeviceSupport from "./DeviceSupport";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isMobile, setIsMobile] = useState(true);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState({
    usernameError: false,
    passwordError: false,
    errorMessage: "",
  });
  const router = useRouter();

  function validateEmail(email: any) {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  }

  useEffect(() => {
    const mobileScreen = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!mobileScreen) {
      setIsMobile(false);
    }
  }, [isMobile]);

  async function handleLogIn() {
    if (username.length != 0 && password.length != 0) {
      if (!validateEmail(username)) {
        setError({
          usernameError: true,
          passwordError: false,
          errorMessage: "Please enter a valid email ID",
        });
        return;
      }
      setLoader(true);
      const requestBody = {
        email: username,
        password: password,
      };

      apiClient
        .post(`/users/login`, requestBody, apiHeader)
        .then(async (response) => {
          setLoader(false);
          try {
            const signInRes = await signIn("credentials", {
              username,
              password,
              redirect: false,
            });

            if (signInRes?.error) {
              setError({
                usernameError: true,
                passwordError: false,
                errorMessage: "Please enter a valid email ID",
              });
              return;
            }

            router.replace("/");
          } catch (error) {}
        })
        .catch((error) => {
          setLoader(false);
          if (error.response.status === 401) {
            if (error.response.data.code === "incorrect-password") {
              setError({
                usernameError: false,
                passwordError: true,
                errorMessage: "The password is incorrect",
              });
              return;
            } else if (error.response.data.code === "invalid-user") {
              setError({
                usernameError: true,
                passwordError: false,
                errorMessage: "The email ID was not found",
              });
              return;
            }
          }
        });
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center">
      {!isMobile && <DeviceSupport />}
      {isMobile && (
        <>
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loader}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          <div className="mt-4 w-full p-12 flex flex-col items-center">
            <Box padding={"0 11px"}>
              <Box mt={"30px"}>
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <div className="text-sm flex flex-col items-center">
                  <Image src={buildingsOutline.src} alt="Image of a bungalow" />
                  <div className="flex items-center gap-4"></div>
                  <b className="text-md md:text-lg">
                    Real Estate Portfolio Management
                  </b>
                  <div className="flex gap-4"></div>
                </div>
              </Box>
              <Box className="mt-6 bg-white px-8 py-8 rounded-lg shadow-lg">
                <div className={style.container}>
                  <div className="flex flex-col items-center">
                    <p className="text-sm mb-4">Login to your account</p>
                  </div>
                  <div className="relative mt-2 mb-4">
                    <TextField
                      error={error.usernameError}
                      className="w-full"
                      id="user-email"
                      label="Enter Email ID"
                      variant="standard"
                      helperText={error.usernameError ? error.errorMessage : ""}
                      onChange={(e) => {
                        setError({
                          usernameError: false,
                          passwordError: false,
                          errorMessage: "",
                        });
                        setUsername(e.target.value);
                      }}
                    />
                  </div>
                  <div className="relative">
                    <TextField
                      error={error.passwordError}
                      className="w-full"
                      id="user-password"
                      type="password"
                      label="Enter Password"
                      variant="standard"
                      helperText={error.passwordError ? error.errorMessage : ""}
                      onChange={(e) => {
                        setError({
                          usernameError: false,
                          passwordError: false,
                          errorMessage: "",
                        });
                        setPassword(e.target.value);
                      }}
                    />
                  </div>
                  <div className="flex flex-row justify-between">
                    <a href="#" className="text-blue-500 text-sm mt-2">
                      Forgot email ID?
                    </a>
                    <a href="#" className="text-blue-500 text-sm mt-2">
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative mt-8 w-full flex flex-col items-center">
                    <Button
                      disabled={!(username.length != 0 && password.length != 0)}
                      className="bg-[#3085D2] w-72"
                      sx={{ textTransform: "none" }}
                      variant="contained"
                      disableElevation
                      onClick={() => handleLogIn()}
                    >
                      Login
                    </Button>
                    <a href="#" className="text-blue-500 text-sm mt-2">
                      Don&apos;t have an account? Sign up
                    </a>
                  </div>
                </div>
              </Box>
              {/*<div className="text-sm flex flex-col items-center">
            <Image src={buildingOutline.src} alt="Image of a bungalow" />
          </div>*/}
            </Box>
          </div>
        </>
      )}

      <footer className="rounded-lg m-4">
        <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
          <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
            &copy; repm.com 2023
          </span>
        </div>
      </footer>
    </main>
  );
}
