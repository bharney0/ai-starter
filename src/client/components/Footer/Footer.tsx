import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';

export default class Footer extends React.Component<{}, {}> {
	public render() {
		return (
			<footer className="container text-center">
				<hr />
				<div className="row">
					<div className="col">
						<p>
							Made with{' '}
							<FontAwesomeIcon
								className="svg-inline--fa fa-w-16 fa-lg"
								icon={faHeart as IconProp}
								size="1x"
							/>{' '}
							by Brian Harney
						</p>
					</div>
				</div>
			</footer>
		);
	}
}
