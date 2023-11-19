"use client";

import { Box, Image } from "@chakra-ui/react";
import Rating from "@mui/material/Rating";

import style from "@styles/input.module.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ServiceRequests } from "@objectTypes/ServiceRequests.type";
import ServiceRequest from "@components/ServiceRequest";
import Navbar from "@components/Navbar";
import { apiHeader } from "@config/config";
import { Backdrop, CircularProgress } from "@mui/material";
import apiClient from "@shared/utility/api-util";
import { User } from "@objectTypes/user.type";
import { useSession } from "next-auth/react";
import { fetchUserByUsername } from "@shared/utility/fetchUser";
import NavbarBottom from "@components/NavbarBottom";
import DeviceSupport from "@components/DeviceSupport";

interface Props {
  params: any;
}

export default function Home({ params }: Props) {
  const [rateValue, setRateValue] = useState<number | null>(null);
  const [imageSrc, setImageSrc] = useState<string | undefined>();
  const [data, setData] = useState<ServiceRequests | undefined>();
  const [showStatusAlert, setShowStatusAlert] = useState(false);
  const [showFeedbackAlert, setShowFeedbackAlert] = useState(false);
  const [loader, setLoader] = useState(false);
  const [formDatas, setFormdata] = useState({
    feedback: "",
    rating: 0,
  });
  const [status, setStatus] = useState({
    status: data?.status,
  });

  var user: User;
  const router = useRouter();
  const { data: session } = useSession();
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
      const populateServiceRequests = async (email: any) => {
        const userProfileRes = await fetchUserByUsername(email);
        setUserProfile(userProfileRes.data);

        const param = params.srid;

        apiClient
          .get(`/serviceRequests/${param}`, apiHeader)
          .then((response) => {
            setLoader(false);

            const data = response.data;

            const imageBuffer = Buffer.from(
              response.data.image.data,
              "binary"
            ).toString("base64");
            const imageDataURL = `data:image/jpg;base64,${imageBuffer}`;

            setImageSrc(imageDataURL);

            if (data.feedback != null || data.feedback != undefined) {
              setFormdata({ ...formDatas, feedback: data.feedback });
            }
            if (data.rating == null) {
              setRateValue(0);
            } else {
              setRateValue(data.rating);
              setFormdata({ ...formDatas, rating: Number(rateValue) });
            }
            setData(data);
            console.log(data.rating);
          });
      };

      populateServiceRequests(session?.user?.email);
    }
  }, [session, isMobile]);

  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatus({ status: event.target.value });
    const fd = JSON.stringify(status);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormdata({ ...formDatas, feedback: e.target.value });
  };

  const handleOwnerSubmit = async () => {
    const param = data?.ID;
    apiClient
      .put(`/serviceRequests/${param}`, formDatas, apiHeader)
      .then((response) => {
        setShowFeedbackAlert(true);
        setTimeout(() => {
          setShowFeedbackAlert(false);
        }, 3000);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleManagerSubmit = async (e: React.FormEvent) => {
    const param = data?.ID;
    apiClient
      .put(`/serviceRequests/${param}`, status, apiHeader)
      .then((response) => {
        setShowStatusAlert(true);
        setTimeout(() => {
          setShowStatusAlert(false);
          router.push(`/properties/${params.id}`);
        }, 3000);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const userType = userProfile?.roleType;
  const isManager = userType === "PropertyManager";
  // setRateValue(data?.rating);

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

          {isManager && <Navbar text="Attend Service Request" />}

          {!isManager && <Navbar text="View Service Request" />}

          <div className="mt-2 w-full p-12 flex flex-col items-center">
            <Box padding={"0 11px"}>
              <Box mt={"30px"}>
                <div className="text-sm flex flex-col items-center justify-center">
                  <p className="mt-5 font-extrabold">
                    {data?.priority} Priority {data?.type} Request for{" "}
                  </p>
                  <p className="mt-2 font-extrabold">
                    Property Name: {data?.Property.name}
                  </p>
                  <p className="mt-2 font-extrabold text-center">
                    Location: {data?.Property.address}
                  </p>
                </div>
              </Box>
              <Box mt={"20px"} mb={"7px"}>
                <div className={style.container}>
                  <div className="text-sm flex flex-col items-center">
                    <Image
                      src={imageSrc}
                      className="rounded-md w-80"
                      alt="Image of Service"
                    />
                  </div>
                </div>
              </Box>
              <Box mt={"10px"}>
                <div className="text-sm flex flex-col items-center">
                  {isManager && (
                    <p className="mt-2 font-extrabold">
                      Raised by:
                      <Link
                        href={`/properties/${params.id}/user-details/${data?.Property.ownerId}`}
                      >
                        {" "}
                        {data?.Property.Owner.username}
                      </Link>
                    </p>
                  )}

                  {!isManager && (
                    <p className="mt-2 font-extrabold">
                      Attended by:
                      <Link
                        href={`/properties/${params.id}/user-details/${data?.Property.PropertyManager.managerId}`}
                      >
                        {" "}
                        {data?.Property.PropertyManager.Manager.username}
                      </Link>
                    </p>
                  )}
                </div>
              </Box>
            </Box>

            <div className=" w-full p-12 pb-4 flex flex-col items-center">
              <Box>
                <ServiceRequest
                  sid={data?.ID}
                  userType={userType}
                  serviceLogs={data?.ServiceRequestLogs}
                  documents={data?.Documents}
                />
              </Box>
            </div>

            <div className=" w-80 p-12 pb-4 flex flex-col items-center">
              <Box>
                {isManager && (
                  <TextField
                    className="w-80 mb-4"
                    id="description"
                    label="Description"
                    multiline
                    minRows={3}
                    variant="standard"
                    disabled={isManager}
                    value={String(data?.description)}
                  />
                )}

                {!isManager && (
                  <TextField
                    className="w-80 mb-4"
                    id="description"
                    label="Description"
                    multiline
                    minRows={3}
                    variant="standard"
                    InputProps={{
                      readOnly: true,
                    }}
                    value={String(data?.description)}
                  />
                )}

                <FormControl fullWidth>
                  {isManager && (
                    <div>
                      <InputLabel id="status-select">Status</InputLabel>
                      <Select
                        className="w-full"
                        id="status-select"
                        label="status"
                        onChange={handleStatusChange}
                      >
                        <MenuItem value={"Saved"}>Saved</MenuItem>
                        <MenuItem value={"Sent"}>Sent</MenuItem>
                        <MenuItem value={"InProgress"}>In Progress</MenuItem>
                        <MenuItem value={"Completed"}>Completed</MenuItem>
                        <MenuItem value={"OnHold"}>On Hold</MenuItem>
                        <MenuItem value={"Cancelled"}>Cancelled</MenuItem>
                      </Select>
                    </div>
                  )}

                  {!isManager && (
                    <TextField
                      disabled
                      id="status"
                      label="Status"
                      value={String(data?.status)}
                      InputProps={{
                        readOnly: true,
                      }}
                      variant="standard"
                    />
                  )}

                  {isManager && (
                    <TextField
                      className="w-full mt-4"
                      id="feedback"
                      value={data?.feedback ?? ""}
                      label="Feedback"
                      placeholder="Feedback"
                      variant="standard"
                      size="small"
                      disabled={isManager}
                    />
                  )}

                  {!isManager && (
                    <TextField
                      className="w-full mt-4"
                      id="feedback"
                      label="Feedback"
                      variant="standard"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      defaultValue={data?.feedback}
                      disabled={isManager}
                      onChange={handleChange}
                    />
                  )}
                </FormControl>

                {isManager && (
                  <div className={style.container}>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <Rating
                        className="text-3xl mt-2"
                        name="rating"
                        value={Number(data?.rating)}
                        readOnly
                      />
                    </div>
                  </div>
                )}

                {!isManager && (
                  <div className={style.container}>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <Rating
                        name="rating"
                        className="text-3xl mt-2"
                        // value={Number(data?.rating)}
                        // defaultValue={Number(data?.rating)}
                        value={rateValue}
                        onChange={(event, newValue) => {
                          setRateValue(newValue);
                          if (newValue == null) {
                            setFormdata({ ...formDatas, rating: 0 });
                          } else {
                            setFormdata({ ...formDatas, rating: newValue });
                          }
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="w-full flex justify-center items-center">
                  {isManager && (
                    <Button
                      className="bg-[#3085D2] w-52 mt-5 mb-5"
                      sx={{ textTransform: "none" }}
                      variant="contained"
                      disableElevation
                      onClick={handleManagerSubmit}
                    >
                      Save
                    </Button>
                  )}

                  {!isManager && (
                    <Button
                      className="bg-[#3085D2] w-52 mt-5 mb-5"
                      sx={{ textTransform: "none" }}
                      variant="contained"
                      disableElevation
                      onClick={handleOwnerSubmit}
                    >
                      Save
                    </Button>
                  )}
                </div>
              </Box>
            </div>
          </div>

          <div>
            {showStatusAlert && (
              <Alert
                className="m-10"
                severity="success"
                onClose={() => setShowStatusAlert(false)}
                style={{
                  position: "fixed",
                  bottom: 0,
                  left: 0,
                  zIndex: 9999,
                }}
              >
                <AlertTitle>Status Updated</AlertTitle>
                Status for this service request is updated.
              </Alert>
            )}

            {showFeedbackAlert && (
              <Alert
                className="m-10"
                severity="success"
                onClose={() => setShowFeedbackAlert(false)}
                style={{
                  position: "fixed",
                  bottom: 0,
                  left: 0,
                  zIndex: 9999,
                }}
              >
                <AlertTitle>Updated</AlertTitle>
                Feedback and Rating is updated.
              </Alert>
            )}
          </div>
          <NavbarBottom page="" />
        </>
      )}
    </main>
  );
}
