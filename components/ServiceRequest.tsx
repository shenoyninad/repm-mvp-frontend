import * as React from "react";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import { Card, CardContent } from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import HandymanIcon from "@mui/icons-material/Handyman";
import WidgetsIcon from "@mui/icons-material/Widgets";
import SettingsIcon from "@mui/icons-material/Settings";
import { RequestLogType } from "@shared/enums/repm.enum";
import { ServiceRequests } from "@objectTypes/ServiceRequests.type";
import ModalForm from "./ModalForm";

interface Props {
  sid: any;
  userType: string | undefined;
  serviceLogs?: ServiceRequests["ServiceRequestLogs"];
  documents?: {
    documentId: number;
    name: string;
    content: {
      type: Buffer;
      data: number[];
    };
  }[];
}

const getIconForLogType = (logType: string) => {
  switch (logType) {
    case RequestLogType.PARTS:
      return <WidgetsIcon color="success" sx={{ fontSize: 16 }} />;
    case RequestLogType.REPAIR:
      return <HandymanIcon color="success" sx={{ fontSize: 16 }} />;
    case RequestLogType.SERVICE:
      return <SettingsIcon color="success" sx={{ fontSize: 16 }} />;
    default:
      return <ArticleIcon />;
  }
};

const ServiceRequest: React.FC<Props> = ({
  sid,
  userType,
  serviceLogs = [],
  documents = [],
}: Props) => {
  const isManager = userType === "PropertyManager";

  const openPdfInNewTab = (arg: any) => {
    const bufferData = arg.content.data;

    const blob = new Blob([Buffer.from(bufferData)], {
      type: "application/pdf",
    });

    const pdfUrl = URL.createObjectURL(blob);

    window.open(pdfUrl, "_blank");
  };

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
    <div className=" w-full">
      <Card sx={{}} className="w-custom rounded-lg font-mono h-60">
        <CardContent
          sx={{ p: 0 }}
          style={{ maxHeight: "240px", overflowY: "auto" }}
        >
          <Typography
            className="text-sm sticky top-0 bg-white p-4"
            component="div"
            variant="h6"
            sx={{ mb: 1 }}
          >
            <b>Service Logs</b>

            {!isManager && <span></span>}

            {isManager && (
              <span>
                <ModalForm type="logs" id={sid} />
              </span>
            )}
          </Typography>

          <Box sx={{ pl: 1, pr: 1 }}>
            {serviceLogs.map((log) => (
              <div className="p-4" key={log.serviceRequestLogId}>
                <Grid container spacing={1} alignItems="center">
                  <Grid item xs={8}>
                    <Typography className="text-sm" component="div">
                      {/* <CheckCircleOutlineIcon
                        color="success"
                        sx={{ fontSize: 16 }}
                      /> */}
                      {getIconForLogType(log.type)} {log.description}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography
                      component="div"
                      className="text-xs"
                      sx={{ textAlign: "right" }}
                    >
                      {formatDate(log.startDate)}
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography className="text-xs" component="div">
                      {log.description} {"("} {formatDate(log.endDate)}
                      {")"}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography
                      className="text-sm"
                      component="div"
                      sx={{ textAlign: "right", color: "#0c0c0c" }}
                    >
                      ₹ {log.price}
                    </Typography>
                  </Grid>
                </Grid>
                <Divider sx={{ pt: 2, mb: 2 }} />
              </div>
            ))}
          </Box>
        </CardContent>
      </Card>

      <Divider sx={{ pt: 2, mb: 2 }} />

      <Card
        sx={{ display: "flex" }}
        className=" w-custom rounded-lg font-mono h-40"
      >
        <CardContent
          className="w-full"
          sx={{ p: 0 }}
          style={{ maxHeight: "160px", overflowY: "auto" }}
        >
          <Typography
            className="text-sm sticky top-0 bg-white p-4"
            component="div"
            variant="h6"
            sx={{ mb: 1 }}
          >
            <b>Documents</b>

            {!isManager && <span></span>}

            {isManager && <ModalForm type="document" id={sid} />}
          </Typography>
          <Box sx={{ pl: 1, pr: 1 }}>
            {documents.map((doc) => (
              <div className="p-4" key={doc.documentId}>
                <Grid
                  container
                  spacing={1}
                  alignItems="center"
                  className="cursor-pointer"
                  onClick={() => openPdfInNewTab(doc)}
                >
                  <Grid item xs={12}>
                    <Typography className="text-sm" component="div">
                      <ArticleIcon color="success" sx={{ fontSize: 16 }} />{" "}
                      {doc.name}
                    </Typography>
                  </Grid>
                </Grid>
                <Divider sx={{ pt: 2, mb: 2 }} />
              </div>
            ))}
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceRequest;
