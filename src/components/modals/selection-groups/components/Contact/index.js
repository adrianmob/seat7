import React from "react";

import { Option, CollboratorEmail } from "./styles";

const Contact = ({ notags, contact, index, handleSelected, noEdit, group = [] }) => (
  <div className="contact-item">
    <Option
      disabled={noEdit}
      checked={contact.shipping_field === "to"}
      onChange={() => handleSelected(index, "to", group)}
    />
    <Option
      disabled={noEdit}
      checked={contact.shipping_field === "cc"}
      onChange={() => handleSelected(index, "cc", group)}
    />
    <Option
      disabled={noEdit}
      checked={contact.shipping_field === "bcc"}
      onChange={() => handleSelected(index, "bcc", group)}
    />
    <CollboratorEmail>{contact?.email ?? ""}</CollboratorEmail>

		{!notags && contact.tags.length > 0 &&
			<div className="contact-tag-list">
				<svg width="21" height="12"><image width="21" height="12" href="data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAMCAQAAAAnxz5OAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAACxIAAAsSAdLdfvwAAAAHdElNRQflBBwVEwVuerrwAAAAtUlEQVQoz43RsS5DUQDG8d89RW7SDkoQFguJTQwSD2A4s0fwPH0Ns8HgziaDwd7RVFLldrrV9liU7Vz/+bd8+YpkVTVwJVjaNPPqQDJR6mrUeq6LFa1m1uV6WfuBcx35NsI/IcIv/PCsycgyVHc6WMS+c7cZugwOwag6i3NvGdoU9yce7EiefLrM0PciqY492mpdVQfi0IVxK/0KEIdOTdrs31t7buzaVxrp6ZpKStS2LYzj0TeJbDcmJ8kczQAAAABJRU5ErkJggg=="/></svg>

				<div className="tag-list">
					<div className={`tag-list-content`}>
						{contact.tags.map( item => (
							<div key={item.id} className="_tag">{item.name}</div>
						))}
					</div>
				</div>
			</div>
		}
  </div>
);

export default Contact;
