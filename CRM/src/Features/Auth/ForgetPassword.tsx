import React, { useState } from 'react';
import { Mail, Phone, Lock, ArrowLeft, CheckCircle, User } from 'lucide-react';

enum ResetStage {
  CONTACT_INFO,
  OTP,
  NEW_PASSWORD,
  SUCCESS
}

enum ContactMethod {
  EMAIL,
  PHONE
}

const ForgotPassword: React.FC = () => {
  const [stage, setStage] = useState<ResetStage>(ResetStage.CONTACT_INFO);
  const [contactMethod, setContactMethod] = useState<ContactMethod>(ContactMethod.EMAIL);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // Get the contact info based on selected method
  const getContactInfo = () => {
    return contactMethod === ContactMethod.EMAIL ? email : phone;
  };

  // Generate a random OTP
  const generateOTP = () => {
    // Generate a 6-digit OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Mock function to request OTP
  const requestOTP = async () => {
    setLoading(true);
    setOtpSent(false);
    // In a real application, this would be an API call to your backend
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const contactInfo = getContactInfo();
      
      // Generate a new OTP
      const newOTP = generateOTP();
      setGeneratedOTP(newOTP);
      
      // In a real implementation, this would send an actual OTP to the email or phone
      if (contactMethod === ContactMethod.EMAIL) {
        console.log(`OTP sent to email: ${contactInfo}, OTP: ${newOTP}`);
        // API call to send email with OTP would go here
      } else {
        console.log(`OTP sent to phone: ${contactInfo}, OTP: ${newOTP}`);
        // API call to send SMS with OTP would go here
      }
      
      setOtpSent(true);
      setStage(ResetStage.OTP);
      setError('');
    } catch (err) {
      setError('Failed to send verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle OTP verification - now skips validation
  const verifyOTP = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set username to the contact info by default
      setUsername(getContactInfo());
      
      // Skip validation and proceed directly to password reset
      setStage(ResetStage.NEW_PASSWORD);
      setError('');
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Mock function to reset password
  const resetPassword = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const contactInfo = getContactInfo();
      console.log(`Password reset for user: ${username}, ${contactMethod === ContactMethod.EMAIL ? 'email' : 'phone'}: ${contactInfo}`);
      setStage(ResetStage.SUCCESS);
      setError('');
    } catch (err) {
      setError('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleContactInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (contactMethod === ContactMethod.EMAIL) {
      if (!email) {
        setError('Please enter your email address');
        return;
      }
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Please enter a valid email address');
        return;
      }
    } else {
      if (!phone) {
        setError('Please enter your phone number');
        return;
      }
      // Basic phone validation (adjust based on your requirements)
      const phoneRegex = /^\d{10,15}$/;
      if (!phoneRegex.test(phone.replace(/[^0-9]/g, ''))) {
        setError('Please enter a valid phone number');
        return;
      }
    }
    
    requestOTP();
  };

  const handleOTPSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setError('Please enter the verification code');
      return;
    }
    if (otp.length < 6) {
      setError('Verification code must be 6 digits');
      return;
    }
    verifyOTP();
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) {
      setError('Please enter your username');
      return;
    }
    if (!password) {
      setError('Please enter a new password');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    resetPassword();
  };

  const goBack = () => {
    if (stage === ResetStage.OTP) {
      setStage(ResetStage.CONTACT_INFO);
    } else if (stage === ResetStage.NEW_PASSWORD) {
      setStage(ResetStage.OTP);
    }
    setError('');
  };

  const renderContactMethodToggle = () => (
    <div className="flex rounded-md overflow-hidden border border-gray-300 mb-6">
      <button
        type="button"
        onClick={() => setContactMethod(ContactMethod.EMAIL)}
        className={`flex-1 py-2 px-4 flex items-center justify-center gap-2 ${
          contactMethod === ContactMethod.EMAIL 
            ? 'bg-blue-600 text-white' 
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
      >
        <Mail className="h-4 w-4" />
        <span>Email</span>
      </button>
      <button
        type="button"
        onClick={() => setContactMethod(ContactMethod.PHONE)}
        className={`flex-1 py-2 px-4 flex items-center justify-center gap-2 ${
          contactMethod === ContactMethod.PHONE 
            ? 'bg-blue-600 text-white' 
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
      >
        <Phone className="h-4 w-4" />
        <span>Phone</span>
      </button>
    </div>
  );

  const renderContactInfoForm = () => (
    <form onSubmit={handleContactInfoSubmit} className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Forgot Password</h2>
        <p className="text-gray-600 mt-2">Reset your password using email or phone number</p>
      </div>
      
      {renderContactMethodToggle()}
      
      {contactMethod === ContactMethod.EMAIL ? (
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email address"
          />
        </div>
      ) : (
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Phone number"
          />
        </div>
      )}
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex justify-center items-center"
      >
        {loading ? (
          <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
        ) : (
          'Send Verification Code'
        )}
      </button>
      
      <div className="text-center mt-4">
        <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">
          Back to Login
        </a>
      </div>
    </form>
  );

  const renderOTPForm = () => (
    <form onSubmit={handleOTPSubmit} className="space-y-4">
      <div className="flex items-center mb-6">
        <button 
          type="button" 
          onClick={goBack}
          className="p-2 mr-2 rounded-full hover:bg-gray-200"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Enter Verification Code</h2>
          <p className="text-gray-600 mt-1">
            We've sent a code to {contactMethod === ContactMethod.EMAIL ? email : phone}
          </p>
        </div>
      </div>
      
      {otpSent && (
        <div className="mb-4 p-4 bg-green-100 border border-green-200 text-green-700 rounded-md">
          <p className="font-medium">Verification code has been sent to your {contactMethod === ContactMethod.EMAIL ? 'email' : 'phone'}</p>
          <p className="mt-2 text-red-600 font-medium">
            DO NOT share this OTP with anyone for security reasons.
          </p>
        </div>
      )}
      
      <div>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter verification code"
          maxLength={6}
          pattern="\d{6}"
        />
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex justify-center items-center"
      >
        {loading ? (
          <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
        ) : (
          'Verify Code'
        )}
      </button>
      
      <div className="text-center mt-4">
        <button 
          type="button"
          onClick={requestOTP}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          Didn't receive a code? Resend
        </button>
      </div>
    </form>
  );

  const renderNewPasswordForm = () => (
    <form onSubmit={handlePasswordSubmit} className="space-y-4">
      <div className="flex items-center mb-6">
        <button 
          type="button" 
          onClick={goBack}
          className="p-2 mr-2 rounded-full hover:bg-gray-200"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Create New Password</h2>
          <p className="text-gray-600 mt-1">Your new password must be different from previous passwords</p>
        </div>
      </div>
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <User className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Username"
        />
        <p className="text-xs text-gray-500 mt-1 ml-1">
          We've pre-filled this with your {contactMethod === ContactMethod.EMAIL ? 'email' : 'phone number'}
        </p>
      </div>
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Lock className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="New password"
        />
      </div>
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Lock className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Confirm new password"
        />
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex justify-center items-center"
      >
        {loading ? (
          <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
        ) : (
          'Reset Password'
        )}
      </button>
    </form>
  );

  const renderSuccessMessage = () => (
    <div className="text-center space-y-4">
      <div className="flex justify-center">
        <CheckCircle className="h-16 w-16 text-green-500" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800">Password Reset Successful</h2>
      <p className="text-gray-600">Your password has been reset successfully.</p>
      <div className="mt-2 p-4 bg-blue-50 border border-blue-100 rounded-md text-left">
        <p className="text-blue-800 font-medium">Account Information:</p>
        <p className="text-gray-700 mt-1">Username: <span className="font-semibold">{username}</span></p>
      </div>
      <button
        onClick={() => window.location.href = '/login'}
        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
      >
        Back to Login
      </button>
    </div>
  );

  const renderCurrentStage = () => {
    switch (stage) {
      case ResetStage.CONTACT_INFO:
        return renderContactInfoForm();
      case ResetStage.OTP:
        return renderOTPForm();
      case ResetStage.NEW_PASSWORD:
        return renderNewPasswordForm();
      case ResetStage.SUCCESS:
        return renderSuccessMessage();
      default:
        return renderContactInfoForm();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}
        {renderCurrentStage()}
      </div>
    </div>
  );
};

export default ForgotPassword;