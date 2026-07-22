caredx/
├── backend/
│   ├── app/
│   │   ├── __init__.py                  # app factory, registers blueprints
│   │   ├── config.py                    # env-driven config (DB, JWT, CORS)
│   │   ├── extensions.py                # shared Flask extensions (CORS)
│   │   ├── models/
│   │   │   ├── user.py                  # find_user_by_email/id, db connection
│   │   │   ├── patient.py               # create/search/get patient
│   │   │   └── appointment.py           # create/list/update status, dashboard_stats
│   │   ├── routes/
│   │   │   ├── auth_routes.py           # POST /api/auth/login, GET /api/auth/me
│   │   │   ├── admin_routes.py          # GET /api/admin/dashboard      (Admin only)
│   │   │   ├── technician_routes.py     # GET /api/technician/dashboard (Technician only)
│   │   │   └── receptionist_routes.py   # dashboard-stats, appointments, patients
│   │   └── utils/
│   │       ├── security.py              # bcrypt hashing, JWT issue/decode
│   │       └── decorators.py            # @token_required, @roles_required(...)
│   ├── database/schema.sql              # users, patients, appointments
│   ├── run.py                           # entry point → create_app()
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   ├── axiosClient.js           # fetch wrapper (GET/POST/PUT/PATCH/DELETE + auth header)
    │   │   ├── auth.js                  # loginRequest(), fetchCurrentUser()
    │   │   └── receptionist.js          # stats/appointments/patients calls
    │   ├── context/
    │   │   └── AuthContext.jsx          # global user/token state + login()/logout()
    │   ├── routes/
    │   │   ├── AppRoutes.jsx            # all route definitions
    │   │   └── ProtectedRoute.jsx       # redirects if not logged in / wrong role
    │   ├── components/
    │   │   └── receptionist/
    │   │       ├── StatCard.jsx
    │   │       ├── AppointmentsTable.jsx
    │   │       ├── PatientModal.jsx
    │   │       └── BookAppointmentModal.jsx
    │   ├── pages/
    │   │   ├── Login.jsx / .css
    │   │   ├── NotFound.jsx
    │   │   ├── Unauthorized.jsx
    │   │   ├── admin/Dashboard.jsx
    │   │   ├── technician/Dashboard.jsx
    │   │   └── receptionist/
    │   │       ├── Dashboard.jsx        # full-featured front-desk dashboard
    │   │       └── Dashboard.css
    │   ├── App.jsx                      # Router + AuthProvider
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── .env.example