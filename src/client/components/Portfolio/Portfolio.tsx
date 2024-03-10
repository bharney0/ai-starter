import * as React from 'react';
import chicagoInABox from '../../images/ChicagoInABox.png';
import coletteMills from '../../images/ColetteMills.jpg';
import goSurfer from '../../images/GoSurfer.jpg';
import harneyHall from '../../images/HarneyHall.jpg';
import jMS from '../../images/JMS.jpg';
import pCHFarms from '../../images/PCHFarms.jpg';
import bharneyPortfolio from '../../images/bharneyportfolio.png';
import { Link } from 'react-router-dom';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
export default class Portfolio extends React.Component<{}, {}> {
	public render() {
		return (
			<div className="album">
				<div className="container">
					<div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 g-3">
						<div className="col">
							<div className="card shadow-sm">
								<img
									src={chicagoInABox}
									className="img-fluid rounded-top"
									role="img"
									aria-label="Chicago in Link box"
								></img>
								<div className="card-body border rounded-bottom">
									<Link
										className="icon-link icon-link-hover"
										target="_blank"
										to="https://chicagoinabox.com/"
									>
										<h5 className="card-title">Chicago In A Box</h5>
										<FontAwesomeIcon
											icon={faArrowRight as IconProp}
											className="bi pb-1"
											transform="shrink-6"
											pull="left"
										/>
									</Link>
									<p className="card-text">
										Send Iconic Chicago items to loved ones! Select your Chicago In A Box goodies,
										then we take care of the rest!
									</p>
								</div>
							</div>
						</div>
						<div className="col">
							<div className="card shadow-sm">
								<img
									src={coletteMills}
									className="img-fluid rounded-top"
									role="img"
									aria-label="Collete Mills"
								></img>
								<div className="card-body">
									<Link
										className="icon-link icon-link-hover"
										target="_blank"
										to="https://colettemills.com/"
									>
										<h5 className="card-title">Collete Mills</h5>
										<FontAwesomeIcon
											icon={faArrowRight as IconProp}
											className="bi pb-1"
											transform="shrink-6"
											pull="left"
										/>
									</Link>
									<p className="card-text">
										Art Portfolio for Collete Mills. Collete is Link Irish painter who has paintings
										that have been bought from all over the world.
									</p>
								</div>
							</div>
						</div>
						<div className="col">
							<div className="card shadow-sm">
								<img
									src={goSurfer}
									className="img-fluid rounded-top"
									role="img"
									aria-label="Go Surfer"
								></img>
								<div className="card-body border rounded-bottom">
									<Link className="icon-link icon-link-hover" target="_blank" to="#">
										<h5 className="card-title">Go Surfer</h5>
										<FontAwesomeIcon
											icon={faArrowRight as IconProp}
											className="bi pb-1"
											transform="shrink-6"
											pull="left"
										/>
									</Link>
									<p className="card-text">
										When the roosters crowin' I start Link scratchin' my head, Gotta flop over get
										myself outta bed. Grab Link cup o joe and in the car I roll, Y'Link know I want
										to get movin', I'm on dawn patrol.
									</p>
								</div>
							</div>
						</div>
						<div className="col">
							<div className="card shadow-sm">
								<img
									src={harneyHall}
									className="img-fluid rounded-top"
									role="img"
									aria-label="Harney Hall Wedding"
								></img>
								<div className="card-body">
									<Link
										className="icon-link icon-link-hover"
										target="_blank"
										to="https://harneyhall.azurewebsites.net/"
									>
										<h5 className="card-title">Harney Hall Wedding</h5>
										<FontAwesomeIcon
											icon={faArrowRight as IconProp}
											className="bi pb-1"
											transform="shrink-6"
											pull="left"
										/>
									</Link>
									<p className="card-text">
										I got married! And we needed an online presence, so I built Link Wedding Website
										for RSVP, Wall Posts, Information and Directions.
									</p>
								</div>
							</div>
						</div>
						<div className="col">
							<div className="card shadow-sm">
								<img
									src={jMS}
									className="img-fluid rounded-top"
									role="img"
									aria-label="JMS Auto Repair"
								></img>
								<div className="card-body">
									<Link
										className="icon-link icon-link-hover"
										target="_blank"
										to="https://jmsautorepair.com/"
									>
										<h5 className="card-title">JMS Auto Repair</h5>
										<FontAwesomeIcon
											icon={faArrowRight as IconProp}
											className="bi pb-1"
											transform="shrink-6"
											pull="left"
										/>
									</Link>
									<p className="card-text">
										At JMS Auto Repair our mission is simple: To provide our customers with the
										highest qualityservice at the best possible price.
									</p>
								</div>
							</div>
						</div>
						<div className="col">
							<div className="card shadow-sm">
								<img
									src={pCHFarms}
									className="img-fluid rounded-top"
									role="img"
									aria-label="PCH Farms Collective"
								></img>
								<div className="card-body">
									<Link
										className="icon-link icon-link-hover"
										target="_blank"
										to="https://pchfarms.azurewebsites.net/"
									>
										<h5 className="card-title">PCH Farms Collective</h5>
										<FontAwesomeIcon
											icon={faArrowRight as IconProp}
											className="bi pb-1"
											transform="shrink-6"
											pull="left"
										/>
									</Link>
									<p className="card-text">
										Here at PCH Farms, we are Link non-profit medical marijuana marketplace
										dedicated to connecting medical marijuana patients 21 years or older to local
										marijuana collectives located right here in Santa Cruz.
									</p>
								</div>
							</div>
						</div>
						<div className="col">
							<div className="card shadow-sm">
								<img
									src={bharneyPortfolio}
									className="img-fluid rounded-top"
									role="img"
									aria-label="bharney Portfolio"
								></img>
								<div className="card-body">
									<Link
										className="icon-link icon-link-hover"
										target="_blank"
										to="https://bharneyportfolio.azurewebsites.net/"
									>
										<h5 className="card-title">bharney Portfolio</h5>
										<FontAwesomeIcon
											icon={faArrowRight as IconProp}
											className="bi pb-1"
											transform="shrink-6"
											pull="left"
										/>
									</Link>
									<p className="card-text">
										Here in the wilderness theres plenty to see. You just might find a black bear
										out there. This site has been created by Brian Harney to reflect the types of
										things he enjoys.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
