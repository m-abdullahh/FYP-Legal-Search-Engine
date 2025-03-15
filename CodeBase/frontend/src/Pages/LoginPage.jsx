import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

import { uselogin } from "@/hooks/useLogin";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error } = uselogin();
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = [];

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formState.email.trim()) {
      newErrors.push("Email is required");
    } else if (!emailPattern.test(formState.email)) {
      newErrors.push("Please enter a valid email address");
    }

    if (!formState.password.trim()) {
      newErrors.push("Password is required");
    } else if (formState.password.length < 6) {
      newErrors.push("Password must be at least 6 characters long");
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();

    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error)); // Show each error as a toast
      return;
    }

    toast.promise(
      login(formState.email, formState.password),
      {
        loading: "Logging in...",
        success: (data) => {
          setFormState({ email: "", password: "" });
          navigate("/");
          return "Login successful! Welcome!";
        },
        error: (err) => {
          console.error("Login error:", err); // Log the error
          return err.message || "Login failed. Please try again.";
        },
      }
    );
  };

  return (
    <div>
      <Card className="flex flex-col mx-auto max-w-lg lg:w-2/4 mt-16 lg:mt-20">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formState.email} onChange={handleInputChange} placeholder="m@example.com" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" value={formState.password} onChange={handleInputChange} required />
            </div>
            <Button disabled={isLoading} type="submit" className=" bg-blue-700 hover:bg-blue-700/90 w-full">
              {isLoading ? "Logging..." : "Login In"}
            </Button>
          </form>
          <div className="mt-4 text-center text-md">
            Don’t have an account?
            <Link to="/register" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
