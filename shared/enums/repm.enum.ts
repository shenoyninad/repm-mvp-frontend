enum RoleType {
  PROPERTYOWNER = "PropertyOwner",
  PROPERTYMANAGER = "PropertyManager",
}

enum RequestType {
  PLUMBING = "Plumbing",
  ELECTRICAL = "Electrical",
  PAPERWORK = "Paperwork",
  PAINTING = "Painting",
  CIVIL = "Civil",
}

enum PriorityType {
  HIGH = "High",
  MEDIUM = "Medium",
  LOW = "Low",
}

enum PropertyType {
  FLAT = "Flat",
  HOUSE = "House",
  VILLA = "Villa",
}

enum RequestLogType {
  PARTS = "Parts",
  REPAIR = "Repair",
  SERVICE = "Service",
}

enum ReminderStatus {
  SENT = "Sent",
  SEEN = "Seen",
  DISMISSED = "Dismissed",
  SNOOZED = "Snoozed",
}

enum ServiceRequestStatus {
  SAVED = "Saved",
  SENT = "Sent",
  INPROGRESS = "InProgress",
  COMPLETED = "Completed",
  ONHOLD = "OnHold",
  CANCELLED = "Cancelled",
}

export {
  RoleType,
  RequestType,
  PriorityType,
  PropertyType,
  RequestLogType,
  ReminderStatus,
  ServiceRequestStatus,
};
