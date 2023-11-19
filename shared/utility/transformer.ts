import { PropertyCard } from "@objectTypes/property.type";
import { RoleType } from "@shared/enums/repm.enum";

const transformOwnerProperties = (apiResponse: any[]): any[] => {
  const transformedProperties: PropertyCard[] = [];

  for (const property of apiResponse) {
    const imageBuffer = Buffer.from(property.image, "binary").toString(
      "base64"
    );
    const imageDataURL = `data:image/jpg;base64,${imageBuffer}`;

    const propertyToAdd = {
      ID: property.ID,
      name: property.name,
      address: property.address,
      description: property.description,
      pincode: property.pincode,
      type: property.type,
      roleType: RoleType.PROPERTYOWNER,
      image: imageDataURL,
      propertyManager: property.PropertyManager?.Manager?.username ?? "NA",
    };
    transformedProperties.push(propertyToAdd);
  }

  return transformedProperties;
};

const transformManagerProperties = (apiResponse: any) => {
  const transformedProperties: PropertyCard[] = [];

  for (const property of apiResponse) {
    const imageBuffer = Buffer.from(
      property.Property?.image,
      "binary"
    ).toString("base64");
    const imageDataURL = `data:image/jpg;base64,${imageBuffer}`;

    const propertyToAdd = {
      ID: property.ID,
      name: property.Property?.name,
      address: property.Property?.address,
      description: property.Property?.description,
      pincode: property.Property?.pincode,
      type: property.Property?.type,
      roleType: RoleType.PROPERTYMANAGER,
      image: imageDataURL,
      propertyOwner: property.Property?.Owner?.username ?? "NA",
    };
    transformedProperties.push(propertyToAdd);
  }

  return transformedProperties;
};

export { transformOwnerProperties, transformManagerProperties };
