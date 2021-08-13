import React, { Component } from 'react';
import Helmet from 'react-helmet';


export default class ConfidentialityNotAccepted extends Component {
	
	state = {
		// checkedItens: [
		// 	{
		// 		"id":0,
		// 		"list_id":0,
		// 		"list": [
		// 			{
		// 				"id":1,
		// 				"checked":"",
		// 				"name":"EA Games",
		// 				"publisher": {
		// 					"id":1,
		// 					"checked":"",
		// 					"name":"EA Games",
		// 					"contact_name":"Jhon Doe",
		// 					"email":"jhon@doe.com"
		// 				},
		// 				"collaborators": [
		// 					{
		// 						"id":10,
		// 						"checked":"",
		// 						"name":"Vinícius Ferreira",
		// 						"email":"wferreira.vinicius@gmail.com"
		// 					},
		// 					{
		// 						"id":11,
		// 						"checked":"",
		// 						"name":"Lucas B.",
		// 						"email":"lucasb@gmail.com"
		// 					}
		// 				]
		// 			},
		// 			{
		// 				"id":26,
		// 				"checked":"",
		// 				"name":"Publisher teste",
		// 				"publisher": {
		// 					"id":26,
		// 					"checked":"",
		// 					"name":"Publisher teste",
		// 					"contact_name":"Vinícius Ferreira",
		// 					"email":"teste@teste.com"
		// 				},
		// 				"collaborators": [
		// 					{
		// 						"id":2,
		// 						"checked":"",
		// 						"name":"Vinícius",
		// 						"email":"wferreira.vinicius@gmail.com"
		// 					},
		// 					{
		// 						"id":9,
		// 						"checked":"",
		// 						"name":"3",
		// 						"email":"3@3.com"
		// 					}
		// 				]
		// 			},
		// 			{
		// 				"id":30,
		// 				"checked":"",
		// 				"name":"Ubisoft",
		// 				"publisher": {
		// 					"id":30,
		// 					"checked":"",
		// 					"name":"Ubisoft",
		// 					"contact_name":"Ubisoft Contact",
		// 					"email":"ubisoft@ubisoft.com"
		// 				},
		// 				"collaborators":[]
		// 			},
		// 			{
		// 				"id":37,
		// 				"checked":"",
		// 				"name":"Test Account",
		// 				"publisher": {
		// 					"id":37,
		// 					"checked":"",
		// 					"name":"Test Account",
		// 					"contact_name":"Carlos Martin",
		// 					"email":"carlos.martin@gmail.com"
		// 				},
		// 				"collaborators": [
		// 					{
		// 						"id":18,
		// 						"checked":"",
		// 						"name":"Edh",
		// 						"email":"Edh@gmail.com"
		// 					}
		// 				]
		// 			},
		// 			{
		// 				"id":38,
		// 				"checked":"",
		// 				"name":"test publisher-jacob",
		// 				"publisher": {
		// 					"id":38,
		// 					"checked":"",
		// 					"name":"test publisher-jacob",
		// 					"contact_name":"Jacob Lewis",
		// 					"email":"jacob@seat7entertainment.com"
		// 				},
		// 				"collaborators":[]
		// 			}
		// 		]
		// 	},
		// 	{
		// 		"id":1,
		// 		"list_id":40,
		// 		"list": [
		// 			{
		// 				"id":1,
		// 				"checked":"",
		// 				"name":"EA Games",
		// 				"publisher": {
		// 					"id":1,
		// 					"checked":"",
		// 					"name":"EA Games",
		// 					"contact_name":"Jhon Doe",
		// 					"email":"jhon@doe.com"
		// 				},
		// 				"collaborators": [
		// 					{
		// 						"id":10,
		// 						"checked":"",
		// 						"name":"Vinícius Ferreira",
		// 						"email":"wferreira.vinicius@gmail.com"
		// 					},
		// 					{
		// 						"id":11,
		// 						"checked":"",
		// 						"name":"Lucas B.",
		// 						"email":"lucasb@gmail.com"
		// 					}
		// 				]
		// 			},
		// 			{
		// 				"id":26,
		// 				"checked":"",
		// 				"name":"Publisher teste",
		// 				"publisher": {
		// 					"id":26,
		// 					"checked":"",
		// 					"name":"Publisher teste",
		// 					"contact_name":"Vinícius Ferreira",
		// 					"email":"teste@teste.com"
		// 				},
		// 				"collaborators": [
		// 					{
		// 						"id":2,
		// 						"checked":"",
		// 						"name":"Vinícius",
		// 						"email":"wferreira.vinicius@gmail.com"
		// 					},
		// 					{
		// 						"id":9,
		// 						"checked":"",
		// 						"name":"3",
		// 						"email":"3@3.com"
		// 					}
		// 				]
		// 			},
		// 			{
		// 				"id":30,
		// 				"checked":"",
		// 				"name":"Ubisoft",
		// 				"publisher": {
		// 					"id":30,
		// 					"checked":"",
		// 					"name":"Ubisoft",
		// 					"contact_name":"Ubisoft Contact",
		// 					"email":"ubisoft@ubisoft.com"
		// 				},
		// 				"collaborators":[]
		// 			},
		// 			{
		// 				"id":37,
		// 				"checked":"",
		// 				"name":"Test Account",
		// 				"publisher": {
		// 					"id":37,
		// 					"checked":"",
		// 					"name":"Test Account",
		// 					"contact_name":"Carlos Martin",
		// 					"email":"carlos.martin@gmail.com"
		// 				},
		// 				"collaborators": [
		// 					{
		// 						"id":18,
		// 						"checked":"",
		// 						"name":"Edh",
		// 						"email":"Edh@gmail.com"
		// 					}
		// 				]
		// 			},
		// 			{
		// 				"id":38,
		// 				"checked":"",
		// 				"name":"test publisher-jacob",
		// 				"publisher": {
		// 					"id":38,
		// 					"checked":"",
		// 					"name":"test publisher-jacob",
		// 					"contact_name":"Jacob Lewis",
		// 					"email":"jacob@seat7entertainment.com"
		// 				},
		// 				"collaborators":[]
		// 			}
		// 		]
		// 	},
		// 	{
		// 		"id":1,
		// 		"list_id":41,
		// 		"list": [
		// 			{
		// 				"id":1,
		// 				"checked":"",
		// 				"name":"EA Games",
		// 				"publisher": {
		// 					"id":1,
		// 					"checked":"",
		// 					"name":"EA Games",
		// 					"contact_name":"Jhon Doe",
		// 					"email":"jhon@doe.com"
		// 				},
		// 				"collaborators": [
		// 					{
		// 						"id":10,
		// 						"checked":"",
		// 						"name":"Vinícius Ferreira",
		// 						"email":"wferreira.vinicius@gmail.com"
		// 					},
		// 					{
		// 						"id":11,
		// 						"checked":"",
		// 						"name":"Lucas B.",
		// 						"email":"lucasb@gmail.com"
		// 					}
		// 				]
		// 			},
		// 			{
		// 				"id":26,
		// 				"checked":"",
		// 				"name":"Publisher teste",
		// 				"publisher": {
		// 					"id":26,
		// 					"checked":"",
		// 					"name":"Publisher teste",
		// 					"contact_name":"Vinícius Ferreira",
		// 					"email":"teste@teste.com"
		// 				},
		// 				"collaborators": [
		// 					{
		// 						"id":2,
		// 						"checked":"",
		// 						"name":"Vinícius",
		// 						"email":"wferreira.vinicius@gmail.com"
		// 					},
		// 					{
		// 						"id":9,
		// 						"checked":"",
		// 						"name":"3",
		// 						"email":"3@3.com"
		// 					}
		// 				]
		// 			},
		// 			{
		// 				"id":30,
		// 				"checked":"",
		// 				"name":"Ubisoft",
		// 				"publisher": {
		// 					"id":30,
		// 					"checked":"",
		// 					"name":"Ubisoft",
		// 					"contact_name":"Ubisoft Contact",
		// 					"email":"ubisoft@ubisoft.com"
		// 				},
		// 				"collaborators":[]
		// 			},
		// 			{
		// 				"id":37,
		// 				"checked":"",
		// 				"name":"Test Account",
		// 				"publisher": {
		// 					"id":37,
		// 					"checked":"",
		// 					"name":"Test Account",
		// 					"contact_name":"Carlos Martin",
		// 					"email":"carlos.martin@gmail.com"
		// 				},
		// 				"collaborators": [
		// 					{
		// 						"id":18,
		// 						"checked":"",
		// 						"name":"Edh",
		// 						"email":"Edh@gmail.com"
		// 					}
		// 				]
		// 			},
		// 			{
		// 				"id":38,
		// 				"checked":"",
		// 				"name":"test publisher-jacob",
		// 				"publisher": {
		// 					"id":38,
		// 					"checked":"",
		// 					"name":"test publisher-jacob",
		// 					"contact_name":"Jacob Lewis",
		// 					"email":"jacob@seat7entertainment.com"
		// 				},
		// 				"collaborators":[]
		// 			}
		// 		]
		// 	}
		// ],
		// contacts: [
		// 	{
		// 		"id":52,
		// 		"list_id":40,
		// 		"contact_type":"publisher",
		// 		"contact_id":1,
		// 		"contact_email":"jhon@doe.com",
		// 		"sent_at":null
		// 	},
		// 	{
		// 		"id":53,
		// 		"list_id":41,
		// 		"contact_type":"publisher",
		// 		"contact_id":26,
		// 		"contact_email":"teste@teste.com",
		// 		"sent_at":null
		// 	}
		// ]
	}

	componentDidMount () {
		// this.updateItens();
	}

	updateItens = async () => {
		const checkedItensTemp = this.state.checkedItens;
		const contacts = this.state.contacts;

		await contacts.forEach( function(contact) {
			checkedItensTemp.map( function(list) {
				if(list.list_id === contact.list_id) {
					return list.list.map(function(item) {
						if(contact.contact_type === "publisher") {
							if(contact.contact_id === item.id) {
								return item.publisher.checked = "checked";
							} else {
								return item;
							}
						} else {
							return item.collaborators.map( function(collaborator) {
								if(contact.contact_id === collaborator.id) {
									return collaborator.checked = "checked";
								} else {
									return collaborator;
								}
							})
						}
					});
			} else {
					return list
				}
			})
		})

		console.log(checkedItensTemp);
		
		await this.setState({
			checkedItens: checkedItensTemp
		});
	}

	render() {
		return (
			<div data-page="confidentiality-not-accepted">
				<Helmet>
					<title>Seat 7 - Project List</title>
					<meta name="theme-color" content="#0056a7"/>
					{/* <meta http-equiv='cache-control' content='no-cache' />
					<meta http-equiv='expires' content='0' />
					<meta http-equiv='pragma' content='no-cache' /> */}
				</Helmet>

				<div className="content">
					<div className="container">
						<p className="text">
							This page contains sensitive content, and is no longer available. <br/>
							For more information or to request access talk to us through the channels below.
						</p>
					</div>
				</div>

				<footer className="landing-page-footer">
					<div className="container">
						<svg className="logo" xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 261.7 368.3">
							<path fill="#2f55a4" d="M235.3 164l-16.4 16.4c-7.8 5.6-18.7 4.9-25.7-2.1l-56.7-56.7-.3-.3-32.7-32.7c-1-1.1-2.1-2.2-3.2-3.2l-13-13L59 44.1h28.9c0 .2 4.7 0 7.1 0 5.9 0 11.6 1 16.8 2.9 5.6 2 10.7 5 15.2 8.8l31.1 31.1 6.3 6.3 10.8 10.8 28.2 28.2 18 18 13.9 13.8zM193 206.3l-16.4 16.4c-7 5-16.4 4.9-23.3-.1-.8-.6-1.6-1.3-2.3-2l-46.2-46.2-.6-.6-20-20-8.2-8.2h38.6c5.5.3 10.8 1.5 15.8 3.5 5.3 2.1 10.2 5.2 14.5 8.9l4.3 4.3c3 3.4 12.2 12.2 12.2 12.2l18 18 13.6 13.8z"/>
							<path fill="#2f55a4" d="M231.7 75.7l-14.2-14.2-41.9-41.9L169 13c-4.3-3.6-9.3-6.4-14.6-8.4-5.3-2-11.1-3-17.1-3h-120c0 .2 27.4 28.3 27.4 28.3H110c5.7.1 11.1 1.2 16.2 3 5.9 2.2 11.3 5.4 15.9 9.6 1.4 1.3 2.8 2.6 4.1 4.1l57.5 57.5c7.5 7.5 19.4 7.8 27.2.9L246 89.9l-14.3-14.2z"/>
							<g>
								<path fill="#2f55a4" d="M30.8 247c10.2 0 15.6 5.4 15.6 15.6V274c0 1.1-.5 1.7-1.7 1.7H33.3c-1.1 0-1.7-.6-1.7-1.7v-8.4c0-2.8-1.4-4.3-4.3-4.3h-5.2c-2.7 0-4.3 1.5-4.3 4.3v14.9l25.7 8.4c1.8.8 2.8 1.9 2.8 4v24.9c0 10.2-5.4 15.6-15.6 15.6h-12c-10 0-15.6-5.4-15.6-15.6v-11.3c0-1.2.6-1.7 1.7-1.7H16c1.2 0 1.7.5 1.7 1.7v8.3c0 2.9 1.6 4.3 4.3 4.3h5.2c2.8 0 4.3-1.4 4.3-4.3v-14.4L6 292c-1.9-.6-2.9-1.9-2.9-4v-25.5c0-10.2 5.5-15.6 15.6-15.6h12.1zM100.2 259.5c0 1.1-.4 1.8-1.7 1.8h-27V283h20.6c1.1 0 1.7.6 1.7 1.8v10.7c0 1.2-.6 1.8-1.7 1.8H71.5v21.8h27c1.3 0 1.7.5 1.7 1.7v10.8c0 1.1-.4 1.7-1.7 1.7H58.7c-1 0-1.6-.6-1.6-1.7v-82.9c0-1.1.6-1.7 1.6-1.7h39.7c1.3 0 1.7.6 1.7 1.7v10.8zM148.4 333.4c-1 0-1.5-.5-1.7-1.5l-3-15.8h-19.2l-2.9 15.8c-.2 1-.8 1.5-1.7 1.5h-11.6c-1.2 0-1.7-.6-1.4-1.8l17.9-83.1c.2-1.1.9-1.5 1.8-1.5h15c1 0 1.6.4 1.8 1.5l17.9 83.1c.2 1.2-.2 1.8-1.5 1.8h-11.4zM134 265.9l-6.9 37.7h13.8l-6.9-37.7zM201.7 247c1.2 0 1.7.6 1.7 1.7v10.8c0 1.1-.5 1.7-1.7 1.7h-12.5v70.4c0 1.2-.5 1.7-1.7 1.7h-11.2c-1.1 0-1.7-.5-1.7-1.7v-70.4H162c-1.1 0-1.7-.6-1.7-1.7v-10.8c0-1.1.6-1.7 1.7-1.7h39.7zM258.1 247c1.7 0 2.2 1.1 1.6 2.6l-31.5 82c-.4 1.2-1.2 1.7-2.5 1.7l-11.2.1c-1.6 0-2.3-1-1.7-2.5l26.7-69.6h-14.8c-6.9 0-12.5-5.6-12.5-12.5 0-1.2.6-1.7 1.7-1.8h44.2z"/>
								<g> <path fill="#2f55a4" d="M56.9 348.2c0 .3-.1.5-.4.5h-6.8v5.5h5.2c.3 0 .4.2.4.5v2.7c0 .3-.2.5-.4.5h-5.2v5.5h6.8c.3 0 .4.1.4.4v2.7c0 .3-.1.4-.4.4h-10c-.2 0-.4-.2-.4-.4v-20.9c0-.3.2-.4.4-.4h10c.3 0 .4.2.4.4v2.6zM70.8 345c.3 0 .4.2.4.4v20.9c0 .3-.2.4-.4.4h-2.7c-.2 0-.4-.1-.5-.4l-4.2-11.6h-.1v11.6c0 .3-.1.4-.4.4h-2.8c-.3 0-.4-.2-.4-.4v-20.9c0-.3.2-.4.4-.4h2.7c.2 0 .4.1.5.4l4.1 11.6h.2v-11.5c0-.3.1-.4.4-.4h2.8zM83.9 345c.3 0 .4.2.4.4v2.7c0 .3-.1.4-.4.4h-3.2v17.8c0 .3-.1.4-.4.4h-2.8c-.3 0-.4-.1-.4-.4v-17.8h-3.2c-.3 0-.4-.2-.4-.4v-2.7c0-.3.2-.4.4-.4h10zM97.2 348.2c0 .3-.1.5-.4.5H90v5.5h5.2c.3 0 .4.2.4.5v2.7c0 .3-.2.5-.4.5H90v5.5h6.8c.3 0 .4.1.4.4v2.7c0 .3-.1.4-.4.4h-10c-.2 0-.4-.2-.4-.4v-20.9c0-.3.2-.4.4-.4h10c.3 0 .4.2.4.4v2.6zM110.8 355.6c0 1.8-.7 3-2 3.6l1.9 7.1c.1.3-.1.5-.4.5h-2.8c-.3 0-.4-.1-.5-.4l-1.8-6.9h-1.9v6.9c0 .3-.2.4-.4.4H100c-.3 0-.4-.2-.4-.4v-20.9c0-.3.2-.4.4-.4h6.8c2.6 0 3.9 1.4 3.9 3.9v6.6zm-4.8.3c.7 0 1.1-.4 1.1-1.1v-5.1c0-.7-.4-1.1-1.1-1.1h-2.7v7.3h2.7zM123.5 345c.3 0 .4.2.4.4v2.7c0 .3-.1.4-.4.4h-3.2v17.8c0 .3-.1.4-.4.4H117c-.3 0-.4-.1-.4-.4v-17.8h-3.2c-.3 0-.4-.2-.4-.4v-2.7c0-.3.2-.4.4-.4h10.1zM133.9 366.9c-.2 0-.4-.1-.4-.4l-.8-4h-4.9l-.7 4c-.1.2-.2.4-.4.4h-2.9c-.3 0-.4-.2-.4-.5l4.5-21c.1-.3.2-.4.5-.4h3.8c.2 0 .4.1.5.4l4.5 21c.1.3-.1.5-.4.5h-2.9zm-3.6-17.1l-1.7 9.5h3.5l-1.8-9.5zM142.9 345c.3 0 .4.2.4.4v20.9c0 .3-.2.4-.4.4h-2.8c-.3 0-.4-.2-.4-.4v-20.9c0-.3.1-.4.4-.4h2.8zM157.3 345c.3 0 .4.2.4.4v20.9c0 .3-.2.4-.4.4h-2.7c-.2 0-.4-.1-.5-.4l-4.2-11.6h-.1v11.6c0 .3-.1.4-.4.4h-2.8c-.3 0-.4-.2-.4-.4v-20.9c0-.3.2-.4.4-.4h2.7c.2 0 .4.1.5.4l4.1 11.6h.2v-11.5c0-.3.1-.4.4-.4h2.8zM175.4 345c.4 0 .5.2.5.5v20.7c0 .4-.2.5-.5.5h-2.5c-.4 0-.5-.2-.5-.5V354h-.2l-2.7 12.3c-.1.3-.3.5-.6.5h-1.3c-.3 0-.5-.2-.6-.5l-2.7-12.3h-.3v12.3c0 .4-.2.5-.5.5H161c-.4 0-.5-.2-.5-.5v-20.7c0-.4.2-.5.5-.5h3.6c.3 0 .5.2.6.5l3 13.6 3-13.6c.1-.3.3-.5.6-.5h3.6zM189.6 348.2c0 .3-.1.5-.4.5h-6.8v5.5h5.2c.3 0 .4.2.4.5v2.7c0 .3-.2.5-.4.5h-5.2v5.5h6.8c.3 0 .4.1.4.4v2.7c0 .3-.1.4-.4.4h-10c-.2 0-.4-.2-.4-.4v-20.9c0-.3.2-.4.4-.4h10c.3 0 .4.2.4.4v2.6zM203.5 345c.3 0 .4.2.4.4v20.9c0 .3-.2.4-.4.4h-2.7c-.2 0-.4-.1-.5-.4l-4.2-11.6h-.1v11.6c0 .3-.1.4-.4.4h-2.8c-.3 0-.4-.2-.4-.4v-20.9c0-.3.2-.4.4-.4h2.7c.2 0 .4.1.5.4l4.1 11.6h.2v-11.5c0-.3.1-.4.4-.4h2.8zM216.6 345c.3 0 .4.2.4.4v2.7c0 .3-.1.4-.4.4h-3.2v17.8c0 .3-.1.4-.4.4h-2.8c-.3 0-.4-.1-.4-.4v-17.8h-3.2c-.3 0-.4-.2-.4-.4v-2.7c0-.3.2-.4.4-.4h10z"/> </g>
							</g>
						</svg>

						<div className="footer-contact">
							<p className="title">Let's talk?</p>
							<div className="skype">
								<svg height="512" viewBox="0 0 24 24" width="512" xmlns="http://www.w3.org/2000/svg"><path d="m23.309 14.547c1.738-7.81-5.104-14.905-13.139-13.543-4.362-2.707-10.17.352-10.17 5.542 0 1.207.333 2.337.912 3.311-1.615 7.828 5.283 14.821 13.311 13.366.936.495 2.004.777 3.139.777 4.949 0 8.118-5.133 5.947-9.453zm-11.213 5.332c-2.342 0-4.63-.565-5.984-2.499-2.018-2.854.643-4.282 1.949-3.194 1.09.919.748 3.142 3.949 3.142 1.411 0 3.153-.602 3.153-2.001 0-2.815-6.245-1.483-8.728-4.552-.912-1.124-1.084-3.107.036-4.545 1.952-2.512 7.68-2.665 10.143-.768 2.274 1.76 1.66 4.096-.175 4.096-2.207 0-1.047-2.888-4.61-2.888-2.583 0-3.599 1.837-1.78 2.731 2.421 1.202 8.75.827 8.75 5.603-.008 3.357-3.247 4.875-6.703 4.875z" fill="#03a9f4"/></svg>
								<p className="text">deckmrcharliemartin</p>
							</div>
						</div>

						<div className="footer-contact">
							<a href="mailto:carlos.martin@gmail.com" className="email">carlos.martin@gmail.com</a>
						</div>
					</div>
				</footer>
			</div>
		);
	}
}