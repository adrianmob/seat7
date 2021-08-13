import React, { Component } from 'react';
import api from '../../services/api';

import LandingPageT1 from '../../components/themes/theme-1/body-lp';


export default class LandingPagePreview extends Component {
	state = {
		company_id: 0,
		project_id: 0,
		project_title: "",
		company_name: "",
		company_description: "",
		logo_src: "",
		banner_title: "",
		banner_description: "",
		banner_src: "",
		links: [],
		loadingPage: true
	}

	componentDidMount() {
		//if page reloads without close any modal
		document.querySelector('body').classList.remove("no-scroll");

		const company_id = this.props.match.params.company_id;
		const project_id = this.props.match.params.project_id;
		this.setState({ company_id, project_id });
		this.loadApiProject(company_id, project_id);
	}

	loadApiProject = async (company_id, project_id) => {
		document.body.scrollTop = 0;
		document.documentElement.scrollTop = 0;

		try {
			const response = await api.get(`companies/${company_id}/projects/${project_id}`);
			const response2 = await api.get(`companies/${company_id}/projects/${project_id}/banner`);
			const response3 = await api.get(`companies/${company_id}/projects/${project_id}/files`);

			this.setState({
				company_name: response.data.company_name,
				company_description: response.data.company_description,
				banner_title: response2.data.title,
				banner_description: response2.data.description,
				links: response3.data,
				loadingPage: false
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
			console.log(error);
		}
	}

	render() {
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
				loadingPage={this.state.loadingPage}
				isPreview={true}
				logo={logo}
				banner={banner}
				bannerTitle={this.state.banner_title}
				bannerText={this.state.banner_description}
				companyName={this.state.company_name}
				aboutCompany={this.state.company_description}
				links={this.state.links}
				companyId={this.state.company_id}
				projectId={this.state.project_id}
			/>
		)
	};
}