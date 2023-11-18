import React from "react";
import { manager } from "@objectTypes/manager.type";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import managerIcon from "../public/images/manager-icon.png";
import Image from "next/image";
import { Rating } from "@mui/material";
interface Props {
  managers: manager;
}

const ManagerCard: React.FC<Props> = (props) => {
  return (
    <div className="mt-4 w-full">
      <Card
        sx={{ display: "flex" }}
        className="w-custom rounded-lg font-mono h-36 shadow-lg max-w-screen-lg"
      >
        <Image
          className="w-28 h-28 object-fill m-auto"
          src={managerIcon}
          alt="Manager Image"
        />
        <Box
          sx={{ display: "flex", flexDirection: "column" }}
          className="relative"
        >
          <CardContent sx={{ flex: "1 0 auto" }}>
            <Typography className="text-sm" component="div" variant="h4">
              <b>
                {props.managers.firstname}&nbsp;{props.managers.lastname}
              </b>
            </Typography>
            <Typography
              noWrap
              className="text-sm mt-2 w-48"
              variant="caption"
              component="div"
            >
              <b className="text-sm">Contact details:</b>
              <p>{props.managers.phone}</p>
              <p className="truncate">{props.managers.email}</p>
            </Typography>
            <Typography
              className="text-sm mt-2"
              variant="caption"
              component="div"
            >
              {props.managers.averageRating ? (
                <div className="flex flex-row">
                  <Rating
                    name="rating"
                    className="text-xl"
                    value={props.managers.averageRating}
                    precision={0.5}
                  />
                  ({props.managers.totalServiceRequests} ratings)
                </div>
              ) : (
                <div className="flex flex-row">
                  <Rating name="rating" className="text-xl" value={0} />(
                  {props.managers.totalServiceRequests} ratings)
                </div>
              )}
            </Typography>
            <div className="flex flex-row justify-between text-sm mt-3 align-middle w-40">
              <p className=""></p>
            </div>
          </CardContent>
          <Box
            sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}
          ></Box>
        </Box>
      </Card>
    </div>
  );
};

export default ManagerCard;
