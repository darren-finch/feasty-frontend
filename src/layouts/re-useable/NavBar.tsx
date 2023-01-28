import * as React from "react"
import { Button, Container, Nav, Navbar, NavItem } from "react-bootstrap"
import { NavLink } from "react-router-dom"

interface NavBarProps {
	loggedIn: boolean
}

const NavBar: React.FC<NavBarProps> = (props) => {
	const [navbarOpen, setNavBarOpen] = React.useState<boolean>(false)
	const { loggedIn } = props

	return (
		<Navbar bg="light" expand="lg">
			<Container>
				<NavLink className="navbar-brand text-primary" to="/mealplan">
					Feasty
				</NavLink>
				<div className="d-flex d-lg-none flex-grow-1 justify-content-end">
					{loggedIn ? (
						<div className="d-flex gap-3 gap-sm-4">
							<div style={{ fontSize: "1.5rem" }} className="bi bi-person-circle"></div>
							<div style={{ fontSize: "1.5rem" }} className="bi bi-gear-fill"></div>
							<Button>Log Out</Button>
						</div>
					) : (
						<Button>Log In</Button>
					)}
				</div>
				{/* Using vanilla bootstrap button here because of the custom styling we are doing. */}
				<button
					className={`ms-4 navbar-toggler${navbarOpen ? " active" : ""}`}
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbar-nav-collapse"
					aria-controls="navbar-nav-collapse"
					aria-expanded="false"
					aria-label="Toggle navigation"
					onClick={() => setNavBarOpen(!navbarOpen)}>
					<span className="icon-bar"></span>
					<span className="icon-bar"></span>
					<span className="icon-bar"></span>
				</button>
				<Navbar.Collapse id="navbar-nav-collapse">
					<Nav className="justify-content-center flex-grow-1 my-2 mb-lg-0">
						<NavItem>
							<NavLink className="nav-link" to="/mealplan">
								My Meal Plan
							</NavLink>
						</NavItem>
						<NavItem>
							<NavLink className="nav-link" to="/meals">
								My Meals
							</NavLink>
						</NavItem>
						<NavItem>
							<NavLink className="nav-link" to="/foods">
								My Foods
							</NavLink>
						</NavItem>
					</Nav>
					<div className="d-none d-lg-block">
						{loggedIn ? (
							<div className="d-flex gap-4">
								<div style={{ fontSize: "1.5rem" }} className="bi bi-person-circle"></div>
								<div style={{ fontSize: "1.5rem" }} className="bi bi-gear-fill"></div>
								<Button>Log Out</Button>
							</div>
						) : (
							<Button>Log In</Button>
						)}
					</div>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	)
}

export default NavBar
