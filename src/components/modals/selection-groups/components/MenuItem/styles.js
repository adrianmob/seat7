import React from "react";
import styled from "styled-components";
import { Checkbox } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

export const MenuItemContainer = styled.div`
  display: flex;
  margin-bottom: 6px;
  align-items: center;
`;

export const MenuCheck = withStyles({
  root: {
    color: "gray",
    display: "flex",
		padding: 2
  },
  checked: {
    color: (props) => props.color || "orange",
  },
})((props) => <Checkbox color="default" {...props} />);

export const MenuButtonLabel = styled.button`
  background: ${(props) => (props.selected ? "#0056a7" : "#eaeaea")};
  display: flex;
  flex-grow: 1;
  justify-content: left;
  padding: 6px;
  border-radius: 4px;
  color: ${(props) => (props.selected ? "white" : "black")};
  font-size: 14;
  word-wrap: break-word;
  word-break: break-all;
  cursor: pointer;
`;
