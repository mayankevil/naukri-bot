import { useState } from 'react';
function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h2 className="text-3xl font-semibold">Register</h2>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="border p-2 rounded w-64" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="border p-2 rounded w-64" />
      <button className="bg-green-600 text-white px-4 py-2 rounded">Register</button>
    </div>
  );
}
export default RegisterPage;