"use client";

import React, { useState } from "react";
import { LoginCard, SignupCard } from "@/components";
import { Toast } from "@/components";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const onSignup = () => {};
  const onLogin = () => {};

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const router = useRouter();

  const onSubmitLogin = async (inputObj) => {
    console.log("inputObj", inputObj);
    let response = await fetch("/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputObj),
    });
    response = await response.json();
    console.log("login response", response);
    if (!response.error) {
      localStorage.setItem(
        "userData",
        JSON.stringify({
          id: response?.id,
          isLoggedIn: response.isLoggedIn,
          password: response.password,
          timeStamp: response.timeStamp,
        })
      );
      setToastMsg("Success! You are now logged in.");
      setShowToast(Math.random());
      router.push("/dashboard");
    } else {
      setToastMsg("Error! Unable to log in.");
      setShowToast(Math.random());
    }
  };

  const onSubmitSignup = async (inputObj) => {
    const response = await fetch("/api/users/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputObj),
    });

    if (!response.error) {
      setToastMsg("Success! Accout created. Please login!");
      setShowToast(Math.random());
    } else {
      setToastMsg("Error! Unable to create account");
      setShowToast(Math.random());
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toast show={showToast} message={toastMsg} duration={3000} />
      {/* Navbar */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-indigo-600">
                Survey Maker
              </div>
            </div>
            <div className="hidden sm:block sm:ml-6">
              <div className="flex space-x-4">
                <button
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                  onClick={() => {
                    setIsLoginOpen(true);
                    setIsSignupOpen(false);
                  }}
                >
                  Login
                </button>
                <button
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                  onClick={() => {
                    setIsSignupOpen(true);
                    setIsLoginOpen(false);
                  }}
                >
                  Signup
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="transition-all ease-in-out duration-500">
        {isLoginOpen ? (
          <LoginCard
            onClose={() => setIsLoginOpen(false)}
            onSubmitLogin={onSubmitLogin}
          />
        ) : isSignupOpen ? (
          <SignupCard
            onClose={() => setIsSignupOpen(false)}
            onSubmitSignup={onSubmitSignup}
          />
        ) : null}
      </div>
      <div className="bg-gradient-to-b from-indigo-600 to-purple-600 py-32 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-3xl text-center">
          <h2 className="text-4xl font-bold text-white mb-4 tracking-wide">
            Welcome to Survey Maker
          </h2>
          <p className="text-lg font-semibold text-white mb-8">
            Create surveys using GPT-4 powered chat and easily share them with
            your users.
          </p>
          <div className="flex justify-center">
            <a
              href="#"
              className="bg-white text-indigo-600 px-8 py-4 rounded-full text-lg font-bold hover:bg-indigo-200 hover:text-white hover:border-indigo-700 transition-all duration-200"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="bg-gray-100 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-12">
            {/* Features */}
            <div>
              <h2 className="text-2xl font-semibold text-center text-gray-900">
                Features
              </h2>
              <div className="my-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="bg-white p-6 rounded-lg shadow text-center">
                  <i className="fas fa-comment text-4xl text-indigo-600 mb-4"></i>
                  <h3 className="text-xl font-semibold">GPT-4 Powered Chat</h3>
                  <p className="mt-4 text-gray-500">
                    Create engaging surveys using GPT-4 powered chat, making
                    them interactive and user-friendly.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow text-center">
                  <i className="fas fa-share-alt text-4xl text-indigo-600 mb-4"></i>
                  <h3 className="text-xl font-semibold">Easy Sharing</h3>
                  <p className="mt-4 text-gray-500">
                    Share your surveys with your users via unique links, making
                    it simple and convenient to collect responses.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow text-center">
                  <i className="fas fa-chart-line text-4xl text-indigo-600 mb-4"></i>
                  <h3 className="text-xl font-semibold">
                    Insightful Analytics
                  </h3>
                  <p className="mt-4 text-gray-500">
                    Unlocking Valuable Insights: The Power of Analytics in
                    Survey Results
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-center text-gray-900">
                  How It Works
                </h2>
                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="bg-white p-6 rounded-lg shadow text-center">
                    <div className="text-4xl text-indigo-600 mb-4">1</div>
                    <h3 className="text-xl font-semibold">Sign Up</h3>
                    <p className="mt-4 text-gray-500">
                      Create your Survey Maker account to access our powerful
                      survey creation tools and analytics.
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow text-center">
                    <div className="text-4xl text-indigo-600 mb-4">2</div>
                    <h3 className="text-xl font-semibold">Create Survey</h3>
                    <p className="mt-4 text-gray-500">
                      Design your survey using our GPT-4 powered chat system,
                      making it interactive and personalized.
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow text-center">
                    <div className="text-4xl text-indigo-600 mb-4">3</div>
                    <h3 className="text-xl font-semibold">Collect Responses</h3>
                    <p className="mt-4 text-gray-500">
                      Share your survey link with your users, collect their
                      responses, and analyze the results for valuable insights.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}

      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <nav className="flex flex-wrap justify-center">
            <div className="mt-3 md:mt-0 md:ml-6">
              <a href="#" className="text-gray-500 hover:text-gray-900">
                Privacy Policy
              </a>
            </div>
            <div className="mt-3 md:mt-0 md:ml-6">
              <a href="#" className="text-gray-500 hover:text-gray-900">
                Terms & Conditions
              </a>
            </div>
          </nav>
          <p className="mt-8 text-center text-xs text-gray-500">
            &copy; 2023 Survey Maker. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
