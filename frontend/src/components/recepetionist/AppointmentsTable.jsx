const STATUS_FLOW = {
  Scheduled: [{ next: "CheckedIn", label: "Check in" }, { next: "Cancelled", label: "Cancel" }],
  CheckedIn: [{ next: "InProgress", label: "Start" }, { next: "NoShow", label: "No-show" }],
  InProgress: [{ next: "Completed", label: "Complete" }],
  Completed: [],
  Cancelled: [],
  NoShow: [],
};

const STATUS_STYLES = {
  Scheduled: "badge--scheduled",
  CheckedIn: "badge--checkedin",
  InProgress: "badge--inprogress",
  Completed: "badge--completed",
  Cancelled: "badge--cancelled",
  NoShow: "badge--cancelled",
};

export default function AppointmentsTable({ appointments, loading, onStatusChange }) {
  if (loading) {
    return <div className="table-empty">Loading appointments…</div>;
  }

  if (!appointments.length) {
    return <div className="table-empty">No appointments match this view.</div>;
  }

  return (
    <div className="appt-table-wrap">
      <table className="appt-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Patient</th>
            <th>Phone</th>
            <th>Department</th>
            <th>Technician</th>
            <th>Priority</th>
            <th>Status</th>
            <th aria-label="Actions"></th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appt) => (
            <tr key={appt.id}>
              <td className="mono">{appt.appointment_time?.slice(0, 5)}</td>
              <td>{appt.patient_name}</td>
              <td className="mono">{appt.patient_phone}</td>
              <td>{appt.department}</td>
              <td>{appt.technician_name || "Unassigned"}</td>
              <td>
                {appt.priority === "Urgent" ? (
                  <span className="badge badge--urgent">Urgent</span>
                ) : (
                  <span className="muted">Normal</span>
                )}
              </td>
              <td>
                <span className={`badge ${STATUS_STYLES[appt.status]}`}>{appt.status}</span>
              </td>
              <td className="appt-actions">
                {STATUS_FLOW[appt.status]?.map((action) => (
                  <button
                    key={action.next}
                    className="appt-action-btn"
                    onClick={() => onStatusChange(appt.id, action.next)}
                  >
                    {action.label}
                  </button>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
