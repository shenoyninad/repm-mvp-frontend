import { PropertyCard } from "@objectTypes/property.type.js";
import PropertyDetails from "./PropertyDetails";

interface Props {
  propertyList: PropertyCard[];
}

const PropertyList: React.FC<Props> = ({ propertyList }) => {
  return (
    <div>
      {propertyList.map((property: PropertyCard) => {
        return (
          <PropertyDetails key={property.ID} property={property} />
        );
      })}
    </div>
  );
};

export default PropertyList;
