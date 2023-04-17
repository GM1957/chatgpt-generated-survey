"use client";
import { useState, useEffect } from "react";
import "survey-react/survey.css";
import { SurveyEditor } from "@/components";
import { Toast } from "@/components";
import { useRouter } from "next/navigation";
import * as Survey from "survey-react";
import "survey-react/survey.css";
import "tailwindcss/tailwind.css";

const Dashboard = () => {
  const [userData, setUserData] = useState({});
  const [activeSidebar, setActiveSidebar] = useState("new-survey");
  const [choiceType, setChoiceType] = useState("multiple");
  const [gptText, setGptText] = useState("");
  const [surveyTitle, setSurveyTitle] = useState("Demo survey");
  const [isEmailRequired, setIsEmailRequired] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const router = useRouter();
  const [surveyJSON, setSurveyJSON] = useState({});
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSurveysVisible, setIsSurveysVisible] = useState(true);
  const [isShowResults, setIsShowResults] = useState(false);

  useEffect(() => {
    if (localStorage?.getItem("userData")) {
      fetchUser();
    }
  }, [localStorage?.getItem("userData")]);

  const fetchUser = async () => {
    let locData = localStorage.getItem("userData") || "{}";

    let res = await fetch("/api/users/get-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: locData,
    });
    res = await res.json();
    if (res?.error === "password") router.push("/");
    setUserData(res?.user);
  };

  console.log("userDatauserData::", userData);

  const handleSurveySaved = async (json) => {
    setSurveyJSON(json);
    console.log("Survey JSON data:", json);
  };

  const onPublishSurvey = async () => {
    setIsPublishing(true);
    const res = await fetch("/api/users/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        meta: {
          surveys: [
            ...(userData?.meta?.surveys || []),
            {
              surveyJSON,
              title: surveyTitle,
              isEmailRequired,
              responses: [],
            },
          ],
        },
        id: userData?.id,
        password: userData?.password,
      }),
    });
    const jsonRes = await res.json();
    console.log("update response", jsonRes);

    fetchUser();
    setIsPublishing(false);
    setSurveyJSON({});
    if (!jsonRes?.error) {
      setToastMsg("Success! survey Published.");
      setShowToast(Math.random());
    }

    setActiveSidebar(userData?.meta?.surveys?.length || "new-survey");
    setIsSurveysVisible(true);
  };

  const onChatGenerate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/generate-survey/?chat=${gptText}&type=${choiceType}`);
      const theRes = await res.json();
      setSurveyJSON(JSON.parse(theRes.text));
      setToastMsg("Success! your survey is generated below");
    } catch {
      setToastMsg("Error! failed to generate survey");
    }
    setShowToast(Math.random());
    setIsLoading(false);
  };

  const btnStyle = (isActive) =>
    `mx-2 rounded-3xl px-3 py-2 ${
      isActive ? "bg-blue-950 text-white" : "bg-white text-neutral-800"
    } hover:text-white hover:bg-blue-950 text-sm whitespace-nowrap font-medium cursor-pointer`;

  const onComplete = (data) => {
    console.log("Survey Completed: ", data);
  };

  const shareAbleLink = `${window.location.hostname}/submit-survey/${userData?.id}/${activeSidebar}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareAbleLink);
    window.alert("Link Copied!");
  };

  return (
    <div className="flex h-full w-full oveflow-auto">
      <Toast show={showToast} message={toastMsg} duration={3000} />
      <div className="p-6 min-h-screen w-full md:w-2/12 bg-blue-100 overflow-auto">
        <div className="border-2 px-3 py-2 drop-shadow-md mb-8 font-semibold text-blue-800 text-center text-2xl bg-white break-words rounded-md">
          Survey Maker
        </div>
        <div
          className={`flex items-center p-3 my-2 text-md font-medium bg-white rounded-md shadow-md hover:bg-gray-200 cursor-pointer transition-all duration-200 ${
            activeSidebar == "new-survey" ? "bg-teal-200" : ""
          }`}
          onClick={() => {
            setActiveSidebar("new-survey");
          }}
        >
          <i className="fas fa-plus mr-2"></i>Create new survey
        </div>
        <div
          className="flex items-center p-3 my-2 text-md font-medium bg-white rounded-md shadow-md hover:bg-gray-200 cursor-pointer transition-all duration-200"
          onClick={() => setIsSurveysVisible(!isSurveysVisible)}
        >
          <i
            className={`fas fa-chevron-${
              isSurveysVisible ? "up" : "down"
            } mr-2`}
          ></i>
          Published surveys
        </div>
        <div
          className={`${
            isSurveysVisible ? "block" : "hidden"
          } transition-all duration-200`}
        >
          {userData?.meta?.surveys?.map((item, i) => {
            return (
              <div
                className={`ml-4 p-2 my-1 text-md font-medium bg-white rounded-md shadow-md hover:bg-gray-200 cursor-pointer transition-all duration-200 ${
                  activeSidebar == i ? "bg-teal-200" : ""
                }`}
                onClick={() => {
                  setActiveSidebar(i);
                }}
              >
                {item?.title}
              </div>
            );
          })}
        </div>
        <div
          className="flex items-center p-3 my-2 text-md font-medium bg-white rounded-md shadow-md hover:bg-gray-200 cursor-pointer transition-all duration-200"
          onClick={() => {
            localStorage.removeItem("userData");
            router.push("/");
          }}
        >
          <i className="fas fa-sign-out-alt mr-2"></i>Log out
        </div>
      </div>
      <div className="h-full w-full container mx-auto px-2 overflow-auto">
        {typeof activeSidebar == "number" && (
          <div>
            <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
              <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>

                <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                  <div class="flex space-x-4 mb-4">
                    <button
                      className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                        isShowResults ? "bg-gray-400 hover:bg-gray-500" : ""
                      }`}
                      onClick={() => {
                        setIsShowResults(false);
                      }}
                    >
                      Preview
                    </button>
                    <button
                      className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                        !isShowResults ? "bg-gray-400 hover:bg-gray-500" : ""
                      }`}
                      onClick={() => {
                        setIsShowResults(true);
                      }}
                    >
                      Show Responses
                    </button>
                  </div>
                  {isShowResults ? (
                    <SurveyResults
                      surveyResults={
                        userData?.meta?.surveys[activeSidebar]?.responses || []
                      }
                    />
                  ) : (
                    <div>
                      <h1 className="text-3xl font-semibold mb-4">
                        {" "}
                        {userData?.meta?.surveys[activeSidebar]?.title || ""}
                      </h1>
                      <div className="mb-4">
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            className="form-checkbox"
                            checked={
                              userData?.meta?.surveys[activeSidebar]
                                ?.isEmailRequired
                            }
                            readOnly
                          />
                          <span className="ml-2">Anonymous Survey</span>
                        </label>
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700">
                          Preview Link:
                        </label>
                        <input
                          type="text"
                          readOnly
                          value={shareAbleLink}
                          className=" font-bold mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      <div className="mb-4">
                        <button
                          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 font-bold"
                          onClick={copyToClipboard}
                        >
                          Copy Shareable Link
                        </button>
                      </div>
                      <div className="bg-gray-100 p-4 rounded-md">
                        <Survey.Survey
                          json={
                            userData?.meta?.surveys[activeSidebar]?.surveyJSON
                          }
                          onComplete={onComplete}
                          css="survey-preview"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSidebar === "new-survey" && (
          <div>
            <div className="flex py-6 items-center justify-between flex-wrap">
              <div className="flex items-center py-2">
                <input
                  id="input-field-1"
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Describe survey, how you want?"
                  value={gptText}
                  onChange={(e) => {
                    setGptText(e.target.value);
                  }}
                />
                <button
                  className="px-3 py-2 rounded-md font-bold text-md text-white bg-indigo-600 ml-2 whitespace-nowrap"
                  onClick={() => {
                    onChatGenerate();
                  }}
                >
                  Generate survey
                </button>
              </div>
              <div className="flex items-center py-2">
                <div className="whitespace-nowrap mx-4 font-bold">
                  Select Pattren:{" "}
                </div>

                <div className="flex px-4 py-3 rounded-3xl bg-pink-100 ">
                  <div
                    className={btnStyle(choiceType === "multiple")}
                    onClick={() => setChoiceType("multiple")}
                  >
                    Multiple Choice
                  </div>
                  <div
                    className={btnStyle(choiceType === "single")}
                    onClick={() => setChoiceType("single")}
                  >
                    {" "}
                    Single Choice
                  </div>
                  <div
                    className={btnStyle(choiceType === "open")}
                    onClick={() => setChoiceType("open")}
                  >
                    Open Answer
                  </div>
                  <div
                    className={btnStyle(choiceType === "mixed")}
                    onClick={() => setChoiceType("mixed")}
                  >
                    Mixed
                  </div>
                </div>
              </div>
              <div className="flex items-center ml-2">
                <div className="text-sm font-semibold mr-2">
                  Anonymous Survey ?
                </div>

                <button
                  className={`px-3 py-1 rounded-l-md ${
                    isEmailRequired ? "bg-green-500 text-white" : "bg-gray-200"
                  }`}
                  onClick={() => {
                    setIsEmailRequired((old) => !old);
                  }}
                >
                  Yes
                </button>
                <button
                  className={`px-3 py-1 rounded-r-md ${
                    !isEmailRequired ? "bg-green-500 text-white" : "bg-gray-200"
                  }`}
                  onClick={() => {
                    setIsEmailRequired((old) => !old);
                  }}
                >
                  No
                </button>
              </div>
            </div>
            <div className=" bg-pink-100">
              {isLoading ? (
                <div className="flex justify-center  items-center p-8">
                  <div className="loader-lg"></div>
                </div>
              ) : (
                <div className="flex justify-center  items-center p-8">
                  <div className="w-full max-w-xs mb-2">
                    <label
                      for="input-field"
                      className="block text-gray-700 text-sm font-bold mb-2"
                    >
                      Survey Name:
                    </label>
                    <input
                      id="input-field"
                      type="text"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-bold"
                      placeholder="Enter Survey Name"
                      value={surveyTitle}
                      onChange={(e) => {
                        setSurveyTitle(e.target.value);
                      }}
                    />
                  </div>
                  <button
                    onClick={() => onPublishSurvey()}
                    className="px-3 py-2 rounded-md bg-green-800 font-semibold text-white ml-8"
                  >
                    {isPublishing ? (
                      <div className="flex">
                        <div className="loader-sm mr-2"></div>{" "}
                        <div>Publishing...</div>
                      </div>
                    ) : (
                      "Publish Survey"
                    )}
                  </button>
                </div>
              )}
              <div className="px-10 pb-10">
                {isLoading ? (
                  <div className="flex h-full w-full justify-center items-center">
                    {" "}
                    <h1>Loading...</h1>{" "}
                  </div>
                ) : (
                  <SurveyEditor
                    onSurveySaved={handleSurveySaved}
                    surveyJSON={surveyJSON}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SurveyResults = ({ surveyResults }) => {
  console.log("surveyResults", surveyResults);
  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold text-center mb-6">Survey Results ({surveyResults?.length})</h1>
      {surveyResults.map((result, index) => (
        <div key={index} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Response #{index + 1}</h2>
          <div className="mb-4">
            <span className="font-bold">Submitted By:</span> {result?.email}
          </div>
          <div>
            <span className="font-bold">Responses:</span>
            <ul className="list-disc pl-5">
              {Object.entries(result?.result).map(([question, answer]) => (
                <li key={question}>
                  <span className="font-semibold">{question}:</span>{" "}
                  {Array.isArray(answer) ? answer.join(", ") : answer}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
