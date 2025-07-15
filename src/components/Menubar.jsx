import { useContext, useEffect, useRef, useState } from "react";
import { FaLongArrowAltRight } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from "../context/AppContext";
import { MdLockReset, MdOutlineLogout } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";

const Menubar = () => {

    const { userData, backendURL, setIsLoggedIn, setUserData } = useContext(AppContext);

    const navigate = useNavigate();

    const [dropDownOpen, setDropDownOpen] = useState(false);
    const dropDownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
                setDropDownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            axios.defaults.withCredentials = true;
            const response = await axios.post(`${backendURL}/logout`);
            if (response.status === 200) {
                setIsLoggedIn(false);
                setUserData(false);
                navigate("/");
                toast.success("Logout successfully.");
            }


        } catch (error) {
            toast.error(error?.response?.data?.message);
            console.log(error?.message);
        }
    }

    const sendVerificationOtp = async () => {

        try {
            axios.defaults.withCredentials = true;
            const response = await axios.post(`${backendURL}/send-otp`);
            if (response.status === 200) {
                navigate("email-verify");
                toast.success("OTP has been sent successfully.")
            } else {
                toast.error("Unable to send OTP!")
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    const goToResetPassword = () => {
        navigate("/reset-password");
    }


    return (
        <div className="">
            <nav className='px-5 w-full bg-blue-50 py-4 flex justify-between items-center'>
                <div className='flex items-center gap-2 cursor-pointer'>
                    <img onClick={() => navigate('/')} src={'/public/logo.png'} alt="Logo" width={32} height={32} />
                    <span onClick={() => navigate('/')} className='text-2xl font-semibold'>Authify</span>
                </div>

                {
                    userData ? (
                        <div className="relative" ref={dropDownRef}>
                            {/* Avatar Circle */}
                            <div
                                className="bg-blue-600 text-white font-semibold rounded-full flex justify-center items-center h-10 w-10 cursor-pointer shadow hover:scale-105 transition-transform"
                                onClick={() => setDropDownOpen((prev) => !prev)}
                            >
                                {userData.name[0].toUpperCase()}
                            </div>

                            {/* Dropdown */}
                            {dropDownOpen && (
                                <div className="absolute top-12 right-0 z-50 w-48 bg-white shadow-lg rounded-xl py-2 border border-gray-100 animate-fade-in">
                                    {!userData.isAccountVerified && (
                                        <div onClick={sendVerificationOtp} className="px-4 py-2 text-sm text-gray-800 hover:bg-yellow-50 rounded-lg cursor-pointer">
                                            <span>📩 Verify Email</span>
                                        </div>
                                    )}
                                    <div
                                        className="px-4 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg cursor-pointer flex items-center gap-2"
                                        onClick={goToResetPassword}
                                    >
                                        <MdLockReset className="text-lg" />

                                        Reset Password
                                    </div>
                                    <div
                                        className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg cursor-pointer flex items-center gap-2"
                                        onClick={handleLogout}
                                    >
                                        <MdOutlineLogout className="text-lg" />
                                        Logout
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div
                            onClick={() => navigate("/login")}
                            className="flex items-center gap-2 border py-2 px-4 rounded-full text-black hover:bg-gray-800 hover:text-white transition-all duration-300 ease-in-out cursor-pointer"
                        >
                            <Link to="/login" className="flex items-center gap-2">
                                Login <FaLongArrowAltRight />
                            </Link>
                        </div>
                    )
                }



            </nav>
        </div>
    )
}

export default Menubar