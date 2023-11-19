import BookmarkIcon from "@mui/icons-material/Bookmark";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { PropertyCard } from "@objectTypes/property.type.js";
import { RoleType } from "@shared/enums/repm.enum";
import Link from "next/link";

interface Props {
  property: PropertyCard;
}

const PropertyDetails: React.FC<Props> = ({ property }) => {
  return (
    <div className="flex flex-col mt-4 w-full">
      <Link href={`/properties/${property.ID}`}>
        <Card
          sx={{ display: "flex" }}
          className="w-custom rounded-lg font-mono h-min shadow-lg"
        >
          <CardMedia
            component="img"
            sx={{ width: 125 }}
            image={property.image}
          />
          <Box
            sx={{ display: "flex", flexDirection: "column" }}
            className="relative w-full"
          >
            <CardContent sx={{ flex: "1 0 auto" }}>
              <Typography
                className="text-sm line-clamp-1 w-[90%]"
                component="div"
                variant="h6"
              >
                <b className="line-clamp-1" title={property.name}>
                  {property.name}
                </b>
              </Typography>
              <Typography className="text-sm mt-1" component="div" variant="h6">
                {`${property.type} ${property.description}`}
              </Typography>
              <Typography className="mb-2" variant="caption" component="div">
                {`${property.address}, ${property.pincode}`}
              </Typography>
              <Typography className="text-sm" component="div" variant="h6">
                {property.roleType == RoleType.PROPERTYOWNER ? (
                  <p>
                    <b>Manager: </b>
                    {property.propertyManager}
                  </p>
                ) : (
                  <p>
                    <b>Owned by: </b>
                    {property.propertyOwner}
                  </p>
                )}
              </Typography>
              <div className="flex flex-row-reverse w-full">
                <BookmarkIcon />
              </div>
            </CardContent>
            <Box
              sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}
            ></Box>
          </Box>
        </Card>
      </Link>
    </div>
  );
};

export default PropertyDetails;
