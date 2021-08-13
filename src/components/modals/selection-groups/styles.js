import React from "react";
import styled from "styled-components";
import { CircularProgress } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

export const Loader = withStyles({
  circleIndeterminate: {
    color: "#0056a7",
  },
})((props) => <CircularProgress {...props} />);

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

export const LoaderContent = styled.div`
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ModalHeader = styled.div`
  width: 100%;
  display: flex;
  background: #0056a7;
  height: 55px;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;

  h3 {
    color: white;
  }

  p {
    color: white;
    font-weight: 500;
    font-size: 20px;
    margin-left: 6px;
    font-style: italic;
  }

  div {
    display: flex;
  }

  button {
    color: white;
    font-size: 28px;
    font-weight: 300;
    transition: 0.2s;
    cursor: pointer;

    &:hover {
      transform: scale(1.2);
    }
  }
`;

export const GroupsHeader = styled.div`
  display: flex;
  justify-content: start;
  height: 30px;
  margin-bottom: 20px;
`;

export const HeaderButton = styled.button`
  height: 30px;
  margin-right: 20px;
`;

export const SectionGroupsHeader = styled.div`
  margin-bottom: 5px;
`;

export const Title = styled.p`
  color: gray;
  font-size: 12px;
`;

export const AddButton = styled.button`
  color: #017bbc;
  font-size: 14px;
  display: flex;
  cursor: pointer;

	&:disabled {
		color: #808080;
		cursor: not-allowed;
	}
`;

export const Divisor = styled.div`
  width: 30px;
  background: "red";
  height: 300px;
`;

export const EmailsHeader = styled.div`
  display: flex;
  align-items: center;
  height: 30px;
  margin-top: 10px;

  p {
    color: gray;
    font-size: 14px;
    margin-right: 6px;
  }

  div {
    height: 1.5px;
    flex-grow: 1;
    background: gray;
  }
`;

export const LabelContent = styled.div`
  display: flex;
`;

export const Label = styled.p`
  color: gray;
  margin-right: 7px;
  font-size: 14px;
`;

export const ActionButtom = styled.button`
  color: white;
  display: flex;
  align-items: center;
  margin: 10px 10px;
  margin-left: 0;
  border-radius: 4px;
  font-size: 12px;
  background: ${(props) => (props.disabled ? "gray" : "#09b0ee")};
  padding: 0 ${(props) => (props.padding ? props.padding : 8)}px;
  height: 35px;
  transition: 0.2s;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};

  &:hover {
    background: ${(props) => (props.disabled ? "gray" : "#017bbc")};
  }
`;
