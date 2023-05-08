import { Nav, NavItem } from "react-bootstrap"
import { NavLink } from "react-router-dom"

const Footer = () => {
	return (
		<footer className="d-none d-md-block w-100 bg-light">
			<div className="container d-flex flex-column align-items-center justify-content-center my-3">
				<NavLink className="pb-2 navbar-brand text-primary" to="/mealplan">
					Feasty
				</NavLink>
				<Nav className="pt-2 nav text-muted border-top">
					<NavItem>
						<NavLink className="nav-link text-muted" to="/mealplan">
							My Meal Plan
						</NavLink>
					</NavItem>
					<NavItem>
						<NavLink className="nav-link text-muted" to="/meals">
							My Meals
						</NavLink>
					</NavItem>
					<NavItem>
						<NavLink className="nav-link text-muted" to="/foods">
							My Foods
						</NavLink>
					</NavItem>
				</Nav>
			</div>
		</footer>
	)
}

export default Footer
