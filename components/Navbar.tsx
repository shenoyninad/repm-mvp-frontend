import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import HomeIcon from "@mui/icons-material/Home";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

interface Props {
  text: string;
}

const Navbar: React.FC<Props> = ({ text }: Props) => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <header className="md:fixed left-0 right-0 mb-4 top-0 md:bg-palette-fill shadow-md app_header_b fixed z-[99] bg-[#fff]">
      <div className="flex flex-col md:px-2">
        <div className="relative flex items-center justify-between py-4 md:order-2 md:mt-2">
          <div className="relative flex justify-center items-center">
            <div className="absolute left-0">
              <Button onClick={handleGoBack} variant="text" disableElevation>
                <ChevronLeftIcon className="text-black" />
              </Button>
            </div>
          </div>

          <p className="text-md">{text} </p>

          <div className="absolute right-0 items-right"></div>

          <div className="flex gap-4"></div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
