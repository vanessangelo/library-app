import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import * as Yup from 'yup';
import axios from 'axios';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Formik, Form, Field } from "formik";

import library from "../assets/Library-1.jpg";
import { keep } from "../store/reducer/authSlice";
import LibraryLogo from '../components/LibraryLogo';
import { getOngoingBook, updateIsOngoing } from '../store/reducer/borrowSlice';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const initialValues = {
        email: "",
        password: "",
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string().required("Email is required"),
        password: Yup.string().required("Password is required"),
    });

    const handleSubmit = async (
        values,
        { setSubmitting, setFieldError, resetForm, setStatus }
    ) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/login`, values);
            if (response.status === 200) {
                const { accessToken } = response.data;
                localStorage.setItem("token", accessToken);
                dispatch(keep(response.data));
                resetForm();
                setStatus({ success: true, accessToken });
                const ongoingBook = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/users/ongoing-books`, { headers: { Authorization: `Bearer ${accessToken}` } });
                if (ongoingBook.data.data) {
                    const { data } = ongoingBook.data;
                    if (Object.keys(data).length !== 0) {
                        dispatch(getOngoingBook(data));
                        dispatch(updateIsOngoing(true));
                    }
                }
            }
            navigate("/");
        } catch (error) {
            setFieldError("email", "Incorrect email and/or password");
            setFieldError("password", "Incorrect email and/or password");
            setStatus({ success: false });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className='absolute h-screen grid content-center justify-center w-screen -z-10' style={{
            backgroundImage: `url(${library})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
        }}>
            <div className="h-full w-full bg-black absolute top-0 left-0" style={{ opacity: 0.4 }}></div>
            <div className='grid grid-cols-1 sm:grid-cols-2 xl:px-60 h-full justify-center content-center gap-4 font-inter relative'>
                <div className="h-full w-full bg-black absolute top-0 left-0 opacity-40"></div>
                <LibraryLogo />
                <div className='grid justify-center mb-10 sm:my-10'>
                    <div className="grid text-center p-5 w-full my-10 content-center text-white">
                        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                            {(props) => (
                                <Form className="relative">
                                    <div className="grid justify-center">
                                        <h2 className="w-72 text-center sm:text-5xl font-bold"> LOG IN </h2>
                                    </div>
                                    <p className="text-base text-center mb-4 sm:text-xl">Please enter your email and password:</p>
                                    <div className="flex flex-col gap-2 py-4 mb-4">
                                        <div className="relative">
                                            <Field
                                                className="border text-black border-gray-300 text-xl w-full focus:border-amber-700 focus:ring-0"
                                                type="text"
                                                name="email"
                                                placeholder="john.doe@library.com"
                                            />
                                            {props.errors.email && props.touched.email && <div className="text-base text-red-400 absolute top-11">{props.errors.email}</div>}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 py-4 mb-4">
                                        <div className="relative">
                                            <Field
                                                className="border text-black border-gray-300 text-xl w-full focus:border-amber-700 focus:ring-0"
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                placeholder="********"
                                            />
                                            <div className="absolute right-2 top-1/2 transform pt-1 -translate-y-1/2">
                                                <button
                                                    type="button"
                                                    onClick={toggleShowPassword}
                                                    className="text-gray-500 focus:outline-none"
                                                >
                                                    {showPassword ? (
                                                        <AiOutlineEye size={25} />
                                                    ) : (
                                                        <AiOutlineEyeInvisible size={25} />
                                                    )}
                                                </button>
                                            </div>
                                            {props.errors.password && props.touched.password && <div className="text-base text-red-400 absolute top-11">{props.errors.password}</div>}
                                        </div>
                                    </div>
                                    <button
                                        className="w-1/2 py-2 my-4 h-10 text-base rounded-md bg-amber-700 text-white hover:bg-white hover:text-amber-700 hover:border hover:border-amber-700"
                                        type="submit"
                                        disabled={props.isSubmitting}
                                    >
                                        {props.isSubmitting ? "Loading..." : "Log In"}
                                    </button>
                                </Form>
                            )}
                        </Formik>
                        <div className="w-full flex gap-4 justify-center items-center z-50">
                            <div className="font-inter text-base">Don't have an account?</div>
                            <Link
                                to="/register"
                                className="text-base font-bold text-amber-700 hover:text-amber-600"
                            >
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}