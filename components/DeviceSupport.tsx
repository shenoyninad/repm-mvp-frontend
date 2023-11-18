import { Image } from "@chakra-ui/react";
import { Typography } from "@mui/material";
import phoneImage from "@public/images/phone-icon-color.svg";

export default function DeviceSupport() {
  return (
    <main className="flex flex-col items-center ">
      <div className="w-full flex flex-col items-center align-middle">
        <Image
          className="h-36 mt-10 lg:h-52"
          src={phoneImage.src}
          alt="help icon"
        />
      </div>
      <div className="items-center ">
        <Typography
          className="text-sm sticky p-4"
          component="div"
          variant="h6"
          sx={{ mb: 1 }}
        >
          <b>
            This app isn&apos;t supported on a non-mobile device. Please switch
            to a mobile device for a better experience.
          </b>
        </Typography>
      </div>
    </main>
  );
}
