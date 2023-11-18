export interface PropertyCard {
  propertyId: number;
  name: string;
  address: string;
  description: string;
  pincode: string;
  propertyType: string;
  image: string;
  roleType: string;
  propertyManager?: string;
  propertyOwner?: string;
}
