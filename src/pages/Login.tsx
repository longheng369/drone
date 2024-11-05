import { Button, Input } from "antd"
import { useState } from "react"

const Login : React.FC = () => {
   const [code, setCode ] = useState<string>('');
   const handleLogin = () => {
      localStorage.setItem('login_code', code);
   }
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <div className="w-[30vw] h-[30vh] border rounded-md flex flex-col items-center justify-center gap-4 px-5">
        <label htmlFor="">Enter Code To Login</label>
         <Input type="text" onChange={(e) => {setCode(e.target.value)}}/>
         <Button onClick={handleLogin}>Login</Button>
      </div>
    </div>
  )
}

export default Login