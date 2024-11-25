import React from 'react'


function Page() {
  return (
    <div className='flex items-center justify-center w-full h-screen'>
        <div className='p-2 bg-red-200 w-full max-h-max flex items-center justify-center gap-x-20'>
            <div>
                <h1 className='text-5xl'>HIRING DOG</h1>
            </div>
            <div>
                <div className='card h-[600px] w-[485px] bg-green-200'>
                    <div>
                        <button>SignIn</button>
                        <button>SignUp</button>
                    </div>

                </div>
            </div>
        </div>
    </div>
  )
}

export default Page
