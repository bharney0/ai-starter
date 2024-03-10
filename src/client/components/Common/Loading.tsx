import * as React from 'react';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

class Loading extends React.Component<{}, {}> {
	public render() {
		return (
			<div className="container pt-4" style={{ height: '70vh' }}>
				<FontAwesomeIcon
					className="svg-inline--fa fa-w-16 fa-lg"
					size="1x"
					style={{
						position: 'absolute',
						top: '7vh',
						left: '50%',
						fontSize: '45px'
					}}
					icon={faSpinner as IconProp}
					spin
				/>
			</div>
		);
	}
}

export default Loading;
