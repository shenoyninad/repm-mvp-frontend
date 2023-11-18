import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import HomeIcon from "@mui/icons-material/Home";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import AssessmentIcon from "@mui/icons-material/Assessment";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";

interface Props {
  page: string;
}

const NavbarBottom = ({ page }: Props) => {
  const router = useRouter();

  return (
    <header className="md:fixed left-0 right-0 bottom-0 md:bg-palette-fill shadow-md app_header_b fixed z-[999] bg-[#fff] rounded-tl-lg rounded-tr-lg">
      <div className="flex flex-col items-center md:px-2">
        <div className="relative flex items-center justify-evenly md:order-2">
          <div className="relative flex flex-row justify-between items-center w-full px-2 py-1">
            <div
              className={`flex flex-col items-center ${
                page === "profile" ? "bg-blue-200" : ""
              }  rounded-lg p-1`}
            >
              <Button
                onClick={() => router.push("/profile")}
                variant="text"
                disableElevation
              >
                <AccountBoxIcon className="text-black text-xl" />
              </Button>
              <p className="text-xs">My Profile</p>
            </div>
            <div
              className={`flex flex-col items-center ${
                page === "properties" ? "bg-blue-200" : ""
              }  rounded-lg p-1`}
            >
              <Button
                onClick={() => router.push("/properties")}
                variant="text"
                disableElevation
              >
                <HomeWorkIcon className="text-black text-xl" />
              </Button>
              <p className="text-xs">Properties</p>
            </div>
            <div
              className={`flex flex-col items-center ${
                page === "home" ? "bg-blue-200" : ""
              }  rounded-lg p-1`}
            >
              <Button
                onClick={() => router.push("/")}
                variant="text"
                disableElevation
              >
                <HomeIcon className="text-black text-xl" />
              </Button>
              <p className="text-xs">Home</p>
            </div>
            <div
              className={`flex flex-col items-center ${
                page === "reports" ? "bg-blue-200" : ""
              }  rounded-lg p-1`}
            >
              <Button
                variant="text"
                onClick={() => router.push("/reports")}
                disableElevation
              >
                <AssessmentIcon className="text-black text-xl" />
              </Button>
              <p className="text-xs">Reports</p>
            </div>
            <div
              className={`flex flex-col items-center ${
                page === "help" ? "bg-blue-200" : ""
              }  rounded-lg p-1`}
            >
              <Button
                onClick={() => router.push("/help")}
                variant="text"
                disableElevation
              >
                <HelpCenterIcon className="text-black text-xl" />
              </Button>
              <p className="text-xs">Help</p>
            </div>
          </div>
          <div className="flex gap-4"></div>
        </div>
      </div>
    </header>
  );
};

export default NavbarBottom;
