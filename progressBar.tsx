import { useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { BsFillCaretLeftFill, BsFillCaretRightFill } from "react-icons/bs";
import { access } from "fs";

export const moveProgress = (props) => {
  keyframes`
  from {
    width: ${100 - parseFloat(props.oldPercentage.slice(0, -1)) + "%"};
  }
  to {
    width: ${100 - parseFloat(props.progressPercentage.slice(0, -1)) + "%"};
  }
`;
};

export const RoundedBarCSS = styled.div`
  position: absolute;
  border-width: 5px;
  border-color: ${(props) => props.accessColor || "black"};
  border-radius: 5em;
  border-style: solid;
  height: 1em;
  z-index: 10;
  width: inherit;
`;

export const BarInsideCSS = styled.div`
  position: absolute;
  border-radius: 10em;
  background-color: ${(props) =>
    props.progressEmpty
      ? props.primaryColor || "white"
      : props.accessColor || "black"};
  border-style: solid;
  width: 99.5%;
  height: 80%;
  z-index: 1;
`;

export const BarInsideNegCSS = styled.div`
  position: absolute;
  background-color: ${(props) => props.primaryColor || "white"};
  border-top-right-radius: 5em;
  border-bottom-right-radius: 5em;
  border-bottom-left-radius: ${(props) =>
    (props.progressPercentage == "0%" && "5em") || 0};
  border-top-left-radius: ${(props) =>
    (props.progressPercentage == "0%" && "5em") || 0};
  top: -5%;
  height: 110%;
  z-index: 2;
  right: 0px;
  width: ${(props) =>
    100 - parseFloat(props.progressPercentage.slice(0, -1)) + "%" || "90%"};
  animation: ${(props) => moveProgress} 0.25s ease-out;
`;

export const ProgressNotch = styled.div`
  position: absolute;
  left: ${(props) => props.progressPercentage};
  top: -100%;
  background-color: ${(props) => props.accessColor || "black"};
  /* border-style: solid; */
  border-radius: 2em;
  border-color: ${(props) => props.primaryColor || "white"};
  border-width: 3px;
  width: 5px;
  height: 300%;
  z-index: 5;
`;

export const ProgressButton = styled.div`
  position: absolute;
  /* background-color: green; */
  width: ${(props) => 100 / props.numSegments + "%"};
  margin-left: ${(props) =>
    (props.segment - 1) * (100 / props.numSegments) + "%"};
  top: -100%;
  height: 300%;
  z-index: 9;
`;
export const ProgressUlCSS = styled.ul`
  margin: 0 0;
  padding: 0 0;
  display: inline-flex;
  flex-direction: row;
  width: inherit;
`;

export const ProgressLiCSS = styled.li`
  width: inherit;
  padding: 0 0;
  list-style: none;
  /* padding-left: 2em; */
  z-index: 8;
`;

export const ArrowsCSS = styled.div`
  position: absolute;
  margin-left: 20.5em;
  padding-top: 0.25em;
  width: inherit;
  color: ${(props) => props.accessColor || "black"};
`;
export function ProgressBar(props) {
  const [percentage, setPercentage] = useState("0%");
  const [lastPercentage, setLastPercentage] = useState("0%");
  const [progressEmpty, setProgressempty] = useState(true);
  const [lastSegment, setlastSegment] = useState(0);
  const [secondlastSegment, setSecondlastSegment] = useState(0);
  const [numSegments, setNumSegments] = useState(props.segments);

  function handleProgress(segment) {
    setlastSegment(segment);
    setSecondlastSegment(lastSegment);
    setLastPercentage(percentage);
    if (segment == lastSegment && segment == 1 && progressEmpty == false) {
      // setProgressempty(true);
    } else {
      setProgressempty(false);
    }

    //logic for making sure clicking progress bar functions properly, e.g. clicking lit section unlights it, after unlighting a section you can unlight the next lit section in one click, you can light and unlight sections repeatedly
    if (
      (segment == lastSegment &&
        progressEmpty == false &&
        lastSegment != secondlastSegment) ||
      segment * (100 / numSegments) + "%" == percentage
    ) {
      setPercentage((segment - 1) * (100 / numSegments) + "%");
    } else {
      setPercentage(segment * (100 / numSegments) + "%");
    }
    console.log(segment * (100 / numSegments) + "%");
    console.log(percentage);
  }

  function handleArrows(change) {
    setLastPercentage(percentage);
    if (
      !(parseFloat(percentage.slice(0, -1)) + change > 100) &&
      !(parseFloat(percentage.slice(0, -1)) + change < 0)
    ) {
      if (parseFloat(percentage.slice(0, -1)) + change + "%" == "0%") {
        // setProgressempty(true);
      } else {
        setProgressempty(false);
      }
      setPercentage(parseFloat(percentage.slice(0, -1)) + change + "%");
    } else {
      console.log("ARROW CHANGE OUT OF BOUNDS");
    }

    console.log(percentage);
  }

  function generateNotches() {
    const notches = [];
    for (let i = 1; i < numSegments; i++) {
      notches.push(
        <ProgressNotch
          progressPercentage={(100 / numSegments) * i + "%"}
          primaryColor={props.primaryColor}
          accessColor={props.accessColor}
          key={i}
        />
      );
    }
    return notches;
  }

  function generateButtons() {
    const buttons = [];
    for (let i = 1; i <= numSegments; i++) {
      buttons.push(
        <ProgressButton
          segment={i}
          onClick={() => {
            handleProgress(i);
          }}
          numSegments={numSegments}
          key={i}
        />
      );
    }
    return buttons;
  }

  return (
    <ProgressUlCSS>
      <ProgressLiCSS>
        <RoundedBarCSS
          primaryColor={props.primaryColor}
          accessColor={props.accessColor}
        >
          {generateNotches()}
          {generateButtons()}

          <BarInsideCSS
            progressEmpty={progressEmpty}
            primaryColor={props.primaryColor}
            accessColor={props.accessColor}
          >
            <BarInsideNegCSS
              progressPercentage={percentage}
              oldPercentage={lastPercentage}
              primaryColor={props.primaryColor}
              accessColor={props.accessColor}
            ></BarInsideNegCSS>
          </BarInsideCSS>
        </RoundedBarCSS>
      </ProgressLiCSS>
      <ProgressLiCSS>
        <ArrowsCSS
          primaryColor={props.primaryColor}
          accessColor={props.accessColor}
        >
          <BsFillCaretLeftFill
            onClick={() => {
              handleArrows(-(100 / numSegments));
            }}
          />
          <BsFillCaretRightFill
            onClick={() => {
              handleArrows(100 / numSegments);
            }}
          />
        </ArrowsCSS>
      </ProgressLiCSS>
    </ProgressUlCSS>
  );
}
