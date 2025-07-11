"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function AOSProvider({ children }) {
  useEffect(() => {
    AOS.init({
      duration: 1500, // Animation duration in milliseconds
      once: false,     // Animation runs only once
    });
  }, []);

  return children;
}
