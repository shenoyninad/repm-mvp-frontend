export interface ServiceRequests {
  serviceRequestId: number;
  propertyId: number;
  type: string;
  requestDate: string;
  description: string;
  feedback: string | null;
  status: string;
  priority: string;
  rating: number | null;
  image: {
    type: string;
    data: number[];
  };
  createdAt: string;
  updatedAt: string;

  Property: {
    propertyId: number;
    propertyType: string;
    name: string;
    address: string;
    description: string;
    image: {
      type: Buffer;
      data: number[];
    };
    ownerId: number;
    createdAt: string;
    updatedAt: string;

    Owner: {
      username: string;
      firstname: string;
      lastname: string;
      createdAt: string;
      updatedAt: string;
    };

    PropertyManager: {
      propertyManagerId: number;
      propertyId: number;
      managerId: number;
      startdate: string;
      endstate: string;
      createdAt: string;
      updatedAt: string;
      Manager: {
        username: string;
        firstname: string;
        lastname: string;
        createdAt: string;
        updatedAt: string;
      };
    };
  };
  Documents: {
    documentId: number;
    name: string;
    content: {
      type: Buffer;
      data: number[];
    };
  }[];
  ServiceRequestLogs: {
    serviceRequestLogId: number;
    type: string;
    startDate: string;
    endDate: string;
    price: number;
    description: string;
  }[];
}
