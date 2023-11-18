import Grid from "@mui/material/Grid";
import React from "react";
import Typography from "@mui/material/Typography";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Divider from "@mui/material/Divider";
import Link from "next/link";
import { ServiceRequestStatus } from "@shared/enums/repm.enum";
import ForwardIcon from "@mui/icons-material/Forward";
import LoopIcon from "@mui/icons-material/Loop";
import AddTaskIcon from "@mui/icons-material/AddTask";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import CancelIcon from "@mui/icons-material/Cancel";

interface Props {
  logdecs: string;
  description: string;
  date: string;
  price: number;
  serviceId: number;
  PropertyId: number;
  status: string;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case ServiceRequestStatus.SAVED:
      return <AddTaskIcon color="success" sx={{ fontSize: 16 }} />;
    case ServiceRequestStatus.SENT:
      return <ForwardIcon color="success" sx={{ fontSize: 24 }} />;
    case ServiceRequestStatus.INPROGRESS:
      return <HourglassBottomIcon color="warning" sx={{ fontSize: 16 }} />;
    case ServiceRequestStatus.COMPLETED:
      return <CheckCircleOutlineIcon color="success" sx={{ fontSize: 16 }} />;
    case ServiceRequestStatus.ONHOLD:
      return <LoopIcon color="info" sx={{ fontSize: 16 }} />;
    case ServiceRequestStatus.CANCELLED:
      return <CancelIcon color="error" sx={{ fontSize: 16 }} />;
    default:
      return null;
  }
};

const ServiceComp: React.FC<Props> = (props) => {
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "2-digit",
    };
    const formattedDate = new Date(dateString).toLocaleDateString(
      "en-US",
      options
    );
    return formattedDate;
  };

  return (
    <div className="hover:bg-blue-100 px-3 pt-2 m-auto rounded-lg">
      <Link
        href={`/properties/${props.PropertyId}/service-requests/${props.serviceId}`}
      >
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={8}>
            <Typography noWrap className="text-sm " component="div">
              {getStatusIcon(props.status)} {props.description}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography
              component="div"
              className="text-xs"
              sx={{ textAlign: "right" }}
            >
              {formatDate(props.date)}
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography noWrap className="text-xs " component="div">
              last update: {props.logdecs}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography
              className="text-sm"
              component="div"
              sx={{ textAlign: "right" }}
            >
              ₹{props.price}
            </Typography>
          </Grid>
        </Grid>
        <Divider sx={{ pt: 1, mb: 1 }} />
      </Link>
    </div>
  );
};

export default ServiceComp;
