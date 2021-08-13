import React from "react";
import styled from "styled-components";
import { Select, Checkbox } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

export const PresetContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
`;

export const PresetSelect = withStyles({
  outlined: {
    paddingLeft: 5,
    fontSize: 13,
    color: "gray",
  },
})((props) => <Select {...props} />);

export const CheckContainer = styled.div`
  display: flex;
  align-items: center;
  padding-left: 10px;

  p {
    font-size: 14px;
    color: gray;
  }
`;

export const TagButtom = styled.button`
  color: white;
  display: flex;
  align-items: center;
  border-radius: 4px;
  margin-left: 10px;
  font-size: 12px;
  background: #09b0ee;
  padding: 0 8px;
  height: 30px;
  transition: 0.2s;
  cursor: pointer;

  &:hover {
    background: #017bbc;
  }
`;

export const Check = withStyles({
  root: {
    color: "gray",
    padding: 2,
  },
})((props) => <Checkbox color="default" {...props} />);

export const TagsContainer = styled.div`
  display: flex;
  padding: 4px;
  width: 180px;
  flex-wrap: wrap;

  button {
    background: #e0e0e0;
    display: flex;
    align-items: center;
    height: 20px;
    padding: 0 4px;
    margin: 2px;
    border-radius: 3px;
    font-size: 13px;
    cursor: pointer;
    transition: 0.2s;

    &:hover {
      background: #017bbc;
      color: white;
    }
  }
`;

export const TagSearch = styled.div`
  background: #e0e0e0;
  border-radius: 3px;
  border: 0;
  align-items: center;
  display: flex;
  flex-grow: 1;
  height: 26px;
  padding: 0 2px;
  margin-top: 2px;
  margin-bottom: 4px;

  input {
    background: #e0e0e0;
    border: 0;
    width: 131px;
    flex-grow: 1;
    padding-left: 6px;
  }
`;
