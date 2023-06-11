import React, { useContext, useEffect, useState } from 'react'
import ReactStars from 'react-stars'
import { reviewsref, db } from './firebase/firebase'
import { addDoc, doc, updateDoc, query, where, getDocs } from 'firebase/firestore'
import { TailSpin, ThreeDots } from 'react-loader-spinner'
import swal from 'sweetalert'
import { Appstate } from '../App'
import { useNavigate } from 'react-router-dom'


const Reviews = ({ id, prevRating, userRated }) => {

  const navigate = useNavigate();
  const useAppstate = useContext(Appstate);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState("");
  const [data, setData] = useState([]);
  const [reviewloading, setReviewsloading] = useState(false);
  const [newadded, setNewadded] = useState(0);

  const sendreview = async () => {

    setLoading(true);

    try {
      if (useAppstate.login) {
        await addDoc(reviewsref, {
          movieid: id,
          name: useAppstate.userName,
          rating: rating,
          thought: form,
          timestamp: new Date().getTime()
        })

        const ref = doc(db, "movies", id);
        await updateDoc(ref, {
          rating: prevRating + rating,
          rated: userRated + 1
        })

        setRating(0);
        setForm("");
        setNewadded(newadded + 1);

        swal({
          title: "Review Sent",
          icon: "success",
          buttons: false,
          timer: 3000
        })
      }
      else {
        navigate('/login')
      }
    }
    catch (error) {
      swal({
        title: error.message,
        icon: "error",
        buttons: false,
        timer: 3000
      })
    }
    setLoading(false);
  }

  useEffect(() => {
    async function getData() {
      setReviewsloading(true);
      setData([]);
      let quer = query(reviewsref, where('movieid', '==', id))
      const querySnapshot = await getDocs(quer);

      querySnapshot.forEach((doc) => {
        setData((prev) => [...prev, doc.data()])
      })

      setReviewsloading(false);
    }
    getData();
  }, [newadded])

  return (
    <div className='mt-4 border-t-2 border-graay-700 w-full'>
      <ReactStars
        size={30}
        half={true}
        value={rating}
        onChange={(rate) => setRating(rate)}
      />
      <input value={form} onChange={(e) => setForm(e.target.value)} type="text" placeholder='share your thoughts...' className='w-full p-2 otuline-none header' />
      <button onClick={sendreview} className="bg-green-600 flex justify-center w-full p-2">
        {loading ? <TailSpin height={20} color='white' /> : 'Share'}
      </button>

      {
        reviewloading ?
          <div className='mt-6 flex justify-center'> <ThreeDots height={10} color='white' /> </div>
          :
          <div className='mt-4 '>
            {
              data.map((e, i) => {
                return (
                  <div className=' p-2 w-full header bg-opacity-50 border-gray-600 border-b mt-2' key={i}>
                    <div className='flex items-center'>
                      <p className='text-blue-500'>{e.name}</p>
                      <p className='ml-3 text-xs'>({new Date(e.timestamp).toLocaleString()})</p>
                    </div>
                    <ReactStars
                      size={15}
                      half={true}
                      value={e.rating}
                      edit={false}
                    />
                    <p className=''>{e.thought}</p>
                  </div>
                )
              })}
          </div>
      }
    </div>
  )
}

export default Reviews