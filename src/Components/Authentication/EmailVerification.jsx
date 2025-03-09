import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import axios from '../../api/axios';
import useAuth from '../../hooks/useAuth';

const VerificationEmail = () => {
    const { verification_data_uid } = useParams();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [verificationState, setVerificationState] = useState('verifying'); // 'verifying', 'success', 'failed'

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await axios.post(`/api/email-verify/${verification_data_uid}/`);

                if (response.status === 200) {
                    setVerificationState('success');
                    logout();
                    // Redirect after showing success animation for 3 seconds
                    setTimeout(() => {
                        navigate('/auth/signin/loginmail');
                    }, 5000);
                } else {
                    setVerificationState('failed');
                }
            } catch (error) {
                console.error('Email verification failed:', error);
                setVerificationState('failed');
            }
        };

        verifyEmail();
    }, [verification_data_uid, navigate, logout]);

    return (
        <Box className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <Box className="p-8 bg-white rounded-lg shadow-md text-center w-full max-w-md">
                {verificationState === 'verifying' && (
                    <>
                        <CircularProgress size={60} className="mb-4" />
                        <Typography variant="h5" className="text-gray-800 font-medium">
                            Verifying Your Email
                        </Typography>
                        <Typography variant="body1" className="mt-2 text-gray-600">
                            Please wait while we verify your email address...
                        </Typography>
                    </>
                )}

                {verificationState === 'success' && (
                    <div className="transition-all duration-500 animate-fade-in">
                        <CheckCircleIcon className="text-green-500 mb-4" style={{ fontSize: 80 }} />
                        <Typography variant="h5" className="text-gray-800 font-medium">
                            Email Verified Successfully!
                        </Typography>
                        <Typography variant="body1" className="mt-2 text-gray-600">
                            Thank you for verifying your email address. Redirecting you to login...
                        </Typography>
                    </div>
                )}

                {verificationState === 'failed' && (
                    <>
                        <ErrorIcon className="text-red-500 mb-4" style={{ fontSize: 80 }} />
                        <Typography variant="h5" className="text-gray-800 font-medium">
                            Verification Failed
                        </Typography>
                        <Typography variant="body1" className="mt-2 text-gray-600">
                            We couldn&apos;t verify your email address. Please try again or contact support.
                        </Typography>
                    </>
                )}
            </Box>
        </Box>
    );
};

export default VerificationEmail;