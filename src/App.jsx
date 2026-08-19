import "./App.css";
import HomePage from "./pages/homePage";
import LoginPage from "./pages/loginPage";
import RegisterPage from "./pages/registerPage";
import { Route, Routes } from "react-router-dom";
import AdminPage from "./pages/adminPage";
import TestPage from "./pages/testPage";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState, useRef } from "react";
import api from "./lib/api";
import UserContext from "./context/userContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ResetPasswordPage from "./pages/resetPassword";

function App() {
	const [user, setUser] = useState(null);
	const [userLoadingFinished, setUserLoadingFinished] = useState(false);
	const toastshown = useRef(false);

	useEffect(() => {
		const token = localStorage.getItem("token");

	if (toastshown.current) return;
		toastshown.current = true;

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
				toast.error("Please login");
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
				<div className="relative min-h-screen w-full bg-primary text-secondary antialiased selection:bg-accent selection:text-white overflow-x-hidden">
        		<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#00008008_1px,transparent_1px),linear-gradient(to_bottom,#00008008_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
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