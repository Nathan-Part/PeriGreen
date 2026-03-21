import { useMemo, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CalendarDays, GraduationCap, IdCard, KeyRound, Mail, Save, ShieldCheck, UserRound } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';
import { updateMyProfile } from '../services/api';

const profileSchema = z
  .object({
    fullName: z.string().min(2, 'Le nom complet est requis'),
    email: z.string().email('Adresse email invalide'),
    universityId: z.string().min(3, "L'identifiant universitaire est requis"),
    currentPassword: z.string().optional(),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const wantsPasswordChange = Boolean(data.password);

    if (wantsPasswordChange && (!data.password || data.password.length < 6)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['password'],
        message: 'Le nouveau mot de passe doit contenir au moins 6 caracteres',
      });
    }

    if (wantsPasswordChange && !data.currentPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['currentPassword'],
        message: 'Le mot de passe actuel est requis',
      });
    }

    if (wantsPasswordChange && data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['confirmPassword'],
        message: 'La confirmation du mot de passe ne correspond pas',
      });
    }
  });

type ProfileFormData = z.infer<typeof profileSchema>;

export default function MyProfile() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const accountCreatedAt = useMemo(() => {
    if (!user?.createdAt) {
      return 'Non renseignee';
    }

    return new Date(user.createdAt).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }, [user?.createdAt]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(profileSchema) as any,
    values: {
      fullName: user?.fullName ?? '',
      email: user?.email ?? '',
      universityId: user?.universityId ?? '',
      currentPassword: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsSaving(true);
    setFeedback(null);

    try {
      const updatedUser = await updateMyProfile({
        fullName: data.fullName,
        email: data.email,
        universityId: data.universityId,
        currentPassword: data.currentPassword || undefined,
        password: data.password || undefined,
      });

      setUser(updatedUser);
      reset({
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        universityId: updatedUser.universityId,
        currentPassword: '',
        password: '',
        confirmPassword: '',
      });
      setFeedback({ type: 'success', text: 'Votre compte a ete mis a jour avec succes.' });
    } catch (error) {
      setFeedback({ type: 'error', text: (error as Error).message });
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Mon compte</h1>
          <p className="mt-2 text-gray-500">
            Modifiez vos informations personnelles et securisez votre acces.
          </p>
        </div>

        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate(user.roles?.includes('ROLE_ADMIN') ? '/dashboard' : '/espace')}
        >
          Retour au tableau de bord
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.35fr]">
        <Card className="border-none bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Resume du compte</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ProfileStat icon={<UserRound size={18} />} label="Nom complet" value={user.fullName} />
            <ProfileStat icon={<Mail size={18} />} label="Email" value={user.email} />
            <ProfileStat icon={<GraduationCap size={18} />} label="Identifiant universite" value={user.universityId} />
            <ProfileStat icon={<ShieldCheck size={18} />} label="Role" value={user.role === 'ADMIN' ? 'Administrateur' : 'Etudiant'} />
            <ProfileStat icon={<IdCard size={18} />} label="Identifiant interne" value={`#${user.id}`} />
            <ProfileStat icon={<CalendarDays size={18} />} label="Compte cree le" value={accountCreatedAt} />
          </CardContent>
        </Card>

        <Card className="border-none bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Modifier mes informations</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {feedback && (
                <div
                  className={`rounded-2xl border px-4 py-3 text-sm ${
                    feedback.type === 'success'
                      ? 'border-green-200 bg-green-50 text-green-700'
                      : 'border-red-200 bg-red-50 text-red-700'
                  }`}
                >
                  {feedback.text}
                </div>
              )}

              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="Nom complet"
                  error={errors.fullName?.message}
                  input={<input {...register('fullName')} className={inputClassName} />}
                />
                <Field
                  label="Email"
                  error={errors.email?.message}
                  input={<input type="email" {...register('email')} className={inputClassName} />}
                />
                <Field
                  label="Identifiant universite"
                  error={errors.universityId?.message}
                  input={<input {...register('universityId')} className={inputClassName} />}
                />
              </div>

              <div className="rounded-3xl border border-gray-100 bg-gray-50 p-5">
                <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <KeyRound size={16} className="text-primary-600" />
                  Changer mon mot de passe
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    label="Mot de passe actuel"
                    error={errors.currentPassword?.message}
                    input={<input type="password" {...register('currentPassword')} className={inputClassName} />}
                  />
                  <div />
                  <Field
                    label="Nouveau mot de passe"
                    error={errors.password?.message}
                    input={<input type="password" {...register('password')} className={inputClassName} />}
                  />
                  <Field
                    label="Confirmer le nouveau mot de passe"
                    error={errors.confirmPassword?.message}
                    input={<input type="password" {...register('confirmPassword')} className={inputClassName} />}
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    reset({
                      fullName: user.fullName,
                      email: user.email,
                      universityId: user.universityId,
                      currentPassword: '',
                      password: '',
                      confirmPassword: '',
                    })
                  }
                >
                  Reinitialiser
                </Button>
                <Button type="submit" isLoading={isSaving} disabled={!isDirty && !isSaving}>
                  <Save size={16} className="mr-2" />
                  Enregistrer les modifications
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const inputClassName =
  'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20';

function Field({
  label,
  input,
  error,
}: {
  label: string;
  input: ReactNode;
  error?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500">
        {label}
      </label>
      {input}
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function ProfileStat({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
      <div className="mt-0.5 text-primary-600">{icon}</div>
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{label}</p>
        <p className="mt-1 text-sm font-medium text-gray-800">{value}</p>
      </div>
    </div>
  );
}
