"use client";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import "@styles/addNew.css";
import { useRouter } from "next/navigation";
import apiClient from "@shared/utility/api-util";
import { apiHeader } from "@config/config";
import Navbar from "@components/Navbar";
import servicerequestImage from "@public/images/ServiceRequest.jpg";
import NavbarBottom from "@components/NavbarBottom";

interface Props {
  params: any;
}

const CreateServiceRequest: React.FC<Props> = ({ params }) => {
  const propertyId = parseInt(params.id);
  const [datas, setData] = useState<{
    managerName: string;
    name: string;
    description: string;
    address: string;
  } | null>(null);
  const [serviceData, setserviceData] = useState({
    propertyId: propertyId,
    type: "",
    description: "",
    priority: "",
  });
  const [errors, setError] = useState({
    priorityError: false,
    descriptionError: false,
    typeError: false,
  });

  const router = useRouter();

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) {
      router.push("/device");
    }
  }, []);

  useEffect(() => {
    apiClient
      .get(`/properties?propertyId=${propertyId}`, apiHeader)
      .then((response) => {
        const { name, description, address } = response.data;
        const { firstname, lastname } = response.data.PropertyManager.Manager;
        const managerName = firstname + " " + lastname;
        setData({ name, description, managerName, address });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    servicerequestImage.src
  );
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setserviceData({ ...serviceData, [e.target.name]: e.target.value });
    setError((prevError) => ({
      ...prevError,
      [`${e.target.name}Error`]: false,
    }));
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    if (
      selectedFile &&
      serviceData.description &&
      serviceData.priority &&
      serviceData.type
    ) {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("data", JSON.stringify(serviceData));

      try {
        apiClient.post("/serviceRequests", formData, {
          headers: {
            "x-api-key": "a8d6ge7d-5tsa-8d9c-m3b2-30e21c0e9564",
            "Content-Type": "multipart/form-data",
          },
        });
        router.back();
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      if (serviceData.priority === "") {
        setError((prevError) => ({ ...prevError, priorityError: true }));
      }

      if (serviceData.description === "") {
        setError((prevError) => ({ ...prevError, descriptionError: true }));
      }

      if (serviceData.type === "") {
        setError((prevError) => ({ ...prevError, typeError: true }));
      }
    }
  };

  return (
    <main className="w-auto min-h-screen">
      <Navbar text="Create Service Request" />
      <div className=" mx-auto w-screen ">
        <div className="mt-4 w-full p-12 pb-2 flex flex-col items-center">
          {datas ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: 2,
                justifyContent: "space-between",
              }}
              className="relative"
            >
              <Typography
                className="text-sm"
                component="div"
                variant="h6"
                sx={{ mb: 1 }}
              >
                <b>Request for {datas.name}</b>
              </Typography>
              <Typography
                className="text-sm"
                component="div"
                variant="h6"
                sx={{ mb: 1 }}
              >
                <b>Location: </b>
                {datas.address}
              </Typography>
            </Box>
          ) : (
            <></>
          )}

          <Box padding={"0 11px"}>
            <div className="w-80">
              <Card
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                className="rounded-lg font-mono"
              >
                <img
                  src={imagePreview}
                  alt="Image Preview"
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
                  className="object-cover"
                />
              </Card>
              <div className="relative mt-2 mb-2 w-1/2 mx-auto flex flex-col items-center">
                <input
                  style={{ display: "none" }}
                  id="upload-sr-file"
                  type="file"
                  onChange={handleFileChange}
                />
                <label htmlFor="upload-sr-file">
                  <Button
                    component="span"
                    className="bg-[#3085D2] w-52 mt-5"
                    sx={{ textTransform: "none" }}
                    variant="contained"
                    disableElevation
                  >
                    Upload an image
                  </Button>
                </label>
              </div>
              {datas ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    p: 2,
                    justifyContent: "space-between",
                  }}
                  className="relative mt-4"
                >
                  <Typography
                    className="text-sm"
                    component="div"
                    variant="h6"
                    sx={{ mb: 1 }}
                  >
                    <p>
                      <b>Managed By: </b>
                      {datas?.managerName}
                    </p>
                  </Typography>
                </Box>
              ) : (
                <></>
              )}
              <Box
                component="form"
                className="flex-col items-center justify-center bg-white p-5 rounded-lg shadow-lg lg:w-auto"
              >
                <div className="relative mb-2">
                  <TextField
                    select
                    className="w-full text-sm"
                    id="request-type"
                    label="Type"
                    variant="standard"
                    name="type"
                    error={errors.typeError}
                    helperText={
                      errors.typeError ? "This field is required" : ""
                    }
                    value={serviceData.type}
                    onChange={handleChange}
                  >
                    <MenuItem value="Plumbing">Plumbing</MenuItem>
                    <MenuItem value="Electrical">Electrical</MenuItem>
                    <MenuItem value="Paperwork">Paperwork</MenuItem>
                    <MenuItem value="Painting">Painting</MenuItem>
                    <MenuItem value="Civil">Civil</MenuItem>
                  </TextField>
                </div>
                <div className="relative mb-2">
                  <TextField
                    className="w-full"
                    id="request-description"
                    label="Description"
                    variant="standard"
                    name="description"
                    error={errors.descriptionError}
                    helperText={
                      errors.descriptionError ? "description is required" : ""
                    }
                    value={serviceData.description}
                    onChange={handleChange}
                  />
                </div>
                <div className="relative mb-2">
                  <TextField
                    select
                    className="w-full"
                    id="request-priority"
                    label="Priority"
                    variant="standard"
                    name="priority"
                    error={errors.priorityError}
                    helperText={
                      errors.priorityError ? "This field is required" : ""
                    }
                    value={serviceData.priority}
                    onChange={handleChange}
                  >
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Low">Low</MenuItem>
                  </TextField>
                </div>
              </Box>
            </div>
            <div className="container mt-5 w-full flex flex-col items-center pb-2">
              <Button
                className="bg-[#3085D2] w-52 mb-16"
                sx={{ textTransform: "none" }}
                variant="contained"
                disableElevation
                onClick={handleSubmit}
              >
                Save & Notify Manager
              </Button>
            </div>
          </Box>
        </div>
      </div>
      <NavbarBottom page="" />
    </main>
  );
};

export default CreateServiceRequest;
