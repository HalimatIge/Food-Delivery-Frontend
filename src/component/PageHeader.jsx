// components/PageHeader.jsx
import { useNavigate } from "react-router-dom";

const PageHeader = ({ 
  title, 
  showBackButton = true, 
  backButtonText = "",
  className = "",
  children 
}) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className={`flex items-center justify-between mb-6 ${className}`}>
      <div className="flex items-center gap-4">
        {showBackButton && (
            <button
    onClick={handleGoBack}
    className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
    title="Go back"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  </button>
        )}
        <h1 className="text-2xl font-bold text-[#FF4C29]">{title}</h1>
      </div>
      {children}
    </div>
  );
};

export default PageHeader;