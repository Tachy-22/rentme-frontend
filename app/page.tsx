// import { redirect } from 'next/navigation';
// import { getCurrentUser } from '@/actions/auth/getCurrentUser';
// import Home from '@/components/Home';

// export default async function HomePage() {
//   const userResult = await getCurrentUser();
//   console.log({ userResult })
//   if (userResult.success && userResult.user) {
//     const user = userResult.user;
//     // Redirect based on user role
//     switch (user.role) {
//       case 'renter':
//         redirect('/dashboard');
//       case 'agent':
//         redirect('/agent/dashboard');
//       case 'admin':
//         redirect('/admin/dashboard');
//       default:
//         redirect('/dashboard');
//     }
//   }

//   // If no user, redirect to auth
//   <>
//     <Home />
//   </>
// }


import Home from '@/components/Home'
import React from 'react'

const page = () => {
  return (
    <div>    <Home />
    </div>
  )
}

export default page