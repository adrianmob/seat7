import React, { Component } from 'react';
import { Markup } from 'interweave';

export default class EmailPreview extends Component {
	componentDidMount() {
	}

	render() {
		return (
			<div data-component="email-preview">
				<table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
					{/* <tr>
						<td align="center" bgcolor="#0056a7" className="thead">
							<div target="_blank">
								<img src="https://seat7-emails.s3.amazonaws.com/logo-white.png" alt="Seat 7 Entertainment" width="120" height="170" />
							</div>
						</td>
					</tr> */}
					<tr>
						<td align="center" bgcolor="#ffffff" className="tbody">
							<p className="email-text">
								{ this.props.message !== "" &&
									<Markup content={this.props.message} />
								}
								{ this.props.message === "" &&
									"This email is without a message"
								}
							</p>
							<br />
							<br />
							<p className="email-text center">
								<strong>Access the project through the link below:</strong>
							</p>
							<br />
							<div target="_blank" className="btn-link">Access</div>
						</td>
					</tr>
					<tr>
						<td bgcolor="#ffffff" className="tfoot">
							<table border="0" cellpadding="0" cellspacing="0" width="100%">
								<tr>
									<td width="140px">
										<div target="_blank">
											<img src="https://seat7-emails.s3.amazonaws.com/email-logo.png" className="tfoot-logo" alt="Seat 7 Entertainment" />
										</div>
									</td>
									<td width="260px">
										<p className="tfoot-title-small">Let's Talk?</p>
										<p className="tfoot-title">Carlos Martin</p>
										
										<table border="0" cellpadding="0" cellspacing="0" width="100%">
											<tr>
												<td className="skype">
													<img src="https://seat7-emails.s3.amazonaws.com/email-icon.png" alt="skype" className="email-img" />
													<p className="email-text d-ib blue-text">deckmrcharliemartin</p>
												</td>
											</tr>
											<tr>
												<td className="skype">
													<img src="https://seat7-emails.s3.amazonaws.com/skype.png" alt="skype" className="skype-img" />
													<p className="email-text d-ib blue-text">deckmrcharliemartin</p>
												</td>
											</tr>
										</table>
									</td>
									<td width="200px">
									</td>
								</tr>
							</table>
						</td>
					</tr>
				</table>
			</div>
		)
	};
}