import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import * as Yup from 'yup';
import axios from 'axios';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Formik, Form, Field } from "formik";

import library from "../assets/Library-1.jpg";
import LibraryLogo from '../components/LibraryLogo';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const pwdRgx = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const initialValues = {
        name: "",
        email: "",
        password: "",
        confirm_password: "",
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        email: Yup.string()
            .email('Please use a valid email format')
            .required('Email is required'),
        password: Yup.string().matches(pwdRgx, 'At least 8 chars, 1 caps, 1 number, and no symbol'
        ).required('Password is required'),
        confirm_password: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Confirm Password is required'),
    });

    const handleSubmit = async (values, { setSubmitting, resetForm, setStatus }) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/register`, values);

            if (response.status === 201) {
                resetForm();
                setStatus({ success: true, message: 'Sign up successful!' });
                setTimeout(() => {
                    navigate("/login");
                }, 3000);
            }

        } catch (error) {
            const response = error.response;
            if (response.status === 400) {
                const { errors } = response.data;
                const errorMessage = errors[0].msg;
                setStatus({ success: false, message: errorMessage });
            }

            if (response.status === 500) {
                setStatus({ success: false, message: "Internal Server Error" });
            }
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
                                        <h2 className="w-72 text-center sm:text-5xl font-bold"> SIGN UP </h2>
                                    </div>
                                    <p className="text-base text-center mb-4 sm:text-xl w-96">Please enter your credentials below:</p>
                                    {props.status && props.status.success && (
                                        <p className="text-center text-green-400">{props.status.message}</p>
                                    )}
                                    {props.status && !props.status.success && (
                                        <p className="text-center text-red-400">{props.status.message}</p>
                                    )}
                                    <div className="flex flex-col gap-2 py-4 mb-4">
                                        <div className="relative">
                                            <Field
                                                className="border text-black border-gray-300 text-xl w-full focus:border-amber-700 focus:ring-0"
                                                type="text"
                                                name="name"
                                                placeholder="John"
                                            />
                                            {props.errors.name && props.touched.name && <div className="text-base text-red-400 absolute top-11">{props.errors.name}</div>}
                                        </div>
                                    </div>

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

                                    <div className="flex flex-col gap-2 py-4 mb-4">
                                        <div className="relative">
                                            <Field
                                                className="border text-black border-gray-300 text-xl w-full focus:border-amber-700 focus:ring-0"
                                                type="password"
                                                name="confirm_password"
                                                placeholder="********"
                                            />
                                            {props.errors.confirm_password && props.touched.confirm_password && <div className="text-base text-red-400 absolute top-11">{props.errors.confirm_password}</div>}
                                        </div>
                                    </div>
                                    <button
                                        className="w-1/2 py-2 my-4 h-10 text-base rounded-md bg-amber-700 text-white hover:bg-white hover:text-amber-700 hover:border hover:border-amber-700"
                                        type="submit"
                                        disabled={props.isSubmitting}
                                    >
                                        {props.isSubmitting ? "Loading..." : "Sign Up"}
                                    </button>
                                </Form>
                            )}
                        </Formik>
                        <div className="w-full flex gap-4 justify-center items-center z-50">
                            <div className="font-inter text-base">Don't have an account?</div>
                            <Link
                                to="/login"
                                className="text-base font-bold text-amber-700 hover:text-amber-600"
                            >
                                Log In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
