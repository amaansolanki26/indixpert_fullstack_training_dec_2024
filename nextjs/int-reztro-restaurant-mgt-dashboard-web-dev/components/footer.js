import {
  Facebook,
  TwitterX,
  Instagram,
  Youtube,
  Linkedin
} from "react-bootstrap-icons";

export default function Footer() {
  return (
    <footer className="py-3">
      <div className="container-fluid px-4">

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 text-center text-md-start">

          {/* Left Side */}
          <div className="d-flex flex-column flex-md-row align-items-center gap-3 small w-100">

            {/* Copyright */}
            <span className="text-muted">
              Copyright © 2026 Indixpert
            </span>

            {/* Links (single line on mobile) */}
            <div className="d-flex flex-row flex-wrap justify-content-center align-items-center gap-3">

              <a href="#" className="text-secondary text-decoration-none">
                Privacy Policy
              </a>

              <a href="#" className="text-secondary text-decoration-none">
                Terms and Conditions
              </a>

              <a href="#" className="text-secondary text-decoration-none">
                Contact
              </a>

            </div>

          </div>

          {/* Social Icons */}
          <div className="d-flex gap-3">

            <a href="#"><Facebook size={16} className="text-secondary" /></a>
            <a href="#"><TwitterX size={16} className="text-secondary" /></a>
            <a href="#"><Instagram size={16} className="text-secondary" /></a>
            <a href="#"><Youtube size={16} className="text-secondary" /></a>
            <a href="#"><Linkedin size={16} className="text-secondary" /></a>

          </div>

        </div>

      </div>
    </footer>
  );
}