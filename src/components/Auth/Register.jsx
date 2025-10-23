import React, {useState} from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../../firebase'
import { doc, setDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

export default function Register(){
  const [phone,setPhone]=useState('')
  const [password,setPassword]=useState('')
  const [hardware,setHardware]=useState('')
  const [owner,setOwner]=useState('')
  const [address,setAddress]=useState('')
  const [locationActive, setLocationActive] = useState(false)
  const [locationAllowed, setLocationAllowed] = useState(false)
  const navigate = useNavigate()

  const askGeo = async ()=>{
    if(!navigator.geolocation) {
      setLocationAllowed(false)
      return
    }
    navigator.geolocation.getCurrentPosition((pos)=>{
      const {latitude, longitude} = pos.coords
      setAddress(`lat:${latitude.toFixed(4)}, lng:${longitude.toFixed(4)}`)
      setLocationActive(true)
      setLocationAllowed(true)
    }, ()=>{
      setLocationAllowed(false)
    })
  }

  React.useEffect(()=>{ askGeo() }, [])

  const handleSubmit = async (e)=>{
    e.preventDefault()
    if(!phone || !password || !hardware || !owner) {
      alert('Please fill all mandatory fields')
      return
    }
    if(!locationActive && !address) {
      alert('Please provide location information')
      return
    }
    try{
      // make a synthetic email because firebase needs an email
      const email = `${phone}@sponge.local`
      const userCred = await createUserWithEmailAndPassword(auth, email, password)
      const uid = userCred.user.uid
      await setDoc(doc(db,'vendors',uid),{
        phone, hardware, owner, address, uid
      })
      navigate('/products')
    }catch(err){
      alert(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-8 items-center w-full">
        {/* Left Panel - Branding */}
        <div className="hidden lg:block bg-gradient-to-br from-teal-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative z-10 space-y-6">
            <div className="space-y-2">
              <div className="text-sm font-medium opacity-90">Welcome to</div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto lg:mx-0">
                <span className="text-2xl">🧽</span>
              </div>
              <h1 className="text-3xl font-bold">SMZ Enterprise</h1>
            </div>
            <p className="text-sm opacity-90 leading-relaxed">
              Join our network of hardware stores and streamline your sponge ordering process. 
              Fast, reliable, and designed for your business needs.
            </p>
            <div className="text-xs opacity-75">
              <div>--SMZ</div>
            </div>
          </div>
        </div>

        {/* Right Panel - Registration Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full">
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={()=>navigate('/')} 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </button>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">Create your account</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Phone Number - Mandatory */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <input 
                value={phone} 
                onChange={e=>setPhone(e.target.value)} 
                placeholder="Enter your phone number" 
                className="w-full p-3 border-b-2 border-gray-200 focus:border-teal-500 focus:outline-none transition-colors" 
                required
              />
            </div>

            {/* Owner Name - Mandatory */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name *</label>
              <input 
                value={owner} 
                onChange={e=>setOwner(e.target.value)} 
                placeholder="Enter owner name" 
                className="w-full p-3 border-b-2 border-gray-200 focus:border-teal-500 focus:outline-none transition-colors" 
                required
              />
            </div>

            {/* Hardware Name - Mandatory */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hardware Name *</label>
              <input 
                value={hardware} 
                onChange={e=>setHardware(e.target.value)} 
                placeholder="Enter hardware store name" 
                className="w-full p-3 border-b-2 border-gray-200 focus:border-teal-500 focus:outline-none transition-colors" 
                required
              />
            </div>

            {/* Password - Mandatory */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
              <input 
                value={password} 
                onChange={e=>setPassword(e.target.value)} 
                placeholder="Enter your password" 
                type="password" 
                className="w-full p-3 border-b-2 border-gray-200 focus:border-teal-500 focus:outline-none transition-colors" 
                required
              />
            </div>

            {/* Location Section */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Location</label>
              
              {locationAllowed && locationActive ? (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-green-800">Location is Active</span>
                </div>
              ) : (
                <div>
                  <input 
                    value={address} 
                    onChange={e=>setAddress(e.target.value)} 
                    placeholder="Enter location manually" 
                    className="w-full p-3 border-b-2 border-gray-200 focus:border-teal-500 focus:outline-none transition-colors" 
                  />
                  <p className="text-xs text-gray-500 mt-1">GPS location not available. Please enter manually.</p>
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <button 
                type="submit" 
                className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                Sign Up
              </button>
              <button 
                type="button" 
                onClick={()=>navigate('/login')} 
                className="flex-1 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-gray-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
