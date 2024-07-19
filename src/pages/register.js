import { useState, useEffect } from "react";
import { Logo, FormRow } from "../components";
import Wrapper from "../assets/wrappers/RegisterPage";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  registerUser,
  toggleSidebar,
} from "../features/user/userSlice";
import { useNavigate } from "react-router-dom";
import {
  clearCurrentProjectState,
  getProjectMembers,
  getProjectTasks,
  setCurrentProject,
} from "../features/currentProject/currentProjectSlice";

const initialState = {
  name: "",
  email: "",
  password: "",
  isLogin: true,
};

function Register() {
  const [values, setValues] = useState(initialState);
  const { user, isLoading } = useSelector((store) => store.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isSidebarOpen } = useSelector((store) => store.user);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    
    setValues({ ...values, [name]: value });
  };



  const onSubmit = (e) => {
    e.preventDefault();
    const { name, email, password, isLogin } = values;
    if (!email || !password || (!isLogin && !name)) {
      toast.error("Please fill in all the fields!");
      return;
    }
    // test if email is valid or not 
    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email)) {
      toast.error("Please enter a valid email address!");
      return;
    }
    // test if password is valid or not
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return;
    }

    if (isLogin) {
      dispatch(loginUser({ email: email, password: password }));
      dispatch(toggleSidebar());
      return;
    }
    dispatch(registerUser({ name, email, password }));
  };

  const toggleMember = () => {
    setValues({ ...values, isLogin: !values.isLogin });
  };
  useEffect(() => {
    if (user) {
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  }, [user]);
  return (
    <Wrapper className="full-page">
      <form className="form" onSubmit={onSubmit}>
        <Logo />
        <h3>{values.isLogin ? "Login" : "Register"}</h3>
        {/* name field */}
        {!values.isLogin && (
          <FormRow
            type="text"
            name="name"
            value={values.name}
            handleChange={handleChange}
          />
        )}
        {/* email field */}
        <FormRow
          type="email"
          name="email"
          value={values.email}
          handleChange={handleChange}
        />
        {/* password field */}
        <FormRow
          type="password"
          name="password"
          value={values.password}
          handleChange={handleChange}
        />
        <button type="submit" className="btn btn-block" disabled={isLoading}>
          {isLoading ? "loading..." : "submit"}
        </button>
        <button
          type="button"
          className="btn btn-block btn-hipster"
          disabled={isLoading}
          onClick={() => {
            dispatch(loginUser({ email: "allam@gmail.com", password: "123" }));
            toggleSidebar();
          }}
        >
          {isLoading ? "loading..." : "demo app"}
        </button>
        <p>
          {values.isLogin ? "Not a member yet?" : "Already a member?"}
          <button type="button" onClick={toggleMember} className="member-btn">
            {values.isLogin ? "Register" : "Login"}
          </button>
        </p>
      </form>
    </Wrapper>
  );
}
export default Register;
