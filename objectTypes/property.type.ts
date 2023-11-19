export interface PropertyCard {
  ID: number;
  name: string;
  address: string;
  description: string;
  pincode: string;
  type: string;
  image: string;
  roleType: string;
  propertyManager?: string;
  propertyOwner?: string;
}
