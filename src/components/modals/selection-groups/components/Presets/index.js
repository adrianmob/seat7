import React, { useState } from "react";
import { Grid, MenuItem, IconButton, Popover } from "@material-ui/core";
import {
  DeleteOutline,
  EditOutlined,
  More,
  SearchOutlined,
} from "@material-ui/icons";

import {
  PresetSelect,
  PresetContainer,
  CheckContainer,
  Check,
  TagButtom,
  TagsContainer,
  TagSearch,
} from "./styles";

const Presets = ({
  presets,
  preset,
  handlePreset,
  handleDeletePreset,
  handleEditPreset,
  handlePreselection,
  hasPreselection,
  editMode,
	allTags,
	handleByTag
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [relatedTags, setRelatedTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const handleClick = (event) => setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);

	const findRelated = (toSearch) => {
		function trimString(s) {
			var l=0, r=s.length -1;
			while(l < s.length && s[l] == ' ') l++;
			while(r > l && s[r] == ' ') r-=1;
			return s.substring(l, r+1);
		}
		
		function compareObjects(o1, o2) {
			var k = '';
			for(k in o1) if(o1[k] != o2[k]) return false;
			for(k in o2) if(o1[k] != o2[k]) return false;
			return true;
		}
		
		function itemExists(haystack, needle) {
			for(var i=0; i<haystack.length; i++) if(compareObjects(haystack[i], needle)) return true;
			return false;
		}

		var results = [];
		toSearch = trimString(toSearch); // trim it
		for(var i=0; i<allTags.length; i++) {
			if(allTags[i].name.toLowerCase().indexOf(toSearch.toLowerCase())!=-1) {
				if(!itemExists(results, allTags[i])) results.push(allTags[i]);
			}
		}

		return results;
	}

	const onChangeTags = (e) => {
		if(e.target.value !== "") {
			setRelatedTags(findRelated(e.target.value));
		} else {
			setRelatedTags([]);
		}
	}

	const selectTag = (tagId) => {
		const tempSelectedTags = selectedTags;
		const tempRelatedTags = relatedTags.map((r) => ({
			...r
		}));
		
		const index = tempSelectedTags.indexOf(tagId);
		if(index >= 0) {
			tempSelectedTags.splice(index, 1);
			handleByTag(tagId, tempSelectedTags, "remove");
		} else {
			tempSelectedTags.push(tagId);
			handleByTag(tagId, tempSelectedTags, "add");
		}

		setRelatedTags(tempRelatedTags);
		setSelectedTags(tempSelectedTags);
	}

  return (
    <Grid container>
      <Grid item xs={2}>
        <PresetSelect
          value={preset}
          onChange={handlePreset}
          style={{ height: 30, width: "100%", marginBottom: 10 }}
          displayEmpty
          renderValue={(value) =>
            value
              ? presets.find((el) => el.id === value.id).preset_name
              : "Select a preset"
          }
          variant="outlined"
        >
          <MenuItem value="">Select a preset</MenuItem>
					
          {presets.map((p) => (
            <MenuItem style={{ padding: 5, height: 35 }} key={p.id} value={p}>
              <PresetContainer>
                <div style={{ flexGrow: 1 }}>{p.preset_name}</div>

								{p.id === preset.id &&
									<IconButton
										onClick={() => handleEditPreset(p.id)}
										style={{ padding: 2 }}
									>
										<EditOutlined fontSize="small" />
									</IconButton>
								}

								<IconButton
									onClick={() => handleDeletePreset(p)}
									style={{ padding: 2 }}
								>
									<DeleteOutline fontSize="small" />
								</IconButton>

              </PresetContainer>
            </MenuItem>
          ))}
        </PresetSelect>
      </Grid>

      <Grid item xs={6}>
        {editMode ? null : preset ? (
          <CheckContainer>
            <Check onChange={handlePreselection} />
            <p>Mark all preselected items in this preset</p>
          </CheckContainer>
        ) : (
          <div>
            <TagButtom onClick={handleClick}>
              Select contact by tags
              <More style={{ fontSize: 18, marginLeft: 5 }} />
            </TagButtom>

            <Popover
							data-component="find-tags"
              id={!!anchorEl || "simple-popover"}
              open={!!anchorEl}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "center",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "center",
                horizontal: "left",
              }}
            >
              <TagsContainer className="find-tags">
                <TagSearch>
                  <input autoFocus placeholder="Search" type="text" onChange={e => onChangeTags(e)}/>
                  <SearchOutlined style={{ fontSize: 25, padding: 3 }} />
                </TagSearch>

								<div className="content-tags">
									{relatedTags.map((tag) => (
										<button
											key={tag.id}
											className={selectedTags.indexOf(tag.id) >= 0 ? "active" : ""}
											onClick={e => selectTag(tag.id)}
										>
											{tag.name}
										</button>
									))}
								</div>
              </TagsContainer>
            </Popover>
          </div>
        )}
      </Grid>
    </Grid>
  );
};

export default Presets;
