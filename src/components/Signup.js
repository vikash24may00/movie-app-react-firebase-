import React from 'react'
import { useState } from 'react';
import { TailSpin } from "react-loader-spinner";
import { Link } from 'react-router-dom';
import { RecaptchaVerifier, signInWithPhoneNumber, getAuth } from 'firebase/auth'
import app from './firebase/firebase';
import swal from 'sweetalert';
import { addDoc } from 'firebase/firestore';
import { usersref } from './firebase/firebase';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';

const auth = getAuth(app);


const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [otpsent, setOtpsent] = useState(false);
  const [OTP, setOTP] = useState("");

  const generateRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-continer', {
      'size': 'invisible',
      'callback': (response) => {
        // reCAPTCHA solved ,allow signInwithPhoneNumber
      }
    }, auth);
  }

  const requestOTP = () => {
    setLoading(true);
    generateRecaptcha();
    let appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, `+91${form.mobile}`, appVerifier).then(confirmationResult => {
      window.confirmationResult = confirmationResult;
      swal({
        text: "OTP Sent",
        icon: "success",
        buttons: false,
        timer: 3000,
      });
      setOtpsent(true);
      setLoading(false);
    }).catch((error) => {
      console.log(error)
    })
  }

  const verifyOTP = () => {
    try {
      setLoading(true);
      window.confirmationResult.confirm(OTP).then((result) => {
        uploadData();
        swal({
          text: "Successfully Registered",
          icon: "success",
          buttons: false,
          timer: 3000,
        });
        navigate('/login');
        setLoading(false);
      })
    }
    catch (error) {
      console.log(error);
    }
  }

  const uploadData = async () => {
    try{

    const salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(form.password, salt);
    await addDoc(usersref, {
      name: form.name,
      password: hash,
      mobile: form.mobile
    });
  }

  catch(error)
  {
    console.log(error)
  }
  }

  return (
    <div class='w-full flex flex-col mt-8 items-center'>
      <h1 class='text-xl font-bold'>Sign up</h1>

      {otpsent ?
        <>
          <div class="p-2 w-full md:w-1/3">
            <div class="relative">
              <label for="message" class="leading-7 text-sm text-gray-300">
                OTP
              </label>
              <input
                id="message"
                name="message"
                value={OTP}
                onChange={(e) => setOTP(e.target.value)}
                class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
          </div>
          <div class="p-2 w-full">
            <button
              onClick={verifyOTP}
              class="flex mx-auto text-white bg-green-600 border-0 py-2 px-8 focus:outline-none hover:bg-green-700 rounded text-lg"
            >
              {loading ? <TailSpin height={25} color="white" /> : "Confirm OTP"}
            </button>
          </div>

        </>
        :

        <>

          <div class="p-2 w-full md:w-1/3">
            <div class="relative">
              <label for="message" class="leading-7 text-sm text-gray-300">
                Name
              </label>
              <input
                id="message"
                name="message"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
          </div>


          <div class="p-2 w-full md:w-1/3">
            <div class="relative">
              <label for="message" class="leading-7 text-sm text-gray-300">
                Mobile Number
              </label>
              <input
                type={"number"}
                id="message"
                name="message"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
          </div>

          <div class="p-2 w-full md:w-1/3">
            <div class="relative">
              <label for="message" class="leading-7 text-sm text-gray-300">
                Password
              </label>
              <input
                type={'password'}
                id="message"
                name="message"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
          </div>

          <div class="p-2 w-full">
            <button onClick={requestOTP} className="flex mx-auto text-white bg-green-600 border-0 py-2 px-8 focus:outline-none hover:bg-green-700 rounded text-lg">
              {loading ? <TailSpin height={25} color="white" /> : 'Request OTP'}
            </button>
          </div>
        </>}
      <div>
        <p>Already have an account ? <Link to={'/login'}> <span className='text-blue-500'>Login</span></Link></p>
      </div>
      <div id='recaptcha-continer'>

      </div>
    </div>
  )
}

export default Signup