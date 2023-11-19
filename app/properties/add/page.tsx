"use client";
import Button from "@mui/material/Button";
import { Image } from "@chakra-ui/react";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import "@styles/addNew.css";
import { useRouter } from "next/navigation";
import apiClient from "@shared/utility/api-util";
import { Backdrop, CircularProgress } from "@mui/material";
import Navbar from "@components/Navbar";
import { User } from "@objectTypes/user.type";
import { useSession } from "next-auth/react";
import { fetchUserByUsername } from "@shared/utility/fetchUser";
import addPropertyImage from "@public/images/addProperty.webp";
import NavbarBottom from "@components/NavbarBottom";
import DeviceSupport from "@components/DeviceSupport";

const AddProperty = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();

  var user: User;
  const { data: session } = useSession();
  const [userProfile, setUserProfile] = useState<typeof user | undefined>();
  const [isMobile, setIsMobile] = useState(true);
  const [loader, setLoader] = useState(false);
  const [errors, setError] = useState({
    addressError: false,
    nameError: false,
    descriptionError: false,
    propertyTypeError: false,
    pincodeError: false,
    imageError: false,
  });
  const [formDatas, setFormdata] = useState({
    type: "",
    name: "",
    address: "",
    description: "",
    pincode: "",
    ownerId: 0,
  });

  const [imagePreview, setImagePreview] = useState<string>(
    addPropertyImage.src
  );

  useEffect(() => {
    if (session) {
      const mobileScreen = /iPhone|iPad|iPod|Android/i.test(
        navigator.userAgent
      );
      if (!mobileScreen) {
        setIsMobile(false);
      }
      const getUserProfile = async (email: any) => {
        const userProfile = await fetchUserByUsername(email);
        setUserProfile(userProfile?.data);
      };

      getUserProfile(session?.user?.email);
    }
  }, [session, isMobile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
        setError((prevError) => ({ ...prevError, imageError: false }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormdata({
      ...formDatas,
      [e.target.name]: e.target.value,
      ownerId: userProfile!.userId,
    });
    setError((prevError) => ({
      ...prevError,
      [`${e.target.name}Error`]: false,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    const regex = /^\d{6}$/;
    if (
      selectedFile &&
      formDatas.address &&
      formDatas.description &&
      formDatas.name &&
      formDatas.type &&
      regex.test(formDatas.pincode)
    ) {
      setLoader(true);
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("data", JSON.stringify(formDatas));

      try {
        apiClient.post("/properties", formData, {
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
      if (formDatas.address === "") {
        setError((prevError) => ({ ...prevError, addressError: true }));
      }

      if (formDatas.description === "") {
        setError((prevError) => ({ ...prevError, descriptionError: true }));
      }

      if (formDatas.name === "") {
        setError((prevError) => ({ ...prevError, nameError: true }));
      }
      if (formDatas.type === "") {
        setError((prevError) => ({ ...prevError, propertyTypeError: true }));
      }

      if (formDatas.pincode === "" || !regex.test(formDatas.pincode)) {
        setError((prevError) => ({ ...prevError, pincodeError: true }));
      }
      if (selectedFile == null) {
        setError((prevError) => ({ ...prevError, imageError: true }));
      }
    }
  };

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
          <Navbar text="Add new Property" />

          <div className="mt-8 w-full p-12 flex flex-col items-center">
            <Box padding={"0 11px"} className=" w-80">
              <Card
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                className="rounded-lg font-mono"
              >
                <Image
                  src={imagePreview}
                  alt="Image Preview"
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
                  className="object-cover"
                />
              </Card>
              <div className="relative flex flex-col items-center">
                <input
                  style={{ display: "none" }}
                  id="upload-property-image"
                  type="file"
                  onChange={handleFileChange}
                />
                <label htmlFor="upload-property-image">
                  <Button
                    component="span"
                    className="bg-[#3085D2] w-52 mt-5"
                    sx={{ textTransform: "none" }}
                    variant="contained"
                    disableElevation
                  >
                    Choose an image
                  </Button>
                  <span>
                    {errors.imageError && (
                      <p className=" text-red-700 text-xs">
                        Please select an image
                      </p>
                    )}
                  </span>
                </label>
              </div>
              <Box component="form" noValidate autoComplete="off">
                <div className="relative mb-2 mt-5">
                  <TextField
                    select
                    className="w-full"
                    id="request-type"
                    label="Type"
                    variant="standard"
                    name="type"
                    error={errors.propertyTypeError}
                    helperText={
                      errors.propertyTypeError ? "This field is required" : ""
                    }
                    value={formDatas.type}
                    onChange={handleChange}
                  >
                    <MenuItem value="Villa">Villa</MenuItem>
                    <MenuItem value="Flat">Flat</MenuItem>
                    <MenuItem value="House">House</MenuItem>
                  </TextField>
                </div>
                <div className="relative mb-2">
                  <TextField
                    className="w-full"
                    id="request-name"
                    label="Name"
                    variant="standard"
                    name="name"
                    error={errors.nameError}
                    helperText={errors.nameError ? "Name is required" : ""}
                    value={formDatas.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="relative mb-2">
                  <TextField
                    className="w-full"
                    id="request-building"
                    label="Description"
                    multiline
                    minRows={3}
                    variant="standard"
                    name="description"
                    error={errors.descriptionError}
                    helperText={
                      errors.descriptionError ? "Description is required" : ""
                    }
                    value={formDatas.description}
                    onChange={handleChange}
                  />
                </div>
                <div className="relative mb-2">
                  <TextField
                    className="w-full"
                    id="request-address"
                    label="Address"
                    variant="standard"
                    name="address"
                    error={errors.addressError}
                    helperText={
                      errors.addressError ? "Address is required" : ""
                    }
                    value={formDatas.address}
                    onChange={handleChange}
                  />
                </div>

                <div className="relative mb-2">
                  <TextField
                    className="w-full"
                    id="request-pincode"
                    label="Pincode"
                    variant="standard"
                    name="pincode"
                    error={errors.pincodeError}
                    helperText={
                      errors.pincodeError ? "Pincode is required/incorrect" : ""
                    }
                    value={formDatas.pincode}
                    onChange={handleChange}
                  />
                </div>

                <div className="container w-full flex flex-col items-center mt-6 mb-10">
                  <Button
                    className="bg-[#3085D2] w-52"
                    sx={{ textTransform: "none" }}
                    variant="contained"
                    disableElevation
                    onClick={handleSubmit}
                  >
                    Save Property to Portfolio
                  </Button>
                </div>
              </Box>
            </Box>
          </div>
          <NavbarBottom page="" />
        </>
      )}
    </main>
  );
};

export default AddProperty;
