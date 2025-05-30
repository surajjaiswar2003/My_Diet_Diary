import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Heart, Stethoscope, Shield, Eye, EyeOff } from "lucide-react";
import { CREDENTIALS } from "@/config/credentials";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: "user", // Default to user
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleUserTypeChange = (value: string) => {
    setFormData({ ...formData, userType: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Determine the correct endpoint based on user type
      const endpoint =
        formData.userType === "dietitian"
          ? "http://localhost:5000/api/auth/dietitian/login"
          : "http://localhost:5000/api/auth/login";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Welcome back, ${data.firstName}!`);

        // Store user data in the appropriate localStorage key
        localStorage.setItem(
          formData.userType === "dietitian" ? "dietitian" : "user",
          JSON.stringify(data)
        );

        // Redirect to the appropriate dashboard
        if (formData.userType === "dietitian") {
          navigate("/dietitian/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      } else {
        toast.error(data.message || "Invalid email or password");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 flex items-center justify-center pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md px-4"
        >
          <Card className="relative overflow-hidden border-0 shadow-lg bg-white">
            <div className="absolute inset-0 bg-emerald-50" />

            <CardHeader className="space-y-1 relative z-10">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-emerald-100">
                  <Heart className="w-8 h-8 text-emerald-600" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center text-gray-800">
                Welcome to HealthHub
              </CardTitle>
              <CardDescription className="text-center text-gray-600">
                Your journey to better health starts here
              </CardDescription>
            </CardHeader>

            <CardContent className="relative z-10">
              <Tabs
                defaultValue="user"
                className="w-full mb-6"
                onValueChange={handleUserTypeChange}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="user">Login as User</TabsTrigger>
                  <TabsTrigger value="dietitian">
                    Login as Dietitian
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="user">
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    Access your personalized nutrition plans and health tracking
                  </p>
                </TabsContent>
                <TabsContent value="dietitian">
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    Login to manage client diet plans and provide nutritional
                    guidance
                  </p>
                </TabsContent>
              </Tabs>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">
                    Email
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="pl-10 bg-white border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700">
                    Password
                  </Label>
                  <motion.div
                    initial={false}
                    animate={{ scale: showPassword ? 1.02 : 1 }}
                    transition={{ duration: 0.2 }}
                    className="relative"
                  >
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => setShowPassword(true)}
                      onBlur={() => setShowPassword(false)}
                      required
                      className="pl-10 bg-white border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Shield className="h-5 w-5 text-gray-400" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </motion.div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                      Signing in...
                    </div>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="relative z-10 flex flex-col space-y-4">
              <div className="text-sm text-center text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Sign up
                </Link>
              </div>
              <div className="flex items-center justify-center space-x-4 text-gray-400">
                <Stethoscope className="w-5 h-5" />
                <span className="text-xs">Secure & HIPAA Compliant</span>
                <Shield className="w-5 h-5" />
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
