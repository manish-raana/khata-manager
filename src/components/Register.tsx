import React from 'react'

const RegisterComponent = () => {
  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="flex flex-col items-start justify-center gap-4">
        <p>Register</p>
        <input className="input input-bordered" type="email" placeholder="Email" />
        <input className="input input-bordered" type="password" placeholder="password" />
        <button className="btn">Register</button>
      </div>
    </div>
  );
}

export default RegisterComponent;