import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle, Mail } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return;
    }

    // Demo behavior: pretend we sent an email.
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-2">
              <Mail className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">Smart Waste</span>
            </div>
          </div>

          <h2 className="text-center text-2xl font-extrabold text-gray-900 mb-2">
            Reset your password
          </h2>
          <p className="text-center text-sm text-gray-600 mb-6">
            Enter your email and we will send a reset link (demo).
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 text-red-400 mr-2" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            </div>
          )}

          {submitted ? (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Check your email
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                If an account exists for {email}, you'll receive a reset link.
              </p>
              <button
                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors font-medium"
                onClick={() => navigate('/login')}
              >
                Back to login
              </button>
              <p className="mt-4 text-sm text-gray-600">
                <Link to="/login" className="text-green-600 hover:text-green-500">
                  Go to Login
                </Link>
              </p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your email"
                />
              </div>

              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Send reset link
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

