import React, { useContext, useState } from 'react';
import { AuthContext } from '../../../contexts/AuthUserStore';
import SidebarMenuBusiness from './SidebarMenuBusiness';
import BusinessUpdateForm from './BusinessUpdateForm';
import BusinessReviews from './BusinessReviews';
import BusinessCode from './BusinessCode';
import BusinessFavs from './BusinessFavs';
import BusinessVisits from './BusinessVisits';
import BusinessResume from './BusinessResume';
import ReactDOM from 'react-dom/client';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';


export default function BusinessProfile() {

  const { user } = useContext(AuthContext);
  const [expandSidebar, setExpandSidebar] = useState(false);

  return (
    <div className='row'>
      <div className={expandSidebar ? 'd-none d-md-grid col-md-2 col-lg-1' : 'col-sm-12 col-md-4 col-lg-3'}>
        <div className="d-flex flex-column flex-shrink-0 p-3 bg-light mx-auto h-auto">
          <button className='btn btn-sm text-end d-none d-md-block' onClick={() => setExpandSidebar(!expandSidebar)}><i className={`fa-solid fa-2xl ${expandSidebar ? 'fa-square-caret-right' : 'fa-square-caret-left'}`}></i></button>
          <hr className='d-none d-md-block' />
          <SidebarMenuBusiness isExpanded={expandSidebar} user={user} />
        </div>
      </div>
      <div className={expandSidebar ? 'col-sm-12 col-md-8 col-lg-11' : 'col-sm-12 col-md-8 col-lg-9'}>

        {/* <Router>
          <Routes>
            <Route path='/profile/' element={<BusinessResume user={user} />} />
            <Route path='/profile/code' element={<BusinessCode user={user} />} />
            <Route path='/profile/business-favs' element={<BusinessFavs user={user} />} />
            <Route path='/profile/business-reviews' element={<BusinessReviews user={user} />} />
            <Route path='/profile/business-visits' element={<BusinessVisits user={user} />} />
            <Route path='/profile/edit' element={<BusinessUpdateForm business={user} />} />
          </Routes>
        </Router> */}



        <BusinessResume user={user} />
        <BusinessCode user={user} />
        <BusinessFavs user={user} />
        <BusinessReviews user={user} />
        <BusinessVisits user={user} />
        <BusinessUpdateForm business={user} />
        {/* To do: gallery */}
      </div>
    </div>
  )
}
