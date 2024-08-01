import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const DoctorDashboard = () => {
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [checkupData, setCheckupData] = useState({
    Frequency: '',
    Medicinename: '',
    Description: '',
    Testname: '',
    Noofdays: 0,
  });
  const [showCheckupPopup, setShowCheckupPopup] = useState(false);

  useEffect(() => {
    const fetchDoctorAppointments = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUserId = localStorage.getItem('userId');

        if (storedToken && storedUserId) {
          setToken(storedToken);
          setUserId(storedUserId);

          const response = await fetch(`http://localhost:3030/doctor/appointments`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${storedToken}`,
            },
            body: JSON.stringify({ DoctorID: storedUserId }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch appointments');
          }

          setAppointments(data.appointments);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error.message);
        setError(error.message);
      }
    };

    fetchDoctorAppointments();
  }, []);

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const response = await fetch(`http://localhost:3030/doctor/delete/${appointmentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setAppointments((prevAppointments) =>
        prevAppointments.filter((appointment) => appointment._id !== appointmentId)
      );
    } catch (error) {
      console.error('Error deleting appointment:', error.message);
    }
  };

  const handleCheckupClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCheckupPopup(true);
  };

  const handleCheckupSubmit = async () => {
    try {
      const token = localStorage.getItem('token');

      const checkupRequestData = {
        Frequency: checkupData.Frequency,
        Medicinename: checkupData.Medicinename,
        Description: checkupData.Description,
        Testname: checkupData.Testname,
        Noofdays: checkupData.Noofdays,
        AppointmentID: selectedAppointment._id,
        DoctorID: selectedAppointment.DoctorID,
        PatientID: selectedAppointment.PatientID,
        DoctorName: selectedAppointment.DoctorName,
        PatientName: selectedAppointment.PatientName,
      };

      const response = await fetch('http://localhost:3030/doctor/addCheckup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(checkupRequestData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Checkup added successfully:', data.message);
      } else {
        console.error('Error adding checkup:', data.message);
      }

      setShowCheckupPopup(false);
      setCheckupData({
        Frequency: '',
        Medicinename: '',
        Description: '',
        Testname: '',
        Noofdays: 0,
      });
    } catch (error) {
      console.error('Error adding checkup:', error.message);
    }
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
    popup: {
      position: 'relative',
      padding: '20px',
      width: '70vh',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
      backgroundColor: '#fff',
      borderRadius: '10px',
      overflowY: 'auto',
      maxHeight: '85vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
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
      width:'100px',
    },
    checkupModal: {
      position: 'relative',
      padding: '20px',
      width: '70vh',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
      backgroundColor: '#fff',
      borderRadius: '10px',
      overflowY: 'auto',
      maxHeight: '85vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      alignItems: 'left',
    },
    checkupModalContent: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'left',
    },
    tex: {
      display: 'flex',
      flexDirection: 'column',
      textAlign: 'right',
      width: '80%',
    },
    checkupModalCloseButton: {
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
  };

  return (
    <>
      <nav
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px',
          backgroundColor: 'rgb(105, 113, 243)',
          marginBottom: '3px',
        }}
      >
        <div>
          <h3>Healthcare App</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/" className="btn btn-danger">
            Logout
          </Link>
        </div>
      </nav>

      <div style={styles.container}>
        <div>
          <h2>Your Appointments</h2>
          {error && <p>Error: {error}</p>}
          <ul style={styles.doctorList}>
            {appointments.map((appointment) => (
              <li key={appointment._id} style={styles.doctorItem}>
                <div style={styles.doctorDetails}>
                  <p style={{ fontWeight: 'bold' }}>Patient Name: {appointment.PatientName}</p>
                  <p>Date: {appointment.Date}</p>
                  <p>Time: {appointment.Time}</p>
                </div>
                <div style={styles.butto}>
                  <button style={styles.checkup} class="btn btn-primary" onClick={() => handleCheckupClick(appointment)}>
                    Checkup
                  </button>
                  <button style={styles.checkup} class="btn btn-danger" onClick={() => handleCancelAppointment(appointment._id)}>
                    Cancel 
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {showCheckupPopup && selectedAppointment && (
            <div style={styles.overlay}>
              <div style={styles.checkupModal}>
                <button
                  style={styles.checkupModalCloseButton}
                  onClick={() => setShowCheckupPopup(false)}
                >
                  Close
                </button>
                <div style={styles.checkupModalContent}>
                  <h3>Patient Name: {selectedAppointment.PatientName}</h3>
                  <div style={styles.tex}>
                    <label>
                      Frequency:
                      <input
                        type="text"
                        value={checkupData.Frequency}
                        onChange={(e) => setCheckupData({ ...checkupData, Frequency: e.target.value })}
                      />
                    </label>
                    <label>
                      Medicine Name:
                      <input
                        type="text"
                        value={checkupData.Medicinename}
                        onChange={(e) => setCheckupData({ ...checkupData, Medicinename: e.target.value })}
                      />
                    </label>
                    <label>
                      Description:
                      <input
                        type="text"
                        value={checkupData.Description}
                        onChange={(e) => setCheckupData({ ...checkupData, Description: e.target.value })}
                      />
                    </label>
                    <label>
                      Test Name:
                      <input
                        type="text"
                        value={checkupData.Testname}
                        onChange={(e) => setCheckupData({ ...checkupData, Testname: e.target.value })}
                      />
                    </label>
                    <label>
                      No of Days:
                      <input
                        type="number"
                        value={checkupData.Noofdays}
                        onChange={(e) => setCheckupData({ ...checkupData, Noofdays: parseInt(e.target.value) })}
                      />
                    </label>
                    <button onClick={handleCheckupSubmit}>Submit</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DoctorDashboard;
