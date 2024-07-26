import {
  IconEdit,
  IconKey,
  IconMoodSadFilled,
  IconPackage,
  IconPackageExport,
  IconPackageImport,
  IconPackageOff,
  IconPackages,
  IconSquareRoundedPlusFilled,
  IconTrash,
  IconTruck,
} from "@tabler/icons-react";
import COLORS from "./colors";

export const authContext = "web";

export const userRoles = {
  ADMIN: "ADMIN",
  "SUPER ADMIN": "SUPER ADMIN",
  MANAGER: "MANAGER",
  "GODOWN MANAGER": "GODOWN MANAGER",
  OPERATOR: "GODOWN KEEPER",
};
export const userWeight = {
  super_admin: 10,
  admin: 8,
  MANAGER: 6,
  "GODOWN MANAGER": 4,
  OPERATOR: 2,
};

export const userColors = {
  ADMIN: COLORS.ADMIN,
  "SUPER ADMIN": COLORS["SUPER ADMIN"],
  MANAGER: COLORS.MANAGER,
  "GODOWN MANAGER": COLORS["GODOWN MANAGER"],
  OPERATOR: COLORS.OPERATOR,
};

export const userBadgeBackgroundColors = {
  "SUPER ADMIN": "rgba(255, 88, 88, 0.1)",
  ADMIN: "rgba(134, 93, 255, 0.1)",
  MANAGER: "rgba(127, 183, 126, 0.1)",
  "GODOWN MANAGER": "rgba(253, 126, 20, 0.1)",
  OPERATOR: "rgba(64, 66, 88, 0.1)",
};

export const orderStatusConst = {
  PENDING: "PENDING",
  // APPROVED: 'APPROVED',
  "IN QUEUE": "IN QUEUE",
  LOADING: "LOADING",
  "IN TRANSIT": "IN TRANSIT",
  UNLOADING: "UNLOADING",
  COMPLETE: "COMPLETE",
  CANCELLED: "CANCELLED",
};

export const orderStatusBadgeColors = {
  PENDING: "yellow",
  // APPROVED: 'indigo',
  "IN QUEUE": "grape",
  LOADING: "orange",
  "IN TRANSIT": "lime",
  UNLOADING: "pink",
  COMPLETE: "green",
  CANCELLED: "red",
};

export const cbcTabNames = {
  scanIn: "SCANNED IN",
  scanOut: "SCANNED OUT",
};

export const orderDetailsType = {
  SO: "SO",
  IGT: "IGT",
};

export const actionLoggerReferenceTypes = {
  USER_MANAGEMENT: "USER_MANAGEMENT",
  LOCATION_MANAGEMENT: "LOCATION_MANAGEMENT",
  ORDER_MANAGEMENT: "ORDER_MANAGEMENT",
  INVENTORY_MANAGEMENT: "INVENTORY_MANAGEMENT",
  DISTRIBUTOR_MANAGEMENT: "DISTRIBUTOR_MANAGEMENT",
};

export const actionLoggerActionsBadgeColor = {
  CREATE: "green",
  UPDATE: "violet",
  DELETE: "red",
  LOGIN: "blue",
  LOGOUT: "orange",
  RESET_PASSWORD: "pink",
};

export const reportTypeConst = {
  STOCK_IN_HAND: "STOCK_IN_HAND",
  OPEN_CBC_STOCK: "OPEN_CBC_STOCK",
  BLOCKED_CBC_STOCK: "BLOCKED_CBC_STOCK",
};

export const actionLoggerIcons = {
  CREATE: <IconSquareRoundedPlusFilled size="0.8rem" />,
  UPDATE: <IconEdit size="0.8rem" />,
  DELETE: <IconTrash size="0.8rem" />,
  LOGIN: <IconKey size="0.8rem" />,
  LOGOUT: <IconMoodSadFilled size="0.8rem" />,
  RESET_PASSWORD: <IconKey size="0.8rem" />,
};

export const actionLoggerIconsGradients = {
  CREATE: { from: "lime", to: "cyan" },
  UPDATE: { from: "yellow", to: "orange" },
  DELETE: { from: "red", to: "darkred" },
  LOGIN: { from: "lime", to: "cyan" },
  LOGOUT: { from: "red", to: "darkred" },
  RESET_PASSWORD: { from: "yellow", to: "orange" },
};

export const DashboardCardIconChoice = (title, color) => {
  switch (title) {
    case "Incoming":
      return (
        <IconPackageImport color={color ? color : "#ffffff"} size="1.5em" />
      );

    case "Outgoing":
      return (
        <IconPackageExport color={color ? color : "#ffffff"} size="1.5em" />
      );

    case "In Transit":
      return <IconTruck color={color ? color : "#ffffff"} size="1.5em" />;

    case "OH Stock":
      return <IconPackages color={color ? color : "#ffffff"} size="1.5em" />;

    case "Open Stock":
      return <IconPackage color={color ? color : "#ffffff"} size="1.5em" />;

    case "Blocked":
      return <IconPackageOff color={color ? color : "#ffffff"} size="1.5em" />;

    default:
      return <IconPackages color={color ? color : "#ffffff"} size="1.5em" />;
  }
};

export function formatDateForDob(inputDateString) {
  const dateObject = new Date(inputDateString);

  const day = String(dateObject.getDate()).padStart(2, "0");
  const month = String(dateObject.getMonth() + 1).padStart(2, "0");
  const year = dateObject.getFullYear();

  return `${day}-${month}-${year}`;
}

export function parseFormattedDate(formattedDateString) {
  const parts = formattedDateString.split("-");
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);

  return new Date(year, month, day);
}

export function calculateAge(birthdateString) {
  const birthdate = new Date(birthdateString);
  const today = new Date();

  let age = today.getFullYear() - birthdate.getFullYear();
  const monthDifference = today.getMonth() - birthdate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthdate.getDate())
  ) {
    age--;
  }

  return age;
}

export const commonDoses = [
  { label: "০+০+১/২", value: "০+০+১/২" },
  { label: "১/২+০+০", value: "১/২+০+০" },
  { label: "০+১/২+০", value: "০+১/২+০" },
  { label: "১/২+১/২+১/২", value: "১/২+১/২+১/২" },
  { label: "১/২+০+১/২", value: "১/২+০+১/২" },
  { label: "০+০+১", value: "০+০+১" },
  { label: "১+০+০", value: "১+০+০" },
  { label: "১+০+১", value: "১+০+১" },
  { label: "১+১+১", value: "১+১+১" },
  { label: "১+১+০", value: "১+১+০" },
  { label: "০+১+০", value: "০+১+০" },
  { label: "২+০+০", value: "২+০+০" },
  { label: "২+২+০", value: "২+২+০" },
  { label: "২+২+২", value: "২+২+২" },
];

export const commonInstructions = [
  { label: "খাবারের পূর্বে", value: "খাবারের পূর্বে" },
  { label: "খাবারের মাঝখানে", value: "খাবারের মাঝখানে" },
  { label: "খাবারের পরে", value: "খাবারের পরে" },
];

export const commonDurations = [
  { value: "১", label: "১" },
  { value: "২", label: "২" },
  { value: "৩", label: "৩" },
  { value: "৪", label: "৪" },
  { value: "৫", label: "৫" },
  { value: "৬", label: "৬" },
  { value: "৭", label: "৭" },
  { value: "৮", label: "৮" },
  { value: "৯", label: "৯" },
  { value: "১০", label: "১০" },
  { value: "১১", label: "১১" },
  { value: "১২", label: "১২" },
  { value: "১৩", label: "১৩" },
  { value: "১৪", label: "১৪" },
  { value: "১৫", label: "১৫" },
  { value: "১৬", label: "১৬" },
  { value: "১৭", label: "১৭" },
  { value: "১৮", label: "১৮" },
  { value: "১৯", label: "১৯" },
  { value: "২০", label: "২০" },
  { value: "২১", label: "২১" },
  { value: "২২", label: "২২" },
  { value: "২৩", label: "২৩" },
  { value: "২৪", label: "২৪" },
  { value: "২৫", label: "২৫" },
  { value: "২৬", label: "২৬" },
  { value: "২৭", label: "২৭" },
  { value: "২৮", label: "২৮" },
  { value: "২৯", label: "২৯" },
  { value: "৩০", label: "৩০" },
];

export const commonTimes = [
  { value: "দিন", label: "দিন" },
  { value: "সপ্তাহ", label: "সপ্তাহ" },
  { value: "মাস", label: "মাস" },
  { value: "বছর", label: "বছর" },
  { value: "চলবে", label: "চলবে" },
];
