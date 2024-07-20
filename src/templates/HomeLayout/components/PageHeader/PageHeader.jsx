import React from "react";
import "./PageHeader.scss";

const PageHeader = (props) => {
  return <div className="page-header">{props.children}</div>;
};

export default PageHeader;
