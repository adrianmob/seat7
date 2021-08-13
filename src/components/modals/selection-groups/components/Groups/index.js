import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
} from "@material-ui/core";
import { ExpandMore, DeleteOutline } from "@material-ui/icons";

import { LabelContent, Label, HeaderContainer } from "./styles";
import Contact from "../Contact";

const Groups = ({ group, groupName, handleEdit, handleDelete, noEdit }) => (
  <Accordion style={{ background: "#eaeaea" }} className="contacts-group">
    <AccordionSummary expandIcon={<ExpandMore />}>
      <HeaderContainer>
        <p className="text">Group {groupName}</p>
        <IconButton onClick={() => handleDelete(group)} style={{ padding: 2 }}>
          <DeleteOutline fontSize="medium" />
        </IconButton>
      </HeaderContainer>
    </AccordionSummary>

    <AccordionDetails>
      <div>
        {group.emails && (
          <LabelContent>
            <Label>to:</Label>
            <Label>cc:</Label>
            <Label>bcc:</Label>
          </LabelContent>
        )}

        {group.emails &&
          group.emails.map((contact, index) => (
            <Contact
              key={index}
              index={index}
              contact={contact}
              handleSelected={handleEdit}
              noEdit={noEdit}
              group={group}
							notags
            />
          ))}
      </div>
    </AccordionDetails>
  </Accordion>
);

export default Groups;
