import { useState, useTransition } from "react";
import { Link } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { message } from "antd";
import useSWRMutation from "swr/mutation";
import { postFetcher } from "../../api/fatcher";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [messageApi, contextHolder] = message.useMessage();
    // const route = useRoute();

   const [formData, setFormData] = useState({
      username: "",
      password: "",
      category:"admin",
    });


     const handleChange = (e:any) => {
    const { name, value,  } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

   //   create Batch
  const { trigger: create } = useSWRMutation(
    "api/v1/users/login",
    (url, { arg }) => postFetcher(url, arg)
  );
   const handleSubmit = (e:any) => {
      e.preventDefault();
      startTransition(async () => {
        // await new Promise( (resolve) => setTimeout(resolve,5000))
        try {
          const response = await create( formData as any);
          
          const queryString = new URLSearchParams({
            token: response.data?.token,
            category: response.data?.category,
            id: response.data?.id,
            permissions: response?.data?.permissions,
          });
          messageApi.open({
            type: "success",
            content: response.message,
          });
          if (response?.data) {
          window.location.href = `/Home?${queryString.toString()}`;
        }
        } 
        catch (error:any) {
          messageApi.open({
            type: "error",
            content: error.response?.data?.message
              ? error.response?.data?.message
              : "Try Again",
          });
        }
      });
    };
  return (
    <div className="flex flex-col flex-1">
      {contextHolder}
      <div className="w-full max-w-md pt-10 mx-auto">
        <Link
          to="/Home"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Back to dashboard
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>
          <div>
           
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input id="username"
                      name="username"
                      type="text"
                      value={formData.username}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="you@example.com"
                       />
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                       id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="Enter your password"
                     
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                 
                 
                </div>
                <div>
                  <Button  disabled={isPending} className="w-full" size="sm">
                   {isPending ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "Sign In"
                  )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
