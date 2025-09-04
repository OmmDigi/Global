"use client";
import React, { useState, useTransition } from "react";
import BackToTopButton from "@/components/BackToTopButton";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Button, message, Space } from "antd";

import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Sparkles,
  ArrowRight,
  User,
} from "lucide-react";
import axios from "../../lib/axios";
import { useRouter } from "next/navigation";

function page() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    category: "Student",
    // remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [color, setColor] = useState("bg-blue-100");
  const [messageApi, contextHolder] = message.useMessage();
  const route = useRouter();
  const [isPending, startTransition] = useTransition();
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (e.target.value === "Admin") {
      setColor("bg-red-100");
    }
    if (e.target.value === "Teacher") {
      setColor("bg-green-100");
    }
    if (e.target.value === "Stuff") {
      setColor("bg-yellow-100");
    }
    if (e.target.value === "Student") {
      setColor("bg-blue-200");
    }
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    startTransition(async () => {
      // await new Promise( (resolve) => setTimeout(resolve,5000))
      try {
        const response = await axios.post("api/v1/users/login", formData);
        messageApi.open({
          type: "success",
          content: response.data?.message,
        });

        // localStorage.setItem("token", response?.data?.data?.token);
        // localStorage.setItem("category", response?.data?.data?.category);
        // localStorage.setItem("permissions", response?.data?.data?.permissions);

        const queryString = new URLSearchParams({
          token: response.data?.data?.token,
          category: response.data?.data?.category,
          id: response.data?.data?.id,
          permissions: response?.data?.data?.permissions,
        });
        route.push(
          // `http://192.168.0.214:5173/home?${queryString}`
          `${process.env.NEXT_PUBLIC_ADMIN}home?${queryString}`
        );
      } catch (error) {
        messageApi.open({
          type: "error",
          content: error.response?.data?.message
            ? error.response?.data?.message
            : "Try Again",
        });
        console.error("aaaa", error);
      }
    });
  };

  return (
    <>
      {contextHolder}

      <Navbar />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white">
        <container
          data-aos="fade-right"
          className="max-w-7xl mx-auto px-4 py-8 bg-white "
        >
          <branch>
            <div>
              <img
                src="image/global-logo2.png"
                alt="GTI Logo"
                className="w-100 h-auto mb-4"
              />
            </div>

            <info-box className="flex items-start space-x-4 mb-4">
              <div>
                <img
                  src="/image/map.png"
                  alt="Location Icon"
                  className="w-10 h-10"
                />
              </div>
              <div>
                <div className="text-sm text-[#023b81] font-semibold">
                  Head Office
                </div>
                <div className="text-gray-700 text-sm">
                  Beliaghata 17A, Haramohan Ghosh Lane, Kolkata 700085
                  <br />
                  Landmark: Near Surah Kanya Vidyalaya.
                </div>
              </div>
            </info-box>

            <contact-list>
              <email className="flex items-center space-x-2 text-sm text-gray-700">
                <icon className="text-blue-600">&#9993;</icon>
                <span>global.technical8.institute@gmail.com</span>
              </email>
              <phone className="flex items-center space-x-2 text-sm text-gray-700 mt-2">
                <icon className="text-green-600">&#9742;</icon>
                <span>8961008489, 9231551285, 9230113485</span>
              </phone>
            </contact-list>

            <hr className="my-6 border-t-2 border-gray-400 w-11/12" />

            <info-box className="flex items-start space-x-4 mb-2">
              <div>
                <img
                  src="/image/map.png"
                  alt="Location Icon"
                  className="w-10 h-10"
                />
              </div>
              <div>
                <div className="text-sm text-[#023b81] font-semibold">
                  Garia Branch
                </div>
                <div className="text-gray-700 text-sm">
                  251/A/6 N.S.C Bose Road, Naktala, Kolkata-700047
                  <br />
                  Near: Geetanjali metro station and Naktala Sib Mandir.
                </div>
              </div>
            </info-box>

            <contact-list>
              <phone className="flex items-center space-x-2 text-sm text-gray-700">
                <icon className="text-green-600">&#9742;</icon>
                <span>90516 29028</span>
              </phone>
            </contact-list>
          </branch>
        </container>
        <div
          data-aos="fade-left"
          className="min-h-screen bg-gradient-to-br bg-white from-blue-50 to-indigo-100 flex items-start justify-center p-2"
        >
          <div className="w-full max-w-md">
            {/* Logo and Title */}
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-full mb-2">
                <Lock className="w-6 h-6 text-white" />
              </div>

              <p className="text-gray-600">
                <span className="text-blue-500">Sign in</span> to your account
              </p>
            </div>

            {/* Login Form */}
            <div
              className={`${color} rounded-2xl shadow-xl pl-8 pr-8 pt-6 pb-6`}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}

                <div className="w-12/12 pr-20 pl-20 mb-4">
                  <label className="block text-lg font-bold text-center text-gray-700 mb-1">
                    Choose User type
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose</option>
                    <option value="Student">Student</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Stuff">Staff</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      value={formData.username}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isPending ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>
            </div>

            {/* Footer */}
            <div className="text-center mt-8">
              <p className="text-xs text-gray-500">
                By signing in, you agree to our Terms of Service and Privacy
                Policy
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <BackToTopButton />
    </>
  );
}

export default page;
