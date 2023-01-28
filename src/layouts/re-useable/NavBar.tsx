import * as React from "react"
import { NavLink } from "react-router-dom"

interface NavBarProps {
	loggedIn: boolean
}

const NavBar: React.FC<NavBarProps> = (props) => {
	const [navbarOpen, setNavBarOpen] = React.useState<boolean>(false)
	const { loggedIn } = props

	return (
		<nav className="navbar navbar-expand-lg bg-light">
			<div className="container">
				<NavLink className="navbar-brand text-primary" to="/mealplan">
					Feasty
				</NavLink>
				<div className="d-flex d-lg-none flex-grow-1 justify-content-end">
					{loggedIn ? (
						<div className="d-flex gap-3 gap-sm-4">
							<div style={{ fontSize: "1.5rem" }} className="bi bi-person-circle"></div>
							<div style={{ fontSize: "1.5rem" }} className="bi bi-gear-fill"></div>
							<button className="btn btn-primary">Log Out</button>
						</div>
					) : (
						<button className="btn btn-primary">Log In</button>
					)}
				</div>
				<button
					className={`ms-4 navbar-toggler${navbarOpen ? " active" : ""}`}
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarSupportedContent"
					aria-controls="navbarSupportedContent"
					aria-expanded="false"
					aria-label="Toggle navigation"
					onClick={() => setNavBarOpen(!navbarOpen)}>
					<span className="icon-bar"></span>
					<span className="icon-bar"></span>
					<span className="icon-bar"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarSupportedContent">
					<ul className="navbar-nav justify-content-center flex-grow-1 my-2 mb-lg-0">
						<li className="nav-item">
							<NavLink className="nav-link" to="/mealplan">
								My Meal Plan
							</NavLink>
						</li>
						<li className="nav-item">
							<NavLink className="nav-link" to="/meals">
								My Meals
							</NavLink>
						</li>
						<li className="nav-item">
							<NavLink className="nav-link" to="/foods">
								My Foods
							</NavLink>
						</li>
					</ul>
					<div className="d-none d-lg-block">
						{loggedIn ? (
							<div className="d-flex gap-4">
								<div style={{ fontSize: "1.5rem" }} className="bi bi-person-circle"></div>
								<div style={{ fontSize: "1.5rem" }} className="bi bi-gear-fill"></div>
								<button className="btn btn-primary">Log Out</button>
							</div>
						) : (
							<button className="btn btn-primary">Log In</button>
						)}
					</div>
				</div>
			</div>
		</nav>
	)
}

export default NavBar
