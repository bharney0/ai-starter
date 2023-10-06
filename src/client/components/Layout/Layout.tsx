import * as React from 'react';
import { NavContext } from '../../App';
import { ApplicationState } from '../../store/index';
import * as AccountState from '../../store/Account';
import * as AlertState from '../../store/Alert';
import * as SessionState from '../../store/Session';
import AdminSliderMenu from '../Slider/AdminSliderMenu';
import MemberSliderMenu from '../Slider/MemberSliderMenu';
import { SliderMenu } from '../Slider/SliderMenu';
import Alert from './AlertComponent';
import { MouseEventHandler } from 'react';

interface NavProps {
	on: boolean;
	handleOverlayToggle: (e: Event) => void;
}

type LayoutProps = ApplicationState & {
	accountActions: typeof AccountState.actionCreators;
	sessionActions: typeof SessionState.actionCreators;
	alertActions: typeof AlertState.default.actionCreators;
} & any;

export class Layout extends React.Component<LayoutProps, {}> {
	public render() {
		return (
			<NavContext.Consumer>
				{({ on, handleOverlayToggle }: NavProps) => (
					<React.Fragment>
						<main
							onClick={e => handleOverlayToggle(e as any)}
							className={`container ${on ? ' overlay' : ''}`}
						>
							<Alert {...this.props} />
							<div
								id="slider"
								className={`row row-offcanvas row-offcanvas-right content ${on ? ' active' : ''}`}
							>
								<div className="col-12 col-md-12 col-lg-9">{this.props.children}</div>
								<div id="sidebar" className="col-8 col-md-0 col-lg-3 sidebar-offcanvas">
									<div className="list-group">
										<SliderMenu />
										{/* <MemberSliderMenu {...this.props} />
										<AdminSliderMenu {...this.props} /> */}
									</div>
								</div>
							</div>
						</main>
					</React.Fragment>
				)}
			</NavContext.Consumer>
		);
	}
}

export default Layout;
