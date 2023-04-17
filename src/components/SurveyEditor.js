"use client";
import React, { useEffect, useRef } from "react";
import * as SurveyCreator from "survey-creator";
import "survey-creator/survey-creator.css";

const SurveyEditor = ({ surveyJSON, onSurveySaved }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    const creatorOptions = { showEmbededSurveyTab: false };
    const creator = new SurveyCreator.SurveyCreator(
      editorRef.current,
      creatorOptions
    );

    if (surveyJSON) {
      creator.JSON = surveyJSON;
    }

    creator.saveSurveyFunc = () => {
      onSurveySaved(creator.JSON);
    };
  }, [surveyJSON]);

  return (
    <div>
      <div ref={editorRef} id="surveyCreatorContainer"></div>
    </div>
  );
};

export { SurveyEditor };
