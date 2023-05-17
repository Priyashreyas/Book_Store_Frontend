import React from 'react';
import './UserDetails.scss'
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";

const UserDetails = ({item}) => {
  if (item) {
    return (
      <div className={"userDetails"}>
        <div className="item">
          <BadgeOutlinedIcon/>
          <input type="text"
                 id="firstName"
                 ref={item.firstNameReference}
                 autoComplete="off"
                 onChange={(e) => item.setFirstName(e.target.value)}
                 value={item.firstName}
                 placeholder="Enter first name"
                 required
          />
          <input type="text"
                 id="lastName"
                 ref={item.lastNameReference}
                 autoComplete="off"
                 onChange={(e) => item.setLastName(e.target.value)}
                 value={item.lastName}
                 placeholder="Enter last name"
                 required
          />
        </div>
        <div className="item">
          <PersonOutlineIcon/>
          <input type="text"
                 id="username"
                 ref={item.usernameReference}
                 autoComplete="off"
                 onChange={(e) => item.setUsername(e.target.value)}
                 value={item.username}
                 placeholder="Enter username"
                 required
          />
        </div>
        <div className="item">
          <EmailOutlinedIcon/>
          <input type="text"
                 id="email"
                 ref={item.emailReference}
                 autoComplete="off"
                 onChange={(e) => item.setEmail(e.target.value)}
                 value={item.email}
                 placeholder="Enter email address"
                 required
          />
        </div>
        <div className="item">
          <LocalPhoneOutlinedIcon/>
          <input type="text"
                 id="phone"
                 ref={item.phoneReference}
                 autoComplete="off"
                 onChange={(e) => item.setPhone(e.target.value)}
                 value={item.phone}
                 placeholder="Enter phone number"
          />
        </div>
      </div>
    )
  } else {
    return <div>Loading...</div>
  }
}
export default UserDetails;
