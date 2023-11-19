import * as React from "react";
import { styled } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import MobileStepper from "@mui/material/MobileStepper";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import apiClient from "@shared/utility/api-util";
import { RoleType } from "@shared/enums/repm.enum";
import { apiHeader } from "@config/config";
import { Reminders } from "@objectTypes/reminder.type";
import { useSession } from "next-auth/react";
import { fetchUserByUsername } from "@shared/utility/fetchUser";

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "light" ? "#fff" : grey[800],
}));

export default function ReminderDetails() {
  const [data, setData] = useState<Reminders[]>([]);
  const [size, setSize] = useState(0);
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      const getUserProfile = async (email: any) => {
        const userProfile = await fetchUserByUsername(email);
        if (userProfile?.data?.roleType === RoleType.PROPERTYMANAGER) {
          const param = userProfile?.data?.userId;

          apiClient.get(`/reminders/${param}`, apiHeader).then((response) => {
            const data = response.data;

            setData(data);
            setSize(response.data.length);
          });
        }
      };

      getUserProfile(session?.user?.email);
    }
  }, [session]);

  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = size;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "2-digit",
    };
    const formattedDate = new Date(dateString).toLocaleDateString(
      "en-US",
      options
    );
    return formattedDate;
  };
  const sizeFlag = data.length > 0;
  return (
    <div>
      {sizeFlag && (
        <StyledBox
          sx={{
            px: 2,
            pb: 2,
            height: "100%",
            overflow: "auto",
          }}
          className="rounded-lg shadow-lg w-80 mt-5 bg-sky-500"
        >
          <div className="items-center justify-center w-full">
            <div className="flex flex-col items-center w-full">
              <div className="p-3">
                <Typography className="font-extrabold flex flex-row items-center text-white">
                  {formatDate(data[activeStep].startDate)}
                </Typography>
              </div>
              <Box
                className="text-black flex flex-col items-center border-2 rounded-lg bg-white overflow-y-scroll"
                sx={{
                  height: 155,
                  maxWidth: 400,
                  width: "100%",
                  p: 2,
                }}
              >
                <span
                  className="text-black font-bold align-top"
                  style={{ padding: "8px" }}
                >
                  {" "}
                  Message
                </span>

                {data[activeStep].message}
              </Box>

              <MobileStepper
                variant="text"
                className="text-xs bg-white rounded-lg mt-2"
                steps={maxSteps}
                position="static"
                activeStep={activeStep}
                nextButton={
                  <Button
                    size="small"
                    onClick={handleNext}
                    className="capitalize px-3"
                    disabled={activeStep === maxSteps - 1}
                  >
                    Next
                    {theme.direction === "rtl" ? (
                      <KeyboardArrowLeft />
                    ) : (
                      <KeyboardArrowRight />
                    )}
                  </Button>
                }
                backButton={
                  <Button
                    size="small"
                    onClick={handleBack}
                    className="capitalize px-3"
                    disabled={activeStep === 0}
                  >
                    {theme.direction === "rtl" ? (
                      <KeyboardArrowRight />
                    ) : (
                      <KeyboardArrowLeft />
                    )}
                    Back
                  </Button>
                }
              />
            </div>
          </div>
        </StyledBox>
      )}
    </div>
  );
}
