import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { z } from 'zod';

const emailSchema = z.string().email('Geçerli bir email adresi girin');
const passwordSchema = z.string().min(6, 'Şifre en az 6 karakter olmalı');
const nameSchema = z.string().min(2, 'İsim en az 2 karakter olmalı');

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string }>({});
  
  const { signIn, signUp, signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string; name?: string } = {};
    
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }
    
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0].message;
    }
    
    if (!isLogin) {
      const nameResult = nameSchema.safeParse(fullName);
      if (!nameResult.success) {
        newErrors.name = nameResult.error.errors[0].message;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Email veya şifre hatalı');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Giriş başarılı!');
          navigate('/');
        }
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('Bu email zaten kayıtlı');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Kayıt başarılı! Hoş geldiniz.');
          navigate('/');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      toast.error('Google ile giriş yapılamadı');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4" style={{ background: 'var(--gradient-hero)' }}>
      <div className="w-full max-w-md animate-scale-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center mx-auto shadow-glow animate-pulse-glow">
            <Trophy className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold mt-4 gradient-text">Qors</h1>
          <p className="text-muted-foreground mt-2">Halı saha sosyal platformu</p>
        </div>

        {/* Auth Card */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-card">
          {/* Tab Switcher */}
          <div className="flex gap-2 mb-8">
            <button
              onClick={() => { setIsLogin(true); setErrors({}); }}
              className={cn(
                "flex-1 py-3 rounded-xl font-semibold transition-all",
                isLogin ? "bg-primary text-primary-foreground shadow-glow" : "bg-surface text-muted-foreground hover:bg-surface-hover"
              )}
            >
              Giriş Yap
            </button>
            <button
              onClick={() => { setIsLogin(false); setErrors({}); }}
              className={cn(
                "flex-1 py-3 rounded-xl font-semibold transition-all",
                !isLogin ? "bg-primary text-primary-foreground shadow-glow" : "bg-surface text-muted-foreground hover:bg-surface-hover"
              )}
            >
              Kayıt Ol
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name (only for signup) */}
            {!isLogin && (
              <div className="animate-fade-in">
                <label className="block text-sm font-medium mb-2">Ad Soyad</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ahmet Yılmaz"
                    className={cn(
                      "w-full pl-12 pr-4 py-3 bg-surface border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all",
                      errors.name ? "border-destructive" : "border-border focus:border-primary"
                    )}
                  />
                </div>
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@email.com"
                  className={cn(
                    "w-full pl-12 pr-4 py-3 bg-surface border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all",
                    errors.email ? "border-destructive" : "border-border focus:border-primary"
                  )}
                />
              </div>
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2">Şifre</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={cn(
                    "w-full pl-12 pr-12 py-3 bg-surface border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all",
                    errors.password ? "border-destructive" : "border-border focus:border-primary"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-base font-semibold"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-sm text-muted-foreground">veya</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Google Sign In */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full h-12"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google ile devam et
          </Button>

          {/* Info Text */}
          <p className="text-xs text-center text-muted-foreground mt-6">
            {isLogin ? (
              <>Hesabınız yok mu? <button onClick={() => setIsLogin(false)} className="text-primary hover:underline">Kayıt olun</button></>
            ) : (
              <>Zaten hesabınız var mı? <button onClick={() => setIsLogin(true)} className="text-primary hover:underline">Giriş yapın</button></>
            )}
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Devam ederek <button className="text-primary hover:underline">Kullanım Şartları</button>'nı ve <button className="text-primary hover:underline">Gizlilik Politikası</button>'nı kabul etmiş olursunuz.
        </p>
      </div>
    </div>
  );
}
