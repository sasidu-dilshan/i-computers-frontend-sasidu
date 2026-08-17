import "./App.css";
import HomePage from "./pages/homePage";
import LoginPage from "./pages/loginPage";
import RegisterPage from "./pages/registerPage";
import { Route, Routes } from "react-router-dom";
import AdminPage from "./pages/adminPage";
import TestPage from "./pages/testPage";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import api from "./lib/api";
import UserContext from "./context/userContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ResetPasswordPage from "./pages/resetPassword";
function App() {
	const [user, setUser] = useState(null);
	const [userLoadingFinished, setUserLoadingFinished] = useState(false);

	useEffect(() => {
		const token = localStorage.getItem("token");

		api
			.get("/users/me", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((res) => {
				setUser(res.data.user);
				setUserLoadingFinished(true);
			})
			.catch(() => {
				toast.error("Please login again");
				localStorage.removeItem("token");
				setUser(null);
				setUserLoadingFinished(true);
			});
	}, []);

	return (
		<GoogleOAuthProvider clientId="283549826650-na88ngb9k3biaj55bgs46i1i5u70cjo6.apps.googleusercontent.com">
			<UserContext
				value={{
					user: user,
					setUser: setUser,
			userLoadingFinished: userLoadingFinished,
				}}
			>
				<div className="w-full h-screen bg-primary">
					<Toaster position="top-right" />
					<Routes>
						<Route path="/*" element={<HomePage />} />
						<Route path="/login" element={<LoginPage />} />
						<Route path="/register" element={<RegisterPage />} />
						<Route path="/reset-password" element={<ResetPasswordPage />} />
						<Route path="/admin/*" element={<AdminPage />} />
						<Route path="/test" element={<TestPage />} />
					</Routes>
				</div>
			</UserContext>
		</GoogleOAuthProvider>
	);
}

export default App;