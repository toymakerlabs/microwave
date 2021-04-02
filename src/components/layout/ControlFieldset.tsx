import "components/styles/ControlFieldset.scss";

import React from "react";

interface ControlFieldsetProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLFieldSetElement>,
    HTMLFieldSetElement
  > {
  legend: React.ReactNode | string;
  children: React.ReactNode;
}

export default function ControlFieldset({
  legend,
  children,
  ...rest
}: ControlFieldsetProps): JSX.Element {
  return (
    <fieldset
      {...rest}
      className={["control-fieldset", rest.className].join(" ").trim()}
    >
      <legend className="hide">{legend}</legend>
      {children}
    </fieldset>
  );
}
