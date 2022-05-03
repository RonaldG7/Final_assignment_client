import {useState, useRef} from 'react';
import {useNavigate} from "react-router-dom";
import "./style.css"
import http from "../../plugins/http";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import Button from "@mui/material/Button";

const RegisterComp = () => {

    const [status, setStatus] = useState(null)
    const [values, setValues] = useState({
        password: '',
        showPassword: false,
    })
    const [valuesRepeat, setValuesRepeat] = useState({
        password: '',
        showPassword: false,
    })

    const nav = useNavigate()
    const username = useRef()
    const email = useRef()
    const password = useRef()
    const passwordTwo = useRef()

    async function handleRegister() {
        if (4 > username.current.value.length) return setStatus("Username too short")
        if (username.current.value.length > 20) return setStatus("Username too long")
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email.current.value)) return setStatus("Check email please")
        if (4 > password.current.value.length) return setStatus("Password too short")
        if (password.current.value !== passwordTwo.current.value) return setStatus("Passwords don`t match")

        const user = {
            username: username.current.value,
            email: email.current.value,
            password: password.current.value,
            passwordTwo: passwordTwo.current.value
        }
        const register = await http.post("/register", user)
            if (register.success) {
                setStatus(null)
                nav("/login")
            } else {
                setStatus(register.message)
            }
    }

    const handleChange = (prop) => (event) => {
        setValues({...values, [prop]: event.target.value});
    }

    const handleClickShowPassword = () => {
        setValues({
            ...values,
            showPassword: !values.showPassword,
        })
    }

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    }

    const handleChangeRepeat = (prop) => (event) => {
        setValuesRepeat({...valuesRepeat, [prop]: event.target.value});
    }

    const handleClickShowPasswordRepeat = () => {
        setValuesRepeat({
            ...valuesRepeat,
            showPassword: !valuesRepeat.showPassword,
        })
    }

    const handleMouseDownPasswordRepeat = (event) => {
        event.preventDefault();
    }

    return (
        <div className="app d-flex justify-content-center align-items-center">
            <div className="form d-flex flex-column align-items-center">
                <h3 className="regTextColor">Register</h3>
                <Box
                    component="form"
                    sx={{
                        '& .MuiTextField-root': {
                            m: 1, width: '40ch',
                            display: 'flex', flexWrap: 'wrap'
                        }
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <div>
                        <TextField
                            inputRef={username}
                            id="outlined-textarea-username"
                            label="Enter Username"
                            placeholder="Username"
                            multiline
                        />
                    </div>
                    <div>
                        <TextField
                            inputRef={email}
                            id="outlined-textarea-email"
                            label="Enter Email"
                            placeholder="Email"
                            multiline
                        />
                    </div>
                    <div className="d-flex flex-column">
                        <FormControl sx={{m: 1, width: '40ch'}} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                            <OutlinedInput
                                inputRef={password}
                                id="outlined-adornment-password"
                                type={values.showPassword ? 'text' : 'password'}
                                value={values.password}
                                onChange={handleChange('password')}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {values.showPassword ? <VisibilityOff/> : <Visibility/>}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                            />
                        </FormControl>
                        <FormControl sx={{m: 1, width: '40ch'}} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password-repeat">Repeat Password</InputLabel>
                            <OutlinedInput
                                inputRef={passwordTwo}
                                id="outlined-adornment-password-repeat"
                                type={valuesRepeat.showPassword ? 'text' : 'password'}
                                value={valuesRepeat.password}
                                onChange={handleChangeRepeat('password')}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPasswordRepeat}
                                            onMouseDown={handleMouseDownPasswordRepeat}
                                            edge="end"
                                        >
                                            {valuesRepeat.showPassword ? <VisibilityOff/> : <Visibility/>}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Repeat Password"
                            />
                        </FormControl>
                    </div>
                </Box>
                <div>
                    <Button variant="outlined" onClick={() => nav(-1)}>Go Back</Button>
                    <Button sx={{marginLeft: "10px"}} variant="outlined" onClick={handleRegister}>Submit</Button>
                </div>
                {status && <p className="status">{status}</p>}
            </div>
        </div>
    );
};

export default RegisterComp;