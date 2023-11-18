import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Link from "next/link";
import Navbar from "./Navbar";
import VisibilityIcon from "@mui/icons-material/Visibility";

interface Props {
  name: string;
  text: string;
  image: string;
  pm: string;
  location: string;
  propertyid: any;
  ownerid: any;
}
const Propertiesdetails: React.FC<Props> = (props) => {
  return (
    <main>
      <Navbar text="Property Details" />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        className="relative mt-20"
      >
        <Card sx={{ display: "flex" }} className="rounded-lg font-mono ">
          <img
            className="h-48 w-80 object-fill"
            src={props.image}
            alt="Live from space album cover"
          />
        </Card>
      </Box>
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
          <b>{props.name}</b>
        </Typography>
        <Typography
          className="text-sm"
          component="div"
          variant="h6"
          sx={{ mb: 1 }}
        >
          <b>Location: </b>
          {props.location}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: 1,
            justifyContent: "space-between",
          }}
          className="relative "
        >
          <Typography
            className="text-sm"
            component="div"
            variant="h6"
            sx={{ mb: 1 }}
          >
            <div className=" flex">
              <b>{props.text} </b>

              {props.text === "Currently Managed By:" ? (
                <p>
                  &nbsp;
                  <Link
                    href={`/properties/${props.propertyid}/user-details/${props.ownerid}`}
                    className="text-blue-500 hover:text-blue-800"
                  >
                    {props.pm}
                  </Link>
                  &nbsp;(
                  <Link
                    href={`/properties/${props.propertyid}/managers/`}
                    className="text-blue-500 hover:text-blue-800"
                  >
                    Edit
                  </Link>
                  )
                </p>
              ) : (
                <div>
                  &nbsp;
                  <Link
                    href={`/properties/${props.propertyid}/user-details/${props.ownerid}`}
                    className="text-black"
                  >
                    {props.pm} <VisibilityIcon sx={{ fontSize: 16 }} />
                  </Link>
                </div>
              )}
            </div>
          </Typography>
        </Box>
      </Box>
    </main>
  );
};
export default Propertiesdetails;
