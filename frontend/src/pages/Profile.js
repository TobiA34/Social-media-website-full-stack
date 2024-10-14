import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card } from "react-bootstrap";
 
 
function Profile() {
  let { id } = useParams();
  let navigate = useNavigate();
 
  return (
    <div className="">
      <div class="  mt-4 ">
        <div class="row d-flex justify-content-center w-100">
          <div class="col-md-11">
            <div class="p-3 ">
              <h5 className="my-3">Profile picture</h5>
              <div className="d-flex align-items-center gap-5">
                <Card.Img
                  variant="bottom"
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyzTWQoCUbRNdiyorem5Qp1zYYhpliR9q0Bw&s"
                  className="avatar img-fluid image-container  "
                />
                <div className="d-flex  gap-2">
                  <button className="rounded-pill bg-primary text-white w-75">
                    change picture
                  </button>
                  <button className="rounded-pill text-danger">
                    delete picture
                  </button>
                </div>
              </div>
              <div className="d-flex flex-column ">
                <label htmlFor="" className="mt-40 mb-10">
                  username
                </label>
                <input
                  type="text"
                  className="form-control opacity-.8"
                  placeholder="username"
                />
              </div>
              <div className="d-flex flex-column ">
                <label htmlFor="" className="my-3">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control opacity-.8"
                  placeholder="username"
                />
              </div>
              <div className="d-flex flex-column ">
                <label htmlFor="" className="my-3">
                  Profile name
                </label>
                <textarea
                  type="text"
                  className="form-control opacity-.8"
                  placeholder={
                    "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Reiciendis quidem impedit perspiciatis quas a explicabo, cumque natus molestiae aut, praesentium laudantium molestias sapiente excepturi voluptatum ducimus id tenetur. Ipsum, fuga"
                  }
                />
              </div>
              <div className="d-flex justify-content-end">
                <button className="btn btn-primary  mt-20 align-self-end w-50 fs-6">
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
