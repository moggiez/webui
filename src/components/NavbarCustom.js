import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Link from "next/link";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Dropdown from "react-bootstrap/Dropdown";
import { useAuth } from "util/auth.js";
import { useRouter } from "next/router";

function NavbarCustom(props) {
  const auth = useAuth();
  const router = useRouter();

  return (
    <Navbar bg={props.bg} variant={props.variant} expand={props.expand}>
      <Container>
        <Link href="/" passHref={true}>
          <Navbar.Brand>
            <img
              className="d-inline-block align-top"
              src={props.logo}
              alt="Moggies.io Logo"
              height="30"
            />
          </Navbar.Brand>
        </Link>

        <Navbar.Toggle aria-controls="navbar-nav" className="border-0" />
        <Navbar.Collapse id="navbar-nav" className="justify-content-end">
          <Nav activeKey="/run">
            {auth.user && (
              <>
                <Nav.Link href="/run" passHref={true}>
                  Run
                </Nav.Link>
                <Nav.Link href="/playbooks/all" passHref={true}>
                  Playbooks
                </Nav.Link>
                <Nav.Link href="/tests/all" passHref={true}>
                  Tests
                </Nav.Link>
                <Nav.Link href="/domains" passHref={true}>
                  Domains
                </Nav.Link>

                <NavDropdown id="dropdown" title="Account" alignRight={true}>
                  <Link href="/settings/general" passHref={true}>
                    <NavDropdown.Item active={false}>Settings</NavDropdown.Item>
                  </Link>

                  <Dropdown.Divider />

                  <Link href="/auth/signout" passHref={true}>
                    <NavDropdown.Item
                      active={false}
                      onClick={(e) => {
                        e.preventDefault();
                        auth
                          .signout()
                          .then(() => router.push(props.signoutRoute));
                      }}
                    >
                      Sign out
                    </NavDropdown.Item>
                  </Link>
                </NavDropdown>
              </>
            )}

            {!auth.user && (
              <>
                <Nav.Item>
                  <Link href="/run" passHref={true}>
                    <Nav.Link active={false}>Dashboard</Nav.Link>
                  </Link>
                </Nav.Item>
                <Nav.Item>
                  <Link href="/auth/signin" passHref={true}>
                    <Nav.Link active={false}>Sign in</Nav.Link>
                  </Link>
                </Nav.Item>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarCustom;
