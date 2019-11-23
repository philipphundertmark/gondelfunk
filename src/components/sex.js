import React from "react";
import './sex.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMars, faVenus } from '@fortawesome/free-solid-svg-icons';

const Sex = ({ gender, onClick, selected }) => {
  return (
    <div className={`sex-button ${selected ? "is-selected" : ""}`} onClick={onClick}>
      <FontAwesomeIcon icon={gender === "mars" ? faMars : faVenus} />
    </div>
  );
};

export default Sex;