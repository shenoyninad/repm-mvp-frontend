import * as React from "react";
import { useState } from "react";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { Button, Box, Input } from "@mui/material";
import Modal from "@mui/material/Modal";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { apiHeader } from "@config/config";
import apiClient from "@shared/utility/api-util";
import { useRouter } from "next/navigation";

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "400px",
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

interface Props {
  type: string;
  id: number;
}

const ModalForm: React.FC<Props> = ({ type, id }: Props) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSelectedFile(undefined);
  };

  const [selectedstartDateTime, setSelectedstartDateTime] =
    useState<Date | null>();
  const [selectedendDateTime, setSelectedendDateTime] = useState<Date | null>();

  const isLogs = type === "logs";
  const [showDocumentAlert, setShowDocumentAlert] = useState(false);
  const [showLogAlert, setShowLogAlert] = useState(false);

  const router = useRouter();

  const handleUpload = async () => {
    try {
      formDatas.price = Number(formDatas.price);
      const response = await apiClient.post(
        `/serviceRequests/${id}/logs`,
        formDatas,
        apiHeader
      );

      handleClose();
      setShowLogAlert(true);
      setTimeout(() => {
        setShowLogAlert(false);
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const d = new Date();
  const [formDatas, setFormdata] = useState({
    type: "",
    startDate: d.toISOString(),
    endDate: d.toISOString(),
    price: 0,
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name == "price") {
      const price = Number(e.target.value);
      setFormdata({ ...formDatas, price: price });
    }

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

  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);

  const handleFileChange = async (e: any) => {
    const file = e.target.files[0];

    setSelectedFile(file);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file before uploading.");
      return;
    }

    try {
      const filedata = new FormData();
      filedata.append("document", selectedFile, selectedFile.name);

      const response = await apiClient.post(
        `/serviceRequests/${id}/documents`,
        filedata,
        {
          headers: {
            "x-api-key": "a8d6ge7d-5tsa-8d9c-m3b2-30e21c0e9564",
            "Content-Type": "multipart/form-data",
          },
        }
      );
      handleClose();
      setShowDocumentAlert(true);
      setTimeout(() => {
        setShowDocumentAlert(false);
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <span>
      {isLogs && (
        <span>
          <Button
            className="absolute right-0 p-0"
            style={{ textTransform: "none" }}
            onClick={handleOpen}
            variant="text"
            disableElevation
          >
            Add
          </Button>

          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box component="form" sx={modalStyle} noValidate autoComplete="off">
              <div className="absolute top-0 right-0 m-2 cursor-pointer">
                <CloseIcon onClick={handleClose} />
              </div>
              <div className="relative mb-2">
                <h3 className="font-extrabold flex flex-col items-center mb-2">
                  Add Service Request Log
                </h3>
                <TextField
                  select
                  className="w-full"
                  id="request-type"
                  label="Request Type"
                  variant="standard"
                  name="type"
                  value={formDatas.type}
                  onChange={handleChange}
                >
                  <MenuItem value="Parts">Parts</MenuItem>
                  <MenuItem value="Repair">Repair</MenuItem>
                  <MenuItem value="Service">Service</MenuItem>
                </TextField>
              </div>

              <div className="relative mb-2 mt-5">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker"]}>
                    <DateTimePicker
                      className="w-full"
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
                      className="w-full"
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
              <div className="relative mb-2">
                <TextField
                  required
                  type="number"
                  className="w-full"
                  id="request-price"
                  label="Price"
                  variant="standard"
                  name="price"
                  onChange={handleChange}
                />
              </div>
              <div className="relative mb-2">
                <TextField
                  className="w-full"
                  id="request-description"
                  label="Description"
                  multiline
                  minRows={3}
                  variant="standard"
                  name="description"
                  value={formDatas.description}
                  onChange={handleChange}
                />
              </div>

              <div className="relative mb-2 mt-4 flex justify-center items-center">
                <Button
                  className="bg-[#3085D2] w-52 mt-2"
                  sx={{ textTransform: "none" }}
                  variant="contained"
                  disableElevation
                  onClick={handleUpload}
                >
                  Save
                </Button>
              </div>
            </Box>
          </Modal>
        </span>
      )}

      {!isLogs && (
        <span>
          <Button
            className="absolute right-0 p-0"
            style={{ textTransform: "none" }}
            onClick={handleOpen}
            variant="text"
            disableElevation
          >
            Add
          </Button>

          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box
              sx={modalStyle}
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
            >
              <div className="absolute top-0 right-0 m-2 cursor-pointer">
                <CloseIcon onClick={handleClose} />
              </div>

              <Input
                type="file"
                id="file-input"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <label htmlFor="file-input">
                <Button
                  className="mb-5 w-52 capitalize"
                  variant="outlined"
                  color="primary"
                  component="span"
                  startIcon={<CloudUploadIcon />}
                >
                  Select File
                </Button>
              </label>
              {selectedFile && <p>Selected file: {selectedFile.name}</p>}
              <Button
                className="w-52 bg-[#3085D2] capitalize mt-2"
                variant="contained"
                color="primary"
                onClick={handleFileUpload}
                disabled={!selectedFile}
              >
                Upload
              </Button>
            </Box>
          </Modal>
        </span>
      )}

      <div>
        {showDocumentAlert && (
          <Alert
            className="m-10"
            severity="success"
            onClose={() => setShowDocumentAlert(false)}
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              zIndex: 9999,
            }}
          >
            <AlertTitle>Document</AlertTitle>
            Document Added
          </Alert>
        )}

        {showLogAlert && (
          <Alert
            className="m-10"
            severity="success"
            onClose={() => setShowLogAlert(false)}
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              zIndex: 9999,
            }}
          >
            <AlertTitle>Service Request Log</AlertTitle>
            Service Request Log Added
          </Alert>
        )}
      </div>
    </span>
  );
};

export default ModalForm;
