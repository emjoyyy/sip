import {useState} from "react";

export default function Login(){

 const[email,setEmail]=useState("");
 const[password,setPassword]=useState("");
 const[loading,setLoading]=useState(false);
 const[error,setError]=useState("");

 const handleLogin = async()=>{
  setLoading(true);
  setError("");

  try {
   const response = await fetch("http://localhost:3000/login",{
    method:"POST",
    headers:{
     "Content-Type":"application/json"
    },
    body:JSON.stringify({
     email,
     password
    })
   });

   if(!response.ok){
    const errorMsg = await response.text();
    setError(errorMsg);
    return;
   }

   alert("Login successful!");
  } catch(err){
   setError("Connection failed. Check if server is running.");
  } finally {
   setLoading(false);
  }
 };

 return(
  <div>
   <h1>Login</h1>

   {error && <p style={{color:"red"}}>{error}</p>}

   <input
    placeholder="Email"
    value={email}
    onChange={(e)=>setEmail(e.target.value)}
   />

   <input
    type="password"
    placeholder="Password"
    value={password}
    onChange={(e)=>setPassword(e.target.value)}
   />

   <button onClick={handleLogin} disabled={loading}>
    {loading ? "Loading..." : "Login"}
   </button>

  </div>
 );
}