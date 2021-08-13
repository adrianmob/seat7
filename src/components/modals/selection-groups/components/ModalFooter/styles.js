import styled from "styled-components";

export const ActionButtom = styled.button`
  color: white;
  display: flex;
  align-items: center;
  margin: ${(props) => (props.noMargin ? 0 : "10px 10px")};
  margin-left: ${(props) => (props.mLeft ? props.mLeft+"px" : "10px 10px")};
  border-radius: 4px;
	border-top-left-radius: ${(props) => (props.btLeftRadius === 0 ? props.btLeftRadius : "4")}px;
	border-bottom-left-radius: ${(props) => (props.bbLeftRadius=== 0 ? props.bbLeftRadius : "4")}px;
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

export const SaveContainer = styled.div`
  flex-direction: column;
  background: white;
  align-items: center;
  box-shadow: 0px 0px 2px #b7b7b7;
  border: solid 1px #b7b7b7;
  padding: 8px;
  border-radius: 5px;
  margin-right: 10px;
  height: 110px;
  width: 193px;
  position: absolute;
  bottom: 8px;
  right: ${(props) => (props.edit ? "162px" : "231px")};
`;

export const FinishContainer = styled.div`
	display: flex;
	align-items: center;
	margin: ${(props) => (props.noMargin ? 0 : "10px 10px")};
`;

export const InputContainer = styled.form`
  display: flex;
  margin-top: ${(props) => (props.noMargin ? 0 : "3px")};
  margin-bottom: ${(props) => (props.noMargin ? 0 : "10px")};
`;

export const Input = styled.input`
  border: solid 1px gray;
  border-radius: 4px 0 0 4px;
  height: ${(props) => (props.height ? props.height : "25")}px;
  padding: 0 5px;
  color: gray;
  width: 100%;
	max-width: ${(props) => (props.mxWidth ? props.mxWidth+"px" : "none")};
	margin-right: ${(props) => (props.mRight ? props.mRight : "0")}px;
`;

export const SaveButtom = styled.button`
  color: white;
  display: flex;
  align-items: center;
  border-radius: 0 4px 4px 0;
  font-size: 12px;
  background: #09b0ee;
  padding: 4px;
  height: 25px;
  transition: 0.2s;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};

  &:hover {
    background: #017bbc;
  }
`;

export const SavePresetButtom = styled.button`
  color: white;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
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

export const Placeholder = styled.p`
  color: gray;
  font-size: 13px;
`;

export const ModalFooter = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;
