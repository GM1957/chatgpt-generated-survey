"use client";
import { useEffect, useState } from "react";
import * as Survey from "survey-react";
import "survey-react/survey.css";
import "tailwindcss/tailwind.css";

const Page = ({ params }) => {
  const { userId, surveyIndex } = params;
  const [surveyData, setSurveyData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(async () => {
    setIsLoading(true);
    let data = await fetch(
      `/api/submit-survey/${decodeURIComponent(userId)}/${surveyIndex}`
    );
    data = await data.json();
    console.log("hello data", data);
    setSurveyData(data);
    setIsLoading(false);
  }, []);

  const onComplete = async (survey, options) => {
    if (!email.length && surveyData?.isEmailRequired) {
      window.alert("Please Enter your Email To Sumbit the survey");
    } else {
      const res = await fetch("/api/survey-add-response", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          surveyResponse: survey.data,
          id: decodeURIComponent(userId),
          surveyIndex,
          email
        }),
      });
      const jsonRes = await res.json();
      console.log("update response", jsonRes);
      if (!jsonRes?.error) {
        window.alert("Survey submitted succesfully");
      }
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 min-h-screen">
      {isLoading ? (
        <div className="flex justify-center  items-center p-8">
          <div className="loader-lg"></div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="text-white text-center">
            <i className="fas fa-poll fa-3x"></i>
            <h1 className="text-4xl font-bold mt-2">
              {surveyData?.surveyJSON?.title}
            </h1>
          </div>

          {surveyData?.isEmailRequired && (
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          )}
          <div className="bg-white shadow-lg rounded-lg p-8 mt-8">
            <Survey.Survey
              json={surveyData?.surveyJSON || {}}
              onComplete={onComplete}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
