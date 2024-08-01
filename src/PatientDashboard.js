import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const PatientDashboard = () => {
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState(new Date());
  const [appointmentTime, setAppointmentTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patientHistory, setPatientHistory] = useState([]);
  const [showPatientHistoryPopup, setShowPatientHistoryPopup] = useState(false);
  const [showRequestAppointmentPopup, setShowRequestAppointmentPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    if (storedToken && storedUserId) {
      setToken(storedToken);
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('http://localhost:3030/patient/doctors');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch doctors');
        }

        setDoctors(data.doctors);
        setFilteredDoctors(data.doctors);
      } catch (error) {
        console.error('Error fetching doctors:', error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleRequestAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setShowRequestAppointmentPopup(true);
  };

  const handleRequestAppointmentPopupClose = () => {
    setShowRequestAppointmentPopup(false);
  };

  const handleAppointmentSubmit = async () => {
    try {

      const token = localStorage.getItem('token');

      const requestData = {
        Date: appointmentDate.toISOString().split('T')[0],
        Time: appointmentTime,
        DoctorID: selectedDoctor._id,
        PatientID: userId,
        DoctorName: selectedDoctor.name,
        PatientName: '',
      };

      console.log('Request Data:', requestData);

      const response = await fetch('http://localhost:3030/patient/request-appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token,
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok && data.Success) {
        console.log('Appointment requested successfully:', data.appointment);
      } else {
        console.error('Error requesting appointment:', data.Message);
      }
    } catch (error) {
      console.error('Error requesting appointment:', error.message);
    }
  };

  const handlePatientHistoryClick = async () => {
    try {
      const response = await fetch(`http://localhost:3030/patient/medicines/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          'token': token,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setPatientHistory(data.medicines);
        setShowPatientHistoryPopup(true);
      } else {
        console.error('Error fetching patient history:', data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching patient history:', error.message);
    }
  };

  const handleSearchInputChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    applyFilters(doctors, query, selectedFilter);
  };

  const applyFilters = (doctorsList, query, filter) => {
    let filtered = doctorsList.filter(
      (doctor) =>
        doctor.name.toLowerCase().includes(query) ||
        doctor.specialist.toLowerCase().includes(query)
    );

    if (filter && filter !== 'All Doctors') {
      filtered = filtered.filter((doctor) => doctor.specialist === filter);
    }

    setFilteredDoctors(filtered);
  };

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
    applyFilters(doctors, searchQuery, filter);
  };

  const handleAllDoctorsClick = () => {
    setSelectedFilter('All Doctors');
    applyFilters(doctors, searchQuery, 'All Doctors');
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
    popupContent: {
      textAlign: 'center',
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
      height: '25px'
    },
    patientHistoryList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      textAlign: 'center',
      width:'45vh',
    },
    patientHistoryItem: {
      marginBottom: '20px',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      textAlign: 'center',
    },
    doctorList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      textAlign: 'left', 
      marginTop: '20px',
      width: '60%',
      
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
    requestAppointmentButton: {
      marginLeft: 'auto',
      backgroundColor:'rgb(199, 208, 252)',
      borderRadius:'10px',
      height:'30px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
    },
    filterButton: {
      padding: '10px', 
      margin: '5px',
      fontSize: '16px',
      backgroundColor:'rgb(199, 208, 252)',
      borderRadius:'15px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
    },
    requestAppointmentPopup: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      padding: '20px',
      width: '40vh',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
      backgroundColor: '#fff',
      borderRadius: '10px',
      overflowY: 'auto',
      maxHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
  };

  
  return (
    <>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: 'rgb(105, 113, 243)', marginBottom: '3px' }}>
        <div>
          <h3>Healthcare App</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button onClick={handlePatientHistoryClick} className="btn btn-success" style={{ marginRight: '10px' }}>Patient History</button>
          <Link to="/" className="btn btn-danger">Logout</Link>
        </div>
      </nav>
      <div style={styles.container}>
        {showPatientHistoryPopup && (
          <div style={styles.overlay}>
            <div style={styles.popup}>
              <button style={styles.popupCloseButton} onClick={() => setShowPatientHistoryPopup(false)}>
                Close
              </button>
              <ul style={styles.patientHistoryList}>
                <h2>Patient History</h2>
                {patientHistory.map((medicine) => (
                  <li key={medicine._id} style={styles.patientHistoryItem}>
                    <p>Doctor Name: {medicine.DoctorName}</p>
                    <p>Medicine Name: {medicine.Medicinename}</p>
                    <p>Frequency: {medicine.Frequency}</p>
                    <p>Description: {medicine.Description}</p>
                    <p>Test Name: {medicine.Testname}</p>
                    <p>Number of Days: {medicine.Noofdays}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        {showRequestAppointmentPopup && (
          <div style={styles.overlay}>
            <div style={styles.requestAppointmentPopup}>
              <button style={styles.popupCloseButton} onClick={handleRequestAppointmentPopupClose}>
                Close
              </button>
              <h3>Request Appointment</h3>
              <label>
                Date:
                <DatePicker selected={appointmentDate} onChange={(date) => setAppointmentDate(date)} />
              </label>
              <br />
              <label>
                Time:
                <input
                  type="text"
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  required
                />
              </label>
              <br />
              <button onClick={handleAppointmentSubmit} style={{ backgroundColor: 'rgb(47, 251, 81)', height: '30px', borderRadius:'10px'}}>Submit Appointment Request</button>
            </div>
          </div>
        )}
        <h2>Doctors</h2>
        <div style={{ margin: '20px', textAlign: 'center' }}>
  <label style={{ fontSize: '18px', marginBottom: '10px', display: 'block' }}>
    Search:
    <input
      type="text"
      value={searchQuery}
      onChange={handleSearchInputChange}
      placeholder="Search Doctor by name"
      style={{
        padding: '8px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        marginLeft: '10px',
        fontSize: '16px',
      }}
    />
  </label>
</div>
        <div>
          <h4 style={{ fontSize: '18px', display: 'block' }}>Filter by Speciality:</h4>
          <button style={styles.filterButton} onClick={() => handleAllDoctorsClick()}>All Doctors</button>
          <button style={styles.filterButton} onClick={() => handleFilterClick('Cardiologist')}>Cardiologist</button>
          <button style={styles.filterButton} onClick={() => handleFilterClick('Primary health care')}>Primary Health Care</button>
          <button style={styles.filterButton} onClick={() => handleFilterClick('Eye Specialist')}>Eye Specialist</button>
          <button style={styles.filterButton} onClick={() => handleFilterClick('Dentist')}>Dentist</button>
          <button style={styles.filterButton} onClick={() => handleFilterClick('Surgeon')}>Surgeon</button>
          <button style={styles.filterButton} onClick={() => handleFilterClick('Neurologist')}>Neurologist</button>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        <ul style={styles.doctorList}>
          {filteredDoctors.map((doctor) => (
            <li key={doctor._id} style={styles.doctorItem}>
              <div style={styles.doctorDetails}>
                <p style={{ fontWeight: 'bold' }}>Name: {doctor.name}</p>
                <p>Specialization: {doctor.specialist}</p>
                <p>Fees: {doctor.Fees}</p>
              </div>
              <button style={styles.requestAppointmentButton} onClick={() => handleRequestAppointment(doctor)}>
                Request Appointment
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default PatientDashboard;
