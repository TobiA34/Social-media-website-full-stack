import React from 'react'
import { Link } from 'react-router-dom';
function NavigationBar() {
  return (
    <div>
      <Link to="/createpost">Create A Post</Link>
      <Link to="/">Home Page</Link>
    </div>
  );
}

export default NavigationBar
