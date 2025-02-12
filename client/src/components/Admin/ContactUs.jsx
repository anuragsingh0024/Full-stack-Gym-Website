import React, { useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '../../utils/axiosInstance'
import toast from 'react-hot-toast';
import {formatDate} from '../../utils/formateDate'
import Loader from '../common/Loader';

const ContactUsList = () => {
  const [contacts, setContacts] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleDelete = async (id) => {
    const toastId = toast.loading("Deleting contact..."); // Show loading toast
       try{
           setIsDeleting(true)
           const response = await axiosInstance.delete(`/admin/contact/delete-contact/${id}`, {withCredentials: true})
           console.log(response.data.message)
           toast.success(response.data.message, {id: toastId})
           setContacts(contacts.filter((contact)=> contact._id!==id))
           setIsDeleting(false)
       } catch(err){
        toast.error("Failed to delete message!!", {id: toastId})
              console.log(err)
              setIsDeleting(false)
       } finally { setIsDeleting(false)}
  }

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setIsLoading(true)
        const response = await axiosInstance.get('/admin/contact/allContact', {withCredentials: true});
        setContacts(response.data.allContact);
        setIsLoading(false)
      } catch (error) {
                console.error('Error fetching contact inquiries:', error);
                setIsLoading(false)
      }
    };
    fetchContacts();
  }, []);


  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gray-900">
        <Loader />
      </div>
    );
  }

  const  sendGmail = (email, name) =>  {
    const recipient = email;
    const subject = "Re: For contact in our gym";
    const body = `Hello, ${name}\n\nThis is response From our gym.\n\nBest Regards,`;
    
    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipient)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open Gmail in a new tab
    window.open(gmailLink, "_blank");
}

  return (
    <div className="p-6 bg-purje-greys-900 w-full text-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold mb-6 text-center text-caribbeangreen-400">Contact Us Messages</h2>
      <div className="space-y-4">
        {contacts.length > 0 ? (
          contacts.map((contact) => (
            <div key={contact._id} className="p-4 bg-pure-greys-800 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <h3 className="text-xl font-bold text-caribbeangreen-400">{contact.name}</h3>
              <p className="text-pure-greys-400">{contact.email}</p>
              <p className="mt-2 text-pure-greys-300">{contact.message}</p>
              <p className='mt-4 text-pure-greys-300'>ON: {formatDate(contact.createdAt)}</p>
              <div className='flex justify-between mt-5'>
                <button
                onClick={()=> {
                  sendGmail(contact.email, contact.name)
                }}
                className='bg-yellow-300 px-4 py-2 rounded-md font-semibold text-md'>Reply</button>
                <button
                disabled = {isDeleting}
                onClick={()=> handleDelete(contact._id)}
                className='bg-brown-700 px-4 py-2 rounded-md font-semibold text-md'>Delete</button>
              </div>
            </div>
            
          ))
        ) : (
          <p className="text-center  text-pure-greys-400">No messages found</p>
        )}
      </div>
    </div>
  );
};

export default ContactUsList;
