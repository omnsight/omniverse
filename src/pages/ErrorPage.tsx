import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

export const ErrorPage = ({ message = "您没有权限访问此页面" }: { message?: string }) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-slate-900 text-slate-200">
      <AlertTriangle size={64} className="text-red-500 mb-4" />
      <h1 className="text-2xl font-bold mb-2">访问被拒绝</h1>
      <p className="text-lg mb-6">{message}</p>
      <div className="flex gap-4">
        <button
          onClick={handleGoBack}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors"
        >
          返回上一页
        </button>
        <button
          onClick={handleGoHome}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md transition-colors"
        >
          回到首页
        </button>
      </div>
    </div>
  );
};