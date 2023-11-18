import * as React from "react";
import { Global } from "@emotion/react";
import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useState } from "react";
import { grey } from "@mui/material/colors";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/navigation";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { apiHeader } from "@config/config";
import apiClient from "@shared/utility/api-util";

const drawerBleeding = 50;

interface Props {
  propertyId: any;
  window?: () => Window;
  managerId: any;
  propertyDescription: any;
  propertyTitle: any;
}

const Root = styled("div")(({ theme }) => ({
  height: "100%",
  backgroundColor:
    theme.palette.mode === "light"
      ? grey[100]
      : theme.palette.background.default,
}));

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "light" ? "#fff" : grey[800],
}));

const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.mode === "light" ? grey[300] : grey[900],
  borderRadius: 3,
  position: "absolute",
  top: 8,
  left: "calc(50% - 15px)",
}));

const AssignPropety: React.FC<Props> = (props) => {
  const managerId: number = parseInt(props.managerId);
  const propertyId: number = parseInt(props.propertyId);
  const { window } = props;
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  let notch = "hidden";
  const d = new Date();
  const [formDatas, setFormdata] = useState({
    managerId: managerId,
    startDate: d.toISOString(),
    endDate: d.toISOString(),
  });
  const [showAlert, setShowAlert] = useState(false);
  const [selectedstartDateTime, setSelectedstartDateTime] =
    useState<Date | null>();
  const [selectedendDateTime, setSelectedendDateTime] = useState<Date | null>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormdata({ ...formDatas, [e.target.name]: e.target.value });
  };

  const handleStartDateChange = () => {
    if (selectedstartDateTime == undefined) {
    } else {
      setFormdata({
        ...formDatas,
        startDate: selectedstartDateTime.toISOString(),
      });
    }
  };

  const handleEndDateChange = () => {
    if (selectedendDateTime == undefined) {
    } else {
      setFormdata({
        ...formDatas,
        endDate: selectedendDateTime.toISOString(),
      });
    }
  };

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
    notch = "visible";
  };

  const SaveData = (close: boolean) => {
    try {
      apiClient.post(`/properties/${propertyId}/manager`, formDatas, apiHeader);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      setOpen(close);
      notch = "hidden";
      router.push(`/properties/${propertyId}`);
    } catch (error) {
      console.error("Error:", error);
      setOpen(true);
    }
  };

  // This is used only for the example
  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Root>
      <CssBaseline />
      <Global
        styles={{
          ".MuiDrawer-root > .MuiPaper-root": {
            height: `calc(50% - ${drawerBleeding}px)`,
            overflow: "visible",
          },
        }}
      />
      <Box sx={{ textAlign: "center" }}>
        <Button
          className="bg-[#3085D2] h-12 rounded-xl w-52"
          sx={{ textTransform: "none" }}
          variant="contained"
          disableElevation
          onClick={toggleDrawer(true)}
        >
          Assign to Property
        </Button>
      </Box>
      <SwipeableDrawer
        container={container}
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={true}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <StyledBox
          sx={{
            position: "absolute",
            top: -drawerBleeding,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: { notch },
            right: 0,
            left: 0,
          }}
        >
          <Puller />
          <Typography className="font-bold " sx={{ p: 2 }}>
            Assign to Property
          </Typography>
        </StyledBox>
        <StyledBox
          className=" flex flex-col justify-center items-center"
          sx={{
            px: 2,
            pb: 2,
            height: "100%",
            overflow: "auto",
          }}
        >
          <div className="w-80 ">
            <div className="relative mb-2">
              <TextField
                disabled
                className="w-full"
                id="request-type"
                label="Property"
                variant="standard"
                name="propertyType"
                value={String(props.propertyTitle)}
                onChange={handleChange}
              />
            </div>
            <div className="relative mb-2">
              <TextField
                disabled
                className="w-full mt-2"
                id="request-address"
                label="Description"
                variant="standard"
                name="description"
                value={String(props.propertyDescription)}
                onChange={handleChange}
              />
            </div>
            <div className="relative mb-2">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DateTimePicker
                    label="Start Date"
                    value={selectedstartDateTime}
                    onChange={(newDate, context) => {
                      setSelectedstartDateTime(newDate);
                      handleStartDateChange();
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </div>
            <div className="relative mb-2">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DateTimePicker
                    label="End Date"
                    value={selectedendDateTime}
                    onChange={(newDate, context) => {
                      setSelectedendDateTime(newDate);
                      handleEndDateChange();
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </div>
          </div>
          <Button
            className="bg-[#3085D2] h-12 mt-2 text-md rounded-xl w-52"
            sx={{ textTransform: "none" }}
            variant="contained"
            disableElevation
            onClick={() => {
              SaveData(false);
            }}
          >
            Save
          </Button>
          <div>
            {showAlert && (
              <Alert
                className="m-10"
                severity="success"
                onClose={() => setShowAlert(false)}
                style={{
                  position: "fixed",
                  bottom: 0,
                  left: 0,
                  zIndex: 9999,
                }}
              >
                <AlertTitle>Status Updated</AlertTitle>
                Document Added
              </Alert>
            )}
          </div>
        </StyledBox>
      </SwipeableDrawer>
    </Root>
  );
};
export default AssignPropety;
