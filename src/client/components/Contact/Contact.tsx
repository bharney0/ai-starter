import * as React from 'react';
export default class Contact extends React.Component<{}, {}> {
	public render() {
		return (
			<React.Fragment>
				<div className="p-5 mb-4 rounded-3">
					<div className="container-fluid py-5">
						<div className="col text-center">
							<h1 className="display-5 fw-bold">Have questions for me?</h1>
							<p className="fs-3">Feel free to reach out using my information below.</p>
							<ShowInfo />
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

const ShowInfo = () => {
	const [showInfo, setShowInfo] = React.useState(false);
	return (
		<React.Fragment>
			<button className="btn btn-secondary" type="button" onClick={e => setShowInfo(!showInfo)}>
				{showInfo ? 'Hide Info' : 'Show Info'}
			</button>
			{showInfo ? (
				<ul className="list-unstyled fs-4">
					<li>
						<a className="text-white" href="mailto:bharney0@gmail.com">
							bharney0@gmail.com
						</a>
					</li>
				</ul>
			) : (
				''
			)}
		</React.Fragment>
	);
};
