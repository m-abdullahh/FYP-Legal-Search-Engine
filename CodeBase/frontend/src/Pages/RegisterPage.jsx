import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import validator from "validator";
import { useSignup } from "@/hooks/useSignup"; // Import the useSignup hook

export default function RegisterPage() {
  const navigate = useNavigate();
  const { signup, isLoading, error } = useSignup(); // Use the signup hook

  const [formState, setFormState] = useState({ name: "", email: "", password: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = [];

    // Validate Name
    if (validator.isEmpty(formState.name)) {
      errors.push("Name is required");
    } else if (!/^[a-zA-Z\s]+$/.test(formState.name)) {
      errors.push("Name should only contain letters and spaces");
    }

    // Validate Email
    if (validator.isEmpty(formState.email)) {
      errors.push("Email is required");
    } else if (!validator.isEmail(formState.email)) {
      errors.push("Please enter a valid email address");
    }

    // Validate Password
    if (validator.isEmpty(formState.password)) {
      errors.push("Password is required");
    } else if (!validator.isStrongPassword(formState.password)) {
      errors.push("Password must be strong");
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
      return;
    }

    // Use the signup function from your hook inside the toast.promise
    toast.promise(
      signup(formState.name, formState.email, formState.password), // Call the signup function
      {
        loading: "Creating account...",
        success: (response) => {
          setFormState({ name: "", email: "", password: "" });
          // console.log(error);
          navigate("/");
          return "Registration and Login successful! Welcome!";
        },
        error: () => {
          return error || "Registration failed. Please try again.";
        },
      }
    );
  };

  return (
    <Card className="flex flex-col mx-auto max-w-lg lg:w-2/4 mt-16 lg:mt-20">
      <CardHeader>
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>Enter your information to create an account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid grid-cols-1 gap-4">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" value={formState.name} onChange={handleInputChange} placeholder="Robinson" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={formState.email} onChange={handleInputChange} placeholder="m@example.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" value={formState.password} onChange={handleInputChange} required />
          </div>
          <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-700/90" disabled={isLoading}>
            {isLoading ? "Registering..." : "Create an account"}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?
          <a href="/login" className="underline">
            Sign in
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
