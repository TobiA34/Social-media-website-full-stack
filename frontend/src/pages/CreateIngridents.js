// import React from 'react'
// import Button from "react-bootstrap/Button";
// import Modal from "react-bootstrap/Modal";
// import {  useState, useEffect } from "react";
//  import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { AuthContext } from "../helpers/AuthContext";

// function CreateIngridents() {
//       const [show, setShow] = useState(false);

//       const handleClose = () => setShow(false);
//       const handleShow = () => setShow(true);
//   const [ingridents, setIngridents] = useState([]);
//     const [newIngrident, setNewIngrident] = useState("");


//   let { id } = useParams();

//         useEffect(() => {

//           // axios
//           //   .get(`http://localhost:3001/ingredients/${id}`)
//           //   .then((response) => {
//           //     setIngridents(response.data);
//           //   });
//         }, []);


//   const addIngrident = () => {
//     axios
//       .post(
//         "http://localhost:3001/ingridents",
//         {
//           name: newIngrident,
//          },
//         {
//           headers: {
//             accessToken: localStorage.getItem("accessToken"),
//           },
//         }
//       )
//       .then((response) => {
//         if (response.data.error) {
//           console.log(response.data.error);
//         } else {
//           const ingridentToAdd = {
//             name: newIngrident,
//            };
//           setComments([...ingridents, ingridentToAdd]);
//           setIngridents("");
//         }
//       });
//   };

//   return (
//     <>
//       <Button variant="primary" onClick={handleShow} onSubmit={addIngrident}>
//         view ingridents
//       </Button>

//       <Modal
//         show={show}
//         onHide={handleClose}
//         backdrop="static"
//         keyboard={false}
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Ingredients</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <input type="text" className="w-100" placeholder="enter ingridents" />

//           {ingridents.map((val, key) => {
//             <div key={key} className="div">
//               <h1>{val.name}</h1>
//             </div>;
//           })}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleClose}>
//             Close
//           </Button>
//           <Button variant="primary">Add</Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// }

// export default CreateIngridents
