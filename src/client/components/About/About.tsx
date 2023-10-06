import * as React from 'react';

export default class About extends React.Component<{}, {}> {
	public render() {
		return (
			<div>
				<h1>Hey there stranger!</h1>
				<p>
					My name is Brian Harney and I love building incredible software. Our increasingly
					connected world demands services that are resiliant, fast, and always available. We've has
					been raising our expectations about web applications, and rethinking how we share code and
					ideas. But sometimes it can be difficult to understand all of the new technology because
					the web has been changing at a mile a minute. I want to show you some of the things I've
					learned in my own experiences building applications. I hope that these writings may help
					you in your search for an answers/solutions to your own problems.
				</p>
			</div>
		);
	}
}
