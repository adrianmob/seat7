import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import api from '../../services/api';

import LandingPageT1 from '../../components/themes/theme-1/body-lp';

export default class LandingPage extends Component {
	state = {
		token_id: 0,
		project_id: 0,
		project_title: "",
		company_name: "",
		company_description: "",
		logo_src: "",
		banner_title: "",
		banner_description: "",
		banner_src: "",
		links: [],
		expired_token: false,
		project_type: ""
	}

	componentDidMount() {
		//if page reloads without close any modal
		document.querySelector('body').classList.remove("no-scroll");

		const project_id = this.props.match.params.project_id;
		const token_id = this.props.match.params.token_id;
		this.setState({ token_id, project_id });
		this.loadApiProject(token_id, project_id);
	}

	loadApiProject = async (token_id, project_id) => {
		document.body.scrollTop = 0;
		document.documentElement.scrollTop = 0;

		try {
			const config = {
				headers: {
					'x-project-list-contact': token_id
				}
			}

			const response = await api.get(`projects/${project_id}`, config);
			const response2 = await api.get(`projects/${project_id}/banner`, config);
			const response3 = await api.get(`projects/${project_id}/submission-list-files`, config);

			console.log(response.data.project_type);

			this.setState({
				confidentiality: response.data.project_type === "finished" ? false : true,
				project_type: response.data.project_type,
				company_name: response.data.company_name,
				company_description: response.data.company_description,
				banner_title: response2.data.title,
				banner_description: response2.data.description,
				links: response3.data
			});

			if(response.data.logo_url) {
				this.setState({
					logo_src: 'https://seat7-uploads.s3.amazonaws.com/'+response.data.logo_url,
				})
			}

			if(response2.data.image_url) {
				this.setState({
					banner_src: 'https://seat7-uploads.s3.amazonaws.com/'+response2.data.image_url,
				})
			}
		} catch (error) {
			console.log("expired token" + error);
			this.setState({
				expired_token: true
			})
		}
	}

	modalConfidentiality = (status) => {
		this.setState({modal_confidentiality: status});
	}

	render() {
		if (this.state.expired_token) {
			return <Redirect to='/without-permission' />
		}

		let logo;
		if(this.state.logo_src) {
			logo = <img src={this.state.logo_src} alt={this.state.company_name}/>
		} else {
			logo = <img src="https://via.placeholder.com/200x60?text=Logo" alt={this.state.company_name}/>
		}

		let banner;
		if(this.state.banner_src) {
			banner = <img src={this.state.banner_src} alt={this.state.banner_title}/>
		}

		return (
			<LandingPageT1
				project_type={this.state.project_type}
				modalConfidentiality={this.state.confidentiality}
				logo={logo}
				banner={banner}
				bannerTitle={this.state.banner_title}
				bannerText={this.state.banner_description}
				companyName={this.state.company_name}
				aboutCompany={this.state.company_description}
				links={this.state.links}
				projectId={this.state.project_id}
			/>
		)
	};
}