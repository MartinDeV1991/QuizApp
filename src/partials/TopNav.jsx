import React from "react";
import { Container, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";

export default function TopNav() {

	return (
		<Navbar bg="primary" data-bs-theme="dark">
			<Container>
				<Navbar.Brand href="/">Quiz app</Navbar.Brand>
				<Nav className="me-auto">
					<LinkContainer to={"/"}>
						<Nav.Link>Home</Nav.Link>
					</LinkContainer>
					<LinkContainer to={"/quiz"}>
						<Nav.Link>Quiz</Nav.Link>
					</LinkContainer>
				</Nav>
			</Container>
		</Navbar>
	);
}
