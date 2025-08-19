'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, LogIn, Languages } from 'lucide-react';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';

// Login Page Content Component (with language context)
function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { currentLang, setLanguage, t, isRTL } = useLanguage();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/admin');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/admin');
      } else {
        setError(data.error || t('auth.invalidCredentials'));
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(t('messages.networkError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-[#00808A]/5 to-[#00234E]/5 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-md w-full space-y-8 p-8">
        {/* Language Switcher */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLanguage(currentLang === 'ar' ? 'en' : 'ar')}
            className="mb-4 font-readex"
          >
            <Languages className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {currentLang === 'ar' ? 'English' : 'عربي'}
          </Button>
        </div>
        
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#00234E] font-readex">NIEPD CMS</h1>
          <p className="mt-2 text-gray-600 font-readex">{currentLang === 'ar' ? 'نظام إدارة المحتوى' : 'Content Management System'}</p>
        </div>

        <Card className="border-2 border-[#00808A]/10 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-[#00234E] font-readex">{t('auth.loginTitle')}</CardTitle>
            <CardDescription className="font-readex">
              {t('auth.loginSubtitle')}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription className="font-readex">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="font-readex">{t('auth.usernameOrEmail')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={currentLang === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                  required
                  disabled={isLoading}
                  className={`font-readex ${isRTL ? 'text-right' : 'text-left'}`}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="font-readex">{t('auth.password')}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={currentLang === 'ar' ? 'أدخل كلمة المرور' : 'Enter your password'}
                    required
                    disabled={isLoading}
                    className={`font-readex ${isRTL ? 'text-right pr-10' : 'text-left'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute inset-y-0 ${isRTL ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center text-gray-400 hover:text-gray-600`}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#00808A] to-[#006b74] hover:from-[#006b74] hover:to-[#00808A] font-readex"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className={`animate-spin rounded-full h-4 w-4 border-b-2 border-white ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {t('loading')}
                  </>
                ) : (
                  <>
                    <LogIn className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {t('auth.login')}
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-[#00808A]/5 rounded-lg border border-[#00808A]/20">
              <h3 className="text-sm font-medium text-[#00234E] font-readex">{currentLang === 'ar' ? 'بيانات التجربة:' : 'Demo Credentials:'}</h3>
              <p className="text-sm text-[#00808A] mt-1 font-readex">
                {currentLang === 'ar' ? 'البريد:' : 'Email:'} admin@niepd.sa<br />
                {currentLang === 'ar' ? 'كلمة المرور:' : 'Password:'} admin123
              </p>
              <p className="text-xs text-[#006b74] mt-2 font-readex">
                {currentLang === 'ar' 
                  ? 'ملاحظة: سيتم إنشاء هذه البيانات تلقائياً عند تشغيل قاعدة البيانات.'
                  : 'Note: These will be created automatically when you first run the database migrations.'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Main LoginPage component with LanguageProvider
export default function LoginPage() {
  return (
    <LanguageProvider>
      <LoginContent />
    </LanguageProvider>
  );
}
