import React from "react";

import { MenuItemContainer, MenuButtonLabel, MenuCheck } from "./styles";

const MenuItem = ({
  item,
  index,
  handleChecked,
  handleSelected,
  selected,
	type,
	emailListOpen
}) => (
  <MenuItemContainer>
	{!emailListOpen &&
		<MenuCheck
			color={item.color || ""}
			disabled={!item.collaborators.length}
			onChange={({ target }) => {
				item.checked
					? handleChecked(type, target.checked, item, index)
					: handleChecked(type, target.checked, item, index);
			}}
			checked={item.checked || false}
		/>
	}
    <MenuButtonLabel
      onClick={() => handleSelected(type, item, index)}
      selected={item.id === selected.id && selected.type === type}
    >
      {item?.name ?? ""}
    </MenuButtonLabel>
  </MenuItemContainer>
);

export default MenuItem;
