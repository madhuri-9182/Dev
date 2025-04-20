import { useQuery } from "@tanstack/react-query"
import { useLocation } from "react-router-dom"
import { getVideo } from "./api";
import { ErrorState, LoadingState } from "../shared/loading-error-state";
import { getErrorMessage } from "../../utils/util";
import VideoPlayer from "../Client/Candidates/view-candidate-feedback/candidate-feedback/components/VideoPlayer";
import useRoleBasedNavigate from "../../hooks/useRoleBaseNavigate";
import { ArrowLeft } from "iconsax-react";

const Recording = () => {
    const navigateTo = useRoleBasedNavigate();
    const location = useLocation();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['recordings'],
        queryFn: () => getVideo(location.pathname.split("/")[2])
    });

    if (isLoading) return <LoadingState />
    if (isError) return <ErrorState message={getErrorMessage(error)} />

    const handleBack = () => {
        navigateTo('dashboard')
    }

    return (
        <div className="w-full max-w-5xl mx-auto px-4 py-8 md:px-6 lg:px-8 mt-6 lg:mt-10">
            <button
                className="flex items-center gap-x-2 text-sm font-medium text-gray-700 hover:text-gray-900 mb-6 transition-colors duration-200 group"
                title="Back"
                onClick={handleBack}
            >
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors duration-200">
                    <ArrowLeft size="16" color="currentColor" />
                </span>
                <span className="font-[550]">Back to Dashboard</span>
            </button>

            <div className="bg-white rounded-2xl border-2 border-[#066DDC] overflow-hidden mt-10">
                <div className="relative bg-gray-900 aspect-video">
                    <div className="absolute inset-0 flex items-center justify-center">
                        {!data?.data?.recording ? (
                            <p className="text-white text-lg">No recording available</p>
                        ) : (
                            <div className="w-full h-full">
                                <VideoPlayer url={data.data.recording} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Recording