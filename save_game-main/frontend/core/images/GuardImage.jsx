import React from "react";
import guards from "../../static/images/guards.png";

export default function GuardImage({ CSSclass = "" }) {
  return <img className={CSSclass} src={guards.src} />;
}
