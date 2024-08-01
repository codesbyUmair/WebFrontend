import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const RecipientDashboard = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [specialist, setSpecialist] = useState('');
  const specialistOptions = ['Cardiologist', 'Primary health care', 'Eye Specialist', 'Dentist', 'Surgeon', 'Neurologist'];
  const [availableDays, setAvailableDays] = useState('');
  const [availableTimeStart, setAvailableTimeStart] = useState('');
  const [availableTimeEnd, setAvailableTimeEnd] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [Fees, setFees] = useState(''); // corrected variable name from 'Fees' to 'fees'
  const [error, setError] = useState('');
  const [showAddDoctorPopup, setShowAddDoctorPopup] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3030/recipient/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role: 'doctor',
          specialist,
          availableDays,
          availableTimeStart,
          availableTimeEnd,
          Fees,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.message) {
        setError(data.message);
      } else {
        console.log('Doctor added successfully:', data);
        setName('');
        setEmail('');
        setPassword('');
        setAvailableDays('');
        setAvailableTimeStart('');
        setAvailableTimeEnd('');
        setFees('');
        handleGetAllDoctors();
      }
    } catch (error) {
      console.error('Error adding Doctor:', error.message);
    }
  };

  const handleGetAllDoctors = async () => {
    try {
      const response = await fetch('http://localhost:3030/recipient/getAll');

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setDoctors(data);
    } catch (error) {
      console.error('Error getting doctors:', error.message);
    }
  };

  const handleUpdateDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:3030/recipient/update/${selectedDoctor._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: selectedDoctor.name,
          email: selectedDoctor.email,
          password: selectedDoctor.password,
          specialist: selectedDoctor.specialist,
          availableDays: selectedDoctor.availableDays,
          availableTimeStart: selectedDoctor.availableTimeStart,
          availableTimeEnd: selectedDoctor.availableTimeEnd,
          Fees,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      console.log('Doctor updated successfully:', selectedDoctor._id);
      setShowUpdateModal(false);
      handleGetAllDoctors();
    } catch (error) {
      console.error('Error updating doctor:', error.message);
    }
  };

  const handleDeleteDoctor = async (id) => {
    try {
      const response = await fetch(`http://localhost:3030/recipient/delete/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      console.log('Doctor deleted successfully');
      handleGetAllDoctors();
    } catch (error) {
      console.error('Error deleting doctor:', error.message);
    }
  };

  useEffect(() => {
    handleGetAllDoctors();
  }, []);

  const handleAddDoctorClick = () => {
    setShowAddDoctorPopup(true);
  };
  const handleAddButtonClick = () => {
    setShowAddDoctorPopup(true);
  };

  const handleAddDoctorPopupClose = () => {
    setShowAddDoctorPopup(false);
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      width: '100%',
      margin: '0 auto', 
    },
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    addDoctorButtonContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
      width: '100%',
      padding: '0 20px', 
      marginBottom: '20px', 
    },
    mainContent: {
      maxWidth: '1550px', 
      margin: '0 auto',
      padding: '0 20px',
    },
    popup: {
      position: 'relative',
      padding: '20px',
      width: '50vh',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
      backgroundColor: '#fff',
      borderRadius: '10px',
      overflowY: 'auto',
      maxHeight: '90vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    popupContent: {
      textAlign: 'center',
      marginBottom:'20px',
    },
    popupCloseButton: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      cursor: 'pointer',
      backgroundColor: 'rgb(251, 47, 54)',
      color: 'white',
      borderRadius: '10%',
      border: 'none',
      marginTop: '10px',
      height: '25px',
    },
    tex:{
      display: 'flex',
      flexDirection: 'column',
       textAlign:'left',
       width:'100%',
    },
    doctorList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      textAlign: 'left',
      marginTop: '20px',
      width: '700px',
    },
    doctorItem: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '20px',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      alignItems: 'center',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
    },
    doctorDetails: {
      flex: 1,
      marginRight: '20px',
    },
    butto: {
      display: 'flex',
      flexDirection: 'column',
    },
    checkup: {
      marginBottom: '10px',
      width: '100px',
    },
  };
  

  const navStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: 'rgb(105, 113, 243)',
    marginBottom: '3px',
  };

  const headerStyles = {
    color: 'white',
  };
  
  const centeredLinksContainer = {
    display: 'flex',
    justifyContent: 'center',
    flex: 1,
  };
  
  const logoutContainer = {
    display: 'flex',
    alignItems: 'center',
  };
  
  const linkStyles = {
    color: 'white',
    textDecoration: 'none',
    marginLeft: '15px',
    padding: '5px',
    borderRadius: '5px',
  };

  const buttonlinkStyle = {
    marginLeft: '88%',
    border: '1px solid black',
    padding: '5px',
    width:'100px',
    backgroundColor: "rgb(199, 208, 252)",
    borderRadius: '10px',
    height: '30px',
  };

  return (
    <div>
      <nav style={navStyles}>
        <div>
          <h3 style={headerStyles}>Healthcare App</h3>
        </div>
        <div style={centeredLinksContainer}>
          <Link to="/recipient" style={linkStyles}>
            Doctors
          </Link>
          <Link to="/appointments" style={linkStyles}>
            Appointments
          </Link>
        </div>
        <div style={logoutContainer}>
          <Link to="/" className="btn btn-danger">
            Logout
          </Link>
        </div>
      </nav>
      <div style={styles.mainContent}>
        <div style={styles.addDoctorButtonContainer}>
          <button 
            className="btn btn-primary" 
            onClick={handleAddButtonClick}
          >
            Add Doctor
          </button>
        </div>
          {showAddDoctorPopup && (
      <div style={styles.overlay}>
        <div style={styles.popup}>
          <button style={styles.popupCloseButton} onClick={handleAddDoctorPopupClose}>
            Close
          </button>
          <h2>Add Doctor</h2>
          <form onSubmit={handleSubmit} className="doctor-form">
          <div style={styles.tex}>
            <label>
              Doctor Name:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            <br />
          <label>
            Doctor Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <br />
          <label>
            Doctor Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <br />
          <label>
            Specialist:
            <select
              value={specialist}
              onChange={(e) => setSpecialist(e.target.value)}
              required
            >
              <option value="" disabled>Select Specialist</option>
              {specialistOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <br />
          <label>
            Available Days:
            <input
              type="text"
              value={availableDays}
              onChange={(e) => setAvailableDays(e.target.value)}
              required
            />
          </label>
          <br />
          <label>
            Available Start Time:
            <input
              type="text"
              value={availableTimeStart}
              onChange={(e) => setAvailableTimeStart(e.target.value)}
              required
            />
          </label>
          <br />
          <label>
            Available End Time:
            <input
              type="text"
              value={availableTimeEnd}
              onChange={(e) => setAvailableTimeEnd(e.target.value)}
              required
            />
          </label>
          <br />
          <label>
            Fees:
            <input
              type="text"
              value={Fees}
              onChange={(e) => setFees(e.target.value)}
              required
            />
          </label>
          <br />
          </div>
          <button type="submit"  style={{ backgroundColor: 'rgb(47, 251, 81)', height: '30px', borderRadius:'10px', }}>Add Doctor</button>
          </form>
        </div>
      </div>
    )}

        {showUpdateModal && selectedDoctor && (
          <div style={styles.overlay}>
          <div style={styles.popup}>
            <button style={styles.popupCloseButton} onClick={() => setShowUpdateModal(false)}>
              Close
            </button>
            <h2>Update Doctor</h2>
            <form onSubmit={handleUpdateSubmit} className="doctor-form">
            <div style={styles.tex}>
              <label>
                Doctor Name:
                <input
                  type="text"
                  value={selectedDoctor.name}
                  onChange={(e) =>
                    setSelectedDoctor({ ...selectedDoctor, name: e.target.value })
                  }
                  required
                />
              </label>
              <br />
              <label>
                Doctor Email:
                <input
                  type="email"
                  value={selectedDoctor.email}
                  onChange={(e) =>
                    setSelectedDoctor({ ...selectedDoctor, email: e.target.value })
                  }
                  required
                />
              </label>
              <br />
              <label>
                Doctor Password:
                <input
                  type="password"
                  value={selectedDoctor.password}
                  onChange={(e) =>
                    setSelectedDoctor({ ...selectedDoctor, password: e.target.value })
                  }
                  required
                />
              </label>
              <br />
              <label>
                Specialist:
                <select
                  value={selectedDoctor.specialist}
                  onChange={(e) =>
                    setSelectedDoctor({
                      ...selectedDoctor,
                      specialist: e.target.value,
                    })
                  }
                  required
                >
                  <option value="" disabled>
                    Select Specialist
                  </option>
                  {specialistOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <br />
              <label>
                Available Days:
                <input
                  type="text"
                  value={selectedDoctor.availableDays}
                  onChange={(e) =>
                    setSelectedDoctor({
                      ...selectedDoctor,
                      availableDays: e.target.value,
                    })
                  }
                  required
                />
              </label>
              <br />
              <label>
                Available Start Time:
                <input
                  type="text"
                  value={selectedDoctor.availableTimeStart}
                  onChange={(e) =>
                    setSelectedDoctor({
                      ...selectedDoctor,
                      availableTimeStart: e.target.value,
                    })
                  }
                  required
                />
              </label>
              <br />
              <label>
                Available End Time:
                <input
                  type="text"
                  value={selectedDoctor.availableTimeEnd}
                  onChange={(e) =>
                    setSelectedDoctor({
                      ...selectedDoctor,
                      availableTimeEnd: e.target.value,
                    })
                  }
                  required
                />
              </label>
              <br />
              <label>
                Fees:
                <input
                  type="text"
                  value={Fees}
                  onChange={(e) => setFees(e.target.value)}
                  required
                />
              </label>
              <br />
              </div>
              <button type="submit" style={{ backgroundColor: 'rgb(47, 251, 81)', height: '30px', borderRadius:'10px'}}>Update Doctor</button>
              </form>
        </div>
      </div>
    )}

        <div style={styles.container}>
          <div>
            <h2>All Doctors</h2>
            {error && <p>Error: {error}</p>}
            <ul style={styles.doctorList}>
              {doctors.map((doctor) => (
                <li key={doctor._id} style={styles.doctorItem}>
                  <div style={styles.doctorDetails}>
                    <p style={{ fontWeight: 'bold' }}>Doctor Name: {doctor.name}</p>
                    <p>Email: {doctor.email}</p>
                  </div>
                  <div style={styles.butto}>
                    <button className="btn btn-primary" style={styles.checkup} onClick={() => handleUpdateDoctor(doctor)}>
                      Update
                    </button>
                    <button className="btn btn-danger" style={styles.checkup} onClick={() => handleDeleteDoctor(doctor._id)}>
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RecipientDashboard;
