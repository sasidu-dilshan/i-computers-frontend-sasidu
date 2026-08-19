import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useGoogleLogin } from "@react-oauth/google";
import UserContext from "../context/userContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const userData = useContext(UserContext);
  const navigate = useNavigate();

  const googleLogin = useGoogleLogin({
    onSuccess: (response) => {
      console.log(response);
      console.log(response.access_token);

      api
        .post("/users/google", {
          accessToken: response.access_token,
        })
        .then((res) => {
          console.log(res);
          toast.success("Login successful");
          
          // Token එක සහ User Object එක localStorage එකේ save කිරීම
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));

          userData.setUser(res.data.user);

          if (res.data.isAdmin) {
            navigate("/admin");
          } else {
            navigate("/");
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error("Google Login failed");
        });
    },
    onError: (error) => {
      console.log(error);
      toast.error("Google Login failed");
    },
  });

  function handleLogin() {
    api
      .post("/users/login", {
        email: email,
        password: password,
      })
      .then((res) => {
        toast.success("Login successful");

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        userData.setUser(res.data.user);

        if (res.data.isAdmin) {
          navigate("/admin", { replace: true });
        } else {
          navigate("/");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Login failed");
      });
  }

  return (
    <div className="min-h-screen w-full bg-slate-950 bg-[url('/bg.jpg')] bg-cover bg-center flex justify-center items-center p-4 relative overflow-hidden font-sans">

      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-0" />

      <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-slate-900/60 border border-white/10 backdrop-blur-2xl shadow-2xl rounded-3xl p-8 flex flex-col items-center gap-5">

        <div className="flex flex-col items-center gap-3 w-full">
          <div className="p-2 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
            <img src="logo-white.png" alt="Logo" className="w-28 h-12 object-contain" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome Back
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Enter your credentials to access your account
            </p>
          </div>
        </div>

        <div className="w-full flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono text-slate-300 uppercase tracking-wider">
              Email Address
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="w-full h-11 bg-slate-950/80 border border-white/10 rounded-xl px-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-200"
              placeholder="user@gmail.com"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-mono text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <Link
                to="/reset-password"
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                Forgot?
              </Link>
            </div>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="w-full h-11 bg-slate-950/80 border border-white/10 rounded-xl px-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-200"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          onClick={handleLogin}
          className="w-full h-11 bg-accent hover:opacity-90 active:scale-[0.99] text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-accent/20 cursor-pointer mt-2"
        >
          Sign In
        </button>

        <div className="w-full flex items-center my-1">
          <div className="flex-1 border-t border-white/10" />
          <span className="px-3 text-[10px] font-mono uppercase text-slate-500 tracking-wider">
            OR
          </span>
          <div className="flex-1 border-t border-white/10" />
        </div>

        <button
          onClick={googleLogin}
          className="w-full h-11 bg-slate-950/80 hover:bg-slate-800 border border-white/10 text-slate-200 font-medium text-sm rounded-xl transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer"
        >
          <FcGoogle className="text-xl" />
          <span>Continue with Google</span>
        </button>

        <p className="text-xs text-slate-400 text-center mt-2">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-white hover:underline font-semibold transition-colors ml-1"
          >
            Register here
          </Link>
        </p>

      </div>
    </div>
  );
}

// import { useContext, useState } from "react";
// import toast from "react-hot-toast";
// import { FcGoogle } from "react-icons/fc";
// import { Link, useNavigate } from "react-router-dom";
// import api from "../lib/api";
// import { useGoogleLogin } from "@react-oauth/google";
// import UserContext from "../context/userContext";

// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const userData = useContext(UserContext);
//   const navigate = useNavigate();

//   const googleLogin = useGoogleLogin({
//     onSuccess: (response) => {
//       console.log(response);
//       console.log(response.access_token);

//       api
//         .post("/users/google", {
//           accessToken: response.access_token,
//         })
//         .then((res) => {
//           console.log(res);
//           toast.success("Login successful");
//           localStorage.setItem("token", res.data.token);

//           userData.setUser(res.data.user);

//           if (res.data.isAdmin) {
//             navigate("/admin");
//           } else {
//             navigate("/");
//           }
//         })
//         .catch((err) => {
//           console.log(err);
//           toast.error("Google Login failed");
//         });
//     },
//     onError: (error) => {
//       console.log(error);
//       toast.error("Google Login failed");
//     },
//   });

//   function handleLogin() {
//     api
//       .post("/users/login", {
//         email: email,
//         password: password,
//       })
//       .then((res) => {
//         toast.success("Login successful");

//         localStorage.setItem("token", res.data.token);

//         userData.setUser(res.data.user);

//         if (res.data.isAdmin) {
//           navigate("/admin", { replace: true });
//         } else {
//           navigate("/");
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//         toast.error("Login failed");
//       });
//   }

//   return (
//     <div className="min-h-screen w-full bg-slate-950 bg-[url('/bg.jpg')] bg-cover bg-center flex justify-center items-center p-4 relative overflow-hidden font-sans">

//       <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-0" />

//       <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
//       <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

//       <div className="relative z-10 w-full max-w-md bg-slate-900/60 border border-white/10 backdrop-blur-2xl shadow-2xl rounded-3xl p-8 flex flex-col items-center gap-5">

//         <div className="flex flex-col items-center gap-3 w-full">
//           <div className="p-2 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
//             <img src="logo-white.png" alt="Logo" className="w-28 h-12 object-contain" />
//           </div>
//           <div className="text-center">
//             <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
//               Welcome Back
//             </h1>
//             <p className="text-xs text-slate-400 mt-1">
//               Enter your credentials to access your account
//             </p>
//           </div>
//         </div>

//         <div className="w-full flex flex-col gap-4 mt-2">
//           <div className="flex flex-col gap-1.5">
//             <label className="text-xs font-mono text-slate-300 uppercase tracking-wider">
//               Email Address
//             </label>
//             <input
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               type="email"
//               className="w-full h-11 bg-slate-950/80 border border-white/10 rounded-xl px-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-200"
//               placeholder="user@gmail.com"
//             />
//           </div>

//           <div className="flex flex-col gap-1.5">
//             <div className="flex justify-between items-center">
//               <label className="text-xs font-mono text-slate-300 uppercase tracking-wider">
//                 Password
//               </label>
//               <Link
//                 to="/reset-password"
//                 className="text-xs text-slate-400 hover:text-white transition-colors"
//               >
//                 Forgot?
//               </Link>
//             </div>
//             <input
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               type="password"
//               className="w-full h-11 bg-slate-950/80 border border-white/10 rounded-xl px-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-200"
//               placeholder="••••••••"
//             />
//           </div>
//         </div>

//         <button
//           onClick={handleLogin}
//           className="w-full h-11 bg-accent hover:opacity-90 active:scale-[0.99] text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-accent/20 cursor-pointer mt-2"
//         >
//           Sign In
//         </button>

//         <div className="w-full flex items-center my-1">
//           <div className="flex-1 border-t border-white/10" />
//           <span className="px-3 text-[10px] font-mono uppercase text-slate-500 tracking-wider">
//             OR
//           </span>
//           <div className="flex-1 border-t border-white/10" />
//         </div>

//         <button
//           onClick={googleLogin}
//           className="w-full h-11 bg-slate-950/80 hover:bg-slate-800 border border-white/10 text-slate-200 font-medium text-sm rounded-xl transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer"
//         >
//           <FcGoogle className="text-xl" />
//           <span>Continue with Google</span>
//         </button>

//         <p className="text-xs text-slate-400 text-center mt-2">
//           Don't have an account?{" "}
//           <Link
//             to="/register"
//             className="text-white hover:underline font-semibold transition-colors ml-1"
//           >
//             Register here
//           </Link>
//         </p>

//       </div>
//     </div>
//   );
// }