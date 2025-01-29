import LoaderAnimation from '../../../public/Loading1.gif'

export default function Loader(){
    return( 
        <div className='w-[100%]  flex justify-center ' >
        <img className='flex items-center justify-center  ' src={LoaderAnimation} alt='Loading Animation' />
        </div>
    )
}