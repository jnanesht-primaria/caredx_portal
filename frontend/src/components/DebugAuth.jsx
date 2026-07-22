// frontend/src/components/DebugAuth.jsx
import { useEffect, useState } from 'react';

export default function DebugAuth() {
  const [authData, setAuthData] = useState({});

  useEffect(() => {
    const data = {
      token: localStorage.getItem('caredx_token'),
      token2: localStorage.getItem('token'),
      user: localStorage.getItem('caredx_user'),
      role: localStorage.getItem('caredx_role'),
      name: localStorage.getItem('caredx_name'),
    };
    setAuthData(data);
    console.log('Auth Debug Data:', data);
  }, []);

  return (
    <div style={{ padding: '10px', background: '#f0f0f0', margin: '10px', borderRadius: '4px' }}>
      <h4>Auth Debug Info</h4>
      <pre style={{ fontSize: '12px' }}>
        {JSON.stringify(authData, null, 2)}
      </pre>
    </div>
  );
}