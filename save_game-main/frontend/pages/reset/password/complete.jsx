import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import userService from "../../../service/userService";

export default function complete() {
  const router = useRouter();
  const { uidb64 } = router.query;
  const { token } = router.query;
  const [msg, setMsg] = useState("");

  const [isValidToken, setIsValidToken] = useState(null);

  const handleChangePass = async () => {
    try {
      const data = await userService.changePassword({
        uidb64,
        token,
        password,
      });
      router.push("congratulations/");
    } catch (e) {}
  };

  const handleChangeInput = (e) => {
    setPassword(e.target.value);
    setMsg("");
  };

  const checkChangePassword = async () => {
    console.log(uidb64);
    console.log(token);
    const res = await userService.checkChangePassword({ uidb64, token });

    if (res.status === 400) {
      setIsValidToken(false);
      setMsg(res.data.error);
    }
    if (res.status === 200) {
      setIsValidToken(res.data.canResetPassword);
    }
    // setIsValidToken(data.canResetPassword);
  };

  useEffect(async () => {
    if (token === undefined) return;
    await checkChangePassword();
  }, [token]);

  const [password, setPassword] = useState("");
  return (
    <div>
      <div className="form-main-outer">
        <form className="container">
          {isValidToken === null && <h3>Loading...</h3>}
          {isValidToken ? (
            <>
              <h1> Enter New Password</h1>
              <input
                onChange={(e) => handleChangeInput(e)}
                placeholder="Enter your new password"
                type="password"
              />
              <button
                onClick={handleChangePass}
                type="button"
                className="btn"
                value="ResetButton"
              >
                Change Password
              </button>
              {msg}
            </>
          ) : (
            <>
              <h1>Token invalid</h1>
              <p> {msg} </p>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
