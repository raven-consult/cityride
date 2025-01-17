

/// [START] User Type

export type Role = "passenger" | "driver";

export interface DriverInfo {
  carNumber: string;
  maxPassengers: number;
}

export interface UserData {
  role: Role;
  email: string;
  displayName: string;
  driverInfo?: DriverInfo;
}

/// [END] User Type