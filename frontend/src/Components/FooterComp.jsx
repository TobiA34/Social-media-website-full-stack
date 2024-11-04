import React from "react";

function FooterComp() {
  return (
    <>
      <div className="container my-5">
        <footer
          className="text-center text-lg-start text-white"
          style={{ backgroundColor: "#45526e" }}
        >
          <div className="container p-4 pb-0">
            <section>
              <div className="row">
                <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
                  <h6 className="text-uppercase mb-4 font-weight-bold">
                    DishSwap
                  </h6>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae incidunt quaerat soluta fugit consequuntur quidem, reiciendis voluptates nam qui officiis quae, iusto deleniti tempore assumenda delectus nemo rem quo non?
                  </p>
                </div>

                <hr className="w-100 clearfix d-md-none" />
 
                <hr className="w-100 clearfix d-md-none" />

        

                <hr className="w-100 clearfix d-md-none" />

                <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
                  <h6 className="text-uppercase mb-4 font-weight-bold">
                    Contact
                  </h6>
                  <p>
                    <i className="fas fa-home mr-3"></i> Manchester
                  </p>
                  <p>
                    <i className="fas fa-envelope mr-3"></i>tobiad@gmail.com
                  </p>
                </div>
              </div>
            </section>

            <hr className="my-3" />

            <section className="p-3 pt-0">
              <div className="row d-flex align-items-center">
                <div className="col-md-7 col-lg-8 text-center text-md-start">
                  <div className="p-3">
                    © 2024 Copyright:
                    <a className="text-white"  >
                     Tobi Adegoroye
                    </a>
                  </div>
                </div>

                <div className="col-md-5 col-lg-4 ml-lg-0 text-center text-md-end">
                  <a
                    className="btn btn-outline-light btn-floating m-1 text-white"
                    role="button"
                  >
                    <i className="fab fa-facebook-f"></i>
                  </a>

                  <a
                    className="btn btn-outline-light btn-floating m-1 text-white"
                    role="button"
                  >
                    <i className="fab fa-twitter"></i>
                  </a>

            

                  <a
                    className="btn btn-outline-light btn-floating m-1 text-white"
                    role="button"
                  >
                    <i className="fab fa-instagram"></i>
                  </a>
                </div>
              </div>
            </section>
          </div>
        </footer>
      </div>
    </>
  );
}

export default FooterComp;
