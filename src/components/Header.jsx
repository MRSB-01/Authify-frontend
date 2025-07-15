import { Link, useNavigate } from "react-router-dom";
import "../../src/App.css";
import { motion } from "framer-motion";
import { FaLongArrowAltRight } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";

const Header = () => {
    const navigate = useNavigate();
    const [showButton, setShowButton] = useState(false);


    useEffect(() => {
        const timer = setTimeout(() => {
            setShowButton(true);
        }, 4000);
        return () => clearTimeout(timer);
    }, []);

    const { userData } = useContext(AppContext);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-white to-blue-200 px-4 border-t border-blue-300">
            <div className="flex flex-col justify-center items-center space-y-6">

                <motion.div
                    className="-mt-40 rotate-6"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 120, damping: 10 }}
                >
                    <img
                        src="/image.png"
                        alt="Product Logo"
                        className="w-40 h-40 rounded-full shadow-xl hover:scale-110 transition-transform duration-500"
                    />
                </motion.div>


                <div className="text-center space-y-2">
                    <motion.h1
                        className="text-3xl font-medium"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        Hey {userData ? userData.name : "Developer"} 👋
                    </motion.h1>
                    <motion.h1
                        className="font-bold text-5xl text-sky-700"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.3 }}
                    >
                        Welcome to our product
                    </motion.h1>
                </div>


                <div className="mt-5">
                    <p className="text-gray-800 tracking-wide text-lg overflow-hidden whitespace-nowrap border-r-2 border-black w-fit animate-typing">
                        Let's start with a quick product tour and you can setup the authentication in no time!
                    </p>
                </div>


                {showButton && !userData && (
                    <motion.div
                        onClick={() => navigate("/login")}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                        className="flex items-center gap-2 text-black border py-2 px-4 rounded-full hover:bg-gray-800 hover:text-white transform transition duration-300 ease-in-out hover:scale-105 active:scale-95 cursor-pointer"
                    >
                        Get started <FaLongArrowAltRight />
                    </motion.div>
                )}

            </div>
        </div>
    );
};

export default Header;
