import React from "react";

import TagsField from "../../../../TagsField";

const FormPublisherContact = ({
	enabled,
	contactId,
	contactName,
	contactEmail,
	categories,
	saveTags,
	clearTags,
	contactTags,
	submitText,
	submit,
	onChange,
	hendleTagdSaved,
	hendleSelectCategory,
	hendleOnChangeTags,
	hendleOpenManageTags}) => (

  <div data-component="add-contact-form" className={`${enabled ? "enabled" : "disabled"}`}>
		<div className="input-container">
			<label className="label">Name</label>
			<input className="input" type="text" placeholder="Jhon Doe" name="contact-name" value={contactName} onChange={e => onChange(e)}/>
		</div>

		<div className="input-container">
			<label className="label">E-mail</label>
			<input className="input" type="email"  placeholder="jhondoe@company.com" name="contact-email" value={contactEmail} onChange={e => onChange(e)}/>
		</div>

		<TagsField
			saveTags={saveTags}
			clearTags={clearTags}
			contactId={contactId}
			contactTags={contactTags}
			hendleTagdSaved={hendleTagdSaved}
			hendleOnChangeTags={hendleOnChangeTags}
			hendleOpenManageTags={hendleOpenManageTags}
		/>

		{categories.length > 0 &&
			<div className="categories-list-container">
				<p className="text text-select-categories">
					Select the categories in which you want to add the new contact
				</p>

				<div className="categories-list">
					{
						categories.map((category, index) => (
							<div className={`item`}>
								<input onChange={() => hendleSelectCategory(category.id)} type="checkbox" name="category-selection" id={`category-${category.name}`}/>
								<label htmlFor={`category-${category.name}`}> {category.name}</label>
							</div>
						))
					}
				</div>
			</div>
		}

		<button class="btn blue-light with-icon btn-save-contact" onClick={() => submit()}>
			{submitText}
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70.902 70.902">
				<path d="M65.695 23.161a2.11 2.11 0 00-.111-.549l-.066-.176a2.029 2.029 0 00-.419-.619L43.892.61a2.132 2.132 0 00-.64-.426 2.463 2.463 0 00-.159-.057 2.049 2.049 0 00-.572-.111L42.416 0H28.405c-5.038 0-9.137 4.098-9.137 9.137v1.229h-4.944c-5.037 0-9.136 4.1-9.136 9.137v42.262c0 5.037 4.099 9.137 9.136 9.137h28.175c5.037 0 9.136-4.1 9.136-9.137v-1.23h4.943c5.038 0 9.137-4.098 9.137-9.137V23.301l-.02-.14zM44.507 7.145l14.061 14.063h-9.111a4.956 4.956 0 01-4.949-4.951l-.001-9.112zm2.941 54.619a4.956 4.956 0 01-4.95 4.951H14.323a4.956 4.956 0 01-4.95-4.951V19.502a4.956 4.956 0 014.95-4.951h11.918v12.07c0 5.039 4.099 9.137 9.137 9.137h12.07v26.006zM30.427 26.622v-9.11l14.062 14.061h-9.11a4.956 4.956 0 01-4.952-4.951zm31.101 24.775a4.956 4.956 0 01-4.95 4.951h-4.943V33.665l-.02-.137a2.125 2.125 0 00-.11-.547l-.072-.189a2.053 2.053 0 00-.41-.604l-21.21-21.213a2.001 2.001 0 00-.792-.478 2.016 2.016 0 00-.547-.111v.004l-.139-.023h-4.881V9.138a4.957 4.957 0 014.951-4.951h11.918v12.07c0 5.039 4.098 9.137 9.135 9.137h12.07v26.003z"/>
				<path d="M29.65 38.747a2 2 0 00-4 0v7.172h-7.172a2 2 0 000 4h7.172v7.172a2 2 0 004 0v-7.172h7.173a2 2 0 000-4H29.65v-7.172z"/>
			</svg>
		</button>
  </div>
);

export default FormPublisherContact;
