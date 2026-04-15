import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authActions } from "../../store/AuthReducer";
import { successToast } from "../../utils/toast";

function Logout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authActions.logout());
    navigate("/");
    successToast("Signed Out Successfully!");
  }, []);

  return <div></div>;
}

export default Logout;
