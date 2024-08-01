import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [editAppointmentId, setEditAppointmentId] = useState(null);
  const [editedDate, setEditedDate] = useState('');
  const [editedTime, setEditedTime] = useState('');
  
  const fetchAppointments = async () => {
    try {
      const response = await fetch('http://localhost:3030/recipient/getAllAppointments');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error.message);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusChange = async (appointmentId) => {
    try {
      const response = await fetch(`http://localhost:3030/recipient/updateAppointmentStatus/${appointmentId}`, {
        method: 'PUT',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, ApproveStatus: true }
            : appointment
        )
      );
    } catch (error) {
      console.error('Error updating appointment status:', error.message);
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    try {
      const response = await fetch(`http://localhost:3030/recipient/deleteAppointment/${appointmentId}`, {
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

  const handleEditClick = (appointmentId, date, time) => {
    setEditAppointmentId(appointmentId);
    setEditedDate(date);
    setEditedTime(time);
  };

  const handleEditSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:3030/recipient/updateAppointment/${editAppointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newDate: editedDate,
          newTime: editedTime,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setEditAppointmentId(null);
      setEditedDate('');
      setEditedTime('');
      fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment:', error.message);
    }
  };

  const handleEditCancel = () => {
    setEditAppointmentId(null);
    setEditedDate('');
    setEditedTime('');
  };

  const styles = {
    container: {
      textAlign: 'center',
      margin: '20px auto',
      width: '70%',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '20px',
    },
    tableHeader: {
      backgroundColor: '#f2f2f2',
      padding: '12px',
      textAlign: 'left',
      borderBottom: '1px solid #ddd',
    },
    tableCell: {
      padding: '12px',
      borderBottom: '1px solid #ddd',
    },
    buttonContainer: {
      display: 'flex',
      gap: '10px', 
    },
    button: {
      padding: '5px 10px',
      cursor: 'pointer',
    },
    editInput: {
      padding: '5px',
      marginRight: '5px',
    },
    nav: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px',
      backgroundColor: 'rgb(105, 113, 243)',
      marginBottom: '3px',
    },
    navHeader: {
      color: 'white',
    },
    navLinks: {
      display: 'flex',
      justifyContent: 'center',
      flex: 1,
    },
    navLink: {
      color: 'white',
      textDecoration: 'none',
      marginLeft: '15px',
      padding: '5px',
      borderRadius: '5px',
    },
  };

  return (
    <div>
      <nav style={styles.nav}>
        <div>
          <h3 style={styles.navHeader}>Healthcare App</h3>
        </div>
        <div style={styles.navLinks}>
          <Link to="/recipient" style={styles.navLink}>
            Doctors
          </Link>
          <Link to="/appointments" style={styles.navLink}>
            Appointments
          </Link>
        </div>
        <div>
          <Link to="/" className="btn btn-danger">
            Logout
          </Link>
        </div>
      </nav>

      <div style={styles.container}>
        <h2>Appointments</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Date</th>
              <th style={styles.tableHeader}>Time</th>
              <th style={styles.tableHeader}>Doctor Name</th>
              <th style={styles.tableHeader}>Patient Name</th>
              <th style={styles.tableHeader}>Approve Status</th>
              <th style={styles.tableHeader}>Status</th>
              <th style={styles.tableHeader}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment._id}>
                <td style={styles.tableCell}>{appointment.Date}</td>
                <td style={styles.tableCell}>{appointment.Time}</td>
                <td style={styles.tableCell}>{appointment.DoctorName}</td>
                <td style={styles.tableCell}>{appointment.PatientName}</td>
                <td style={styles.tableCell}>
                  {appointment.ApproveStatus ? (
                    'Approved'
                  ) : (
                    <button style={styles.button} onClick={() => handleStatusChange(appointment._id)}>
                      Not Approved
                    </button>
                  )}
                </td>
                <td style={styles.tableCell}>{appointment.Status}</td>
                <td style={styles.tableCell}>
                  {editAppointmentId === appointment._id ? (
                    <>
                      <input
                        type="text"
                        value={editedDate}
                        onChange={(e) => setEditedDate(e.target.value)}
                        style={styles.editInput}
                      />
                      <input
                        type="text"
                        value={editedTime}
                        onChange={(e) => setEditedTime(e.target.value)}
                        style={styles.editInput}
                      />
                      <button style={styles.button} onClick={handleEditSubmit}>
                        Submit
                      </button>
                      <button style={styles.button} onClick={handleEditCancel}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <div style={styles.buttonContainer}>
                      <button className="btn btn-primary" onClick={() => handleEditClick(appointment._id, appointment.Date, appointment.Time)}>
                        Edit
                      </button>
                      <button className="btn btn-danger" onClick={() => handleDeleteAppointment(appointment._id)}>
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentsPage;