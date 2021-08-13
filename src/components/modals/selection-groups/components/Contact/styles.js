import React from "react";
import styled from "styled-components";
import { Radio } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

export const Container = styled.div``;

export const Option = withStyles({
  root: {
    color: "gray",
    "&$checked": {
      color: "#0056a7",
    },
    padding: 1,
  },
  checked: {},
})((props) => <Radio size="small" color="default" {...props} />);

export const CollboratorEmail = styled.label`
  margin-left: 8px;
`;
