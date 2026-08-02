import React, { useState, useEffect } from "react";
import axios from "axios";
import { Navbar, Nav, Form, FormControl, Button } from "react-bootstrap";

function EduNavbar() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8080/api/courses").then(res => setCourses(res.data));
  }, []);

  const filtered = courses.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Navbar bg="light" expand="lg" fixed="top">
      <Navbar.Brand href="#home">
        <img src="logo.png" alt="EduLearn" width="40" /> EduLearn
      </Navbar.Brand>
      <Nav className="me-auto">
        <Nav.Link href="#home">Home</Nav.Link>
        <Nav.Link href="#about">About</Nav.Link>
        <Nav.Link href="#courses">Courses</Nav.Link>
      </Nav>
      <Form className="d-flex">
        <FormControl
          type="search"
          placeholder="What do you want to learn?"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <div className="dropdown-menu show">
            {filtered.map(c => (
              <div key={c.id} className="dropdown-item">{c.name}</div>
            ))}
          </div>
        )}
      </Form>
      <Button variant="outline-primary" className="ms-2">Login</Button>
      <Button variant="primary" className="ms-2">Signup</Button>
    </Navbar>
  );
}

export default EduNavbar;
