"use client";

import { useState } from "react";
import AdmissionPopup from "./AdmissionPopup";
import { useRouter } from "next/navigation";
import { usePathname, useSearchParams } from "next/navigation";

export default function BookNowCourseButton({ courseId, className }) {
  const [isadmissionPopup, setIsadmissionPopup] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const openAdmission = () => {
    const params = new URLSearchParams(searchParams);
    params.set("course_id", courseId.toString());
    const newQuery = params.toString() ? `?${params.toString()}` : "";
    router.push(`${pathname}${newQuery}`);
    setIsadmissionPopup(true);
  };

  const closeModal = () => {
    setIsadmissionPopup(false);
  };

  return (
    <>
      <AdmissionPopup isOpen={isadmissionPopup} setIsOpem={closeModal} />
      <button
        onClick={openAdmission}
        className={`w-full bg-[#155dfc] hover:bg-[#155efcb7] cursor-pointer text-white font-semibold py-2.5 px-4 rounded-full transition-colors duration-200 shadow-md hover:shadow-lg ${className}`}
      >
        Book Now
      </button>
    </>
  );
}
