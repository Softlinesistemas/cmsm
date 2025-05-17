// import { logo } from "../../../public";
// import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function Footer() {
    const { t } = useTranslation();
  
    return (
      <footer className="flex justify-center items-center text-[#929DAE] h-[20px]" >
        <span className="text-white-dark mt-8">© {new Date().getFullYear()}, {t("copyright")}</span>
      </footer>
    );
}
  