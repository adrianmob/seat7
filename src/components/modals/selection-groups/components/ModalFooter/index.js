import React, { useEffect, useState, useCallback } from "react";
import { PlaylistAddCheckOutlined, SaveOutlined } from "@material-ui/icons";
import {
  ActionButtom,
  ModalFooter,
  SaveContainer,
	FinishContainer,
  SavePresetButtom,
  InputContainer,
  Input,
  Placeholder,
  SaveButtom,
} from "./styles";

const Footer = ({
  publishers,
  categories,
	groupName,
  handleSavePreset,
  handleSaveSubmissionList,
  handleSaveEdit,
	editMode,
	updateMode,
	displayOff
}) => {
  const [showDialog, setShowDialog] = useState(false);
  const [name, setName] = useState("");
	const [listName, setListName] = useState(groupName);

  const disableSavePresetButton = useCallback(() => {
    const hasPublisherGroup = publishers.filter(
      (publisher) => publisher.groups.length
    );
    const hasCategoriesGroup = categories.filter(
      (category) => category.groups.length
    );
    const haveGroups = hasPublisherGroup.length || hasCategoriesGroup.length;

    return !haveGroups;
  }, [categories, publishers]);

  const disableFinshButton = useCallback(() => {
    const publisherSelecion = publishers.filter((publisher) => {
      const isPreselection = !publisher.preset || publisher.preselection;

      if (isPreselection && publisher.groups.length) {
        return publisher;
      }
    });
    const categorySelecion = categories.filter((category) => {
      const isPreselection = !category.preset || category.preselection;

      if (isPreselection && category.groups.length) {
        return category;
      }
    });

    const haveGroups = publisherSelecion.length || categorySelecion.length;

    return !haveGroups;
  }, [categories, publishers]);

  useEffect(() => {
    disableSavePresetButton() && showDialog && handleClear();
  }, [disableSavePresetButton, showDialog]);

  const handleClear = () => {
    setShowDialog(false);
    setName("");
    setListName("");
  };

  const onSubmit = (e) => {
    e && e.preventDefault();

    handleSavePreset(name);
    handleClear();
  };

  const onFinish = (e) => {
    e && e.preventDefault();

		if(listName) {
			handleSaveSubmissionList(listName);
			handleClear();
		}
  };

  return (
    <ModalFooter className={`modal-footer ${displayOff === true ? "modal-footer-none" : ""}`}>
			{!updateMode &&
				<div>
					{showDialog ? (
						<SaveContainer edit={editMode}>
							<Placeholder>Preset Name</Placeholder>
							<InputContainer onSubmit={onSubmit}>
								<Input
									required
									value={name}
									onChange={({ target }) => setName(target.value)}
									type="text"
								/>
								<SaveButtom type="submit">
									<SaveOutlined fontSize="small" />
								</SaveButtom>
							</InputContainer>

							<SavePresetButtom onClick={() => setShowDialog(false)}>
								CLOSE
							</SavePresetButtom>
						</SaveContainer>
					) : (
						<ActionButtom
							disabled={disableSavePresetButton()}
							onClick={() => setShowDialog(true)}
						>
							CREATE NEW PRESET
							<PlaylistAddCheckOutlined style={{ marginLeft: 5 }} />
						</ActionButtom>
					)}

					{editMode && (
						<ActionButtom open={showDialog} padding={20} mLeft={10} onClick={handleSaveEdit}>
							SAVE EDITS
							<SaveOutlined style={{ fontSize: 22, marginLeft: 5 }} />
						</ActionButtom>
					)}
				</div>
			}

      {!editMode && (
				<FinishContainer>
					<InputContainer onSubmit={onFinish} noMargin>
						<Input
							required
							mRight={-3}
							height={35}
							mxWidth={130}
							value={listName}
							onChange={({ target }) => setListName(target.value)}
							type="text"
						/>

						<ActionButtom
							noMargin
							padding={20}
							btLeftRadius={0}
							bbLeftRadius={0}
							disabled={disableFinshButton()}
						>
							{updateMode ? "UPDATE" : "FINISH"}
						</ActionButtom>
					</InputContainer>
				</FinishContainer>
      )}
    </ModalFooter>
  );
};

export default Footer;
