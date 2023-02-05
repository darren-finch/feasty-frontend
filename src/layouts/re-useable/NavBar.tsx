import { useAuth0 } from "@auth0/auth0-react"
import * as React from "react"
import { Button, Container, Nav, Navbar, NavItem } from "react-bootstrap"
import { NavLink } from "react-router-dom"

const NavBar: React.FC = () => {
	const { logout, user } = useAuth0()
	const [navbarOpen, setNavBarOpen] = React.useState<boolean>(false)

	return (
		<Navbar bg="light" expand="lg">
			<Container>
				<NavLink className="navbar-brand text-primary" to="/mealplan">
					Feasty
				</NavLink>
				<div className="d-flex d-lg-none flex-grow-1 justify-content-end">
					<div className="d-flex align-items-center gap-3 gap-sm-4">
						<img
							style={{ width: "32px", height: "32px" }}
							className="rounded-circle"
							src={user?.picture}
							alt="Profile picture"
						/>
						{/* <div style={{ fontSize: "1.5rem" }} className="bi bi-person-circle"></div> */}
						<div style={{ fontSize: "1.5rem" }} className="bi bi-gear-fill"></div>
						<Button onClick={() => logout()}>Log Out</Button>
					</div>
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
						<div className="d-flex align-items-center gap-4">
							<img
								style={{ width: "32px", height: "32px" }}
								className="rounded-circle"
								src={user?.picture}
								alt="Profile picture"
							/>
							{/* <div style={{ fontSize: "1.5rem" }} className="bi bi-person-circle"></div> */}
							<div style={{ fontSize: "1.5rem" }} className="bi bi-gear-fill"></div>
							<Button onClick={() => logout()}>Log Out</Button>
						</div>
					</div>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	)
}

export default NavBar
