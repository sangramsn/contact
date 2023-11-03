import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addContact, deleteContact } from "./features/contact/contactSlice";
import { editContact } from "./features/contact/contactSlice";
import { fetchContacts } from "./features/contact/contactSlice";
import { AppDispatch } from "./app/store";
import "./styles/addContactForm.css";
import { FaUser } from "react-icons/fa";

import { FaArrowDownLong } from "react-icons/fa6";

const AddContactForm: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [contact, setContacts] = useState([]);
  const [isAscending, setIsAscending] = useState(true);
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    // id:0,
    first_name: "",
    last_name: "",
    job: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState({
    first_name: false,
    last_name: false,
    job: false,
    description: false,
  });

  console.log("formErrors", formErrors);
  const dispatch = useDispatch<AppDispatch>();

  const { contacts, status, error } = useSelector(
    (state: any) => state.contacts
  );

  const showConfirmation = (message: string) => {
    setConfirmation(message);

    setTimeout(() => {
      setConfirmation(null);
    }, 4000); 
  };

  const clearFields = () => {
    setFormData({
      first_name: "",
      last_name: "",
      job: "",
      description: "",
    });
  }

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchContacts()).then((contact) => {
        setContacts(contact.payload.data);
      });
    }
  }, [status, dispatch]);

  const formError = (e: any, update: Boolean) => {
    e.preventDefault();
    const formErrorsCopy = { ...formErrors }; 

    if (!update) {
      if (edit.first_name.trim() === "") {
        formErrorsCopy.first_name = true;
      } else {
        formErrorsCopy.first_name = false;
      }
  
      if (edit.last_name.trim() === "") {
        formErrorsCopy.last_name = true;
      } else {
        formErrorsCopy.last_name = false;
      }
  
      if (edit.job.trim() === "") {
        formErrorsCopy.job = true;
      } else {
        formErrorsCopy.job = false;
      }
  
      if (edit.description.trim() === "") {
        formErrorsCopy.description = true;
      } else {
        formErrorsCopy.description = false;
      }
  
      setFormErrors(formErrorsCopy);
  
      if (
        formErrorsCopy.first_name ||
        formErrorsCopy.last_name ||
        formErrorsCopy.job ||
        formErrorsCopy.description
      ) {
        alert("All fields are required");
        return false; 
      } else {
        return true; 
      }
    } else {
      if (formData.first_name.trim() === "") {
        formErrorsCopy.first_name = true;
      } else {
        formErrorsCopy.first_name = false;
      }
  
      if (formData.last_name.trim() === "") {
        formErrorsCopy.last_name = true;
      } else {
        formErrorsCopy.last_name = false;
      }
  
      if (formData.job.trim() === "") {
        formErrorsCopy.job = true;
      } else {
        formErrorsCopy.job = false;
      }
  
      if (formData.description.trim() === "") {
        formErrorsCopy.description = true;
      } else {
        formErrorsCopy.description = false;
      }
  
      setFormErrors(formErrorsCopy);
  
      if (
        formErrorsCopy.first_name ||
        formErrorsCopy.last_name ||
        formErrorsCopy.job ||
        formErrorsCopy.description
      ) {
        alert("All fields are required");
        return false; 
      } else {
        return true; 
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    const hasFormErrors = formError(e,true);
    if (!hasFormErrors) {
      return; 
    }
    let contact = {
      contact: {
        first_name: formData.first_name,
        last_name: formData.last_name,
        job: formData.job,
        description: formData.description,
      },
    };

    dispatch(addContact(contact)).then((resultAction) => {
      if (addContact.fulfilled.match(resultAction)) {
        clearFields();
        setPopupOpen(false)
        dispatch(fetchContacts()).then((contact) => {
          setContacts(contact.payload.data);
          showConfirmation("Contact added successfully");
        });
      } else if (addContact.rejected.match(resultAction)) {
        console.error("Failed to add contact:", resultAction.payload);
        showConfirmation("Failed to add contact");
      }
    });
  };

  const handleUpdate = (e: any) => {
    const hasFormErrors = formError(e, false);
    if (!hasFormErrors) {
      return; 
    }
    let contact = {
      contact: {
        id: edit.id,
        first_name: edit.first_name,
        last_name: edit.last_name,
        job: edit.job,
        description: edit.description,
      },
    };

    dispatch(editContact(contact)).then((resultAction) => {
      if (editContact.fulfilled.match(resultAction)) {
        dispatch(fetchContacts()).then((contact) => {
          setContacts(contact.payload.data);
        });
        clearFields()
        showConfirmation("Contact updated successfully");
      } else if (editContact.rejected.match(resultAction)) {
        console.error("Failed to edit contact:", resultAction.payload);
        showConfirmation("Contact not updated successfully");
      }
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate the field
    if (value.trim() === "") {
      setFormErrors({ ...formErrors, [name]: true });
    } else {
      setFormErrors({ ...formErrors, [name]: false });
    }
  };

  const [edit, SetEdit] = useState({
    id: "",
    first_name: "",
    last_name: "",
    job: "",
    description: "",
  });
  const handleInputChangeEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    SetEdit({ ...edit, [name]: value });

    // Validate the field
    if (value.trim() === "") {
      setFormErrors({ ...formErrors, [name]: true });
    } else {
      setFormErrors({ ...formErrors, [name]: false });
    }
  };

  const popupRef = React.useRef<HTMLDivElement | null>(null);

  const openPopup = () => {
    setPopupOpen(true);
  };

  const closePopup = () => {
    setFormErrors({
      first_name: false,
      last_name: false,
      job: false,
      description: false,
    });
    clearFields();
    setPopupOpen(false);
  };

  const openEditPopup = (item: any) => {
    setFormData(item);
    SetEdit(item);
    setShowPopup(true);
  };

  const closePopupEdit = () => {
    setFormErrors({
      first_name: false,
      last_name: false,
      job: false,
      description: false,
    });
    clearFields()
    setShowPopup(false);
  };

  const handleDelete = (item: any) => {
    dispatch(deleteContact(item.id)).then((resultAction) => {
      if (deleteContact.fulfilled.match(resultAction)) {
        showConfirmation("Contact deleted successfully");
        dispatch(fetchContacts()).then((contact) => {
          setContacts(contact.payload.data);
        });
       clearFields()
      } else if (editContact.rejected.match(resultAction)) {
        console.error("Failed to edit contact:", resultAction.payload);
      }
    });
  };

  useEffect(() => {
    sortContacts();
  }, []);

  const sortContacts = () => {
    let sortedContacts = [...contacts] as any;

    sortedContacts.sort((a: any, b: any) => {
      if (isAscending) {
        return a.first_name.localeCompare(b.first_name);
      } else {
        return b.first_name.localeCompare(a.first_name);
      }
    });

    setContacts(sortedContacts);
    setIsAscending(!isAscending);
  };

  return (
    <>
      <div className="navbar">
        <div className="header">
          <span style={{ paddingLeft: "10px" }}><b>Contact list</b></span>
          {confirmation && (
            <div className="confirmation-message">
              <h3>{confirmation}</h3>
            </div>
          )}
          <button onClick={openPopup}>Add Contact</button>
        </div>
        {isPopupOpen && (
          <div className="popup" ref={popupRef}>
            <div className="popup-content">
              <span className="close">&times;</span>
              <div className="container">
                <form className="contact-form" onSubmit={handleSubmit}>
                  <h2>Add Contact</h2>
                  <div className="form-group field">
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      placeholder="First Name"
                    />
                    {formErrors.first_name && (
                      <span className="error-text">First Name is required</span>
                    )}
                  </div>
                  <div className="form-group field">
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      placeholder="Last Name"
                    />
                    {formErrors.last_name && (
                      <span className="error-text">Last Name is required</span>
                    )}
                  </div>
                  <div className="form-group field">
                    <input
                      type="text"
                      name="job"
                      value={formData.job}
                      onChange={handleInputChange}
                      placeholder="Job"
                    />
                    {formErrors.job && (
                      <span className="error-text">Job is required</span>
                    )}
                  </div>
                  <div className="form-group field">
                    <input
                      name="description"
                      type="text"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Description"
                    />
                    {formErrors.description && (
                      <span className="error-text">
                        Description is required
                      </span>
                    )}
                  </div>
                  <div className="form-group footer">
                    <button onClick={closePopup}>Close</button>
                    <button type="submit">Add Contact</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
      <div>
        <span>
          <h1>Contacts</h1>
          <div className="sortContact" onClick={sortContacts}>
            <FaArrowDownLong size={25} />
            {!isAscending ? (
              <div>
                A<br />Z
              </div>
            ) : (
              <div>
                Z<br />A
              </div>
            )}
          </div>
        </span>
        <div className="contact-grid">
          {contact.length > 0 &&
            contact.map((item: any, index: any) => (
              <div className="contact-card" key={index}>
                <div className="logo">
                  <FaUser
                    style={{
                      paddingTop: "20px",
                      fontSize: "48px",
                      color: "black",
                    }}
                  />
                </div>
                <div className="info">
                  <div
                    className="firstName"
                    style={{ fontSize: "30px", fontWeight: "500" }}
                  >
                    {item.first_name} {item.last_name}
                  </div>
                  <div className="jobs">Job: {item.job}</div>
                  <div className="jobs">Description: {item.description}</div>
                </div>
                <div className="actions">
                  <button
                    style={{ width: "60px" }}
                    onClick={() => openEditPopup(item)}
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDelete(item)}>Delete</button>
                </div>
              </div>
            ))}
        </div>
        {showPopup ? (
          <div className="popup" ref={popupRef}>
            <div className="popup-content">
              <div className="container">
                <form className="contact-form" onSubmit={handleUpdate}>
                  <h2>Update Contact</h2>
                  <div className="form-group field">
                    <input
                      type="text"
                      name="first_name"
                      value={edit.first_name}
                      onChange={handleInputChangeEdit}
                      placeholder="First Name"
                    />
                    {formErrors.first_name && (
                      <span className="error-text">First Name is required</span>
                    )}
                  </div>
                  <div className="form-group field">
                    <input
                      type="text"
                      name="last_name"
                      value={edit.last_name}
                      onChange={handleInputChangeEdit}
                      placeholder="Last Name"
                    />
                    {formErrors.last_name && (
                      <span className="error-text">Last Name is required</span>
                    )}
                  </div>
                  <div className="form-group field">
                    <input
                      type="text"
                      name="job"
                      value={edit.job}
                      onChange={handleInputChangeEdit}
                      placeholder="Job"
                    />
                    {formErrors.job && (
                      <span className="error-text">Job is required</span>
                    )}
                  </div>
                  <div className="form-group field">
                    <input
                      name="description"
                      type="text"
                      value={edit.description}
                      onChange={handleInputChangeEdit}
                      placeholder="Description"
                    />
                    {formErrors.description && (
                      <span className="error-text">
                        Description is required
                      </span>
                    )}
                  </div>
                  <div className="form-group footer">
                    <button type="button" onClick={closePopupEdit}>
                      Close
                    </button>
                    <button type="submit">
                      Update Contact
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default AddContactForm;
