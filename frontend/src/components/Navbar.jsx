import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { MdKeyboardArrowDown } from "react-icons/md";
import "../stylesheets/navbar.scss";

function Navbar() {
  return (
    <div className="navbar-container">
      <div className="name">Meedle</div>
      <div className="search-tab">
        <AiOutlineSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search for photos, images, and more ..."
        />
      </div>
      <div className="navbar-items">
        <div>
          Home
          <MdKeyboardArrowDown />
        </div>
        <div>
          Newsfeed
          <MdKeyboardArrowDown />
        </div>
        <div>
          Timeline
          <MdKeyboardArrowDown />
        </div>
        <div>
          All Pages
          <MdKeyboardArrowDown />
        </div>
        <div>
          Contact
          <MdKeyboardArrowDown />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
