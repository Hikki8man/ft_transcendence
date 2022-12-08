import axios from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { baseUrl } from "../../env";
import { leave2fa, loginSuccess } from "../../Redux/AuthSlice";
import { useAppDispatch, useAppSelector } from "../../Redux/Hooks";
import { LoginPayload } from "../../Types/User-Types";
import { TokenStorageInterface } from "../../Types/Utils-Types";

function CodeVerification() {
    const {register, handleSubmit, setError, formState: {errors}, watch} = useForm<{code: string}>();
    const { verification2FA } = useAppSelector(state => state.auth);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const location = useLocation();
    const codeWatch = watch("code");

    useEffect(() => {
        if (!location.state || !verification2FA)
            navigate('/sign');

        return () => {
            dispatch(leave2fa());
        }
    }, []);

    useEffect(() => {
        if (codeWatch && codeWatch.length === 6) {
            axios.post(`${baseUrl}/2fa/authenticate`, {code: codeWatch}, {
                headers: {
                    "Authorization": `Bearer ${locationState.access_2fa_token}`,
                }
            })
            .then(response => {
                console.log("Response Authenticate", response);
                const payload: LoginPayload = {
                    token: response.data.access_token,
                    user: response.data.user,
                }
                const tokenStorage: TokenStorageInterface = {
                    access_token: response.data.access_token,
                    refresh_token: response.data.refresh_token,
                }
                localStorage.setItem("userToken", JSON.stringify(tokenStorage));
                dispatch(loginSuccess(payload));
            })
            .catch(err => {
                console.log("ERR Authenticate", err);
                setError("code", {message: "Code Incorrect"});
            });
        }
    }, [codeWatch])
    
    const locationState = location.state as {access_2fa_token: string};
    
    const codeSubmmit = handleSubmit((data, e) => {
        e?.preventDefault();
    })

    return (
        <div className="sign-container">
            <div className="auth-wrapper">
                <div>
                    <h2 className="title-verification"> Verification Code </h2>
                    <p className="txt-verification"> Veillez rentrer le code afficher sur Google Authenticator </p>
                </div>
                <form className="validation-form-wrapper" onSubmit={codeSubmmit}>
                    { errors.code && <p className='txt-form-error'> {errors.code.message} </p> }
                    <input
                        className="code-input"
                        type="text"
                        maxLength={6}
                        {...register("code", {
                            required: "Code is required",
                            minLength: {value: 6, message: "Code should have a length of 6"}
                        })}
                    />
                    <button> Valider </button>
                </form>
            </div>
        </div>
    );
}

export default CodeVerification;