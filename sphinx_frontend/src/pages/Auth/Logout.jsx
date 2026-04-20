import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useAPI from "../../hooks/useAPI";
import { authActions } from "../../store/AuthReducer";
import { successToast } from "../../utils/toast";

function Logout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { apiGet } = useAPI();

  const logout = async () => {
    await apiGet("/api/auth/logout");
  };

  useEffect(() => {
    logout();
    dispatch(authActions.logout());
    navigate("/login");
    successToast("Signed Out Successfully!");
  }, []);

  return <div></div>;
}

export default Logout;
