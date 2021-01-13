import React from "react";
import { Link } from "react-router-dom";
export default function ListItem({ getClassName, handleClick, url, title }) {
  return (
    <li className={getClassName}>
      <Link to={url} onClick={handleClick}>
        <i className="ft-box" /> Hàng Kho
      </Link>
    </li>
  );
}
